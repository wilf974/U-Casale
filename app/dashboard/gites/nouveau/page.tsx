"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "kitchen", label: "Cuisine équipée" },
  { id: "airConditioning", label: "Climatisation" },
  { id: "heating", label: "Chauffage" },
  { id: "washer", label: "Lave-linge" },
  { id: "dryer", label: "Sèche-linge" },
  { id: "dishwasher", label: "Lave-vaisselle" },
  { id: "tv", label: "Télévision" },
  { id: "terrace", label: "Terrasse" },
  { id: "garden", label: "Jardin" },
  { id: "bbq", label: "Barbecue" },
  { id: "pool", label: "Piscine" },
  { id: "fireplace", label: "Cheminée" },
  { id: "petFriendly", label: "Animaux acceptés" },
]

export default function NewGitePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    maxGuests: "4",
    bedrooms: "2",
    beds: "2",
    bathrooms: "1",
    pricePerNight: "",
    cleaningFee: "0",
    minimumStay: "1",
    address: "",
    city: "",
    postalCode: "",
    featuredImage: "",
    virtualTourUrl: "",
    equipment: "",
    available: true,
    rules: "",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    metaTitle: "",
    metaDescription: "",
    displayOrder: "0",
    featured: false,
  })

  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState("")
  const [amenities, setAmenities] = useState<{ [key: string]: boolean }>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleAmenityToggle = (amenityId: string) => {
    setAmenities((prev) => ({
      ...prev,
      [amenityId]: !prev[amenityId],
    }))
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.pricePerNight) {
      alert("Nom, slug et prix par nuit sont requis")
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/admin/gites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          amenities,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard/gites")
      } else {
        alert(data.error || "Erreur lors de la création")
      }
    } catch (error) {
      console.error("Error creating gite:", error)
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
            href="/dashboard/gites"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux gîtes
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">Nouveau gîte</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Enregistrer
        </button>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Informations générales</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Nom du gîte *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Villa Corse Paradise"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  URL (slug) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="villa-corse-paradise"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
                <p className="text-xs text-stone-500 mt-1">
                  URL: /gite/{formData.slug || "villa-corse-paradise"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description courte
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Un havre de paix au cœur de la Corse..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description complète
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description détaillée du gîte, ses atouts, l'environnement..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>
            </div>
          </div>

          {/* Capacité */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Capacité</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Personnes max *
                </label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Chambres
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Lits
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Salles de bain
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>
            </div>
          </div>

          {/* Tarification */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Tarification</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Prix par nuit (€) *
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Frais de ménage (€)
                </label>
                <input
                  type="number"
                  name="cleaningFee"
                  value={formData.cleaningFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Séjour minimum (nuits)
                </label>
                <input
                  type="number"
                  name="minimumStay"
                  value={formData.minimumStay}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Localisation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Route de la Plage"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Porto-Vecchio"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="20137"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Équipements</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {AMENITIES_OPTIONS.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={amenities[amenity.id] || false}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="w-4 h-4 text-corsican-maquis-600 border-stone-300 rounded focus:ring-corsican-maquis-500"
                  />
                  <span className="text-sm text-stone-700">{amenity.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Équipement détaillé (optionnel)
              </label>
              <textarea
                name="equipment"
                value={formData.equipment}
                onChange={handleInputChange}
                placeholder="Liste détaillée des équipements additionnels..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
              />
            </div>
          </div>

          {/* Règlement */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Règlement & Horaires</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Règles de la maison
                </label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Non fumeur, animaux interdits, respect du voisinage..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Images</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Image principale
                </label>
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                />
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Galerie ({images.length})
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="URL image..."
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="p-2 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg">
                      <img src={img} alt={`Image ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                      <span className="flex-1 text-xs text-stone-600 truncate">{img}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Visite virtuelle 360°
                </label>
                <input
                  type="url"
                  name="virtualTourUrl"
                  value={formData.virtualTourUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Disponibilité */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Disponibilité</h3>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-5 h-5 text-corsican-maquis-600 border-stone-300 rounded focus:ring-corsican-maquis-500"
              />
              <span className="text-sm text-stone-700">Gîte disponible à la réservation</span>
            </label>
          </div>

          {/* Affichage */}
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Affichage</h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-corsican-maquis-600 border-stone-300 rounded focus:ring-corsican-maquis-500"
                />
                <span className="text-sm text-stone-700">Mettre en vedette</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">Plus petit = affiché en premier</p>
              </div>
            </div>
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
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
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
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500 text-sm"
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
