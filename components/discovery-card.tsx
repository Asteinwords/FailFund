import Link from "next/link"

interface DiscoveryCardProps {
  title: string
  description: string
  icon: string
  link: string
}

export default function DiscoveryCard({ title, description, icon, link }: DiscoveryCardProps) {
  return (
    <Link href={link}>
      <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-neutral-dark mb-2">{title}</h3>
        <p className="text-sm text-foreground">{description}</p>
      </div>
    </Link>
  )
}
