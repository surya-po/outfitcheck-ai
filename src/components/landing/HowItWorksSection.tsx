import { Camera, Sparkles, ShoppingBag } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Point your camera",
    description:
      "Open the app and take a full-body photo in natural light. No special equipment needed — just your phone.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI analyzes in seconds",
    description:
      "Our model identifies your body shape, proportions, and skin undertone with a single photo. Results arrive instantly.",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Dress with confidence",
    description:
      "Receive curated outfit ideas, a personal color palette, and style guidance — all tailored to your unique body.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 border-t border-[#ECECEC] bg-[#FAFAFA]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#18181B] tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-[#6B7280] text-lg max-w-md mx-auto">
            Three simple steps from photo to perfect outfit.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#ECECEC] p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              style={{ animation: `fadeUp 0.5s ${i * 0.1 + 0.1}s ease both` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] border border-[#F7A8B8]/30 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#EA5C87]" />
                </div>
                <span className="text-3xl font-bold text-[#ECECEC] font-heading select-none">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#18181B] font-heading mb-2">
                {step.title}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
