export interface FullOutfit {
  name: string;
  style: string;
  matchScore: number;
  description: string;
  items: string[];
}

export function generateOutfitRecommendations(
  profile: any,
  isHijab: boolean = false,
  preferredStyles?: string[],
  preferredOccasion?: string
): FullOutfit[] {
  const primaryShape = (profile?.primaryShape || profile?.bodyShape || "").toLowerCase();
  const secondaryShape = (profile?.secondaryShape || "").toLowerCase();
  const primaryConf = profile?.primaryConfidence ?? profile?.confidence ?? 0.8;
  const secondaryConf = profile?.secondaryConfidence ?? 0;
  const gender = (profile?.gender || "Unknown").toLowerCase();

  const STYLE_OUTFIT_KEYWORDS: Record<string, string[]> = {
    Formal: ["formal", "professional", "structured", "setelan", "elegant"],
    "Office Wear": ["professional", "office", "structured", "smart"],
    Business: ["professional", "structured", "setelan", "elegant"],
    "Business Casual": ["smart", "casual", "professional", "chic"],
    "Smart Casual": ["smart", "casual", "chic"],
    Casual: ["casual", "everyday", "relaxed", "weekend"],
    Minimalist: ["minimalist", "clean", "classic", "monokrom"],
    Elegant: ["elegant", "chic", "sophisticated"],
    Chic: ["chic", "elegant", "structured"],
    Luxury: ["elegant", "sophisticated", "luxury"],
    Streetwear: ["streetwear", "urban", "layered", "oversized"],
    Sporty: ["sporty", "athletic", "casual", "gym"],
    Vintage: ["vintage", "retro", "classic"],
    Feminine: ["feminine", "floral", "summer", "wrap"],
    Masculine: ["masculine", "structured", "cargo", "casual"],
    Modest: ["modest", "layered", "casual", "everyday"],
    Monochrome: ["monochrome", "minimalist", "classic"],
    "Korean Inspired": ["casual", "chic", "minimalist"],
    "Japanese Inspired": ["minimalist", "clean", "relaxed"],
    "Old Money": ["elegant", "classic", "structured", "smart"],
  };

  const OCCASION_DEMOTE_STYLES: Record<string, string[]> = {
    Office: ["sporty", "streetwear", "gym", "athletic", "casual"],
    Meeting: ["sporty", "streetwear", "casual"],
    "Formal Event": ["sporty", "streetwear", "casual", "urban"],
    Wedding: ["sporty", "streetwear", "casual"],
    Gym: ["elegant", "formal", "professional"],
  };

  const getOutfitsForShape = (shape: string): FullOutfit[] => {
    if (isHijab) {
      if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
        return [
          { name: "Kasual Modest", style: "Kasual", matchScore: 96, description: "Cocok untuk memberikan ilusi lekuk tubuh yang sopan dan proporsional.", items: ["Tunik A-Line", "Celana Kulot Longgar", "Pashmina Ceruty", "Flat Shoes"] },
          { name: "Elegansi Berlapis", style: "Elegan", matchScore: 92, description: "Menambahkan dimensi pada postur lurus dengan outer.", items: ["Long Outer/Cardigan", "Blus Basic Longgar", "Rok Plisket", "Hijab Segiempat"] },
          { name: "Minimalis Klasik", style: "Minimalis", matchScore: 89, description: "Tampilan bersih dan rapi dengan potongan tertutup.", items: ["Kemeja Oversized", "Celana Straight Fit (Bukan Ketat)", "Loafers", "Hijab Instan Menutup Dada"] }
        ];
      }
      if (shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) {
        return [
          { name: "Modest A-Line", style: "Kasual Modern", matchScore: 95, description: "Menyamarkan panggul dengan tunik berpotongan A-Line yang sopan.", items: ["Tunik A-Line Panjang", "Celana Straight Hitam", "Pashmina Instan", "Platform Sandals"] },
          { name: "Modest Berstruktur", style: "Profesional", matchScore: 93, description: "Mempertegas bahu dengan outer untuk menyeimbangkan proporsi tubuh.", items: ["Blazer Berstruktur", "Kemeja Putih Lengan Panjang", "Rok A-Line Maxi", "Hijab Segiempat Paris"] },
          { name: "Santai Sehari-Hari", style: "Santai", matchScore: 88, description: "Nyaman dan menyeimbangkan proporsi bagian bawah dengan gaya tertutup.", items: ["Sweater Oversized", "Rok Plisket Jatuh", "Sneakers", "Pashmina Kaos"] }
        ];
      }
      if (shape.includes("hourglass") || shape.includes("jam pasir")) {
        return [
          { name: "Modest Elegan", style: "Kasual Elegan", matchScore: 97, description: "Menjaga proporsi alami dengan potongan longgar yang tetap elegan.", items: ["Gamis Berpotongan Princess", "Hijab Segiempat Motif", "Heels Tertutup", "Tas Tangan Klasik"] },
          { name: "Berlapis Chic", style: "Chic", matchScore: 94, description: "Gaya layering yang modern dan sopan.", items: ["Blus Lengan Balon", "Vest Rajut", "Rok Maxi A-Line", "Pashmina Silk"] },
          { name: "Kasual Harian", style: "Kasual", matchScore: 91, description: "Tampilan harian yang nyaman dan tertutup sempurna.", items: ["Kemeja Tunik Linen", "Celana Kulot Linen", "Flat Shoes", "Hijab Voal"] }
        ];
      }
      if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik")) {
        return [
          { name: "Aliran Minimalis", style: "Minimalis", matchScore: 96, description: "Mengurangi fokus pada bahu dan memberi volume pada bagian bawah.", items: ["Blus Lengan Raglan (Longgar)", "Rok Plisket Lebar", "Hijab Segiempat Polos", "Sneakers Minimalis"] },
          { name: "Santai Rapi", style: "Kasual Rapi", matchScore: 92, description: "Atasan jatuh natural tanpa bantalan bahu, dipadukan kulot lebar.", items: ["Kemeja Rayon Jatuh", "Celana Kulot Lebar", "Pashmina Sifon", "Sepatu Loafers"] },
          { name: "Volume Kasual", style: "Kasual", matchScore: 89, description: "Kombinasi yang memberi volume ekstra pada bagian panggul dan kaki secara sopan.", items: ["Sweater Rajut Ringan", "Rok Maxi Ruffle", "Hijab Instan", "Sepatu Flat"] }
        ];
      }
      if (shape.includes("pear") || shape.includes("pir") || shape.includes("apple") || shape.includes("apel")) {
        return [
          { name: "Modest Seimbang", style: "Kasual Rapi", matchScore: 95, description: "Menggunakan siluet longgar yang jatuh lurus untuk menyamarkan proporsi secara elegan.", items: ["Long Tunik Bergaris Vertikal", "Celana Bahan Lurus", "Hijab Polos Senada", "Sepatu Block Heels"] },
          { name: "Nyaman Berlapis", style: "Nyaman", matchScore: 93, description: "Menambahkan layer luar panjang untuk siluet tubuh vertikal.", items: ["Long Cardigan / Abaya Outer", "Kaos Manset Hitam", "Rok A-Line Gelap", "Pashmina Inner"] },
          { name: "Gamis Mengalir", style: "Elegan", matchScore: 88, description: "Gamis potongan lebar yang nyaman dan menutupi lekuk tubuh.", items: ["Gamis Syar'i Potongan Umbrella", "Khimar / Hijab Lebar", "Sepatu Flat Nyaman", "Bros Minimalis"] }
        ];
      }
      return [{ name: "Serbaguna Modest", style: "Kasual", matchScore: 90, description: "Tampilan aman, sopan, dan nyaman yang cocok untuk hampir semua bentuk tubuh.", items: ["Tunik Kemeja Basic", "Celana Kulot Standar", "Hijab Segiempat Voal", "Sneakers/Flat Shoes"] }];
    }

    if (gender === "female") {
      if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
        return [
          { name: "Feminin Kasual", style: "Kasual", matchScore: 96, description: "Cocok untuk memberikan ilusi lekuk tubuh.", items: ["Blus Wrap", "Celana High-Waist Wide Leg", "Heels Pendek", "Tas Selempang Kecil"] },
          { name: "Chic Streetwear", style: "Streetwear", matchScore: 92, description: "Menambahkan dimensi dengan teknik layering.", items: ["Crop Top Basic", "Oversized Blazer", "Celana Jeans Lurus", "Sneakers Chunky"] },
          { name: "Minimalis Klasik", style: "Minimalis", matchScore: 89, description: "Tampilan bersih yang menonjolkan proporsi tubuh.", items: ["Kaos Ribbed Pas Badan", "Rok Midi A-Line", "Sepatu Loafers", "Ikat Pinggang Kulit"] }
        ];
      }
      if ((shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) || shape.includes("pear") || shape.includes("pir")) {
        return [
          { name: "Modern Seimbang", style: "Kasual Modern", matchScore: 95, description: "Menyeimbangkan proporsi dengan memusatkan perhatian pada tubuh bagian atas.", items: ["Atasan Off-Shoulder", "Celana Kulot Gelap", "Sandal Strappy", "Kalung Statement"] },
          { name: "Profesional Berstruktur", style: "Profesional", matchScore: 93, description: "Mempertegas garis bahu untuk menyeimbangkan pinggul lebar.", items: ["Blazer Berstruktur", "Kemeja Sutra", "Rok Pensil Panjang Medium", "Sepatu Pumps"] },
          { name: "Santai Akhir Pekan", style: "Santai", matchScore: 88, description: "Gaya nyaman yang menyeimbangkan proporsi bagian bawah.", items: ["Jaket Kulit Cropped", "Kaos Putih", "Celana Jeans Bootcut", "Sneakers Putih"] }
        ];
      }
      if (shape.includes("hourglass") || shape.includes("jam pasir")) {
        return [
          { name: "Elegan Chic", style: "Kasual Elegan", matchScore: 97, description: "Menonjolkan proporsi tubuh yang sudah seimbang secara alami.", items: ["Bodycon Dress Panjang Medium", "Outer Tipis Transparan", "Heels Runcing", "Sabuk Tipis di Pinggang"] },
          { name: "Kasual Pas Badan", style: "Kasual", matchScore: 94, description: "Tampilan kasual yang rapi dan pas di badan.", items: ["Atasan Turtleneck Ketat", "Celana Skinny High-Waist", "Sepatu Boots Ankle", "Aksesoris Emas"] },
          { name: "Segar Feminin", style: "Feminin", matchScore: 91, description: "Ringan namun tetap menonjolkan siluet tubuh yang proporsional.", items: ["Wrap Dress Motif Bunga", "Tas Anyaman", "Sandal Wedges", "Kacamata Hitam Besar"] }
        ];
      }
      if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik")) {
        return [
          { name: "Aliran Minimalis", style: "Minimalis", matchScore: 96, description: "Mengurangi fokus pada bahu dan memberi volume ekstra pada pinggul.", items: ["Kaos V-Neck Longgar", "Rok A-Line / Rok Lipit", "Sepatu Flat", "Jam Tangan Rantai"] },
          { name: "Santai Rapi", style: "Kasual Rapi", matchScore: 92, description: "Atasan yang jatuh natural tanpa struktur tambahan di bahu.", items: ["Kemeja Tanpa Kerah (Collarless)", "Celana Palazzo (Lebar di Bawah)", "Sepatu Mules", "Tas Tote Lebar"] },
          { name: "Urban Kasual", style: "Urban", matchScore: 89, description: "Kombinasi yang menarik perhatian ke area bawah tubuh.", items: ["Tank Top Simple", "Celana Boyfriend Jeans Berwarna Cerah", "Sneakers Platform", "Gelang Bertumpuk"] }
        ];
      }
      return [{ name: "Serbaguna Wanita", style: "Kasual", matchScore: 90, description: "Tampilan aman dan menawan yang cocok untuk hampir semua bentuk tubuh wanita.", items: ["Blus Katun Basic", "Celana Jeans Straight Fit", "Flat Shoes / Sneakers Putih", "Tas Bahu Minimalis"] }];
    }

    if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
      return [
        { name: "Kasual Rapi", style: "Kasual Rapi", matchScore: 96, description: "Cocok untuk memberikan ilusi bentuk dan bahu yang lebih bidang.", items: ["Kemeja Oxford Biru", "Celana Chino Slim Fit Beige", "Sepatu Loafers", "Jam Tangan Kulit"] },
        { name: "Streetwear Berlapis", style: "Streetwear", matchScore: 92, description: "Menambahkan dimensi pada postur lurus.", items: ["Kemeja Flannel Terbuka", "Kaos Basic Hitam", "Celana Cargo", "Sepatu Kanvas Hitam"] }
      ];
    }
    if ((shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) || shape.includes("oval") || shape.includes("apel") || shape.includes("apple")) {
      return [
        { name: "Profesional Berstruktur", style: "Profesional", matchScore: 95, description: "Mempertegas garis bahu untuk menyeimbangkan proporsi area perut/pinggul.", items: ["Blazer Berstruktur Gelap", "Kemeja Kerah Kaku", "Celana Potongan Lurus", "Sepatu Oxford"] },
        { name: "Santai Akhir Pekan", style: "Santai", matchScore: 91, description: "Nyaman dan menyamarkan lekuk bagian bawah/tengah.", items: ["Jaket Denim Berpotongan Kotak", "Kaos Kerah V (V-Neck)", "Celana Jeans Gelap Lurus", "Sneakers Chunky"] }
      ];
    }
    if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik") || shape.includes("trapezoid")) {
      return [
        { name: "Kasual Atletis", style: "Kasual", matchScore: 97, description: "Menonjolkan bahu bidang secara proporsional.", items: ["Kaos Polo Fit / Kaos Henley", "Celana Jeans Slim Straight", "Sepatu Sneakers Putih", "Kacamata Aviator"] },
        { name: "Minimalis Modern", style: "Minimalis", matchScore: 93, description: "Tampilan bersih tanpa bantalan bahu ekstra.", items: ["Kemeja Lengan Pendek Minimalis", "Celana Chino Berwarna Terang", "Sepatu Derby Suede", "Ikat Pinggang Ramping"] }
      ];
    }
    return [{ name: "Serbaguna Harian", style: "Kasual", matchScore: 90, description: "Tampilan kasual aman yang cocok untuk aktivitas harian pria.", items: ["Kaos Polos Basic", "Celana Jeans Straight Fit", "Sneakers Nyaman", "Jam Tangan Casual"] }];
  };

  // BLENDING LOGIC
  let isBlendingEnabled = false;
  if (primaryConf < 0.90 && secondaryConf >= 0.65 && (primaryConf - secondaryConf) <= 0.15 && secondaryShape) {
    isBlendingEnabled = true;
  }

  let outfits = getOutfitsForShape(primaryShape).map(o => ({ ...o, matchScore: o.matchScore * primaryConf }));
  
  if (isBlendingEnabled) {
    const secOutfits = getOutfitsForShape(secondaryShape).map(o => ({ ...o, matchScore: o.matchScore * secondaryConf }));
    // Merge avoiding duplicates by name
    secOutfits.forEach(so => {
      if (!outfits.find(o => o.name === so.name)) {
        outfits.push(so);
      }
    });
  }

  // Normalize scores back to 100 scale roughly
  outfits = outfits.map(o => ({ ...o, matchScore: Math.min(99, Math.round(o.matchScore / (isBlendingEnabled ? (primaryConf) : primaryConf))) }));
  outfits.sort((a, b) => b.matchScore - a.matchScore);

  // PREFERENCES BOOST
  const boostKeywords = preferredStyles?.flatMap((s) => STYLE_OUTFIT_KEYWORDS[s] ?? []) ?? [];
  const demoteKeywords = preferredOccasion ? (OCCASION_DEMOTE_STYLES[preferredOccasion] ?? []) : [];

  if (boostKeywords.length > 0 || demoteKeywords.length > 0) {
    outfits = outfits.sort((a, b) => {
      const hayA = `${a.name} ${a.style} ${a.description}`.toLowerCase();
      const hayB = `${b.name} ${b.style} ${b.description}`.toLowerCase();
      const scoreA = boostKeywords.filter((k) => hayA.includes(k)).length * 10 - demoteKeywords.filter((k) => hayA.includes(k)).length * 5;
      const scoreB = boostKeywords.filter((k) => hayB.includes(k)).length * 10 - demoteKeywords.filter((k) => hayB.includes(k)).length * 5;
      return scoreB - scoreA; 
    });
  }

  return outfits;
}
