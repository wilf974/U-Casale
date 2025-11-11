import PublicLayout from "@/components/layout/PublicLayout"
import { Heart, Award, Leaf, Users } from "lucide-react"

export default function AProposPage() {
  const values = [
    {
      icon: Heart,
      title: "Authenticité",
      description: "Nous préservons les traditions corses et l'authenticité de notre territoire.",
    },
    {
      icon: Award,
      title: "Qualité",
      description: "Des produits et services de qualité pour une expérience inoubliable.",
    },
    {
      icon: Leaf,
      title: "Nature",
      description: "Respect de l'environnement et valorisation du patrimoine naturel corse.",
    },
    {
      icon: Users,
      title: "Accueil",
      description: "Un accueil chaleureux et convivial à la corse.",
    },
  ]

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-corsican-maquis-50 to-corsican-clay-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
            U Casale - Seni Production
          </h1>
          <p className="text-xl text-corsican-clay-700 leading-relaxed">
            L'histoire d'une passion pour la Corse, son terroir et ses traditions
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
            Notre Histoire
          </h2>
          <div className="space-y-6 text-lg text-corsican-clay-700 leading-relaxed">
            <p>
              U Casale, c'est avant tout une histoire de famille et d'amour pour la Corse.
              Installés à Piscia Rossa depuis plusieurs générations, nous avons à cœur de
              partager avec vous les richesses de notre île de Beauté.
            </p>
            <p>
              Seni Production est née de cette volonté de faire découvrir et de préserver
              les savoir-faire traditionnels corses. De la culture de nos terres à la
              transformation artisanale de nos produits, chaque étape est réalisée avec
              soin et passion.
            </p>
            <p>
              Notre gîte a été aménagé dans une bâtisse traditionnelle corse, restaurée
              avec respect pour l'architecture locale tout en offrant le confort moderne
              attendu par nos hôtes. C'est le lieu idéal pour découvrir l'authenticité
              corse dans un cadre préservé.
            </p>
          </div>
        </div>
      </section>

      {/* Image - Placeholder */}
      <section className="py-12 bg-corsican-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 rounded-2xl bg-gradient-to-br from-corsican-maquis-300 to-corsican-clay-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Heart className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Photo de la famille / propriété</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-12 text-center">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-corsican-clay-100 mb-4">
                  <value.icon className="h-8 w-8 text-corsican-clay-600" />
                </div>
                <h3 className="text-xl font-semibold text-corsican-clay-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-corsican-clay-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Piscia Rossa */}
      <section className="py-20 bg-corsican-maquis-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
            Piscia Rossa
          </h2>
          <div className="space-y-6 text-lg text-corsican-clay-700 leading-relaxed">
            <p>
              Piscia Rossa est un village authentique situé au cœur de la Corse.
              Entouré par le maquis et les montagnes, c'est un véritable havre de paix
              loin de l'agitation touristique.
            </p>
            <p>
              Le village offre un cadre idéal pour découvrir la Corse authentique :
              sentiers de randonnée, patrimoine culturel, villages perchés, et bien sûr,
              les magnifiques plages de la côte accessibles en quelques minutes.
            </p>
            <p>
              C'est dans ce cadre exceptionnel que nous avons le plaisir de vous accueillir
              à U Casale, pour vous faire vivre une expérience corse unique et mémorable.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Engagement */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
            Notre Engagement
          </h2>
          <div className="bg-corsican-clay-50 rounded-2xl p-8 border-2 border-corsican-clay-200">
            <div className="space-y-4 text-corsican-clay-700">
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 mr-3 flex-shrink-0"></span>
                <span>Production locale et artisanale de nos produits</span>
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 mr-3 flex-shrink-0"></span>
                <span>Respect de l'environnement et des ressources naturelles</span>
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 mr-3 flex-shrink-0"></span>
                <span>Préservation des savoir-faire traditionnels corses</span>
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 mr-3 flex-shrink-0"></span>
                <span>Accueil chaleureux et personnalisé de nos hôtes</span>
              </p>
              <p className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-corsican-maquis-600 mt-2 mr-3 flex-shrink-0"></span>
                <span>Valorisation du territoire et du patrimoine local</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-corsican-maquis-700 to-corsican-maquis-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Envie de nous rencontrer ?
          </h2>
          <p className="text-xl text-corsican-maquis-100 mb-8">
            Venez découvrir U Casale et partager avec nous la passion de la Corse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/gite/reserver"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-maquis-700 font-semibold hover:bg-corsican-clay-50 transition-all shadow-lg"
            >
              Réserver le gîte
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-corsican-maquis-800 border-2 border-white text-white font-semibold hover:bg-corsican-maquis-900 transition-all"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
