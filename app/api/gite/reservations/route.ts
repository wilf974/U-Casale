import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ReservationStatus, PaymentStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      checkIn,
      checkOut,
      guests,
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone,
      customerAddress,
      customerCity,
      customerPostalCode,
      customerCountry,
      notes,
    } = body

    // Validation
    if (!checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!customerEmail || !customerFirstName || !customerLastName) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      )
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // Vérifier que les dates sont valides
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      )
    }

    // Vérifier que les dates sont dans le futur
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (checkInDate < today) {
      return NextResponse.json(
        { error: "Check-in date must be in the future" },
        { status: 400 }
      )
    }

    // Récupérer la configuration du gîte
    const giteConfig = await prisma.giteConfig.findFirst({
      where: { id: "default" },
    })

    if (!giteConfig) {
      return NextResponse.json(
        { error: "Gite configuration not found" },
        { status: 404 }
      )
    }

    // Vérifier le nombre de personnes
    if (guests > giteConfig.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${giteConfig.maxGuests} guests allowed` },
        { status: 400 }
      )
    }

    // Calculer le nombre de nuits
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Vérifier le séjour minimum
    if (nights < giteConfig.minimumStay) {
      return NextResponse.json(
        { error: `Minimum stay is ${giteConfig.minimumStay} nights` },
        { status: 400 }
      )
    }

    // Vérifier les disponibilités (pas de réservation confirmée ou en attente qui chevauche)
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING],
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    })

    if (overlappingReservations.length > 0) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 400 }
      )
    }

    // Calculer le prix total
    const subtotal = nights * giteConfig.pricePerNight
    const cleaningFee = giteConfig.cleaningFee
    const taxAmount = (subtotal + cleaningFee) * giteConfig.taxRate
    const totalPrice = subtotal + cleaningFee + taxAmount

    // Créer ou récupérer le client
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          firstName: customerFirstName,
          lastName: customerLastName,
          phone: customerPhone || null,
          address: customerAddress || null,
          city: customerCity || null,
          postalCode: customerPostalCode || null,
          country: customerCountry || "France",
        },
      })
    } else {
      // Mettre à jour les informations si nécessaire
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          firstName: customerFirstName,
          lastName: customerLastName,
          phone: customerPhone || customer.phone,
          address: customerAddress || customer.address,
          city: customerCity || customer.city,
          postalCode: customerPostalCode || customer.postalCode,
          country: customerCountry || customer.country,
        },
      })
    }

    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        nights,
        pricePerNight: giteConfig.pricePerNight,
        totalPrice,
        status: ReservationStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        notes: notes || null,
        customerId: customer.id,
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        nights: reservation.nights,
        totalPrice: reservation.totalPrice,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
      },
      pricing: {
        subtotal,
        cleaningFee,
        taxAmount,
        totalPrice,
        nights,
        pricePerNight: giteConfig.pricePerNight,
      },
    })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
