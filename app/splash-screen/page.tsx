"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
            alt="GutGuard Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">GutGuard</h1>
        <p className="text-gray-600">Your Digestive Health Companion</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
