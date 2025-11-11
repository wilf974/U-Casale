import Link from "next/link"
import PublicLayout from "@/components/layout/PublicLayout"
import {
  Users, Bed, Wifi, Car, Wind, Utensils,
  Sparkles, Trees, Mountain, Calendar, ArrowRight
} from "lucide-react"

export default function GitePage() {
  const features = [
    { icon: Users, label: "Capacité 6 personnes", description: "3 chambres confortables" },
    { icon: Bed, label: "3 Chambres", description: "Literie de qualité" },
    { icon: Wifi, label: "WiFi gratuit", description: "Connexion haut débit" },
    { icon: Car, label: "Parking privé", description: "2 places sécurisées" },
    { icon: Wind, label: "Climatisation", description: "Tout confort" },
    { icon: Utensils, label: "Cuisine équipée", description: "Tout l'électroménager" },
    { icon: Sparkles, label: "Ménage inclus", description: "Arrivée/départ" },
    { icon: Trees, label: "Jardin privé", description: "Vue sur le maquis" },
  ]

  const rooms = [
    {
      name: "Chambre 1 - Principale",
      beds: "1 lit double (160x200)",
      surface: "18 m²",
      amenities: ["Placard", "Vue maquis", "Climatisation"],
    },
    {
      name: "Chambre 2",
      beds: "2 lits simples (90x200)",
      surface: "14 m²",
      amenities: ["Placard", "Bureau", "Climatisation"],
    },
    {
      name: "Chambre 3",
      beds: "1 lit double (140x200)",
      surface: "12 m²",
      amenities: ["Placard", "Climatisation"],
    },
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-corsican-clay-50 to-corsican-sand-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-corsican-clay-600 mb-4">
              <Mountain className="h-6 w-6" />
              <span className="font-semibold uppercase text-sm tracking-wider">Le Gîte</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
              Votre havre de paix en Corse
            </h1>
            <p className="text-xl text-corsican-clay-700 max-w-3xl mx-auto mb-8">
              Gîte authentique pouvant accueillir jusqu'à 6 personnes à Piscia Rossa
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/gite/reserver"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all shadow-lg hover:shadow-xl"
              >
                Réserver maintenant
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-corsican-clay-700 font-semibold border-2 border-corsican-clay-600 hover:bg-corsican-clay-50 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image principale - Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="relative h-96 md:h-[500px] rounded-2xl bg-gradient-to-br from-corsican-clay-300 to-corsican-maquis-300 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <Mountain className="h-24 w-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Photo principale du gîte à ajouter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-6">
            Un séjour authentique au cœur de la Corse
          </h2>
          <div className="prose prose-lg max-w-none text-corsican-clay-700 space-y-4">
            <p>
              Niché au cœur du village de Piscia Rossa, U Casale vous accueille pour un séjour
              inoubliable dans un cadre authentique et chaleureux. Notre gîte de caractère allie
              le charme de l'architecture corse traditionnelle au confort moderne.
            </p>
            <p>
              Profitez d'une vue imprenable sur le maquis corse et les montagnes environnantes.
              Le calme et la sérénité des lieux vous permettront de vous ressourcer loin de
              l'agitation quotidienne.
            </p>
            <p>
              Idéalement situé pour découvrir les trésors de l'île de Beauté : plages paradisiaques,
              sentiers de randonnée, villages authentiques et patrimoine corse.
            </p>
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section className="py-20 bg-corsican-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-12 text-center">
            Équipements & Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-corsican-clay-600 mx-auto mb-3" />
                <h3 className="font-semibold text-corsican-clay-900 mb-1">
                  {feature.label}
                </h3>
                <p className="text-sm text-corsican-clay-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chambres */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-12 text-center">
            Les Chambres
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="bg-corsican-clay-50 rounded-xl p-6 border-2 border-corsican-clay-200"
              >
                <Bed className="h-8 w-8 text-corsican-clay-600 mb-4" />
                <h3 className="text-xl font-semibold text-corsican-clay-900 mb-2">
                  {room.name}
                </h3>
                <p className="text-corsican-clay-700 mb-1">{room.beds}</p>
                <p className="text-sm text-corsican-clay-600 mb-4">{room.surface}</p>
                <ul className="space-y-2">
                  {room.amenities.map((amenity, i) => (
                    <li key={i} className="flex items-center text-sm text-corsican-clay-700">
                      <span className="w-1.5 h-1.5 bg-corsican-clay-600 rounded-full mr-2"></span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20 bg-corsican-maquis-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-6">
            Tarifs & Conditions
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <p className="text-5xl font-bold text-corsican-clay-700 mb-2">
                150€
                <span className="text-2xl font-normal text-corsican-clay-600">/nuit</span>
              </p>
              <p className="text-corsican-clay-600">Pour 6 personnes maximum</p>
            </div>
            <div className="border-t border-corsican-clay-200 pt-6 space-y-3 text-left">
              <div className="flex justify-between text-corsican-clay-700">
                <span>Séjour minimum</span>
                <span className="font-semibold">2 nuits</span>
              </div>
              <div className="flex justify-between text-corsican-clay-700">
                <span>Ménage</span>
                <span className="font-semibold">50€ (inclus)</span>
              </div>
              <div className="flex justify-between text-corsican-clay-700">
                <span>Taxe de séjour</span>
                <span className="font-semibold">10%</span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/gite/reserver"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all shadow-lg"
              >
                Vérifier les disponibilités
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Règlement */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-8">
            Règlement intérieur
          </h2>
          <div className="bg-corsican-sand-50 rounded-xl p-8 space-y-4 text-corsican-clay-700">
            <p>• Arrivée à partir de 16h, départ avant 10h</p>
            <p>• Gîte non-fumeur</p>
            <p>• Animaux acceptés sur demande (supplément possible)</p>
            <p>• Merci de respecter le calme des lieux et du voisinage</p>
            <p>• Le gîte doit être rendu dans l'état dans lequel vous l'avez trouvé</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-corsican-clay-600 to-corsican-clay-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Prêt à réserver votre séjour ?
          </h2>
          <p className="text-xl text-corsican-clay-100 mb-8">
            Contactez-nous pour toute question ou demande de réservation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gite/reserver"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-corsican-clay-700 font-semibold hover:bg-corsican-clay-50 transition-all shadow-lg"
            >
              Réserver en ligne
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-corsican-clay-800 text-white font-semibold hover:bg-corsican-clay-900 transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
