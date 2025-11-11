"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, MessageSquare, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react"

interface Testimonial {
  id: string
  customerName: string
  content: string
  rating: number
  type: string
  verified: boolean
  published: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    content: "",
    rating: 5,
    type: "gite",
    verified: false,
    published: true,
    displayOrder: 0,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const types = [
    { value: "all", label: "Tous" },
    { value: "gite", label: "Gîte" },
    { value: "boutique", label: "Boutique" },
  ]

  useEffect(() => {
    fetchTestimonials()
  }, [typeFilter])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const url = typeFilter === "all"
        ? "/api/admin/testimonials"
        : `/api/admin/testimonials?type=${typeFilter}`

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      showMessage("error", "Erreur lors du chargement des témoignages")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        customerName: testimonial.customerName,
        content: testimonial.content,
        rating: testimonial.rating,
        type: testimonial.type,
        verified: testimonial.verified,
        published: testimonial.published,
        displayOrder: testimonial.displayOrder,
      })
    } else {
      setEditingTestimonial(null)
      setFormData({
        customerName: "",
        content: "",
        rating: 5,
        type: "gite",
        verified: false,
        published: true,
        displayOrder: 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTestimonial(null)
    setFormData({
      customerName: "",
      content: "",
      rating: 5,
      type: "gite",
      verified: false,
      published: true,
      displayOrder: 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : "/api/admin/testimonials"

      const response = await fetch(url, {
        method: editingTestimonial ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("success", editingTestimonial ? "Témoignage mis à jour" : "Témoignage créé")
        await fetchTestimonials()
        handleCloseModal()
      } else {
        showMessage("error", data.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      console.error("Error saving testimonial:", error)
      showMessage("error", "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        showMessage("success", "Témoignage supprimé")
        await fetchTestimonials()
      } else {
        const data = await response.json()
        showMessage("error", data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      showMessage("error", "Erreur lors de la suppression")
    }
  }

  const handleTogglePublished = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !testimonial.published }),
      })

      if (response.ok) {
        await fetchTestimonials()
      } else {
        showMessage("error", "Erreur lors de la modification")
      }
    } catch (error) {
      console.error("Error toggling published:", error)
      showMessage("error", "Erreur lors de la modification")
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
            Témoignages Clients
          </h1>
          <p className="text-corsican-clay-700">
            Gérez les avis et témoignages de vos clients
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-corsican-clay-600 text-white font-medium rounded-lg hover:bg-corsican-clay-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un témoignage
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="text-sm font-medium text-corsican-clay-700">Type:</label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === type.value
                  ? "bg-corsican-clay-600 text-white"
                  : "bg-white text-corsican-clay-700 border border-corsican-clay-300 hover:bg-corsican-clay-50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">Aucun témoignage pour le moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-corsican-clay-900">
                      {testimonial.customerName}
                    </h3>
                    {testimonial.verified && (
                      <div title="Vérifié">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              <p className="text-sm text-corsican-clay-700 mb-4 flex-1 line-clamp-4">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-corsican-clay-200">
                <div className="flex items-center space-x-2">
                  {!testimonial.published && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      Caché
                    </span>
                  )}
                  <span className="px-2 py-1 bg-corsican-sea-100 text-corsican-sea-800 text-xs font-medium rounded">
                    {testimonial.type === "gite" ? "Gîte" : "Boutique"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTogglePublished(testimonial)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.published
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={testimonial.published ? "Dépublier" : "Publier"}
                  >
                    {testimonial.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(testimonial)}
                    className="p-2 text-corsican-clay-600 hover:bg-corsican-clay-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-corsican-clay-200">
              <h2 className="text-2xl font-serif font-bold text-corsican-clay-900">
                {editingTestimonial ? "Modifier le témoignage" : "Nouveau témoignage"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Témoignage *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Partagez votre expérience..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Note *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  >
                    <option value="gite">Gîte</option>
                    <option value="boutique">Boutique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="h-4 w-4 text-corsican-clay-600 focus:ring-corsican-clay-500 border-corsican-clay-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 text-sm text-corsican-clay-700">
                    Témoignage vérifié (client authentique)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 text-corsican-clay-600 focus:ring-corsican-clay-500 border-corsican-clay-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 text-sm text-corsican-clay-700">
                    Publier ce témoignage
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-corsican-clay-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-corsican-clay-300 text-corsican-clay-700 font-medium rounded-lg hover:bg-corsican-clay-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-corsican-clay-600 text-white font-medium rounded-lg hover:bg-corsican-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin inline" />
                      Enregistrement...
                    </>
                  ) : (
                    editingTestimonial ? "Mettre à jour" : "Créer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
