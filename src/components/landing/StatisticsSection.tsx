export function StatisticsSection() {
  const stats = [
    {
      value: "<5 Sec",
      label: "Average Analysis",
    },
    {
      value: "24/7",
      label: "AI Availability",
    },
    {
      value: "100%",
      label: "Personalized Recommendations",
    },
    {
      value: "Multiple",
      label: "Body Shape Detection",
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x-0 lg:divide-x divide-border">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center lg:px-8">
              <span className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
                {stat.value}
              </span>
              <span className="text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
