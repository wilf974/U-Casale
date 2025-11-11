import { NextResponse } from "next/server"
import { createOrderCheckoutSession } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      )
    }

    // Récupérer la commande avec les items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Vérifier que la commande n'est pas déjà payée
    if (order.status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Préparer les items pour Stripe
    const items = order.items.map((item) => ({
      name: item.product.name,
      description: item.product.description,
      amount: item.price,
      quantity: item.quantity,
      images: item.product.images.length > 0 ? [item.product.images[0]] : [],
    }))

    // Créer la session Stripe
    const session = await createOrderCheckoutSession({
      orderId: order.id,
      items,
      customerEmail: order.customer.email,
      successUrl: `${siteUrl}/orders/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/orders/${orderId}/cancel`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
