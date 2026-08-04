import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";

export function AIPreviewSection() {
  return (
    <section className="py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
              See what AI sees.
            </h2>
            <p className="text-xl text-background/70 leading-relaxed">
              Our advanced vision models break down your unique physical attributes to deliver hyper-personalized recommendations that a human stylist would take hours to compile.
            </p>
            <Link href="/register" className="inline-flex items-center text-background font-bold hover:text-primary transition-colors group">
              Get your analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-background/5 border border-background/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-12">
              <span className="text-sm font-medium uppercase tracking-widest text-background/60">AI Analysis Result</span>
              <Info className="w-5 h-5 text-background/40" />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8 border-b border-background/10 pb-8">
                <div>
                  <span className="block text-sm text-background/60 mb-2">Body Shape</span>
                  <span className="block text-2xl font-bold font-heading">Rectangle</span>
                </div>
                <div>
                  <span className="block text-sm text-background/60 mb-2">Skin Tone</span>
                  <span className="block text-2xl font-bold font-heading">Warm Autumn</span>
                </div>
              </div>

              <div>
                <span className="block text-sm text-background/60 mb-4">Recommended Colors</span>
                <div className="flex gap-4">
                  <div className="group relative">
                    <div className="w-12 h-12 rounded-full bg-[#556b2f] border border-background/20" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Olive</span>
                  </div>
                  <div className="group relative">
                    <div className="w-12 h-12 rounded-full bg-[#fdf5e6] border border-background/20" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Cream</span>
                  </div>
                  <div className="group relative">
                    <div className="w-12 h-12 rounded-full bg-[#8b4513] border border-background/20" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Brown</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/10 rounded-2xl p-6 flex items-center justify-between mt-8">
                <div>
                  <span className="block text-sm text-background/60 mb-1">Recommended Style</span>
                  <span className="block text-xl font-bold">Smart Casual</span>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-primary">96%</span>
                  <span className="block text-xs uppercase tracking-wider text-background/60">Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
