import { NextResponse } from "next/server"
import { createReservationCheckoutSession } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { PaymentStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { reservationId } = body

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId is required" },
        { status: 400 }
      )
    }

    // Récupérer la réservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        customer: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }

    // Vérifier que la réservation n'est pas déjà payée
    if (reservation.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json(
        { error: "Reservation already paid" },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Créer la session Stripe
    const session = await createReservationCheckoutSession({
      reservationId: reservation.id,
      amount: reservation.totalPrice,
      customerEmail: reservation.customer.email,
      successUrl: `${siteUrl}/reservations/${reservationId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/reservations/${reservationId}/cancel`,
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
