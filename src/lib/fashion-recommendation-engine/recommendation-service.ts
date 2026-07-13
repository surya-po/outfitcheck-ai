import { FashionAnalysisProfile, GenderType, FashionPersonaType } from "../body-analysis-engine/analysis-types";
import { FashionRecommendationProfile, OutfitRecommendationItem } from "./recommendation-types";
import {
  femaleShapeStyleMap,
  maleShapeStyleMap,
  femaleClothingRules,
  maleClothingRules,
  femaleShoes,
  maleShoes,
  femaleAccessories,
  maleAccessories,
  getTips,
  personaStyleDescriptions,
} from "./recommendation-rules";
import { FemaleBodyShapeType, MaleBodyShapeType } from "../body-analysis-engine/analysis-types";

export class FashionRecommendationEngine {

  public generate(profile: FashionAnalysisProfile): FashionRecommendationProfile {
    const shape = profile.shape.shape;
    const proportions = profile.proportion.proportions;
    const colors = (profile.colorAnalysis.recommendedColors ?? []).map((c) => c.name);
    const gender: GenderType = profile.gender || profile.colorAnalysis.gender || "Unknown";
    const fashionPersona: FashionPersonaType =
      profile.fashionPersona || profile.colorAnalysis.fashionPersona || "Unknown";

    const recommendations: OutfitRecommendationItem[] = [];

    // ── Select gender-appropriate rules ──
    let styleInfo: { primary: string; alternatives: string[] };
    let clothingRules: {
      tops: { type: string; style: string; fit: string; reason: string }[];
      bottoms: { type: string; style: string; fit: string; reason: string }[];
      outers: { type: string; style: string; fit: string; reason: string }[];
    };
    let shoes: { type: string; style: string; fit: string; reason: string }[];
    let accessories: { type: string; style: string; fit: string; reason: string }[];

    if (gender === "Female") {
      const femaleShape = shape as FemaleBodyShapeType;
      styleInfo =
        femaleShapeStyleMap[femaleShape] || femaleShapeStyleMap["Rectangle"];
      clothingRules =
        femaleClothingRules[femaleShape] || femaleClothingRules["Rectangle"];
      shoes = femaleShoes;
      accessories = femaleAccessories;
    } else if (gender === "Male") {
      const maleShape = shape as MaleBodyShapeType;
      styleInfo =
        maleShapeStyleMap[maleShape] || maleShapeStyleMap["Rectangle"];
      clothingRules =
        maleClothingRules[maleShape] || maleClothingRules["Rectangle"];
      shoes = maleShoes;
      accessories = maleAccessories;
    } else {
      // Unknown — use neutral fallback (female rules as base, more neutral items)
      styleInfo = { primary: "Contemporary Casual", alternatives: ["Smart Casual", "Relaxed"] };
      clothingRules = femaleClothingRules["Rectangle"];
      shoes = femaleShoes;
      accessories = femaleAccessories;
    }

    // ── Tops ──
    clothingRules.tops.forEach((rule, index) => {
      recommendations.push({
        category: "top",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: colors.slice(0, 3),
        reason: rule.reason,
        compatibilityScore: 90 - index * 5,
        priority: 1,
      });
    });

    // ── Bottoms ──
    clothingRules.bottoms.forEach((rule, index) => {
      recommendations.push({
        category: "bottom",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: colors.slice(1, 4).length > 0 ? colors.slice(1, 4) : colors,
        reason: rule.reason,
        compatibilityScore: 88 - index * 4,
        priority: 2,
      });
    });

    // ── Outers ──
    clothingRules.outers.forEach((rule, index) => {
      recommendations.push({
        category: "outer",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: colors.slice(0, 2),
        reason: rule.reason,
        compatibilityScore: 86 - index * 3,
        priority: 3,
      });
    });

    // ── Shoes ──
    shoes.forEach((rule, index) => {
      recommendations.push({
        category: "shoes",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: ["Putih", "Hitam", "Krem"],
        reason: rule.reason,
        compatibilityScore: 84 - index * 3,
        priority: 4,
      });
    });

    // ── Accessories ──
    accessories.forEach((rule, index) => {
      recommendations.push({
        category: "accessory",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: [],
        reason: rule.reason,
        compatibilityScore: 80 - index * 2,
        priority: 5,
      });
    });

    // ── Tips ──
    const tips = getTips(shape, proportions, gender);

    // ── Summary — Stylist-quality, gender-aware, no style names ──
    const summary = this.buildSummary(
      profile,
      gender,
      fashionPersona
    );

    return {
      gender,
      fashionPersona,
      primaryStyle: styleInfo.primary,
      alternativeStyles: styleInfo.alternatives,
      recommendations,
      recommendedColors: profile.colorAnalysis.recommendedColors ?? [],
      avoidColors: profile.colorAnalysis.colorsToAvoid ?? [],
      tips,
      summary,
    };
  }

  private buildSummary(
    profile: FashionAnalysisProfile,
    gender: GenderType,
    fashionPersona: FashionPersonaType
  ): string {
    const shape = profile.shape.shape;
    const skinTone = profile.colorAnalysis.skinTone || "kulit Anda";
    const undertone = profile.colorAnalysis.undertone;
    const personaDesc = personaStyleDescriptions[fashionPersona] || "tampilan yang seimbang dan proporsional";

    // Gender-specific body shape description
    let shapeDesc = "";
    if (gender === "Female") {
      const femaleShapeDescriptions: Record<string, string> = {
        Hourglass:
          "Bentuk tubuh Hourglass dengan lekuk pinggang yang terdefinisi dan keseimbangan antara bahu dan panggul yang proporsional.",
        Pear:
          "Bentuk tubuh Pear dengan panggul yang lebih lebar dibandingkan bahu menciptakan siluet feminin yang alami.",
        Apple:
          "Bentuk tubuh Apple dengan volume di area tengah yang memberikan peluang untuk bereksperimen dengan siluet yang mengalir.",
        Rectangle:
          "Bentuk tubuh Rectangle dengan bahu, pinggang, dan panggul yang relatif seimbang memberikan fleksibilitas styling yang luar biasa.",
        "Inverted Triangle":
          "Bentuk tubuh Inverted Triangle dengan bahu yang lebih lebar memberikan kesan atletis dan kuat yang anggun.",
      };
      shapeDesc = femaleShapeDescriptions[shape] || `Bentuk tubuh ${shape} Anda memiliki karakteristik unik.`;
    } else if (gender === "Male") {
      const maleShapeDescriptions: Record<string, string> = {
        Rectangle:
          "Bentuk tubuh Rectangle dengan bahu, pinggang, dan pinggul yang seimbang memberikan proporsi yang bersih dan serbaguna.",
        Triangle:
          "Bentuk tubuh Triangle dengan pinggul yang lebih lebar dari bahu memerlukan perhatian khusus pada keseimbangan proporsi atas dan bawah.",
        "Inverted Triangle":
          "Bentuk tubuh Inverted Triangle dengan bahu yang lebar mencerminkan fisik yang atletis dan berkarakter.",
        Oval:
          "Bentuk tubuh Oval dengan volume di area tengah dapat dimanfaatkan dengan pemilihan potongan yang tepat untuk siluet yang proporsional.",
        Trapezoid:
          "Bentuk tubuh Trapezoid dengan bahu yang sedikit lebih lebar dari pinggul adalah proporsi yang sangat ideal untuk hampir semua gaya pakaian.",
      };
      shapeDesc = maleShapeDescriptions[shape] || `Bentuk tubuh ${shape} Anda memiliki karakteristik unik.`;
    } else {
      shapeDesc = `Bentuk tubuh ${shape} Anda memberikan karakter tersendiri pada penampilan.`;
    }

    // Undertone-based color advice
    let colorAdvice = "";
    if (undertone === "Hangat") {
      colorAdvice =
        "Dengan undertone hangat, warna-warna earth tone seperti krem, beige, olive, dan cokelat lembut akan menjadi pilihan yang sangat harmonis dengan warna kulit Anda, menciptakan tampilan yang hangat dan bercahaya.";
    } else if (undertone === "Dingin") {
      colorAdvice =
        "Dengan undertone dingin, warna-warna soft tone seperti lavender, dusty blue, dusty pink, serta warna netral seperti putih bersih dan abu-abu memberikan kontras yang segar dan elegan dengan warna kulit Anda.";
    } else if (undertone === "Netral") {
      colorAdvice =
        "Dengan undertone netral, Anda memiliki keleluasaan memilih dari berbagai palet warna — mulai dari warna netral yang bersih hingga earth tone yang hangat dan soft tone yang lembut.";
    } else {
      colorAdvice = `Berdasarkan analisis warna kulit ${skinTone}, palet warna netral dan earth tone yang lembut akan memberikan tampilan yang harmonis.`;
    }

    const paragraph1 = `${shapeDesc} Berdasarkan analisis AI, karakter fashion Anda cenderung mengarah pada ${personaDesc}. ${profile.shape.details}`;
    const paragraph2 = `${colorAdvice} Kombinasi ini akan membantu Anda tampil dengan siluet yang proporsional, bersih, dan memiliki kesan yang modern sekaligus nyaman sepanjang hari.`;

    return `${paragraph1}\n\n${paragraph2}`;
  }
}

export const fashionRecommendationEngine = new FashionRecommendationEngine();
