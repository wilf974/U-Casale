import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  // Traiter l'événement
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      // Récupérer le type de paiement depuis les metadata
      const { type, reservationId, orderId } = session.metadata || {}

      if (type === "reservation" && reservationId) {
        // Mettre à jour la réservation
        await prisma.reservation.update({
          where: { id: reservationId },
          data: {
            paymentStatus: "paid",
            status: "confirmed",
            stripePaymentId: session.payment_intent as string,
          },
        })

        console.log(`Reservation ${reservationId} payment completed`)
      } else if (type === "order" && orderId) {
        // Mettre à jour la commande
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            stripePaymentId: session.payment_intent as string,
          },
        })

        console.log(`Order ${orderId} payment completed`)
      }

      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      console.error(`Payment failed: ${paymentIntent.id}`)

      // TODO: Gérer les échecs de paiement (envoyer email, notifier admin, etc.)

      break
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge

      // Trouver la réservation ou commande associée et mettre à jour le statut
      const reservation = await prisma.reservation.findFirst({
        where: { stripePaymentId: charge.payment_intent as string },
      })

      if (reservation) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            paymentStatus: "refunded",
            status: "cancelled",
          },
        })
      }

      const order = await prisma.order.findFirst({
        where: { stripePaymentId: charge.payment_intent as string },
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "refunded",
          },
        })
      }

      console.log(`Refund processed: ${charge.id}`)

      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
