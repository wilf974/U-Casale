"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PublicLayout from "@/components/layout/PublicLayout"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string | null
  slug: string
}

export default function PanierPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem("cart", JSON.stringify([]))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    if (subtotal === 0) return 0
    if (subtotal >= 50) return 0 // Free shipping over 50€
    return 6.5
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  if (cart.length === 0) {
    return (
      <PublicLayout>
        <div className="bg-stone-50 min-h-screen py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ShoppingCart className="h-24 w-24 text-stone-300 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-lg text-stone-600 mb-8">
              Découvrez nos produits artisanaux corses et commencez vos achats
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center px-8 py-4 bg-corsican-maquis-600 text-white font-semibold rounded-lg hover:bg-corsican-maquis-700 transition-all shadow-lg"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Découvrir la boutique
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="bg-stone-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
              Panier ({cart.length} article{cart.length > 1 ? "s" : ""})
            </h1>
            <Link
              href="/boutique"
              className="inline-flex items-center text-corsican-maquis-600 hover:text-corsican-maquis-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Vider le panier
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/boutique/${item.slug}`}
                      className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100 rounded-lg overflow-hidden"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-12 w-12 text-corsican-sand-300" />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        href={`/boutique/${item.slug}`}
                        className="text-lg font-semibold text-stone-900 hover:text-corsican-maquis-700 mb-2 block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xl font-bold text-corsican-clay-900 mb-4">
                        {item.price.toFixed(2)} €
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-stone-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-stone-100 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-stone-700" />
                          </button>
                          <span className="px-4 py-2 text-base font-semibold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-stone-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-stone-700" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm text-stone-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-stone-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 sticky top-4">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                  Récapitulatif
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stone-700">
                    <span>Sous-total</span>
                    <span className="font-semibold">{getSubtotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Livraison</span>
                    <span className="font-semibold">
                      {getShipping() === 0 ? (
                        <span className="text-green-600">GRATUIT</span>
                      ) : (
                        `${getShipping().toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  {getSubtotal() < 50 && getSubtotal() > 0 && (
                    <div className="text-sm text-stone-500 bg-corsican-sand-50 p-3 rounded-lg border border-corsican-sand-200">
                      Ajoutez {(50 - getSubtotal()).toFixed(2)} € pour la livraison gratuite
                    </div>
                  )}
                  <div className="pt-4 border-t-2 border-stone-200">
                    <div className="flex justify-between text-xl font-bold text-stone-900">
                      <span>Total</span>
                      <span>{getTotal().toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/boutique/checkout")}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-corsican-maquis-600 text-white font-semibold text-lg rounded-lg hover:bg-corsican-maquis-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Passer commande</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="mt-6 space-y-3 text-sm text-stone-600">
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                    <span>Livraison gratuite dès 50€</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                    <span>Produits artisanaux corses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
