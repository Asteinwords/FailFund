"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

interface Discussion {
  _id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  category: string
  replies: any[]
  views: number
  createdAt: string
}

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { user } = useAuth()

  const categories = ["all", "general", "tips", "success-stories", "help"]

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/discussions")
        if (!response.ok) throw new Error("Failed to fetch discussions")
        const data = await response.json()
        setDiscussions(data)
      } catch (error) {
        console.error("Error fetching discussions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  const filteredDiscussions =
    selectedCategory === "all" ? discussions : discussions.filter((d) => d.category === selectedCategory)

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading community...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-dark mb-2">Community Hub</h1>
          <p className="text-lg text-foreground">Connect, share, and learn from fellow founders and entrepreneurs</p>
        </div>
        {user && (
          <Link
            href="/community/new"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            Start Discussion
          </Link>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-neutral-light text-foreground hover:bg-border"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <Link key={discussion._id} href={`/community/${discussion._id}`}>
              <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-neutral-dark mb-2">{discussion.title}</h3>
                    <p className="text-foreground line-clamp-2">{discussion.content}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-accent-light text-neutral-dark rounded whitespace-nowrap">
                    {discussion.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {discussion.author.name.charAt(0)}
                    </div>
                    <span>{discussion.author.name}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>{discussion.replies.length} replies</span>
                    <span>{discussion.views} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground mb-4">No discussions in this category yet.</p>
            {user && (
              <Link href="/community/new" className="text-primary hover:text-primary-light font-semibold">
                Be the first to start a discussion
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
