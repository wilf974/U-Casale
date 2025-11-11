import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { format } from "date-fns"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Generate CSV
    const headers = [
      "ID",
      "Date de création",
      "Check-in",
      "Check-out",
      "Nuits",
      "Personnes",
      "Prix par nuit",
      "Prix total",
      "Statut",
      "Statut paiement",
      "Prénom client",
      "Nom client",
      "Email client",
      "Téléphone client",
    ]

    const rows = reservations.map((r) => [
      r.id,
      format(new Date(r.createdAt), "dd/MM/yyyy HH:mm"),
      format(new Date(r.checkIn), "dd/MM/yyyy"),
      format(new Date(r.checkOut), "dd/MM/yyyy"),
      r.nights.toString(),
      r.guests.toString(),
      r.pricePerNight.toFixed(2),
      r.totalPrice.toFixed(2),
      r.status,
      r.paymentStatus,
      r.customer.firstName,
      r.customer.lastName,
      r.customer.email,
      r.customer.phone || "",
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const filename = `reservations_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting reservations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
