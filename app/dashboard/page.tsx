import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  const session = await auth()

  // Fetch dashboard statistics
  const [
    totalReservations,
    totalProducts,
    totalOrders,
    totalCustomers,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.customer.count(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Bienvenue, {session?.user.name} 👋
        </h1>
        <p className="text-stone-600">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-stone-600">Réservations</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{totalReservations}</p>
          <p className="text-sm text-stone-500 mt-1">Total des réservations</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-stone-600">Produits</h3>
            <span className="text-2xl">🛍️</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{totalProducts}</p>
          <p className="text-sm text-stone-500 mt-1">Produits en catalogue</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-stone-600">Commandes</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{totalOrders}</p>
          <p className="text-sm text-stone-500 mt-1">Total des commandes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-stone-600">Clients</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{totalCustomers}</p>
          <p className="text-sm text-stone-500 mt-1">Clients enregistrés</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/reservations"
            className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-900 transition text-center"
          >
            <span className="text-3xl mb-2 block">📅</span>
            <span className="font-medium">Voir les réservations</span>
          </a>
          <a
            href="/dashboard/produits"
            className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-900 transition text-center"
          >
            <span className="text-3xl mb-2 block">➕</span>
            <span className="font-medium">Ajouter un produit</span>
          </a>
          <a
            href="/dashboard/commandes"
            className="p-4 border-2 border-stone-200 rounded-lg hover:border-stone-900 transition text-center"
          >
            <span className="text-3xl mb-2 block">📦</span>
            <span className="font-medium">Gérer les commandes</span>
          </a>
        </div>
      </div>
    </div>
  )
}
