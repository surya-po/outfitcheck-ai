import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function FeatureShowcase() {
  const features = [
    {
      title: "AI Body Analysis",
      description: "Our advanced vision models analyze your body shape and proportions with millimeter precision from a single photo, giving you an objective understanding of your physical architecture.",
      bullets: ["Precise shape classification", "Proportion mapping", "Objective analysis"],
      imageBg: "bg-secondary/10",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6 flex flex-col">
          <div className="w-full h-48 bg-muted rounded-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/30 animate-scan-line" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      ),
    },
    {
      title: "Personal Outfit Recommendation",
      description: "Based on your unique body architecture, we curate outfits that flatter your shape, highlight your best features, and align with your personal style preferences.",
      bullets: ["Flattering silhouettes", "Style-matched items", "Confidence boosting"],
      imageBg: "bg-primary/5",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 h-32 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      ),
    },
    {
      title: "Mix & Match",
      description: "Build an intelligent digital wardrobe. Mix and match recommended items with your existing clothes to create endless stylish combinations without the guesswork.",
      bullets: ["Digital wardrobe", "Endless combinations", "Smart pairing"],
      imageBg: "bg-accent/10",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6 flex items-center justify-center">
           <div className="grid grid-cols-3 gap-4 w-full">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="aspect-square bg-muted rounded-lg" />
             ))}
           </div>
        </div>
      ),
    },
    {
      title: "Color Recommendation",
      description: "Discover the color palette that perfectly complements your skin undertone. Never wear a color that washes you out again.",
      bullets: ["Undertone detection", "Seasonal color analysis", "Complementary matching"],
      imageBg: "bg-warning/10",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6 flex flex-col items-center justify-center gap-4">
           <div className="flex gap-2 mb-4">
             <div className="w-16 h-16 rounded-full bg-[#fdf5e6] shadow-sm border border-border" />
             <div className="w-16 h-16 rounded-full bg-[#d2b48c] shadow-sm border border-border -ml-4" />
             <div className="w-16 h-16 rounded-full bg-[#8b4513] shadow-sm border border-border -ml-4" />
           </div>
           <div className="w-full h-8 bg-gradient-to-r from-[#556b2f] via-[#8fbc8f] to-[#2e8b57] rounded-full" />
        </div>
      ),
    },
    {
      title: "Smart Wardrobe",
      description: "Save your favorite looks, organize them by occasion, and access your curated digital closet anytime, anywhere.",
      bullets: ["Save favorites", "Occasion sorting", "Anywhere access"],
      imageBg: "bg-success/10",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-muted rounded w-32" />
            <div className="h-6 w-6 bg-muted rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-muted rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Boutique Dashboard",
      description: "For fashion retailers: gain deep insights into what your customers actually look good in. Recommend the right inventory to the right body types, reducing returns and increasing satisfaction.",
      bullets: ["Customer insights", "Reduced returns", "Inventory matching"],
      imageBg: "bg-primary/10",
      mockup: (
        <div className="absolute inset-8 bg-white rounded-2xl shadow-xl border border-border p-6 flex flex-col">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 h-20 bg-muted rounded-xl" />
            <div className="flex-1 h-20 bg-muted rounded-xl" />
          </div>
          <div className="flex-1 bg-muted rounded-xl" />
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {features.map((feature, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div key={index} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
              {/* Text Content */}
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-4 pt-4">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="/register" className="inline-flex items-center text-primary font-bold hover:text-primary/80 transition-colors group">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none">
                <div className={`relative aspect-[4/3] rounded-[40px] overflow-hidden ${feature.imageBg}`}>
                  {feature.mockup}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
