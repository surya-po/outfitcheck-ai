"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserStylePreference } from "@/lib/fashion-recommendation-engine/recommendation-types";

// ── Style Options ──────────────────────────────────────────
const STYLE_OPTIONS: { label: string; emoji: string; desc: string }[] = [
  { label: "Casual",           emoji: "👕", desc: "Santai & nyaman sehari-hari" },
  { label: "Smart Casual",     emoji: "🧥", desc: "Rapi namun tetap santai" },
  { label: "Business Casual",  emoji: "👔", desc: "Semi-formal untuk meeting" },
  { label: "Formal",           emoji: "🤵", desc: "Profesional & elegan" },
  { label: "Office Wear",      emoji: "💼", desc: "Pilihan terbaik untuk kantor" },
  { label: "Old Money",        emoji: "👒", desc: "Klasik, timeless, berkelas" },
  { label: "Minimalist",       emoji: "⬜", desc: "Bersih, simpel, esensial" },
  { label: "Elegant",          emoji: "✨", desc: "Anggun & sophisticated" },
  { label: "Chic",             emoji: "💅", desc: "Stylish & modern" },
  { label: "Luxury",           emoji: "💎", desc: "Premium & eksklusif" },
  { label: "Streetwear",       emoji: "🧢", desc: "Urban & ekspresif" },
  { label: "Sporty",           emoji: "⚡", desc: "Aktif & atletis" },
  { label: "Vintage",          emoji: "📻", desc: "Retro & nostalgik" },
  { label: "Feminine",         emoji: "🌸", desc: "Lembut & feminin" },
  { label: "Masculine",        emoji: "🔷", desc: "Maskulin & berkarakter" },
  { label: "Modest",           emoji: "🌙", desc: "Tertutup & anggun" },
  { label: "Monochrome",       emoji: "🖤", desc: "Satu palet, maksimal kesan" },
  { label: "Korean Inspired",  emoji: "🇰🇷", desc: "K-style modern & chic" },
  { label: "Japanese Inspired",emoji: "🗾", desc: "Minimalis & bersih" },
];

// ── Occasion Options ───────────────────────────────────────
const OCCASION_OPTIONS: { label: string; emoji: string }[] = [
  { label: "Daily",        emoji: "🌅" },
  { label: "Campus",       emoji: "🎓" },
  { label: "Office",       emoji: "💼" },
  { label: "Meeting",      emoji: "📊" },
  { label: "Wedding",      emoji: "💍" },
  { label: "Formal Event", emoji: "🎩" },
  { label: "Party",        emoji: "🎉" },
  { label: "Date",         emoji: "🌹" },
  { label: "Travel",       emoji: "✈️" },
  { label: "Vacation",     emoji: "🏖️" },
  { label: "Weekend",      emoji: "☀️" },
  { label: "Photoshoot",   emoji: "📸" },
  { label: "Gym",          emoji: "💪" },
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
    <div className="animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground shadow-sm">
            <Sparkles className="w-5 h-5" />
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
                    ? "bg-primary text-primary-foreground shadow-sm scale-110"
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

      {/* ── STEP 1: Style Selection ── */}
      {step === 1 && (
        <div>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Gaya apa yang Anda sukai?
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih hingga <span className="font-semibold text-primary">{MAX_STYLES} gaya</span> yang paling mencerminkan selera Anda.
              </p>
            </div>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {selectedStyles.length}/{MAX_STYLES}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {STYLE_OPTIONS.map(({ label, emoji, desc }) => {
              const isSelected = selectedStyles.includes(label);
              const isDisabled = !isSelected && selectedStyles.length >= MAX_STYLES;
              return (
                <button
                  key={label}
                  onClick={() => toggleStyle(label)}
                  disabled={isDisabled}
                  className={`relative group flex flex-col items-center text-center p-4 rounded-[var(--radius-card)] border-2 transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                      : isDisabled
                      ? "border-border/30 bg-muted/40 opacity-50 cursor-not-allowed"
                      : "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm hover:scale-[1.01]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-2xl mb-2 leading-none">{emoji}</span>
                  <span className={`text-sm font-semibold leading-tight mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Lewati langkah ini
            </button>
            <Button
              onClick={handleNext}
              disabled={selectedStyles.length === 0}
              className="rounded-[var(--radius-button)] h-11 px-6 font-semibold shadow-sm"
            >
              Lanjut <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Occasion Selection ── */}
      {step === 2 && (
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-foreground">
              Apa acara utama Anda?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI akan memprioritaskan pakaian yang paling sesuai untuk kesempatan ini. <span className="italic">(Opsional)</span>
            </p>
          </div>

          {/* Selected styles recap */}
          {selectedStyles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-[var(--radius-card)] bg-primary/5 border border-primary/20">
              <span className="text-xs text-primary font-semibold mr-1">Gaya dipilih:</span>
              {selectedStyles.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 bg-primary/15 text-primary rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
            {OCCASION_OPTIONS.map(({ label, emoji }) => {
              const isSelected = selectedOccasion === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedOccasion(isSelected ? undefined : label)}
                  className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-[var(--radius-card)] border-2 transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                      : "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm hover:scale-[1.01]"
                  }`}
                >
                  <span className="text-2xl mb-1.5 leading-none">{emoji}</span>
                  <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Lewati
              </button>
            </div>
            <Button
              onClick={handleNext}
              className="rounded-[var(--radius-button)] h-12 px-8 font-bold text-base shadow-md bg-gradient-to-r from-primary to-[#E14D72] hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Mulai Body Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
