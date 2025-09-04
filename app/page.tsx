"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Camera, Calendar } from "lucide-react"

export default function OnboardingFlow() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardTab, setDashboardTab] = useState("dashboard")

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // Show splash for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full animate-pulse" viewBox="0 0 200 240" fill="none">
              {/* Medieval shield outline */}
              <path
                d="M100 20 L160 35 Q175 45 175 65 L175 140 Q175 160 165 175 L100 220 L35 175 Q25 160 25 140 L25 65 Q25 45 40 35 L100 20 Z"
                fill="#f8f6f0"
                stroke="#2c3e50"
                strokeWidth="4"
              />

              {/* Gut/digestive system clipart */}
              <g transform="translate(100, 90)">
                {/* Stomach */}
                <ellipse cx="-15" cy="-20" rx="18" ry="25" fill="#e67e22" stroke="#2c3e50" strokeWidth="2" />

                {/* Small intestine coils */}
                <circle cx="-25" cy="10" r="8" fill="#d35400" stroke="#2c3e50" strokeWidth="1.5" />
                <circle cx="-10" cy="15" r="7" fill="#d35400" stroke="#2c3e50" strokeWidth="1.5" />
                <circle cx="5" cy="10" r="8" fill="#d35400" stroke="#2c3e50" strokeWidth="1.5" />
                <circle cx="20" cy="5" r="6" fill="#d35400" stroke="#2c3e50" strokeWidth="1.5" />

                {/* Large intestine frame */}
                <path
                  d="M -35 25 L 30 25 Q 35 25 35 30 L 35 45 Q 35 50 30 50 L -30 50 Q -35 50 -35 45 L -35 30 Q -35 25 -30 25"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>

              {/* Green medical cross on the side */}
              <g transform="translate(155, 50)">
                <circle cx="12" cy="12" r="15" fill="#27ae60" stroke="#2c3e50" strokeWidth="2" />
                <rect x="8" y="4" width="8" height="16" fill="white" rx="1" />
                <rect x="4" y="8" width="16" height="8" fill="white" rx="1" />
              </g>
            </svg>
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

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto flex flex-col h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <path
                  d="M100 15 L170 35 Q180 45 180 65 Q180 120 100 185 Q20 120 20 65 Q20 45 30 35 L100 15 Z"
                  fill="#f5f5dc"
                  stroke="#1e3a5f"
                  strokeWidth="6"
                />

                <g transform="translate(150, 30)">
                  <rect x="0" y="8" width="12" height="24" fill="#4ade80" stroke="#1e3a5f" strokeWidth="2" rx="3" />
                  <rect x="-6" y="14" width="24" height="12" fill="#4ade80" stroke="#1e3a5f" strokeWidth="2" rx="3" />
                </g>

                <path
                  d="M75 55 Q85 50 95 55 Q105 60 110 70 Q115 80 110 90 Q105 100 95 95 Q85 90 80 80 Q75 70 75 55 Z"
                  fill="#cd7c5c"
                  stroke="#1e3a5f"
                  strokeWidth="3"
                />
                <circle cx="90" cy="75" r="2.5" fill="#1e3a5f" />

                <path
                  d="M95 95 Q80 105 85 115 Q90 125 100 120 Q110 115 105 125 Q100 135 90 130 Q80 125 85 135 Q90 145 100 140 Q110 135 105 145 Q100 155 95 150"
                  fill="none"
                  stroke="#cd7c5c"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <path
                  d="M65 105 Q55 110 60 120 Q65 130 75 125 L125 125 Q135 130 140 120 Q145 110 135 105 L135 145 Q140 155 130 160 L70 160 Q60 155 65 145 Z"
                  fill="none"
                  stroke="#cd7c5c"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M70 125 Q75 120 80 125 M90 125 Q95 120 100 125 M110 125 Q115 120 120 125"
                  stroke="#cd7c5c"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
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

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 2 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-balance">Tell us about yourself</h1>

            {/* Age input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Age</label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>

            {/* Gender selection */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["Male", "Female", "Intersex", "Prefer not to say"].map((gender) => (
                  <Button
                    key={gender}
                    variant={formData.gender === gender ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFormData("gender", gender)}
                    className={`rounded-full ${
                      formData.gender === gender
                        ? "bg-white text-black"
                        : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>

            {/* Height input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Height (cm)</label>
              <Input
                type="number"
                placeholder="Enter your height"
                value={formData.height}
                onChange={(e) => updateFormData("height", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>

            {/* Weight input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Weight (kg)</label>
              <Input
                type="number"
                placeholder="Enter your weight"
                value={formData.weight}
                onChange={(e) => updateFormData("weight", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>

            {/* BMI display */}
            {calculateBMI() && (
              <div className="bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">BMI</span>
                  <span className="text-lg font-medium">{calculateBMI()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Category</span>
                  <span className={`text-sm font-medium ${getBMICategory(calculateBMI()).color}`}>
                    {getBMICategory(calculateBMI()).category}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    const conditions = [
      "Colon polyps (parent/sibling/child)",
      "Colon cancer (parent/sibling/child)",
      "Stomach cancer (parent/sibling/child)",
      "None/Not sure",
    ]

    const handleConditionChange = (condition: string, checked: boolean) => {
      const currentConditions = formData.familyHistory
      if (checked) {
        updateFormData("familyHistory", [...currentConditions, condition])
      } else {
        updateFormData(
          "familyHistory",
          currentConditions.filter((c) => c !== condition),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Family History</h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-2">Step 3/10</div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: "30%" }} />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-medium text-balance">
                Do you have a family history of colon or stomach issues?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                This information helps us understand your risk factors and provide personalized guidance.
              </p>
            </div>

            {/* Condition checkboxes */}
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-3">
                  <Checkbox
                    id={condition}
                    checked={formData.familyHistory.includes(condition)}
                    onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                  />
                  <label htmlFor={condition} className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                    {condition}
                  </label>
                </div>
              ))}
            </div>

            {/* Age at diagnosis input */}
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Age at diagnosis (optional)"
                value={formData.diagnosisAge}
                onChange={(e) => updateFormData("diagnosisAge", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 3) {
    const symptoms = [
      "Blood in stool",
      "Black/tarry stool",
      "Persistent change >4 weeks",
      "Unintentional weight loss",
      "Persistent left-lower (sigmoid) pain >4 weeks",
      "Diagnosed anemia",
      "Fever",
      "None",
    ]

    const handleSymptomChange = (symptom: string, checked: boolean) => {
      const currentSymptoms = formData.redFlagSymptoms
      if (checked) {
        updateFormData("redFlagSymptoms", [...currentSymptoms, symptom])
      } else {
        updateFormData(
          "redFlagSymptoms",
          currentSymptoms.filter((s) => s !== symptom),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-2">Step 4/10</div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-balance leading-tight">
                Do any of these red flag symptoms apply to you?
              </h2>
            </div>

            {/* Instruction text */}
            <p className="text-sm text-gray-400">Select all that apply. If none, select 'None'.</p>

            {/* Symptom checkboxes */}
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-3">
                  <Checkbox
                    id={symptom}
                    checked={formData.redFlagSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                  />
                  <label htmlFor={symptom} className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 4) {
    const symptoms = [
      "Persistent upper-abdominal pain >4 weeks",
      "Persistent vomiting",
      "Early fullness",
      "Painful/difficult swallowing",
      "Black/tarry stool",
      "Diagnosed anemia",
      "Unexplained fatigue or weakness",
      "Loss of appetite",
      "Feeling full after eating small amounts",
      "Persistent heartburn or indigestion",
      "Abdominal bloating or swelling",
      "Changes in bowel habits lasting >2 weeks",
      "Narrow or ribbon-like stools",
      "Persistent cramping or gas pain",
      "Jaundice (yellowing of skin/eyes)",
      "Persistent nausea",
      "None",
    ]

    const handleSymptomChange = (symptom: string, checked: boolean) => {
      const currentSymptoms = formData.redFlagSymptoms2
      if (checked) {
        updateFormData("redFlagSymptoms2", [...currentSymptoms, symptom])
      } else {
        updateFormData(
          "redFlagSymptoms2",
          currentSymptoms.filter((s) => s !== symptom),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-sm text-gray-400">5/10</div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-balance leading-tight">
                Do any of these red flag symptoms apply to you?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                These symptoms may indicate a more serious condition. If you experience any of these, please consult a
                healthcare professional.
              </p>
            </div>

            {/* Symptom checkboxes */}
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-3">
                  <Checkbox
                    id={symptom}
                    checked={formData.redFlagSymptoms2.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                  />
                  <label htmlFor={symptom} className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 5) {
    const symptoms = [
      "Diarrhea",
      "Constipation",
      "Bloating/Gas",
      "Nausea",
      "Left-Lower Abdominal Pain",
      "Stomach Pain",
      "Heartburn",
      "Loss of Appetite",
      "Fatigue",
      "Cramping",
      "Acid Reflux",
      "Indigestion",
      "Vomiting",
      "Headache",
      "None",
    ]

    const handleSymptomChange = (symptom: string, checked: boolean) => {
      const currentSymptoms = formData.dailySymptoms
      if (checked) {
        updateFormData("dailySymptoms", [...currentSymptoms, symptom])
      } else {
        updateFormData(
          "dailySymptoms",
          currentSymptoms.filter((s) => s !== symptom),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Log Today's Symptoms</h1>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 5 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <h2 className="text-2xl font-medium text-balance">How are you feeling today?</h2>

            {/* Symptom buttons */}
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant={formData.dailySymptoms.includes(symptom) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSymptomChange(symptom, !formData.dailySymptoms.includes(symptom))}
                  className={`rounded-full text-sm ${
                    formData.dailySymptoms.includes(symptom)
                      ? "bg-white text-black"
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {symptom}
                </Button>
              ))}
            </div>

            {/* Pain Level Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Pain Level (0-10)</label>
                <span className="text-lg font-medium">{formData.painLevel[0]}</span>
              </div>
              <Slider
                value={formData.painLevel}
                onValueChange={(value) => updateFormData("painLevel", value)}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Notes textarea */}
            <div className="space-y-2">
              <Textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 6) {
    const stoolTypes = [
      {
        type: "Type 1",
        description: "Separate hard lumps, like nuts (hard to pass)",
      },
      {
        type: "Type 2",
        description: "Sausage-shaped but lumpy",
      },
      {
        type: "Type 3",
        description: "Like a sausage but with cracks on surface",
      },
      {
        type: "Type 4",
        description: "Like a sausage or snake, smooth and soft",
      },
      {
        type: "Type 5",
        description: "Soft blobs with clear-cut edges",
      },
      {
        type: "Type 6",
        description: "Fluffy pieces with ragged edges, mushy",
      },
      {
        type: "Type 7",
        description: "Watery, no solid pieces, entirely liquid",
      },
    ]

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Stool Pattern</h1>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 6 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-balance leading-tight">
                Describe your stool pattern over the last 7 days
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select the Bristol scale that best represents your stool pattern over the last 7 days:
              </p>
            </div>

            <div className="space-y-3">
              {stoolTypes.map((item) => (
                <div key={item.type} className="space-y-2">
                  <Button
                    variant={formData.stoolType === item.type ? "default" : "outline"}
                    onClick={() => updateFormData("stoolType", item.type)}
                    className={`w-full justify-start h-12 rounded-xl ${
                      formData.stoolType === item.type
                        ? "bg-white text-black"
                        : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {item.type}
                  </Button>
                  {formData.stoolType === item.type && (
                    <div className="bg-gray-800 rounded-lg p-3 ml-4">
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Pencil-thin (any day?)</label>
                <Switch
                  checked={formData.pencilThin}
                  onCheckedChange={(checked) => updateFormData("pencilThin", checked)}
                  className={`${
                    formData.pencilThin ? "data-[state=checked]:bg-red-500" : "data-[state=unchecked]:bg-gray-600"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Mucus?</label>
                <Switch
                  checked={formData.mucus}
                  onCheckedChange={(checked) => updateFormData("mucus", checked)}
                  className={`${
                    formData.mucus ? "data-[state=checked]:bg-red-500" : "data-[state=unchecked]:bg-gray-600"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Visible blood?</label>
                <Switch
                  checked={formData.visibleBlood}
                  onCheckedChange={(checked) => updateFormData("visibleBlood", checked)}
                  className={`${
                    formData.visibleBlood ? "data-[state=checked]:bg-red-500" : "data-[state=unchecked]:bg-gray-600"
                  }`}
                />
              </div>
            </div>

            {/* Optional photo upload section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Optional</h3>

              <Button
                variant="outline"
                className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-12 rounded-xl flex items-center justify-between"
              >
                <span>Upload a photo</span>
                <Camera className="h-5 w-5" />
              </Button>

              <p className="text-xs text-gray-500 leading-relaxed">
                Your photos are private and will not be shared without your consent.
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 7) {
    const diagnoses = [
      "IBS",
      "IBD (Crohn's/UC)",
      "Diverticulitis",
      "GERD/Ulcer",
      "H. pylori",
      "Colon polyps",
      "Celiac disease",
      "None",
    ]

    const handleDiagnosisChange = (diagnosis: string, checked: boolean) => {
      const currentDiagnoses = formData.priorDiagnoses
      if (checked) {
        updateFormData("priorDiagnoses", [...currentDiagnoses, diagnosis])
      } else {
        updateFormData(
          "priorDiagnoses",
          currentDiagnoses.filter((d) => d !== diagnosis),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Prior Diagnoses</h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-2">Step 8/10</div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-balance leading-tight">
                Have you been diagnosed with any of the following?
              </h2>
            </div>

            {/* Diagnosis buttons */}
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis) => (
                <Button
                  key={diagnosis}
                  variant={formData.priorDiagnoses.includes(diagnosis) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDiagnosisChange(diagnosis, !formData.priorDiagnoses.includes(diagnosis))}
                  className={`rounded-full text-sm ${
                    formData.priorDiagnoses.includes(diagnosis)
                      ? "bg-white text-black"
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {diagnosis}
                </Button>
              ))}
            </div>

            {/* Last Colonoscopy/Endoscopy section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Last Colonoscopy/Endoscopy</h3>

              <div className="relative">
                <Input
                  type="date"
                  placeholder="Select Date"
                  value={formData.lastColonoscopyDate}
                  onChange={(e) => updateFormData("lastColonoscopyDate", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 pr-12"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 8) {
    const medications = [
      "NSAIDs",
      "PPI/acid reducer",
      "Antibiotics",
      "Iron",
      "Metformin",
      "Laxatives",
      "Anti-diarrheals",
      "Fiber supplements (psyllium)",
      "None",
    ]

    const handleMedicationChange = (medication: string, checked: boolean) => {
      const currentMedications = formData.medications
      if (checked) {
        updateFormData("medications", [...currentMedications, medication])
      } else {
        updateFormData(
          "medications",
          currentMedications.filter((m) => m !== medication),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header with back arrow and Next */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              className="text-white hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Medications</h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-2">Step 9/10</div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: "90%" }} />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-balance leading-tight">
                Are you currently taking any medications?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                This includes prescription and over-the-counter drugs, as well as recent antibiotics (past 2 months).
              </p>
            </div>

            {/* Medication buttons */}
            <div className="flex flex-wrap gap-2">
              {medications.map((medication) => (
                <Button
                  key={medication}
                  variant={formData.medications.includes(medication) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMedicationChange(medication, !formData.medications.includes(medication))}
                  className={`rounded-full text-sm ${
                    formData.medications.includes(medication)
                      ? "bg-white text-black"
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {medication}
                </Button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 9) {
    const triggers = [
      "Onions/garlic",
      "Wheat breads/noodles",
      "Beans/legumes",
      "Milk/ice cream",
      "Very spicy",
      "Fried/fatty/gata",
      "Coffee",
      "Alcohol",
      "Soda",
      "Sugar-free sweeteners (sorbitol/xylitol)",
      "Not sure",
    ]

    const handleTriggerChange = (trigger: string, checked: boolean) => {
      const currentTriggers = formData.triggers
      if (checked) {
        updateFormData("triggers", [...currentTriggers, trigger])
      } else {
        updateFormData(
          "triggers",
          currentTriggers.filter((t) => t !== trigger),
        )
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 9 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-balance leading-tight">What are your triggers?</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select all that apply. This helps us personalize your experience.
              </p>
            </div>

            {/* Trigger buttons */}
            <div className="flex flex-wrap gap-2">
              {triggers.map((trigger) => (
                <Button
                  key={trigger}
                  variant={formData.triggers.includes(trigger) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTriggerChange(trigger, !formData.triggers.includes(trigger))}
                  className={`rounded-full text-sm ${
                    formData.triggers.includes(trigger)
                      ? "bg-white text-black"
                      : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {trigger}
                </Button>
              ))}
            </div>

            {/* Lifestyle section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Lifestyle</h3>

              {/* Exercise Yes/No */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={formData.exercise === "Yes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFormData("exercise", "Yes")}
                    className={`rounded-full ${
                      formData.exercise === "Yes"
                        ? "bg-white text-black"
                        : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={formData.exercise === "No" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFormData("exercise", "No")}
                    className={`rounded-full ${
                      formData.exercise === "No"
                        ? "bg-white text-black"
                        : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  {["Low", "Moderate", "High"].map((level) => (
                    <Button
                      key={level}
                      variant={formData.activityLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData("activityLevel", level)}
                      className={`rounded-full ${
                        formData.activityLevel === level
                          ? "bg-white text-black"
                          : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Sleep (hrs)"
                  value={formData.sleepHours}
                  onChange={(e) => updateFormData("sleepHours", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12"
                />
              </div>

              {/* Stress Level Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-400">Stress (0-10)</label>
                  <span className="text-lg font-medium">{formData.stressLevel[0]}</span>
                </div>
                <Slider
                  value={formData.stressLevel}
                  onValueChange={(value) => updateFormData("stressLevel", value)}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <Button
              onClick={nextStep}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium h-12 rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 10) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={prevStep} className="text-white hover:bg-gray-800 p-2">
              ✕
            </Button>
            <h1 className="text-lg font-medium">GutGuard Pro</h1>
            <div></div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium mb-2">Start 7-day free trial</h2>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Advice</span>
              <span className="text-xs text-gray-400">3/week</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Risk Trend Charts</span>
              <span className="text-xs text-green-400">Unlimited</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Food Scan AI</span>
              <span className="text-xs text-red-400">Not Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Custom Meal Plans</span>
              <span className="text-xs text-green-400">Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily Guidance & Long-term Care</span>
              <span className="text-xs text-green-400">Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Reminders</span>
              <span className="text-xs text-red-400">Not Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">PDF Export</span>
              <span className="text-xs text-green-400">Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Stool Log</span>
              <span className="text-xs text-green-400">Available</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium">Pricing</h3>

            {/* Monthly Plan */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Monthly</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold">
                  $14.99<span className="text-sm font-normal text-gray-400">/mo</span>
                </span>
              </div>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Select</Button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 relative">
              <div className="absolute -top-2 right-4">
                <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full font-medium">Save $50</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Yearly</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold">
                  $129.99<span className="text-sm font-normal text-gray-400">/yr</span>
                </span>
              </div>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Select</Button>
            </div>
          </div>

          {/* Restore Link */}
          <div className="text-center mb-6">
            <button className="text-sm text-gray-400 hover:text-white">
              Already have a subscription? <span className="underline">Restore</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-medium"
              onClick={startDashboard}
            >
              Start Free Trial
            </Button>
            <Button
              variant="ghost"
              className="w-full text-white hover:bg-gray-800 h-12"
              onClick={() => alert("Continuing with free version")}
            >
              Continue Free
            </Button>
          </div>

          {/* Fine Print */}
          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            You will be charged after the free trial ends. Cancel anytime in settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl mb-4">Step {currentStep} - Coming Soon</h2>
        <Button onClick={prevStep} variant="outline" className="border-gray-600 text-white bg-transparent">
          Go Back
        </Button>
      </div>
    </div>
  )
}

function DashboardScreen() {
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
                <button className="text-gray-600 text-xs underline hover:text-gray-800">Why?</button>
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
              <div key={index} className={`${action.bg} p-4 rounded-xl flex flex-col justify-between h-24`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900 font-medium text-sm">{action.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">{action.subtitle}</p>
                  </div>
                  {action.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScanScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Scan</h1>
      </div>

      {/* Camera Interface */}
      <div className="flex justify-center gap-6 mb-12">
        <Button variant="ghost" size="lg" className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
            <path
              fill="currentColor"
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
        </Button>
        <Button variant="ghost" size="lg" className="w-20 h-20 rounded-full bg-white hover:bg-gray-100">
          <Camera className="h-8 w-8 text-black" />
        </Button>
        <Button variant="ghost" size="lg" className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        </Button>
      </div>

      {/* Food Result */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Food Result</h2>
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍞</span>
            </div>
            <div>
              <h3 className="font-medium">Gluten-Free Bread</h3>
              <p className="text-sm text-gray-400">Confidence: 95%</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-400">Great now</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-green-400">
                <path
                  fill="currentColor"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mt-2">This food is suitable for your current symptoms. Enjoy!</p>
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
    </div>
  )
}

function LogScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-medium">Log</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <Calendar className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-8">
        {/* Stool Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Stool</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Bristol Stool Chart</span>
                <span className="font-medium">Type 3</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Color</span>
                <span className="font-medium">Brown</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Blood</span>
                <Switch className="data-[state=checked]:bg-red-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mucus</span>
                <Switch className="data-[state=checked]:bg-red-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Undigested Food</span>
                <Switch className="data-[state=checked]:bg-red-500" />
              </div>
            </div>

            <Button variant="outline" className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <Camera className="h-4 w-4 mr-2" />
              Photo
            </Button>

            <Textarea
              placeholder="Notes"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Symptoms Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {["Abdominal Pain", "Bloating", "Gas", "Nausea", "Fatigue"].map((symptom) => (
              <Button
                key={symptom}
                variant="outline"
                size="sm"
                className="rounded-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>

        {/* Trends Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Trends</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Stool Consistency</span>
                <span className="font-bold text-2xl">3</span>
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
                <span className="font-bold text-2xl">2</span>
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
          </div>
        </div>
      </div>
    </div>
  )
}

function AdviceScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">AI Coach</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
          <span className="text-lg">⚙️</span>
        </Button>
      </div>

      <div className="space-y-8">
        {/* AI Assistant */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">GutGuard AI</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Hi there! I'm here to help you understand your gut health better. What can I assist you with today?
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Flare plan (24-48 h)", bg: "bg-red-100" },
            { title: "Gentle 7-day plan", bg: "bg-blue-100" },
            { title: "Trigger hunt", bg: "bg-yellow-100" },
            { title: "Doctor checklist", bg: "bg-green-100" },
          ].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`${action.bg} border-gray-600 text-gray-900 hover:bg-opacity-80 h-16 rounded-xl`}
            >
              {action.title}
            </Button>
          ))}
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

      <div className="space-y-8">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
                <path
                  fill="currentColor"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Profile & Health</h3>
              <p className="text-sm text-gray-400">Edit your profile and health information</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
              <path
                fill="currentColor"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              />
            </svg>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-gray-400">English</p>
              </div>
              <span className="text-gray-400">EN</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-400">Hydration, Daily Check, Stool Log</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Data Export</h3>
                <p className="text-sm text-gray-400">Export your data in JSON or PDF format</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-gray-400">Light</p>
              </div>
              <span className="text-gray-400">Light</span>
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Legal</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Full Disclaimer</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Privacy Policy</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Other Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Other</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Reset Onboarding</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Manage Subscription</span>
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-400">
                <path
                  fill="currentColor"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
