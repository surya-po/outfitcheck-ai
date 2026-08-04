import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 px-6 border-t border-[#ECECEC] bg-white">
      <div className="max-w-2xl mx-auto text-center" style={{ animation: "fadeUp 0.5s ease both" }}>
        {/* Decorative pill */}
        <div className="inline-block w-10 h-1 rounded-full bg-[#EA5C87] mb-10" />

        <h2 className="text-3xl md:text-[2.75rem] font-bold font-heading text-[#18181B] leading-tight tracking-tight mb-5">
          Ready to discover<br className="hidden sm:block" /> your best style?
        </h2>

        <p className="text-[#6B7280] text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Start your first body analysis for free. No credit card. No guesswork.
          Just outfits that actually fit you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 h-13 px-8 rounded-full bg-[#EA5C87] text-white text-base font-semibold hover:bg-[#d44f78] transition-all duration-200 shadow-md shadow-[#EA5C87]/20 hover:-translate-y-0.5"
          >
            Start Body Analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/partner-register"
            className="inline-flex items-center h-13 px-8 rounded-full border border-[#ECECEC] text-[#6B7280] text-base font-medium hover:border-[#D1D1D1] hover:text-[#18181B] hover:bg-[#F7F7F7] transition-all duration-200"
          >
            For Boutiques
          </Link>
        </div>

        <p className="mt-8 text-sm text-[#9CA3AF]">
          Results in &lt;5 seconds · Privacy-first · No photo stored
        </p>
      </div>
    </section>
  );
}
