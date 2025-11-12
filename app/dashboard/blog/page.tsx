"use client"

import { useState, useEffect } from "react"
import { FileText, Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  category?: string
  tags: string[]
  published: boolean
  publishedAt?: string
  viewCount: number
  createdAt: string
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === "published") params.append("published", "true")
      if (filter === "draft") params.append("published", "false")

      const response = await fetch(`/api/admin/blog?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article "${title}" ?`)) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error("Error toggling published:", error)
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Blog</h1>
          <p className="text-stone-600">Gérez vos articles de blog</p>
        </div>
        <Link
          href="/dashboard/blog/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nouvel article
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
              placeholder="Rechercher un article..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Tous ({posts.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "published"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Publiés
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "draft"
                  ? "bg-corsican-maquis-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Brouillons
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-corsican-maquis-600 animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-stone-200">
          <FileText className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-900 mb-2">
            Aucun article
          </h3>
          <p className="text-stone-600 mb-6">
            {search
              ? "Aucun article ne correspond à votre recherche"
              : "Commencez par créer votre premier article de blog"}
          </p>
          {!search && (
            <Link
              href="/dashboard/blog/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Créer un article
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-stone-900">
                  Article
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-stone-900">
                  Catégorie
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-stone-900">
                  Vues
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-stone-900">
                  Date
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-stone-900">
                  Statut
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-stone-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        href={`/dashboard/blog/${post.id}`}
                        className="font-medium text-stone-900 hover:text-corsican-maquis-700 transition-colors"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.category ? (
                      <span className="inline-block px-3 py-1 bg-corsican-maquis-100 text-corsican-maquis-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    ) : (
                      <span className="text-stone-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-stone-600">{post.viewCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: fr })
                        : format(new Date(post.createdAt), "d MMM yyyy", { locale: fr })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Publié
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Brouillon
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/blog/${post.id}`}
                        className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  )
}
