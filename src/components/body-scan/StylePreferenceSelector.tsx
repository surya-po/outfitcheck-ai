"use client";

import { useState } from "react";
import { 
  Diamond, ArrowRight, CheckCircle2, 
  Shirt, Coffee, Briefcase, Crown, Hexagon, 
  Glasses, Gem, Zap, Dumbbell, Radio, Flower2, 
  Moon, Layers, Palette, Users, Heart, 
  PartyPopper, Plane, Map, Camera, Book, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserStylePreference } from "@/lib/fashion-recommendation-engine/recommendation-types";

// ── Style Options ──────────────────────────────────────────
const STYLE_OPTIONS = [
  { label: "Casual",           icon: Shirt,      desc: "Santai & nyaman sehari-hari" },
  { label: "Smart Casual",     icon: Coffee,     desc: "Rapi namun tetap santai" },
  { label: "Business Casual",  icon: Briefcase,  desc: "Semi-formal untuk meeting" },
  { label: "Formal",           icon: Building2,  desc: "Profesional & elegan" },
  { label: "Old Money",        icon: Crown,      desc: "Klasik, timeless, berkelas" },
  { label: "Minimalist",       icon: Hexagon,    desc: "Bersih, simpel, esensial" },
  { label: "Elegant",          icon: Diamond,   desc: "Anggun & sophisticated" },
  { label: "Chic",             icon: Glasses,    desc: "Stylish & modern" },
  { label: "Luxury",           icon: Gem,        desc: "Premium & eksklusif" },
  { label: "Streetwear",       icon: Zap,        desc: "Urban & ekspresif" },
  { label: "Sporty",           icon: Dumbbell,   desc: "Aktif & atletis" },
  { label: "Vintage",          icon: Radio,      desc: "Retro & nostalgik" },
  { label: "Feminine",         icon: Flower2,    desc: "Lembut & feminin" },
  { label: "Masculine",        icon: Layers,     desc: "Maskulin & berkarakter" },
  { label: "Modest",           icon: Moon,       desc: "Tertutup & anggun" },
  { label: "Monochrome",       icon: Palette,    desc: "Satu palet, maksimal kesan" },
];

// ── Occasion Options ───────────────────────────────────────
const OCCASION_OPTIONS = [
  { label: "Daily",        icon: Coffee },
  { label: "Campus",       icon: Book },
  { label: "Office",       icon: Briefcase },
  { label: "Meeting",      icon: Users },
  { label: "Wedding",      icon: Heart },
  { label: "Party",        icon: PartyPopper },
  { label: "Date",         icon: Flower2 },
  { label: "Travel",       icon: Plane },
  { label: "Vacation",     icon: Map },
  { label: "Photoshoot",   icon: Camera },
  { label: "Gym",          icon: Dumbbell },
];

const MAX_STYLES = 3;

interface StylePreferenceSelectorProps {
  onComplete: (preference: UserStylePreference) => void;
}

export function StylePreferenceSelector({ onComplete }: StylePreferenceSelectorProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>(undefined);

  const toggleStyle = (label: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(label)) return prev.filter((s) => s !== label);
      if (prev.length >= MAX_STYLES) return prev; // max 3
      return [...prev, label];
    });
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onComplete({
        preferredStyles: selectedStyles,
        preferredOccasion: selectedOccasion,
      });
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onComplete({
        preferredStyles: selectedStyles,
        preferredOccasion: undefined,
      });
    }
  };

  return (
    <div className="animate-in fade-in-50 duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground shadow-sm">
            <Diamond className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
              Personalize Your Style
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bantu AI mengenal gaya Anda sebelum analisis dimulai.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                  s === step
                    ? "bg-primary text-primary-foreground shadow-md scale-110"
                    : s < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-medium ${s === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Pilih Style" : "Pilih Occasion"}
              </span>
              {s < 2 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ STEP 1: Style Selection ⭐ */}
      {step === 1 && (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Gaya apa yang Anda sukai?
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih hingga <span className="font-semibold text-primary">{MAX_STYLES} gaya</span> yang paling mencerminkan selera Anda.
              </p>
            </div>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full shadow-sm">
              {selectedStyles.length}/{MAX_STYLES}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {STYLE_OPTIONS.map(({ label, icon: Icon, desc }) => {
              const isSelected = selectedStyles.includes(label);
              const isDisabled = !isSelected && selectedStyles.length >= MAX_STYLES;
              return (
                <button
                  key={label}
                  onClick={() => toggleStyle(label)}
                  disabled={isDisabled}
                  className={`relative group flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02] ring-1 ring-primary/20"
                      : isDisabled
                      ? "border-border/30 bg-muted/20 opacity-50 cursor-not-allowed"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm hover:-translate-y-1"
                  }`}
                >
                  {/* Subtle background glow for selected items */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-full mb-3 transition-colors duration-300 ${
                    isSelected ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    <Icon className="w-6 h-6" strokeWidth={isSelected ? 2.5 : 2} />
                  </div>
                  
                  <span className={`text-sm font-semibold leading-tight mb-1.5 transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-snug">{desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
            <button
              onClick={handleSkip}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Lewati langkah ini
            </button>
            <Button
              onClick={handleNext}
              disabled={selectedStyles.length === 0}
              className="rounded-xl h-12 px-8 font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              Lanjut <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ⭐ STEP 2: Occasion Selection ⭐ */}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Apa acara utama Anda?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI akan memprioritaskan pakaian yang paling sesuai untuk kesempatan ini. <span className="italic">(Opsional)</span>
            </p>
          </div>

          {/* Selected styles recap */}
          {selectedStyles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 p-4 rounded-xl bg-card border border-border shadow-sm">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-1">Gaya Dipilih:</span>
              {selectedStyles.map((s) => (
                <span key={s} className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
            {OCCASION_OPTIONS.map(({ label, icon: Icon }) => {
              const isSelected = selectedOccasion === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedOccasion(isSelected ? undefined : label)}
                  className={`group flex flex-col items-center justify-center text-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02] ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm hover:-translate-y-1"
                  }`}
                >
                  <div className={`mb-3 transition-colors duration-300 ${
                    isSelected ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
                  }`}>
                    <Icon className="w-7 h-7" strokeWidth={isSelected ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleSkip}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Lewati
              </button>
            </div>
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto rounded-xl h-14 px-8 font-bold text-base shadow-lg bg-gradient-to-r from-primary to-[#E14D72] hover:opacity-90 transition-all hover:scale-105 active:scale-95 text-white border-0"
            >
              <Diamond className="w-5 h-5 mr-2" />
              Mulai Body Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
