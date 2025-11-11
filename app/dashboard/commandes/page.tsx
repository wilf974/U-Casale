"use client"

import { useState, useEffect } from "react"
import { Package, Euro, Clock, CheckCircle, Truck, XCircle, Eye, Loader2, Mail, Phone } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  images: string[]
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: Product
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  trackingNumber: string | null
  notes: string | null
  customer: Customer
  items: OrderItem[]
  createdAt: string
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const url = filter === "all"
        ? "/api/admin/orders"
        : `/api/admin/orders?status=${filter}`

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          const data = await response.json()
          setSelectedOrder(data.order)
        }
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    }

    const icons = {
      PROCESSING: Clock,
      SHIPPED: Truck,
      DELIVERED: CheckCircle,
      CANCELLED: XCircle,
    }

    const labels = {
      PROCESSING: "En cours",
      SHIPPED: "Expédiée",
      DELIVERED: "Livrée",
      CANCELLED: "Annulée",
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

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === "PROCESSING").length,
    shipped: orders.filter(o => o.status === "SHIPPED").length,
    revenue: orders
      .filter(o => o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
          Commandes
        </h1>
        <p className="text-corsican-clay-700">
          Gérez toutes les commandes de la boutique
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border-2 border-corsican-clay-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-corsican-clay-600">Total</span>
            <Package className="h-5 w-5 text-corsican-clay-600" />
          </div>
          <p className="text-3xl font-bold text-corsican-clay-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">En cours</span>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{stats.processing}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-600">Expédiées</span>
            <Truck className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-700">{stats.shipped}</p>
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
            onClick={() => setFilter("PROCESSING")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "PROCESSING"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter("SHIPPED")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "SHIPPED"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            Expédiées
          </button>
          <button
            onClick={() => setFilter("DELIVERED")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "DELIVERED"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Livrées
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
            <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
            Chargement...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-corsican-clay-600">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    N° Commande
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                    Articles
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-corsican-clay-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-corsican-clay-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-corsican-clay-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <div className="flex items-center text-sm text-corsican-clay-600 mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-corsican-clay-900">
                      {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-corsican-clay-900">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-corsican-clay-900">
                      {order.total.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-corsican-clay-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-corsican-clay-900">
                    Commande {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-corsican-clay-600">
                    {format(new Date(selectedOrder.createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-corsican-clay-600 hover:text-corsican-clay-900 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-corsican-sand-50 rounded-lg border border-corsican-sand-200 p-4">
                <h3 className="font-semibold text-corsican-clay-900 mb-3">Informations client</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-corsican-clay-600">Nom</p>
                    <p className="font-medium text-corsican-clay-900">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-corsican-clay-600">Email</p>
                    <p className="font-medium text-corsican-clay-900">{selectedOrder.customer.email}</p>
                  </div>
                  {selectedOrder.customer.phone && (
                    <div>
                      <p className="text-corsican-clay-600">Téléphone</p>
                      <p className="font-medium text-corsican-clay-900">{selectedOrder.customer.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-corsican-clay-900 mb-3">Articles</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-white border border-corsican-clay-200 rounded-lg">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-corsican-clay-100 rounded flex items-center justify-center">
                          <Package className="h-8 w-8 text-corsican-clay-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-corsican-clay-900">{item.product.name}</p>
                        <p className="text-sm text-corsican-clay-600">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-corsican-clay-900">{item.price.toFixed(2)}€</p>
                        <p className="text-sm text-corsican-clay-600">
                          {(item.price * item.quantity).toFixed(2)}€ total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-corsican-clay-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-corsican-clay-900">Total</span>
                  <span className="text-2xl font-bold text-corsican-clay-900">
                    {selectedOrder.total.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-corsican-clay-900 mb-3">Statut de la commande</h3>
                <div className="flex flex-wrap gap-2">
                  {["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                        selectedOrder.status === status
                          ? "bg-corsican-clay-600 text-white"
                          : "bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200"
                      }`}
                    >
                      {status === "PROCESSING" && "En cours"}
                      {status === "SHIPPED" && "Expédiée"}
                      {status === "DELIVERED" && "Livrée"}
                      {status === "CANCELLED" && "Annulée"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-corsican-sand-50 rounded-lg border border-corsican-sand-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-corsican-clay-900">Statut du paiement</span>
                  {getPaymentBadge(selectedOrder.paymentStatus)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
