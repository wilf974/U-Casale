import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "U Casale - Seni Production | Gîte & Produits Corses à Piscia Rossa",
  description: "Réservez votre séjour au gîte U Casale et découvrez nos produits artisanaux corses. Situé à Piscia Rossa, venez vivre une expérience authentique.",
  keywords: ["gîte", "corse", "Piscia Rossa", "U Casale", "Seni Production", "produits corses", "réservation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
