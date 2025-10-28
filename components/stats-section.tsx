export default function StatsSection() {
  const stats = [
    { label: "Failed Startups", value: "1,200+" },
    { label: "Active Entrepreneurs", value: "5,400+" },
    { label: "Successful Revivals", value: "340+" },
    { label: "Total Collaborations", value: "890+" },
  ]

  return (
    <section className="bg-neutral-light py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">FailFund by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
