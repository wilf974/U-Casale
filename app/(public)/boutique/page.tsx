import PublicLayout from "@/components/layout/PublicLayout"
import { ShoppingBag, Wine, Droplet, Leaf, Package } from "lucide-react"

export default function BoutiquePage() {
  const categories = [
    {
      icon: Wine,
      name: "Vins Corses",
      description: "Sélection de vins locaux",
      count: "Bientôt disponible",
    },
    {
      icon: Droplet,
      name: "Huiles & Vinaigres",
      description: "Huile d'olive AOP",
      count: "Bientôt disponible",
    },
    {
      icon: Leaf,
      name: "Confitures & Miel",
      description: "Produits du terroir",
      count: "Bientôt disponible",
    },
    {
      icon: Package,
      name: "Coffrets Cadeaux",
      description: "Compositions gourmandes",
      count: "Bientôt disponible",
    },
  ]

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

      {/* Présentation */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-6">
              Notre Production Artisanale
            </h2>
            <p className="text-lg text-corsican-clay-700 leading-relaxed">
              Seni Production vous propose une sélection de produits corses authentiques,
              issus de notre terroir et transformés de manière artisanale. Vins, huiles,
              confitures... découvrez les saveurs de la Corse.
            </p>
          </div>

          <div className="bg-corsican-sand-50 rounded-2xl p-8 border-2 border-corsican-sand-200">
            <h3 className="text-xl font-semibold text-corsican-clay-900 mb-4 text-center">
              Notre Engagement Qualité
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-corsican-maquis-100 mb-3">
                  <Leaf className="h-6 w-6 text-corsican-maquis-600" />
                </div>
                <p className="font-medium text-corsican-clay-900 mb-1">100% Local</p>
                <p className="text-sm text-corsican-clay-600">Production corse</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-corsican-clay-100 mb-3">
                  <Package className="h-6 w-6 text-corsican-clay-600" />
                </div>
                <p className="font-medium text-corsican-clay-900 mb-1">Artisanal</p>
                <p className="text-sm text-corsican-clay-600">Fait main</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-corsican-sea-100 mb-3">
                  <Wine className="h-6 w-6 text-corsican-sea-600" />
                </div>
                <p className="font-medium text-corsican-clay-900 mb-1">Qualité</p>
                <p className="text-sm text-corsican-clay-600">Sélection rigoureuse</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 bg-corsican-maquis-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-12 text-center">
            Nos Catégories de Produits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-corsican-maquis-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-corsican-maquis-100 mb-4">
                  <category.icon className="h-8 w-8 text-corsican-maquis-600" />
                </div>
                <h3 className="text-xl font-semibold text-corsican-clay-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-corsican-clay-600 mb-3">{category.description}</p>
                <p className="text-sm text-corsican-maquis-600 font-medium">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-corsican-clay-100 to-corsican-sand-100 rounded-2xl p-12 border-2 border-corsican-clay-200">
            <ShoppingBag className="h-16 w-16 text-corsican-clay-600 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-4">
              Boutique en ligne bientôt disponible
            </h2>
            <p className="text-lg text-corsican-clay-700 mb-8">
              Nous préparons actuellement notre boutique en ligne pour vous permettre de
              commander nos produits artisanaux corses directement depuis chez vous.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 flex-shrink-0"></span>
                <p className="text-corsican-clay-700">Catalogue complet de nos produits</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 flex-shrink-0"></span>
                <p className="text-corsican-clay-700">Paiement sécurisé en ligne</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 flex-shrink-0"></span>
                <p className="text-corsican-clay-700">Livraison dans toute la France</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 flex-shrink-0"></span>
                <p className="text-corsican-clay-700">Option retrait sur place</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-r from-corsican-maquis-700 to-corsican-maquis-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Envie de découvrir nos produits ?
          </h2>
          <p className="text-xl text-corsican-maquis-100 mb-8">
            Contactez-nous pour plus d'informations sur nos produits artisanaux
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-maquis-700 font-semibold hover:bg-corsican-clay-50 transition-all shadow-lg"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </PublicLayout>
  )
}
