"use client"

import { ProtectedRoute } from "@/components/protected-route"
import StartupForm from "@/components/startup-form"

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-neutral-dark">List Your Failed Startup</h1>
          <p className="text-lg text-foreground">
            Share your project with entrepreneurs who want to revive it. Help turn failure into success.
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-8">
          <StartupForm />
        </div>
      </main>
    </ProtectedRoute>
  )
}
