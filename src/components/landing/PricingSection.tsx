import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  const tiers = [
    {
      name: "Boutique",
      desc: "For small independent fashion retailers.",
      price: "$99",
      features: ["Up to 1,000 analyses/mo", "Basic analytics dashboard", "Email support", "Standard recommendation engine"],
      highlight: false,
    },
    {
      name: "Growing Business",
      desc: "For expanding brands needing deeper insights.",
      price: "$299",
      features: ["Up to 10,000 analyses/mo", "Advanced customer insights", "Priority support", "Custom styling rules", "API access"],
      highlight: true,
    },
    {
      name: "Enterprise Retail",
      desc: "Custom solutions for global fashion brands.",
      price: "Custom",
      features: ["Unlimited analyses", "Full white-label option", "Dedicated account manager", "Custom AI model training", "SLA guarantee"],
      highlight: false,
    },
  ];

  return (
    <section className="py-32 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6 tracking-tight">
            Transparent, scalable pricing.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your retail volume. No hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`rounded-[32px] p-8 md:p-10 ${
                tier.highlight 
                  ? "bg-foreground text-background shadow-2xl scale-100 lg:scale-105 z-10 border-none" 
                  : "bg-white text-foreground border border-border shadow-sm"
              }`}
            >
              <h3 className={`text-2xl font-bold font-heading mb-2 ${tier.highlight ? "text-background" : "text-foreground"}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mb-8 ${tier.highlight ? "text-background/70" : "text-muted-foreground"}`}>
                {tier.desc}
              </p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold font-heading">{tier.price}</span>
                {tier.price !== "Custom" && <span className={`text-lg ml-1 ${tier.highlight ? "text-background/70" : "text-muted-foreground"}`}>/mo</span>}
              </div>

              <Button 
                className={`w-full rounded-full h-12 mb-8 ${
                  tier.highlight 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-secondary/20 text-primary hover:bg-secondary/30"
                }`}
              >
                Get Started
              </Button>

              <ul className="space-y-4">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${tier.highlight ? "text-primary" : "text-primary"}`} />
                    <span className={`text-sm font-medium ${tier.highlight ? "text-background/90" : "text-foreground/80"}`}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
