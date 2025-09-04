"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
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
    }, 3000) // Show splash for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const DevControls = () => (
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
        {/* Dashboard Content */}
        <div className="pb-20">
          {dashboardTab === "dashboard" && <DashboardScreen />}
          {dashboardTab === "scan" && <ScanScreen />}
          {dashboardTab === "log" && <LogScreen />}
          {dashboardTab === "advice" && <AdviceScreen />}
          {dashboardTab === "settings" && <SettingsScreen />}
        </div>

        {/* Bottom Navigation */}
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

        {/* Content */}
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

          {/* Progress dots */}
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
  const [activeScreen, setActiveScreen] = useState("dashboard")

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "symptom-check":
        setActiveScreen("log")
        break
      case "stool-log":
        setActiveScreen("log")
        break
      case "food-scan":
        setActiveScreen("scan")
        break
      case "daily-goals":
        // Show daily goals modal or navigate to goals section
        alert("Daily Goals feature coming soon!")
        break
    }
  }

  const handleRiskInfo = (type: string) => {
    alert(`${type} risk assessment based on your recent symptoms, family history, and lifestyle factors.`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">GutGuard</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-800"
          onClick={() => setActiveScreen("settings")}
        >
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
                <button
                  className="text-gray-600 text-xs underline hover:text-gray-800"
                  onClick={() => handleRiskInfo("Colon")}
                >
                  Why?
                </button>
              </div>
              <div className="w-16 h-16 bg-red-200 rounded-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-red-600">
                  <path
                    fill="currentColor"
                    d="M8 6c-2 0-4 2-4 4v12c0 2 2 4 4 4h16c2 0 4-2 4-4V10c0-2-2-4-4-4H8zm2 4h12c1 0 2 1 2 2v8c0 1-1 2-2 2H10c-1 0-2-1-2-2v-8c0-1 1-2 2-2z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-teal-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Stomach</h3>
                <p className="text-gray-700 font-semibold">Medium</p>
                <button
                  className="text-gray-600 text-xs underline hover:text-gray-800"
                  onClick={() => handleRiskInfo("Stomach")}
                >
                  Why?
                </button>
              </div>
              <div className="w-16 h-16 bg-teal-200 rounded-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-teal-600">
                  <path
                    fill="currentColor"
                    d="M16 4c-4 0-8 2-8 6v4c0 2-1 4-2 6-1 2 0 4 2 4h16c2 0 3-2 2-4-1-2-2-4-2-6v-4c0-4-4-6-8-6zm0 2c3 0 6 1 6 4v4c0 3 1 5 2 7H8c1-2 2-4 2-7v-4c0-3 3-4 6-4z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: "Quick Symptom Check",
                subtitle: "Start",
                action: "symptom-check",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-orange-600">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                  </svg>
                ),
                bg: "bg-orange-100",
              },
              {
                title: "Stool Log",
                subtitle: "Bristol • pencil-thin toggle",
                action: "stool-log",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-600">
                    <path
                      fill="currentColor"
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                    />
                  </svg>
                ),
                bg: "bg-yellow-100",
              },
              {
                title: "Food Scan",
                subtitle: "Open Camera / Upload",
                action: "food-scan",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-600">
                    <path
                      fill="currentColor"
                      d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"
                    />
                  </svg>
                ),
                bg: "bg-blue-100",
              },
              {
                title: "Daily Goals",
                subtitle: "Hydration ring, fiber goal, steps",
                action: "daily-goals",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-green-600">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                  </svg>
                ),
                bg: "bg-green-100",
              },
            ].map((action, index) => (
              <button
                key={index}
                className={`${action.bg} p-4 rounded-xl flex flex-col justify-between h-24 hover:opacity-80 transition-opacity`}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="text-left">
                    <h3 className="text-gray-900 font-medium text-sm">{action.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">{action.subtitle}</p>
                  </div>
                  {action.icon}
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
        // First try with back camera (environment)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
      } catch (envError) {
        console.log("[v0] Back camera not available, trying front camera")
        try {
          // Fallback to front camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })
        } catch (userError) {
          console.log("[v0] Front camera not available, trying any camera")
          // Final fallback to any available camera
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
      console.error("[v0] Camera access error:", error)

      let errorMessage = "Camera access failed. "

      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera device found. Please ensure a camera is connected and working."
      } else if (error.name === "NotAllowedError") {
        errorMessage += "Camera permission denied. Please allow camera access in your browser settings."
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera is already in use by another application. Please close other apps using the camera."
      } else if (error.name === "OverconstrainedError") {
        errorMessage += "Camera constraints not supported. Trying with basic settings..."
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true })
          setCameraStream(basicStream)
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
          }
          return
        } catch (basicError) {
          errorMessage += " Failed with basic settings too."
        }
      } else {
        errorMessage += error.message || "Unknown camera error occurred."
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

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analysis results
    const mockResults = [
      { food: "Gluten-Free Bread", confidence: 95, suitable: true, reason: "Low FODMAP and gluten-free" },
      { food: "Spicy Curry", confidence: 88, suitable: false, reason: "High spice content may trigger symptoms" },
      { food: "Banana", confidence: 92, suitable: true, reason: "Easy to digest and low FODMAP" },
      { food: "Dairy Milk", confidence: 85, suitable: false, reason: "Lactose may cause digestive issues" },
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className={scanResult.suitable ? "text-green-400" : "text-red-400"}
                >
                  <path
                    fill="currentColor"
                    d={
                      scanResult.suitable
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    }
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2">{scanResult.reason}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Override</span>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                  <path
                    fill="currentColor"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2">How we decide</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LogScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [logData, setLogData] = useState({
    bristolType: "",
    stoolColor: "Brown",
    hasBlood: false,
    hasMucus: false,
    hasUndigestedFood: false,
    symptoms: [] as string[],
    painLevel: [0],
    notes: "",
    waterIntake: [0],
    sleepHours: [8],
    stressLevel: [5],
    moodRating: [5],
    energyLevel: [5],
  })

  const [savedLogs, setSavedLogs] = useState<{ [key: string]: any }>({})

  const bristolTypes = [
    { type: 1, description: "Separate hard lumps" },
    { type: 2, description: "Sausage-shaped but lumpy" },
    { type: 3, description: "Like a sausage with cracks" },
    { type: 4, description: "Smooth and soft" },
    { type: 5, description: "Soft blobs" },
    { type: 6, description: "Fluffy pieces" },
    { type: 7, description: "Watery, no solid pieces" },
  ]

  const symptoms = [
    "Abdominal Pain",
    "Bloating",
    "Gas",
    "Nausea",
    "Fatigue",
    "Diarrhea",
    "Constipation",
    "Heartburn",
    "Cramping",
    "Headache",
  ]

  const handleSymptomToggle = (symptom: string) => {
    const currentSymptoms = logData.symptoms
    if (currentSymptoms.includes(symptom)) {
      setLogData((prev) => ({
        ...prev,
        symptoms: currentSymptoms.filter((s) => s !== symptom),
      }))
    } else {
      setLogData((prev) => ({
        ...prev,
        symptoms: [...currentSymptoms, symptom],
      }))
    }
  }

  const saveLog = () => {
    setSavedLogs((prev) => ({
      ...prev,
      [selectedDate]: { ...logData, timestamp: new Date().toISOString() },
    }))
    alert("Daily log saved successfully!")
  }

  const loadLogForDate = (date: string) => {
    const existingLog = savedLogs[date]
    if (existingLog) {
      setLogData(existingLog)
    } else {
      // Reset to default values for new date
      setLogData({
        bristolType: "",
        stoolColor: "Brown",
        hasBlood: false,
        hasMucus: false,
        hasUndigestedFood: false,
        symptoms: [],
        painLevel: [0],
        notes: "",
        waterIntake: [0],
        sleepHours: [8],
        stressLevel: [5],
        moodRating: [5],
        energyLevel: [5],
      })
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    loadLogForDate(date)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-medium">Daily Health Log</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-1 text-sm"
          />
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Calendar className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Stool Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Stool</h2>
          <div className="space-y-4">
            {/* Bristol Stool Chart Selection */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">Bristol Stool Chart</h3>
              <div className="grid grid-cols-2 gap-2">
                {bristolTypes.map((bristol) => (
                  <button
                    key={bristol.type}
                    onClick={() => setLogData((prev) => ({ ...prev, bristolType: bristol.type.toString() }))}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      logData.bristolType === bristol.type.toString()
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    <div className="font-medium">Type {bristol.type}</div>
                    <div className="text-xs opacity-80">{bristol.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stool Color */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">Color</h3>
              <div className="flex gap-2">
                {["Brown", "Yellow", "Green", "Black", "Red", "White"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setLogData((prev) => ({ ...prev, stoolColor: color }))}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      logData.stoolColor === color
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Stool Characteristics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Blood</span>
                <Switch
                  checked={logData.hasBlood}
                  onCheckedChange={(checked) => setLogData((prev) => ({ ...prev, hasBlood: checked }))}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mucus</span>
                <Switch
                  checked={logData.hasMucus}
                  onCheckedChange={(checked) => setLogData((prev) => ({ ...prev, hasMucus: checked }))}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Undigested Food</span>
                <Switch
                  checked={logData.hasUndigestedFood}
                  onCheckedChange={(checked) => setLogData((prev) => ({ ...prev, hasUndigestedFood: checked }))}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
            </div>

            <Button variant="outline" className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <Camera className="h-4 w-4 mr-2" />
              Photo
            </Button>
          </div>
        </div>

        {/* Symptoms Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Symptoms</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {symptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  logData.symptoms.includes(symptom)
                    ? "bg-red-500 text-white"
                    : "bg-gray-800 border border-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>

          {/* Pain Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Pain Level (0-10)</label>
              <span className="text-lg font-medium">{logData.painLevel[0]}</span>
            </div>
            <Slider
              value={logData.painLevel}
              onValueChange={(value) => setLogData((prev) => ({ ...prev, painLevel: value }))}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Daily Wellness Tracking */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Daily Wellness</h2>
          <div className="space-y-6">
            {/* Water Intake */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Water Intake (glasses)</label>
                <span className="text-lg font-medium">{logData.waterIntake[0]}</span>
              </div>
              <Slider
                value={logData.waterIntake}
                onValueChange={(value) => setLogData((prev) => ({ ...prev, waterIntake: value }))}
                max={12}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Sleep Hours */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Sleep Hours</label>
                <span className="text-lg font-medium">{logData.sleepHours[0]}h</span>
              </div>
              <Slider
                value={logData.sleepHours}
                onValueChange={(value) => setLogData((prev) => ({ ...prev, sleepHours: value }))}
                max={12}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Stress Level */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Stress Level (0-10)</label>
                <span className="text-lg font-medium">{logData.stressLevel[0]}</span>
              </div>
              <Slider
                value={logData.stressLevel}
                onValueChange={(value) => setLogData((prev) => ({ ...prev, stressLevel: value }))}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Mood Rating */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Mood (1-10)</label>
                <span className="text-lg font-medium">{logData.moodRating[0]}</span>
              </div>
              <Slider
                value={logData.moodRating}
                onValueChange={(value) => setLogData((prev) => ({ ...prev, moodRating: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Energy Level */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Energy Level (1-10)</label>
                <span className="text-lg font-medium">{logData.energyLevel[0]}</span>
              </div>
              <Slider
                value={logData.energyLevel}
                onValueChange={(value) => setLogData((prev) => ({ ...prev, energyLevel: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <Textarea
            placeholder="How are you feeling today? Any observations or concerns..."
            value={logData.notes}
            onChange={(e) => setLogData((prev) => ({ ...prev, notes: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl min-h-[100px] resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={saveLog}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium"
        >
          Save Daily Log
        </Button>

        {/* Trends Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Trends</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Stool Consistency</span>
                <span className="font-bold text-2xl">{logData.bristolType || "3"}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">14 days</p>
              <div className="flex items-end gap-1 h-16">
                {[3, 2, 4, 3, 3, 2, 4, 3, 3, 4, 2, 3, 4, 3].map((value, index) => (
                  <div
                    key={index}
                    className="bg-green-500 rounded-t flex-1"
                    style={{ height: `${(value / 7) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Symptom Severity</span>
                <span className="font-bold text-2xl">{logData.painLevel[0]}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">14 days</p>
              <div className="flex items-end gap-1 h-16">
                {[2, 1, 3, 2, 2, 1, 3, 2, 2, 3, 1, 2, 3, 2].map((value, index) => (
                  <div
                    key={index}
                    className="bg-green-500 rounded-t flex-1"
                    style={{ height: `${(value / 5) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Mood & Energy</span>
                <span className="font-bold text-2xl">{logData.moodRating[0]}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">14 days</p>
              <div className="flex items-end gap-1 h-16">
                {[7, 6, 8, 7, 7, 6, 8, 7, 7, 8, 6, 7, 8, 7].map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t flex-1"
                    style={{ height: `${(value / 10) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>
          </div>
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
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "gut health advice",
        }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Coach</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <span className="text-lg">⚙️</span>
        </Button>
      </div>

      <div className="flex-1 bg-gray-800 rounded-xl p-4 mb-4 overflow-y-auto max-h-96">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === "assistant" ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                <span className="text-white font-bold text-sm">{message.role === "assistant" ? "AI" : "You"}</span>
              </div>
              <div className={`flex-1 p-3 rounded-lg ${message.role === "assistant" ? "bg-gray-700" : "bg-blue-600"}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-gray-700">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your gut health..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
        />
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-green-500 hover:bg-green-600 text-white px-6"
        >
          Send
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            title: "Flare plan (24-48 h)",
            bg: "bg-red-100",
            message: "I'm experiencing a gut health flare-up. Can you provide a 24-48 hour management plan?",
          },
          {
            title: "Gentle 7-day plan",
            bg: "bg-blue-100",
            message: "Can you create a gentle 7-day gut health recovery plan for me?",
          },
          {
            title: "Trigger hunt",
            bg: "bg-yellow-100",
            message: "Help me identify potential triggers for my digestive issues.",
          },
          {
            title: "Doctor checklist",
            bg: "bg-green-100",
            message: "What should I discuss with my doctor about my gut health?",
          },
        ].map((action, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => {
              setInputMessage(action.message)
              setTimeout(() => sendMessage(), 100)
            }}
            className={`${action.bg} border-gray-600 text-gray-900 hover:bg-opacity-80 h-16 rounded-xl`}
          >
            {action.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

function SettingsScreen() {
  const [currentView, setCurrentView] = useState("main")
  const [theme, setTheme] = useState("Dark")
  const [language, setLanguage] = useState("English")
  const [notifications, setNotifications] = useState({
    hydration: true,
    dailyCheck: true,
    stoolLog: true,
    symptoms: false,
  })

  const handleProfileEdit = () => {
    alert("Profile editing feature - redirects to onboarding form with current data pre-filled")
  }

  const handleLanguageChange = () => {
    const languages = ["English", "Spanish", "French", "German", "Italian"]
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    setLanguage(languages[nextIndex])
  }

  const handleNotificationSettings = () => {
    setCurrentView("notifications")
  }

  const handleDataExport = () => {
    const exportData = {
      profile: { age: 30, gender: "Male", height: 175, weight: 70 },
      healthLogs: { symptoms: [], stoolLogs: [], painLevels: [] },
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "gutguard-data-export.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleThemeToggle = () => {
    setTheme(theme === "Dark" ? "Light" : "Dark")
  }

  const handleDisclaimer = () => {
    setCurrentView("disclaimer")
  }

  const handlePrivacyPolicy = () => {
    setCurrentView("privacy")
  }

  const handleResetOnboarding = () => {
    if (confirm("Are you sure you want to reset your onboarding? This will clear all your progress.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleManageSubscription = () => {
    window.open("https://buy.stripe.com/manage/subscription", "_blank")
  }

  if (currentView === "notifications") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentView("main")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Notification Settings</h1>
        </div>

        <div className="space-y-6">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                <p className="text-sm text-gray-400">
                  {key === "hydration" && "Daily water intake reminders"}
                  {key === "dailyCheck" && "Daily health check-in notifications"}
                  {key === "stoolLog" && "Stool logging reminders"}
                  {key === "symptoms" && "Symptom tracking alerts"}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (currentView === "disclaimer") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentView("main")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Full Disclaimer</h1>
        </div>

        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong>Medical Disclaimer:</strong> GutGuard is an educational tool and is not intended to provide medical
            advice, diagnosis, or treatment. Always consult with qualified healthcare professionals regarding any health
            concerns.
          </p>

          <p>
            <strong>Not a Medical Device:</strong> This application is not a medical device and should not be used as a
            substitute for professional medical care, diagnosis, or treatment.
          </p>

          <p>
            <strong>Emergency Situations:</strong> If you experience severe symptoms or medical emergencies, seek
            immediate medical attention. Do not rely on this app for emergency medical situations.
          </p>

          <p>
            <strong>Data Accuracy:</strong> While we strive for accuracy, the information provided may not be complete
            or up-to-date. Users are responsible for verifying information with healthcare providers.
          </p>

          <p>
            <strong>Individual Results:</strong> Health recommendations are general in nature and may not be suitable
            for everyone. Individual results may vary.
          </p>
        </div>
      </div>
    )
  }

  if (currentView === "privacy") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800"
            onClick={() => setCurrentView("main")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Privacy Policy</h1>
        </div>

        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            <strong>Data Collection:</strong> We collect health information you provide to personalize your experience
            and provide relevant insights.
          </p>

          <p>
            <strong>Data Usage:</strong> Your data is used to provide personalized health insights, track your progress,
            and improve our services.
          </p>

          <p>
            <strong>Data Security:</strong> We implement industry-standard security measures to protect your personal
            health information.
          </p>

          <p>
            <strong>Data Sharing:</strong> We do not sell or share your personal health data with third parties without
            your explicit consent.
          </p>

          <p>
            <strong>Data Retention:</strong> Your data is retained as long as your account is active or as needed to
            provide services.
          </p>

          <p>
            <strong>Your Rights:</strong> You have the right to access, update, or delete your personal information at
            any time.
          </p>

          <p>
            <strong>Contact:</strong> For privacy concerns, contact us at privacy@gutguard.com
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <button
            onClick={handleProfileEdit}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
                <path
                  fill="currentColor"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium">Profile & Health</h3>
              <p className="text-sm text-gray-400">Edit your profile and health information</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
              <path
                fill="currentColor"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              />
            </svg>
          </button>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <button
              onClick={handleLanguageChange}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Language</h3>
                <p className="text-sm text-gray-400 text-left">{language}</p>
              </div>
              <span className="text-gray-400">{language.slice(0, 2).toUpperCase()}</span>
            </button>

            <button
              onClick={handleNotificationSettings}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Notifications</h3>
                <p className="text-sm text-gray-400 text-left">Hydration, Daily Check, Stool Log</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={handleDataExport}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Data Export</h3>
                <p className="text-sm text-gray-400 text-left">Export your data in JSON or PDF format</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Theme</h3>
                <p className="text-sm text-gray-400 text-left">{theme}</p>
              </div>
              <span className="text-gray-400">{theme}</span>
            </button>
          </div>
        </div>

        {/* Legal Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Legal</h2>
          <div className="space-y-4">
            <button
              onClick={handleDisclaimer}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <span className="font-medium">Full Disclaimer</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={handlePrivacyPolicy}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <span className="font-medium">Privacy Policy</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Other Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Other</h2>
          <div className="space-y-4">
            <button
              onClick={handleResetOnboarding}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <span className="font-medium">Reset Onboarding</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={handleManageSubscription}
              className="w-full flex items-center justify-between hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <span className="font-medium">Manage Subscription</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
