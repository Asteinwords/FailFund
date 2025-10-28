"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"

export default function NewDiscussionPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category }),
      })

      if (!response.ok) throw new Error("Failed to create discussion")
      const data = await response.json()
      router.push(`/community/${data._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-neutral-dark mb-8">Start a Discussion</h1>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General Discussion</option>
              <option value="tips">Tips & Advice</option>
              <option value="success-stories">Success Stories</option>
              <option value="help">Help & Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your thoughts, questions, or experiences..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Discussion"}
          </button>
        </form>
      </main>
    </ProtectedRoute>
  )
}
