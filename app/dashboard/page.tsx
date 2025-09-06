"use client"

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
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  const [profileName, setProfileName] = useState("")

  const [expandedTips, setExpandedTips] = useState<string | null>(null)

  const [currentTheme, setCurrentTheme] = useState("normal")

  // Theme definitions with exact gut health-inspired color palettes using HSL values
  const themes = {
    light: {
      name: "Soothing Sage",
      colors: {
        primary: "hsl(142, 45%, 65%)", // Sage Green
        secondary: "hsl(85, 35%, 75%)", // Soft Lime
        accent: "hsl(155, 28%, 65%)", // Health Green
        background: "hsl(120, 15%, 92%)", // Pale Sage
        surface: "hsl(120, 20%, 95%)", // Lighter Sage
        text: "hsl(15, 60%, 25%)", // Dark Earthy Brown
        textSecondary: "hsl(15, 60%, 35%)", // Medium Earthy Brown
        border: "hsl(120, 25%, 85%)", // Sage Border
        danger: "hsl(15, 60%, 45%)", // Earthy Brown
        success: "hsl(155, 28%, 65%)", // Healthy Sage
        warning: "hsl(45, 85%, 65%)", // Gentle Yellow
      },
    },
    dark: {
      name: "Dark Mode",
      colors: {
        primary: "hsl(280, 45%, 70%)", // Bright Lavender
        secondary: "hsl(160, 40%, 65%)", // Soft Green
        accent: "hsl(280, 40%, 60%)", // Medium Lavender
        background: "hsl(280, 35%, 12%)", // Deep Purple
        surface: "hsl(280, 30%, 15%)", // Dark Purple
        text: "hsl(280, 20%, 85%)", // Light Purple Text
        textSecondary: "hsl(280, 15%, 75%)", // Medium Purple Text
        border: "hsl(280, 25%, 25%)", // Purple Border
        danger: "hsl(20, 70%, 55%)", // Warm Orange
        success: "hsl(160, 40%, 65%)", // Soft Green
        warning: "hsl(45, 85%, 65%)", // Bright Yellow
      },
    },
    normal: {
      name: "Berry Gut",
      colors: {
        primary: "hsl(338, 70%, 72%)", // Berry Pink
        secondary: "hsl(155, 28%, 65%)", // Eucalyptus Green
        accent: "hsl(338, 60%, 60%)", // Medium Berry
        background: "hsl(15, 55%, 87%)", // Soft Peach-Beige
        surface: "hsl(15, 55%, 91%)", // Light Peach-Beige
        text: "hsl(345, 60%, 25%)", // Dark Berry
        textSecondary: "hsl(345, 60%, 35%)", // Medium Berry
        border: "hsl(15, 45%, 80%)", // Peach Border
        danger: "hsl(345, 60%, 38%)", // Deep Berry
        success: "hsl(155, 28%, 65%)", // Eucalyptus Green
        warning: "hsl(45, 85%, 58%)", // Warm Yellow
      },
    },
  }

  // Apply theme styles
  const applyTheme = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes]
    if (theme) {
      const root = document.documentElement
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value)
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

  // Camera states for Scan Food
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setProfileName(user?.user_metadata?.name || "")
      setLoading(false)
    }

    checkUser()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/splash-screen")
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert("Camera access denied or not available")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageData)

      // Stop camera
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)

      // Simulate food analysis
      setTimeout(() => {
        setAnalysisResult("This appears to be a healthy meal with good fiber content. Suitable for gut health!")
      }, 2000)
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
            <h1 className="text-3xl font-bold text-gray-800">Wellness Hub</h1>
            <p className="text-gray-600">Your daily gut health companion</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Today's Health Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Wellness Tips</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Foods to Eat</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Foods to Avoid</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Today's Risk Assessment</CardTitle>
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Scan Food</h2>

      {!cameraStream && !capturedImage && (
        <Card>
          <CardContent className="p-8 text-center">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Scan Your Food</h3>
            <p className="text-gray-600 mb-6">Take a photo of your meal to get gut health recommendations</p>
            <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </CardContent>
        </Card>
      )}

      {cameraStream && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {capturedImage && (
        <Card>
          <CardContent className="p-4">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured food" className="w-full rounded-lg mb-4" />
            {analysisResult ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Analysis Result:</h4>
                <p className="text-green-700">{analysisResult}</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your food...</p>
              </div>
            )}
            <Button
              onClick={() => {
                setCapturedImage(null)
                setAnalysisResult(null)
              }}
              variant="outline"
              className="w-full mt-4"
            >
              Scan Another Food
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderLogs = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Health Log</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowTrends(!showTrends)} variant="outline" className="bg-transparent">
            {showTrends ? "Daily Log" : "View Trends"}
          </Button>
        </div>
      </div>

      {showTrends ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends & Summaries</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Daily Health Tracking</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Step {currentStep + 1} of 5</span>
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
                <h3 className="font-semibold mb-4">Stool Tracking (Bristol Scale)</h3>
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
                        <div className="font-medium">Type {type}</div>
                        <div className="text-sm text-gray-600">{desc}</div>
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
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gut Guardian AI</h2>
          <p className="text-sm text-gray-600">Your personal digestive health advisor</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col mb-20">
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-medium">Welcome to Gut Guardian AI</p>
                <p className="text-sm">Ask me anything about digestive health, nutrition, or wellness!</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex-shrink-0">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-green-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
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
                    <Shield className="h-4 w-4 text-white" />
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
                    backgroundColor: theme.colors.background,
                    borderColor: currentTheme === key ? theme.colors.primary : theme.colors.border,
                    ringColor: theme.colors.primary,
                  }}
                  onClick={() => setCurrentTheme(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium" style={{ color: theme.colors.text }}>
                        {theme.name}
                      </h4>
                      <div className="flex space-x-2 mt-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
                      </div>
                    </div>
                    {currentTheme === key && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
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
                color: activeTab === tab.id ? "var(--theme-primary)" : "var(--theme-textSecondary)",
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
