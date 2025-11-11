"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Phone, MapPin, ShoppingBag, Calendar, Search, Loader2, Eye, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  country: string | null
  createdAt: string
  _count: {
    reservations: number
    orders: number
  }
}

export default function ClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const url = searchTerm
        ? `/api/admin/customers?search=${encodeURIComponent(searchTerm)}`
        : "/api/admin/customers"

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchCustomers()
  }

  const handleDelete = async (customer: Customer) => {
    if (customer._count.reservations > 0 || customer._count.orders > 0) {
      alert("Impossible de supprimer un client avec des réservations ou commandes")
      return
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${customer.firstName} ${customer.lastName} ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCustomers()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const stats = {
    total: customers.length,
    withReservations: customers.filter(c => c._count.reservations > 0).length,
    withOrders: customers.filter(c => c._count.orders > 0).length,
    both: customers.filter(c => c._count.reservations > 0 && c._count.orders > 0).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Clients
            </h1>
            <p className="text-corsican-clay-700">
              Gérez tous les clients du site
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200">
            <p className="text-sm text-corsican-clay-600">Total clients</p>
            <p className="text-2xl font-bold text-corsican-clay-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-corsican-sea-200">
            <p className="text-sm text-corsican-sea-600">Avec réservations</p>
            <p className="text-2xl font-bold text-corsican-sea-700">{stats.withReservations}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-corsican-maquis-200">
            <p className="text-sm text-corsican-maquis-600">Avec commandes</p>
            <p className="text-2xl font-bold text-corsican-maquis-700">{stats.withOrders}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm text-purple-600">Les deux</p>
            <p className="text-2xl font-bold text-purple-700">{stats.both}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200 mb-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          <p className="text-corsican-clay-700">Chargement...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-corsican-clay-200">
          <Users className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">
            {searchTerm ? "Aucun client trouvé" : "Aucun client pour le moment"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Réservations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Inscrit le
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corsican-clay-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-corsican-clay-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-corsican-clay-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-corsican-clay-600" />
                        </div>
                        <div>
                          <p className="font-medium text-corsican-clay-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-corsican-clay-700">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-corsican-clay-700">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-corsican-clay-700">
                      {customer.city || customer.country ? (
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          <div>
                            {customer.city && <div>{customer.city}</div>}
                            {customer.postalCode && <div>{customer.postalCode}</div>}
                            {customer.country && <div>{customer.country}</div>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-corsican-clay-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-corsican-sea-100 text-corsican-sea-800">
                        <Calendar className="h-3 w-3 mr-1" />
                        {customer._count.reservations}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-corsican-maquis-100 text-corsican-maquis-800">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-corsican-clay-700">
                      {format(new Date(customer.createdAt), "dd MMM yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/clients/${customer.id}`}
                          className="p-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          disabled={customer._count.reservations > 0 || customer._count.orders > 0}
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
        </div>
      )}
    </div>
  )
}
