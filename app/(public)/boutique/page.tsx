"use client"

import { useState, useEffect } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { ShoppingBag, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append("categoryId", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/products?${params.toString()}`)
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

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-corsican-maquis-50 to-corsican-sand-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-corsican-maquis-600 mb-4">
            <ShoppingBag className="h-6 w-6" />
            <span className="font-semibold uppercase text-sm tracking-wider">La Boutique</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
            Produits Artisanaux Corses
          </h1>
          <p className="text-xl text-corsican-clay-700">
            Seni Production - Le terroir corse à votre table
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === null
                    ? "bg-corsican-maquis-600 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Tous ({categories.reduce((sum, cat) => sum + cat._count.products, 0)})
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-corsican-maquis-600 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {category.name} ({category._count.products})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-corsican-maquis-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-24 w-24 text-stone-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-stone-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-stone-600 mb-6">
                {searchQuery || selectedCategory
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Nous préparons actuellement notre catalogue de produits"}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                  className="px-6 py-3 bg-corsican-maquis-600 text-white rounded-lg hover:bg-corsican-maquis-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-stone-600">
                  {products.length} produit{products.length > 1 ? "s" : ""} trouvé{products.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/boutique/${product.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-16 w-16 text-corsican-sand-300" />
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                            Rupture de stock
                          </span>
                        </div>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Stock limité
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-corsican-maquis-600 uppercase tracking-wider">
                          {product.category.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-corsican-maquis-700 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-corsican-clay-900">
                          {product.price.toFixed(2)} €
                        </span>
                        <span className="text-sm text-stone-500">
                          {product.stock > 5 ? "En stock" : `Stock: ${product.stock}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-corsican-maquis-700 to-corsican-maquis-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Une question sur nos produits ?
          </h2>
          <p className="text-xl text-corsican-maquis-100 mb-8">
            Contactez-nous pour plus d'informations sur nos produits artisanaux
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-maquis-700 font-semibold hover:bg-corsican-clay-50 transition-all shadow-lg"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
