import Link from "next/link"
import Image from "next/image"

interface StartupCardProps {
  id: string
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
  createdAt?: string
  views?: number
}

export default function StartupCard({
  id,
  title,
  description,
  founder,
  revivalScore,
  techStack,
  category,
  image,
}: StartupCardProps) {
  return (
    <Link href={`/startup/${id}`}>
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {image && (
          <div className="relative w-full h-48 bg-neutral-light">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg text-neutral-dark line-clamp-2">{title}</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-accent-light text-neutral-dark rounded whitespace-nowrap">
              {category}
            </span>
          </div>

          <p className="text-sm text-foreground line-clamp-2 mb-3 flex-grow">{description}</p>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">Revival Score</span>
              <span className="text-sm font-bold text-primary">{revivalScore}%</span>
            </div>
            <div className="w-full bg-neutral-light rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${revivalScore}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs px-2 py-1 bg-neutral-light text-foreground rounded">
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="text-xs px-2 py-1 bg-neutral-light text-foreground rounded">
                +{techStack.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {founder.name.charAt(0)}
            </div>
            <span className="text-sm text-foreground">{founder.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
