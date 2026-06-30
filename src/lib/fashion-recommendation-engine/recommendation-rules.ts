import { BodyShapeType, BodyProportionType } from "../body-analysis-engine/analysis-types";

// Map shape to a recommended primary style and alternative styles
export const shapeStyleMap: Record<BodyShapeType, { primary: string, alternatives: string[] }> = {
  "Rectangle": { primary: "Smart Casual", alternatives: ["Minimalist", "Streetwear"] },
  "Triangle": { primary: "Streetwear", alternatives: ["Relaxed Casual", "Korean Casual"] },
  "Inverted Triangle": { primary: "Athleisure", alternatives: ["Smart Casual", "Minimalist"] },
  "Trapezoid": { primary: "Classic Menswear", alternatives: ["Smart Casual", "Old Money"] },
  "Oval": { primary: "Relaxed Casual", alternatives: ["Monochrome", "Streetwear"] },
  "Hourglass": { primary: "Tailored Casual", alternatives: ["Smart Casual", "Korean Casual"] }
};

// Map body shape to clothing rules (tops, bottoms)
export const shapeClothingRules: Record<BodyShapeType, {
  tops: { type: string, style: string, fit: string, reason: string }[],
  bottoms: { type: string, style: string, fit: string, reason: string }[]
}> = {
  "Rectangle": {
    tops: [
      { type: "Kemeja", style: "Oxford Shirt", fit: "Regular Fit", reason: "Menambah dimensi pada bagian bahu." },
      { type: "Jaket", style: "Structured Blazer", fit: "Regular Fit", reason: "Memberikan siluet bahu yang lebih tegas." },
      { type: "Kaos", style: "Breton Stripe Tee", fit: "Slim Fit", reason: "Motif horizontal memberi ilusi dada yang lebih bidang." }
    ],
    bottoms: [
      { type: "Celana", style: "Chino Pants", fit: "Slim Fit", reason: "Menjaga proporsi kaki tetap rapi." },
      { type: "Celana", style: "Pleated Trousers", fit: "Regular Fit", reason: "Memberikan sedikit volume pada area pinggul." },
      { type: "Jeans", style: "Straight Jeans", fit: "Regular Fit", reason: "Klasik dan menyeimbangkan bentuk tubuh lurus." }
    ]
  },
  "Triangle": {
    tops: [
      { type: "Jaket", style: "Bomber Jacket", fit: "Relaxed Fit", reason: "Menambah volume di bagian bahu untuk menyeimbangkan pinggul." },
      { type: "Kemeja", style: "Oversized Shirt", fit: "Oversized", reason: "Menyamarkan area pinggang yang lebih lebar." },
      { type: "Kaos", style: "Polo Shirt", fit: "Regular Fit", reason: "Kerah membantu menarik perhatian ke area dada." }
    ],
    bottoms: [
      { type: "Celana", style: "Wide Leg Pants", fit: "Relaxed Fit", reason: "Menyamarkan lebar pinggul." },
      { type: "Jeans", style: "Straight Jeans", fit: "Regular Fit", reason: "Memberikan garis lurus dari pinggul ke bawah." },
      { type: "Celana", style: "Dark Chinos", fit: "Regular Fit", reason: "Warna gelap membantu merampingkan area bawah." }
    ]
  },
  "Inverted Triangle": {
    tops: [
      { type: "Kaos", style: "V-Neck Tee", fit: "Slim Fit", reason: "Menyeimbangkan bahu yang lebar dengan garis vertikal." },
      { type: "Kemeja", style: "Slim Fit Shirt", fit: "Slim Fit", reason: "Menonjolkan bentuk V tubuh secara natural." },
      { type: "Kaos", style: "Henley Shirt", fit: "Regular Fit", reason: "Memberikan detail di area dada tanpa menambah lebar bahu." }
    ],
    bottoms: [
      { type: "Celana", style: "Cargo Pants", fit: "Relaxed Fit", reason: "Menambah volume di area kaki untuk menyeimbangkan bahu." },
      { type: "Jeans", style: "Relaxed Jeans", fit: "Relaxed Fit", reason: "Menambah proporsi di bagian bawah." },
      { type: "Celana", style: "Chino Pants", fit: "Straight Fit", reason: "Memberikan garis siluet yang seimbang." }
    ]
  },
  "Trapezoid": {
    tops: [
      { type: "Kemeja", style: "Button-Down Shirt", fit: "Regular Fit", reason: "Cocok sempurna dengan proporsi tubuh ideal ini." },
      { type: "Jaket", style: "Denim Jacket", fit: "Regular Fit", reason: "Menekankan struktur tubuh bagian atas." },
      { type: "Kaos", style: "Crewneck Tee", fit: "Slim Fit", reason: "Menonjolkan siluet alami tubuh bagian atas." }
    ],
    bottoms: [
      { type: "Jeans", style: "Slim Straight Jeans", fit: "Slim Fit", reason: "Proporsional dengan lebar bahu dan dada." },
      { type: "Celana", style: "Tailored Trousers", fit: "Slim Fit", reason: "Memberikan tampilan rapi dan proporsional." },
      { type: "Celana", style: "Chino Pants", fit: "Regular Fit", reason: "Nyaman dan serbaguna untuk segala aktivitas." }
    ]
  },
  "Oval": {
    tops: [
      { type: "Kemeja", style: "Camp Collar Shirt", fit: "Relaxed Fit", reason: "Kerah terbuka memberi kesan leher lebih jenjang." },
      { type: "Jaket", style: "Harrington Jacket", fit: "Regular Fit", reason: "Potongan lurus menyamarkan area perut." },
      { type: "Kaos", style: "Oversized Tee", fit: "Oversized", reason: "Menyamarkan lekuk tubuh di area perut dengan nyaman." }
    ],
    bottoms: [
      { type: "Celana", style: "High-Waist Trousers", fit: "Regular Fit", reason: "Memanjangkan siluet kaki dan nyaman di pinggang." },
      { type: "Jeans", style: "Straight Jeans", fit: "Regular Fit", reason: "Garis lurus menyeimbangkan volume tubuh bagian atas." },
      { type: "Celana", style: "Drawstring Pants", fit: "Relaxed Fit", reason: "Fleksibel dan nyaman di area pinggang." }
    ]
  },
  "Hourglass": {
    tops: [
      { type: "Kemeja", style: "Fitted Shirt", fit: "Slim Fit", reason: "Menonjolkan proporsi tubuh yang seimbang." },
      { type: "Kaos", style: "Turtleneck", fit: "Slim Fit", reason: "Menonjolkan garis leher dan dada." },
      { type: "Jaket", style: "Cropped Jacket", fit: "Regular Fit", reason: "Menekankan garis pinggang." }
    ],
    bottoms: [
      { type: "Celana", style: "High-Waist Wide Leg", fit: "Relaxed Fit", reason: "Menonjolkan pinggang sekaligus menyeimbangkan bahu." },
      { type: "Jeans", style: "Bootcut Jeans", fit: "Regular Fit", reason: "Menyeimbangkan lekuk tubuh secara keseluruhan." },
      { type: "Celana", style: "Pleated Trousers", fit: "Regular Fit", reason: "Memberikan volume elegan pada area pinggul." }
    ]
  }
};

// Generic Shoes and Accessories (Can be diversified later)
export const genericShoes = [
  { type: "Sepatu", style: "White Sneakers", fit: "Standard", reason: "Serbaguna dan cocok untuk hampir semua gaya kasual." },
  { type: "Sepatu", style: "Chelsea Boots", fit: "Standard", reason: "Memberikan kesan elegan dan memanjangkan siluet kaki." },
  { type: "Sepatu", style: "Loafers", fit: "Standard", reason: "Cocok untuk gaya Smart Casual yang rapi tanpa tali." }
];

export const genericAccessories = [
  { type: "Aksesori", style: "Minimalist Watch", fit: "Standard", reason: "Menambah detail gaya tanpa kesan berlebihan." },
  { type: "Aksesori", style: "Leather Belt", fit: "Standard", reason: "Membantu menegaskan garis pinggang." },
  { type: "Aksesori", style: "Sunglasses", fit: "Standard", reason: "Memberikan sentuhan akhir yang stylish." }
];

export function getTips(shape: BodyShapeType, proportions: BodyProportionType[]): string[] {
  const tips: string[] = [];

  // Shape tips
  if (shape === "Rectangle") {
    tips.push("Gunakan layer (lapisan pakaian) untuk menambah dimensi pada bentuk tubuh lurus.");
    tips.push("Pilih pakaian dengan motif horizontal untuk memberi ilusi bahu lebih lebar.");
  } else if (shape === "Triangle") {
    tips.push("Gunakan warna lebih cerah pada atasan dan gelap pada bawahan untuk menyeimbangkan proporsi.");
    tips.push("Pilih atasan berkerah struktur untuk memperlebar area bahu.");
  } else if (shape === "Inverted Triangle") {
    tips.push("Hindari bantalan bahu yang berlebihan agar bagian atas tidak terlihat terlalu berat.");
    tips.push("Celana dengan saku samping (cargo) sangat baik untuk menyeimbangkan lebar bahu Anda.");
  } else if (shape === "Trapezoid") {
    tips.push("Anda memiliki proporsi ideal, hampiri semua gaya pakaian akan terlihat cocok.");
    tips.push("Gunakan celana slim fit untuk menegaskan siluet kaki Anda yang proporsional.");
  } else if (shape === "Oval") {
    tips.push("Gunakan garis vertikal untuk memberikan efek melangsingkan.");
    tips.push("Hindari pakaian yang terlalu ketat; pilih bahan yang jatuh secara natural.");
  } else if (shape === "Hourglass") {
    tips.push("Gunakan pakaian yang menonjolkan area pinggang.");
    tips.push("Hindari pakaian yang terlalu kebesaran agar lekuk alami tubuh tidak tenggelam.");
  }

  // Proportion tips
  if (proportions.includes("Long Legs")) {
    tips.push("Gunakan atasan dengan warna kontras untuk memperlihatkan jenjang kaki Anda.");
  }
  if (proportions.includes("Short Torso")) {
    tips.push("Hindari memasukkan baju terlalu dalam agar torso tidak terlihat semakin pendek.");
  }
  if (proportions.includes("Long Torso")) {
    tips.push("Gunakan celana berpotongan high-waist untuk menyeimbangkan panjang torso.");
  }
  if (proportions.includes("Broad Shoulders")) {
    tips.push("Pilih kerah V-neck untuk mengalihkan fokus dari bahu lebar.");
  }
  if (proportions.includes("Narrow Shoulders")) {
    tips.push("Kemeja dengan detail di pundak (epaulettes) akan sangat membantu.");
  }

  // Ensure exactly 5 tips by adding generics if needed
  const generics = [
    "Selalu setrika pakaian Anda untuk tampilan yang lebih profesional.",
    "Sesuaikan warna sepatu dengan warna ikat pinggang untuk tampilan yang padu.",
    "Percaya diri adalah aksesoris terbaik yang bisa Anda pakai.",
    "Jangan takut bereksperimen dengan warna baru yang disarankan AI.",
    "Sesuaikan pakaian dengan cuaca dan jenis acara."
  ];

  while (tips.length < 5) {
    tips.push(generics[tips.length % generics.length]);
  }

  return tips.slice(0, 5);
}
