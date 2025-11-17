"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Plus, X } from "lucide-react"

export default function EditHomePagePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    giteTitle: "",
    giteDescription: "",
    giteFeatures: [] as string[],
    giteImage: "",
    boutiqueTitle: "",
    boutiqueDescription: "",
    boutiqueFeatures: [] as string[],
    boutiqueImage: "",
    locationTitle: "",
    locationDescription: "",
    ctaTitle: "",
    ctaDescription: "",
  })

  const [uploadingGiteImage, setUploadingGiteImage] = useState(false)
  const [uploadingBoutiqueImage, setUploadingBoutiqueImage] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/admin/homepage")
      const data = await response.json()

      if (data.success && data.content) {
        setFormData({
          heroTitle: data.content.heroTitle || "",
          heroSubtitle: data.content.heroSubtitle || "",
          heroDescription: data.content.heroDescription || "",
          giteTitle: data.content.giteTitle || "",
          giteDescription: data.content.giteDescription || "",
          giteFeatures: Array.isArray(data.content.giteFeatures)
            ? data.content.giteFeatures
            : [],
          giteImage: data.content.giteImage || "",
          boutiqueTitle: data.content.boutiqueTitle || "",
          boutiqueDescription: data.content.boutiqueDescription || "",
          boutiqueFeatures: Array.isArray(data.content.boutiqueFeatures)
            ? data.content.boutiqueFeatures
            : [],
          boutiqueImage: data.content.boutiqueImage || "",
          locationTitle: data.content.locationTitle || "",
          locationDescription: data.content.locationDescription || "",
          ctaTitle: data.content.ctaTitle || "",
          ctaDescription: data.content.ctaDescription || "",
        })
      }
    } catch (error) {
      console.error("Error fetching homepage content:", error)
      setError("Erreur lors du chargement du contenu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || "Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error("Error saving homepage content:", error)
      setError("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const addFeature = (section: "giteFeatures" | "boutiqueFeatures") => {
    setFormData({
      ...formData,
      [section]: [...formData[section], ""],
    })
  }

  const removeFeature = (section: "giteFeatures" | "boutiqueFeatures", index: number) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index),
    })
  }

  const updateFeature = (
    section: "giteFeatures" | "boutiqueFeatures",
    index: number,
    value: string
  ) => {
    const newFeatures = [...formData[section]]
    newFeatures[index] = value
    setFormData({
      ...formData,
      [section]: newFeatures,
    })
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "giteImage" | "boutiqueImage"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const setUploading = section === "giteImage" ? setUploadingGiteImage : setUploadingBoutiqueImage

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "general")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          [section]: data.url,
        }))
      } else {
        setError(data.error || "Erreur lors de l'upload")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Erreur lors de l'upload de l'image")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-corsican-clay-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
            Modifier la page d'accueil
          </h1>
          <p className="text-corsican-clay-600">
            Personnalisez le contenu de votre page d'accueil
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            Les modifications ont été enregistrées avec succès !
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Hero */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-corsican-stone-200">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Section Hero (En-tête)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Titre principal
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="U Casale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Seni Production"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.heroDescription}
                  onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Découvrez l'authenticité corse..."
                />
              </div>
            </div>
          </div>

          {/* Section Gîte */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-corsican-stone-200">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Section Gîte
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.giteTitle}
                  onChange={(e) => setFormData({ ...formData, giteTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Un havre de paix..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.giteDescription}
                  onChange={(e) => setFormData({ ...formData, giteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Notre gîte authentique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Caractéristiques
                </label>
                {formData.giteFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature("giteFeatures", index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                      placeholder="Capacité jusqu'à 6 personnes"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature("giteFeatures", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature("giteFeatures")}
                  className="mt-2 inline-flex items-center px-4 py-2 text-sm text-corsican-clay-700 hover:bg-corsican-clay-50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une caractéristique
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Image du gîte
                </label>
                {formData.giteImage && (
                  <div className="mb-3">
                    <img
                      src={formData.giteImage}
                      alt="Aperçu gîte"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "giteImage")}
                  disabled={uploadingGiteImage}
                  className="block w-full text-sm text-corsican-clay-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-corsican-clay-50 file:text-corsican-clay-700 hover:file:bg-corsican-clay-100 disabled:opacity-50"
                />
                {uploadingGiteImage && (
                  <p className="text-sm text-corsican-clay-600 mt-2 flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Boutique */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-corsican-stone-200">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Section Boutique
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.boutiqueTitle}
                  onChange={(e) => setFormData({ ...formData, boutiqueTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Produits artisanaux corses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.boutiqueDescription}
                  onChange={(e) => setFormData({ ...formData, boutiqueDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Seni Production vous propose..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Caractéristiques
                </label>
                {formData.boutiqueFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature("boutiqueFeatures", index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                      placeholder="Production locale et artisanale"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature("boutiqueFeatures", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature("boutiqueFeatures")}
                  className="mt-2 inline-flex items-center px-4 py-2 text-sm text-corsican-clay-700 hover:bg-corsican-clay-50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une caractéristique
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Image de la boutique
                </label>
                {formData.boutiqueImage && (
                  <div className="mb-3">
                    <img
                      src={formData.boutiqueImage}
                      alt="Aperçu boutique"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "boutiqueImage")}
                  disabled={uploadingBoutiqueImage}
                  className="block w-full text-sm text-corsican-clay-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-corsican-clay-50 file:text-corsican-clay-700 hover:file:bg-corsican-clay-100 disabled:opacity-50"
                />
                {uploadingBoutiqueImage && (
                  <p className="text-sm text-corsican-clay-600 mt-2 flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Localisation */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-corsican-stone-200">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Section Localisation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.locationTitle}
                  onChange={(e) => setFormData({ ...formData, locationTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Piscia Rossa, Corse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.locationDescription}
                  onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Situé dans un cadre naturel exceptionnel..."
                />
              </div>
            </div>
          </div>

          {/* Section CTA */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-corsican-stone-200">
            <h2 className="text-xl font-semibold text-corsican-clay-900 mb-4">
              Section Appel à l'action (CTA)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.ctaTitle}
                  onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Prêt pour votre séjour en Corse ?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.ctaDescription}
                  onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent"
                  placeholder="Réservez dès maintenant..."
                />
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
