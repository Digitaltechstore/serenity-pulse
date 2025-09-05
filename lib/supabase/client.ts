import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase URL available:", !!url)
  console.log("[v0] Supabase Key available:", !!key)

  if (!url || !key) {
    console.error("[v0] Missing Supabase environment variables")
    console.error("[v0] URL:", url ? "SET" : "MISSING")
    console.error("[v0] KEY:", key ? "SET" : "MISSING")
    throw new Error("Missing Supabase environment variables. Please check your project settings.")
  }

  return createBrowserClient(url, key)
}
