import { FashionAnalysisProfile } from "../body-analysis-engine/analysis-types";
import { FashionRecommendationProfile, OutfitRecommendationItem } from "./recommendation-types";
import { shapeStyleMap, shapeClothingRules, genericShoes, genericAccessories, getTips } from "./recommendation-rules";

export class FashionRecommendationEngine {
  
  public generate(profile: FashionAnalysisProfile): FashionRecommendationProfile {
    const shape = profile.shape.shape;
    const proportions = profile.proportion.proportions;
    const colors = (profile.colorAnalysis.recommendedColors ?? []).map(c => c.name);

    // 1. Get Styles
    const styleInfo = shapeStyleMap[shape] || shapeStyleMap["Rectangle"];
    
    const recommendations: OutfitRecommendationItem[] = [];
    
    // 2. Tops
    const topsRules = shapeClothingRules[shape]?.tops || shapeClothingRules["Rectangle"].tops;
    topsRules.forEach((rule, index) => {
      recommendations.push({
        category: "top",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: colors.slice(0, 3), // suggest top 3 colors
        reason: rule.reason,
        compatibilityScore: 90 - (index * 5), // Deterministic pseudo-score
        priority: 1
      });
    });

    // 3. Bottoms
    const bottomsRules = shapeClothingRules[shape]?.bottoms || shapeClothingRules["Rectangle"].bottoms;
    bottomsRules.forEach((rule, index) => {
      recommendations.push({
        category: "bottom",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: colors.slice(1, 4).length > 0 ? colors.slice(1, 4) : colors, // Different subset for contrast
        reason: rule.reason,
        compatibilityScore: 88 - (index * 4),
        priority: 2
      });
    });

    // 4. Shoes
    genericShoes.forEach((rule, index) => {
      recommendations.push({
        category: "shoes",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: ["Hitam", "Putih", "Coklat"], // Neutral colors for shoes generally
        reason: rule.reason,
        compatibilityScore: 85 - (index * 3),
        priority: 3
      });
    });

    // 5. Accessories
    genericAccessories.forEach((rule, index) => {
      recommendations.push({
        category: "accessory",
        type: rule.type,
        style: rule.style,
        fit: rule.fit,
        colors: [],
        reason: rule.reason,
        compatibilityScore: 80 - (index * 2),
        priority: 4
      });
    });

    // 6. Tips
    const tips = getTips(shape, proportions);

    // 7. Summary
    const summary = `Berdasarkan analisis AI, bentuk tubuh Anda adalah ${shape} dengan tone warna ${profile.colorAnalysis.skinTone}. Gaya ${styleInfo.primary} sangat direkomendasikan untuk menyeimbangkan proporsi tubuh alami Anda, dikombinasikan dengan palet warna ${profile.colorAnalysis.seasonalColor} untuk membuat warna kulit Anda semakin bersinar.`;

    return {
      primaryStyle: styleInfo.primary,
      alternativeStyles: styleInfo.alternatives,
      recommendations,
      recommendedColors: profile.colorAnalysis.recommendedColors ?? [],
      avoidColors: profile.colorAnalysis.colorsToAvoid ?? [],
      tips,
      summary
    };
  }
}

export const fashionRecommendationEngine = new FashionRecommendationEngine();
