import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      )
    }

    // Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Update order status
      const order = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      })

      // Update product stock
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id },
      })

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return NextResponse.json({
        success: true,
        order,
      })
    } else {
      return NextResponse.json(
        { error: "Paiement non confirmé" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la vérification du paiement" },
      { status: 500 }
    )
  }
}
