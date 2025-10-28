"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"

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
  const router = useRouter()
  const { toast } = useToast()
  const { token } = useAuth()

  // Dialog states
  const [openCollab, setOpenCollab] = useState(false)
  const [collabLoading, setCollabLoading] = useState(false)

  const [openOffer, setOpenOffer] = useState(false)
  const [offerAmount, setOfferAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [offerLoading, setOfferLoading] = useState(false)

  // -----------------------------------------------------------------
  // Fetch startup
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/startups/${id}`)
        if (!res.ok) throw new Error("Failed to fetch startup")
        const data = await res.json()
        setStartup(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchStartup()
  }, [id])

  // -----------------------------------------------------------------
  // Button handlers
  // -----------------------------------------------------------------
  const handleCollabClick = () => {
    if (!token) return router.push("/login")
    setOpenCollab(true)
  }

  const handleOfferClick = () => {
    if (!token) return router.push("/login")
    setOpenOffer(true)
  }

  // -----------------------------------------------------------------
  // Submit collaboration (statement only)
  // -----------------------------------------------------------------
  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCollabLoading(true)

    console.log("Sending collaboration request (auto-message):", { startupId: id })

    try {
      const res = await fetch("http://localhost:5000/api/collaborations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startupId: id,
          type: "collaborate",
          message: "I am interested in collaborating on this project.",
        }),
      })

      const body = await res.json()
      console.log("Collab response status:", res.status)
      console.log("Collab response body:", body)

      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)

      toast({ title: "Success", description: "Collaboration request sent!" })
      setOpenCollab(false)
    } catch (err: any) {
      console.error("Collaboration request failed:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to send request",
      })
    } finally {
      setCollabLoading(false)
    }
  }

  // -----------------------------------------------------------------
  // Submit offer
  // -----------------------------------------------------------------
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amountNum = parseFloat(offerAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid offer amount.",
      })
      return
    }

    console.log("Sending offer:", { startupId: id, offerAmount: amountNum, message: offerMessage })

    setOfferLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/collaborations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startupId: id,
          type: "offer",
          message: offerMessage,
          offerAmount: amountNum,
        }),
      })

      const body = await res.json()
      console.log("Offer response status:", res.status)
      console.log("Offer response body:", body)

      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)

      toast({ title: "Offer Sent", description: "Your offer has been submitted!" })
      setOpenOffer(false)
      setOfferAmount("")
      setOfferMessage("")
    } catch (err: any) {
      console.error("Offer failed:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to send offer",
      })
    } finally {
      setOfferLoading(false)
    }
  }

  // -----------------------------------------------------------------
  // Loading / error states
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground">Loading startup details...</p>
      </main>
    )
  }

  if (error || !startup) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4 text-center">
        <p className="text-red-600 mb-4">{error || "Startup not found"}</p>
        <Link href="/browse" className="text-primary hover:text-primary-light">
          ← Back to Browse
        </Link>
      </main>
    )
  }

  // -----------------------------------------------------------------
  // Main UI
  // -----------------------------------------------------------------
  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <Link href="/browse" className="text-primary hover:text-primary-light mb-6 inline-block">
        ← Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- LEFT: DETAILS ---------- */}
        <div className="lg:col-span-2">
          {startup.images.length > 0 && (
            <div className="relative w-full h-96 bg-neutral-light rounded-lg overflow-hidden mb-8">
              <Image
                src={startup.images[0] || "/placeholder.svg"}
                alt={startup.title}
                fill
                className="object-cover"
              />
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

        {/* ---------- RIGHT: ACTIONS ---------- */}
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

            {/* Action Buttons */}
            <button
              onClick={handleCollabClick}
              className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors mb-2"
            >
              Collaborate
            </button>

            {startup.buyoutPrice && (
              <button
                onClick={handleOfferClick}
                className="w-full py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Make Offer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== COLLABORATE DIALOG (statement only) ==================== */}
      <Dialog open={openCollab} onOpenChange={setOpenCollab}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Collaboration</DialogTitle>
            <DialogDescription>
              A default message will be sent to the founder.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCollabSubmit} className="space-y-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> No extra message required.
            </p>
            <Button type="submit" disabled={collabLoading} className="w-full">
              {collabLoading ? "Sending..." : "Send Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== OFFER DIALOG ==================== */}
      <Dialog open={openOffer} onOpenChange={setOpenOffer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
            <DialogDescription>
              Submit a monetary offer to buy or revive this startup.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOfferSubmit} className="space-y-4">
            <div>
              <Label htmlFor="offer-amount">Offer Amount ($)</Label>
              <Input
                id="offer-amount"
                type="number"
                placeholder="e.g. 5000"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                required
                min="1"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="offer-message">Your Message</Label>
              <Textarea
                id="offer-message"
                placeholder="Explain your offer and terms..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                required
                rows={4}
              />
            </div>
            <Button type="submit" disabled={offerLoading} className="w-full">
              {offerLoading ? "Sending..." : "Submit Offer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}