"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

interface Discussion {
  _id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  category: string
  replies: Array<{
    author: {
      name: string
      avatar?: string
    }
    content: string
    createdAt: string
  }>
  views: number
  createdAt: string
}

export default function DiscussionPage() {
  const params = useParams()
  const id = params.id as string
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/discussions/${id}`)
        if (!response.ok) throw new Error("Failed to fetch discussion")
        const data = await response.json()
        setDiscussion(data)
      } catch (error) {
        console.error("Error fetching discussion:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussion()
  }, [id])

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !token) return

    setSubmitting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/discussions/${id}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: replyContent }),
      })

      if (!response.ok) throw new Error("Failed to post reply")
      const data = await response.json()
      setDiscussion(data)
      setReplyContent("")
    } catch (error) {
      console.error("Error posting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading discussion...</p>
        </div>
      </main>
    )
  }

  if (!discussion) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <p className="text-center text-foreground">Discussion not found</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/community" className="text-primary hover:text-primary-light mb-6 inline-block">
        ← Back to Community
      </Link>

      <div className="bg-white border border-border rounded-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-neutral-dark">{discussion.title}</h1>
          <span className="text-xs font-semibold px-3 py-1 bg-accent-light text-neutral-dark rounded">
            {discussion.category}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {discussion.author.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-neutral-dark">{discussion.author.name}</p>
            <p className="text-sm text-foreground">
              {new Date(discussion.createdAt).toLocaleDateString()} • {discussion.views} views
            </p>
          </div>
        </div>

        <p className="text-foreground text-lg leading-relaxed">{discussion.content}</p>
      </div>

      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          {discussion.replies.length} {discussion.replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        <div className="space-y-4">
          {discussion.replies.map((reply, index) => (
            <div key={index} className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {reply.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark">{reply.author.name}</p>
                  <p className="text-xs text-foreground">{new Date(reply.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-foreground">{reply.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {user ? (
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Add Your Reply</h3>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Reply"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-neutral-light border border-border rounded-lg p-6 text-center">
          <p className="text-foreground mb-4">Sign in to reply to this discussion</p>
          <Link href="/login" className="text-primary hover:text-primary-light font-semibold">
            Sign In
          </Link>
        </div>
      )}
    </main>
  )
}
