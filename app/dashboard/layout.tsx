import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">U CASALE</h1>
              <p className="text-sm text-stone-600">Administration</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600">
                {session.user.name} ({session.user.role})
              </span>
              <form action={async () => {
                "use server"
                const { signOut } = await import("@/lib/auth")
                await signOut()
              }}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              📊 Tableau de bord
            </Link>
            <Link
              href="/dashboard/reservations"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              📅 Réservations
            </Link>
            <Link
              href="/dashboard/gite"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              🏡 Configuration Gîte
            </Link>
            <Link
              href="/dashboard/produits"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              🛍️ Produits
            </Link>
            <Link
              href="/dashboard/categories"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              📂 Catégories
            </Link>
            <Link
              href="/dashboard/commandes"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              📦 Commandes
            </Link>
            <Link
              href="/dashboard/promotions"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              🎫 Codes promo
            </Link>
            <Link
              href="/dashboard/clients"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              👥 Clients
            </Link>
            <Link
              href="/dashboard/faq"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              ❓ FAQ
            </Link>
            <Link
              href="/dashboard/temoignages"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              ⭐ Témoignages
            </Link>
            <Link
              href="/dashboard/parametres"
              className="block px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              ⚙️ Paramètres
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
