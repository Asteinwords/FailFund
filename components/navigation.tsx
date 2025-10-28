"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

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

          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/community" className="text-foreground hover:text-primary transition-colors">
              Community
            </Link>
            {user && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/browse" className="block px-4 py-2 hover:bg-neutral-light rounded">
              Browse
            </Link>
            <Link href="/community" className="block px-4 py-2 hover:bg-neutral-light rounded">
              Community
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-neutral-light rounded">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 bg-primary text-white rounded">
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link href="/login" className="block px-4 py-2 bg-primary text-white rounded">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
