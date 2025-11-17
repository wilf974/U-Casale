import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// API publique pour récupérer le contenu de la page d'accueil
export async function GET() {
  try {
    let content = await prisma.homePageContent.findFirst()

    if (!content) {
      // Créer le contenu avec les valeurs par défaut si il n'existe pas
      content = await prisma.homePageContent.create({
        data: {},
      })
    }

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("Error fetching homepage content:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
