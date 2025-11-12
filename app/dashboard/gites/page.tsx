"use client"

import { useState, useEffect } from "react"
import { Home, Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2, MapPin, Users, Euro, Star } from "lucide-react"
import Link from "next/link"

interface Gite {
  id: string
  slug: string
  name: string
  shortDescription?: string
  maxGuests: number
  bedrooms: number
  pricePerNight: number
  city?: string
  images: string[]
  featuredImage?: string
  available: boolean
  featured: boolean
  displayOrder: number
  createdAt: string
}

export default function GitesManagementPage() {
  const [gites, setGites] = useState<Gite[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "available" | "unavailable">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchGites()
  }, [filter])

  const fetchGites = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === "available") params.append("available", "true")
      if (filter === "unavailable") params.append("available", "false")

      const response = await fetch(`/api/admin/gites?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setGites(data.gites)
      }
    } catch (error) {
      console.error("Error fetching gites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le gîte "${name}" ?\n\nAttention : Cette action est irréversible.`)) return

    try {
      const response = await fetch(`/api/admin/gites/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchGites()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting gite:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const toggleAvailable = async (gite: Gite) => {
    try {
      const response = await fetch(`/api/admin/gites/${gite.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !gite.available }),
      })

      if (response.ok) {
        fetchGites()
      }
    } catch (error) {
      console.error("Error toggling available:", error)
    }
  }

  const toggleFeatured = async (gite: Gite) => {
    try {
      const response = await fetch(`/api/admin/gites/${gite.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !gite.featured }),
      })

      if (response.ok) {
        fetchGites()
      }
    } catch (error) {
      console.error("Error toggling featured:", error)
    }
  }

  const filteredGites = gites.filter((gite) =>
    gite.name.toLowerCase().includes(search.toLowerCase()) ||
    gite.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Gestion des Gîtes</h1>
          <p className="text-stone-600">Gérez vos gîtes disponibles à la location</p>
        </div>
        <Link
          href="/dashboard/gites/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nouveau gîte
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-stone-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un gîte..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
          </div>

          {/* Availability Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Tous ({gites.length})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "available"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Disponibles
            </button>
            <button
              onClick={() => setFilter("unavailable")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "unavailable"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Indisponibles
            </button>
          </div>
        </div>
      </div>

      {/* Gites Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-corsican-maquis-600 animate-spin" />
        </div>
      ) : filteredGites.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-stone-200">
          <Home className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-900 mb-2">
            Aucun gîte
          </h3>
          <p className="text-stone-600 mb-6">
            {search
              ? "Aucun gîte ne correspond à votre recherche"
              : "Commencez par créer votre premier gîte"}
          </p>
          {!search && (
            <Link
              href="/dashboard/gites/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Créer un gîte
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGites.map((gite) => (
            <div
              key={gite.id}
              className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-stone-100">
                {gite.featuredImage || gite.images[0] ? (
                  <img
                    src={gite.featuredImage || gite.images[0]}
                    alt={gite.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-16 w-16 text-stone-300" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {gite.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                      <Star className="h-3 w-3" />
                      Vedette
                    </span>
                  )}
                  {!gite.available && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      Indisponible
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-stone-900 mb-1">{gite.name}</h3>
                {gite.shortDescription && (
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2">{gite.shortDescription}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
                  {gite.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {gite.city}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {gite.maxGuests} pers.
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {gite.bedrooms} ch.
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-200">
                  <div>
                    <div className="text-2xl font-bold text-corsican-clay-700">
                      {gite.pricePerNight.toFixed(0)}€
                    </div>
                    <div className="text-xs text-stone-500">par nuit</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(gite)}
                      className={`p-2 rounded-lg transition-colors ${
                        gite.featured
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                      title={gite.featured ? "Retirer de la vedette" : "Mettre en vedette"}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleAvailable(gite)}
                      className={`p-2 rounded-lg transition-colors ${
                        gite.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      title={gite.available ? "Marquer indisponible" : "Marquer disponible"}
                    >
                      {gite.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/gites/${gite.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(gite.id, gite.name)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
