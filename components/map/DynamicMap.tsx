"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"

interface DynamicMapProps {
  height?: string
  className?: string
}

export default function DynamicMap({ height = "400px", className = "" }: DynamicMapProps) {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()

        if (data.success && data.settings.latitude && data.settings.longitude) {
          setLatitude(data.settings.latitude)
          setLongitude(data.settings.longitude)
        }
      } catch (error) {
        console.error("Error fetching map settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div
        className={`bg-corsican-stone-100 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-corsican-stone-600">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-semibold">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  if (!latitude || !longitude) {
    return (
      <div
        className={`bg-corsican-stone-100 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-corsican-stone-600">
          <MapPin className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">Carte non configurée</p>
          <p className="text-sm">Les coordonnées GPS doivent être configurées dans les paramètres</p>
        </div>
      </div>
    )
  }

  // Générer l'URL OpenStreetMap avec les coordonnées
  const bbox = `${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`} style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        title="Carte de localisation"
        className="w-full h-full"
      />
    </div>
  )
}
