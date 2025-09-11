import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

const FoodAnalysisSchema = z.object({
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      fiber: z.number().optional(),
      sugar: z.number().optional(),
    }),
  ),
  totals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number().optional(),
    sugar: z.number().optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] AI Food Analysis: Starting analysis")

    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      console.log("[v0] AI Food Analysis: No image provided")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] AI Food Analysis: Converting image to base64")
    const bytes = await imageFile.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = imageFile.type || "image/jpeg"
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log("[v0] AI Food Analysis: Sending to Groq AI")

    const result = await generateObject({
      model: groq("llama-3.2-90b-vision-preview"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and provide detailed nutritional information. Identify all visible food items and estimate their quantities and nutritional values per serving. Return the data in the specified JSON format with individual foods and totals.

Guidelines:
- Be as accurate as possible with portion size estimates
- Include calories, protein (g), carbs (g), fat (g), fiber (g), sugar (g)
- If multiple food items are visible, list each separately
- Calculate totals for all items combined
- Use standard serving sizes and nutritional databases for accuracy`,
            },
            {
              type: "image",
              image: dataUrl,
            },
          ],
        },
      ],
      schema: FoodAnalysisSchema,
      temperature: 0.1,
    })

    console.log("[v0] AI Food Analysis: Analysis complete")

    return NextResponse.json({
      success: true,
      data: result.object,
    })
  } catch (error) {
    console.error("[v0] AI Food Analysis Error:", error)
    return NextResponse.json({ error: "Failed to analyze food image" }, { status: 500 })
  }
}
