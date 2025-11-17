"use client"

import { useState } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import DynamicMap from "@/components/map/DynamicMap"
import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // TODO: Implémenter l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-corsican-sea-50 to-corsican-clay-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-corsican-sea-600 mb-4">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold uppercase text-sm tracking-wider">Contact</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-corsican-clay-700">
            Une question ? Un projet de réservation ? Nous sommes là pour vous répondre
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
                Informations de contact
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-corsican-clay-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-corsican-clay-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-corsican-clay-900 mb-1">Adresse</h3>
                    <p className="text-corsican-clay-700">
                      Piscia Rossa
                      <br />
                      Corse
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-corsican-sea-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-corsican-sea-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-corsican-clay-900 mb-1">Téléphone</h3>
                    <p className="text-corsican-clay-700">+33 X XX XX XX XX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-corsican-maquis-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-corsican-maquis-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-corsican-clay-900 mb-1">Email</h3>
                    <p className="text-corsican-clay-700">contact@ucasale.com</p>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-corsican-sand-50 rounded-xl p-6 border-2 border-corsican-sand-200">
                <h3 className="font-semibold text-corsican-clay-900 mb-4">
                  Horaires de réponse
                </h3>
                <div className="space-y-2 text-corsican-clay-700">
                  <p>Nous répondons à vos messages :</p>
                  <p className="font-medium">Du lundi au samedi</p>
                  <p>de 9h à 12h et de 14h à 18h</p>
                  <p className="text-sm text-corsican-clay-600 mt-4">
                    Réponse sous 24h ouvrées
                  </p>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
                Envoyez-nous un message
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">Demande de réservation</option>
                    <option value="info-gite">Information sur le gîte</option>
                    <option value="boutique">Question sur la boutique</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-corsican-clay-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-corsican-clay-300 focus:ring-2 focus:ring-corsican-clay-500 focus:border-transparent transition resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>Envoi en cours...</>
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="py-20 bg-corsican-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8 text-center">
            Comment nous trouver
          </h2>
          <DynamicMap height="384px" />
        </div>
      </section>
    </PublicLayout>
  )
}
