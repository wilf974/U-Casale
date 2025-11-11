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

    const orders = await prisma.order.findMany({
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
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
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
      "Numéro de commande",
      "Date de création",
      "Prénom client",
      "Nom client",
      "Email client",
      "Téléphone client",
      "Nombre d'articles",
      "Sous-total",
      "Frais de port",
      "TVA",
      "Réduction",
      "Total",
      "Statut",
      "Statut paiement",
      "Articles",
    ]

    const rows = orders.map((o) => [
      o.id,
      o.orderNumber,
      format(new Date(o.createdAt), "dd/MM/yyyy HH:mm"),
      o.customer.firstName,
      o.customer.lastName,
      o.customer.email,
      o.customer.phone || "",
      o.items.length.toString(),
      o.subtotal.toFixed(2),
      o.shippingCost.toFixed(2),
      o.taxAmount.toFixed(2),
      o.discountAmount.toFixed(2),
      o.total.toFixed(2),
      o.status,
      o.paymentStatus,
      o.items
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join("; "),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const filename = `commandes_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
