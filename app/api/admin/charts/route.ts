import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
import { fr } from "date-fns/locale"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get last 6 months of data
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i)
      months.push({
        date,
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: format(date, "MMM yyyy", { locale: fr }),
        shortLabel: format(date, "MMM", { locale: fr }),
      })
    }

    // Get data for each month in parallel
    const monthlyData = await Promise.all(
      months.map(async (month) => {
        const [reservations, reservationsRevenue, orders, ordersRevenue] = await Promise.all([
          // Count reservations
          prisma.reservation.count({
            where: {
              createdAt: {
                gte: month.start,
                lte: month.end,
              },
            },
          }),
          // Sum reservations revenue
          prisma.reservation.aggregate({
            where: {
              createdAt: {
                gte: month.start,
                lte: month.end,
              },
              paymentStatus: "PAID",
            },
            _sum: {
              totalPrice: true,
            },
          }),
          // Count orders
          prisma.order.count({
            where: {
              createdAt: {
                gte: month.start,
                lte: month.end,
              },
            },
          }),
          // Sum orders revenue
          prisma.order.aggregate({
            where: {
              createdAt: {
                gte: month.start,
                lte: month.end,
              },
              paymentStatus: "PAID",
            },
            _sum: {
              total: true,
            },
          }),
        ])

        return {
          month: month.label,
          shortMonth: month.shortLabel,
          reservations,
          orders,
          reservationsRevenue: reservationsRevenue._sum.totalPrice || 0,
          ordersRevenue: ordersRevenue._sum.total || 0,
          totalRevenue: (reservationsRevenue._sum.totalPrice || 0) + (ordersRevenue._sum.total || 0),
        }
      })
    )

    // Get category-wise product sales
    const categorySales = await prisma.category.findMany({
      include: {
        products: {
          include: {
            orderItems: {
              where: {
                order: {
                  paymentStatus: "PAID",
                },
              },
            },
          },
        },
      },
    })

    const categoryData = categorySales
      .map((category) => {
        const totalSales = category.products.reduce((sum, product) => {
          return sum + product.orderItems.reduce((itemSum, item) => itemSum + item.total, 0)
        }, 0)
        return {
          name: category.name,
          value: totalSales,
        }
      })
      .filter((cat) => cat.value > 0)
      .sort((a, b) => b.value - a.value)

    return NextResponse.json({
      monthlyData,
      categoryData,
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
