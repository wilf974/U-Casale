"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, HelpCircle, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    displayOrder: 0,
    published: true,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const categories = [
    { value: "all", label: "Toutes" },
    { value: "gite", label: "Gîte" },
    { value: "boutique", label: "Boutique" },
    { value: "reservation", label: "Réservation" },
    { value: "paiement", label: "Paiement" },
    { value: "general", label: "Général" },
  ]

  useEffect(() => {
    fetchFAQs()
  }, [categoryFilter])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const url = categoryFilter === "all"
        ? "/api/admin/faq"
        : `/api/admin/faq?category=${categoryFilter}`

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setFaqs(data.faqs)
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error)
      showMessage("error", "Erreur lors du chargement des FAQ")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq)
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "",
        displayOrder: faq.displayOrder,
        published: faq.published,
      })
    } else {
      setEditingFAQ(null)
      setFormData({
        question: "",
        answer: "",
        category: "",
        displayOrder: 0,
        published: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFAQ(null)
    setFormData({
      question: "",
      answer: "",
      category: "",
      displayOrder: 0,
      published: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const url = editingFAQ
        ? `/api/admin/faq/${editingFAQ.id}`
        : "/api/admin/faq"

      const response = await fetch(url, {
        method: editingFAQ ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("success", editingFAQ ? "FAQ mise à jour" : "FAQ créée")
        await fetchFAQs()
        handleCloseModal()
      } else {
        showMessage("error", data.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      console.error("Error saving FAQ:", error)
      showMessage("error", "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette FAQ ?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/faq/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        showMessage("success", "FAQ supprimée")
        await fetchFAQs()
      } else {
        const data = await response.json()
        showMessage("error", data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      showMessage("error", "Erreur lors de la suppression")
    }
  }

  const handleTogglePublished = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/admin/faq/${faq.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !faq.published }),
      })

      if (response.ok) {
        await fetchFAQs()
      } else {
        showMessage("error", "Erreur lors de la modification")
      }
    } catch (error) {
      console.error("Error toggling published:", error)
      showMessage("error", "Erreur lors de la modification")
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
            Questions Fréquentes (FAQ)
          </h1>
          <p className="text-corsican-clay-700">
            Gérez les questions et réponses de votre site
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-corsican-clay-600 text-white font-medium rounded-lg hover:bg-corsican-clay-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une FAQ
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
        <label className="text-sm font-medium text-corsican-clay-700">Catégorie:</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat.value
                  ? "bg-corsican-clay-600 text-white"
                  : "bg-white text-corsican-clay-700 border border-corsican-clay-300 hover:bg-corsican-clay-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-12 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">Aucune FAQ pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-corsican-clay-900">
                      {faq.question}
                    </h3>
                    {!faq.published && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        Non publié
                      </span>
                    )}
                    {faq.category && (
                      <span className="px-2 py-1 bg-corsican-sea-100 text-corsican-sea-800 text-xs font-medium rounded">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <p className="text-corsican-clay-700 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                  <p className="text-xs text-corsican-clay-500 mt-2">
                    Ordre: {faq.displayOrder}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleTogglePublished(faq)}
                    className={`p-2 rounded-lg transition-colors ${
                      faq.published
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={faq.published ? "Dépublier" : "Publier"}
                  >
                    {faq.published ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(faq)}
                    className="p-2 text-corsican-clay-600 hover:bg-corsican-clay-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
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
                {editingFAQ ? "Modifier la FAQ" : "Nouvelle FAQ"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Quelle est votre question ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Réponse *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Réponse détaillée..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  >
                    <option value="">Aucune</option>
                    <option value="gite">Gîte</option>
                    <option value="boutique">Boutique</option>
                    <option value="reservation">Réservation</option>
                    <option value="paiement">Paiement</option>
                    <option value="general">Général</option>
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-corsican-clay-600 focus:ring-corsican-clay-500 border-corsican-clay-300 rounded"
                />
                <label htmlFor="published" className="ml-2 text-sm text-corsican-clay-700">
                  Publier cette FAQ
                </label>
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
                    editingFAQ ? "Mettre à jour" : "Créer"
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
