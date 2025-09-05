"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Attempting login with email:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        throw error
      }

      console.log("[v0] Login successful, redirecting to main app")
      router.push("/")
    } catch (error: any) {
      console.error("[v0] Login failed:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      alert("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
            alt="GutGuard Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-green-400">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your GutGuard account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-green-400 hover:text-green-300 text-sm underline"
          >
            Forgot Password?
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-green-400 hover:text-green-300 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
