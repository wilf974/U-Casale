import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import NewsletterWidget from "@/components/newsletter/NewsletterWidget"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-corsican-clay-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex flex-col mb-4">
              <span className="text-2xl font-serif font-bold text-corsican-sand-300">
                U Casale
              </span>
              <span className="text-sm text-corsican-sand-400 uppercase tracking-wider">
                Seni Production
              </span>
            </div>
            <p className="text-corsican-stone-300 text-sm leading-relaxed max-w-md">
              Découvrez l'authenticité corse au cœur de Piscia Rossa.
              Gîte de charme et produits artisanaux locaux pour une expérience
              unique en Corse.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-corsican-sand-300 font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gite" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  Le Gîte
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/avis" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  Avis Clients
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-corsican-clay-100 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterWidget />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-corsican-clay-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-corsican-clay-200">
              © {currentYear} U Casale - Seni Production. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link href="/mentions-legales" className="text-sm text-corsican-clay-200 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="text-sm text-corsican-clay-200 hover:text-white transition-colors">
                CGV
              </Link>
              <Link href="/confidentialite" className="text-sm text-corsican-clay-200 hover:text-white transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
