"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import PublicLayout from "@/components/layout/PublicLayout"
import { Calendar, User, Eye, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  featuredImage?: string
  author: string
  category?: string
  tags: string[]
  publishedAt: string
  viewCount: number
}

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  featuredImage?: string
  publishedAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()

      if (response.ok) {
        setPost(data.post)
        setRelatedPosts(data.relatedPosts)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-corsican-maquis-600 animate-spin" />
        </div>
      </PublicLayout>
    )
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-stone-900 mb-4">Article introuvable</h1>
            <Link
              href="/blog"
              className="text-corsican-maquis-600 hover:text-corsican-maquis-700 font-semibold"
            >
              Retour au blog
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <article className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-corsican-maquis-50 to-corsican-sand-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-corsican-maquis-600 hover:text-corsican-maquis-700 font-medium mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>

            {post.category && (
              <span className="inline-block px-3 py-1 bg-corsican-maquis-600 text-white text-sm font-semibold rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-stone-600 mb-6">{post.excerpt}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-stone-600">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{post.viewCount} vues</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg prose-stone max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-stone-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">
                Articles similaires
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100">
                      {relatedPost.featuredImage && (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-stone-500 mb-2">
                        {format(new Date(relatedPost.publishedAt), "d MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                      <h3 className="font-semibold text-stone-900 group-hover:text-corsican-maquis-700 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </PublicLayout>
  )
}
