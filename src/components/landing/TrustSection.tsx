export function TrustSection() {
  const badges = [
    "Boutique Partners",
    "Fashion Retail",
    "Personal Stylists",
    "Retail Technology",
    "Coming Soon",
  ];

  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-bold font-heading text-foreground tracking-tight whitespace-nowrap">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
