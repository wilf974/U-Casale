"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, Euro, Loader2, Package } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Reservation {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  createdAt: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

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
  reservations: Reservation[]
  orders: Order[]
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomer()
  }, [])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setCustomer(data.customer)
      }
    } catch (error) {
      console.error("Error fetching customer:", error)
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
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
    }

    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          <p className="text-corsican-clay-700">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-corsican-clay-600">Client non trouvé</p>
        </div>
      </div>
    )
  }

  const totalSpent =
    customer.reservations.reduce((sum, r) => sum + r.totalPrice, 0) +
    customer.orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-8">
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center text-corsican-clay-600 hover:text-corsican-clay-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux clients
      </Link>

      {/* Customer Info */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-2">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-sm text-corsican-clay-600">
                Client depuis le {format(new Date(customer.createdAt), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-corsican-clay-700 mb-3">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-corsican-clay-700">
                  <Mail className="h-4 w-4 mr-2 text-corsican-clay-500" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center text-sm text-corsican-clay-700">
                    <Phone className="h-4 w-4 mr-2 text-corsican-clay-500" />
                    {customer.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-corsican-clay-700 mb-3">Adresse</h3>
              {customer.address || customer.city ? (
                <div className="flex items-start text-sm text-corsican-clay-700">
                  <MapPin className="h-4 w-4 mr-2 text-corsican-clay-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {customer.address && <div>{customer.address}</div>}
                    {customer.postalCode && customer.city && (
                      <div>{customer.postalCode} {customer.city}</div>
                    )}
                    {customer.country && <div>{customer.country}</div>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-corsican-clay-400">Aucune adresse</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-corsican-clay-600">Total dépensé</span>
              <Euro className="h-5 w-5 text-corsican-clay-600" />
            </div>
            <p className="text-3xl font-bold text-corsican-clay-900">{totalSpent.toFixed(2)}€</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-corsican-sea-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-corsican-sea-600">Réservations</span>
              <Calendar className="h-5 w-5 text-corsican-sea-600" />
            </div>
            <p className="text-3xl font-bold text-corsican-sea-700">{customer.reservations.length}</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-corsican-maquis-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-corsican-maquis-600">Commandes</span>
              <ShoppingBag className="h-5 w-5 text-corsican-maquis-600" />
            </div>
            <p className="text-3xl font-bold text-corsican-maquis-700">{customer.orders.length}</p>
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div className="mb-8">
        <h2 className="text-xl font-serif font-bold text-corsican-clay-900 mb-4">
          Réservations ({customer.reservations.length})
        </h2>
        {customer.reservations.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-8 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-corsican-clay-400" />
            <p className="text-corsican-clay-600">Aucune réservation</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-corsican-clay-50 border-b border-corsican-clay-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-corsican-clay-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-corsican-clay-700 uppercase">Séjour</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-corsican-clay-700 uppercase">Personnes</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-corsican-clay-700 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-corsican-clay-700 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corsican-clay-100">
                {customer.reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-corsican-clay-50">
                    <td className="px-6 py-4 text-sm text-corsican-clay-700">
                      {format(new Date(reservation.createdAt), "dd/MM/yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4 text-sm text-corsican-clay-700">
                      {format(new Date(reservation.checkIn), "dd/MM", { locale: fr })} - {format(new Date(reservation.checkOut), "dd/MM/yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4 text-sm text-corsican-clay-700">{reservation.guests}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-corsican-clay-900">{reservation.totalPrice.toFixed(2)}€</td>
                    <td className="px-6 py-4">{getStatusBadge(reservation.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-serif font-bold text-corsican-clay-900 mb-4">
          Commandes ({customer.orders.length})
        </h2>
        {customer.orders.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-8 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-corsican-clay-400" />
            <p className="text-corsican-clay-600">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm font-medium text-corsican-clay-900">{order.orderNumber}</p>
                    <p className="text-sm text-corsican-clay-600">
                      {format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-corsican-clay-900">{order.total.toFixed(2)}€</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 text-sm">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-corsican-clay-100 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-corsican-clay-400" />
                        </div>
                      )}
                      <span className="flex-1 text-corsican-clay-700">{item.product.name}</span>
                      <span className="text-corsican-clay-600">x{item.quantity}</span>
                      <span className="font-semibold text-corsican-clay-900">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
