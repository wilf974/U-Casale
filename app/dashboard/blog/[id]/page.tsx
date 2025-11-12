"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    author: "U Casale",
    category: "",
    tags: "",
    published: false,
    metaTitle: "",
    metaDescription: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`)
      const data = await response.json()

      if (response.ok) {
        const post = data.post
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          featuredImage: post.featuredImage || "",
          author: post.author,
          category: post.category || "",
          tags: post.tags.join(", "),
          published: post.published,
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
        })
      } else {
        alert("Article introuvable")
        router.push("/dashboard/blog")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      alert("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert("Titre, slug et contenu sont requis")
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          published: publish || formData.published,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Article mis à jour")
        if (publish && !formData.published) {
          setFormData((prev) => ({ ...prev, published: true }))
        }
      } else {
        alert(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard/blog")
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-corsican-maquis-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux articles
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">Modifier l'article</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete()}
            disabled={deleting || saving}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            Supprimer
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving || deleting}
            className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Enregistrer
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving || deleting}
            className="flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            {formData.published ? "Enregistrer" : "Publier"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Titre de l'article"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-lg font-semibold"
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              URL (slug) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="url-de-l-article"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
            <p className="text-xs text-stone-500 mt-2">
              URL: /blog/{formData.slug}
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Extrait
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Court résumé de l'article (optionnel)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Contenu *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Contenu de l'article (Markdown supporté)"
              rows={20}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 font-mono text-sm"
            />
            <p className="text-xs text-stone-500 mt-2">
              Markdown est supporté (gras, italique, liens, listes, etc.)
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Statut</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              formData.published
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}>
              {formData.published ? "✓ Publié" : "○ Brouillon"}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Image mise en avant
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
            {formData.featuredImage && (
              <div className="mt-4">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            >
              <option value="">Sélectionner...</option>
              <option value="actualites">Actualités</option>
              <option value="recettes">Recettes</option>
              <option value="conseils">Conseils</option>
              <option value="decouverte">Découverte</option>
              <option value="culture">Culture Corse</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="corse, produits, artisanat"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
            <p className="text-xs text-stone-500 mt-2">Séparer par des virgules</p>
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Auteur
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
            />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="Titre pour les moteurs de recherche"
                  maxLength={60}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">
                  {formData.metaTitle.length}/60 caractères
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Description pour les moteurs de recherche"
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">
                  {formData.metaDescription.length}/160 caractères
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
