"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

export default function PaywallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%204%2C%202025%2C%2004_52_24%20AM-ePXtGduF9ZYJmZoC4lFa2TwZ4yNFm4.png"
            alt="GutGuard Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Choose Your GutGuard Plan</h1>
          <p className="text-gray-600">Get personalized insights and take control of your digestive health</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-green-500 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">GutGuard Monthly Plan</h3>
              <div className="text-4xl font-bold text-green-600 mb-1">$14.99</div>
              <div className="text-gray-500">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Personalized health insights</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Daily symptom tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>AI-powered recommendations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Food trigger analysis</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Progress reports</span>
              </li>
            </ul>

            <div className="space-y-3">
              <a
                href="https://buy.stripe.com/4gM28s8ycc8R0uP092bbG0p"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                  Sign Up - Monthly Plan
                </Button>
              </a>
              <a href="/login" className="block">
                <Button variant="outline" className="w-full py-3 bg-transparent">
                  Login - Existing Users
                </Button>
              </a>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Best Value</span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">GutGuard Yearly Plan</h3>
              <div className="text-4xl font-bold text-green-600 mb-1">$149.99</div>
              <div className="text-gray-500">per year</div>
              <div className="text-sm text-green-600 font-semibold mt-1">Save $29.89!</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Everything in Monthly Plan</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Export health data</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>2 months free</span>
              </li>
            </ul>

            <div className="space-y-3">
              <a
                href="https://buy.stripe.com/7sY9AU15KdcVb9t9JCbbG0q"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                  Sign Up - Yearly Plan
                </Button>
              </a>
              <a href="/login" className="block">
                <Button variant="outline" className="w-full py-3 bg-transparent">
                  Login - Existing Users
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">30-day money-back guarantee • Cancel anytime • Secure payment</p>
        </div>
      </div>
    </div>
  )
}
