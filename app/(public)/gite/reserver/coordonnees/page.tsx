"use client"

import { useState, useEffect } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { User, Mail, Phone, MapPin, Loader2, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface ReservationData {
  checkIn: string
  checkOut: string
  guests: number
  pricing: {
    nights: number
    pricePerNight: number
    subtotal: number
    cleaningFee: number
    taxAmount: number
    total: number
  }
}

export default function CoordonneesPage() {
  const router = useRouter()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    notes: "",
  })

  useEffect(() => {
    // Récupérer les données de réservation depuis sessionStorage
    const data = sessionStorage.getItem("reservationData")
    if (!data) {
      router.push("/gite/reserver")
      return
    }

    try {
      const parsed = JSON.parse(data)
      setReservationData(parsed)
    } catch (err) {
      console.error("Error parsing reservation data:", err)
      router.push("/gite/reserver")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!reservationData) {
      setError("Données de réservation manquantes")
      setLoading(false)
      return
    }

    try {
      // Créer la réservation
      const response = await fetch("/api/gite/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkIn: reservationData.checkIn,
          checkOut: reservationData.checkOut,
          guests: reservationData.guests,
          customerEmail: formData.email,
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerPostalCode: formData.postalCode,
          customerCountry: formData.country,
          notes: formData.notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de la réservation")
      }

      // Créer la session de paiement Stripe
      const checkoutResponse = await fetch("/api/checkout/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: data.reservation.id,
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.error || "Erreur lors de la création du paiement")
      }

      // Rediriger vers Stripe Checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        throw new Error("No checkout URL received from Stripe")
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Une erreur est survenue")
      setLoading(false)
    }
  }

  if (!reservationData) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-corsican-clay-600" />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <section className="py-12 bg-corsican-sand-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-corsican-clay-900 mb-2">
              Vos coordonnées
            </h1>
            <p className="text-corsican-clay-700">
              Dernière étape avant la confirmation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-6">
                  Informations personnelles
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                        placeholder="Jean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                        placeholder="jean.dupont@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      placeholder="123 Rue de la République"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      placeholder="75001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      placeholder="Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      placeholder="France"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Remarques (optionnel)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition resize-none"
                    placeholder="Informations complémentaires, demandes particulières..."
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold text-lg hover:bg-corsican-clay-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Procéder au paiement
                    </>
                  )}
                </button>

                <p className="text-sm text-corsican-clay-600 text-center mt-4">
                  Paiement sécurisé par Stripe
                </p>
              </form>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-xl font-serif font-bold text-corsican-clay-900 mb-4">
                  Votre réservation
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-corsican-clay-200">
                  <div>
                    <p className="text-sm text-corsican-clay-600">Arrivée</p>
                    <p className="font-semibold text-corsican-clay-900">
                      {format(new Date(reservationData.checkIn), "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-corsican-clay-600">Départ</p>
                    <p className="font-semibold text-corsican-clay-900">
                      {format(new Date(reservationData.checkOut), "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-corsican-clay-600">Personnes</p>
                    <p className="font-semibold text-corsican-clay-900">
                      {reservationData.guests} personne{reservationData.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-corsican-clay-200 text-sm">
                  <div className="flex justify-between text-corsican-clay-700">
                    <span>
                      {reservationData.pricing.pricePerNight}€ x {reservationData.pricing.nights}{" "}
                      nuit{reservationData.pricing.nights > 1 ? "s" : ""}
                    </span>
                    <span>{reservationData.pricing.subtotal}€</span>
                  </div>
                  <div className="flex justify-between text-corsican-clay-700">
                    <span>Frais de ménage</span>
                    <span>{reservationData.pricing.cleaningFee}€</span>
                  </div>
                  <div className="flex justify-between text-corsican-clay-700">
                    <span>Taxe de séjour</span>
                    <span>{reservationData.pricing.taxAmount.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-corsican-clay-900">Total</span>
                  <span className="text-2xl font-bold text-corsican-clay-700">
                    {reservationData.pricing.total.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
