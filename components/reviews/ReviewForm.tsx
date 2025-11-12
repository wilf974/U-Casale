"use client"

import { useState } from "react"
import { Star, Loader2, CheckCircle } from "lucide-react"

interface ReviewFormProps {
  customerId: string
  orderId?: string
  reservationId?: string
  onSuccess?: () => void
}

export default function ReviewForm({
  customerId,
  orderId,
  reservationId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Veuillez sélectionner une note")
      return
    }

    if (!comment.trim()) {
      setError("Veuillez écrire un commentaire")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          orderId,
          reservationId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          images: [], // TODO: Add image upload support
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        if (onSuccess) onSuccess()
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Erreur lors de l'envoi de l'avis")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-xl p-8 text-center border-2 border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Merci pour votre avis !
        </h3>
        <p className="text-stone-600">
          Votre avis a été publié et vous avez gagné 50 points de fidélité.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200">
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">
        Laissez votre avis
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Note *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-stone-200 text-stone-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-stone-600">
                {rating === 1 && "Très décevant"}
                {rating === 2 && "Décevant"}
                {rating === 3 && "Correct"}
                {rating === 4 && "Bien"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Titre (optionnel)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Résumez votre expérience"
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Commentaire *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-corsican-maquis-500"
          />
          <p className="text-xs text-stone-500 mt-1">
            {comment.length}/1000 caractères
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-corsican-maquis-600 text-white font-semibold rounded-lg hover:bg-corsican-maquis-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span>Publier mon avis</span>
          )}
        </button>

        <p className="text-xs text-stone-500 text-center">
          En publiant votre avis, vous acceptez qu'il soit visible publiquement et gagnerez 50 points de fidélité.
        </p>
      </form>
    </div>
  )
}
