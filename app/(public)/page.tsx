import Link from "next/link"
import PublicLayout from "@/components/layout/PublicLayout"
import { ArrowRight, Home, ShoppingBag, MapPin, Star } from "lucide-react"

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-corsican-clay-50 via-white to-corsican-sand-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-corsican-sand-200 text-corsican-clay-800 text-sm font-semibold mb-4">
                Bienvenue en Corse
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-corsican-clay-900 mb-6">
              U Casale
              <span className="block text-2xl md:text-3xl text-corsican-maquis-700 mt-2">
                Seni Production
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-corsican-clay-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez l'authenticité corse à Piscia Rossa. Gîte de charme et produits artisanaux locaux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gite/reserver"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold text-lg hover:bg-corsican-clay-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Réserver le Gîte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-clay-700 font-semibold text-lg border-2 border-corsican-clay-600 hover:bg-corsican-clay-50 transition-all duration-200"
              >
                Découvrir la Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Le Gîte */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 text-corsican-clay-600 mb-4">
                <Home className="h-6 w-6" />
                <span className="font-semibold uppercase text-sm tracking-wider">Le Gîte</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-corsican-clay-900 mb-6">
                Un havre de paix au cœur de la Corse
              </h2>
              <p className="text-lg text-corsican-clay-700 mb-6 leading-relaxed">
                Notre gîte authentique vous accueille à Piscia Rossa pour un séjour inoubliable.
                Profitez du calme de la nature corse dans un cadre chaleureux et convivial.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Capacité jusqu'à 6 personnes
                </li>
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Équipements modernes dans un cadre traditionnel
                </li>
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Vue panoramique sur le maquis
                </li>
              </ul>
              <Link
                href="/gite"
                className="inline-flex items-center text-corsican-clay-700 font-semibold hover:text-corsican-clay-900 transition-colors"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-corsican-clay-200 to-corsican-maquis-200 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center text-corsican-clay-400">
                <Home className="h-24 w-24" />
              </div>
              {/* Placeholder - À remplacer par une vraie image */}
            </div>
          </div>
        </div>
      </section>

      {/* La Boutique */}
      <section className="py-20 bg-corsican-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-96 rounded-2xl bg-gradient-to-br from-corsican-maquis-200 to-corsican-sand-200 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center text-corsican-maquis-400">
                <ShoppingBag className="h-24 w-24" />
              </div>
              {/* Placeholder - À remplacer par une vraie image */}
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center space-x-2 text-corsican-maquis-600 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <span className="font-semibold uppercase text-sm tracking-wider">La Boutique</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-corsican-clay-900 mb-6">
                Produits artisanaux corses
              </h2>
              <p className="text-lg text-corsican-clay-700 mb-6 leading-relaxed">
                Seni Production vous propose une sélection de produits locaux authentiques.
                Vins corses, huiles d'olive, confitures maison et bien plus encore.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Production locale et artisanale
                </li>
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Livraison possible dans toute la France
                </li>
                <li className="flex items-center text-corsican-clay-700">
                  <Star className="h-5 w-5 text-corsican-sand-500 mr-3 flex-shrink-0" />
                  Respect des traditions corses
                </li>
              </ul>
              <Link
                href="/boutique"
                className="inline-flex items-center text-corsican-maquis-700 font-semibold hover:text-corsican-maquis-900 transition-colors"
              >
                Découvrir nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-corsican-sea-600 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="font-semibold uppercase text-sm tracking-wider">Localisation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-corsican-clay-900 mb-4">
              Piscia Rossa, Corse
            </h2>
            <p className="text-lg text-corsican-clay-700 max-w-2xl mx-auto">
              Situé dans un cadre naturel exceptionnel, U Casale vous accueille dans l'un des plus beaux endroits de l'île de beauté.
            </p>
          </div>
          <div className="bg-corsican-stone-100 rounded-2xl h-96 overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23303.0!2d8.7833!3d42.0000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d6b0e7f9c8b5c3%3A0x5e4e9c9f9f9f9f9f!2sPiscia%20Rossa%2C%2020167%20Afa%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de Piscia Rossa, Afa, Corse"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-corsican-clay-600 to-corsican-clay-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Prêt pour votre séjour en Corse ?
          </h2>
          <p className="text-xl text-corsican-clay-100 mb-8">
            Réservez dès maintenant votre gîte à Piscia Rossa et découvrez l'authenticité corse.
          </p>
          <Link
            href="/gite/reserver"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-clay-700 font-semibold text-lg hover:bg-corsican-clay-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Réserver maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
