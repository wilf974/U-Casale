"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Users, Euro, Mail, Phone, MapPin, Save, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Reservation {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  pricePerNight: number
  totalPrice: number
  status: string
  paymentStatus: string
  notes: string | null
  stripePaymentId: string | null
  customer: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    country: string | null
  }
  createdAt: string
  updatedAt: string
}

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    notes: "",
  })

  useEffect(() => {
    fetchReservation()
  }, [params.id])

  const fetchReservation = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/reservations/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setReservation(data.reservation)
        setFormData({
          status: data.reservation.status,
          paymentStatus: data.reservation.paymentStatus,
          notes: data.reservation.notes || "",
        })
      } else {
        setError(data.error || "Erreur lors du chargement")
      }
    } catch (error) {
      console.error("Error fetching reservation:", error)
      setError("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/admin/reservations/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Réservation mise à jour avec succès")
        setReservation(data.reservation)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating reservation:", error)
      setError("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/reservations/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard/reservations")
      } else {
        setError("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting reservation:", error)
      setError("Erreur lors de la suppression")
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-corsican-clay-600">
          Chargement...
        </div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-corsican-clay-600">
          Réservation non trouvée
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/reservations"
          className="inline-flex items-center text-corsican-clay-600 hover:text-corsican-clay-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux réservations
        </Link>
        <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
          Réservation #{reservation.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="text-corsican-clay-700">
          Créée le {format(new Date(reservation.createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informations client */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Informations client
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Nom complet</p>
                <p className="font-medium text-corsican-clay-900">
                  {reservation.customer.firstName} {reservation.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-corsican-clay-600 mr-2" />
                  <a
                    href={`mailto:${reservation.customer.email}`}
                    className="text-corsican-clay-900 hover:text-corsican-clay-700"
                  >
                    {reservation.customer.email}
                  </a>
                </div>
              </div>
              {reservation.customer.phone && (
                <div>
                  <p className="text-sm text-corsican-clay-600 mb-1">Téléphone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-corsican-clay-600 mr-2" />
                    <a
                      href={`tel:${reservation.customer.phone}`}
                      className="text-corsican-clay-900 hover:text-corsican-clay-700"
                    >
                      {reservation.customer.phone}
                    </a>
                  </div>
                </div>
              )}
              {reservation.customer.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-corsican-clay-600 mb-1">Adresse</p>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-corsican-clay-600 mr-2 mt-1" />
                    <div className="text-corsican-clay-900">
                      <p>{reservation.customer.address}</p>
                      {reservation.customer.postalCode && reservation.customer.city && (
                        <p>
                          {reservation.customer.postalCode} {reservation.customer.city}
                        </p>
                      )}
                      {reservation.customer.country && <p>{reservation.customer.country}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Détails séjour */}
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Détails du séjour
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Arrivée</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-corsican-clay-600 mr-2" />
                  <p className="font-medium text-corsican-clay-900">
                    {format(new Date(reservation.checkIn), "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Départ</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-corsican-clay-600 mr-2" />
                  <p className="font-medium text-corsican-clay-900">
                    {format(new Date(reservation.checkOut), "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Nombre de nuits</p>
                <p className="font-medium text-corsican-clay-900">{reservation.nights}</p>
              </div>
              <div>
                <p className="text-sm text-corsican-clay-600 mb-1">Nombre de personnes</p>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-corsican-clay-600 mr-2" />
                  <p className="font-medium text-corsican-clay-900">{reservation.guests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Détails du prix
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-corsican-clay-700">
                <span>{reservation.pricePerNight}€ x {reservation.nights} nuits</span>
                <span>{(reservation.pricePerNight * reservation.nights).toFixed(2)}€</span>
              </div>
              <div className="pt-2 border-t border-corsican-clay-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-corsican-clay-900">Total</span>
                  <div className="flex items-center">
                    <Euro className="h-5 w-5 text-corsican-clay-600 mr-1" />
                    <span className="text-2xl font-bold text-corsican-clay-900">
                      {reservation.totalPrice.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {reservation.stripePaymentId && (
              <div className="mt-4 pt-4 border-t border-corsican-clay-200">
                <p className="text-sm text-corsican-clay-600">
                  ID Paiement Stripe: <span className="font-mono text-xs">{reservation.stripePaymentId}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de modification */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Modifier la réservation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                >
                  <option value="PENDING">En attente</option>
                  <option value="CONFIRMED">Confirmée</option>
                  <option value="CANCELLED">Annulée</option>
                  <option value="COMPLETED">Terminée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Statut paiement
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                >
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="REFUNDED">Remboursé</option>
                  <option value="FAILED">Échoué</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Notes internes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition resize-none"
                  placeholder="Notes pour l'équipe..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
