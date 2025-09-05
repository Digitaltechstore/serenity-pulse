"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera } from "lucide-react"

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
  const [selectedTip, setSelectedTip] = useState<string | null>(null)
  const [savedLogs, setSavedLogs] = useState<Record<string, any>>({})

  const calculateHealthStatus = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayLog = savedLogs[today]

    // Default status if no log data
    let colonHealth = { status: "No Data", color: "gray", icon: "❓" }
    let digestiveHealth = { status: "No Data", color: "gray", icon: "❓" }

    if (todayLog && todayLog.logData) {
      const { stoolType, symptoms, stressLevel } = todayLog.logData

      // Calculate colon health based on stool type
      const stoolTypeNum = Number.parseInt(stoolType) || 0
      if (stoolTypeNum === 3 || stoolTypeNum === 4) {
        colonHealth = { status: "Excellent", color: "green", icon: "✅" }
      } else if (stoolTypeNum === 2 || stoolTypeNum === 5) {
        colonHealth = { status: "Good", color: "yellow", icon: "⚠️" }
      } else if (stoolTypeNum === 1 || stoolTypeNum >= 6) {
        colonHealth = { status: "Needs Attention", color: "red", icon: "🚨" }
      }

      // Calculate digestive health based on symptoms
      const symptomTotal = Object.values(symptoms).reduce((sum: number, val: any) => sum + val, 0)
      const avgSymptoms = symptomTotal / Object.keys(symptoms).length

      if (avgSymptoms <= 2 && stressLevel <= 5) {
        digestiveHealth = { status: "Excellent", color: "green", icon: "✅" }
      } else if (avgSymptoms <= 4 && stressLevel <= 7) {
        digestiveHealth = { status: "Good", color: "yellow", icon: "⚠️" }
      } else {
        digestiveHealth = { status: "Monitor", color: "red", icon: "🚨" }
      }
    }

    return { colonHealth, digestiveHealth }
  }

  const { colonHealth, digestiveHealth } = calculateHealthStatus()

  React.useEffect(() => {
    // In a real app, this would load from database/localStorage
    const storedLogs = localStorage.getItem("gutguard-logs")
    if (storedLogs) {
      setSavedLogs(JSON.parse(storedLogs))
    }
  }, [])

  const wellnessTips = [
    {
      id: "hydration",
      title: "Stay Hydrated",
      description: "Drink 8-10 glasses of water daily to support digestion",
      icon: "💧",
    },
    {
      id: "fiber",
      title: "Increase Fiber Gradually",
      description: "Add 5g of fiber weekly to avoid digestive discomfort",
      icon: "🌾",
    },
    {
      id: "probiotics",
      title: "Include Probiotics",
      description: "Yogurt, kefir, and fermented foods support gut bacteria",
      icon: "🦠",
    },
    {
      id: "mindful",
      title: "Eat Mindfully",
      description: "Chew slowly and avoid eating when stressed",
      icon: "🧘",
    },
  ]

  const foodsToEat = [
    "Leafy greens (spinach, kale)",
    "Fermented foods (yogurt, kimchi)",
    "Whole grains (oats, quinoa)",
    "Lean proteins (fish, chicken)",
    "Bananas and berries",
    "Ginger and turmeric",
  ]

  const foodsToAvoid = [
    "Processed foods",
    "Excessive sugar",
    "Fried and fatty foods",
    "Artificial sweeteners",
    "Excessive caffeine",
    "Spicy foods (if sensitive)",
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Wellness Hub</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <span className="text-lg">⚙️</span>
        </Button>
      </div>

      {/* Today's Health Status - Now Dynamic */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Today's Health Status</h2>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`${colonHealth.color === "green" ? "bg-green-100" : colonHealth.color === "yellow" ? "bg-yellow-100" : colonHealth.color === "red" ? "bg-red-100" : "bg-gray-100"} p-3 rounded-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium text-sm">Colon Health</h3>
                <p
                  className={`${colonHealth.color === "green" ? "text-green-700" : colonHealth.color === "yellow" ? "text-yellow-700" : colonHealth.color === "red" ? "text-red-700" : "text-gray-700"} font-semibold text-xs`}
                >
                  {colonHealth.status}
                </p>
              </div>
              <span className="text-lg">{colonHealth.icon}</span>
            </div>
          </div>
          <div
            className={`${digestiveHealth.color === "green" ? "bg-green-100" : digestiveHealth.color === "yellow" ? "bg-yellow-100" : digestiveHealth.color === "red" ? "bg-red-100" : "bg-gray-100"} p-3 rounded-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium text-sm">Digestive Health</h3>
                <p
                  className={`${digestiveHealth.color === "green" ? "text-green-700" : digestiveHealth.color === "yellow" ? "text-yellow-700" : digestiveHealth.color === "red" ? "text-red-700" : "text-gray-700"} font-semibold text-xs`}
                >
                  {digestiveHealth.status}
                </p>
              </div>
              <span className="text-lg">{digestiveHealth.icon}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Wellness Tips */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Daily Wellness Tips</h2>
        <div className="grid grid-cols-2 gap-2">
          {wellnessTips.map((tip) => (
            <button
              key={tip.id}
              className="bg-blue-100 p-3 rounded-lg text-left hover:bg-blue-200 transition-colors"
              onClick={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{tip.icon}</span>
                <h3 className="text-gray-900 font-medium text-xs">{tip.title}</h3>
              </div>
              {selectedTip === tip.id && <p className="text-gray-700 text-xs mt-1">{tip.description}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Food Guidance */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-green-400">🥗</span>
            Foods to Include
          </h2>
          <div className="space-y-2">
            {foodsToEat.map((food, index) => (
              <div key={index} className="bg-green-100 p-2 rounded-lg">
                <p className="text-gray-900 text-sm flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  {food}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-red-400">🚫</span>
            Foods to Limit
          </h2>
          <div className="space-y-2">
            {foodsToAvoid.map((food, index) => (
              <div key={index} className="bg-red-100 p-2 rounded-lg">
                <p className="text-gray-900 text-sm flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  {food}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Discipline Tips */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-purple-400">🎯</span>
          Food Discipline Tips
        </h2>
        <div className="space-y-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <h3 className="text-gray-900 font-medium text-sm mb-1">Meal Timing</h3>
            <p className="text-gray-700 text-xs">Eat at regular intervals, avoid late-night meals</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h3 className="text-gray-900 font-medium text-sm mb-1">Portion Control</h3>
            <p className="text-gray-700 text-xs">Use smaller plates, eat slowly to recognize fullness</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h3 className="text-gray-900 font-medium text-sm mb-1">Food Journal</h3>
            <p className="text-gray-700 text-xs">Track what you eat to identify trigger foods</p>
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [savedLogs, setSavedLogs] = useState<Record<string, any>>({})
  const [showSummary, setShowSummary] = useState(false)
  const [dailySummary, setDailySummary] = useState<any>(null)

  const [logData, setLogData] = useState({
    stoolType: "",
    stoolFrequency: 1,
    stoolNotes: "",
    stoolColor: "brown",
    pencilThin: false,
    mucus: false,
    blood: false,
    symptoms: {
      bloating: 0,
      abdominalPain: 0,
      gas: 0,
      nausea: 0,
      fatigue: 0,
    },
    meals: [] as Array<{ id: string; name: string; time: string; tag: "safe" | "trigger" | "unsure" }>,
    waterIntake: 0,
    sleepHours: 8,
    stressLevel: 5,
    dailyNotes: "",
    attachedImage: null as string | null,
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [showTrends, setShowTrends] = useState(false)

  const steps = [
    { id: "stool", title: "Stool Tracking", icon: "🚽", description: "Bristol Stool Chart & Details" },
    { id: "symptoms", title: "Symptoms", icon: "🤒", description: "Rate your symptom severity" },
    { id: "food", title: "Food Journal", icon: "🍽️", description: "Log meals and reactions" },
    { id: "lifestyle", title: "Lifestyle", icon: "💧", description: "Hydration, sleep & stress" },
    { id: "notes", title: "Daily Notes", icon: "📝", description: "Personal observations" },
  ]

  useEffect(() => {
    const savedData = savedLogs[selectedDate]
    if (savedData) {
      setLogData(savedData.logData)
      setDailySummary(savedData.summary)
      setCurrentStep(5) // Go to summary view
    } else {
      // Reset to default values for new date
      setLogData({
        stoolType: "",
        stoolFrequency: 1,
        stoolNotes: "",
        stoolColor: "brown",
        pencilThin: false,
        mucus: false,
        blood: false,
        symptoms: {
          bloating: 0,
          abdominalPain: 0,
          gas: 0,
          nausea: 0,
          fatigue: 0,
        },
        meals: [],
        waterIntake: 0,
        sleepHours: 8,
        stressLevel: 5,
        dailyNotes: "",
        attachedImage: null,
      })
      setDailySummary(null)
      setCurrentStep(0) // Start from beginning
    }
  }, [selectedDate, savedLogs])

  const bristolTypes = [
    { type: 1, description: "Separate hard lumps", icon: "🟤", severity: "severe" },
    { type: 2, description: "Lumpy and sausage like", icon: "🟫", severity: "moderate" },
    { type: 3, description: "A sausage shape with cracks in the surface", icon: "🤎", severity: "normal" },
    { type: 4, description: "Like a smooth, soft sausage or snake", icon: "🟤", severity: "normal" },
    { type: 5, description: "Soft blobs with clear-cut edges", icon: "🟫", severity: "mild" },
    { type: 6, description: "Mushy consistency with ragged edges", icon: "🤎", severity: "moderate" },
    { type: 7, description: "Liquid consistency with no solid pieces", icon: "🟤", severity: "severe" },
  ]

  const generateDailySummary = () => {
    const symptomTotal = Object.values(logData.symptoms).reduce((sum, val) => sum + val, 0)
    const avgSymptomSeverity = symptomTotal / Object.keys(logData.symptoms).length
    const triggerFoods = logData.meals.filter((meal) => meal.tag === "trigger").length
    const safeFoods = logData.meals.filter((meal) => meal.tag === "safe").length

    let overallStatus = "good"
    const recommendations = []

    // Analyze stool type
    const stoolTypeNum = Number.parseInt(logData.stoolType)
    if (stoolTypeNum === 3 || stoolTypeNum === 4) {
      recommendations.push("✅ Your stool type indicates healthy digestion")
    } else if (stoolTypeNum <= 2) {
      overallStatus = "concerning"
      recommendations.push("⚠️ Consider increasing fiber and water intake for constipation")
    } else if (stoolTypeNum >= 6) {
      overallStatus = "concerning"
      recommendations.push("⚠️ Loose stools may indicate dietary triggers or stress")
    }

    // Analyze symptoms
    if (avgSymptomSeverity <= 2) {
      recommendations.push("✅ Low symptom levels - keep up your current routine")
    } else if (avgSymptomSeverity <= 5) {
      overallStatus = "moderate"
      recommendations.push("💡 Moderate symptoms detected - consider identifying triggers")
    } else {
      overallStatus = "concerning"
      recommendations.push("🚨 High symptom levels - consider consulting a healthcare provider")
    }

    // Analyze hydration
    if (logData.waterIntake >= 8) {
      recommendations.push("✅ Great hydration levels")
    } else {
      recommendations.push("💧 Try to increase water intake to 8+ glasses daily")
    }

    // Analyze stress
    if (logData.stressLevel >= 7) {
      recommendations.push("🧘 High stress levels may affect gut health - try relaxation techniques")
    }

    // Analyze food triggers
    if (triggerFoods > 0) {
      recommendations.push(`⚠️ ${triggerFoods} trigger food(s) identified - consider avoiding these`)
    }
    if (safeFoods > triggerFoods) {
      recommendations.push("✅ More safe foods than triggers - good dietary choices")
    }

    return {
      date: selectedDate,
      overallStatus,
      recommendations,
      metrics: {
        stoolType: logData.stoolType,
        avgSymptoms: avgSymptomSeverity.toFixed(1),
        waterIntake: logData.waterIntake,
        stressLevel: logData.stressLevel,
        triggerFoods,
        safeFoods,
      },
    }
  }

  const updateLogData = (field: string, value: any) => {
    setLogData((prev) => ({ ...prev, [field]: value }))
  }

  const updateSymptom = (symptom: string, value: number) => {
    setLogData((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [symptom]: value },
    }))
  }

  const addMeal = () => {
    const mealName = prompt("Enter meal/food name:")
    if (mealName) {
      const newMeal = {
        id: Date.now().toString(),
        name: mealName,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tag: "unsure" as const,
      }
      setLogData((prev) => ({
        ...prev,
        meals: [...prev.meals, newMeal],
      }))
    }
  }

  const updateMealTag = (mealId: string, tag: "safe" | "trigger" | "unsure") => {
    setLogData((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) => (meal.id === mealId ? { ...meal, tag } : meal)),
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateLogData("attachedImage", e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveLogEntry = () => {
    const summary = generateDailySummary()
    const logEntry = {
      date: selectedDate,
      logData,
      summary,
      timestamp: new Date().toISOString(),
    }

    const updatedLogs = {
      ...savedLogs,
      [selectedDate]: logEntry,
    }

    setSavedLogs(updatedLogs)
    setDailySummary(summary)
    setShowSummary(true)

    localStorage.setItem("gutguard-logs", JSON.stringify(updatedLogs))

    // In a real app, this would save to database/localStorage
    console.log("[v0] Saved log entry for", selectedDate, logEntry)
  }

  const calculateTrendsData = () => {
    const logs = Object.values(savedLogs)
    if (logs.length === 0) return null

    const avgStoolType =
      logs.reduce((sum: number, log: any) => sum + (Number.parseInt(log.logData.stoolType) || 0), 0) / logs.length

    const avgSymptoms =
      logs.reduce((sum: number, log: any) => {
        const symptomTotal = Object.values(log.logData.symptoms).reduce((s: number, v: any) => s + v, 0)
        return sum + symptomTotal / Object.keys(log.logData.symptoms).length
      }, 0) / logs.length

    const avgWater = logs.reduce((sum: number, log: any) => sum + log.logData.waterIntake, 0) / logs.length

    const totalTriggers = logs.reduce(
      (sum: number, log: any) => sum + log.logData.meals.filter((meal: any) => meal.tag === "trigger").length,
      0,
    )

    return {
      avgStoolType: avgStoolType.toFixed(1),
      avgSymptoms: avgSymptoms.toFixed(1),
      avgWater: avgWater.toFixed(1),
      totalTriggers,
      totalEntries: logs.length,
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete questionnaire and show summary
      saveLogEntry()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Stool
        return logData.stoolType !== ""
      case 1: // Symptoms
        return true // Always allow progression
      case 2: // Food
        return true // Always allow progression
      case 3: // Lifestyle
        return true // Always allow progression
      case 4: // Notes
        return true // Always allow progression
      default:
        return true
    }
  }

  const trendsData = calculateTrendsData()

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Gut Health Log</h1>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
            <Button
              onClick={() => setShowTrends(!showTrends)}
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-gray-800"
            >
              📊
            </Button>
          </div>
        </div>

        {!showTrends && currentStep < 5 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-green-300">{steps[currentStep]?.title}</h2>
              <p className="text-sm text-gray-400">{steps[currentStep]?.description}</p>
            </div>
          </div>
        )}
      </div>

      {showSummary && dailySummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Daily Summary</h2>
              <button onClick={() => setShowSummary(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  dailySummary.overallStatus === "good"
                    ? "bg-green-900/30 border border-green-700"
                    : dailySummary.overallStatus === "moderate"
                      ? "bg-yellow-900/30 border border-yellow-700"
                      : "bg-red-900/30 border border-red-700"
                }`}
              >
                <h3 className="font-semibold mb-2">Overall Status: {dailySummary.overallStatus.toUpperCase()}</h3>
                <div className="text-sm text-gray-300">Date: {new Date(dailySummary.date).toLocaleDateString()}</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Stool Type: {dailySummary.metrics.stoolType || "Not logged"}</div>
                  <div>Avg Symptoms: {dailySummary.metrics.avgSymptoms}/10</div>
                  <div>Water Intake: {dailySummary.metrics.waterIntake} glasses</div>
                  <div>Stress Level: {dailySummary.metrics.stressLevel}/10</div>
                  <div>Trigger Foods: {dailySummary.metrics.triggerFoods}</div>
                  <div>Safe Foods: {dailySummary.metrics.safeFoods}</div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {dailySummary.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTrends ? (
        /* Enhanced Trends View with real data */
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-800/30">
            <h2 className="text-lg font-semibold mb-4 text-green-300">
              {trendsData ? `Summary (${trendsData.totalEntries} entries)` : "No Data Available"}
            </h2>
            {trendsData ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{trendsData.avgStoolType}</div>
                  <div className="text-sm text-gray-300">Avg Stool Type</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{trendsData.avgWater}</div>
                  <div className="text-sm text-gray-300">Avg Water Intake</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{trendsData.avgSymptoms}</div>
                  <div className="text-sm text-gray-300">Avg Symptoms</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">{trendsData.totalTriggers}</div>
                  <div className="text-sm text-gray-300">Total Triggers</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl mb-2 block">📊</span>
                <p>Start logging daily to see trends</p>
              </div>
            )}
          </div>

          {trendsData && (
            <>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Entries</h3>
                <div className="space-y-3">
                  {Object.entries(savedLogs)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 7)
                    .map(([date, entry]: [string, any]) => (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date)
                          setShowTrends(false)
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <div className="text-left">
                          <div className="font-medium">{new Date(date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-400">Status: {entry.summary.overallStatus}</div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            entry.summary.overallStatus === "good"
                              ? "bg-green-900/50 text-green-300"
                              : entry.summary.overallStatus === "moderate"
                                ? "bg-yellow-900/50 text-yellow-300"
                                : "bg-red-900/50 text-red-300"
                          }`}
                        >
                          {entry.summary.overallStatus}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Pattern Analysis</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    Most common stool type: Type {Math.round(Number.parseFloat(trendsData.avgStoolType))}
                  </div>
                  <div className="text-sm text-gray-300">Average symptom severity: {trendsData.avgSymptoms}/10</div>
                  <div className="text-sm text-gray-300">
                    Daily water goal achievement: {Number.parseFloat(trendsData.avgWater) >= 8 ? "✅" : "❌"}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : currentStep === 5 && dailySummary ? (
        /* Daily Summary View with graphs and metrics */
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-800/30">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Daily Summary</h2>
            <div className="text-sm text-gray-300 mb-4">{new Date(dailySummary.date).toLocaleDateString()}</div>

            <div
              className={`p-4 rounded-lg mb-6 ${
                dailySummary.overallStatus === "good"
                  ? "bg-green-900/30 border border-green-700"
                  : dailySummary.overallStatus === "moderate"
                    ? "bg-yellow-900/30 border border-yellow-700"
                    : "bg-red-900/30 border border-red-700"
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">Overall Status: {dailySummary.overallStatus.toUpperCase()}</h3>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-400">{dailySummary.metrics.stoolType || "N/A"}</div>
                <div className="text-sm text-gray-300">Stool Type</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{dailySummary.metrics.avgSymptoms}</div>
                <div className="text-sm text-gray-300">Avg Symptoms</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{dailySummary.metrics.waterIntake}</div>
                <div className="text-sm text-gray-300">Water Glasses</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{dailySummary.metrics.stressLevel}</div>
                <div className="text-sm text-gray-300">Stress Level</div>
              </div>
            </div>

            {/* Food Analysis */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Food Analysis</h3>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{dailySummary.metrics.safeFoods}</div>
                  <div className="text-xs text-gray-300">Safe Foods</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">{dailySummary.metrics.triggerFoods}</div>
                  <div className="text-xs text-gray-300">Trigger Foods</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Personalized Recommendations</h3>
              <div className="space-y-2">
                {dailySummary.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setCurrentStep(0)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Edit Today's Log
              </Button>
              <Button onClick={() => setShowTrends(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                View Trends
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Sequential Questionnaire Flow */
        <div className="p-6 space-y-6">
          {/* Stool Tracker - Step 0 */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-800/30">
                <h2 className="text-lg font-semibold mb-4 text-amber-300">Bristol Stool Chart</h2>
                <div className="grid grid-cols-1 gap-3">
                  {bristolTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => updateLogData("stoolType", type.type.toString())}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        logData.stoolType === type.type.toString()
                          ? "border-amber-500 bg-amber-500/20"
                          : "border-gray-600 bg-gray-800 hover:border-gray-500"
                      }`}
                    >
                      <div className="text-2xl">{type.icon}</div>
                      <div className="text-left flex-1">
                        <div className="font-medium">Type {type.type}</div>
                        <div className="text-sm text-gray-400">{type.description}</div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          type.severity === "normal"
                            ? "bg-green-900/50 text-green-300"
                            : type.severity === "mild"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {type.severity}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency Today</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={logData.stoolFrequency}
                        onChange={(e) => updateLogData("stoolFrequency", Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold w-8">{logData.stoolFrequency}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "pencilThin", label: "Pencil-thin", icon: "📏" },
                      { key: "mucus", label: "Mucus", icon: "🫧" },
                      { key: "blood", label: "Blood", icon: "🩸" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => updateLogData(option.key, !logData[option.key as keyof typeof logData])}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          logData[option.key as keyof typeof logData]
                            ? "border-red-500 bg-red-500/20 text-red-300"
                            : "border-gray-600 bg-gray-800 hover:border-gray-500"
                        }`}
                      >
                        <span className="text-xl">{option.icon}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      value={logData.stoolNotes}
                      onChange={(e) => updateLogData("stoolNotes", e.target.value)}
                      placeholder="Color, consistency, any other observations..."
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Symptom Log - Step 1 */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-800/30">
              <h2 className="text-lg font-semibold mb-4 text-red-300">Symptom Severity (0-10)</h2>
              <div className="space-y-6">
                {Object.entries(logData.symptoms).map(([symptom, value]) => (
                  <div key={symptom} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="capitalize font-medium">{symptom.replace(/([A-Z])/g, " $1")}</label>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          value === 0
                            ? "bg-green-900/50 text-green-300"
                            : value <= 3
                              ? "bg-yellow-900/50 text-yellow-300"
                              : value <= 6
                                ? "bg-orange-900/50 text-orange-300"
                                : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {value}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">None</span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={(e) => updateSymptom(symptom, Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400">Severe</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Journal - Step 2 */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-800/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-300">Food & Drink Journal</h2>
                <Button onClick={addMeal} className="bg-green-600 hover:bg-green-700 text-white">
                  + Add Meal
                </Button>
              </div>

              <div className="space-y-3">
                {logData.meals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <span className="text-4xl mb-2 block">🍽️</span>
                    <p>No meals logged today</p>
                    <p className="text-sm">Tap "Add Meal" to start tracking</p>
                  </div>
                ) : (
                  logData.meals.map((meal) => (
                    <div key={meal.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{meal.name}</h3>
                          <p className="text-sm text-gray-400">{meal.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(["safe", "trigger", "unsure"] as const).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => updateMealTag(meal.id, tag)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              meal.tag === tag
                                ? tag === "safe"
                                  ? "bg-green-500 text-white"
                                  : tag === "trigger"
                                    ? "bg-red-500 text-white"
                                    : "bg-yellow-500 text-black"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            {tag === "safe" ? "✅ Safe" : tag === "trigger" ? "⚠️ Trigger" : "❓ Unsure"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Lifestyle - Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-800/30">
                <h2 className="text-lg font-semibold mb-4 text-blue-300">Hydration & Lifestyle</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Water Intake (glasses)</label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {[...Array(12)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => updateLogData("waterIntake", i + 1)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              i < logData.waterIntake
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-600 bg-gray-800 hover:border-blue-400"
                            }`}
                          >
                            💧
                          </button>
                        ))}
                      </div>
                      <span className="text-lg font-semibold">{logData.waterIntake}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sleep Hours: {logData.sleepHours}h</label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="0.5"
                      value={logData.sleepHours}
                      onChange={(e) => updateLogData("sleepHours", Number.parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>4h</span>
                      <span>12h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stress Level: {logData.stressLevel}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={logData.stressLevel}
                      onChange={(e) => updateLogData("stressLevel", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>😌 Relaxed</span>
                      <span>😰 Very Stressed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Notes - Step 4 */}
          {currentStep === 4 && (
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-800/30">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">Daily Notes & Photos</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Personal Observations</label>
                  <textarea
                    value={logData.dailyNotes}
                    onChange={(e) => updateLogData("dailyNotes", e.target.value)}
                    placeholder="How are you feeling today? Any patterns you've noticed?"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attach Photo (Optional)</label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white">📷 Add Photo</Button>
                    </div>
                    {logData.attachedImage && (
                      <div className="relative">
                        <img
                          src={logData.attachedImage || "/placeholder.svg"}
                          alt="Attached"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => updateLogData("attachedImage", null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Photos are private and stored securely on your device</p>
                </div>
              </div>
            </div>
          )}

          {currentStep < 5 && (
            <div className="flex gap-3 sticky bottom-24 bg-gray-900 pt-4">
              {currentStep > 0 && (
                <Button
                  onClick={prevStep}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold"
                >
                  ← Previous
                </Button>
              )}
              <Button
                onClick={nextStep}
                disabled={!isStepComplete()}
                className={`flex-1 py-4 rounded-xl font-semibold ${
                  isStepComplete()
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                } ${currentStep === 0 ? "flex-1" : ""}`}
              >
                {currentStep === steps.length - 1 ? "Complete & View Summary" : "Next →"}
              </Button>
            </div>
          )}
        </div>
      )}
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = { role: "user", content: inputMessage.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message to DeepSeek API:", userMessage)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "User is asking about gut health and digestive wellness",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received response from DeepSeek:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      const cleanMessage = data.message.replace(/\*\*(.*?)\*\*/g, "$1").replace(/##\s*(.*?)$/gm, "$1")
      setMessages((prev) => [...prev, { role: "assistant", content: cleanMessage }])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 px-6 pt-6 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Gut Guardian AI</h1>
            <p className="text-sm text-gray-400">Your Personal Health Advisor</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-start gap-3 max-w-[85%]">
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                    : "bg-gray-800 border border-gray-700 text-white rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
              <div className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full animation-delay-200"></div>
                  <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full animation-delay-400"></div>
                  <span className="text-sm ml-2">Analyzing your question...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-4">
        <div className="flex gap-3 items-end bg-gray-800 rounded-2xl p-3 border border-gray-700 max-w-sm mx-auto">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your gut health..."
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[40px] max-h-32 leading-relaxed text-sm"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </Button>
        </div>
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
