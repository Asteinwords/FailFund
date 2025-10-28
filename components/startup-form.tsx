"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function StartupForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    failureReason: "",
    techStack: "",
    repositoryUrl: "",
    category: "Technology",
    tags: "",
    buyoutPrice: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { token } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()),
        tags: formData.tags.split(",").map((t) => t.trim()),
        buyoutPrice: formData.buyoutPrice ? Number.parseInt(formData.buyoutPrice) : null,
        images: [], // In production, upload to Cloudinary
      }

      const response = await fetch("http://localhost:5000/api/startups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create startup")
      }

      const data = await response.json()
      router.push(`/startup/${data._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., SocialFlow Analytics Platform"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe your project, its features, and what made it unique..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Why Did It Fail?</label>
        <textarea
          name="failureReason"
          value={formData.failureReason}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Be honest about what went wrong and what you learned..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Technology</option>
            <option>E-commerce</option>
            <option>Health & Fitness</option>
            <option>Education</option>
            <option>Finance</option>
            <option>Social</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Tech Stack (comma-separated)</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="React, Node.js, PostgreSQL"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Repository URL</label>
        <input
          type="url"
          name="repositoryUrl"
          value={formData.repositoryUrl}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://github.com/..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="analytics, saas, b2b"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Buyout Price (optional)</label>
          <input
            type="number"
            name="buyoutPrice"
            value={formData.buyoutPrice}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="50000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Project Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {images.length > 0 && <p className="text-sm text-foreground mt-2">{images.length} image(s) selected</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Startup"}
      </button>
    </form>
  )
}
