import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, context } = await request.json()

    // Convert base64 image to analyze with DeepSeek
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${context}

Please analyze this food image and provide:
1. Food identification and main ingredients
2. Nutritional benefits for gut health (fiber, prebiotics, probiotics)
3. Potential gut health concerns or triggers
4. Scientific evidence and recommendations
5. Overall gut health rating (Excellent/Good/Moderate/Avoid)

Base your analysis on current scientific research about gut microbiome, digestive health, and inflammatory foods.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    const data = await response.json()

    if (data.choices && data.choices[0]) {
      return NextResponse.json({
        analysis: data.choices[0].message.content,
      })
    } else {
      return NextResponse.json({
        analysis: "Unable to analyze the food image. Please ensure the image is clear and shows food items.",
      })
    }
  } catch (error) {
    console.error("Food analysis error:", error)
    return NextResponse.json({
      analysis: "Analysis temporarily unavailable. Please try again later.",
    })
  }
}
