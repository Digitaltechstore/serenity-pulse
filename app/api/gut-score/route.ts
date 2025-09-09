import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { foods, totals, meta } = await request.json()

    if (!foods || !Array.isArray(foods)) {
      return NextResponse.json({ error: "Invalid foods data" }, { status: 400 })
    }

    const supabaseUrl = "https://atsajxerbamujdflueel.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2FqeGVyYmFtdWpkZmx1ZWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTcxNTgsImV4cCI6MjA3MjUzMzE1OH0.8OfHXQF_9jSpJe7d825tJAbR-TEZ0Tbc0dpFE9SEGq8"
    const supabase = createClient(supabaseUrl, supabaseKey)

    let gutHistory = {
      sensitivities: ["gluten", "dairy", "spicy foods"],
      conditions: ["IBS", "acid reflux"],
      triggers: ["high fiber", "processed foods"],
      preferences: ["low FODMAP", "anti-inflammatory"],
    }

    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        // Fetch recent gut history from logs
        const { data: logs } = await supabase
          .from("gut_logs")
          .select("*")
          .eq("user_id", user.user.id)
          .order("created_at", { ascending: false })
          .limit(30)

        if (logs && logs.length > 0) {
          // Analyze logs to extract patterns
          const symptoms = logs.flatMap((log) => log.symptoms || [])
          const triggers = logs.flatMap((log) => log.triggers || [])
          const notes = logs.map((log) => log.notes).filter(Boolean)

          gutHistory = {
            sensitivities: [...new Set(triggers)],
            conditions: [...new Set(symptoms)],
            triggers: [...new Set(triggers)],
            preferences: ["based on recent logs"],
            recentSymptoms: symptoms.slice(0, 10),
            recentNotes: notes.slice(0, 5),
          }
        }
      }
    } catch (dbError) {
      console.error("Database error, using fallback:", dbError)
    }

    // Calculate Gut Guard Score using DeepSeek API
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY

    if (!deepseekApiKey) {
      console.error("DEEPSEEK_API_KEY not found")
      return NextResponse.json({
        score: 50,
        reasons: ["Unable to perform detailed analysis"],
        advice: "Please consult with a healthcare provider for personalized advice.",
      })
    }

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `As a gut health expert, analyze this meal for digestive impact based on scientific research.

FOODS DETECTED: ${foods.map((f) => `${f.name} (${f.quantity || "unknown quantity"})`).join(", ")}

NUTRITIONAL TOTALS: 
- Calories: ${totals?.calories || "unknown"}
- Protein: ${totals?.protein || "unknown"}g
- Carbs: ${totals?.carbs || "unknown"}g  
- Fat: ${totals?.fat || "unknown"}g

USER GUT HISTORY:
${JSON.stringify(gutHistory, null, 2)}

Provide a Gut Guard Score (0-100) based on:
- Fiber content and gut microbiome support
- Inflammatory potential of ingredients
- FODMAP levels for sensitive individuals
- Processing level and additives
- Compatibility with user's known triggers/sensitivities

Score ranges:
- 80-100: Excellent for gut health, supports microbiome
- 50-79: Moderate impact, some considerations needed
- 0-49: High risk for digestive issues

Return ONLY valid JSON (no markdown formatting):
{
  "score": number,
  "reasons": ["specific reason 1", "specific reason 2", "specific reason 3"],
  "advice": "personalized advice based on user history and food analysis"
}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("No content in DeepSeek response")
      }

      let cleanContent = content.trim()
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      // Parse JSON response from DeepSeek
      const analysis = JSON.parse(cleanContent)

      return NextResponse.json({
        score: Math.max(0, Math.min(100, analysis.score || 50)),
        reasons: analysis.reasons || [],
        advice: analysis.advice || "No specific advice available.",
      })
    } catch (deepseekError) {
      console.error("DeepSeek API error:", deepseekError)

      // Fallback scoring logic
      const riskFoods = ["fried", "spicy", "processed", "dairy", "gluten", "sugar"]
      const beneficialFoods = ["fiber", "probiotic", "vegetable", "fruit", "lean protein"]

      let score = 70 // Base score
      const reasons: string[] = []

      foods.forEach((food) => {
        const foodName = food.name.toLowerCase()

        if (riskFoods.some((risk) => foodName.includes(risk))) {
          score -= 15
          reasons.push(`${food.name} may trigger digestive issues`)
        }

        if (beneficialFoods.some((benefit) => foodName.includes(benefit))) {
          score += 10
          reasons.push(`${food.name} supports gut health`)
        }
      })

      score = Math.max(0, Math.min(100, score))

      return NextResponse.json({
        score,
        reasons: reasons.length > 0 ? reasons : ["Analysis based on general gut health principles"],
        advice:
          score >= 80
            ? "This meal looks gut-friendly!"
            : score >= 50
              ? "Consider moderating portion sizes and adding gut-friendly foods."
              : "This meal may cause digestive discomfort. Consider alternatives.",
      })
    }
  } catch (error) {
    console.error("Gut score analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze gut score" }, { status: 500 })
  }
}
