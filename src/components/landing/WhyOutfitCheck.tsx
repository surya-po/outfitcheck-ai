import { Sparkles, Brain, UserCircle2 } from "lucide-react";

export function WhyOutfitCheck() {
  const reasons = [
    {
      icon: Sparkles,
      title: "Fashion Expertise",
      description: "Built alongside industry-leading stylists, our models understand the nuanced rules of fashion, not just basic color matching.",
    },
    {
      icon: Brain,
      title: "AI Precision",
      description: "Powered by advanced computer vision, we measure proportions and detect subtle undertones with accuracy surpassing the human eye.",
    },
    {
      icon: UserCircle2,
      title: "Personalized Experience",
      description: "Every recommendation is tailored strictly to your unique physical architecture. No generic style guides, just what works for you.",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground tracking-tight">
            Why OutfitCheck AI?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-primary flex items-center justify-center mb-8">
                <reason.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-4">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
