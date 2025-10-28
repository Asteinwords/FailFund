"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface Notif {
  _id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)

  const fetchNotifs = async () => {
    if (!token) return
    try {
      const [countRes, notifRes] = await Promise.all([
        fetch("http://localhost:5000/api/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (countRes.ok) {
        const { count } = await countRes.json()
        setUnread(count)
      }
      if (notifRes.ok) {
        const data = await notifRes.json()
        setNotifs(data)
      }
    } catch (err) {
      console.error("Notification fetch error:", err)
    }
  }

  useEffect(() => {
    if (token) fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [token])

  const markRead = async (id: string) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchNotifs()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="font-semibold text-lg text-neutral-dark">FailFund</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-foreground hover:text-primary">Browse</Link>
            <Link href="/community" className="text-foreground hover:text-primary">Community</Link>
            {user && <Link href="/dashboard" className="text-foreground hover:text-primary">Dashboard</Link>}

            {/* BELL */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <DropdownMenuItem className="text-center">No notifications</DropdownMenuItem>
                  ) : (
                    notifs.map((n) => (
                      <DropdownMenuItem
                        key={n._id}
                        className={`p-3 ${!n.read ? "bg-accent/10" : ""}`}
                        onClick={() => !n.read && markRead(n._id)}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{n.title}</div>
                          <div className="text-sm text-foreground">{n.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.name}</span>
                <Button onClick={handleLogout} size="sm">Sign Out</Button>
              </div>
            ) : (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/browse" className="block px-4 py-2 hover:bg-neutral-light rounded">Browse</Link>
            {user && <Link href="/dashboard" className="block px-4 py-2 hover:bg-neutral-light rounded">Dashboard</Link>}
            {user ? (
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 bg-primary text-white rounded">Sign Out</button>
            ) : (
              <Link href="/login" className="block px-4 py-2 bg-primary text-white rounded">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}