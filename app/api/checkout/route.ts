import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string | null
  slug: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cart, customer, shipping, total } = body

    // Validate cart items and check stock
    const productIds = cart.map((item: CartItem) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })

    // Check stock availability
    for (const cartItem of cart) {
      const product = products.find((p) => p.id === cartItem.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produit ${cartItem.name} introuvable` },
          { status: 400 }
        )
      }
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Find or create customer
    let dbCustomer = await prisma.customer.findUnique({
      where: { email: customer.email },
    })

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          country: customer.country,
        },
      })
    }

    // Generate order number
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Calculate totals
    const subtotal = cart.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    )

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: dbCustomer.id,
        subtotal,
        shipping,
        total,
        status: "PENDING",
        paymentStatus: "PENDING",
        shippingAddress: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          country: customer.country,
          phone: customer.phone,
        },
        orderItems: {
          create: cart.map((item: CartItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item: CartItem) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      ...(shipping > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: Math.round(shipping * 100),
                    currency: "eur",
                  },
                  display_name: "Livraison standard",
                },
              },
            ],
          }
        : {}),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/boutique/commande/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/boutique/commande/${order.id}/cancel`,
      client_reference_id: order.id,
      customer_email: customer.email,
      metadata: {
        orderId: order.id,
        orderNumber: orderNumber,
      },
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: session.id,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
      checkoutUrl: session.url,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    )
  }
}
