"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Loader2, Package, Eye, EyeOff, Image as ImageIcon, X, Download } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: string[]
  published: boolean
  metaTitle: string | null
  metaDescription: string | null
  category: Category
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPublished, setFilterPublished] = useState<string>("all")
  const [newImageUrl, setNewImageUrl] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    images: [] as string[],
    published: false,
    metaTitle: "",
    metaDescription: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products")
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      const data = await response.json()

      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        categoryId: product.category.id,
        images: product.images,
        published: product.published,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: categories[0]?.id || "",
        images: [],
        published: false,
        metaTitle: "",
        metaDescription: "",
      })
    }
    setError("")
    setNewImageUrl("")
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setError("")
    setNewImageUrl("")
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingProduct ? formData.slug : generateSlug(name),
    })
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      })
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products"

      const response = await fetch(url, {
        method: editingProduct ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchProducts()
        handleCloseModal()
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      setError("Une erreur est survenue")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProducts()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category.id === filterCategory
    const matchesPublished = filterPublished === "all" ||
      (filterPublished === "published" && product.published) ||
      (filterPublished === "draft" && !product.published)

    return matchesSearch && matchesCategory && matchesPublished
  })

  const stats = {
    total: products.length,
    published: products.filter(p => p.published).length,
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Produits
            </h1>
            <p className="text-corsican-clay-700">
              Gérez les produits de la boutique
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                window.location.href = "/api/admin/export/products"
              }}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-maquis-600 text-white font-semibold hover:bg-corsican-maquis-700 transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter CSV
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau produit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200">
            <p className="text-sm text-corsican-clay-600">Total produits</p>
            <p className="text-2xl font-bold text-corsican-clay-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-green-200">
            <p className="text-sm text-green-600">Publiés</p>
            <p className="text-2xl font-bold text-green-700">{stats.published}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-yellow-200">
            <p className="text-sm text-yellow-600">Stock faible</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-red-200">
            <p className="text-sm text-red-600">Rupture</p>
            <p className="text-2xl font-bold text-red-700">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corsican-clay-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          <p className="text-corsican-clay-700">Chargement...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-corsican-clay-200">
          <Package className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">
            {searchTerm || filterCategory !== "all" || filterPublished !== "all"
              ? "Aucun produit trouvé"
              : "Aucun produit pour le moment"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Produit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corsican-clay-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-corsican-clay-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-corsican-clay-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-corsican-clay-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-corsican-clay-900">{product.name}</p>
                          <p className="text-sm text-corsican-clay-600 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-corsican-clay-900">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-corsican-clay-900">
                      {product.price.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock} unités
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.published ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Brouillon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
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
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-corsican-clay-200">
              <h2 className="text-2xl font-serif font-bold text-corsican-clay-900">
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 text-corsican-clay-600 rounded focus:ring-corsican-clay-500"
                      />
                      <span className="text-sm font-medium text-corsican-clay-700">
                        Publier le produit
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Images
                    </label>
                    <div className="space-y-2 mb-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <img src={image} alt="" className="w-16 h-16 object-cover rounded" />
                          <input
                            type="text"
                            value={image}
                            readOnly
                            className="flex-1 px-3 py-2 rounded border border-corsican-clay-200 bg-gray-50 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="URL de l'image"
                        className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2 rounded-lg bg-corsican-maquis-600 text-white hover:bg-corsican-maquis-700 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Meta Title (SEO)
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-corsican-clay-700 mb-2">
                      Meta Description (SEO)
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-corsican-clay-200">
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
                  {saving ? "Enregistrement..." : editingProduct ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
