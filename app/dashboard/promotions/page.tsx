"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Ticket, Loader2, Eye, EyeOff, Percent, Euro } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PromoCode {
  id: string
  code: string
  type: string
  value: number
  minOrderAmount: number | null
  maxUses: number | null
  currentUses: number
  validFrom: string | null
  validUntil: string | null
  active: boolean
  createdAt: string
}

export default function PromotionsPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: 0,
    minOrderAmount: "",
    maxUses: "",
    validFrom: "",
    validUntil: "",
    active: true,
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/promo-codes")
      const data = await response.json()

      if (response.ok) {
        setPromoCodes(data.promoCodes)
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (promoCode?: PromoCode) => {
    if (promoCode) {
      setEditingPromoCode(promoCode)
      setFormData({
        code: promoCode.code,
        type: promoCode.type as "PERCENTAGE" | "FIXED",
        value: promoCode.value,
        minOrderAmount: promoCode.minOrderAmount?.toString() || "",
        maxUses: promoCode.maxUses?.toString() || "",
        validFrom: promoCode.validFrom ? format(new Date(promoCode.validFrom), "yyyy-MM-dd") : "",
        validUntil: promoCode.validUntil ? format(new Date(promoCode.validUntil), "yyyy-MM-dd") : "",
        active: promoCode.active,
      })
    } else {
      setEditingPromoCode(null)
      setFormData({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        minOrderAmount: "",
        maxUses: "",
        validFrom: "",
        validUntil: "",
        active: true,
      })
    }
    setError("")
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPromoCode(null)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const url = editingPromoCode
        ? `/api/admin/promo-codes/${editingPromoCode.id}`
        : "/api/admin/promo-codes"

      const response = await fetch(url, {
        method: editingPromoCode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchPromoCodes()
        handleCloseModal()
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Error saving promo code:", error)
      setError("Une erreur est survenue")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (promoCode: PromoCode) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le code "${promoCode.code}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/promo-codes/${promoCode.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPromoCodes()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting promo code:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const isExpired = (promoCode: PromoCode) => {
    if (!promoCode.validUntil) return false
    return new Date(promoCode.validUntil) < new Date()
  }

  const isMaxedOut = (promoCode: PromoCode) => {
    if (!promoCode.maxUses) return false
    return promoCode.currentUses >= promoCode.maxUses
  }

  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter(p => p.active && !isExpired(p)).length,
    expired: promoCodes.filter(p => isExpired(p)).length,
    inactive: promoCodes.filter(p => !p.active).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Codes promo
            </h1>
            <p className="text-corsican-clay-700">
              Gérez les codes promotionnels et réductions
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau code promo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200">
            <p className="text-sm text-corsican-clay-600">Total codes</p>
            <p className="text-2xl font-bold text-corsican-clay-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-green-200">
            <p className="text-sm text-green-600">Actifs</p>
            <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-red-200">
            <p className="text-sm text-red-600">Expirés</p>
            <p className="text-2xl font-bold text-red-700">{stats.expired}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <p className="text-sm text-gray-600">Inactifs</p>
            <p className="text-2xl font-bold text-gray-700">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* Promo Codes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          <p className="text-corsican-clay-700">Chargement...</p>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-corsican-clay-200">
          <Ticket className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">Aucun code promo pour le moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((promoCode) => {
            const expired = isExpired(promoCode)
            const maxedOut = isMaxedOut(promoCode)

            return (
              <div
                key={promoCode.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all ${
                  !promoCode.active || expired || maxedOut
                    ? "border-gray-200 opacity-60"
                    : "border-corsican-clay-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Ticket className="h-5 w-5 text-corsican-clay-600" />
                      <h3 className="text-xl font-bold font-mono text-corsican-clay-900">
                        {promoCode.code}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {promoCode.type === "PERCENTAGE" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-corsican-sand-100 text-corsican-sand-800 text-sm font-semibold">
                          <Percent className="h-3 w-3 mr-1" />
                          -{promoCode.value}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-corsican-maquis-100 text-corsican-maquis-800 text-sm font-semibold">
                          <Euro className="h-3 w-3 mr-1" />
                          -{promoCode.value}€
                        </span>
                      )}
                      {promoCode.active && !expired && !maxedOut ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          <Eye className="h-3 w-3 mr-1" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                          <EyeOff className="h-3 w-3 mr-1" />
                          {expired ? "Expiré" : maxedOut ? "Épuisé" : "Inactif"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-corsican-clay-700 mb-4">
                  {promoCode.minOrderAmount && (
                    <p>• Commande minimum: {promoCode.minOrderAmount}€</p>
                  )}
                  {promoCode.maxUses && (
                    <p>• Utilisations: {promoCode.currentUses}/{promoCode.maxUses}</p>
                  )}
                  {promoCode.validFrom && (
                    <p>• Valide du {format(new Date(promoCode.validFrom), "dd/MM/yyyy", { locale: fr })}</p>
                  )}
                  {promoCode.validUntil && (
                    <p>• Jusqu'au {format(new Date(promoCode.validUntil), "dd/MM/yyyy", { locale: fr })}</p>
                  )}
                </div>

                <div className="flex space-x-2 pt-4 border-t border-corsican-clay-200">
                  <button
                    onClick={() => handleOpenModal(promoCode)}
                    className="flex-1 p-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors"
                  >
                    <Edit className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(promoCode)}
                    className="flex-1 p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-corsican-clay-200">
              <h2 className="text-2xl font-serif font-bold text-corsican-clay-900">
                {editingPromoCode ? "Modifier le code promo" : "Nouveau code promo"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition font-mono text-lg"
                  placeholder="PROMO2024"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "PERCENTAGE" | "FIXED" })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    required
                  >
                    <option value="PERCENTAGE">Pourcentage</option>
                    <option value="FIXED">Montant fixe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Valeur * {formData.type === "PERCENTAGE" ? "(%)" : "(€)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.type === "PERCENTAGE" ? "100" : undefined}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Montant minimum de commande (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  placeholder="Optionnel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Nombre maximum d'utilisations
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  placeholder="Illimité"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Valide à partir du
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Valide jusqu'au
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-corsican-clay-600 rounded focus:ring-corsican-clay-500"
                  />
                  <span className="text-sm font-medium text-corsican-clay-700">
                    Code actif
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 font-medium hover:bg-corsican-clay-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : editingPromoCode ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
