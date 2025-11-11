import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { format } from "date-fns"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
            orders: true,
          },
        },
        reservations: {
          where: {
            paymentStatus: "PAID",
          },
          select: {
            totalPrice: true,
          },
        },
        orders: {
          where: {
            paymentStatus: "PAID",
          },
          select: {
            total: true,
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
      "Date d'inscription",
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Adresse",
      "Code postal",
      "Ville",
      "Pays",
      "Nombre de réservations",
      "Nombre de commandes",
      "Total dépensé (réservations)",
      "Total dépensé (commandes)",
      "Total dépensé",
    ]

    const rows = customers.map((c) => {
      const reservationsTotal = c.reservations.reduce(
        (sum, r) => sum + r.totalPrice,
        0
      )
      const ordersTotal = c.orders.reduce((sum, o) => sum + o.total, 0)
      const totalSpent = reservationsTotal + ordersTotal

      return [
        c.id,
        format(new Date(c.createdAt), "dd/MM/yyyy HH:mm"),
        c.firstName,
        c.lastName,
        c.email,
        c.phone || "",
        c.address || "",
        c.postalCode || "",
        c.city || "",
        c.country || "",
        c._count.reservations.toString(),
        c._count.orders.toString(),
        reservationsTotal.toFixed(2),
        ordersTotal.toFixed(2),
        totalSpent.toFixed(2),
      ]
    })

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const filename = `clients_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting customers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
