"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Startup {
  _id: string
  title: string
  description: string
  failureReason: string
  techStack: string[]
  repositoryUrl: string
  images: string[]
  founder: {
    _id: string
    name: string
    avatar?: string
    bio?: string
  }
  revivalScore: number
  status: string
  category: string
  tags: string[]
  views: number
  buyoutPrice?: number
  createdAt: string
}

export default function StartupDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/startups/${id}`)
        if (!response.ok) throw new Error("Failed to fetch startup")
        const data = await response.json()
        setStartup(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStartup()
  }, [id])

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading startup details...</p>
        </div>
      </main>
    )
  }

  if (error || !startup) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Startup not found"}</p>
          <Link href="/browse" className="text-primary hover:text-primary-light">
            Back to Browse
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <Link href="/browse" className="text-primary hover:text-primary-light mb-6 inline-block">
        ← Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {startup.images.length > 0 && (
            <div className="relative w-full h-96 bg-neutral-light rounded-lg overflow-hidden mb-8">
              <Image src={startup.images[0] || "/placeholder.svg"} alt={startup.title} fill className="object-cover" />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4 text-neutral-dark">{startup.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-accent-light text-neutral-dark rounded-full text-sm font-medium">
              {startup.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
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

          <div className="prose prose-sm max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-3 text-neutral-dark">About This Project</h2>
            <p className="text-foreground mb-6">{startup.description}</p>

            <h3 className="text-xl font-bold mb-3 text-neutral-dark">Why It Failed</h3>
            <p className="text-foreground mb-6">{startup.failureReason}</p>

            <h3 className="text-xl font-bold mb-3 text-neutral-dark">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {startup.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-neutral-light text-foreground rounded-lg text-sm">
                  {tech}
                </span>
              ))}
            </div>

            {startup.tags.length > 0 && (
              <>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {startup.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {startup.repositoryUrl && (
              <>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Repository</h3>
                <a
                  href={startup.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light break-all"
                >
                  {startup.repositoryUrl}
                </a>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-lg p-6 sticky top-20">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {startup.founder.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark">{startup.founder.name}</p>
                  <p className="text-sm text-foreground">Founder</p>
                </div>
              </div>
              {startup.founder.bio && <p className="text-sm text-foreground">{startup.founder.bio}</p>}
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <div className="mb-4">
                <p className="text-sm text-foreground mb-1">Revival Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-neutral-light rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${startup.revivalScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-primary">{startup.revivalScore}%</span>
                </div>
              </div>

              <p className="text-xs text-foreground">
                Views: <span className="font-semibold">{startup.views}</span>
              </p>
            </div>

            {startup.buyoutPrice && (
              <div className="border-t border-border pt-6 mb-6">
                <p className="text-sm text-foreground mb-2">Buyout Price</p>
                <p className="text-2xl font-bold text-primary">${startup.buyoutPrice.toLocaleString()}</p>
              </div>
            )}

            <button className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors mb-2">
              Collaborate
            </button>

            {startup.buyoutPrice && (
              <button className="w-full py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                Make Offer
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
