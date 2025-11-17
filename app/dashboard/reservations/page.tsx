"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Euro, Mail, Phone, CheckCircle, Clock, XCircle, Trash2, Eye, Download, Edit, AlertTriangle } from "lucide-react"
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
  totalPrice: number
  status: string
  paymentStatus: string
  customer: {
    email: string
    firstName: string
    lastName: string
    phone: string | null
  }
  createdAt: string
}

export default function ReservationsPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [filter])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const url = filter === "all"
        ? "/api/admin/reservations"
        : `/api/admin/reservations?status=${filter}`

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setReservations(data.reservations)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
    }

    const icons = {
      PENDING: Clock,
      CONFIRMED: CheckCircle,
      CANCELLED: XCircle,
      COMPLETED: CheckCircle,
    }

    const labels = {
      PENDING: "En attente",
      CONFIRMED: "Confirmée",
      CANCELLED: "Annulée",
      COMPLETED: "Terminée",
    }

    const Icon = icons[status as keyof typeof icons] || Clock
    const label = labels[status as keyof typeof labels] || status

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </span>
    )
  }

  const getPaymentBadge = (paymentStatus: string) => {
    const styles = {
      PENDING: "bg-orange-100 text-orange-800",
      PAID: "bg-green-100 text-green-800",
      REFUNDED: "bg-gray-100 text-gray-800",
      FAILED: "bg-red-100 text-red-800",
    }

    const labels = {
      PENDING: "En attente",
      PAID: "Payé",
      REFUNDED: "Remboursé",
      FAILED: "Échoué",
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[paymentStatus as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {labels[paymentStatus as keyof typeof labels] || paymentStatus}
      </span>
    )
  }

  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la réservation de ${customerName} ?\n\nCette action est irréversible.`)) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Recharger la liste des réservations
        fetchReservations()
      } else {
        alert("Erreur lors de la suppression de la réservation")
      }
    } catch (error) {
      console.error("Error deleting reservation:", error)
      alert("Erreur lors de la suppression de la réservation")
    } finally {
      setDeletingId(null)
    }
  }

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "CONFIRMED").length,
    pending: reservations.filter(r => r.status === "PENDING").length,
    revenue: reservations
      .filter(r => r.paymentStatus === "PAID")
      .reduce((sum, r) => sum + r.totalPrice, 0),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Réservations
            </h1>
            <p className="text-corsican-clay-700">
              Gérez toutes les réservations du gîte
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const url = filter === "all"
                  ? "/api/admin/export/reservations"
                  : `/api/admin/export/reservations?status=${filter}`
                window.location.href = url
              }}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-maquis-600 text-white font-semibold hover:bg-corsican-maquis-700 transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter CSV
            </button>
            <Link
              href="/dashboard/reservations/calendrier"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Vue calendrier
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border-2 border-corsican-clay-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-corsican-clay-600">Total</span>
            <Calendar className="h-5 w-5 text-corsican-clay-600" />
          </div>
          <p className="text-3xl font-bold text-corsican-clay-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-600">Confirmées</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-600">En attente</span>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-corsican-maquis-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-corsican-maquis-600">Revenus</span>
            <Euro className="h-5 w-5 text-corsican-maquis-600" />
          </div>
          <p className="text-3xl font-bold text-corsican-maquis-700">
            {stats.revenue.toFixed(0)}€
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border-2 border-corsican-clay-200 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-corsican-clay-600 text-white"
                : "bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "PENDING"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter("CONFIRMED")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "CONFIRMED"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Confirmées
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "CANCELLED"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Annulées
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-corsican-clay-600">
            Chargement...
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center text-corsican-clay-600">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Nuits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Personnes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corsican-clay-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-corsican-clay-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-corsican-clay-900">
                          {reservation.customer.firstName} {reservation.customer.lastName}
                        </p>
                        <div className="flex items-center text-sm text-corsican-clay-600 mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {reservation.customer.email}
                        </div>
                        {reservation.customer.phone && (
                          <div className="flex items-center text-sm text-corsican-clay-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {reservation.customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-corsican-clay-900 font-medium">
                          {format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-corsican-clay-600">
                          → {format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-corsican-clay-900">
                      {reservation.nights}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-corsican-clay-900">
                        <Users className="h-4 w-4 mr-1" />
                        {reservation.guests}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-corsican-clay-900">
                      {reservation.totalPrice.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(reservation.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/reservations/${reservation.id}`}
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors text-sm font-medium"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Link>
                        <Link
                          href={`/dashboard/reservations/${reservation.id}`}
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(reservation.id, `${reservation.customer.firstName} ${reservation.customer.lastName}`)}
                          disabled={deletingId === reservation.id}
                          className="inline-flex items-center px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
