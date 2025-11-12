import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Get loyalty account for customer
export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params

    // Find or create loyalty account
    let account = await prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    })

    if (!account) {
      // Auto-create loyalty account for customer
      account = await prisma.loyaltyAccount.create({
        data: {
          customerId,
          points: 0,
          totalEarned: 0,
          totalSpent: 0,
          tier: "BRONZE",
        },
        include: {
          transactions: true,
        },
      })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error("Error fetching loyalty account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
