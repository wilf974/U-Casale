import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, firstName, lastName, source } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email valide requis" },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      if (existing.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Vous êtes déjà inscrit à la newsletter" },
          { status: 400 }
        )
      }

      // Reactivate subscription
      const subscriber = await prisma.newsletterSubscriber.update({
        where: { email: email.toLowerCase().trim() },
        data: {
          status: "ACTIVE",
          firstName,
          lastName,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Votre inscription a été réactivée",
        subscriber,
      })
    }

    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName,
        lastName,
        status: "ACTIVE",
        source: source || "website",
        tags: [],
      },
    })

    return NextResponse.json({
      success: true,
      message: "Merci pour votre inscription!",
      subscriber,
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}
