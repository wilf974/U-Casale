import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ReservationStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "start and end dates are required" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

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

    // Récupérer toutes les réservations confirmées ou en attente dans la période
    const reservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING],
        },
        OR: [
          {
            checkIn: {
              gte: start,
              lte: end,
            },
          },
          {
            checkOut: {
              gte: start,
              lte: end,
            },
          },
          {
            AND: [
              {
                checkIn: {
                  lte: start,
                },
              },
              {
                checkOut: {
                  gte: end,
                },
              },
            ],
          },
        ],
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
      },
    })

    // Construire un tableau de dates indisponibles
    const unavailableDates: string[] = []

    // Ajouter les dates des réservations
    reservations.forEach((reservation) => {
      const currentDate = new Date(reservation.checkIn)
      const endDate = new Date(reservation.checkOut)

      while (currentDate < endDate) {
        unavailableDates.push(currentDate.toISOString().split("T")[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    // Ajouter les dates bloquées de la configuration
    const blockedDates = (giteConfig.blockedDates as any[]) || []
    blockedDates.forEach((range: any) => {
      if (range.start && range.end) {
        const currentDate = new Date(range.start)
        const endDate = new Date(range.end)

        while (currentDate <= endDate) {
          unavailableDates.push(currentDate.toISOString().split("T")[0])
          currentDate.setDate(currentDate.getDate() + 1)
        }
      }
    })

    return NextResponse.json({
      unavailableDates: [...new Set(unavailableDates)], // Retirer les doublons
      giteConfig: {
        pricePerNight: giteConfig.pricePerNight,
        minimumStay: giteConfig.minimumStay,
        maxGuests: giteConfig.maxGuests,
        cleaningFee: giteConfig.cleaningFee,
        taxRate: giteConfig.taxRate,
      },
    })
  } catch (error) {
    console.error("Error fetching disponibilites:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
