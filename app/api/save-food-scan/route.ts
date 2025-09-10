import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://atsajxerbamujdflueel.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2FqeGVyYmFtdWpkZmx1ZWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTcxNTgsImV4cCI6MjA3MjUzMzE1OH0.8OfHXQF_9jSpJe7d825tJAbR-TEZ0Tbc0dpFE9SEGq8",
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, foods, totals, gutScore, reasons, advice, timestamp } = body

    // Save to Supabase food_scans table
    const { data, error } = await supabase.from("food_scans").insert([
      {
        image_url: imageUrl,
        foods: foods,
        nutritional_totals: totals,
        gut_score: gutScore,
        score_reasons: reasons,
        advice: advice,
        created_at: timestamp || new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save to database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Save food scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
