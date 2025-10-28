import HeroSection from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import StartupCard from "@/components/startup-card"

export default function Home() {
  // Mock data - will be replaced with API calls
  const featuredStartups = [
    {
      id: "1",
      title: "SocialFlow - Real-time Analytics",
      description: "A social media analytics platform that failed due to market saturation but has solid tech.",
      founder: { name: "Alex Chen" },
      revivalScore: 78,
      techStack: ["React", "Node.js", "PostgreSQL"],
      category: "Analytics",
      image: "/analytics-dashboard.png",
    },
    {
      id: "2",
      title: "FitTrack - AI Fitness Coach",
      description: "AI-powered fitness coaching app with great UX but struggled with user acquisition.",
      founder: { name: "Sarah Johnson" },
      revivalScore: 85,
      techStack: ["React Native", "Python", "TensorFlow"],
      category: "Health & Fitness",
      image: "/fitness-app-interface.png",
    },
    {
      id: "3",
      title: "EcoMarket - Sustainable Goods",
      description: "E-commerce platform for sustainable products. Strong concept, execution challenges.",
      founder: { name: "Marcus Lee" },
      revivalScore: 72,
      techStack: ["Vue.js", "Django", "MongoDB"],
      category: "E-commerce",
      image: "/ecommerce-store.jpg",
    },
  ]

  return (
    <main>
      <HeroSection />
      <StatsSection />

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Startups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map((startup) => (
            <StartupCard key={startup.id} {...startup} />
          ))}
        </div>
      </section>
    </main>
  )
}
