"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import PublicLayout from "@/components/layout/PublicLayout"
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
}

export default function OrderSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId && params.id) {
      verifyPayment(params.id as string, sessionId)
    }
  }, [params.id, searchParams])

  const verifyPayment = async (orderId: string, sessionId: string) => {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/verify?session_id=${sessionId}`
      )
      const data = await response.json()

      if (response.ok) {
        setOrder(data.order)
        // Clear cart
        localStorage.setItem("cart", JSON.stringify([]))
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
    } finally {
      setLoading(false)
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

  return (
    <PublicLayout>
      <div className="bg-stone-50 min-h-screen py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              Commande confirmée !
            </h1>

            <p className="text-lg text-stone-600 mb-8">
              Merci pour votre commande. Vous allez recevoir un email de confirmation.
            </p>

            {/* Order Info */}
            {order && (
              <div className="bg-corsican-sand-50 rounded-xl p-6 mb-8 border-2 border-corsican-sand-200">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-stone-500 mb-1">Numéro de commande</p>
                    <p className="text-lg font-semibold text-stone-900">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 mb-1">Total payé</p>
                    <p className="text-lg font-semibold text-stone-900">
                      {order.total.toFixed(2)} €
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
                Prochaines étapes
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-corsican-maquis-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">
                      Préparation de votre commande
                    </p>
                    <p className="text-sm text-stone-600">
                      Nous préparons soigneusement vos produits
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-corsican-maquis-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">Expédition</p>
                    <p className="text-sm text-stone-600">
                      Livraison sous 3-5 jours ouvrés
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-corsican-maquis-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">Réception</p>
                    <p className="text-sm text-stone-600">
                      Profitez de vos produits artisanaux corses !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center px-8 py-4 bg-corsican-maquis-600 text-white font-semibold rounded-lg hover:bg-corsican-maquis-700 transition-all shadow-lg"
              >
                Continuer mes achats
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-corsican-maquis-700 font-semibold rounded-lg border-2 border-corsican-maquis-600 hover:bg-corsican-maquis-50 transition-all"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
