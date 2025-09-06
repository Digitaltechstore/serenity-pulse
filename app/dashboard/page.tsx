"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, TrendingUp, LogOut, Camera, MessageCircle, FileText, Settings, Home } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/splash-screen")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-20">
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
