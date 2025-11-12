import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ReservationStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")
    const giteId = searchParams.get("giteId")

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "start and end dates are required" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Si un giteId est fourni, récupérer ce gîte spécifique
    // Sinon, prendre le premier gîte disponible (compatibilité)
    let gite
    if (giteId) {
      gite = await prisma.gite.findUnique({
        where: { id: giteId },
      })
    } else {
      gite = await prisma.gite.findFirst({
        where: { available: true },
        orderBy: { displayOrder: "asc" },
      })
    }

    if (!gite) {
      return NextResponse.json(
        { error: "Gite not found" },
        { status: 404 }
      )
    }

    // Récupérer les réservations confirmées ou en attente pour CE gîte
    const reservations = await prisma.reservation.findMany({
      where: {
        giteId: gite.id,
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

    // Ajouter les dates bloquées du gîte
    const blockedDates = (gite.blockedDates as any[]) || []
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

    // Récupérer la config globale pour la taxe
    const giteConfig = await prisma.giteConfig.findFirst()

    return NextResponse.json({
      unavailableDates: [...new Set(unavailableDates)], // Retirer les doublons
      gite: {
        id: gite.id,
        name: gite.name,
        pricePerNight: gite.pricePerNight,
        minimumStay: gite.minimumStay,
        maxGuests: gite.maxGuests,
        cleaningFee: gite.cleaningFee,
        taxRate: giteConfig?.taxRate || 0,
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
