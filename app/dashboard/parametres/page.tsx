"use client"

import { useState, useEffect, useMemo } from "react"
import { Save, Loader2, AlertCircle, CheckCircle, Globe, Mail, Phone, MapPin, Facebook, Instagram, Settings, Map } from "lucide-react"

interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  facebookUrl: string | null
  instagramUrl: string | null
  maintenanceMode: boolean
  updatedAt: string
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    latitude: "",
    longitude: "",
    facebookUrl: "",
    instagramUrl: "",
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings")
      const data = await response.json()

      if (response.ok) {
        setSettings(data.settings)
        setFormData({
          siteName: data.settings.siteName || "",
          siteDescription: data.settings.siteDescription || "",
          contactEmail: data.settings.contactEmail || "",
          contactPhone: data.settings.contactPhone || "",
          address: data.settings.address || "",
          latitude: data.settings.latitude?.toString() || "",
          longitude: data.settings.longitude?.toString() || "",
          facebookUrl: data.settings.facebookUrl || "",
          instagramUrl: data.settings.instagramUrl || "",
          maintenanceMode: data.settings.maintenanceMode || false,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setMessage({ type: "error", text: "Erreur lors du chargement des paramètres" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSettings(data.settings)
        setMessage({ type: "success", text: "Paramètres enregistrés avec succès" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'enregistrement" })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement" })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  // Mémoriser l'URL de la carte pour éviter de la recalculer à chaque render
  const mapUrl = useMemo(() => {
    const lat = parseFloat(formData.latitude)
    const lon = parseFloat(formData.longitude)

    if (isNaN(lat) || isNaN(lon)) {
      return null
    }

    // OpenStreetMap embed
    const zoom = 13
    const bbox = `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
  }, [formData.latitude, formData.longitude])

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
          Paramètres du site
        </h1>
        <p className="text-corsican-clay-700">
          Gérez les paramètres généraux de votre site
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-corsican-clay-100 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-corsican-clay-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-corsican-clay-900">
              Informations générales
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Nom du site *
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                placeholder="U Casale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Description du site
              </label>
              <textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                placeholder="Gîte de charme en Corse avec boutique de produits locaux..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-corsican-sea-100 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-corsican-sea-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-corsican-clay-900">
              Coordonnées
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Email de contact
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="contact@ucasale.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="+33 4 95 XX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-corsican-clay-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-11 pr-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Route de Sartène, 20100 Sartène, Corse"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="41.6167"
                />
                <p className="text-xs text-corsican-clay-500 mt-1">
                  Pour afficher une carte sur le site
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="8.7372"
                />
                <p className="text-xs text-corsican-clay-500 mt-1">
                  Utilisez Google Maps pour trouver les coordonnées
                </p>
              </div>
            </div>

            {/* Prévisualisation de la carte */}
            {mapUrl ? (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Map className="h-4 w-4 text-corsican-clay-600" />
                  <label className="text-sm font-medium text-corsican-clay-700">
                    Prévisualisation de la carte
                  </label>
                </div>
                <div className="rounded-lg overflow-hidden border-2 border-corsican-clay-300">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="300"
                    className="border-0"
                    title="Prévisualisation de la carte"
                  />
                </div>
                <p className="text-xs text-corsican-clay-500 mt-2">
                  Cette carte se met à jour automatiquement quand vous modifiez les coordonnées
                </p>
              </div>
            ) : formData.latitude || formData.longitude ? (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Coordonnées invalides</p>
                  <p>
                    Vérifiez que vous avez entré des nombres valides pour la latitude et la longitude.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-corsican-maquis-100 rounded-lg flex items-center justify-center">
              <Instagram className="h-5 w-5 text-corsican-maquis-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-corsican-clay-900">
              Réseaux sociaux
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="https://facebook.com/ucasale"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 border border-corsican-clay-300 rounded-lg focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="https://instagram.com/ucasale"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-corsican-clay-900">
              Paramètres système
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex-1">
              <h3 className="font-medium text-corsican-clay-900 mb-1">
                Mode maintenance
              </h3>
              <p className="text-sm text-corsican-clay-600">
                Désactive temporairement l'accès public au site
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-corsican-clay-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-corsican-clay-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {formData.maintenanceMode && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Mode maintenance activé</p>
                <p>
                  Les visiteurs verront une page de maintenance. Seuls les administrateurs
                  authentifiés peuvent accéder au site.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-corsican-clay-600 text-white font-medium rounded-lg hover:bg-corsican-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
