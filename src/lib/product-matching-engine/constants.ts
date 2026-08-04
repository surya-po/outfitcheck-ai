export const MATCHING_WEIGHTS = {
  PERSONA_MATCH: 35,  // User-selected persona — highest priority
  BODY_SHAPE: 25,     // Body shape compatibility
  SKIN_TONE: 15,      // Skin tone / undertone match
  COLOR: 10,          // Recommended color palette match
  STYLE: 7,           // AI-detected style alignment
  FIT: 5,             // Fit type match
  SEASON: 3,          // Seasonal color match
};

export const MAX_SCORE =
  MATCHING_WEIGHTS.PERSONA_MATCH +
  MATCHING_WEIGHTS.BODY_SHAPE +
  MATCHING_WEIGHTS.SKIN_TONE +
  MATCHING_WEIGHTS.COLOR +
  MATCHING_WEIGHTS.STYLE +
  MATCHING_WEIGHTS.FIT +
  MATCHING_WEIGHTS.SEASON; // = 100
