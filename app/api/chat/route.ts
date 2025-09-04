import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer sk-76b1816603664b6896007fde8a98491c`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are GutGuard AI, a helpful assistant specializing in gut health and digestive wellness. 
            Provide supportive, informative advice about digestive health, diet, and lifestyle factors that affect gut health. 
            Always remind users to consult healthcare professionals for serious concerns. Keep responses concise and practical.
            Context: ${context}`,
          },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "Sorry, I could not process your request."

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
