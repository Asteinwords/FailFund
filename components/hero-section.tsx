import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Recycle Failed Startups</h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Transform abandoned projects into thriving ventures. Discover, collaborate, and revive the next big idea.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/browse"
            className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-neutral-light transition-colors"
          >
            Explore Startups
          </Link>
          <Link
            href="/upload"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            List Your Project
          </Link>
        </div>
      </div>
    </section>
  )
}
