"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import StartupCard from "@/components/startup-card"

interface UserProfile {
  name: string
  bio: string
  avatar?: string
  role: string
  startups: any[]
  totalViews: number
  averageRevivalScore: number
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mock data - in production, fetch from API
        setProfile({
          name: "Alex Chen",
          bio: "Founder and entrepreneur passionate about reviving failed startups",
          role: "both",
          startups: [
            {
              _id: "1",
              title: "SocialFlow Analytics",
              description: "Real-time social media analytics",
              revivalScore: 78,
              techStack: ["React", "Node.js"],
              category: "Analytics",
            },
          ],
          totalViews: 1200,
          averageRevivalScore: 78,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <p className="text-center text-foreground">Profile not found</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white border border-border rounded-lg p-8 mb-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">{profile.name}</h1>
            <p className="text-foreground mb-4">{profile.bio}</p>
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-foreground">Total Views</p>
                <p className="text-2xl font-bold text-primary">{profile.totalViews}</p>
              </div>
              <div>
                <p className="text-sm text-foreground">Avg Revival Score</p>
                <p className="text-2xl font-bold text-primary">{profile.averageRevivalScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-neutral-dark">Startups by {profile.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.startups.map((startup) => (
            <StartupCard key={startup._id} id={startup._id} {...startup} founder={{ name: profile.name }} />
          ))}
        </div>
      </div>
    </main>
  )
}
