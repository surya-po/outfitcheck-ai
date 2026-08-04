import { X, Check } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-center text-foreground mb-16 tracking-tight">
          Finding clothes shouldn&apos;t be frustrating.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Without OutfitCheck */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-semibold text-muted-foreground mb-8 pb-4 border-b border-border flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">😩</span>
              WITHOUT OutfitCheck
            </h3>
            <ul className="space-y-6">
              {[
                "Wrong size",
                "Doesn't fit body shape",
                "Wasting money",
                "Low confidence",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With OutfitCheck */}
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-primary/5 border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
            <h3 className="text-xl font-bold text-foreground mb-8 pb-4 border-b border-border flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">✨</span>
              WITH OutfitCheck
            </h3>
            <ul className="space-y-6">
              {[
                "Personalized recommendations",
                "Better fitting outfits",
                "Smart styling",
                "Shop with confidence",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
