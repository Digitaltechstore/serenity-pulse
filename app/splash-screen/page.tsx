"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function SplashScreen() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (user && !error) {
          // User is authenticated, redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          // User is not authenticated, redirect to onboarding
          setTimeout(() => {
            router.push("/onboarding")
          }, 3000)
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        // If auth check fails, default to onboarding flow
        setTimeout(() => {
          router.push("/onboarding")
        }, 3000)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuthAndRedirect()
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
