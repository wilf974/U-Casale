"use client"

import { useState, useEffect } from "react"
import { Save, Euro, Users, Calendar, Percent, Sparkles, X, Plus, Loader2 } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { fr } from "date-fns/locale"
import { format } from "date-fns"
import "react-day-picker/dist/style.css"

interface GiteConfig {
  id: string
  pricePerNight: number
  minimumStay: number
  maxGuests: number
  cleaningFee: number
  taxRate: number
  blockedDates: string[]
}

export default function GiteConfigPage() {
  const [config, setConfig] = useState<GiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const [formData, setFormData] = useState({
    pricePerNight: 0,
    minimumStay: 1,
    maxGuests: 6,
    cleaningFee: 0,
    taxRate: 0,
  })

  const [blockedDates, setBlockedDates] = useState<Date[]>([])

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/gite/config")
      const data = await response.json()

      if (response.ok) {
        setConfig(data.config)
        setFormData({
          pricePerNight: data.config.pricePerNight,
          minimumStay: data.config.minimumStay,
          maxGuests: data.config.maxGuests,
          cleaningFee: data.config.cleaningFee,
          taxRate: data.config.taxRate,
        })
        setBlockedDates(data.config.blockedDates.map((d: string) => new Date(d)))
      } else {
        setError(data.error || "Erreur lors du chargement")
      }
    } catch (error) {
      console.error("Error fetching config:", error)
      setError("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/gite/config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          blockedDates: blockedDates.map(d => d.toISOString()),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Configuration mise à jour avec succès")
        setConfig(data.config)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating config:", error)
      setError("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  const addBlockedDate = () => {
    if (selectedDate && !blockedDates.some(d => d.toDateString() === selectedDate.toDateString())) {
      setBlockedDates([...blockedDates, selectedDate].sort((a, b) => a.getTime() - b.getTime()))
      setSelectedDate(undefined)
    }
  }

  const removeBlockedDate = (dateToRemove: Date) => {
    setBlockedDates(blockedDates.filter(d => d.toDateString() !== dateToRemove.toDateString()))
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
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
          Configuration du gîte
        </h1>
        <p className="text-corsican-clay-700">
          Gérez les tarifs, disponibilités et paramètres du gîte
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tarification */}
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Euro className="h-6 w-6 text-corsican-clay-600" />
              <h2 className="text-xl font-semibold text-corsican-clay-900">
                Tarification
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Prix par nuit (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Frais de ménage (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cleaningFee}
                  onChange={(e) => setFormData({ ...formData, cleaningFee: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Taxe de séjour (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={(formData.taxRate * 100).toFixed(2)}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) / 100 })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    required
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                </div>
                <p className="text-xs text-corsican-clay-600 mt-1">
                  Équivalent à {(formData.taxRate * 100).toFixed(2)}% du sous-total
                </p>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-corsican-clay-600" />
              <h2 className="text-xl font-semibold text-corsican-clay-900">
                Paramètres
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Séjour minimum (nuits)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minimumStay}
                  onChange={(e) => setFormData({ ...formData, minimumStay: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Nombre maximum de personnes
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    required
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-corsican-clay-200">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>

          {/* Dates bloquées */}
          <div className="lg:col-span-2 bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-6 w-6 text-corsican-clay-600" />
              <h2 className="text-xl font-semibold text-corsican-clay-900">
                Dates bloquées
              </h2>
            </div>

            <p className="text-sm text-corsican-clay-700 mb-6">
              Bloquez des dates pour rendre le gîte indisponible (maintenance, événements personnels, etc.)
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <h3 className="text-sm font-medium text-corsican-clay-700 mb-3">
                  Ajouter une date
                </h3>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  locale={fr}
                  className="border rounded-lg p-4"
                  modifiersClassNames={{
                    selected: "bg-corsican-clay-600 text-white",
                    today: "font-bold text-corsican-clay-700",
                  }}
                />
                <button
                  type="button"
                  onClick={addBlockedDate}
                  disabled={!selectedDate}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-corsican-maquis-600 text-white font-semibold hover:bg-corsican-maquis-700 transition-all disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter cette date
                </button>
              </div>

              {/* Liste des dates bloquées */}
              <div>
                <h3 className="text-sm font-medium text-corsican-clay-700 mb-3">
                  Dates actuellement bloquées ({blockedDates.length})
                </h3>
                <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {blockedDates.length === 0 ? (
                    <p className="text-sm text-corsican-clay-600 text-center py-8">
                      Aucune date bloquée
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {blockedDates.map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-corsican-sand-50 rounded-lg border border-corsican-sand-200"
                        >
                          <span className="text-sm font-medium text-corsican-clay-900">
                            {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBlockedDate(date)}
                            className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
