import { type NextRequest, NextResponse } from "next/server"

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

    // Create new FormData for the webhook
    const webhookFormData = new FormData()
    webhookFormData.append("image", image)

    const webhookUrl = "https://john09lim.app.n8n.cloud/webhook-test/GUT%20GUARD%20AI"
    console.log("[v0] Food scan proxy: Sending to webhook:", webhookUrl)

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: webhookFormData,
    })

    console.log("[v0] Food scan proxy: Webhook response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Food scan proxy: Webhook error:", errorText)
      return NextResponse.json({ error: `Webhook failed: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Food scan proxy: Webhook success, returning data")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Food scan proxy error:", error)
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
