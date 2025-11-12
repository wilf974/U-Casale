"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Loader2, Package, Eye, EyeOff, Image as ImageIcon, X, Download, ChevronUp, ChevronDown, CheckSquare, Square, Trash, Check } from "lucide-react"
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
  const [filterStock, setFilterStock] = useState<string>("all")
  const [filterPriceMin, setFilterPriceMin] = useState<string>("")
  const [filterPriceMax, setFilterPriceMax] = useState<string>("")
  const [newImageUrl, setNewImageUrl] = useState("")

  // Bulk actions
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Sorting
  const [sortField, setSortField] = useState<"name" | "price" | "stock" | "createdAt">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  // Bulk selection handlers
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredAndSortedProducts.map(p => p.id))
    }
  }

  const handleBulkPublish = async (published: boolean) => {
    if (selectedProducts.length === 0) return

    try {
      await Promise.all(
        selectedProducts.map(id =>
          fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published }),
          })
        )
      )
      await fetchProducts()
      setSelectedProducts([])
      setShowBulkActions(false)
    } catch (error) {
      console.error("Error bulk updating products:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produits ?`)) {
      return
    }

    try {
      await Promise.all(
        selectedProducts.map(id =>
          fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
          })
        )
      )
      await fetchProducts()
      setSelectedProducts([])
      setShowBulkActions(false)
    } catch (error) {
      console.error("Error bulk deleting products:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const handleQuickTogglePublish = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !product.published }),
      })
      await fetchProducts()
    } catch (error) {
      console.error("Error toggling publish status:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category.id === filterCategory
    const matchesPublished = filterPublished === "all" ||
      (filterPublished === "published" && product.published) ||
      (filterPublished === "draft" && !product.published)

    const matchesStock = filterStock === "all" ||
      (filterStock === "in-stock" && product.stock > 10) ||
      (filterStock === "low-stock" && product.stock > 0 && product.stock <= 10) ||
      (filterStock === "out-of-stock" && product.stock === 0)

    const priceMin = filterPriceMin ? parseFloat(filterPriceMin) : 0
    const priceMax = filterPriceMax ? parseFloat(filterPriceMax) : Infinity
    const matchesPrice = product.price >= priceMin && product.price <= priceMax

    return matchesSearch && matchesCategory && matchesPublished && matchesStock && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "price":
        comparison = a.price - b.price
        break
      case "stock":
        comparison = a.stock - b.stock
        break
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const filteredAndSortedProducts = sortedProducts

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterCategory, filterPublished, filterStock, filterPriceMin, filterPriceMax])

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

        {/* Bulk Actions Toolbar */}
        {selectedProducts.length > 0 && (
          <div className="bg-corsican-clay-900 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5" />
              <span className="font-semibold">{selectedProducts.length} produit(s) sélectionné(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Publier
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Dépublier
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Supprimer
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-4 py-2 rounded-lg bg-corsican-clay-700 hover:bg-corsican-clay-600 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border-2 border-corsican-clay-200 mb-6">
          <div className="grid md:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2">
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

            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
            >
              <option value="all">Tous les stocks</option>
              <option value="in-stock">En stock (&gt;10)</option>
              <option value="low-stock">Stock faible (1-10)</option>
              <option value="out-of-stock">Rupture (0)</option>
            </select>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2 flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix min (€)"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Prix max (€)"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-between">
              <div className="text-sm text-corsican-clay-600">
                {filteredAndSortedProducts.length} produit(s) trouvé(s)
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-corsican-clay-600">Afficher:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-3 py-1 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
          <p className="text-corsican-clay-700">Chargement...</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-corsican-clay-200">
          <Package className="h-12 w-12 mx-auto mb-4 text-corsican-clay-400" />
          <p className="text-corsican-clay-600">
            {searchTerm || filterCategory !== "all" || filterPublished !== "all"
              ? "Aucun produit trouvé"
              : "Aucun produit pour le moment"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
                  <tr>
                    <th className="px-4 py-4 text-left w-12">
                      <button
                        onClick={toggleSelectAll}
                        className="p-1 hover:bg-corsican-clay-100 rounded transition-colors"
                      >
                        {selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0 ? (
                          <CheckSquare className="h-5 w-5 text-corsican-clay-700" />
                        ) : (
                          <Square className="h-5 w-5 text-corsican-clay-400" />
                        )}
                      </button>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Produit
                        {sortField === "name" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase">
                      Catégorie
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-2">
                        Prix
                        {sortField === "price" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-corsican-clay-700 uppercase cursor-pointer hover:bg-corsican-clay-100 transition-colors"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center gap-2">
                        Stock
                        {sortField === "stock" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
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
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-corsican-clay-50 transition-colors">
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleProductSelection(product.id)}
                          className="p-1 hover:bg-corsican-clay-100 rounded transition-colors"
                        >
                          {selectedProducts.includes(product.id) ? (
                            <CheckSquare className="h-5 w-5 text-corsican-clay-700" />
                          ) : (
                            <Square className="h-5 w-5 text-corsican-clay-400" />
                          )}
                        </button>
                      </td>
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
                        <button
                          onClick={() => handleQuickTogglePublish(product)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                            product.published
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {product.published ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Publié
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Brouillon
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 rounded-lg bg-corsican-clay-100 text-corsican-clay-700 hover:bg-corsican-clay-200 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            title="Supprimer"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-corsican-clay-600">
                Page {currentPage} sur {totalPages} ({filteredAndSortedProducts.length} produits)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Première
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Précédent
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-corsican-clay-600 text-white"
                            : "bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Suivant
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-corsican-clay-200 text-corsican-clay-700 hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Dernière
                </button>
              </div>
            </div>
          )}
        </>
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
