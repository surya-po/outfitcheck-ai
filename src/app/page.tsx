import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "OutfitCheck AI — Know Your Body. Dress Your Best.",
  description:
    "Point your camera and receive AI-powered outfit recommendations based on your unique body shape, skin tone, and proportions.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#F7A8B8]/40">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes scanLine {
          0%   { top: 10%; }
          50%  { top: 80%; }
          100% { top: 10%; }
        }
        .animate-scan { position: absolute; width: 100%; animation: scanLine 2.5s ease-in-out infinite; }
      `}</style>

      <Navigation />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
