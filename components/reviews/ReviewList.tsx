"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Loader2, MessageCircle } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  images: string[]
  helpful: number
  verified: boolean
  adminResponse?: string
  respondedAt?: string
  createdAt: string
  customer: {
    firstName: string
    lastName: string
  }
}

interface ReviewListProps {
  type?: "order" | "reservation" | "all"
  limit?: number
}

export default function ReviewList({ type, limit = 20 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [type])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (type && type !== "all") params.append("type", type)
      params.append("limit", limit.toString())

      const response = await fetch(`/api/reviews?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/reviews/stats")
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-stone-200 text-stone-200"
            }`}
          />
        ))}
      </div>
    )
  }

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600 w-8">{rating}★</span>
        <div className="flex-1 bg-stone-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-stone-600 w-12 text-right">{count}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-corsican-maquis-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:border-r border-stone-200">
            <div className="text-5xl font-bold text-stone-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(stats.averageRating), "lg")}
            <p className="text-sm text-stone-600 mt-2">
              Basé sur {stats.totalReviews} avis
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => renderRatingBar(rating, stats.distribution[rating as keyof typeof stats.distribution]))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
          <MessageCircle className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-900 mb-2">
            Aucun avis pour le moment
          </h3>
          <p className="text-stone-600">
            Soyez le premier à partager votre expérience!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-stone-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-corsican-maquis-100 flex items-center justify-center">
                        <span className="text-corsican-maquis-700 font-semibold">
                          {review.customer.firstName[0]}
                          {review.customer.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">
                          {review.customer.firstName} {review.customer.lastName[0]}.
                        </p>
                        {review.verified && (
                          <span className="text-xs text-green-600 font-medium">
                            Achat vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-stone-500">
                  {format(new Date(review.createdAt), "d MMM yyyy", { locale: fr })}
                </span>
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="text-lg font-semibold text-stone-900 mb-2">
                  {review.title}
                </h4>
              )}

              {/* Comment */}
              <p className="text-stone-700 mb-4 leading-relaxed">{review.comment}</p>

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Admin Response */}
              {review.adminResponse && (
                <div className="mt-4 p-4 bg-corsican-sand-50 rounded-lg border border-corsican-sand-200">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-5 w-5 text-corsican-maquis-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900 mb-1">
                        Réponse de U Casale
                      </p>
                      <p className="text-sm text-stone-700">{review.adminResponse}</p>
                      {review.respondedAt && (
                        <p className="text-xs text-stone-500 mt-1">
                          {format(new Date(review.respondedAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Helpful */}
              <div className="mt-4 pt-4 border-t border-stone-200">
                <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Utile ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
