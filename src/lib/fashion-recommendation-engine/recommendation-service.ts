import { FashionAnalysisProfile, GenderType, FashionPersonaType } from "../body-analysis-engine/analysis-types";
import { FashionRecommendationProfile, OutfitRecommendationItem, UserStylePreference } from "./recommendation-types";
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
import {
  applyStylePreferenceBoost,
  buildPreferenceExplanation,
  isStyleCompatibleWithOccasion,
} from "./style-preference-rules";
import { FemaleBodyShapeType, MaleBodyShapeType } from "../body-analysis-engine/analysis-types";

interface ScoredRule {
  type: string;
  style: string;
  fit: string;
  reason: string;
  score: number;
}

export class FashionRecommendationEngine {

  public generate(
    profile: FashionAnalysisProfile,
    userStylePreference?: UserStylePreference
  ): FashionRecommendationProfile {
    const profileObj = profile.fashionProfile;
    const primaryShape = profileObj?.primaryShape || profile.shape.primaryShape || "Rectangle";
    const secondaryShape = profileObj?.secondaryShape || profile.shape.secondaryShape;
    const primaryConfidence = profileObj?.primaryConfidence ?? (profile.shape as any).primaryConfidence ?? profile.shape.confidence ?? 0.8;
    const secondaryConfidence = profileObj?.secondaryConfidence ?? (profile.shape as any).secondaryConfidence ?? 0;

    const proportions = profile.proportion.proportions;
    const colors = (profile.colorAnalysis.recommendedColors ?? []).map((c) => c.name);
    const gender: GenderType = profileObj?.gender as GenderType || profile.gender || profile.colorAnalysis.gender || "Unknown";
    const fashionPersona: FashionPersonaType = profile.fashionPersona || profile.colorAnalysis.fashionPersona || "Unknown";

    const recommendations: OutfitRecommendationItem[] = [];

    // --- RULE BLENDING CHECK ---
    // Primary Confidence < 90% AND Secondary Confidence >= 65% AND Difference <= 15%
    let isBlendingEnabled = false;
    if (
      primaryConfidence < 0.90 &&
      secondaryConfidence >= 0.65 &&
      (primaryConfidence - secondaryConfidence) <= 0.15 &&
      secondaryShape
    ) {
      isBlendingEnabled = true;
    }

    // ── Select gender-appropriate rules ──
    let primaryStyleInfo: { primary: string; alternatives: string[] };
    let secondaryStyleInfo: { primary: string; alternatives: string[] } | undefined;
    
    let primaryClothing: any;
    let secondaryClothing: any;
    
    let shoes: any[];
    let accessories: any[];

    if (gender === "Female") {
      primaryStyleInfo = femaleShapeStyleMap[primaryShape as FemaleBodyShapeType] || femaleShapeStyleMap["Rectangle"];
      primaryClothing = femaleClothingRules[primaryShape as FemaleBodyShapeType] || femaleClothingRules["Rectangle"];
      if (isBlendingEnabled && secondaryShape) {
        secondaryStyleInfo = femaleShapeStyleMap[secondaryShape as FemaleBodyShapeType];
        secondaryClothing = femaleClothingRules[secondaryShape as FemaleBodyShapeType];
      }
      shoes = femaleShoes;
      accessories = femaleAccessories;
    } else if (gender === "Male") {
      primaryStyleInfo = maleShapeStyleMap[primaryShape as MaleBodyShapeType] || maleShapeStyleMap["Rectangle"];
      primaryClothing = maleClothingRules[primaryShape as MaleBodyShapeType] || maleClothingRules["Rectangle"];
      if (isBlendingEnabled && secondaryShape) {
        secondaryStyleInfo = maleShapeStyleMap[secondaryShape as MaleBodyShapeType];
        secondaryClothing = maleClothingRules[secondaryShape as MaleBodyShapeType];
      }
      shoes = maleShoes;
      accessories = maleAccessories;
    } else {
      primaryStyleInfo = { primary: "Contemporary Casual", alternatives: ["Smart Casual", "Relaxed"] };
      primaryClothing = femaleClothingRules["Rectangle"];
      shoes = femaleShoes;
      accessories = femaleAccessories;
    }

    // Blend Styles
    const finalPrimaryStyle = primaryStyleInfo.primary;
    let finalAlternatives = [...primaryStyleInfo.alternatives];
    if (isBlendingEnabled && secondaryStyleInfo) {
      finalAlternatives = [...new Set([...finalAlternatives, secondaryStyleInfo.primary, ...secondaryStyleInfo.alternatives])];
    }

    // Blend Rules Helper
    const compileRules = (primaryRules: any[], secondaryRules: any[] | undefined): ScoredRule[] => {
      const result: ScoredRule[] = [];
      
      primaryRules.forEach((rule, idx) => {
        const weight = rule.weight || (30 - idx * 5); // 30, 25, 20
        const score = primaryConfidence * weight;
        result.push({ ...rule, score });
      });

      if (isBlendingEnabled && secondaryRules) {
        secondaryRules.forEach((rule, idx) => {
          const weight = rule.weight || (30 - idx * 5);
          const score = secondaryConfidence * weight;
          
          const existing = result.find(r => r.style === rule.style);
          if (existing) {
            existing.score += score;
          } else {
            result.push({ ...rule, score });
          }
        });
      }
      return result.sort((a, b) => b.score - a.score);
    };

    const blendedTops = compileRules(primaryClothing.tops, secondaryClothing?.tops);
    const blendedBottoms = compileRules(primaryClothing.bottoms, secondaryClothing?.bottoms);
    const blendedOuters = compileRules(primaryClothing.outers, secondaryClothing?.outers);
    const blendedShoes = compileRules(shoes, undefined);
    const blendedAccessories = compileRules(accessories, undefined);

    const fashionPreference = profile.fashionPreference || "STANDARD";
    const isWearingHijab = profile.isWearingHijab || false;
    const isModest = fashionPreference === "MODEST" || isWearingHijab;

    const effectivePreference = userStylePreference ?? profile.userStylePreference;
    const preferredStyles = effectivePreference?.preferredStyles?.length ? effectivePreference.preferredStyles : [];
    const preferredOccasion = effectivePreference?.preferredOccasion;
    const compatibleStyles = preferredStyles.filter((s) => isStyleCompatibleWithOccasion(s, preferredOccasion));

    // Modesty Filter
    const filterRules = (rules: ScoredRule[]) => {
      if (!isModest) return rules;
      const { modestBlockedItems } = require("./recommendation-rules");
      const blockedLower = modestBlockedItems.map((item: string) => item.toLowerCase());
      return rules.filter(rule => {
        const typeLower = rule.type.toLowerCase();
        const styleLower = rule.style.toLowerCase();
        return !blockedLower.some((blocked: string) => typeLower.includes(blocked) || styleLower.includes(blocked));
      });
    };

    let filteredTops = filterRules(blendedTops);
    let filteredBottoms = filterRules(blendedBottoms);
    let filteredOuters = filterRules(blendedOuters);
    let filteredShoes = filterRules(blendedShoes);
    let filteredAccessories = filterRules(blendedAccessories);

    if (isModest) {
      if (filteredTops.length < 2) {
        filteredTops.unshift({ type: "Atasan", style: "Long Sleeve Tunic", fit: "Relaxed Fit", reason: "Tunik lengan panjang memberikan siluet proporsional dan tertutup.", score: 99 });
      }
      if (filteredBottoms.length < 2) {
        filteredBottoms.unshift({ type: "Celana", style: "Wide Leg Pants", fit: "Relaxed Fit", reason: "Potongan longgar menyeimbangkan siluet dengan elegan.", score: 99 });
      }
      if (filteredOuters.length < 2) {
        filteredOuters.unshift({ type: "Outer", style: "Long Outerwear", fit: "Regular Fit", reason: "Outer panjang menciptakan dimensi dan terstruktur.", score: 99 });
      }
    }

    // Boost based on style preference
    const boostedTops = applyStylePreferenceBoost(filteredTops, compatibleStyles, preferredOccasion);
    const boostedBottoms = applyStylePreferenceBoost(filteredBottoms, compatibleStyles, preferredOccasion);
    const boostedOuters = applyStylePreferenceBoost(filteredOuters, compatibleStyles, preferredOccasion);
    const boostedShoes = applyStylePreferenceBoost(filteredShoes, compatibleStyles, preferredOccasion);
    const boostedAccessories = applyStylePreferenceBoost(filteredAccessories, compatibleStyles, preferredOccasion);

    boostedTops.forEach((rule: any, index) => {
      recommendations.push({
        category: "top", type: rule.type, style: rule.style, fit: rule.fit,
        colors: colors.slice(0, 3), reason: rule.reason, compatibilityScore: 90 - index * 5, priority: 1,
      });
    });

    boostedBottoms.forEach((rule: any, index) => {
      recommendations.push({
        category: "bottom", type: rule.type, style: rule.style, fit: rule.fit,
        colors: colors.slice(1, 4).length > 0 ? colors.slice(1, 4) : colors, reason: rule.reason, compatibilityScore: 88 - index * 4, priority: 2,
      });
    });

    boostedOuters.forEach((rule: any, index) => {
      recommendations.push({
        category: "outer", type: rule.type, style: rule.style, fit: rule.fit,
        colors: colors.slice(0, 2), reason: rule.reason, compatibilityScore: 86 - index * 3, priority: 3,
      });
    });

    boostedShoes.forEach((rule: any, index) => {
      recommendations.push({
        category: "shoes", type: rule.type, style: rule.style, fit: rule.fit,
        colors: ["Putih", "Hitam", "Krem"], reason: rule.reason, compatibilityScore: 84 - index * 3, priority: 4,
      });
    });

    boostedAccessories.forEach((rule: any, index) => {
      recommendations.push({
        category: "accessory", type: rule.type, style: rule.style, fit: rule.fit,
        colors: [], reason: rule.reason, compatibilityScore: 80 - index * 2, priority: 5,
      });
    });

    const tips = getTips(primaryShape, proportions, gender);

    const preferenceExplanation = compatibleStyles.length > 0
      ? buildPreferenceExplanation(compatibleStyles, preferredOccasion, String(primaryShape), profile.colorAnalysis.skinTone || "")
      : undefined;

    const summary = this.buildSummary(
      profile, gender, fashionPersona, compatibleStyles, preferredOccasion,
      primaryShape, secondaryShape, primaryConfidence, secondaryConfidence, isBlendingEnabled
    );

    return {
      gender,
      fashionPersona,
      fashionPreference,
      isWearingHijab,
      primaryStyle: finalPrimaryStyle,
      alternativeStyles: finalAlternatives,
      recommendations,
      recommendedColors: profile.colorAnalysis.recommendedColors ?? [],
      avoidColors: profile.colorAnalysis.colorsToAvoid ?? [],
      tips,
      summary,
      preferredStyles: compatibleStyles,
      preferredOccasion,
      preferenceExplanation,
      // Pass debug info if needed
      debug: {
        primaryShape,
        secondaryShape,
        primaryConfidence,
        secondaryConfidence,
        isBlendingEnabled
      }
    } as any;
  }

  private buildSummary(
    profile: FashionAnalysisProfile,
    gender: GenderType,
    fashionPersona: FashionPersonaType,
    preferredStyles: string[] | undefined,
    preferredOccasion: string | undefined,
    primaryShape: string,
    secondaryShape: string | undefined,
    primaryConf: number,
    secondaryConf: number,
    isBlending: boolean
  ): string {
    const skinTone = profile.colorAnalysis.skinTone || "kulit Anda";
    const undertone = profile.colorAnalysis.undertone;
    const personaDesc = personaStyleDescriptions[fashionPersona] || "tampilan yang seimbang dan proporsional";

    let shapeDesc = "";
    if (isBlending && secondaryShape) {
      shapeDesc = `Bentuk tubuh Anda paling mendekati siluet ${primaryShape}. Namun, terdapat beberapa karakteristik ${secondaryShape} pada proporsi Anda sehingga rekomendasi pakaian kami formulasikan secara khusus untuk mengakomodasi kedua karakteristik tersebut agar siluet tetap harmonis.`;
    } else {
      shapeDesc = `Bentuk tubuh Anda adalah ${primaryShape}. Karakteristik proporsi ini sangat ideal jika dipadukan dengan potongan yang mampu menonjolkan kelebihan alami siluet Anda.`;
    }

    let colorAdvice = "";
    if (undertone === "Hangat") {
      colorAdvice = "Warna-warna hangat seperti earth tones sangat harmonis dengan undertone Anda.";
    } else if (undertone === "Dingin") {
      colorAdvice = "Warna-warna dingin seperti jewel tones dan pastel akan membuat kulit Anda tampak cerah.";
    } else {
      colorAdvice = `Berdasarkan warna kulit ${skinTone}, palet netral memberikan keseimbangan yang pas.`;
    }
    
    let preferenceDesc = `Karakter fashion Anda difokuskan pada gaya yang elegan.`;
    if (profile.isWearingHijab || profile.fashionPreference === "MODEST") {
      preferenceDesc = `Analisis menunjukkan preferensi terhadap Modest Fashion, sehingga pilihan pakaian difokuskan pada potongan tertutup, layering yang anggun, dan nyaman tanpa kehilangan elemen gaya.`;
    } else if (profile.fashionPreference) {
      preferenceDesc = `Pilihan Anda pada gaya ${profile.fashionPreference.toLowerCase()} menjadi fondasi dalam membangun rekomendasi ini.`;
    }

    let stylePreferenceDesc = "";
    if (preferredStyles && preferredStyles.length > 0) {
      const styleList = preferredStyles.join(", ");
      const occasionNote = preferredOccasion ? ` untuk keperluan ${preferredOccasion}` : "";
      stylePreferenceDesc = ` Gaya spesifik seperti ${styleList}${occasionNote} telah diintegrasikan secara personal ke dalam pilihan item Anda.`;
    }

    return `${shapeDesc} ${preferenceDesc}${stylePreferenceDesc}\n\n${colorAdvice} Kombinasi ini akan membantu Anda tampil dengan proporsi yang sempurna dan merepresentasikan karakter Anda secara maksimal.`;
  }
}

export const fashionRecommendationEngine = new FashionRecommendationEngine();
