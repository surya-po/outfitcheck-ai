"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      q: "How accurate is OutfitCheck?",
      a: "Our advanced computer vision models achieve over 95% accuracy in body shape and undertone detection when provided with a clear, well-lit photograph.",
    },
    {
      q: "Is my photo stored?",
      a: "No. Your privacy is paramount. Photos are processed in real-time in memory and immediately discarded. We do not store, share, or train our models on your personal images.",
    },
    {
      q: "Can boutiques integrate OutfitCheck?",
      a: "Yes. We offer a robust B2B API and dashboard for fashion retailers. Check out our 'Growing Business' and 'Enterprise' plans for more details.",
    },
    {
      q: "Does OutfitCheck recommend clothing sizes?",
      a: "While we don't provide exact sizing (as sizing varies drastically by brand), we recommend silhouettes, cuts, and styles that best flatter your specific proportions.",
    },
    {
      q: "How long does analysis take?",
      a: "The entire process, from uploading your photo to receiving your personalized style profile and outfit recommendations, takes less than 5 seconds.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-muted/20" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-border rounded-3xl transition-all duration-300 overflow-hidden ${
                openIndex === i ? "bg-white shadow-sm" : "bg-transparent hover:bg-white/50"
              }`}
            >
              <button
                className="w-full px-8 py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-bold font-heading text-foreground pr-8">
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  openIndex === i ? "bg-primary text-white" : "bg-secondary/30 text-primary"
                }`}>
                  {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <div 
                className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
