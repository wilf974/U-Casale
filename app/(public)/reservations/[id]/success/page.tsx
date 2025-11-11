"use client"

import { useEffect, useState } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { CheckCircle, Calendar, Mail, Home, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PageProps {
  params: {
    id: string
  }
  searchParams: {
    session_id?: string
  }
}

export default function SuccessPage({ params, searchParams }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<any>(null)

  useEffect(() => {
    // TODO: Récupérer les détails de la réservation depuis l'API
    // Pour l'instant, simuler un chargement
    setTimeout(() => {
      setLoading(false)
      // Nettoyer le sessionStorage
      sessionStorage.removeItem("reservationData")
    }, 1500)
  }, [params.id])

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-corsican-sand-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-corsican-clay-600 mx-auto mb-4" />
            <p className="text-corsican-clay-700">Confirmation en cours...</p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <section className="py-20 bg-gradient-to-br from-green-50 to-corsican-sand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Success */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
              <CheckCircle className="h-20 w-20 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-serif font-bold text-white mb-2">
                Réservation confirmée !
              </h1>
              <p className="text-green-50 text-lg">
                Votre paiement a été accepté
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-corsican-clay-900 mb-4">
                  Merci pour votre réservation
                </h2>
                <p className="text-corsican-clay-700 leading-relaxed">
                  Votre réservation a été confirmée avec succès. Vous allez recevoir un
                  email de confirmation à l'adresse indiquée lors de votre réservation.
                </p>
              </div>

              {/* Info boxes */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-corsican-clay-50 rounded-lg p-6 border border-corsican-clay-200">
                  <Mail className="h-8 w-8 text-corsican-clay-600 mb-3" />
                  <h3 className="font-semibold text-corsican-clay-900 mb-2">
                    Email de confirmation
                  </h3>
                  <p className="text-sm text-corsican-clay-700">
                    Un email de confirmation avec tous les détails de votre réservation
                    vous a été envoyé.
                  </p>
                </div>

                <div className="bg-corsican-maquis-50 rounded-lg p-6 border border-corsican-maquis-200">
                  <Calendar className="h-8 w-8 text-corsican-maquis-600 mb-3" />
                  <h3 className="font-semibold text-corsican-clay-900 mb-2">
                    Numéro de réservation
                  </h3>
                  <p className="text-sm text-corsican-clay-700 font-mono">
                    #{params.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-corsican-sand-50 rounded-xl p-6 mb-8 border-2 border-corsican-sand-200">
                <h3 className="font-semibold text-corsican-clay-900 mb-4">
                  Prochaines étapes
                </h3>
                <ul className="space-y-3 text-corsican-clay-700">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-corsican-clay-600 text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Consultez votre email pour tous les détails de votre séjour</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-corsican-clay-600 text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Arrivée à partir de 16h, départ avant 10h</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-corsican-clay-600 text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Pour toute question, contactez-nous à contact@ucasale.com
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Retour à l'accueil
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-corsican-clay-600 text-corsican-clay-600 font-semibold hover:bg-corsican-clay-50 transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-corsican-clay-600 mt-8">
            Nous avons hâte de vous accueillir à U Casale !
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
