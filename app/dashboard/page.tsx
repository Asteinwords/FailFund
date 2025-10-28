"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

interface Startup {
  _id: string
  title: string
  description: string
  status: string
  revivalScore: number
  views: number
  createdAt: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [userStartups, setUserStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStartups: 0,
    totalViews: 0,
    activeCollaborations: 0,
    averageRevivalScore: 0,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock data - in production, fetch from API
        const mockStartups: Startup[] = [
          {
            _id: "1",
            title: "SocialFlow Analytics",
            description: "Real-time social media analytics",
            status: "available",
            revivalScore: 78,
            views: 234,
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            title: "FitTrack AI",
            description: "AI-powered fitness coaching",
            status: "in-collaboration",
            revivalScore: 85,
            views: 456,
            createdAt: new Date().toISOString(),
          },
        ]

        setUserStartups(mockStartups)
        setStats({
          totalStartups: mockStartups.length,
          totalViews: mockStartups.reduce((sum, s) => sum + s.views, 0),
          activeCollaborations: mockStartups.filter((s) => s.status === "in-collaboration").length,
          averageRevivalScore: Math.round(
            mockStartups.reduce((sum, s) => sum + s.revivalScore, 0) / mockStartups.length,
          ),
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground">Loading dashboard...</p>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-neutral-dark mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-foreground">Manage your startups and collaborations</p>
          </div>
          <Link
            href="/upload"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            List New Startup
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-foreground mb-2">Total Startups</p>
            <p className="text-3xl font-bold text-primary">{stats.totalStartups}</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-foreground mb-2">Total Views</p>
            <p className="text-3xl font-bold text-primary">{stats.totalViews}</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-foreground mb-2">Active Collaborations</p>
            <p className="text-3xl font-bold text-primary">{stats.activeCollaborations}</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-foreground mb-2">Avg Revival Score</p>
            <p className="text-3xl font-bold text-primary">{stats.averageRevivalScore}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-border rounded-lg">
          <div className="flex border-b border-border">
            {["overview", "startups", "collaborations", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab ? "text-primary border-b-2 border-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Overview</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-light rounded-lg">
                    <h3 className="font-semibold text-neutral-dark mb-2">Your Profile</h3>
                    <p className="text-foreground mb-2">Email: {user?.email}</p>
                    <p className="text-foreground mb-2">Role: {user?.role}</p>
                    <Link
                      href="#profile"
                      onClick={() => setActiveTab("profile")}
                      className="text-primary hover:text-primary-light"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "startups" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Your Startups</h2>
                {userStartups.length > 0 ? (
                  <div className="space-y-4">
                    {userStartups.map((startup) => (
                      <div
                        key={startup._id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-dark">{startup.title}</h3>
                            <p className="text-sm text-foreground">{startup.description}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              startup.status === "available"
                                ? "bg-green-100 text-green-700"
                                : startup.status === "in-collaboration"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {startup.status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-foreground mb-3">
                          <span>Views: {startup.views}</span>
                          <span>Revival Score: {startup.revivalScore}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/startup/${startup._id}`}
                            className="text-primary hover:text-primary-light font-medium"
                          >
                            View
                          </Link>
                          <button className="text-primary hover:text-primary-light font-medium">Edit</button>
                          <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-foreground mb-4">You haven't listed any startups yet.</p>
                    <Link href="/upload" className="text-primary hover:text-primary-light font-semibold">
                      List your first startup
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "collaborations" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Collaborations & Offers</h2>
                <div className="text-center py-8">
                  <p className="text-foreground mb-4">No active collaborations or offers yet.</p>
                  <Link href="/browse" className="text-primary hover:text-primary-light font-semibold">
                    Browse startups to collaborate
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Edit Profile</h2>
                <form className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-neutral-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
