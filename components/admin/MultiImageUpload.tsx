"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  folder?: string
  label?: string
  disabled?: boolean
  maxImages?: number
}

export default function MultiImageUpload({
  values,
  onChange,
  folder = "general",
  label = "Images",
  disabled = false,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Vérifier le nombre maximum d'images
    if (values.length + files.length > maxImages) {
      setError(`Vous ne pouvez télécharger que ${maxImages} images maximum`)
      return
    }

    setError("")
    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        // Vérifications
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          throw new Error(`${file.name}: Fichier trop volumineux (max 5MB)`)
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${file.name}: Type non autorisé`)
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de l'upload")
        }

        return data.url
      })

      const newUrls = await Promise.all(uploadPromises)
      onChange([...values, ...newUrls])
    } catch (error: any) {
      console.error("Upload error:", error)
      setError(error.message || "Erreur lors de l'upload des fichiers")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async (index: number) => {
    const urlToRemove = values[index]

    try {
      // Supprimer du serveur si c'est une image uploadée
      if (urlToRemove.startsWith("/uploads/")) {
        await fetch(`/api/admin/upload?url=${encodeURIComponent(urlToRemove)}`, {
          method: "DELETE",
        })
      }

      const newValues = values.filter((_, i) => i !== index)
      onChange(newValues)
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newValues = [...values]
    const [removed] = newValues.splice(fromIndex, 1)
    newValues.splice(toIndex, 0, removed)
    onChange(newValues)
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-corsican-clay-700">
          {label} ({values.length}/{maxImages})
        </label>
      )}

      {/* Gallery Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-corsican-clay-200">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={url.startsWith("/uploads/")}
                />
              </div>

              {/* Controls */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled || uploading}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Position indicator */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                {index === 0 ? "Principal" : index + 1}
              </div>

              {/* Move buttons */}
              {values.length > 1 && (
                <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={disabled || uploading}
                      className="px-2 py-1 bg-white text-corsican-clay-700 text-xs rounded hover:bg-corsican-clay-100 transition-colors disabled:opacity-50"
                    >
                      ←
                    </button>
                  )}
                  {index < values.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={disabled || uploading}
                      className="px-2 py-1 bg-white text-corsican-clay-700 text-xs rounded hover:bg-corsican-clay-100 transition-colors disabled:opacity-50"
                    >
                      →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {values.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            multiple
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full p-8 border-2 border-dashed border-corsican-clay-300 rounded-lg bg-corsican-clay-50 hover:bg-corsican-clay-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-corsican-clay-600 animate-spin mb-4" />
                  <p className="text-corsican-clay-700 font-medium">Upload en cours...</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-corsican-clay-600 mb-4" />
                  <p className="text-corsican-clay-700 font-medium mb-1">
                    Cliquez pour télécharger des images
                  </p>
                  <p className="text-sm text-corsican-clay-500">
                    JPG, PNG, WebP ou GIF. Max 5MB par image.
                  </p>
                  <p className="text-xs text-corsican-clay-500 mt-1">
                    Vous pouvez sélectionner plusieurs fichiers à la fois
                  </p>
                </>
              )}
            </div>
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      )}

      {values.length > 0 && (
        <p className="text-xs text-corsican-clay-500">
          💡 La première image sera utilisée comme image principale. Utilisez les flèches pour réorganiser.
        </p>
      )}
    </div>
  )
}
