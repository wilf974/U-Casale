"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert("Titre, slug et contenu sont requis")
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
          published: !asDraft && formData.published,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard/blog")
      } else {
        alert(data.error || "Erreur lors de la création")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Erreur lors de la création")
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-3xl font-bold text-stone-900">Nouvel article</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Enregistrer brouillon
          </button>
          <button
            onClick={() => {
              setFormData((prev) => ({ ...prev, published: true }))
              handleSubmit(false)
            }}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            Publier
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
              URL: /blog/{formData.slug || "url-de-l-article"}
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
