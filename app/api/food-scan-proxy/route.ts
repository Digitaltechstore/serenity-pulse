import { type NextRequest, NextResponse } from "next/server"

async function retryWebhookCall(webhookUrl: string, formData: FormData, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[v0] Food scan proxy: Attempt ${attempt}/${maxRetries}`)

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": "GutGuard-App/1.0",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      console.log(`[v0] Food scan proxy: Attempt ${attempt} response status:`, response.status)

      if (response.ok) {
        return response
      }

      // If it's a 500 error, we should retry
      if (response.status >= 500 && attempt < maxRetries) {
        console.log(`[v0] Food scan proxy: Server error ${response.status}, retrying in ${attempt * 1000}ms...`)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000)) // Exponential backoff
        continue
      }

      // For non-500 errors or final attempt, return the response
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      console.log(`[v0] Food scan proxy: Attempt ${attempt} failed:`, lastError.message)

      if (attempt < maxRetries) {
        console.log(`[v0] Food scan proxy: Retrying in ${attempt * 1000}ms...`)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
      }
    }
  }

  throw lastError || new Error("All retry attempts failed")
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Food scan proxy: Received request")

    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      console.log("[v0] Food scan proxy: No image found in request")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Food scan proxy: Image received, size:", image.size)

    // Validate image type
    if (!image.type.startsWith("image/")) {
      console.log("[v0] Food scan proxy: Invalid file type:", image.type)
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 })
    }

    // Create new FormData for the webhook
    const webhookFormData = new FormData()
    webhookFormData.append("image", image)

    const webhookUrl = "https://john09lim.app.n8n.cloud/webhook/GUT%20GUARD%20AI"
    console.log("[v0] Food scan proxy: Sending to webhook:", webhookUrl)

    const response = await retryWebhookCall(webhookUrl, webhookFormData)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Food scan proxy: Webhook error:", errorText)

      let errorMessage = `Webhook failed: ${response.status}`
      if (response.status >= 500) {
        errorMessage = "Food analysis service is temporarily unavailable. Please try again in a moment."
      } else if (response.status === 413) {
        errorMessage = "Image file is too large. Please try a smaller image."
      } else if (response.status === 400) {
        errorMessage = "Invalid image format. Please try a different image."
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Food scan proxy: Webhook success, returning data")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Food scan proxy error:", error)

    let errorMessage = "Food analysis service is currently unavailable. Please try again later."

    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again with a smaller image."
      } else if (error.message.includes("Failed to fetch") || error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again."
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
