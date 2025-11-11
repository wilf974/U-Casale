"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import PublicLayout from "@/components/layout/PublicLayout"
import { ShoppingCart, ArrowLeft, Loader2, Minus, Plus, Package, ShoppingBag } from "lucide-react"
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

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      const response = await fetch(`/api/products/${slug}`)
      const data = await response.json()
      if (response.ok) {
        setProduct(data.product)
      } else {
        router.push("/boutique")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      router.push("/boutique")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    setAddingToCart(true)

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0] || null,
        slug: product.slug,
      })
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch custom event for cart update
    window.dispatchEvent(new Event("cartUpdated"))

    setTimeout(() => {
      setAddingToCart(false)
      // Optionally redirect to cart or show success message
      alert("Produit ajouté au panier!")
    }, 500)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-corsican-maquis-600 animate-spin" />
        </div>
      </PublicLayout>
    )
  }

  if (!product) {
    return null
  }

  return (
    <PublicLayout>
      <div className="bg-stone-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/boutique"
              className="inline-flex items-center text-corsican-maquis-600 hover:text-corsican-maquis-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la boutique
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100 rounded-2xl overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag className="h-32 w-32 text-corsican-sand-300" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-corsican-maquis-600"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Link
                  href={`/boutique?category=${product.category.id}`}
                  className="inline-block text-sm font-medium text-corsican-maquis-600 hover:text-corsican-maquis-700 uppercase tracking-wider"
                >
                  {product.category.name}
                </Link>
              </div>

              <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
                {product.name}
              </h1>

              <div className="text-4xl font-bold text-corsican-clay-900 mb-6">
                {product.price.toFixed(2)} €
              </div>

              <div className="prose prose-stone max-w-none mb-8">
                <p className="text-lg text-stone-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock === 0 ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Rupture de stock</span>
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Stock limité ({product.stock} restants)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">En stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Quantité
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border-2 border-stone-300 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-5 w-5 text-stone-700" />
                      </button>
                      <span className="px-6 py-3 text-lg font-semibold text-stone-900">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="p-3 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-5 w-5 text-stone-700" />
                      </button>
                    </div>
                    <span className="text-sm text-stone-500">
                      {product.stock} disponible{product.stock > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-corsican-maquis-600 text-white font-semibold text-lg rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {addingToCart ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="h-6 w-6" />
                      <span>
                        {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push("/boutique")}
                  className="w-full px-8 py-4 bg-white text-corsican-maquis-700 font-semibold text-lg rounded-lg border-2 border-corsican-maquis-600 hover:bg-corsican-maquis-50 transition-all"
                >
                  Continuer mes achats
                </button>
              </div>

              {/* Product Info Cards */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-corsican-sand-50 rounded-lg p-4 text-center border border-corsican-sand-200">
                  <Package className="h-6 w-6 text-corsican-maquis-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-700">Production locale</p>
                </div>
                <div className="bg-corsican-sand-50 rounded-lg p-4 text-center border border-corsican-sand-200">
                  <ShoppingBag className="h-6 w-6 text-corsican-maquis-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-700">Artisanal</p>
                </div>
                <div className="bg-corsican-sand-50 rounded-lg p-4 text-center border border-corsican-sand-200">
                  <Package className="h-6 w-6 text-corsican-maquis-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-700">Qualité garantie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
