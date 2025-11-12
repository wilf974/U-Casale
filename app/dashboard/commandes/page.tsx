"use client"

import { useState, useEffect } from "react"
import { Package, Euro, Clock, CheckCircle, Truck, XCircle, Eye, Loader2, Mail, Phone, Download, Search, ChevronUp, ChevronDown, CheckSquare, Square, Filter as FilterIcon } from "lucide-react"
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

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  // Bulk actions
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Sorting
  const [sortField, setSortField] = useState<"createdAt" | "total" | "orderNumber">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  // Bulk selection handlers
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(paginatedOrders.map(o => o.id))
    }
  }

  const handleBulkUpdateStatus = async (newStatus: string) => {
    if (selectedOrders.length === 0) return

    try {
      await Promise.all(
        selectedOrders.map(id =>
          fetch(`/api/admin/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      )
      await fetchOrders()
      setSelectedOrders([])
    } catch (error) {
      console.error("Error bulk updating orders:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filtering and sorting
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    const orderDate = new Date(order.createdAt)
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom)
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo + "T23:59:59")

    const amount = order.total
    const matchesMinAmount = !minAmount || amount >= parseFloat(minAmount)
    const matchesMaxAmount = !maxAmount || amount <= parseFloat(maxAmount)

    return matchesSearch && matchesPayment && matchesDateFrom && matchesDateTo && matchesMinAmount && matchesMaxAmount
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "orderNumber":
        comparison = a.orderNumber.localeCompare(b.orderNumber)
        break
      case "total":
        comparison = a.total - b.total
        break
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, paymentFilter, dateFrom, dateTo, minAmount, maxAmount, filter])

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Commandes
            </h1>
            <p className="text-corsican-clay-700">
              Gérez toutes les commandes de la boutique
            </p>
          </div>
          <button
            onClick={() => {
              const url = filter === "all"
                ? "/api/admin/export/orders"
                : `/api/admin/export/orders?status=${filter}`
              window.location.href = url
            }}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-maquis-600 text-white font-semibold hover:bg-corsican-maquis-700 transition-all"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter CSV
          </button>
        </div>
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

      {/* Bulk Actions Toolbar */}
      {selectedOrders.length > 0 && (
        <div className="bg-corsican-clay-900 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5" />
            <span className="font-semibold">{selectedOrders.length} commande(s) sélectionnée(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkUpdateStatus("PROCESSING")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              En cours
            </button>
            <button
              onClick={() => handleBulkUpdateStatus("SHIPPED")}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Expédiée
            </button>
            <button
              onClick={() => handleBulkUpdateStatus("DELIVERED")}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Livrée
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-4 py-2 rounded-lg bg-corsican-clay-700 hover:bg-corsican-clay-600 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Status Filter Buttons */}
      <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200 mb-4">
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

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200 mb-6">
        <div className="space-y-4">
          {/* Search and Payment Filter */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
              <input
                type="text"
                placeholder="Rechercher (N°, client, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
            >
              <option value="all">Tous les paiements</option>
              <option value="PENDING">En attente</option>
              <option value="PAID">Payé</option>
              <option value="REFUNDED">Remboursé</option>
              <option value="FAILED">Échoué</option>
            </select>

            <div className="flex items-center gap-2">
              <label className="text-sm text-corsican-clay-600 whitespace-nowrap">Afficher:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Date Range and Amount Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Date début"
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Date fin"
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Montant min (€)"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Montant max (€)"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="text-sm text-corsican-clay-600">
            {sortedOrders.length} commande(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-12 text-center text-corsican-clay-600">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          Chargement...
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-12 text-center text-corsican-clay-600">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune commande trouvée</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                  <tr>
                    <th className="px-4 py-4 text-left w-12">
                      <button
                        onClick={toggleSelectAll}
                        className="p-1 hover:bg-corsican-clay-100 rounded transition-colors"
                      >
                        {selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0 ? (
                          <CheckSquare className="h-5 w-5 text-corsican-clay-700" />
                        ) : (
                          <Square className="h-5 w-5 text-corsican-clay-400" />
                        )}
                      </button>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("orderNumber")}
                    >
                      <div className="flex items-center gap-2">
                        N° Commande
                        {sortField === "orderNumber" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortField === "createdAt" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider">
                      Articles
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase tracking-wider cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center gap-2">
                        Total
                        {sortField === "total" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
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
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-corsican-clay-50 transition-colors">
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleOrderSelection(order.id)}
                          className="p-1 hover:bg-corsican-clay-100 rounded transition-colors"
                        >
                          {selectedOrders.includes(order.id) ? (
                            <CheckSquare className="h-5 w-5 text-corsican-clay-700" />
                          ) : (
                            <Square className="h-5 w-5 text-corsican-clay-400" />
                          )}
                        </button>
                      </td>
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-corsican-clay-600">
                Page {currentPage} sur {totalPages} ({sortedOrders.length} commandes)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Première
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Précédent
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-corsican-clay-600 text-white"
                            : "bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Suivant
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Dernière
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
