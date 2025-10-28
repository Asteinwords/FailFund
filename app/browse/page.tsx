"use client"

import { useState, useEffect } from "react"
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

export default function BrowsePage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", "Analytics", "Health & Fitness", "E-commerce", "Education", "Finance", "Social"]
  const techStackOptions = ["React", "Node.js", "Python", "Vue.js", "Django", "PostgreSQL", "MongoDB", "TensorFlow"]

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/startups")
        if (!response.ok) throw new Error("Failed to fetch startups")
        const data = await response.json()
        setStartups(data)
      } catch (error) {
        console.error("Error fetching startups:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  useEffect(() => {
    const filtered = startups.filter((startup) => {
      const matchesSearch = startup.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || startup.category === selectedCategory
      const matchesTechStack =
        selectedTechStack.length === 0 || selectedTechStack.some((tech) => startup.techStack.includes(tech))

      return matchesSearch && matchesCategory && matchesTechStack
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "most-viewed":
          return (b.views || 0) - (a.views || 0)
        case "highest-score":
          return b.revivalScore - a.revivalScore
        default:
          return 0
      }
    })

    setFilteredStartups(filtered)
  }, [startups, searchTerm, selectedCategory, selectedTechStack, sortBy])

  const toggleTechStack = (tech: string) => {
    setSelectedTechStack((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading startups...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover Failed Startups</h1>
        <p className="text-lg text-foreground">Browse {startups.length} projects waiting to be revived</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-border rounded-lg p-6 sticky top-20">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="font-semibold text-neutral-dark">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-foreground">
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">Category</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-neutral-light text-foreground hover:bg-border"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">Tech Stack</label>
              <div className="space-y-2">
                {techStackOptions.map((tech) => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTechStack.includes(tech)}
                      onChange={() => toggleTechStack(tech)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="highest-score">Highest Revival Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <p className="text-sm text-foreground">{filteredStartups.length} results</p>
            <button onClick={() => setShowFilters(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
              Filters
            </button>
          </div>

          <div className="hidden lg:block mb-6">
            <p className="text-sm text-foreground">
              Showing {filteredStartups.length} of {startups.length} startups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStartups.length > 0 ? (
              filteredStartups.map((startup) => <StartupCard key={startup._id} id={startup._id} {...startup} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-foreground mb-4">No startups found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedTechStack([])
                  }}
                  className="text-primary hover:text-primary-light font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
