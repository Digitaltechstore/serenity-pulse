import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "GutGuard - Your Personal Gut Health Companion",
  description:
    "Track your digestive health, scan food for gut-friendly recommendations, and get personalized advice from our AI coach. Your journey to better gut health starts here.",
  generator: "GutGuard",
  keywords: "gut health, digestive health, food scanner, health tracking, AI health coach",
  authors: [{ name: "GutGuard" }],
  openGraph: {
    title: "GutGuard - Your Personal Gut Health Companion",
    description:
      "Track your digestive health, scan food for gut-friendly recommendations, and get personalized advice from our AI coach.",
    url: "https://gutguard.online",
    siteName: "GutGuard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GutGuard - Your Personal Gut Health Companion",
    description:
      "Track your digestive health, scan food for gut-friendly recommendations, and get personalized advice from our AI coach.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
