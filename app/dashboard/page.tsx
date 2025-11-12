"use client"

import { useState, useEffect } from "react"
import { Calendar, Package, ShoppingBag, Users, Euro, TrendingUp, AlertTriangle, Ticket, Loader2, BarChart3, PieChart as PieChartIcon, Star, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Stats {
  reservations: {
    total: number
    confirmed: number
    pending: number
    revenue: number
  }
  orders: {
    total: number
    processing: number
    shipped: number
    revenue: number
  }
  products: {
    total: number
    lowStock: number
  }
  customers: {
    total: number
  }
  categories: {
    total: number
  }
  promoCodes: {
    active: number
  }
  testimonials: {
    total: number
    published: number
    avgRating: number
  }
  metrics: {
    avgReservationValue: number
    avgOrderValue: number
    customerRetentionRate: number
    repeatCustomers: number
  }
  revenue: {
    total: number
    reservations: number
    orders: number
  }
  recentActivity: {
    reservations: Array<{
      id: string
      checkIn: string
      checkOut: string
      totalPrice: number
      status: string
      customer: {
        firstName: string
        lastName: string
      }
      createdAt: string
    }>
    orders: Array<{
      id: string
      orderNumber: string
      total: number
      status: string
      customer: {
        firstName: string
        lastName: string
      }
      createdAt: string
    }>
    testimonials: Array<{
      id: string
      customerName: string
      content: string
      rating: number
      type: string
      verified: boolean
      createdAt: string
    }>
  }
}

interface ChartData {
  monthlyData: Array<{
    month: string
    shortMonth: string
    reservations: number
    orders: number
    reservationsRevenue: number
    ordersRevenue: number
    totalRevenue: number
  }>
  categoryData: Array<{
    name: string
    value: number
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/admin/charts")
      const data = await response.json()

      if (response.ok) {
        setChartData(data)
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
    }
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

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-corsican-clay-600">Erreur lors du chargement des statistiques</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header with improved design */}
      <div className="mb-8 pb-6 border-b-2 border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2 bg-gradient-to-r from-corsican-clay-900 to-corsican-maquis-700 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-stone-600 text-lg">
              Aperçu général de votre activité
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500">Dernière mise à jour</p>
            <p className="text-lg font-semibold text-stone-700">
              {format(new Date(), "dd MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="group bg-gradient-to-br from-corsican-clay-500 to-corsican-clay-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Revenus totaux</h3>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Euro className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{stats.revenue.total.toFixed(0)}€</p>
          <div className="flex items-center text-sm opacity-90">
            <TrendingUp className="h-4 w-4 mr-1" />
            Tous les temps
          </div>
        </div>

        <div className="group bg-gradient-to-br from-corsican-sea-500 to-corsican-sea-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Revenus réservations</h3>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{stats.revenue.reservations.toFixed(0)}€</p>
          <p className="text-sm opacity-90">{stats.reservations.confirmed} confirmées</p>
        </div>

        <div className="group bg-gradient-to-br from-corsican-maquis-500 to-corsican-maquis-700 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Revenus boutique</h3>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{stats.revenue.orders.toFixed(0)}€</p>
          <p className="text-sm opacity-90">{stats.orders.total} commandes</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-6 mb-8 border-2 border-stone-200 shadow-md">
        <h2 className="text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-corsican-clay-500 to-corsican-maquis-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          Métriques clés
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">Panier moyen (Résa)</p>
            <p className="text-3xl font-bold text-corsican-sea-700 mb-1">{stats.metrics.avgReservationValue.toFixed(0)}€</p>
            <div className="h-1 w-16 bg-gradient-to-r from-corsican-sea-400 to-corsican-sea-600 rounded-full"></div>
          </div>
          <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">Panier moyen (Boutique)</p>
            <p className="text-3xl font-bold text-corsican-maquis-700 mb-1">{stats.metrics.avgOrderValue.toFixed(0)}€</p>
            <div className="h-1 w-16 bg-gradient-to-r from-corsican-maquis-400 to-corsican-maquis-600 rounded-full"></div>
          </div>
          <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">Taux de fidélité</p>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-3xl font-bold text-purple-700">{stats.metrics.customerRetentionRate.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-stone-500">({stats.metrics.repeatCustomers} clients fidèles)</p>
          </div>
          <div className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
            <p className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">Note moyenne</p>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-3xl font-bold text-yellow-600">{stats.testimonials.avgRating.toFixed(1)}</p>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-stone-500">{stats.testimonials.published} avis publiés</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/reservations" className="group bg-white rounded-xl border-2 border-corsican-clay-200 p-6 hover:shadow-xl hover:border-corsican-clay-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-corsican-clay-600 uppercase tracking-wide">Réservations</h3>
            <div className="w-10 h-10 bg-corsican-sea-100 rounded-lg flex items-center justify-center group-hover:bg-corsican-sea-200 transition-colors">
              <Calendar className="h-5 w-5 text-corsican-sea-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-corsican-clay-900 mb-3">{stats.reservations.total}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {stats.reservations.confirmed} confirmées
            </span>
            <span className="flex items-center gap-1 text-yellow-600 font-medium">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {stats.reservations.pending} en attente
            </span>
          </div>
        </Link>

        <Link href="/dashboard/commandes" className="group bg-white rounded-xl border-2 border-corsican-clay-200 p-6 hover:shadow-xl hover:border-corsican-clay-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-corsican-clay-600 uppercase tracking-wide">Commandes</h3>
            <div className="w-10 h-10 bg-corsican-maquis-100 rounded-lg flex items-center justify-center group-hover:bg-corsican-maquis-200 transition-colors">
              <ShoppingBag className="h-5 w-5 text-corsican-maquis-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-corsican-clay-900 mb-3">{stats.orders.total}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {stats.orders.processing} en cours
            </span>
            <span className="flex items-center gap-1 text-purple-600 font-medium">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              {stats.orders.shipped} expédiées
            </span>
          </div>
        </Link>

        <Link href="/dashboard/produits" className="group bg-white rounded-xl border-2 border-corsican-clay-200 p-6 hover:shadow-xl hover:border-corsican-clay-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-corsican-clay-600 uppercase tracking-wide">Produits</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Package className="h-5 w-5 text-purple-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-corsican-clay-900 mb-3">{stats.products.total}</p>
          {stats.products.lowStock > 0 ? (
            <div className="flex items-center text-sm text-orange-600 font-medium">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {stats.products.lowStock} stock faible
            </div>
          ) : (
            <p className="text-sm text-green-600 font-medium">Stock OK</p>
          )}
        </Link>

        <Link href="/dashboard/clients" className="group bg-white rounded-xl border-2 border-corsican-clay-200 p-6 hover:shadow-xl hover:border-corsican-clay-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-corsican-clay-600 uppercase tracking-wide">Clients</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Users className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <p className="text-4xl font-bold text-corsican-clay-900 mb-3">{stats.customers.total}</p>
          <p className="text-sm text-corsican-clay-600 font-medium">Clients enregistrés</p>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/categories" className="group bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg hover:border-stone-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-corsican-clay-900">{stats.categories.total}</p>
              <p className="text-sm text-stone-600 font-medium">Catégories</p>
            </div>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-200 transition-colors">
              <Package className="h-5 w-5 text-stone-600" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/promotions" className="group bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg hover:border-stone-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-corsican-clay-900">{stats.promoCodes.active}</p>
              <p className="text-sm text-stone-600 font-medium">Codes promo</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Ticket className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/temoignages" className="group bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg hover:border-stone-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-corsican-clay-900">{stats.testimonials.published}</p>
              <p className="text-sm text-stone-600 font-medium">Avis publiés</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/blog" className="group bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg hover:border-stone-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-corsican-clay-900">Blog</p>
              <p className="text-xs text-stone-600">Gestion articles</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <div className="text-xl">📝</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      {chartData && (
        <div className="mb-8 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-corsican-clay-500 to-corsican-clay-700 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  Évolution des revenus
                </h2>
                <p className="text-sm text-stone-600">6 derniers mois - Revenus par source</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="shortMonth"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(0)}€`, '']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reservationsRevenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Réservations"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="ordersRevenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Boutique"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#059669"
                  strokeWidth={3}
                  name="Total"
                  dot={{ fill: '#059669', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Bar Chart */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-corsican-sea-500 to-corsican-sea-700 rounded-lg flex items-center justify-center shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">
                    Activité mensuelle
                  </h2>
                  <p className="text-sm text-stone-600">Nombre de transactions</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="reservations"
                    fill="#3b82f6"
                    name="Réservations"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#8b5cf6"
                    name="Commandes"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie Chart */}
            {chartData.categoryData.length > 0 && (
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-corsican-maquis-500 to-corsican-maquis-700 rounded-lg flex items-center justify-center shadow-md">
                    <PieChartIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                      Ventes par catégorie
                    </h2>
                    <p className="text-sm text-stone-600">Répartition du CA boutique</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[
                            '#3b82f6',
                            '#8b5cf6',
                            '#ec4899',
                            '#f59e0b',
                            '#10b981',
                            '#6366f1'
                          ][index % 6]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value.toFixed(0)}€`, 'Ventes']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
            <div className="w-8 h-8 bg-gradient-to-br from-corsican-sea-500 to-corsican-sea-700 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Réservations récentes
            </h2>
          </div>
          {stats.recentActivity.reservations.length === 0 ? (
            <p className="text-sm text-corsican-clay-600 text-center py-4">Aucune réservation</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-corsican-sand-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-corsican-clay-900">
                      {reservation.customer.firstName} {reservation.customer.lastName}
                    </p>
                    <p className="text-xs text-corsican-clay-600">
                      {format(new Date(reservation.checkIn), "dd MMM", { locale: fr })} - {format(new Date(reservation.checkOut), "dd MMM", { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-corsican-clay-900">{reservation.totalPrice.toFixed(0)}€</p>
                    <p className="text-xs text-corsican-clay-600">
                      {format(new Date(reservation.createdAt), "dd/MM", { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
            <div className="w-8 h-8 bg-gradient-to-br from-corsican-maquis-500 to-corsican-maquis-700 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Commandes récentes
            </h2>
          </div>
          {stats.recentActivity.orders.length === 0 ? (
            <p className="text-sm text-corsican-clay-600 text-center py-4">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-corsican-sand-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-corsican-clay-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-corsican-clay-600 font-mono">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-corsican-clay-900">{order.total.toFixed(0)}€</p>
                    <p className="text-xs text-corsican-clay-600">
                      {format(new Date(order.createdAt), "dd/MM", { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Testimonials */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">
              Avis récents
            </h2>
          </div>
          {stats.recentActivity.testimonials.length === 0 ? (
            <p className="text-sm text-corsican-clay-600 text-center py-4">Aucun avis</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-3 bg-corsican-sand-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-corsican-clay-900">
                      {testimonial.customerName}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-corsican-clay-600 line-clamp-2 mb-2">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${
                      testimonial.type === "gite"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {testimonial.type === "gite" ? "Gîte" : "Boutique"}
                    </span>
                    <span className="text-corsican-clay-500">
                      {format(new Date(testimonial.createdAt), "dd/MM", { locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
