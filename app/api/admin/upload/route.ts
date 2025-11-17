import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, chmod, chown } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { auth } from "@/lib/auth"

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF" },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5MB" },
        { status: 400 }
      )
    }

    // Créer le dossier uploads s'il n'existe pas
    const folderPath = path.join(UPLOAD_DIR, folder)
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true, mode: 0o755 })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(file.name)
    const filename = `${timestamp}-${randomString}${extension}`

    // Convertir le fichier en buffer et sauvegarder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(folderPath, filename)
    await writeFile(filepath, buffer)

    // Définir les permissions et le propriétaire pour que nginx puisse lire le fichier
    await chmod(filepath, 0o644)
    await chown(filepath, 1001, 1001) // nextjs:nodejs (UID 1001, GID 1001)

    console.log(`✅ Fichier uploadé avec succès:`)
    console.log(`   - Chemin: ${filepath}`)
    console.log(`   - Taille: ${buffer.length} bytes`)
    console.log(`   - Dossier: ${folder}`)
    console.log(`   - Permissions: 644 (nextjs:nodejs)`)

    // Retourner l'URL publique
    const publicUrl = `/uploads/${folder}/${filename}`

    console.log(`   - URL publique: ${publicUrl}`)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    )
  }
}

// Endpoint pour supprimer une image
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("url")

    if (!fileUrl) {
      return NextResponse.json(
        { error: "URL du fichier manquante" },
        { status: 400 }
      )
    }

    // Vérifier que l'URL est bien dans le dossier uploads
    if (!fileUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "URL invalide" },
        { status: 400 }
      )
    }

    const filepath = path.join(process.cwd(), "public", fileUrl)

    if (existsSync(filepath)) {
      const fs = await import("fs/promises")
      await fs.unlink(filepath)
    }

    return NextResponse.json({
      success: true,
      message: "Fichier supprimé",
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    )
  }
}
