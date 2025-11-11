"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PublicLayout from "@/components/layout/PublicLayout"
import { ShoppingCart, Loader2, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string | null
  slug: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Contact
    email: "",
    phone: "",

    // Shipping
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",

    // Additional info
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      if (parsedCart.length === 0) {
        router.push("/boutique")
      }
      setCart(parsedCart)
    } else {
      router.push("/boutique")
    }
  }, [router])

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    if (subtotal === 0) return 0
    if (subtotal >= 50) return 0
    return 6.5
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Email valide requis"
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Numéro de téléphone valide requis"
    }
    if (!formData.firstName || formData.firstName.trim().length === 0) {
      newErrors.firstName = "Prénom requis"
    }
    if (!formData.lastName || formData.lastName.trim().length === 0) {
      newErrors.lastName = "Nom requis"
    }
    if (!formData.address || formData.address.trim().length === 0) {
      newErrors.address = "Adresse requise"
    }
    if (!formData.city || formData.city.trim().length === 0) {
      newErrors.city = "Ville requise"
    }
    if (!formData.postalCode || formData.postalCode.trim().length === 0) {
      newErrors.postalCode = "Code postal requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create order
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customer: formData,
          shipping: getShipping(),
          total: getTotal(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      } else {
        alert(data.error || "Une erreur est survenue")
        setLoading(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Une erreur est survenue lors de la création de la commande")
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <PublicLayout>
      <div className="bg-stone-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
              Finaliser la commande
            </h1>
            <Link
              href="/boutique/panier"
              className="inline-flex items-center text-corsican-maquis-600 hover:text-corsican-maquis-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                  <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                    Informations de contact
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? "border-red-500" : "border-stone-300"
                        } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.phone ? "border-red-500" : "border-stone-300"
                        } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                  <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                    Adresse de livraison
                  </h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.firstName ? "border-red-500" : "border-stone-300"
                          } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.lastName ? "border-red-500" : "border-stone-300"
                          } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.address ? "border-red-500" : "border-stone-300"
                        } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.postalCode ? "border-red-500" : "border-stone-300"
                          } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                        />
                        {errors.postalCode && (
                          <p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.city ? "border-red-500" : "border-stone-300"
                          } focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500`}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Pays
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                  <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                    Notes (optionnel)
                  </h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Instructions de livraison, commentaires..."
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 sticky top-4">
                  <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                    Récapitulatif
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingCart className="h-8 w-8 text-corsican-sand-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-stone-500">
                            Qté: {item.quantity} × {item.price.toFixed(2)} €
                          </p>
                          <p className="text-sm font-semibold text-stone-900">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6">
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
                    <div className="pt-3 border-t-2 border-stone-200">
                      <div className="flex justify-between text-xl font-bold text-stone-900">
                        <span>Total</span>
                        <span>{getTotal().toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-corsican-maquis-600 text-white font-semibold text-lg rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Payer {getTotal().toFixed(2)} €</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 text-xs text-center text-stone-500">
                    Paiement sécurisé par Stripe
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}
