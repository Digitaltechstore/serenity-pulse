"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Calendar } from "lucide-react"

export default function OnboardingFlow() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardTab, setDashboardTab] = useState("dashboard")
  const [showDevControls, setShowDevControls] = useState(false)

  const [formData, setFormData] = useState({
    agreement: false,
    age: "",
    gender: "",
    height: "",
    weight: "",
    familyHistory: [] as string[],
    diagnosisAge: "",
    redFlagSymptoms: [] as string[],
    redFlagSymptoms2: [] as string[],
    dailySymptoms: [] as string[],
    painLevel: [0],
    notes: "",
    stoolType: "",
    pencilThin: false,
    mucus: false,
    visibleBlood: false,
    priorDiagnoses: [] as string[],
    lastColonoscopyDate: "",
    medications: [] as string[],
    triggers: [] as string[],
    exercise: "",
    activityLevel: "",
    sleepHours: "",
    stressLevel: [5],
  })

  const calculateBMI = () => {
    const heightM = Number.parseFloat(formData.height) / 100
    const weightKg = Number.parseFloat(formData.weight)
    if (heightM && weightKg) {
      return (weightKg / (heightM * heightM)).toFixed(1)
    }
    return ""
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return { category: "Underweight", color: "text-blue-400" }
    if (bmiValue >= 18.5 && bmiValue < 25) return { category: "Normal", color: "text-green-400" }
    if (bmiValue >= 25 && bmiValue < 30) return { category: "Overweight", color: "text-yellow-400" }
    return { category: "Obese", color: "text-red-400" }
  }

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const startDashboard = () => setShowDashboard(true)
  const switchTab = (tab: string) => setDashboardTab(tab)

  const resetToSplash = () => {
    setShowSplash(true)
    setShowDashboard(false)
    setCurrentStep(0)
  }

  const goToOnboarding = () => {
    setShowSplash(false)
    setShowDashboard(false)
    setCurrentStep(0)
  }

  const goToPaywall = () => {
    setShowSplash(false)
    setShowDashboard(false)
    setCurrentStep(10)
  }

  const goToDashboard = () => {
    setShowSplash(false)
    setShowDashboard(true)
    setDashboardTab("dashboard")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const DevControls = () => {
    if (process.env.NODE_ENV === "production") {
      return null
    }

    return (
      <div className="fixed top-4 right-4 z-50">
        {!showDevControls ? (
          <button
            onClick={() => setShowDevControls(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
          >
            Dev
          </button>
        ) : (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl min-w-48">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium text-sm">Navigation Test</h3>
              <button onClick={() => setShowDevControls(false)} className="text-gray-400 hover:text-white text-lg">
                ×
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={resetToSplash}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
              >
                Splash Screen
              </button>
              <button
                onClick={goToOnboarding}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
              >
                Onboarding Flow
              </button>
              <button
                onClick={goToPaywall}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm"
              >
                Paywall
              </button>
              <button
                onClick={goToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <DevControls />
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
              alt="GutGuard Shield Logo"
              className="w-full h-full animate-pulse object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">GutGuard</h1>
          <p className="text-gray-400 text-lg">Your Digestive Health Companion</p>
        </div>
      </div>
    )
  }

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DevControls />
        <div className="pb-20">
          {dashboardTab === "dashboard" && <DashboardScreen />}
          {dashboardTab === "scan" && <ScanScreen />}
          {dashboardTab === "log" && <LogScreen />}
          {dashboardTab === "advice" && <AdviceScreen />}
          {dashboardTab === "settings" && <SettingsScreen />}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-around py-2">
            {[
              { id: "dashboard", icon: "🏠", label: "Dashboard" },
              { id: "scan", icon: "📷", label: "Scan" },
              { id: "log", icon: "📋", label: "Log" },
              { id: "advice", icon: "💡", label: "Advice" },
              { id: "settings", icon: "⚙️", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 text-xs ${
                  dashboardTab === tab.id ? "text-green-400" : "text-gray-400"
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <DevControls />
      <div className="max-w-sm mx-auto flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
              alt="GutGuard Shield Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-balance">Welcome to GutGuard</h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your AI-powered health companion. GutGuard is an educational companion, not a medical device. If you
              report red flags, we'll show urgent-care guidance and limit non-urgent advice.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => updateFormData("agreement", !formData.agreement)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.agreement
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    formData.agreement ? "border-green-500 bg-green-500" : "border-gray-500"
                  }`}
                >
                  {formData.agreement && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-left">I understand and agree to the terms and conditions</span>
              </div>
            </button>
          </div>

          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${dot === 1 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>

          {formData.agreement && (
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl animate-in slide-in-from-bottom-4 duration-300"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardScreen() {
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "symptom-check":
        alert("Quick Symptom Check feature coming soon!")
        break
      case "stool-log":
        alert("Stool Log feature coming soon!")
        break
      case "food-scan":
        alert("Food Scan feature coming soon!")
        break
      case "daily-goals":
        alert("Daily Goals feature coming soon!")
        break
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">GutGuard</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <span className="text-lg">⚙️</span>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Risk</h2>
          <div className="space-y-3">
            <div className="bg-red-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Colon</h3>
                <p className="text-gray-700 font-semibold">Low</p>
                <button className="text-gray-600 text-xs underline hover:text-gray-800">Why?</button>
              </div>
              <div className="w-16 h-16 bg-red-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🫁</span>
              </div>
            </div>

            <div className="bg-teal-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Stomach</h3>
                <p className="text-gray-700 font-semibold">Medium</p>
                <button className="text-gray-600 text-xs underline hover:text-gray-800">Why?</button>
              </div>
              <div className="w-16 h-16 bg-teal-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🫃</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Quick Symptom Check", subtitle: "Start", action: "symptom-check", bg: "bg-orange-100" },
              {
                title: "Stool Log",
                subtitle: "Bristol • pencil-thin toggle",
                action: "stool-log",
                bg: "bg-yellow-100",
              },
              { title: "Food Scan", subtitle: "Open Camera / Upload", action: "food-scan", bg: "bg-blue-100" },
              {
                title: "Daily Goals",
                subtitle: "Hydration ring, fiber goal, steps",
                action: "daily-goals",
                bg: "bg-green-100",
              },
            ].map((action, index) => (
              <button
                key={index}
                className={`${action.bg} p-4 rounded-xl flex flex-col justify-between h-24 hover:opacity-80 transition-opacity`}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="text-left">
                  <h3 className="text-gray-900 font-medium text-sm">{action.title}</h3>
                  <p className="text-gray-600 text-xs mt-1">{action.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScanScreen() {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    food: string
    confidence: number
    suitable: boolean
    reason: string
  } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser")
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        throw new Error("No camera devices found")
      }

      let stream: MediaStream | null = null

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
      } catch (envError) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })
        } catch (userError) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })
        }
      }

      if (stream) {
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }
    } catch (error: any) {
      let errorMessage = "Camera access failed. "

      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera device found."
      } else if (error.name === "NotAllowedError") {
        errorMessage += "Camera permission denied."
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera is already in use."
      } else {
        errorMessage += error.message || "Unknown camera error."
      }

      alert(errorMessage)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        analyzeFood(imageData)
      }
    }
  }

  const analyzeFood = async (imageData: string) => {
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = [
      { food: "Gluten-Free Bread", confidence: 95, suitable: true, reason: "Low FODMAP and gluten-free" },
      { food: "Spicy Curry", confidence: 88, suitable: false, reason: "High spice content may trigger symptoms" },
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    setScanResult(randomResult)
    setIsScanning(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
        analyzeFood(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [cameraStream])

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Scan</h1>
      </div>

      <div className="mb-8">
        {!cameraStream && !capturedImage && (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 mb-4">Point your camera at food to analyze</p>
            <div className="space-y-3">
              <Button onClick={startCamera} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Open Camera
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {cameraStream && !capturedImage && (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-xl object-cover" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-4">
                <Button
                  onClick={stopCamera}
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700"
                >
                  ✕
                </Button>
                <Button onClick={capturePhoto} size="lg" className="w-16 h-16 rounded-full bg-white hover:bg-gray-100">
                  <Camera className="h-8 w-8 text-black" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="relative">
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured food"
              className="w-full h-64 bg-black rounded-xl object-cover"
            />
            <Button
              onClick={() => {
                setCapturedImage(null)
                setScanResult(null)
                startCamera()
              }}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white"
              size="sm"
            >
              Retake
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {isScanning && (
        <div className="bg-gray-800 rounded-xl p-6 text-center mb-6">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing food...</p>
        </div>
      )}

      {scanResult && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Food Result</h2>
            <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-medium">{scanResult.food}</h3>
                <p className="text-sm text-gray-400">Confidence: {scanResult.confidence}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`bg-gray-800 rounded-xl p-4 ${scanResult.suitable ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${scanResult.suitable ? "text-green-400" : "text-red-400"}`}>
                  {scanResult.suitable ? "Great choice!" : "Caution advised"}
                </span>
                <span className={scanResult.suitable ? "text-green-400" : "text-red-400"}>
                  {scanResult.suitable ? "✓" : "⚠"}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">{scanResult.reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LogScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Log</h1>
        <div className="ml-auto">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Daily Health Log</h2>
          <p className="text-gray-400">Track your symptoms, stool patterns, and wellness metrics here.</p>
        </div>
      </div>
    </div>
  )
}

function AdviceScreen() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm here to help you understand your gut health better. What can I assist you with today?",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: "user", content: inputMessage }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">AI Coach</h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user" ? "bg-green-500 text-white" : "bg-gray-800 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your gut health..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
        />
        <Button onClick={sendMessage} disabled={isLoading} className="bg-green-500 hover:bg-green-600">
          Send
        </Button>
      </div>
    </div>
  )
}

function SettingsScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Profile & Health</h2>
          <p className="text-gray-400">Edit your profile and health information</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Language</span>
              <span className="text-gray-400">EN</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Notifications</span>
              <span className="text-gray-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Theme</span>
              <span className="text-gray-400">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
