import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { ReservationStatus, PaymentStatus, OrderStatus } from "@prisma/client"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all stats in parallel
    const [
      totalReservations,
      confirmedReservations,
      pendingReservations,
      reservationsRevenue,
      totalOrders,
      processingOrders,
      shippedOrders,
      ordersRevenue,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      totalCategories,
      activePromoCodes,
      recentReservations,
      recentOrders,
    ] = await Promise.all([
      // Reservations stats
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: ReservationStatus.CONFIRMED } }),
      prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
      prisma.reservation.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { totalPrice: true },
      }),

      // Orders stats
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { total: true },
      }),

      // Products stats
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lt: 10 } } }),

      // Customers stats
      prisma.customer.count(),

      // Categories stats
      prisma.category.count(),

      // Promo codes stats
      prisma.promoCode.count({ where: { active: true } }),

      // Recent activity
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),

      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ])

    const totalRevenue = (reservationsRevenue._sum.totalPrice || 0) + (ordersRevenue._sum.total || 0)

    return NextResponse.json({
      reservations: {
        total: totalReservations,
        confirmed: confirmedReservations,
        pending: pendingReservations,
        revenue: reservationsRevenue._sum.totalPrice || 0,
      },
      orders: {
        total: totalOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        revenue: ordersRevenue._sum.total || 0,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      customers: {
        total: totalCustomers,
      },
      categories: {
        total: totalCategories,
      },
      promoCodes: {
        active: activePromoCodes,
      },
      revenue: {
        total: totalRevenue,
        reservations: reservationsRevenue._sum.totalPrice || 0,
        orders: ordersRevenue._sum.total || 0,
      },
      recentActivity: {
        reservations: recentReservations,
        orders: recentOrders,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
