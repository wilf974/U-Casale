import PublicLayout from "@/components/layout/PublicLayout"
import ReviewList from "@/components/reviews/ReviewList"
import { MessageCircle } from "lucide-react"

export default function AvisPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-corsican-maquis-50 to-corsican-sand-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-corsican-maquis-600 mb-4">
            <MessageCircle className="h-6 w-6" />
            <span className="font-semibold uppercase text-sm tracking-wider">
              Avis Clients
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-corsican-clay-900 mb-6">
            Ce que nos clients disent
          </h1>
          <p className="text-xl text-corsican-clay-700">
            Découvrez les expériences partagées par nos visiteurs
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewList type="all" limit={50} />
        </div>
      </section>
    </PublicLayout>
  )
}
