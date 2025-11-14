"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  folder?: string
  label?: string
  disabled?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "general",
  label = "Image",
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifications côté client
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("Le fichier est trop volumineux (max 5MB)")
      return
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Type de fichier non autorisé (JPG, PNG, WebP, GIF uniquement)")
      return
    }

    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onChange(data.url)
      } else {
        setError(data.error || "Erreur lors de l'upload")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError("Erreur lors de l'upload du fichier")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      // Supprimer du serveur si c'est une image uploadée
      if (value.startsWith("/uploads/")) {
        await fetch(`/api/admin/upload?url=${encodeURIComponent(value)}`, {
          method: "DELETE",
        })
      }

      if (onRemove) {
        onRemove()
      } else {
        onChange("")
      }
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-corsican-clay-700">
          {label}
        </label>
      )}

      <div className="flex items-start space-x-4">
        {/* Preview */}
        {value ? (
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-corsican-clay-200">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={value.startsWith("/uploads/")}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || uploading}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-corsican-clay-300 flex items-center justify-center bg-corsican-clay-50">
            <ImageIcon className="h-8 w-8 text-corsican-clay-400" />
          </div>
        )}

        {/* Upload button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="inline-flex items-center px-4 py-2 border border-corsican-clay-300 rounded-lg bg-white text-corsican-clay-700 font-medium hover:bg-corsican-clay-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                {value ? "Remplacer l'image" : "Télécharger une image"}
              </>
            )}
          </button>

          <p className="text-xs text-corsican-clay-500 mt-2">
            JPG, PNG, WebP ou GIF. Max 5MB.
          </p>

          {error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
