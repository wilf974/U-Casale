"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    updateCartCount()

    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(count)
  }

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Le Gîte", href: "/gite" },
    { name: "Boutique", href: "/boutique" },
    { name: "Blog", href: "/blog" },
    { name: "À Propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-corsican-clay-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-corsican-clay-800">
                U Casale
              </span>
              <span className="text-xs text-corsican-maquis-600 uppercase tracking-wider">
                Seni Production
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-corsican-clay-700 hover:text-corsican-clay-900 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/boutique/panier"
              className="relative p-2 text-corsican-clay-700 hover:text-corsican-clay-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-corsican-maquis-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/gite/reserver"
              className="inline-flex items-center rounded-md bg-corsican-clay-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-corsican-clay-700 transition-all duration-200 hover:shadow-md"
            >
              Réserver
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/boutique/panier"
              className="relative p-2 text-corsican-clay-700 hover:text-corsican-clay-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-corsican-maquis-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-corsican-clay-700 hover:bg-corsican-clay-100 hover:text-corsican-clay-900 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-corsican-clay-700 hover:bg-corsican-clay-100 hover:text-corsican-clay-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/gite/reserver"
              className="block mx-3 mt-4 text-center rounded-md bg-corsican-clay-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-corsican-clay-700 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Réserver
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
