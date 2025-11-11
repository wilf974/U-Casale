import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">U CASALE</h1>
            <p className="text-sm text-stone-600">Seni Production</p>
          </div>
          <div className="hidden md:flex gap-6">
            <Link href="#gite" className="text-stone-700 hover:text-stone-900 transition">
              Le Gîte
            </Link>
            <Link href="#boutique" className="text-stone-700 hover:text-stone-900 transition">
              Boutique
            </Link>
            <Link href="#contact" className="text-stone-700 hover:text-stone-900 transition">
              Contact
            </Link>
          </div>
          <Link
            href="/gite/reserver"
            className="bg-stone-900 text-white px-6 py-2 rounded-lg hover:bg-stone-800 transition"
          >
            Réserver
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6">
            Bienvenue à U Casale
          </h2>
          <p className="text-xl text-stone-600 mb-4">
            Seni Production
          </p>
          <p className="text-lg text-stone-700 mb-8 max-w-2xl mx-auto">
            Vivez une expérience authentique dans notre gîte situé à Piscia Rossa.
            Découvrez nos produits artisanaux corses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gite"
              className="bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800 transition text-lg"
            >
              Découvrir le Gîte
            </Link>
            <Link
              href="/boutique"
              className="bg-white text-stone-900 px-8 py-3 rounded-lg hover:bg-stone-50 transition border-2 border-stone-900 text-lg"
            >
              Voir la Boutique
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-stone-900">Gîte Confortable</h3>
              <p className="text-stone-600">
                Un hébergement authentique au cœur de la Corse, à Piscia Rossa
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-stone-900">Produits Locaux</h3>
              <p className="text-stone-600">
                Découvrez nos produits artisanaux issus de notre production locale
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-stone-900">Piscia Rossa</h3>
              <p className="text-stone-600">
                Un emplacement idéal pour découvrir les beautés de la région
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-stone-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à réserver votre séjour ?</h2>
          <p className="text-xl mb-8 text-stone-300">
            Consultez nos disponibilités et réservez dès maintenant
          </p>
          <Link
            href="/gite/reserver"
            className="inline-block bg-white text-stone-900 px-8 py-3 rounded-lg hover:bg-stone-100 transition text-lg font-semibold"
          >
            Voir les Disponibilités
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">U CASALE</h3>
              <p className="text-stone-400">Seni Production</p>
              <p className="text-stone-400">Piscia Rossa</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/gite" className="text-stone-400 hover:text-white transition">Le Gîte</Link></li>
                <li><Link href="/boutique" className="text-stone-400 hover:text-white transition">Boutique</Link></li>
                <li><Link href="/a-propos" className="text-stone-400 hover:text-white transition">À Propos</Link></li>
                <li><Link href="/contact" className="text-stone-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Informations</h4>
              <ul className="space-y-2">
                <li><Link href="/mentions-legales" className="text-stone-400 hover:text-white transition">Mentions Légales</Link></li>
                <li><Link href="/cgv" className="text-stone-400 hover:text-white transition">CGV</Link></li>
                <li><Link href="/confidentialite" className="text-stone-400 hover:text-white transition">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2025 U Casale - Seni Production. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
