"use client"

import { useState } from "react"
import { Mail, Loader2, CheckCircle } from "lucide-react"

export default function NewsletterWidget() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          source: "footer",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail("")
        setFirstName("")
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            Merci pour votre inscription! Consultez votre boîte mail.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5" />
        Newsletter
      </h3>
      <p className="text-corsican-clay-100 text-sm mb-4">
        Recevez nos actualités et offres exclusives
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom (optionnel)"
          className="w-full px-4 py-2 rounded-lg border border-corsican-clay-500 bg-white/10 text-white placeholder-corsican-clay-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
            className="flex-1 px-4 py-2 rounded-lg border border-corsican-clay-500 bg-white/10 text-white placeholder-corsican-clay-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-white text-corsican-clay-700 font-semibold rounded-lg hover:bg-corsican-clay-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "OK"
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-200">{error}</p>
        )}
      </form>
    </div>
  )
}
