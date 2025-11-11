import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get or create settings
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "U Casale",
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      address,
      facebookUrl,
      instagramUrl,
      maintenanceMode,
    } = body

    // Validation
    if (siteName && siteName.trim().length === 0) {
      return NextResponse.json(
        { error: "Site name is required" },
        { status: 400 }
      )
    }

    if (contactEmail && contactEmail.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactEmail)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        )
      }
    }

    // Get or create settings
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "U Casale",
        },
      })
    }

    // Build update data
    const updateData: any = {}
    if (siteName !== undefined) updateData.siteName = siteName.trim()
    if (siteDescription !== undefined) updateData.siteDescription = siteDescription ? siteDescription.trim() : null
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail ? contactEmail.trim() : null
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone ? contactPhone.trim() : null
    if (address !== undefined) updateData.address = address ? address.trim() : null
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl ? facebookUrl.trim() : null
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl ? instagramUrl.trim() : null
    if (maintenanceMode !== undefined) updateData.maintenanceMode = maintenanceMode

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
