import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const analysisResults = [
    { label: "Body Shape", value: "Rectangle", sub: "Balanced proportions" },
    { label: "Skin Tone", value: "Warm Autumn", sub: "Golden undertone" },
    { label: "Recommended Style", value: "Smart Casual", sub: "96% confidence" },
  ];

  const colorPalette = [
    { hex: "#6B4C3B", name: "Mocha" },
    { hex: "#D4A96A", name: "Camel" },
    { hex: "#E8D5B7", name: "Cream" },
    { hex: "#4A6741", name: "Sage" },
    { hex: "#C9856A", name: "Terracotta" },
  ];

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left — Copy */}
        <div className="flex flex-col items-start" style={{ animation: "fadeUp 0.6s ease both" }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F7A8B8] text-[#EA5C87] text-xs font-semibold tracking-wide uppercase mb-6">
            AI Body Analysis
          </span>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold font-heading text-[#18181B] leading-[1.08] tracking-tight mb-5">
            See your body.<br />
            Dress your{" "}
            <span className="text-[#EA5C87] italic">best.</span>
          </h1>

          <p className="text-lg text-[#6B7280] leading-relaxed max-w-md mb-8">
            Point your camera, and in seconds our AI identifies your body shape,
            skin tone, and proportions — then curates outfits made for
            <em> you</em>.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#EA5C87] text-white text-base font-semibold hover:bg-[#d44f78] transition-all duration-200 shadow-md shadow-[#EA5C87]/20 hover:-translate-y-0.5"
            >
              Start Body Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-12 px-7 rounded-full border border-[#ECECEC] text-[#18181B] text-base font-medium hover:border-[#D1D1D1] hover:bg-[#F7F7F7] transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <p className="text-sm text-[#9CA3AF]">
            No account required to try — results in under 5 seconds.
          </p>
        </div>

        {/* Right — Mockup */}
        <div
          className="relative flex justify-center lg:justify-end"
          style={{ animation: "fadeUp 0.6s 0.15s ease both" }}
        >
          {/* Soft bg glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#EA5C87]/8 to-[#F7A8B8]/10 rounded-[40px] blur-3xl pointer-events-none" />

          {/* Phone-like card */}
          <div className="relative w-full max-w-[380px] bg-white rounded-[32px] shadow-2xl shadow-black/8 border border-[#F0F0F0] overflow-hidden">

            {/* Status bar / top */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#F5F5F5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF0F4] flex items-center justify-center">
                  <span className="text-[#EA5C87] text-xs font-bold">OC</span>
                </div>
                <span className="text-sm font-semibold text-[#18181B]">Your Analysis</span>
              </div>
              <span className="text-xs font-medium text-[#9CA3AF] bg-[#F5F5F5] px-2.5 py-1 rounded-full">
                Complete ✓
              </span>
            </div>

            {/* Camera preview placeholder */}
            <div className="mx-6 my-5 h-36 bg-gradient-to-b from-[#F9F0F3] to-[#F5E8EC] rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-16 h-28 border-2 border-[#EA5C87] rounded-full" />
              </div>
              {/* Scan line */}
              <div
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#EA5C87]/70 to-transparent"
                style={{ animation: "scanLine 2.5s ease-in-out infinite" }}
              />
              <span className="relative text-xs font-medium text-[#EA5C87] bg-white/80 px-3 py-1 rounded-full shadow-sm">
                Body detected
              </span>
            </div>

            {/* Results */}
            <div className="px-6 pb-4 space-y-3">
              {analysisResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#FAFAFA] rounded-2xl px-4 py-3 border border-[#F0F0F0]"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-medium mb-0.5">
                      {r.label}
                    </p>
                    <p className="text-sm font-bold text-[#18181B]">{r.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#6B7280]">{r.sub}</p>
                    <CheckCircle2 className="w-4 h-4 text-[#EA5C87] ml-auto mt-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Color palette */}
            <div className="px-6 pb-6">
              <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-medium mb-3">
                Your Color Palette
              </p>
              <div className="flex gap-2.5 items-center">
                {colorPalette.map((c, i) => (
                  <div key={i} className="group flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-black/5"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.name}
                    </span>
                  </div>
                ))}
                <div className="ml-auto text-right">
                  <span className="text-2xl font-bold text-[#EA5C87]">96%</span>
                  <p className="text-[10px] text-[#9CA3AF]">Match</p>
                </div>
              </div>
            </div>

            {/* CTA inside card */}
            <div className="mx-6 mb-6">
              <Link
                href="/register"
                className="block w-full h-11 bg-[#18181B] text-white text-sm font-semibold text-center rounded-2xl leading-[44px] hover:bg-[#2D2D2D] transition-colors"
              >
                View Full Recommendations →
              </Link>
            </div>
          </div>

          {/* Floating badge */}
          <div
            className="absolute -left-4 top-1/3 bg-white border border-[#F0F0F0] shadow-lg rounded-2xl px-4 py-3 hidden lg:flex items-center gap-3"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <div className="w-2 h-2 rounded-full bg-[#EA5C87] shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-[#18181B]">Warm Undertone</p>
              <p className="text-[10px] text-[#9CA3AF]">Best colors identified</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
