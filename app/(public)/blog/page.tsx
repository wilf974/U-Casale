"use client"

import { useState, useEffect } from "react"
import PublicLayout from "@/components/layout/PublicLayout"
import { Calendar, User, Eye, ArrowRight, Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  featuredImage?: string
  author: string
  category?: string
  tags: string[]
  publishedAt: string
  viewCount: number
}

interface Category {
  name: string
  count: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      params.append("limit", "20")

      const response = await fetch(`/api/blog?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-corsican-maquis-50 to-corsican-sand-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-corsican-maquis-600 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold uppercase text-sm tracking-wider">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
            Actualités & Découvertes
          </h1>
          <p className="text-xl text-corsican-clay-700">
            Découvrez nos articles sur la Corse, nos produits et notre savoir-faire
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === null
                    ? "bg-corsican-maquis-600 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Tous les articles
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.name
                      ? "bg-corsican-maquis-600 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-corsican-maquis-600 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
              <BookOpen className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-stone-900 mb-2">
                Aucun article
              </h3>
              <p className="text-stone-600">
                {selectedCategory
                  ? "Aucun article dans cette catégorie pour le moment"
                  : "Les articles seront bientôt disponibles"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Featured Image */}
                  <div className="aspect-video bg-gradient-to-br from-corsican-sand-100 to-corsican-maquis-100 relative overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-16 w-16 text-corsican-sand-300" />
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-corsican-maquis-600 text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(post.publishedAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-corsican-maquis-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-stone-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}

                    {/* Read More */}
                    <div className="flex items-center text-corsican-maquis-600 font-semibold group-hover:gap-2 transition-all">
                      <span>Lire la suite</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
