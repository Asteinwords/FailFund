"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import StartupCard from "@/components/startup-card"

export default function Home() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/startups")
        if (!res.ok) throw new Error("Failed to fetch startups")
        const data = await res.json()
        setStartups(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  return (
    <main>
      <HeroSection />
      <StatsSection />

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Startups</h2>

        {loading && <p>Loading startups...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup: any) => (
              <StartupCard
                key={startup._id}
                id={startup._id}
                title={startup.title}
                description={startup.description}
                founder={{
                  name: startup.founder?.name || "Unknown Founder",
                  avatar: startup.founder?.avatar,
                }}
                revivalScore={startup.revivalScore || 0}
                techStack={startup.techStack || []}
                category={startup.category || "General"}
                image={startup.images?.[0] || "/placeholder.svg"}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}