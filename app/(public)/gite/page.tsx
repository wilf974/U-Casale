"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PublicLayout from "@/components/layout/PublicLayout"
import {
  Users, Bed, Wifi, Car, Wind, MapPin, Mountain, Calendar,
  ArrowRight, Loader2, Star, Home
} from "lucide-react"

interface Gite {
  id: string
  slug: string
  name: string
  description: string | null
  shortDescription: string | null
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  pricePerNight: number
  cleaningFee: number
  minimumStay: number
  city: string | null
  images: string[]
  featuredImage: string | null
  amenities: any
  available: boolean
  featured: boolean
}

export default function GitePage() {
  const [gites, setGites] = useState<Gite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGites()
  }, [])

  const fetchGites = async () => {
    try {
      const response = await fetch("/api/gites")
      const data = await response.json()
      if (data.success) {
        setGites(data.gites)
      }
    } catch (error) {
      console.error("Error fetching gites:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-corsican-clay-600 animate-spin" />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-corsican-clay-50 to-corsican-sand-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-corsican-clay-600 mb-4">
              <Home className="h-6 w-6" />
              <span className="font-semibold uppercase text-sm tracking-wider">Nos Gîtes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
              Votre havre de paix en Corse
            </h1>
            <p className="text-xl text-corsican-clay-700 max-w-3xl mx-auto mb-8">
              Découvrez nos gîtes authentiques en Corse du Sud
            </p>
          </div>
        </div>
      </section>

      {/* Liste des gîtes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {gites.length === 0 ? (
            <div className="text-center py-20">
              <Mountain className="h-16 w-16 mx-auto mb-4 text-corsican-clay-400" />
              <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-2">
                Aucun gîte disponible pour le moment
              </h2>
              <p className="text-corsican-clay-600 mb-8">
                Revenez bientôt découvrir nos gîtes en Corse
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gites.map((gite) => (
                <div
                  key={gite.id}
                  className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-corsican-clay-300 to-corsican-maquis-300">
                    {gite.featuredImage || gite.images[0] ? (
                      <img
                        src={gite.featuredImage || gite.images[0]}
                        alt={gite.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <Mountain className="h-16 w-16 opacity-50" />
                      </div>
                    )}
                    {gite.featured && (
                      <div className="absolute top-4 right-4 bg-corsican-clay-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        Coup de cœur
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-2">
                        {gite.name}
                      </h3>
                      {gite.city && (
                        <div className="flex items-center text-corsican-clay-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {gite.city}
                        </div>
                      )}
                    </div>

                    {gite.shortDescription && (
                      <p className="text-corsican-clay-700 mb-4 line-clamp-2">
                        {gite.shortDescription}
                      </p>
                    )}

                    {/* Caractéristiques */}
                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-corsican-clay-200">
                      <div className="text-center">
                        <Users className="h-5 w-5 mx-auto mb-1 text-corsican-clay-600" />
                        <p className="text-sm font-semibold text-corsican-clay-900">
                          {gite.maxGuests}
                        </p>
                        <p className="text-xs text-corsican-clay-600">personnes</p>
                      </div>
                      <div className="text-center">
                        <Bed className="h-5 w-5 mx-auto mb-1 text-corsican-clay-600" />
                        <p className="text-sm font-semibold text-corsican-clay-900">
                          {gite.bedrooms}
                        </p>
                        <p className="text-xs text-corsican-clay-600">chambres</p>
                      </div>
                      <div className="text-center">
                        <Wind className="h-5 w-5 mx-auto mb-1 text-corsican-clay-600" />
                        <p className="text-sm font-semibold text-corsican-clay-900">
                          {gite.bathrooms}
                        </p>
                        <p className="text-xs text-corsican-clay-600">
                          {gite.bathrooms > 1 ? "salles de bain" : "salle de bain"}
                        </p>
                      </div>
                    </div>

                    {/* Équipements */}
                    {gite.amenities && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {gite.amenities.wifi && (
                          <div className="flex items-center text-xs text-corsican-clay-600">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </div>
                        )}
                        {gite.amenities.parking && (
                          <div className="flex items-center text-xs text-corsican-clay-600">
                            <Car className="h-3 w-3 mr-1" />
                            Parking
                          </div>
                        )}
                        {gite.amenities.airConditioning && (
                          <div className="flex items-center text-xs text-corsican-clay-600">
                            <Wind className="h-3 w-3 mr-1" />
                            Climatisation
                          </div>
                        )}
                      </div>
                    )}

                    {/* Prix et actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold text-corsican-clay-700">
                          {gite.pricePerNight}€
                        </p>
                        <p className="text-sm text-corsican-clay-600">par nuit</p>
                      </div>
                      <div className="text-right text-sm text-corsican-clay-600">
                        <p>Séjour minimum</p>
                        <p className="font-semibold text-corsican-clay-900">
                          {gite.minimumStay} {gite.minimumStay > 1 ? "nuits" : "nuit"}
                        </p>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/gite/${gite.slug}`}
                        className="flex-1 text-center px-4 py-3 rounded-lg border-2 border-corsican-clay-600 text-corsican-clay-700 font-semibold hover:bg-corsican-clay-50 transition-all"
                      >
                        Détails
                      </Link>
                      <Link
                        href={`/gite/reserver?gite=${gite.slug}`}
                        className="flex-1 text-center px-4 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
