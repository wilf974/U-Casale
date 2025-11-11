import Stripe from "stripe"

// Utiliser une clé factice pendant le build si non définie
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build"

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
})

// Fonction helper pour valider que Stripe est configuré
function ensureStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined. Please set it in your environment variables.")
  }
}

// Helper pour créer une session de paiement pour une réservation
export async function createReservationCheckoutSession({
  reservationId,
  amount,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  reservationId: string
  amount: number
  customerEmail: string
  successUrl: string
  cancelUrl: string
}) {
  ensureStripeConfigured()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Réservation Gîte U Casale",
            description: `Réservation #${reservationId}`,
          },
          unit_amount: Math.round(amount * 100), // Convertir en centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      reservationId,
      type: "reservation",
    },
  })

  return session
}

// Helper pour créer une session de paiement pour une commande e-commerce
export async function createOrderCheckoutSession({
  orderId,
  items,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  orderId: string
  items: Array<{
    name: string
    description?: string
    amount: number
    quantity: number
    images?: string[]
  }>
  customerEmail: string
  successUrl: string
  cancelUrl: string
}) {
  ensureStripeConfigured()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images,
        },
        unit_amount: Math.round(item.amount * 100), // Convertir en centimes
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      orderId,
      type: "order",
    },
  })

  return session
}

// Helper pour créer un remboursement
export async function createRefund(paymentIntentId: string, amount?: number) {
  ensureStripeConfigured()

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  })

  return refund
}

// Helper pour récupérer une session de paiement
export async function retrieveCheckoutSession(sessionId: string) {
  ensureStripeConfigured()

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session
}
