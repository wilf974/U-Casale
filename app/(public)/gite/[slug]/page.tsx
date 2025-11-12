"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import PublicLayout from "@/components/layout/PublicLayout"
import {
  Users, Bed, Wifi, Car, Wind, Utensils, MapPin,
  Loader2, Calendar, ArrowRight, Home, Bath,
  Tv, WashingMachine, TreePine, UtensilsCrossed,
  Star, Clock, AlertCircle
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
  address: string | null
  city: string | null
  postalCode: string | null
  images: string[]
  featuredImage: string | null
  virtualTourUrl: string | null
  amenities: any
  equipment: string | null
  available: boolean
  rules: string | null
  checkInTime: string | null
  checkOutTime: string | null
  featured: boolean
}

export default function GiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [gite, setGite] = useState<Gite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (slug) {
      fetchGite()
    }
  }, [slug])

  const fetchGite = async () => {
    try {
      const response = await fetch(`/api/gites/${slug}`)
      const data = await response.json()

      if (data.success) {
        setGite(data.gite)
      } else {
        setError(data.error || "Gîte non trouvé")
      }
    } catch (err) {
      console.error("Error fetching gite:", err)
      setError("Erreur lors du chargement du gîte")
    } finally {
      setLoading(false)
    }
  }

  const amenityIcons: any = {
    wifi: { icon: Wifi, label: "WiFi gratuit" },
    parking: { icon: Car, label: "Parking privé" },
    airConditioning: { icon: Wind, label: "Climatisation" },
    kitchen: { icon: Utensils, label: "Cuisine équipée" },
    washingMachine: { icon: WashingMachine, label: "Lave-linge" },
    tv: { icon: Tv, label: "Télévision" },
    terrace: { icon: Home, label: "Terrasse" },
    garden: { icon: TreePine, label: "Jardin" },
    bbq: { icon: UtensilsCrossed, label: "Barbecue" },
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

  if (error || !gite) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-corsican-clay-400" />
            <h1 className="text-2xl font-bold text-corsican-clay-900 mb-2">
              {error || "Gîte non trouvé"}
            </h1>
            <Link
              href="/gite"
              className="inline-flex items-center text-corsican-clay-600 hover:text-corsican-clay-700"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Retour à la liste des gîtes
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const allImages = gite.featuredImage
    ? [gite.featuredImage, ...gite.images.filter((img) => img !== gite.featuredImage)]
    : gite.images

  return (
    <PublicLayout>
      {/* Header avec breadcrumb */}
      <section className="bg-corsican-clay-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-corsican-clay-600 mb-2">
            <Link href="/gite" className="hover:text-corsican-clay-700">
              Nos gîtes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-corsican-clay-900 font-semibold">{gite.name}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-corsican-clay-900 mb-2">
                {gite.name}
              </h1>
              {gite.city && (
                <div className="flex items-center text-corsican-clay-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {gite.address && `${gite.address}, `}
                  {gite.city}
                  {gite.postalCode && ` ${gite.postalCode}`}
                </div>
              )}
            </div>
            {gite.featured && (
              <div className="flex items-center bg-corsican-clay-600 text-white px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 mr-2 fill-current" />
                Coup de cœur
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Galerie photos */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allImages.length > 0 ? (
              allImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-hidden ${
                    index === 0 ? "md:col-span-2 md:row-span-2 h-96 md:h-full" : "h-48"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${gite.name} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full h-96 bg-gradient-to-br from-corsican-clay-300 to-corsican-maquis-300 rounded-lg flex items-center justify-center">
                <Home className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {gite.description && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                    À propos de ce gîte
                  </h2>
                  <div className="prose prose-lg max-w-none text-corsican-clay-700">
                    <p>{gite.description}</p>
                  </div>
                </div>
              )}

              {/* Caractéristiques */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                  Caractéristiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-corsican-sand-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-corsican-clay-600" />
                    <p className="text-2xl font-bold text-corsican-clay-900">{gite.maxGuests}</p>
                    <p className="text-sm text-corsican-clay-600">personnes</p>
                  </div>
                  <div className="text-center p-4 bg-corsican-sand-50 rounded-lg">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-corsican-clay-600" />
                    <p className="text-2xl font-bold text-corsican-clay-900">{gite.bedrooms}</p>
                    <p className="text-sm text-corsican-clay-600">chambres</p>
                  </div>
                  <div className="text-center p-4 bg-corsican-sand-50 rounded-lg">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-corsican-clay-600" />
                    <p className="text-2xl font-bold text-corsican-clay-900">{gite.beds}</p>
                    <p className="text-sm text-corsican-clay-600">lits</p>
                  </div>
                  <div className="text-center p-4 bg-corsican-sand-50 rounded-lg">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-corsican-clay-600" />
                    <p className="text-2xl font-bold text-corsican-clay-900">{gite.bathrooms}</p>
                    <p className="text-sm text-corsican-clay-600">
                      {gite.bathrooms > 1 ? "salles de bain" : "salle de bain"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Équipements */}
              {gite.amenities && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                    Équipements & Services
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(gite.amenities).map(
                      ([key, value]) =>
                        value &&
                        amenityIcons[key] && (
                          <div
                            key={key}
                            className="flex items-center space-x-3 p-3 bg-corsican-sand-50 rounded-lg"
                          >
                            {(() => {
                              const Icon = amenityIcons[key].icon
                              return <Icon className="h-6 w-6 text-corsican-clay-600" />
                            })()}
                            <span className="text-corsican-clay-700">
                              {amenityIcons[key].label}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                  {gite.equipment && (
                    <div className="mt-4 p-4 bg-corsican-sand-50 rounded-lg">
                      <p className="text-sm text-corsican-clay-700">{gite.equipment}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Règlement */}
              {gite.rules && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                    Règlement intérieur
                  </h2>
                  <div className="bg-corsican-sand-50 rounded-xl p-6">
                    <p className="text-corsican-clay-700 whitespace-pre-line">{gite.rules}</p>
                  </div>
                </div>
              )}

              {/* Horaires */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                  Horaires
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-corsican-sand-50 rounded-lg">
                    <Clock className="h-6 w-6 text-corsican-clay-600" />
                    <div>
                      <p className="font-semibold text-corsican-clay-900">Arrivée</p>
                      <p className="text-corsican-clay-700">
                        À partir de {gite.checkInTime || "15:00"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-corsican-sand-50 rounded-lg">
                    <Clock className="h-6 w-6 text-corsican-clay-600" />
                    <div>
                      <p className="font-semibold text-corsican-clay-900">Départ</p>
                      <p className="text-corsican-clay-700">
                        Avant {gite.checkOutTime || "11:00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Réservation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border-2 border-corsican-clay-200 rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-corsican-clay-700">
                      {gite.pricePerNight}€
                    </span>
                    <span className="ml-2 text-corsican-clay-600">par nuit</span>
                  </div>
                  <p className="text-sm text-corsican-clay-600">
                    + {gite.cleaningFee}€ de frais de ménage
                  </p>
                </div>

                <div className="mb-6 p-4 bg-corsican-sand-50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between text-corsican-clay-700">
                    <span>Séjour minimum</span>
                    <span className="font-semibold">
                      {gite.minimumStay} {gite.minimumStay > 1 ? "nuits" : "nuit"}
                    </span>
                  </div>
                  <div className="flex justify-between text-corsican-clay-700">
                    <span>Capacité maximale</span>
                    <span className="font-semibold">{gite.maxGuests} personnes</span>
                  </div>
                </div>

                {gite.available ? (
                  <div className="space-y-3">
                    <Link
                      href={`/gite/reserver?gite=${gite.slug}`}
                      className="w-full inline-flex items-center justify-center px-6 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Vérifier les disponibilités
                      <Calendar className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-corsican-clay-600 text-corsican-clay-700 font-semibold hover:bg-corsican-clay-50 transition-all"
                    >
                      Nous contacter
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-800 font-semibold">
                      Ce gîte n'est pas disponible à la réservation pour le moment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
