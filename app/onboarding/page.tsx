"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Step 0: Welcome
    agreedToTerms: false,
    // Step 1: Tell us about yourself
    age: "",
    height: "",
    weight: "",
    gender: "",
    // Step 2: Family History
    familyHistory: [] as string[],
    // Step 3 & 4: Red Flag Symptoms
    redFlagSymptoms1: [] as string[],
    redFlagSymptoms2: [] as string[],
    // Step 5: Daily Symptoms
    dailySymptoms: [] as string[],
    // Step 6: Stool Pattern
    stoolTypes: [] as number[],
    stoolNotes: "",
    // Step 7: Prior Diagnoses
    priorDiagnoses: [] as string[],
    // Step 8: Medications
    medications: [] as string[],
    // Step 9: Triggers
    triggers: [] as string[],
  })

  const calculateBMI = () => {
    const heightM = Number.parseFloat(formData.height) / 100
    const weightKg = Number.parseFloat(formData.weight)
    if (heightM && weightKg) {
      const bmi = weightKg / (heightM * heightM)
      let category = ""
      if (bmi < 18.5) category = "Underweight"
      else if (bmi < 25) category = "Normal"
      else if (bmi < 30) category = "Overweight"
      else category = "Obese"
      return { value: bmi.toFixed(1), category }
    }
    return null
  }

  const nextStep = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/paywall")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCheckboxChange = (value: string, field: keyof typeof formData) => {
    const currentArray = formData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    setFormData({ ...formData, [field]: newArray })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
              alt="GutGuard Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-3xl font-bold text-gray-800">Welcome to GutGuard</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Your personalized digestive health companion. Let's get started with a few questions to understand your
              health better.
            </p>
            <div className="flex items-center space-x-2 justify-center">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {formData.agreedToTerms && (
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Continue
              </Button>
            )}
          </div>
        )

      case 1:
        const bmi = calculateBMI()
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Tell us about yourself</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="Enter height in cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="Enter weight in kg"
                />
              </div>
            </div>
            {bmi && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">BMI Calculation</h3>
                <p className="text-blue-700">
                  BMI: {bmi.value} ({bmi.category})
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )

      case 2:
        const familyHistoryOptions = [
          "Colorectal cancer",
          "Inflammatory bowel disease",
          "Celiac disease",
          "Irritable bowel syndrome",
          "Gastric cancer",
          "Liver disease",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Family History</h2>
            <p className="text-center text-gray-600">Select any conditions that run in your family:</p>
            <div className="grid grid-cols-1 gap-3">
              {familyHistoryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.familyHistory.includes(option)}
                    onCheckedChange={() => handleCheckboxChange(option, "familyHistory")}
                  />
                  <label htmlFor={option} className="text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )

      case 3:
        const redFlagSymptoms1 = [
          "Blood in stool",
          "Black tarry stools",
          "Severe abdominal pain",
          "Unexplained weight loss",
          "Persistent vomiting",
          "Difficulty swallowing",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Red Flag Symptoms (Part 1)</h2>
            <p className="text-center text-gray-600">Have you experienced any of these symptoms?</p>
            <div className="grid grid-cols-1 gap-3">
              {redFlagSymptoms1.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={formData.redFlagSymptoms1.includes(symptom)}
                    onCheckedChange={() => handleCheckboxChange(symptom, "redFlagSymptoms1")}
                  />
                  <label htmlFor={symptom} className="text-sm">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <div></div>
            </div>
          </div>
        )

      case 4:
        const redFlagSymptoms2 = [
          "Persistent fever",
          "Night sweats",
          "Severe fatigue",
          "Persistent nausea",
          "Severe constipation",
          "Severe diarrhea",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Red Flag Symptoms (Part 2)</h2>
            <p className="text-center text-gray-600">Any additional concerning symptoms?</p>
            <div className="grid grid-cols-1 gap-3">
              {redFlagSymptoms2.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={formData.redFlagSymptoms2.includes(symptom)}
                    onCheckedChange={() => handleCheckboxChange(symptom, "redFlagSymptoms2")}
                  />
                  <label htmlFor={symptom} className="text-sm">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <div></div>
            </div>
          </div>
        )

      case 5:
        const dailySymptoms = [
          "Bloating",
          "Gas",
          "Stomach pain",
          "Heartburn",
          "Nausea",
          "Constipation",
          "Diarrhea",
          "Cramping",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Log Today's Symptoms</h2>
            <p className="text-center text-gray-600">What symptoms are you experiencing today?</p>
            <div className="grid grid-cols-1 gap-3">
              {dailySymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={formData.dailySymptoms.includes(symptom)}
                    onCheckedChange={() => handleCheckboxChange(symptom, "dailySymptoms")}
                  />
                  <label htmlFor={symptom} className="text-sm">
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )

      case 6:
        const bristolTypes = [
          { type: 1, description: "Separate hard lumps (severe constipation)" },
          { type: 2, description: "Lumpy and sausage-like (mild constipation)" },
          { type: 3, description: "Sausage with cracks (normal)" },
          { type: 4, description: "Smooth, soft sausage (normal)" },
          { type: 5, description: "Soft blobs with clear edges (lacking fiber)" },
          { type: 6, description: "Mushy with ragged edges (mild diarrhea)" },
          { type: 7, description: "Liquid consistency (severe diarrhea)" },
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Stool Pattern</h2>
            <p className="text-center text-gray-600">Select the types that best describe your recent stool pattern:</p>
            <div className="space-y-3">
              {bristolTypes.map((bristol) => (
                <div key={bristol.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Switch
                    checked={formData.stoolTypes.includes(bristol.type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          stoolTypes: [...formData.stoolTypes, bristol.type],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          stoolTypes: formData.stoolTypes.filter((t) => t !== bristol.type),
                        })
                      }
                    }}
                    className={formData.stoolTypes.includes(bristol.type) ? "bg-red-500" : ""}
                  />
                  <div>
                    <span className="font-semibold">Type {bristol.type}:</span>
                    <span className="ml-2 text-sm text-gray-600">{bristol.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <Textarea
                value={formData.stoolNotes}
                onChange={(e) => setFormData({ ...formData, stoolNotes: e.target.value })}
                placeholder="Any additional details about your stool pattern..."
                rows={3}
              />
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 w-full mt-4">
                Next
              </Button>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <div></div>
            </div>
          </div>
        )

      case 7:
        const diagnoses = [
          "IBS",
          "IBD",
          "Crohn's Disease",
          "Ulcerative Colitis",
          "Celiac Disease",
          "GERD",
          "Gastroparesis",
          "Diverticulitis",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Prior Diagnoses</h2>
            <p className="text-center text-gray-600">Have you been diagnosed with any of these conditions?</p>
            <div className="grid grid-cols-1 gap-3">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis} className="flex items-center space-x-2">
                  <Checkbox
                    id={diagnosis}
                    checked={formData.priorDiagnoses.includes(diagnosis)}
                    onCheckedChange={() => handleCheckboxChange(diagnosis, "priorDiagnoses")}
                  />
                  <label htmlFor={diagnosis} className="text-sm">
                    {diagnosis}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )

      case 8:
        const medications = [
          "Probiotics",
          "Antacids",
          "Proton pump inhibitors",
          "Antibiotics",
          "Anti-diarrheal",
          "Laxatives",
          "Anti-spasmodics",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Medications</h2>
            <p className="text-center text-gray-600">What medications or supplements are you currently taking?</p>
            <div className="grid grid-cols-1 gap-3">
              {medications.map((medication) => (
                <div key={medication} className="flex items-center space-x-2">
                  <Checkbox
                    id={medication}
                    checked={formData.medications.includes(medication)}
                    onCheckedChange={() => handleCheckboxChange(medication, "medications")}
                  />
                  <label htmlFor={medication} className="text-sm">
                    {medication}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )

      case 9:
        const triggers = [
          "Dairy products",
          "Gluten",
          "Spicy foods",
          "Fatty foods",
          "Caffeine",
          "Alcohol",
          "Artificial sweeteners",
          "High fiber foods",
          "Stress",
          "None",
        ]
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What are your triggers?</h2>
            <p className="text-center text-gray-600">What foods or situations seem to trigger your symptoms?</p>
            <div className="grid grid-cols-1 gap-3">
              {triggers.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-2">
                  <Checkbox
                    id={trigger}
                    checked={formData.triggers.includes(trigger)}
                    onCheckedChange={() => handleCheckboxChange(trigger, "triggers")}
                  />
                  <label htmlFor={trigger} className="text-sm">
                    {trigger}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                Complete Onboarding
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Step {currentStep + 1} of 10</span>
              <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
