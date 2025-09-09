import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { foods } = await req.json()

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Recompute score with updated food list
    const gutScore = await computeGutScore(foods, user.id)

    return NextResponse.json(gutScore)
  } catch (error) {
    console.error("Score computation error:", error)
    return NextResponse.json({ error: "Score computation failed" }, { status: 500 })
  }
}

async function computeGutScore(foods: Array<{ name: string; confidence: number }>, userId: string) {
  const supabase = createClient()

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

    if (["onion", "garlic", "wheat", "apple", "mango"].some((fodmap) => foodName.includes(fodmap))) {
      if (triggers.includes("fodmap")) {
        score -= 10
        reasons.push(`High-FODMAP ${food.name} detected - you've marked FODMAPs as a trigger`)
      } else if (avgStoolType >= 6) {
        score -= 5
        reasons.push(`High-FODMAP ${food.name} may worsen loose stools`)
      }
    }

    if (["milk", "cream", "cheese", "yogurt"].some((dairy) => foodName.includes(dairy))) {
      if (triggers.includes("lactose")) {
        score -= 10
        reasons.push(`Lactose in ${food.name} - you've marked lactose as a trigger`)
      } else if (isFlareActive) {
        score -= 5
        reasons.push(`Dairy may worsen current flare symptoms`)
      }
    }

    if (["chili", "pepper", "spicy", "hot"].some((spice) => foodName.includes(spice))) {
      if (triggers.includes("spicy")) {
        score -= 8
        reasons.push(`Spicy ${food.name} - you've marked spicy foods as triggers`)
      } else if (isFlareActive) {
        score -= 4
        reasons.push(`Spicy foods may irritate during flares`)
      }
    }

    if (["fried", "oil", "butter", "fatty"].some((fat) => foodName.includes(fat))) {
      if (isFlareActive) {
        score -= 6
        reasons.push(`High-fat ${food.name} may worsen flare symptoms`)
      }
    }
  }

  score = Math.max(0, Math.min(100, score))

  if (score < 50) {
    advice =
      "Consider avoiding trigger foods and opt for gentler alternatives like rice, bananas, or cooked vegetables."
  } else if (score < 80) {
    advice = "Some foods may cause mild symptoms. Try smaller portions or pair with gut-friendly foods."
  }

  return { score, reasons, advice }
}
