import {
  BodyShapeType,
  FemaleBodyShapeType,
  MaleBodyShapeType,
  BodyProportionType,
  FashionPersonaType,
} from "../body-analysis-engine/analysis-types";

// ============================================================
// STYLE MAP — Gender-specific
// ============================================================

export const femaleShapeStyleMap: Record<FemaleBodyShapeType, { primary: string; alternatives: string[] }> = {
  Hourglass: { primary: "Tailored Casual", alternatives: ["Elegant Casual", "Chic"] },
  Pear: { primary: "Smart Casual", alternatives: ["Relaxed", "Contemporary"] },
  Apple: { primary: "Relaxed Contemporary", alternatives: ["Casual Chic", "Minimalist"] },
  Rectangle: { primary: "Contemporary Casual", alternatives: ["Smart Casual", "Chic"] },
  "Inverted Triangle": { primary: "Balanced Contemporary", alternatives: ["Smart Casual", "Relaxed"] },
};

export const maleShapeStyleMap: Record<MaleBodyShapeType, { primary: string; alternatives: string[] }> = {
  Rectangle: { primary: "Smart Casual", alternatives: ["Contemporary", "Relaxed"] },
  Triangle: { primary: "Relaxed Contemporary", alternatives: ["Smart Casual", "Casual"] },
  "Inverted Triangle": { primary: "Contemporary Casual", alternatives: ["Relaxed", "Smart Casual"] },
  Oval: { primary: "Relaxed Contemporary", alternatives: ["Casual", "Smart Casual"] },
  Trapezoid: { primary: "Smart Casual", alternatives: ["Contemporary", "Casual"] },
};

// ============================================================
// CLOTHING RULES — Female
// ============================================================

export const femaleClothingRules: Record<
  FemaleBodyShapeType,
  {
    tops: { type: string; style: string; fit: string; reason: string }[];
    bottoms: { type: string; style: string; fit: string; reason: string }[];
    outers: { type: string; style: string; fit: string; reason: string }[];
  }
> = {
  Hourglass: {
    tops: [
      {
        type: "Atasan",
        style: "Knit Top",
        fit: "Fitted",
        reason:
          "Bahan rajut yang mengikuti bentuk tubuh menonjolkan lekuk alami pinggang dengan tampilan yang rapi dan elegan.",
      },
      {
        type: "Kemeja",
        style: "Shirt Dress",
        fit: "Regular Fit",
        reason:
          "Potongan shirt dress menegaskan garis pinggang secara alami sehingga proporsi tubuh tampak seimbang.",
      },
      {
        type: "Atasan",
        style: "Fitted Blouse",
        fit: "Slim Fit",
        reason:
          "Blus dengan potongan yang pas menyesuaikan lekuk tubuh dan menciptakan siluet yang bersih.",
      },
    ],
    bottoms: [
      {
        type: "Rok",
        style: "Midi Skirt",
        fit: "Regular Fit",
        reason:
          "Rok midi dengan potongan yang mengalir menekankan proporsi pinggul yang seimbang dan memberikan tampilan anggun.",
      },
      {
        type: "Celana",
        style: "Straight Jeans",
        fit: "Regular Fit",
        reason:
          "Garis lurus celana memberikan keseimbangan visual pada lekuk tubuh yang sudah proporsional.",
      },
      {
        type: "Rok",
        style: "Pleated Skirt",
        fit: "Regular Fit",
        reason:
          "Pleat yang rapi menambah volume yang elegan di area bawah tanpa kehilangan keseimbangan proporsi.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Oversized Blazer",
        fit: "Oversized",
        reason:
          "Blazer oversized di atas outfit yang pas menciptakan kontras siluet yang modern dan rapi.",
      },
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang memberikan siluet vertikal yang memanjangkan kesan tubuh secara keseluruhan.",
      },
    ],
  },

  Pear: {
    tops: [
      {
        type: "Atasan",
        style: "Oversized Blazer",
        fit: "Oversized",
        reason:
          "Blazer oversized menambah volume di bagian bahu sehingga menciptakan keseimbangan visual dengan lebar panggul.",
      },
      {
        type: "Atasan",
        style: "Knit Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan rajut yang jatuh bebas membingkai tubuh bagian atas dengan lembut dan menarik perhatian ke area bahu.",
      },
      {
        type: "Atasan",
        style: "Structured Top",
        fit: "Regular Fit",
        reason:
          "Detail struktural di bagian bahu membantu menyeimbangkan lebar panggul secara visual.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Wide Leg Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg mengalir merata dari pinggul ke bawah sehingga menyamarkan lebar panggul dengan elegan.",
      },
      {
        type: "Rok",
        style: "Midi Skirt",
        fit: "Regular Fit",
        reason:
          "Rok midi gelap menciptakan kesan ramping dan garis bersih dari pinggang ke bawah.",
      },
      {
        type: "Celana",
        style: "Straight Jeans",
        fit: "Regular Fit",
        reason:
          "Garis lurus dari pinggul ke bawah memberikan siluet yang seimbang dan tidak membesar di area tertentu.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Oversized Blazer",
        fit: "Oversized",
        reason:
          "Struktur blazer di area bahu menambah volume bagian atas dan menyeimbangkan proporsi secara keseluruhan.",
      },
      {
        type: "Outer",
        style: "Trench Coat",
        fit: "Regular Fit",
        reason:
          "Potongan trench coat yang lurus menciptakan garis vertikal yang memanjangkan siluet tubuh.",
      },
    ],
  },

  Apple: {
    tops: [
      {
        type: "Atasan",
        style: "Flowy Blouse",
        fit: "Relaxed Fit",
        reason:
          "Blus dengan bahan yang mengalir jatuh secara natural melewati area pinggang tanpa menekan atau menonjolkan.",
      },
      {
        type: "Atasan",
        style: "Knit Top",
        fit: "Relaxed Fit",
        reason:
          "Bahan rajut yang jatuh bebas memberikan kenyamanan sekaligus tampilan yang rapi dan modern.",
      },
      {
        type: "Dress",
        style: "Shirt Dress",
        fit: "Relaxed Fit",
        reason:
          "Shirt dress dengan potongan A-line mengalihkan perhatian dari area pinggang dan memberikan siluet yang bersih.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Wide Leg Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg menekankan panjang kaki dan menciptakan kesan siluet yang lebih proporsional.",
      },
      {
        type: "Rok",
        style: "Midi Skirt",
        fit: "Regular Fit",
        reason:
          "Rok midi menyembunyikan area pinggul dengan anggun sambil memperlihatkan betis yang jenjang.",
      },
      {
        type: "Dress",
        style: "Midi Dress",
        fit: "Relaxed Fit",
        reason:
          "Gaun midi mengalir dari atas ke bawah menciptakan garis vertikal yang memanjangkan penampilan secara keseluruhan.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Long Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan panjang menciptakan garis vertikal yang memanjangkan siluet dan menyamarkan area pinggang.",
      },
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang memberikan layer yang rapi dan garis vertikal yang menguntungkan proporsi tubuh.",
      },
    ],
  },

  Rectangle: {
    tops: [
      {
        type: "Atasan",
        style: "Knit Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan rajut menambah dimensi dan tekstur visual yang membuat siluet terlihat lebih hidup dan proporsional.",
      },
      {
        type: "Atasan",
        style: "Puff Sleeve Top",
        fit: "Regular Fit",
        reason:
          "Detail lengan yang bervolume secara visual memperlebar area bahu dan menciptakan kesan pinggang yang lebih terdefinisi.",
      },
      {
        type: "Atasan",
        style: "Ruched Top",
        fit: "Regular Fit",
        reason:
          "Detail ruched di area tengah menciptakan ilusi lekuk tubuh yang lebih terdefinisi.",
      },
    ],
    bottoms: [
      {
        type: "Rok",
        style: "Pleated Skirt",
        fit: "Regular Fit",
        reason:
          "Pleat memberikan volume di area pinggul sehingga menciptakan ilusi lekuk yang lebih terdefinisi.",
      },
      {
        type: "Celana",
        style: "Wide Leg Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg menambah volume di area bawah yang menciptakan kontras visual dan kesan lekuk tubuh.",
      },
      {
        type: "Rok",
        style: "Midi Skirt",
        fit: "Regular Fit",
        reason:
          "Rok midi yang mengembang di bagian bawah memberikan kesan bentuk tubuh yang lebih feminin.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Oversized Blazer",
        fit: "Oversized",
        reason:
          "Blazer oversized menambah volume dan dimensi yang menguntungkan pada tubuh dengan proporsi seragam.",
      },
      {
        type: "Jaket",
        style: "Denim Jacket",
        fit: "Regular Fit",
        reason:
          "Jaket denim yang berstruktur memberikan kesan bahu yang lebih terdefinisi.",
      },
    ],
  },

  "Inverted Triangle": {
    tops: [
      {
        type: "Atasan",
        style: "Scoop Neck Top",
        fit: "Regular Fit",
        reason:
          "Potongan scoop neck yang lebar secara visual mereduksi lebar bahu dan menyeimbangkan proporsi.",
      },
      {
        type: "Atasan",
        style: "Basic Tee",
        fit: "Regular Fit",
        reason:
          "Kaos polos tanpa detail berlebihan menjaga tampilan bagian atas tetap sederhana dan seimbang.",
      },
      {
        type: "Atasan",
        style: "Knit Top",
        fit: "Slim Fit",
        reason:
          "Atasan rajut polos tanpa detail bahu menjaga fokus visual pada proporsi tubuh secara keseluruhan.",
      },
    ],
    bottoms: [
      {
        type: "Rok",
        style: "Pleated Skirt",
        fit: "Regular Fit",
        reason:
          "Pleat menambah volume di area pinggul yang secara visual menyeimbangkan lebar bahu.",
      },
      {
        type: "Celana",
        style: "Wide Leg Pants",
        fit: "Relaxed Fit",
        reason:
          "Volume celana wide leg menyeimbangkan bagian atas tubuh yang lebih lebar.",
      },
      {
        type: "Rok",
        style: "Midi Skirt",
        fit: "Regular Fit",
        reason:
          "Rok yang melebar ke bawah menyeimbangkan siluet keseluruhan dan menciptakan proporsi yang harmonis.",
      },
    ],
    outers: [
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang menciptakan garis vertikal yang mengalihkan perhatian dari lebar bahu.",
      },
      {
        type: "Jaket",
        style: "Knit Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan panjang memberikan garis vertikal yang menyeimbangkan siluet secara keseluruhan.",
      },
    ],
  },
};

// ============================================================
// CLOTHING RULES — Male
// ============================================================

export const maleClothingRules: Record<
  MaleBodyShapeType,
  {
    tops: { type: string; style: string; fit: string; reason: string }[];
    bottoms: { type: string; style: string; fit: string; reason: string }[];
    outers: { type: string; style: string; fit: string; reason: string }[];
  }
> = {
  Rectangle: {
    tops: [
      {
        type: "Kemeja",
        style: "Oversized Shirt",
        fit: "Relaxed Fit",
        reason:
          "Kemeja dengan potongan longgar menambah dimensi dan struktur visual yang membuat siluet terlihat lebih berkarakter.",
      },
      {
        type: "Atasan",
        style: "Knit Sweater",
        fit: "Regular Fit",
        reason:
          "Sweater rajut menambah tekstur dan volume yang menciptakan kesan tubuh lebih berstruktur.",
      },
      {
        type: "Kemeja",
        style: "Breton Stripe Shirt",
        fit: "Regular Fit",
        reason:
          "Motif garis horizontal memberikan ilusi bahu dan dada yang lebih berisi.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Straight Pants",
        fit: "Regular Fit",
        reason:
          "Celana lurus yang bersih menjaga tampilan keseluruhan tetap proporsional dan rapi.",
      },
      {
        type: "Celana",
        style: "Wide Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg menambah volume di bagian bawah yang menciptakan kesan proporsi yang lebih seimbang.",
      },
      {
        type: "Celana",
        style: "Cargo Pants",
        fit: "Relaxed Fit",
        reason:
          "Detail kantong samping menambah volume visual di area pinggul yang menyeimbangkan siluet keseluruhan.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Oversized Shirt (layer)",
        fit: "Oversized",
        reason:
          "Layer kemeja oversized di atas kaos dasar menciptakan dimensi visual yang menarik.",
      },
      {
        type: "Outer",
        style: "Denim Jacket",
        fit: "Regular Fit",
        reason:
          "Jaket denim berstruktur memberikan definisi pada area bahu dan menciptakan siluet yang lebih berkarakter.",
      },
    ],
  },

  Triangle: {
    tops: [
      {
        type: "Jaket",
        style: "Bomber Jacket",
        fit: "Regular Fit",
        reason:
          "Struktur jaket bomber menambah volume di area bahu dan dada untuk menyeimbangkan pinggul yang lebih lebar.",
      },
      {
        type: "Kemeja",
        style: "Oversized Shirt",
        fit: "Oversized",
        reason:
          "Kemeja oversized menyamarkan area pinggang yang lebih lebar dan menarik perhatian ke bagian atas tubuh.",
      },
      {
        type: "Atasan",
        style: "Knit Sweater",
        fit: "Regular Fit",
        reason:
          "Sweater rajut menambah volume di area dada dan bahu untuk menciptakan keseimbangan visual.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Straight Pants",
        fit: "Regular Fit",
        reason:
          "Garis lurus celana memberikan siluet yang bersih dari pinggul ke bawah.",
      },
      {
        type: "Celana",
        style: "Wide Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide mengalir merata dan menyamarkan area pinggul tanpa menekan.",
      },
      {
        type: "Celana",
        style: "Dark Chinos",
        fit: "Regular Fit",
        reason:
          "Warna gelap pada bawahan membantu merampingkan area bawah secara visual.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Bomber Jacket",
        fit: "Regular Fit",
        reason:
          "Struktur dan volume jaket bomber di bahu menyeimbangkan pinggul yang lebih lebar.",
      },
      {
        type: "Outer",
        style: "Denim Jacket",
        fit: "Regular Fit",
        reason:
          "Jaket denim berstruktur menambah volume bahu dan menciptakan keseimbangan visual.",
      },
    ],
  },

  "Inverted Triangle": {
    tops: [
      {
        type: "Atasan",
        style: "Knit Sweater",
        fit: "Regular Fit",
        reason:
          "Sweater rajut dengan detail yang minimal menjaga tampilan bagian atas tetap sederhana dan seimbang.",
      },
      {
        type: "Kemeja",
        style: "Relaxed Shirt",
        fit: "Relaxed Fit",
        reason:
          "Kemeja dengan potongan relaxed menghindari penekanan pada lebar bahu.",
      },
      {
        type: "Atasan",
        style: "Cardigan",
        fit: "Regular Fit",
        reason:
          "Kardigan memberikan layer yang rapi tanpa menambah volume berlebih di area bahu.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Wide Pants",
        fit: "Relaxed Fit",
        reason:
          "Volume celana wide leg menyeimbangkan bahu yang lebar dan menciptakan siluet yang harmonis.",
      },
      {
        type: "Celana",
        style: "Cargo Pants",
        fit: "Relaxed Fit",
        reason:
          "Detail kantong menambah volume di area pinggul sehingga menyeimbangkan lebar bahu.",
      },
      {
        type: "Celana",
        style: "Straight Pants",
        fit: "Regular Fit",
        reason:
          "Celana lurus memberikan volume yang cukup di bagian bawah untuk menyeimbangkan siluet.",
      },
    ],
    outers: [
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang menciptakan garis vertikal yang mengalihkan perhatian dari lebar bahu.",
      },
      {
        type: "Outer",
        style: "Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan panjang memberikan layer vertikal yang menyeimbangkan siluet secara keseluruhan.",
      },
    ],
  },

  Oval: {
    tops: [
      {
        type: "Kemeja",
        style: "Oversized Shirt",
        fit: "Relaxed Fit",
        reason:
          "Kemeja oversize dengan bahan yang jatuh bebas memberikan kenyamanan dan menyamarkan area perut secara natural.",
      },
      {
        type: "Atasan",
        style: "Knit Sweater",
        fit: "Relaxed Fit",
        reason:
          "Bahan rajut yang mengalir memberikan tampilan yang rapi tanpa menekan area perut.",
      },
      {
        type: "Kemeja",
        style: "Linen Shirt",
        fit: "Relaxed Fit",
        reason:
          "Bahan linen yang ringan jatuh secara natural dan memberikan tampilan yang bersih.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Wide Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg dengan pinggang elastis memberikan kenyamanan dan menciptakan garis vertikal yang rapi.",
      },
      {
        type: "Celana",
        style: "Straight Pants",
        fit: "Regular Fit",
        reason:
          "Garis lurus celana memberikan efek memanjangkan kaki dan menyeimbangkan area perut.",
      },
      {
        type: "Celana",
        style: "Drawstring Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana drawstring fleksibel dan nyaman di area pinggang sambil tetap memberikan tampilan yang rapi.",
      },
    ],
    outers: [
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang memberikan garis vertikal yang memanjangkan siluet secara keseluruhan.",
      },
      {
        type: "Jaket",
        style: "Open Cardigan",
        fit: "Relaxed Fit",
        reason:
          "Kardigan terbuka menciptakan garis vertikal yang memberikan efek visual yang lebih ramping.",
      },
    ],
  },

  Trapezoid: {
    tops: [
      {
        type: "Kemeja",
        style: "Oversized Shirt",
        fit: "Relaxed Fit",
        reason:
          "Kemeja oversized menekankan proporsi tubuh yang sudah ideal dengan tampilan yang modern dan nyaman.",
      },
      {
        type: "Atasan",
        style: "Knit Sweater",
        fit: "Regular Fit",
        reason:
          "Sweater rajut pas mengikuti bentuk tubuh yang proporsional dan memberikan tampilan yang clean.",
      },
      {
        type: "Kemeja",
        style: "Button-Down Shirt",
        fit: "Regular Fit",
        reason:
          "Kemeja button-down yang rapi cocok sempurna dengan proporsi tubuh Trapezoid yang ideal.",
      },
    ],
    bottoms: [
      {
        type: "Celana",
        style: "Straight Pants",
        fit: "Regular Fit",
        reason:
          "Celana lurus yang proporsional melengkapi siluet tubuh yang sudah seimbang.",
      },
      {
        type: "Celana",
        style: "Wide Pants",
        fit: "Relaxed Fit",
        reason:
          "Celana wide leg memberikan tampilan modern yang melengkapi proporsi tubuh yang baik.",
      },
      {
        type: "Celana",
        style: "Chino Pants",
        fit: "Regular Fit",
        reason:
          "Chino pants yang serbaguna cocok dengan hampir semua atasan dan menjaga tampilan keseluruhan tetap rapi.",
      },
    ],
    outers: [
      {
        type: "Jaket",
        style: "Denim Jacket",
        fit: "Regular Fit",
        reason:
          "Jaket denim berstruktur menonjolkan proporsi bahu yang proporsional.",
      },
      {
        type: "Outer",
        style: "Long Coat",
        fit: "Regular Fit",
        reason:
          "Mantel panjang memberikan tampilan yang elegan dan menegaskan siluet keseluruhan yang baik.",
      },
    ],
  },
};

// ============================================================
// SHOES — Gender-specific
// ============================================================

export const femaleShoes = [
  {
    type: "Sepatu",
    style: "White Sneakers",
    fit: "Standard",
    reason: "Sepatu putih yang bersih memberikan sentuhan kasual yang segar dan mudah dipadukan.",
  },
  {
    type: "Sepatu",
    style: "Loafers",
    fit: "Standard",
    reason: "Loafers memberikan tampilan yang rapi namun santai dan cocok untuk berbagai kesempatan.",
  },
  {
    type: "Sepatu",
    style: "Mary Jane",
    fit: "Standard",
    reason: "Mary Jane menambah sentuhan feminin yang manis dan elegan pada tampilan keseluruhan.",
  },
];

export const maleShoes = [
  {
    type: "Sepatu",
    style: "White Sneakers",
    fit: "Standard",
    reason: "Sneakers putih yang bersih serbaguna dan dapat dipadukan dengan hampir semua gaya kasual.",
  },
  {
    type: "Sepatu",
    style: "Loafers",
    fit: "Standard",
    reason: "Loafers memberikan tampilan yang rapi dan berkelas tanpa terlalu formal.",
  },
  {
    type: "Sepatu",
    style: "Clean Sneakers",
    fit: "Standard",
    reason: "Sneakers dengan desain minimal memberikan tampilan yang bersih dan modern.",
  },
];

// ============================================================
// ACCESSORIES — Gender-specific
// ============================================================

export const femaleAccessories = [
  {
    type: "Aksesori",
    style: "Shoulder Bag",
    fit: "Standard",
    reason: "Tas bahu berukuran sedang memberikan keseimbangan proporsi dan daya guna yang tinggi.",
  },
  {
    type: "Aksesori",
    style: "Tote Bag",
    fit: "Standard",
    reason: "Tote bag besar yang bersih memberikan tampilan effortless dan modern.",
  },
  {
    type: "Aksesori",
    style: "Minimalist Watch",
    fit: "Standard",
    reason: "Jam tangan tipis dengan dial yang bersih menambah detail elegan tanpa kesan berlebihan.",
  },
];

export const maleAccessories = [
  {
    type: "Aksesori",
    style: "Minimalist Watch",
    fit: "Standard",
    reason: "Jam tangan bergaya minimalis menambah detail yang elegan pada tampilan keseluruhan.",
  },
  {
    type: "Aksesori",
    style: "Tote Bag",
    fit: "Standard",
    reason: "Tote bag yang simpel memberikan tampilan yang fungsional sekaligus stylish.",
  },
  {
    type: "Aksesori",
    style: "Canvas Backpack",
    fit: "Standard",
    reason: "Tas ransel kanvas yang bersih cocok untuk berbagai aktivitas dengan tampilan yang kasual.",
  },
];

// ============================================================
// TIPS — Gender-aware
// ============================================================

export function getTips(
  shape: BodyShapeType,
  proportions: BodyProportionType[],
  gender: "Female" | "Male" | "Unknown" = "Unknown"
): string[] {
  const tips: string[] = [];

  // Shape-specific tips
  if (gender === "Female") {
    if (shape === "Hourglass") {
      tips.push("Manfaatkan ikat pinggang tipis untuk menegaskan lekuk pinggang yang sudah proporsional.");
      tips.push("Pakaian dengan potongan yang pas akan menonjolkan lekuk alami tubuh dengan indah.");
    } else if (shape === "Pear") {
      tips.push("Gunakan warna yang lebih terang pada atasan untuk menarik perhatian ke bagian atas tubuh.");
      tips.push("Bawahan berwarna gelap dan bertekstur minimal membantu menyeimbangkan lebar panggul.");
    } else if (shape === "Apple") {
      tips.push("Pilih bahan yang jatuh secara natural untuk tampilan yang nyaman dan rapi sekaligus.");
      tips.push("Aksesori di bagian leher seperti kalung panjang menciptakan garis vertikal yang menguntungkan.");
    } else if (shape === "Rectangle") {
      tips.push("Eksperimen dengan belt atau ikat pinggang untuk menciptakan kesan lekuk di area tengah.");
      tips.push("Pakaian dengan detail tekstur atau layer menambah dimensi visual yang menarik.");
    } else if (shape === "Inverted Triangle") {
      tips.push("Fokuskan detail dan warna menarik pada bawahan untuk menyeimbangkan lebar bahu.");
      tips.push("Hindari detail berlebihan di area bahu seperti bantalan atau ruffles.");
    }
  } else if (gender === "Male") {
    if (shape === "Rectangle") {
      tips.push("Eksperimen dengan layer pakaian untuk menambah dimensi dan kedalaman visual pada tampilan.");
      tips.push("Pilih outer layer seperti jaket atau kemeja terbuka untuk menciptakan siluet yang lebih berkarakter.");
    } else if (shape === "Triangle") {
      tips.push("Gunakan warna cerah atau motif pada atasan dan warna netral pada bawahan untuk keseimbangan.");
      tips.push("Pilih outer layer dengan struktur bahu yang jelas untuk memperlebar area atas secara visual.");
    } else if (shape === "Inverted Triangle") {
      tips.push("Pilih celana dengan volume yang cukup untuk menyeimbangkan bahu yang lebar.");
      tips.push("Hindari pakaian yang terlalu sempit di bawah agar proporsi keseluruhan tetap harmonis.");
    } else if (shape === "Oval") {
      tips.push("Gunakan garis vertikal pada pakaian untuk menciptakan efek visual yang lebih proporsional.");
      tips.push("Pilih bahan yang jatuh secara natural agar tampilan tetap rapi dan nyaman.");
    } else if (shape === "Trapezoid") {
      tips.push("Hampir semua gaya pakaian akan cocok dengan proporsi tubuh Anda yang ideal.");
      tips.push("Eksplorasi berbagai potongan dan tekstur untuk menemukan gaya personal yang paling mewakili Anda.");
    }
  } else {
    // Unknown
    tips.push("Pilih pakaian dengan potongan yang bersih dan tidak berlebihan untuk tampilan yang rapi.");
    tips.push("Warna netral seperti putih, krem, atau abu menjadi pilihan yang aman dan mudah dipadukan.");
  }

  // Proportion tips
  if (proportions.includes("Long Legs")) {
    tips.push("Manfaatkan panjang kaki dengan menggunakan celana berpotongan lebar yang mengalir indah.");
  }
  if (proportions.includes("Short Torso")) {
    tips.push("Hindari memasukkan baju ke dalam celana agar torso tidak terlihat semakin pendek.");
  }
  if (proportions.includes("Long Torso")) {
    tips.push("Celana atau rok berpotongan high-waist membantu menyeimbangkan panjang torso secara visual.");
  }
  if (proportions.includes("Broad Shoulders")) {
    tips.push("Hindari kerah yang terlalu lebar atau detail bahu yang berlebihan.");
  }
  if (proportions.includes("Narrow Shoulders")) {
    tips.push("Detail di area bahu seperti epaulette atau potongan yang struktural membantu menciptakan kesan bahu lebih lebar.");
  }

  // Filler tips if needed
  const generics = [
    "Percaya diri adalah kunci utama tampilan yang menarik — kenali dan hargai proporsi tubuh Anda.",
    "Selalu pilih bahan yang nyaman di kulit, karena kenyamanan adalah bagian dari penampilan terbaik.",
    "Sesuaikan pilihan pakaian dengan aktivitas dan suasana agar tampilan selalu tepat sasaran.",
    "Perawatan pakaian yang baik menjaga tampilan tetap segar dan rapi setiap saat.",
    "Jangan ragu untuk mencoba kombinasi warna baru yang tetap harmonis satu sama lain.",
  ];

  while (tips.length < 5) {
    tips.push(generics[tips.length % generics.length]);
  }

  return tips.slice(0, 5);
}

// ============================================================
// FASHION PERSONA — STYLE MAP
// ============================================================

export const personaStyleDescriptions: Record<FashionPersonaType, string> = {
  Minimalist: "tampilan bersih dan simpel dengan detail yang seminimal mungkin",
  Elegant: "siluet yang anggun dengan potongan yang rapi dan bahan berkualitas",
  Casual: "tampilan santai namun tetap rapi dan nyaman untuk keseharian",
  Chic: "perpaduan elemen yang sophisticated dengan sentuhan modern",
  Feminine: "tampilan yang lembut dan feminin dengan detail yang halus",
  Streetwear: "gaya urban yang ekspresif dengan sentuhan kontemporer",
  "Smart Casual": "perpaduan antara rapi dan santai yang sesuai untuk berbagai kesempatan",
  Relaxed: "tampilan santai yang nyaman namun tetap memiliki komposisi yang baik",
  Contemporary: "gaya modern yang mengikuti estetika masa kini dengan pendekatan yang segar",
  Classic: "tampilan timeless yang selalu relevan dan tidak mengikuti tren sesaat",
  Unknown: "tampilan yang seimbang dan proporsional",
};
