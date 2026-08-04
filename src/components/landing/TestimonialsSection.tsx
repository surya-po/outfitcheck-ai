import Image from "next/image";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Eleanor Vance",
      role: "Fashion Influencer",
      image: "https://i.pravatar.cc/150?img=43",
      content: "OutfitCheck completely transformed how I curate my daily looks. The AI understands nuances in my body proportion better than human stylists I've worked with.",
    },
    {
      name: "Marcus Sterling",
      role: "Boutique Owner",
      image: "https://i.pravatar.cc/150?img=11",
      content: "Integrating this into our retail experience increased our conversion rate by 40%. Customers finally buy pieces that actually flatter their unique shapes.",
    },
    {
      name: "Sophia Chen",
      role: "Creative Director",
      image: "https://i.pravatar.cc/150?img=5",
      content: "A masterclass in fashion technology. It doesn't just recommend clothes; it educates you on your own physical architecture. Simply brilliant.",
    },
  ];

  return (
    <section className="py-32 bg-muted/20" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-24 text-center tracking-tight">
          What Industry Leaders Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-[32px] p-10 shadow-sm border border-border flex flex-col hover:-translate-y-2 transition-transform duration-500">
              <div className="flex gap-1 mb-8 text-foreground">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg text-foreground/90 leading-relaxed mb-10 flex-1 font-medium">
                &quot;{t.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                  <Image src={t.image} alt={t.name} width={56} height={56} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground font-heading">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
