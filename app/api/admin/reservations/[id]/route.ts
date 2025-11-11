import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ReservationStatus, PaymentStatus } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, paymentStatus, notes } = body

    const updateData: any = {}

    if (status && Object.values(ReservationStatus).includes(status)) {
      updateData.status = status
    }

    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
      },
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.reservation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
