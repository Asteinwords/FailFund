"use client"

import { useState, useEffect } from "react"
import DiscoveryCard from "@/components/discovery-card"
import StartupCard from "@/components/startup-card"

interface Startup {
  _id: string
  title: string
  description: string
  founder: {
    name: string
    avatar?: string
  }
  revivalScore: number
  techStack: string[]
  category: string
  image?: string
}

export default function DiscoverPage() {
  const [highScoreStartups, setHighScoreStartups] = useState<Startup[]>([])
  const [trendingStartups, setTrendingStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/startups")
        if (!response.ok) throw new Error("Failed to fetch startups")
        const data = await response.json()

        const sorted = [...data].sort((a, b) => b.revivalScore - a.revivalScore)
        setHighScoreStartups(sorted.slice(0, 3))

        const trending = [...data].sort((a, b) => (b.views || 0) - (a.views || 0))
        setTrendingStartups(trending.slice(0, 3))
      } catch (error) {
        console.error("Error fetching startups:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  const discoveryCategories = [
    {
      title: "High Potential",
      description: "Projects with the highest revival scores",
      icon: "🚀",
      link: "/browse?sort=highest-score",
    },
    {
      title: "Most Viewed",
      description: "Startups getting the most attention",
      icon: "👀",
      link: "/browse?sort=most-viewed",
    },
    {
      title: "Recently Added",
      description: "Latest projects added to the platform",
      icon: "✨",
      link: "/browse?sort=newest",
    },
    {
      title: "Tech Stack",
      description: "Find projects by technology",
      icon: "⚙️",
      link: "/browse",
    },
  ]

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading discoveries...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Discover Your Next Project</h1>
        <p className="text-lg text-foreground">Explore curated collections of failed startups ready for revival</p>
      </div>

      {/* Discovery Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {discoveryCategories.map((category) => (
            <DiscoveryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* High Potential Startups */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">High Potential Projects</h2>
        <p className="text-foreground mb-6">
          These projects have the highest revival potential based on their tech, market fit, and execution quality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highScoreStartups.map((startup) => (
            <StartupCard key={startup._id} id={startup._id} {...startup} />
          ))}
        </div>
      </section>

      {/* Trending Startups */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <p className="text-foreground mb-6">Projects getting the most attention from the FailFund community.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingStartups.map((startup) => (
            <StartupCard key={startup._id} id={startup._id} {...startup} />
          ))}
        </div>
      </section>
    </main>
  )
}
