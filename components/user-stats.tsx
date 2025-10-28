interface UserStatsProps {
  totalStartups: number
  totalViews: number
  activeCollaborations: number
  averageRevivalScore: number
}

export default function UserStats({
  totalStartups,
  totalViews,
  activeCollaborations,
  averageRevivalScore,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-border rounded-lg p-4">
        <p className="text-xs text-foreground mb-1">Total Startups</p>
        <p className="text-2xl font-bold text-primary">{totalStartups}</p>
      </div>
      <div className="bg-white border border-border rounded-lg p-4">
        <p className="text-xs text-foreground mb-1">Total Views</p>
        <p className="text-2xl font-bold text-primary">{totalViews}</p>
      </div>
      <div className="bg-white border border-border rounded-lg p-4">
        <p className="text-xs text-foreground mb-1">Collaborations</p>
        <p className="text-2xl font-bold text-primary">{activeCollaborations}</p>
      </div>
      <div className="bg-white border border-border rounded-lg p-4">
        <p className="text-xs text-foreground mb-1">Avg Score</p>
        <p className="text-2xl font-bold text-primary">{averageRevivalScore}%</p>
      </div>
    </div>
  )
}
