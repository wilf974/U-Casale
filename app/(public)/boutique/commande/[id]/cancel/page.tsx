"use client"

import PublicLayout from "@/components/layout/PublicLayout"
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function OrderCancelPage() {
  const params = useParams()

  return (
    <PublicLayout>
      <div className="bg-stone-50 min-h-screen py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            {/* Cancel Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
              Commande annulée
            </h1>

            <p className="text-lg text-stone-600 mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>

            {/* Info */}
            <div className="bg-orange-50 rounded-xl p-6 mb-8 border-2 border-orange-200">
              <p className="text-stone-700">
                Votre panier a été conservé. Vous pouvez reprendre votre commande quand
                vous le souhaitez.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique/panier"
                className="inline-flex items-center justify-center px-8 py-4 bg-corsican-maquis-600 text-white font-semibold rounded-lg hover:bg-corsican-maquis-700 transition-all shadow-lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour au panier
              </Link>
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-corsican-maquis-700 font-semibold rounded-lg border-2 border-corsican-maquis-600 hover:bg-corsican-maquis-50 transition-all"
              >
                Continuer mes achats
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
