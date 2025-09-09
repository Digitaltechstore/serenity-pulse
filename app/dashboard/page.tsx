"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Heart,
  Activity,
  TrendingUp,
  LogOut,
  Camera,
  MessageCircle,
  FileText,
  Settings,
  Home,
  Send,
  X,
  Plus,
  Shield,
  ChevronDown,
  ChevronUp,
  Calendar,
  Palette,
  Upload,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  const [profileName, setProfileName] = useState("")

  const [expandedTips, setExpandedTips] = useState<string | null>(null)

  const [currentTheme, setCurrentTheme] = useState("normal")

  const themes = {
    light: {
      name: "Soothing Sage",
      primary: "hsl(142, 45%, 35%)", // Dark sage green
      primaryDark: "hsl(15, 60%, 25%)", // Dark earthy brown
      accent: "hsl(85, 35%, 45%)", // Darker lime
      background: "hsl(120, 15%, 98%)", // Very light sage
      surface: "hsl(120, 20%, 95%)", // Light sage
      text: "hsl(0, 0%, 15%)", // Dark gray text
      textSecondary: "hsl(0, 0%, 35%)", // Medium gray text
      border: "hsl(120, 15%, 85%)", // Light border
      success: "hsl(142, 50%, 40%)", // Dark green
      successBg: "hsl(142, 50%, 95%)", // Light green background
      danger: "hsl(15, 60%, 40%)", // Dark red-brown
      dangerBg: "hsl(15, 60%, 95%)", // Light red background
    },
    normal: {
      name: "Berry Gut",
      primary: "hsl(338, 70%, 45%)", // Darker berry pink
      primaryDark: "hsl(345, 60%, 25%)", // Very dark berry
      accent: "hsl(155, 28%, 35%)", // Dark eucalyptus green
      background: "hsl(15, 55%, 95%)", // Very light peach-beige
      surface: "hsl(15, 55%, 92%)", // Light peach-beige
      text: "hsl(0, 0%, 10%)", // Very dark gray text
      textSecondary: "hsl(0, 0%, 30%)", // Dark gray text
      border: "hsl(15, 55%, 80%)", // Warm border
      success: "hsl(155, 28%, 35%)", // Dark green
      successBg: "hsl(155, 28%, 95%)", // Light green background
      danger: "hsl(345, 60%, 35%)", // Dark berry
      dangerBg: "hsl(345, 60%, 95%)", // Light berry background
    },
    dark: {
      name: "Dark Mode",
      primary: "hsl(280, 45%, 70%)", // Bright lavender
      primaryDark: "hsl(20, 70%, 55%)", // Warm orange
      accent: "hsl(160, 40%, 65%)", // Soft green
      background: "hsl(280, 35%, 8%)", // Very deep purple
      surface: "hsl(280, 30%, 12%)", // Dark purple
      text: "hsl(0, 0%, 95%)", // Very light text
      textSecondary: "hsl(0, 0%, 75%)", // Light gray text
      border: "hsl(280, 30%, 20%)", // Dark border
      success: "hsl(160, 40%, 65%)", // Light green
      successBg: "hsl(160, 40%, 15%)", // Dark green background
      danger: "hsl(20, 70%, 55%)", // Orange
      dangerBg: "hsl(20, 70%, 15%)", // Dark orange background
    },
  }

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes]
    if (theme) {
      const root = document.documentElement
      Object.entries(theme).forEach(([key, value]) => {
        if (key !== "name") {
          // Skip the name property
          root.style.setProperty(`--theme-${key}`, value)
        }
      })
    }
  }

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  // Chat states for AI Coach
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectedFoods, setDetectedFoods] = useState<Array<{ name: string; confidence: number }>>([])
  const [gutScore, setGutScore] = useState<number | null>(null)
  const [scoreReasons, setScoreReasons] = useState<string[]>([])
  const [scoreAdvice, setScoreAdvice] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFileInput, setShowFileInput] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [scanState, setScanState] = useState<"idle" | "loading" | "results" | "error">("idle")
  const [scanError, setScanError] = useState<string>("")
  const [scanTotals, setScanTotals] = useState<any>(null)
  const [scanMeta, setScanMeta] = useState<any>(null)
  const [capturedImageFile, setCapturedImageFile] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string>("")

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setScanError("File too large. Please select an image under 10MB.")
      setScanState("error")
      return
    }

    setScanState("loading")
    setScanError("")
    setCapturedImageFile(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append("image", file)

      const n8nWebhookUrl = "https://john09lim.app.n8n.cloud/webhook-test/GUT%20GUARD%20AI"

      console.log("[v0] Sending image to webhook:", n8nWebhookUrl)

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      })

      console.log("[v0] Webhook response status:", response.status)

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Webhook response data:", data)

      if (data && data.output) {
        const output = data.output

        if (output.status === "success" && output.food) {
          setDetectedFoods(output.food)
          setScanTotals(output.total || null)
          setScanState("results")
        } else {
          throw new Error("Analysis failed or returned error status")
        }
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.error("Food scan error:", error)
      setScanError(error instanceof Error ? error.message : "Analysis failed. Please try again.")
      setScanState("error")
    }
  }

  const analyzeForMyGut = async () => {
    if (detectedFoods.length === 0) return

    try {
      const response = await fetch("/api/gut-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foods: detectedFoods,
          totals: scanTotals,
          meta: scanMeta,
        }),
      })

      if (!response.ok) {
        throw new Error("Gut score analysis failed")
      }

      const data = await response.json()
      setGutScore(data.score)
      setScoreReasons(data.reasons || [])
      setScoreAdvice(data.advice || "")
    } catch (error) {
      console.error("Gut score error:", error)
      setScanError("Gut analysis failed. Please try again.")
    }
  }

  const removeFoodItem = (index: number) => {
    const newFoods = detectedFoods.filter((_, i) => i !== index)
    setDetectedFoods(newFoods)
  }

  const addFoodItem = (foodName: string) => {
    if (!foodName.trim()) return
    const newFood = { name: foodName.trim() }
    setDetectedFoods([...detectedFoods, newFood])
  }

  const saveToGutJournal = async () => {
    if (!capturedImageFile || gutScore === null) return

    try {
      const response = await fetch("/api/save-food-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: capturedImageFile,
          foods: detectedFoods,
          totals: scanTotals,
          gutScore,
          reasons: scoreReasons,
          advice: scoreAdvice,
        }),
      })

      if (response.ok) {
        alert("Saved to Gut Journal!")
        resetScan()
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save. Please try again.")
    }
  }

  const resetScan = () => {
    setScanState("idle")
    setScanError("")
    setDetectedFoods([])
    setScanTotals(null)
    setScanMeta(null)
    setGutScore(null)
    setScoreReasons([])
    setScoreAdvice("")
    setCapturedImageFile(null)
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [stoolType, setStoolType] = useState<number | null>(null)
  const [stoolNotes, setStoolNotes] = useState("")
  const [symptoms, setSymptoms] = useState({
    bloating: 0,
    pain: 0,
    gas: 0,
    nausea: 0,
    fatigue: 0,
  })
  const [foodEntries, setFoodEntries] = useState<Array<{ food: string; tag: "safe" | "trigger" | "unsure" }>>([])
  const [newFood, setNewFood] = useState("")
  const [foodTag, setFoodTag] = useState<"safe" | "trigger" | "unsure">("safe")
  const [hydration, setHydration] = useState(8)
  const [sleep, setSleep] = useState(8)
  const [stress, setStress] = useState(3)
  const [exercise, setExercise] = useState(30)
  const [dailyNotes, setDailyNotes] = useState("")
  const [dailySummaries, setDailySummaries] = useState<Record<string, any>>({})
  const [showTrends, setShowTrends] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("[v0] Attempting to check user authentication")
        const supabase = createClient()

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("[v0] Supabase session error:", sessionError)
          // Handle specific session errors
          if (sessionError.message?.includes("session") || sessionError.message?.includes("Auth")) {
            console.log("[v0] Session expired or missing, redirecting to login")
            router.push("/login")
            return
          }
          // Don't redirect on network errors, allow offline usage
          if (sessionError.message?.includes("fetch")) {
            console.log("[v0] Network error detected, allowing offline access")
            setLoading(false)
            return
          }
        }

        if (!session?.user) {
          console.log("[v0] No user session found, redirecting to login")
          router.push("/login")
          return
        }

        console.log("[v0] User authenticated successfully")
        setUser(session.user)
        setProfileName(session.user?.user_metadata?.name || "")
        setLoading(false)
      } catch (error) {
        console.error("[v0] Authentication check failed:", error)
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = async () => {
    try {
      console.log("[v0] Attempting logout")
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/splash-screen")
    } catch (error) {
      console.error("[v0] Logout failed:", error)
      router.push("/splash-screen")
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: "user", content: inputMessage }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [userMessage],
          context:
            "User is seeking gut health advice and support. Provide plain text responses without markdown formatting.",
        }),
      })

      const data = await response.json()
      // Remove markdown formatting from response
      const cleanMessage = data.message.replace(/\*\*/g, "").replace(/##/g, "").replace(/\*/g, "")
      const aiMessage = { role: "assistant", content: cleanMessage }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const startCamera = async () => {
    try {
      console.log("[v0] Starting camera for Food Scan...")

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported in this browser")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert(`Camera access failed: ${error.message}`)
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !cameraStream) return

    try {
      const canvas = document.createElement("canvas")
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas context not available")

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to blob for upload
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            setCapturedImageFile(URL.createObjectURL(blob))
            await analyzeFoodWithGemini(blob)
          }
        },
        "image/jpeg",
        0.8,
      )

      // Stop camera
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    } catch (error) {
      console.error("Photo capture error:", error)
      alert(`Failed to capture photo: ${error.message}`)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) {
      alert("File too large. Please select an image under 20MB.")
      return
    }

    setCapturedImageFile(URL.createObjectURL(file))
    await analyzeFoodWithGemini(file)
  }

  const analyzeFoodWithGemini = async (imageFile: Blob) => {
    setIsAnalyzing(true)
    setDetectedFoods([])
    setGutScore(null)

    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      const response = await fetch("https://john09lim.app.n8n.cloud/webhook-test/GUT%20GUARD%20AI", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const data = await response.json()

      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        const output = data[0].output

        if (output.status === "success" && output.food) {
          // Convert food items to the expected format
          const foods = output.food.map((item: any) => ({
            name: item.name,
            confidence: 0.9, // Default confidence since not provided in new format
            quantity: item.quantity,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          }))

          setDetectedFoods(foods)

          // Calculate gut score using the detected foods
          await calculateGutScore(foods)
        } else {
          throw new Error("Invalid response format or failed analysis")
        }
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.error("[v0] Food analysis error:", error)
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFoodItemOld = (index: number) => {
    const newFoods = detectedFoods.filter((_, i) => i !== index)
    setDetectedFoods(newFoods)
    recomputeScore(newFoods)
  }

  const addFoodItemOld = (foodName: string) => {
    if (!foodName.trim()) return

    const newFood = { name: foodName.trim(), confidence: 1.0 }
    const newFoods = [...detectedFoods, newFood]
    setDetectedFoods(newFoods)
    recomputeScore(newFoods)
  }

  const recomputeScore = async (foods: Array<{ name: string; confidence: number }>) => {
    try {
      const response = await fetch("/api/food-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foods }),
      })

      if (response.ok) {
        const data = await response.json()
        setGutScore(data.score)
        setScoreReasons(data.reasons)
        setScoreAdvice(data.advice)
      }
    } catch (error) {
      console.error("Score recomputation error:", error)
    }
  }

  const saveToGutJournalOld = async () => {
    if (!capturedImageFile || gutScore === null) return

    try {
      const response = await fetch("/api/save-food-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: capturedImageFile,
          foods: detectedFoods,
          gutScore,
          reasons: scoreReasons,
          advice: scoreAdvice,
        }),
      })

      if (response.ok) {
        alert("Saved to Gut Journal!")
        resetScan()
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save. Please try again.")
    }
  }

  const resetScanOld = () => {
    setCapturedImageFile(null)
    setDetectedFoods([])
    setGutScore(null)
    setScoreReasons([])
    setScoreAdvice("")
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const addFoodEntry = () => {
    if (newFood.trim()) {
      setFoodEntries((prev) => [...prev, { food: newFood.trim(), tag: foodTag }])
      setNewFood("")
    }
  }

  const removeFoodEntry = (index: number) => {
    setFoodEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Generate daily summary and save
      generateDailySummary()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const generateDailySummary = () => {
    const today = selectedDate
    const summary = {
      date: today,
      stoolType,
      stoolNotes,
      symptoms,
      foodEntries,
      hydration,
      sleep,
      stress,
      exercise,
      dailyNotes,
      overallStatus: calculateOverallStatus(),
      recommendations: generateRecommendations(),
      keyMetrics: {
        digestiveHealth: calculateDigestiveHealth(),
        colonHealth: calculateColonHealth(),
        riskLevel: calculateRiskLevel(),
      },
    }

    setDailySummaries((prev) => ({ ...prev, [today]: summary }))
    setCurrentStep(0) // Reset for next day
    alert("Daily summary saved successfully!")
  }

  const calculateOverallStatus = () => {
    const stoolScore = stoolType === 3 || stoolType === 4 ? 3 : stoolType === 2 || stoolType === 5 ? 2 : 1
    const symptomScore = Object.values(symptoms).reduce((a, b) => a + b, 0) < 10 ? 3 : 2
    const lifestyleScore = hydration >= 8 && sleep >= 7 && stress <= 5 ? 3 : 2

    const total = stoolScore + symptomScore + lifestyleScore
    return total >= 8 ? "Excellent" : total >= 6 ? "Good" : "Needs Attention"
  }

  const calculateDigestiveHealth = () => {
    const symptomTotal = Object.values(symptoms).reduce((a, b) => a + b, 0)
    return symptomTotal <= 5 ? "Excellent" : symptomTotal <= 15 ? "Good" : "Needs Attention"
  }

  const calculateColonHealth = () => {
    if (!stoolType) return "No Data"
    return stoolType === 3 || stoolType === 4
      ? "Excellent"
      : stoolType === 2 || stoolType === 5
        ? "Good"
        : "Needs Attention"
  }

  const calculateRiskLevel = () => {
    const highRiskSymptoms = symptoms.pain + symptoms.bloating
    return highRiskSymptoms <= 3 ? "Low" : highRiskSymptoms <= 6 ? "Moderate" : "High"
  }

  const generateRecommendations = () => {
    const recs = []
    if (hydration < 8) recs.push("Increase water intake to at least 8 glasses daily")
    if (sleep < 7) recs.push("Aim for 7-9 hours of quality sleep")
    if (stress > 6) recs.push("Practice stress management techniques like meditation")
    if (stoolType && (stoolType <= 2 || stoolType >= 6))
      recs.push("Consider increasing fiber intake and staying hydrated")
    if (Object.values(symptoms).some((s) => s > 5))
      recs.push("Monitor symptoms closely and consider consulting a healthcare provider")
    return recs.length > 0 ? recs : ["Keep up the great work with your gut health routine!"]
  }

  const calculateGutScore = async (foods: Array<{ name: string; confidence: number }>) => {
    try {
      const response = await fetch("/api/food-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foods }),
      })

      if (response.ok) {
        const data = await response.json()
        setGutScore(data.score)
        setScoreReasons(data.reasons)
        setScoreAdvice(data.advice)
      }
    } catch (error) {
      console.error("Score recomputation error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const renderDashboard = () => {
    const todaysSummary = dailySummaries[selectedDate]

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--theme-text)" }}>
              Wellness Hub
            </h1>
            <p style={{ color: "var(--theme-text-secondary)" }}>Your daily gut health companion</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            style={{ color: "var(--theme-text)", borderColor: "var(--theme-border)" }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Today's Health Status */}
        <Card className="mb-6" style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "var(--theme-text)" }}>
              <Heart className="h-5 w-5 text-green-600" />
              Today's Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Colon Health</p>
                  <p className="text-lg font-semibold text-green-700">
                    {todaysSummary?.keyMetrics?.colonHealth || "No Data"}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Digestive Health</p>
                  <p className="text-lg font-semibold text-blue-700">
                    {todaysSummary?.keyMetrics?.digestiveHealth || "No Data"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Tips */}
        <Card className="mb-6" style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>Daily Wellness Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: "hydration",
                  title: "Stay Hydrated",
                  preview: "Drink 8-10 glasses of water daily for optimal digestion",
                  content:
                    "Proper hydration helps maintain healthy bowel movements, supports nutrient absorption, and keeps your digestive system functioning smoothly. Start your day with a glass of warm water and lemon.",
                },
                {
                  id: "fiber",
                  title: "Increase Fiber Intake",
                  preview: "Aim for 25-35g of fiber daily from whole foods",
                  content:
                    "Fiber feeds beneficial gut bacteria and promotes regular bowel movements. Include fruits, vegetables, whole grains, and legumes in your meals. Increase gradually to avoid bloating.",
                },
                {
                  id: "probiotics",
                  title: "Include Probiotics",
                  preview: "Support your gut microbiome with beneficial bacteria",
                  content:
                    "Yogurt, kefir, sauerkraut, kimchi, and other fermented foods contain live probiotics that support digestive health and immune function.",
                },
                {
                  id: "stress",
                  title: "Manage Stress",
                  preview: "Practice relaxation techniques for better gut health",
                  content:
                    "Chronic stress can disrupt digestion and gut bacteria balance. Try meditation, deep breathing, yoga, or regular exercise to manage stress levels effectively.",
                },
              ].map((tip) => (
                <div key={tip.id} className="border rounded-lg p-4">
                  <button
                    onClick={() => setExpandedTips(expandedTips === tip.id ? null : tip.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <h4 className="font-semibold text-green-700">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.preview}</p>
                    </div>
                    {expandedTips === tip.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedTips === tip.id && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-gray-700">{tip.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Foods to Eat & Avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--theme-success)" }}>Foods to Eat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "🥬 Leafy greens (spinach, kale)",
                  "🫐 Berries (blueberries, raspberries)",
                  "🥑 Avocados",
                  "🐟 Fatty fish (salmon, mackerel)",
                  "🥜 Nuts and seeds",
                  "🍠 Sweet potatoes",
                  "🫘 Legumes (beans, lentils)",
                  "🧄 Garlic and onions",
                  "🫚 Ginger and turmeric",
                  "🥛 Probiotic yogurt",
                ].map((food, index) => (
                  <div key={index} className="flex items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">{food}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--theme-danger)" }}>Foods to Avoid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "🍟 Processed foods",
                  "🥤 Sugary drinks",
                  "🍖 Red meat (limit intake)",
                  "🧀 High-fat dairy",
                  "🍞 Refined grains",
                  "🍺 Excessive alcohol",
                  "☕ Too much caffeine",
                  "🌶️ Spicy foods (if sensitive)",
                  "🧂 High sodium foods",
                  "🍭 Artificial sweeteners",
                ].map((food, index) => (
                  <div key={index} className="flex items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">{food}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Risk Assessment */}
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>Today's Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Risk Level</p>
                <p className="text-xl font-bold text-green-600">{todaysSummary?.keyMetrics?.riskLevel || "Low"}</p>
                <p className="text-sm text-gray-500">Based on your recent logs</p>
              </div>
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderScanFood = () => (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--theme-text)" }}>
        Scan Food
      </h2>

      {scanState === "idle" && (
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <Camera className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--theme-primary)" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--theme-text)" }}>
                Capture Your Meal
              </h3>
              <p className="mb-6 text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                Take a photo or upload an image to get your personalized Gut Guard Score
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div
                  className="w-full py-3 px-4 rounded-lg border-2 border-dashed cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    borderColor: "var(--theme-primary)",
                    color: "white",
                  }}
                >
                  <Camera className="h-5 w-5 inline mr-2" />
                  Take Photo
                </div>
              </label>

              <label className="block">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div
                  className="w-full py-3 px-4 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)",
                    backgroundColor: "transparent",
                  }}
                >
                  <Upload className="h-5 w-5 inline mr-2" />
                  Upload Photo
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {scanState === "loading" && (
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardContent className="p-8 text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: "var(--theme-primary)" }}
            />
            <p style={{ color: "var(--theme-text-secondary)" }}>Analyzing your food...</p>
          </CardContent>
        </Card>
      )}

      {scanState === "error" && (
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Analysis Failed</p>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--theme-text-secondary)" }}>
              {scanError}
            </p>
            <Button
              onClick={resetScan}
              style={{
                backgroundColor: "var(--theme-primary)",
                color: "white",
                border: "none",
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {scanState === "results" && (
        <div className="space-y-4">
          {capturedImageFile && (
            <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
              <CardContent className="p-4">
                <img
                  src={capturedImageFile || "/placeholder.svg"}
                  alt="Scanned food"
                  className="w-full rounded-lg max-h-48 object-cover"
                />
              </CardContent>
            </Card>
          )}

          <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--theme-text)" }}>
                Detected Items
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {detectedFoods.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "#e8f5e8",
                      color: "#2d5a2d",
                      border: "1px solid #c3e6c3",
                    }}
                  >
                    <span>{food.name}</span>
                    <button onClick={() => removeFoodItem(index)} className="text-red-500 hover:text-red-700 ml-1">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add food item..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addFoodItem(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)",
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add food item..."]') as HTMLInputElement
                    if (input) {
                      addFoodItem(input.value)
                      input.value = ""
                    }
                  }}
                  variant="outline"
                  style={{
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)",
                  }}
                >
                  +
                </Button>
              </div>

              {scanTotals && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#f8f9fa" }}>
                  <h4 className="font-semibold mb-2" style={{ color: "var(--theme-text)" }}>
                    Totals
                  </h4>
                  <div className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                    {JSON.stringify(scanTotals, null, 2)}
                  </div>
                </div>
              )}

              <Button
                onClick={analyzeForMyGut}
                className="w-full"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "white",
                  border: "none",
                }}
              >
                Analyze for My Gut
              </Button>
            </CardContent>
          </Card>

          {gutScore !== null && (
            <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--theme-text)" }}>
                  Gut Guard Score
                </h3>

                <div className="text-center mb-6">
                  <div
                    className="text-5xl font-bold mb-2"
                    style={{
                      color: gutScore >= 80 ? "#10b981" : gutScore >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  >
                    {gutScore}
                  </div>
                  <div
                    className="text-sm px-4 py-2 rounded-full inline-block font-medium"
                    style={{
                      backgroundColor: gutScore >= 80 ? "#dcfce7" : gutScore >= 50 ? "#fef3c7" : "#fee2e2",
                      color: gutScore >= 80 ? "#166534" : gutScore >= 50 ? "#92400e" : "#991b1b",
                    }}
                  >
                    {gutScore >= 80 ? "Gut Friendly" : gutScore >= 50 ? "Moderate Risk" : "High Risk"}
                  </div>
                </div>

                {scoreReasons.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2" style={{ color: "var(--theme-text)" }}>
                      Reasons:
                    </h4>
                    <ul className="space-y-1">
                      {scoreReasons.map((reason, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span style={{ color: "var(--theme-text-secondary)" }}>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scoreAdvice && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2" style={{ color: "var(--theme-text)" }}>
                      Advice:
                    </h4>
                    <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                      {scoreAdvice}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={saveToGutJournal}
                    className="flex-1"
                    style={{
                      backgroundColor: "var(--theme-primary)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Save to Gut Journal
                  </Button>
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    className="flex-1 bg-transparent"
                    style={{
                      borderColor: "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                  >
                    Scan Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )

  const renderLogs = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
          Health Log
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowTrends(!showTrends)} variant="outline" className="bg-transparent">
            {showTrends ? "Daily Log" : "View Trends"}
          </Button>
        </div>
      </div>

      {showTrends ? (
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>Weekly Trends & Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dailySummaries).map(([date, summary]) => (
                <div key={date} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{new Date(date).toLocaleDateString()}</h4>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        summary.overallStatus === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : summary.overallStatus === "Good"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {summary.overallStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div>Colon: {summary.keyMetrics.colonHealth}</div>
                    <div>Digestive: {summary.keyMetrics.digestiveHealth}</div>
                    <div>Risk: {summary.keyMetrics.riskLevel}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Recommendations:</strong>
                    </p>
                    <ul className="list-disc list-inside">
                      {summary.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              {Object.keys(dailySummaries).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No data available. Complete your daily log to see trends.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader className="border rounded px-2 py-1" style={{ color: "var(--theme-text)" }}>
            <CardTitle style={{ color: "var(--theme-text)" }}>Daily Health Tracking</CardTitle>
            <div className="flex items-center gap-2" style={{ color: "var(--theme-text-secondary)" }}>
              <Calendar className="h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
                style={{ color: "var(--theme-text)" }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
                  Step {currentStep + 1} of 5
                </span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full ${step <= currentStep ? "bg-green-600" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {currentStep === 0 && (
              <div>
                <h3 className="font-semibold mb-4" style={{ color: "var(--theme-text)" }}>
                  Stool Tracking (Bristol Scale)
                </h3>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {[
                    { type: 1, desc: "Separate hard lumps", icon: "🔴" },
                    { type: 2, desc: "Lumpy and sausage-like", icon: "🟠" },
                    { type: 3, desc: "Sausage with cracks", icon: "🟡" },
                    { type: 4, desc: "Smooth, soft sausage", icon: "🟢" },
                    { type: 5, desc: "Soft blobs with clear-cut edges", icon: "🔵" },
                    { type: 6, desc: "Mushy with ragged edges", icon: "🟣" },
                    { type: 7, desc: "Liquid consistency", icon: "🔴" },
                  ].map(({ type, desc, icon }) => (
                    <button
                      key={type}
                      onClick={() => setStoolType(type)}
                      className={`p-3 rounded-lg border text-left flex items-center gap-3 ${
                        stoolType === type ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="font-medium" style={{ color: "var(--theme-text)" }}>
                          Type {type}
                        </div>
                        <div className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                          {desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Textarea
                  value={stoolNotes}
                  onChange={(e) => setStoolNotes(e.target.value)}
                  placeholder="Additional notes about your bowel movement..."
                  rows={2}
                  className="mb-4"
                />
                <Button onClick={nextStep} disabled={!stoolType} className="w-full bg-green-600 hover:bg-green-700">
                  Next: Symptoms
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="font-semibold mb-4">Symptom Severity (0-10 scale)</h3>
                <div className="space-y-4 mb-6">
                  {Object.entries(symptoms).map(([symptom, value]) => (
                    <div key={symptom}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {symptom}: {value}/10
                      </label>
                      <Slider
                        value={[value]}
                        onValueChange={(val) => setSymptoms((prev) => ({ ...prev, [symptom]: val[0] }))}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                    Next: Food
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="font-semibold mb-4">Food & Drink Journal</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    placeholder="Add food or drink..."
                    onKeyPress={(e) => e.key === "Enter" && addFoodEntry()}
                    className="flex-1"
                  />
                  <select
                    value={foodTag}
                    onChange={(e) => setFoodTag(e.target.value as "safe" | "trigger" | "unsure")}
                    className="border rounded px-2 py-1"
                  >
                    <option value="safe">Safe</option>
                    <option value="trigger">Trigger</option>
                    <option value="unsure">Unsure</option>
                  </select>
                  <Button onClick={addFoodEntry}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mb-6">
                  {foodEntries.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <span>{entry.food}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            entry.tag === "safe"
                              ? "bg-green-100 text-green-800"
                              : entry.tag === "trigger"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {entry.tag}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeFoodEntry(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                    Next: Lifestyle
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="font-semibold mb-4">Lifestyle Factors</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Water Intake (glasses): {hydration}</label>
                    <Slider value={[hydration]} onValueChange={(val) => setHydration(val[0])} max={15} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sleep Hours: {sleep}</label>
                    <Slider value={[sleep]} onValueChange={(val) => setSleep(val[0])} max={12} step={0.5} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stress Level (1-10): {stress}</label>
                    <Slider value={[stress]} onValueChange={(val) => setStress(val[0])} min={1} max={10} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Exercise (minutes): {exercise}</label>
                    <Slider value={[exercise]} onValueChange={(val) => setExercise(val[0])} max={120} step={5} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                    Next: Notes
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="font-semibold mb-4">Daily Notes & Photos</h3>
                <Textarea
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  placeholder="How are you feeling today? Any observations about your gut health?"
                  rows={4}
                  className="mb-4"
                />
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Add Photo (optional)</label>
                  <input type="file" accept="image/*" className="w-full border rounded p-2" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                    Complete & Save
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderAICoach = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full">
          <Shield className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
            Gut Guardian AI
          </h2>
          <p className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
            Your personal digestive health advisor
          </p>
        </div>
      </div>

      <Card
        className="flex-1 flex flex-col mb-20"
        style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}
      >
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-medium" style={{ color: "var(--theme-text)" }}>
                  Welcome to Gut Guardian AI
                </p>
                <p className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                  Ask me anything about digestive health, nutrition, or wellness!
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex-shrink-0">
                      <Shield className="h-4 w-4" style={{ color: "var(--theme-text)" }} />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-green-600 rounded-br-sm" : "bg-gray-600 rounded-bl-sm"
                    } text-white p-2 max-w-xs`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full">
                    <Shield className="h-4 w-4" style={{ color: "var(--theme-text)" }} />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-16 left-4 right-4 max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about gut health, nutrition, symptoms..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isTyping}
              className="flex-1 border-gray-300 focus:border-green-500"
            />
            <Button
              onClick={sendMessage}
              disabled={isTyping || !inputMessage.trim()}
              className="bg-green-600 hover:bg-green-700 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--theme-text)" }}>
        Settings
      </h2>

      <div className="space-y-4">
        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>Profile & Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--theme-textSecondary)" }}>
                  Name
                </label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    backgroundColor: "var(--theme-background)",
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--theme-textSecondary)" }}>
                  Email
                </label>
                <Input
                  value={user?.email || ""}
                  disabled
                  style={{
                    backgroundColor: "var(--theme-background)",
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-textSecondary)",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>
              <Palette className="h-5 w-5 inline mr-2" />
              Theme Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    currentTheme === key ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: theme.background,
                    borderColor: currentTheme === key ? theme.primary : theme.border,
                    ringColor: theme.primary,
                  }}
                  onClick={() => setCurrentTheme(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium" style={{ color: theme.text }}>
                        {theme.name}
                      </h4>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.primary }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.primaryDark }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.accent }} />
                      </div>
                    </div>
                    {currentTheme === key && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--theme-text)" }}>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--theme-text)" }}>Daily Log Reminders</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--theme-text)" }}>Health Tips</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--theme-text)" }}>Weekly Reports</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <CardContent className="pt-6">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--theme-background)" }}>
      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-20">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "scan" && renderScanFood()}
        {activeTab === "logs" && renderLogs()}
        {activeTab === "coach" && renderAICoach()}
        {activeTab === "settings" && renderSettings()}
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          backgroundColor: "var(--theme-surface)",
          borderColor: "var(--theme-border)",
        }}
      >
        <div className="flex justify-around py-2">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "scan", icon: Camera, label: "Scan Food" },
            { id: "logs", icon: FileText, label: "Logs" },
            { id: "coach", icon: MessageCircle, label: "AI Coach" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "opacity-100" : "opacity-60"
              }`}
              style={{
                color:
                  activeTab === tab.id
                    ? currentTheme === "dark"
                      ? "var(--theme-primary)"
                      : "#1f2937" // Dark gray for active tab
                    : currentTheme === "dark"
                      ? "var(--theme-textSecondary)"
                      : "#374151", // Darker gray for inactive tab
              }}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
