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
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

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

  // Log states for health tracking
  const [currentStep, setCurrentStep] = useState(0)
  const [stoolType, setStoolType] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState({
    bloating: 0,
    pain: 0,
    gas: 0,
    nausea: 0,
    fatigue: 0,
  })
  const [foodEntries, setFoodEntries] = useState<string[]>([])
  const [newFood, setNewFood] = useState("")
  const [hydration, setHydration] = useState(8)
  const [sleep, setSleep] = useState(8)
  const [stress, setStress] = useState(3)
  const [dailyNotes, setDailyNotes] = useState("")

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
          context: "User is seeking gut health advice and support",
        }),
      })

      const data = await response.json()
      const aiMessage = { role: "assistant", content: data.message }
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
      setFoodEntries((prev) => [...prev, newFood.trim()])
      setNewFood("")
    }
  }

  const removeFoodEntry = (index: number) => {
    setFoodEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">GutGuard Dashboard</h1>
          <p className="text-gray-600">Hello, {user?.user_metadata?.name || user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-gray-600">Based on recent logs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symptoms Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-600">No symptoms logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Improving</div>
            <p className="text-xs text-gray-600">+12% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity</p>
            <p className="text-sm">Use the buttons below to start tracking your gut health</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Log</h2>

      <Card>
        <CardHeader>
          <CardTitle>Daily Health Tracking - Step {currentStep + 1} of 5</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div>
              <h3 className="font-semibold mb-4">Stool Type (Bristol Scale)</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((type) => (
                  <button
                    key={type}
                    onClick={() => setStoolType(type)}
                    className={`p-3 rounded-lg border text-left ${
                      stoolType === type ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium">Type {type}</div>
                    <div className="text-sm text-gray-600">{type <= 2 ? "Hard" : type <= 4 ? "Normal" : "Loose"}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="font-semibold mb-4">Symptoms Severity (0-10)</h3>
              <div className="space-y-4">
                {Object.entries(symptoms).map(([symptom, value]) => (
                  <div key={symptom}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {symptom}: {value}
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
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="font-semibold mb-4">Food & Drinks</h3>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  placeholder="Add food or drink..."
                  onKeyPress={(e) => e.key === "Enter" && addFoodEntry()}
                />
                <Button onClick={addFoodEntry}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {foodEntries.map((food, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{food}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeFoodEntry(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="font-semibold mb-4">Lifestyle Factors</h3>
              <div className="space-y-4">
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
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h3 className="font-semibold mb-4">Daily Notes</h3>
              <Textarea
                value={dailyNotes}
                onChange={(e) => setDailyNotes(e.target.value)}
                placeholder="How are you feeling today? Any observations about your gut health?"
                rows={4}
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
              Previous
            </Button>
            <Button onClick={nextStep} disabled={currentStep === 4}>
              {currentStep === 4 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAICoach = () => (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">GutGuard AI Coach</h2>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Chat with Your AI Health Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Ask me anything about gut health!</p>
                <p className="text-sm">I'm here to help with digestive wellness advice.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
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
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about gut health..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={isTyping || !inputMessage.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile & Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input value={user?.user_metadata?.name || ""} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Daily Log Reminders</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Health Tips</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Weekly Reports</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-20">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "scan" && renderScanFood()}
        {activeTab === "logs" && renderLogs()}
        {activeTab === "coach" && renderAICoach()}
        {activeTab === "settings" && renderSettings()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === "dashboard" ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === "scan" ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <Camera className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Scan Food</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === "logs" ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <FileText className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Logs</span>
          </button>

          <button
            onClick={() => setActiveTab("coach")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === "coach" ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <MessageCircle className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">AI Coach</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === "settings" ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <Settings className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
