"use client"

import PublicLayout from "@/components/layout/PublicLayout"
import { XCircle, ArrowLeft, Home, Phone } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default function CancelPage({ params }: PageProps) {
  return (
    <PublicLayout>
      <section className="py-20 bg-gradient-to-br from-red-50 to-corsican-sand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Cancel */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12 text-center">
              <XCircle className="h-20 w-20 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-serif font-bold text-white mb-2">
                Réservation annulée
              </h1>
              <p className="text-red-50 text-lg">
                Le paiement a été annulé
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                  Que s'est-il passé ?
                </h2>
                <p className="text-corsican-clay-700 leading-relaxed mb-4">
                  Votre réservation n'a pas été confirmée car le paiement a été annulé
                  ou n'a pas pu être traité.
                </p>
                <p className="text-corsican-clay-700 leading-relaxed">
                  Aucun montant n'a été débité de votre compte. Vous pouvez réessayer
                  quand vous le souhaitez.
                </p>
              </div>

              {/* Reasons */}
              <div className="bg-corsican-sand-50 rounded-xl p-6 mb-8 border-2 border-corsican-sand-200">
                <h3 className="font-semibold text-corsican-clay-900 mb-4">
                  Raisons possibles
                </h3>
                <ul className="space-y-2 text-sm text-corsican-clay-700">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-corsican-clay-600 mr-3 flex-shrink-0 mt-2"></span>
                    <span>Vous avez annulé le paiement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-corsican-clay-600 mr-3 flex-shrink-0 mt-2"></span>
                    <span>Votre carte bancaire a été refusée</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-corsican-clay-600 mr-3 flex-shrink-0 mt-2"></span>
                    <span>Une erreur technique est survenue</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-corsican-clay-600 mr-3 flex-shrink-0 mt-2"></span>
                    <span>Le délai de paiement a expiré</span>
                  </li>
                </ul>
              </div>

              {/* Help */}
              <div className="bg-corsican-clay-50 rounded-xl p-6 mb-8 border border-corsican-clay-200">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-corsican-clay-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-corsican-clay-900 mb-2">
                      Besoin d'aide ?
                    </h3>
                    <p className="text-sm text-corsican-clay-700 mb-2">
                      Si vous rencontrez des difficultés pour effectuer votre réservation,
                      n'hésitez pas à nous contacter directement.
                    </p>
                    <p className="text-sm text-corsican-clay-700">
                      <strong>Email :</strong> contact@ucasale.com<br />
                      <strong>Téléphone :</strong> +33 X XX XX XX XX
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/gite/reserver"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Réessayer la réservation
                </Link>
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-corsican-clay-600 text-corsican-clay-600 font-semibold hover:bg-corsican-clay-50 transition-all"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-corsican-clay-600 mt-8">
            Vos dates seront toujours disponibles tant que personne d'autre ne les réserve
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
