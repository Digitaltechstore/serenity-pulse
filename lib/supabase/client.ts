import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    const url = "https://atsajxerbamujdflueel.supabase.co"
    const key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2FqeGVyYmFtdWpkZmx1ZWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTcxNTgsImV4cCI6MjA3MjUzMzE1OH0.8OfHXQF_9jSpJe7d825tJAbR-TEZ0Tbc0dpFE9SEGq8"

    supabaseClient = createBrowserClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return supabaseClient
}
