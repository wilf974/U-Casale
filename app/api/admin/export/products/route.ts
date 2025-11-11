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

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    // Generate CSV
    const headers = [
      "ID",
      "Nom",
      "Slug",
      "Catégorie",
      "Prix",
      "Prix comparé",
      "Coût",
      "Stock",
      "Publié",
      "En vedette",
      "Date de création",
      "Dernière mise à jour",
    ]

    const rows = products.map((p) => [
      p.id,
      p.name,
      p.slug,
      p.category.name,
      p.price.toFixed(2),
      p.compareAtPrice ? p.compareAtPrice.toFixed(2) : "",
      p.cost ? p.cost.toFixed(2) : "",
      p.stock.toString(),
      p.published ? "Oui" : "Non",
      p.featured ? "Oui" : "Non",
      format(new Date(p.createdAt), "dd/MM/yyyy HH:mm"),
      format(new Date(p.updatedAt), "dd/MM/yyyy HH:mm"),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const filename = `produits_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
