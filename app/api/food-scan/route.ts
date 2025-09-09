import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/genai"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = Buffer.from(await file.arrayBuffer())

    // Initialize Gemini
    const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Analyze this food image and return JSON with keys: 
    - foods: array of {name: string, confidence: number} for detected foods
    - estimated_portions: array of {name: string, unit: string, value: number} 
    - allergens: array of strings for common allergens
    - notes: string with additional observations
    
    Focus on identifying individual ingredients and foods. Be specific and accurate. No commentary outside the JSON.`

    // Call Gemini with image
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: bytes.toString("base64"),
                mimeType: file.type || "image/jpeg",
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    })

    const geminiResponse = JSON.parse(result.response.text())

    // Get user's gut history and compute score
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const gutScore = await computeGutScore(geminiResponse.foods, user.id)

    // Save to database
    await supabase.from("food_scans").insert({
      user_id: user.id,
      image_url: "temp_url", // In production, upload to storage
      items: geminiResponse.foods,
      gut_score: gutScore.score,
      reasons: gutScore.reasons,
      advice: gutScore.advice,
    })

    return NextResponse.json({
      ...geminiResponse,
      score: gutScore.score,
      reasons: gutScore.reasons,
      advice: gutScore.advice,
    })
  } catch (error) {
    console.error("Food scan error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

async function computeGutScore(foods: Array<{ name: string; confidence: number }>, userId: string) {
  const supabase = createClient()

  // Get user's gut history
  const { data: gutHistory } = await supabase.from("gut_history").select("*").eq("user_id", userId).single()

  let score = 90
  const reasons: string[] = []
  let advice = "Your meal looks generally gut-friendly!"

  if (!gutHistory) {
    return { score, reasons, advice }
  }

  const triggers = gutHistory.known_triggers || []
  const isFlareActive = gutHistory.flare_active || false
  const avgStoolType = gutHistory.avg_stool_type_7d || 4

  for (const food of foods) {
    const foodName = food.name.toLowerCase()

    // High-FODMAP foods
    if (["onion", "garlic", "wheat", "apple", "mango"].some((fodmap) => foodName.includes(fodmap))) {
      if (triggers.includes("fodmap")) {
        score -= 10
        reasons.push(`High-FODMAP ${food.name} detected - you've marked FODMAPs as a trigger`)
      } else if (avgStoolType >= 6) {
        score -= 5
        reasons.push(`High-FODMAP ${food.name} may worsen loose stools`)
      }
    }

    // Lactose
    if (["milk", "cream", "cheese", "yogurt"].some((dairy) => foodName.includes(dairy))) {
      if (triggers.includes("lactose")) {
        score -= 10
        reasons.push(`Lactose in ${food.name} - you've marked lactose as a trigger`)
      } else if (isFlareActive) {
        score -= 5
        reasons.push(`Dairy may worsen current flare symptoms`)
      }
    }

    // Spicy foods
    if (["chili", "pepper", "spicy", "hot"].some((spice) => foodName.includes(spice))) {
      if (triggers.includes("spicy")) {
        score -= 8
        reasons.push(`Spicy ${food.name} - you've marked spicy foods as triggers`)
      } else if (isFlareActive) {
        score -= 4
        reasons.push(`Spicy foods may irritate during flares`)
      }
    }

    // High fat foods
    if (["fried", "oil", "butter", "fatty"].some((fat) => foodName.includes(fat))) {
      if (isFlareActive) {
        score -= 6
        reasons.push(`High-fat ${food.name} may worsen flare symptoms`)
      }
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score))

  // Generate advice based on score
  if (score < 50) {
    advice =
      "Consider avoiding trigger foods and opt for gentler alternatives like rice, bananas, or cooked vegetables."
  } else if (score < 80) {
    advice = "Some foods may cause mild symptoms. Try smaller portions or pair with gut-friendly foods."
  }

  return { score, reasons, advice }
}
