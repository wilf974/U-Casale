import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Récupérer le contenu de la page d'accueil
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Récupérer ou créer le contenu
    let content = await prisma.homePageContent.findFirst()

    if (!content) {
      content = await prisma.homePageContent.create({
        data: {},
      })
    }

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error("Error fetching homepage content:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le contenu de la page d'accueil
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
      heroTitle,
      heroSubtitle,
      heroDescription,
      giteTitle,
      giteDescription,
      giteFeatures,
      giteImage,
      boutiqueTitle,
      boutiqueDescription,
      boutiqueFeatures,
      boutiqueImage,
      locationTitle,
      locationDescription,
      ctaTitle,
      ctaDescription,
    } = body

    // Récupérer ou créer le contenu
    let content = await prisma.homePageContent.findFirst()

    if (!content) {
      content = await prisma.homePageContent.create({
        data: {},
      })
    }

    // Build update data
    const updateData: any = {}
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle.trim()
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle.trim()
    if (heroDescription !== undefined) updateData.heroDescription = heroDescription.trim()
    if (giteTitle !== undefined) updateData.giteTitle = giteTitle.trim()
    if (giteDescription !== undefined) updateData.giteDescription = giteDescription.trim()
    if (giteFeatures !== undefined) updateData.giteFeatures = giteFeatures
    if (giteImage !== undefined) updateData.giteImage = giteImage
    if (boutiqueTitle !== undefined) updateData.boutiqueTitle = boutiqueTitle.trim()
    if (boutiqueDescription !== undefined) updateData.boutiqueDescription = boutiqueDescription.trim()
    if (boutiqueFeatures !== undefined) updateData.boutiqueFeatures = boutiqueFeatures
    if (boutiqueImage !== undefined) updateData.boutiqueImage = boutiqueImage
    if (locationTitle !== undefined) updateData.locationTitle = locationTitle.trim()
    if (locationDescription !== undefined) updateData.locationDescription = locationDescription.trim()
    if (ctaTitle !== undefined) updateData.ctaTitle = ctaTitle.trim()
    if (ctaDescription !== undefined) updateData.ctaDescription = ctaDescription.trim()

    const updatedContent = await prisma.homePageContent.update({
      where: { id: content.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      content: updatedContent,
    })
  } catch (error) {
    console.error("Error updating homepage content:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
