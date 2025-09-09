import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { foods, totals, meta } = await request.json()

    if (!foods || !Array.isArray(foods)) {
      return NextResponse.json({ error: "Invalid foods data" }, { status: 400 })
    }

    // Mock gut history for now - in production, fetch from database
    const mockGutHistory = {
      sensitivities: ["gluten", "dairy", "spicy foods"],
      conditions: ["IBS", "acid reflux"],
      triggers: ["high fiber", "processed foods"],
      preferences: ["low FODMAP", "anti-inflammatory"],
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
              content: `Analyze this meal for gut health impact. Foods: ${foods.map((f) => f.name).join(", ")}. 
            User gut history: ${JSON.stringify(mockGutHistory)}. 
            Nutritional totals: ${JSON.stringify(totals)}.
            
            Provide a Gut Guard Score (0-100) where:
            - 80-100: Gut friendly, supports digestive health
            - 50-79: Moderate risk, some potential issues
            - 0-49: High risk, likely to cause digestive problems
            
            Consider: fiber content, inflammatory foods, FODMAP levels, processing level, gut microbiome impact.
            
            Return JSON format:
            {
              "score": number,
              "reasons": ["reason1", "reason2"],
              "advice": "personalized advice string"
            }`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
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

      // Parse JSON response from DeepSeek
      const analysis = JSON.parse(content)

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
