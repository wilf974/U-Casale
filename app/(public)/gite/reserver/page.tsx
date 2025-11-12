"use client"

import { useState, useEffect } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { Calendar as CalendarIcon, Users, Loader2, ArrowRight, Info, Home } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { fr } from "date-fns/locale"
import { addDays, differenceInDays, format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import "react-day-picker/dist/style.css"

interface Gite {
  id: string
  name: string
  slug: string
  pricePerNight: number
  minimumStay: number
  maxGuests: number
  cleaningFee: number
  taxRate: number
}

interface GiteOption {
  id: string
  name: string
  slug: string
  pricePerNight: number
  available: boolean
}

export default function ReserverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const giteSlug = searchParams.get("gite")

  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(2)
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([])
  const [gite, setGite] = useState<Gite | null>(null)
  const [availableGites, setAvailableGites] = useState<GiteOption[]>([])
  const [selectedGiteSlug, setSelectedGiteSlug] = useState<string>(giteSlug || "")
  const [loading, setLoading] = useState(false)
  const [loadingGites, setLoadingGites] = useState(true)
  const [error, setError] = useState("")

  // Charger la liste des gîtes disponibles
  useEffect(() => {
    const fetchGites = async () => {
      try {
        const response = await fetch("/api/gites")
        const data = await response.json()
        if (data.success) {
          setAvailableGites(data.gites)
          // Si un gîte est spécifié dans l'URL et existe, le sélectionner
          if (giteSlug) {
            const foundGite = data.gites.find((g: GiteOption) => g.slug === giteSlug)
            if (foundGite) {
              setSelectedGiteSlug(giteSlug)
            }
          }
          // Sinon, sélectionner le premier gîte disponible
          if (!giteSlug && data.gites.length > 0) {
            setSelectedGiteSlug(data.gites[0].slug)
          }
        }
      } catch (err) {
        console.error("Error fetching gites:", err)
      } finally {
        setLoadingGites(false)
      }
    }

    fetchGites()
  }, [giteSlug])

  // Charger les disponibilités quand un gîte est sélectionné
  useEffect(() => {
    if (selectedGiteSlug) {
      fetchDisponibilites()
    }
  }, [selectedGiteSlug])

  const fetchDisponibilites = async () => {
    if (!selectedGiteSlug) return

    const start = new Date()
    const end = addDays(start, 365) // 1 an à l'avance

    try {
      // Trouver l'ID du gîte depuis son slug
      const selectedGiteData = availableGites.find((g) => g.slug === selectedGiteSlug)
      if (!selectedGiteData) return

      const response = await fetch(
        `/api/gite/disponibilites?start=${start.toISOString()}&end=${end.toISOString()}&giteId=${selectedGiteData.id}`
      )
      const data = await response.json()

      if (response.ok) {
        const dates = data.unavailableDates.map((d: string) => new Date(d))
        setUnavailableDates(dates)
        setGite(data.gite)
      }
    } catch (err) {
      console.error("Error fetching disponibilites:", err)
    }
  }

  // Calculer le prix
  const calculatePrice = () => {
    if (!checkIn || !checkOut || !gite) return null

    const nights = differenceInDays(checkOut, checkIn)
    if (nights < 1) return null

    const subtotal = nights * gite.pricePerNight
    const cleaningFee = gite.cleaningFee
    const taxAmount = (subtotal + cleaningFee) * gite.taxRate
    const total = subtotal + cleaningFee + taxAmount

    return {
      nights,
      pricePerNight: gite.pricePerNight,
      subtotal,
      cleaningFee,
      taxAmount,
      total,
    }
  }

  const pricing = calculatePrice()

  const handleSubmit = () => {
    if (!checkIn || !checkOut) {
      setError("Veuillez sélectionner les dates de votre séjour")
      return
    }

    if (!gite) {
      setError("Configuration du gîte non chargée")
      return
    }

    const nights = differenceInDays(checkOut, checkIn)

    if (nights < gite.minimumStay) {
      setError(`Le séjour minimum est de ${gite.minimumStay} nuits`)
      return
    }

    // Stocker les données dans sessionStorage pour les récupérer sur la page suivante
    sessionStorage.setItem(
      "reservationData",
      JSON.stringify({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        pricing,
        giteId: gite.id,
        giteName: gite.name,
      })
    )

    // Rediriger vers le formulaire
    router.push("/gite/reserver/coordonnees")
  }

  const disabledDays = [
    { before: new Date() },
    ...unavailableDates.map((date) => ({
      from: date,
      to: date,
    })),
  ]

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-corsican-clay-50 to-corsican-sand-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-corsican-clay-600 mb-4">
            <CalendarIcon className="h-6 w-6" />
            <span className="font-semibold uppercase text-sm tracking-wider">Réservation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-4">
            Réserver votre séjour
          </h1>
          <p className="text-lg text-corsican-clay-700">
            Sélectionnez vos dates et le nombre de personnes
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sélecteur de gîte */}
          {availableGites.length > 1 && (
            <div className="mb-8 p-6 bg-corsican-sand-50 rounded-xl border-2 border-corsican-clay-200">
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-corsican-clay-600 mr-2" />
                <h2 className="text-xl font-serif font-bold text-corsican-clay-900">
                  Choisissez votre gîte
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableGites.map((giteOption) => (
                  <button
                    key={giteOption.id}
                    onClick={() => {
                      setSelectedGiteSlug(giteOption.slug)
                      setCheckIn(undefined)
                      setCheckOut(undefined)
                      router.push(`/gite/reserver?gite=${giteOption.slug}`, { scroll: false })
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedGiteSlug === giteOption.slug
                        ? "border-corsican-clay-600 bg-white shadow-lg"
                        : "border-corsican-clay-200 bg-white hover:border-corsican-clay-400"
                    }`}
                  >
                    <p className="font-semibold text-corsican-clay-900 mb-1">
                      {giteOption.name}
                    </p>
                    <p className="text-sm text-corsican-clay-600">
                      {giteOption.pricePerNight}€ / nuit
                    </p>
                    {selectedGiteSlug === giteOption.slug && (
                      <div className="mt-2 inline-block px-2 py-1 bg-corsican-clay-600 text-white text-xs rounded">
                        Sélectionné
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Afficher le nom du gîte si un seul disponible */}
          {availableGites.length === 1 && gite && (
            <div className="mb-8 p-4 bg-corsican-sand-50 rounded-lg border border-corsican-clay-200">
              <div className="flex items-center">
                <Home className="h-5 w-5 text-corsican-clay-600 mr-2" />
                <p className="text-corsican-clay-700">
                  Réservation pour <span className="font-semibold">{gite.name}</span>
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendrier */}
            <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
              <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-6">
                Choisissez vos dates
              </h2>

              {gite && (
                <div className="mb-6 p-4 bg-corsican-sand-50 rounded-lg text-sm text-corsican-clay-700">
                  <Info className="h-4 w-4 inline mr-2" />
                  Séjour minimum : {gite.minimumStay} nuits
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Date d'arrivée
                </label>
                <DayPicker
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => {
                    setCheckIn(date)
                    setCheckOut(undefined)
                    setError("")
                  }}
                  disabled={disabledDays}
                  locale={fr}
                  className="border rounded-lg p-4"
                  modifiersClassNames={{
                    selected: "bg-corsican-clay-600 text-white",
                    today: "font-bold text-corsican-clay-700",
                  }}
                />
              </div>

              {checkIn && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Date de départ
                  </label>
                  <DayPicker
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      setCheckOut(date)
                      setError("")
                    }}
                    disabled={[
                      { before: addDays(checkIn, 1) },
                      ...disabledDays,
                    ]}
                    locale={fr}
                    className="border rounded-lg p-4"
                    modifiersClassNames={{
                      selected: "bg-corsican-clay-600 text-white",
                      today: "font-bold text-corsican-clay-700",
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Nombre de personnes
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-full border-2 border-corsican-clay-600 text-corsican-clay-600 font-semibold hover:bg-corsican-clay-50 transition"
                  >
                    -
                  </button>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-corsican-clay-600" />
                    <span className="text-2xl font-semibold text-corsican-clay-900">
                      {guests}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setGuests(
                        Math.min(gite?.maxGuests || 6, guests + 1)
                      )
                    }
                    className="w-10 h-10 rounded-full border-2 border-corsican-clay-600 text-corsican-clay-600 font-semibold hover:bg-corsican-clay-50 transition"
                  >
                    +
                  </button>
                </div>
                {gite && (
                  <p className="text-sm text-corsican-clay-600 mt-2">
                    Maximum {gite.maxGuests} personnes
                  </p>
                )}
              </div>
            </div>

            {/* Récapitulatif */}
            <div>
              <div className="bg-corsican-clay-50 rounded-xl border-2 border-corsican-clay-200 p-6 sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-6">
                  Récapitulatif
                </h2>

                {checkIn && checkOut ? (
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-corsican-clay-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-corsican-clay-700">Arrivée</span>
                        <span className="font-semibold text-corsican-clay-900">
                          {format(checkIn, "dd MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-corsican-clay-700">Départ</span>
                        <span className="font-semibold text-corsican-clay-900">
                          {format(checkOut, "dd MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>

                    {pricing && (
                      <>
                        <div className="space-y-3">
                          <div className="flex justify-between text-corsican-clay-700">
                            <span>
                              {pricing.pricePerNight}€ x {pricing.nights} nuit
                              {pricing.nights > 1 ? "s" : ""}
                            </span>
                            <span>{pricing.subtotal}€</span>
                          </div>
                          <div className="flex justify-between text-corsican-clay-700">
                            <span>Frais de ménage</span>
                            <span>{pricing.cleaningFee}€</span>
                          </div>
                          <div className="flex justify-between text-corsican-clay-700">
                            <span>Taxe de séjour ({(gite?.taxRate || 0) * 100}%)</span>
                            <span>{pricing.taxAmount.toFixed(2)}€</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t-2 border-corsican-clay-300">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-corsican-clay-900">
                              Total
                            </span>
                            <span className="text-3xl font-bold text-corsican-clay-700">
                              {pricing.total.toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Users className="h-5 w-5 text-corsican-clay-600" />
                        <span className="text-corsican-clay-700">
                          {guests} personne{guests > 1 ? "s" : ""}
                        </span>
                      </div>

                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                          {error}
                        </div>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={!pricing || loading}
                        className="w-full inline-flex items-center justify-center px-6 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Chargement...
                          </>
                        ) : (
                          <>
                            Continuer
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-corsican-clay-600">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez vos dates pour voir le tarif</p>
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
