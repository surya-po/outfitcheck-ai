import { ArrowRight, TrendingUp, Users, PieChart, Store } from "lucide-react";
import Link from "next/link";

export function ForBoutiquesSection() {
  const benefits = [
    { icon: TrendingUp, title: "Higher Conversion Rates", desc: "Customers buy more when they are confident the item will fit." },
    { icon: Users, title: "Customer Confidence", desc: "Build trust by offering hyper-personalized styling advice." },
    { icon: PieChart, title: "Deep Analytics", desc: "Understand your demographic's true body architectures." },
    { icon: Store, title: "Inventory Insights", desc: "Stock exactly what flatters your specific customer base." },
  ];

  return (
    <section className="py-32 bg-foreground text-background overflow-hidden" id="for-boutiques">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Text */}
          <div className="space-y-12">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">B2B Integration</span>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
                Empower your retail experience.
              </h2>
              <p className="text-xl text-background/70 leading-relaxed">
                OutfitCheck isn&apos;t just for consumers. Forward-thinking boutiques and fashion brands use our API to offer personalized shopping experiences that dramatically reduce return rates.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <div key={i}>
                  <div className="w-10 h-10 rounded-full bg-background/10 text-primary flex items-center justify-center mb-4">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold font-heading mb-2">{b.title}</h4>
                  <p className="text-sm text-background/60">{b.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <Link href="/partner-register" className="inline-flex items-center text-background font-bold hover:text-primary transition-colors group">
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full max-w-lg mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
            
            <div className="absolute inset-4 bg-background/5 border border-background/10 rounded-[40px] p-8 shadow-2xl backdrop-blur-xl flex flex-col">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-background/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/20" />
                  <div>
                    <div className="h-4 w-24 bg-background/20 rounded mb-1" />
                    <div className="h-3 w-16 bg-background/10 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 rounded-full bg-primary/20" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background/10 rounded-2xl p-6">
                  <div className="h-3 w-20 bg-background/20 rounded mb-4" />
                  <div className="h-8 w-16 bg-background/30 rounded" />
                </div>
                <div className="bg-background/10 rounded-2xl p-6">
                  <div className="h-3 w-24 bg-background/20 rounded mb-4" />
                  <div className="h-8 w-20 bg-background/30 rounded" />
                </div>
              </div>

              <div className="flex-1 bg-background/10 rounded-2xl p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-2 h-32">
                  {[40, 70, 45, 90, 65, 80].map((height, i) => (
                    <div key={i} className="w-full bg-primary/50 rounded-t-sm" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
