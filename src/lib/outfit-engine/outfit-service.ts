export interface FullOutfit {
  name: string;
  style: string;
  matchScore: number;
  description: string;
  items: string[];
}

export function generateOutfitRecommendations(
  shapeStr: string,
  gender: string = "Unknown",
  isHijab: boolean = false
): FullOutfit[] {
  const shape = shapeStr?.toLowerCase() || "";
  
  if (isHijab) {
    if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
      return [
        {
          name: "Modest Casual",
          style: "Casual",
          matchScore: 96,
          description: "Cocok untuk memberikan ilusi lekuk tubuh yang sopan dan proporsional.",
          items: ["Tunik A-Line", "Celana Kulot Longgar", "Pashmina Ceruty", "Flat Shoes"]
        },
        {
          name: "Layered Elegance",
          style: "Elegant",
          matchScore: 92,
          description: "Menambahkan dimensi pada postur lurus dengan outer.",
          items: ["Long Outer/Cardigan", "Blus Basic Longgar", "Rok Plisket", "Hijab Segiempat"]
        },
        {
          name: "Classic Minimalist",
          style: "Minimalist",
          matchScore: 89,
          description: "Tampilan bersih dan rapi dengan potongan tertutup.",
          items: ["Kemeja Oversized", "Celana Straight Fit (Bukan Ketat)", "Loafers", "Hijab Instan Menutup Dada"]
        }
      ];
    }
    
    if (shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) {
      return [
        {
          name: "A-Line Modesty",
          style: "Casual Modern",
          matchScore: 95,
          description: "Menyamarkan panggul dengan tunik berpotongan A-Line yang sopan.",
          items: ["Tunik A-Line Panjang", "Celana Straight Hitam", "Pashmina Instan", "Platform Sandals"]
        },
        {
          name: "Structured Modest",
          style: "Professional",
          matchScore: 93,
          description: "Mempertegas bahu dengan outer untuk menyeimbangkan proporsi tubuh.",
          items: ["Blazer Berstruktur", "Kemeja Putih Lengan Panjang", "Rok A-Line Maxi", "Hijab Segiempat Paris"]
        },
        {
          name: "Relaxed Everyday",
          style: "Relaxed",
          matchScore: 88,
          description: "Nyaman dan menyeimbangkan proporsi bagian bawah dengan gaya tertutup.",
          items: ["Sweater Oversized", "Rok Plisket Jatuh", "Sneakers", "Pashmina Kaos"]
        }
      ];
    }
    
    if (shape.includes("hourglass") || shape.includes("jam pasir")) {
      return [
        {
          name: "Elegant Modest",
          style: "Elegant Casual",
          matchScore: 97,
          description: "Menjaga proporsi alami dengan potongan longgar yang tetap elegan.",
          items: ["Gamis Berpotongan Princess", "Hijab Segiempat Motif", "Heels Tertutup", "Tas Tangan Klasik"]
        },
        {
          name: "Chic Layering",
          style: "Chic",
          matchScore: 94,
          description: "Gaya layering yang modern dan sopan.",
          items: ["Blus Lengan Balon", "Vest Rajut", "Rok Maxi A-Line", "Pashmina Silk"]
        },
        {
          name: "Daily Casual",
          style: "Casual",
          matchScore: 91,
          description: "Tampilan harian yang nyaman dan tertutup sempurna.",
          items: ["Kemeja Tunik Linen", "Celana Kulot Linen", "Flat Shoes", "Hijab Voal"]
        }
      ];
    }
    
    if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik")) {
      return [
        {
          name: "Minimalist Flow",
          style: "Minimalist",
          matchScore: 96,
          description: "Mengurangi fokus pada bahu dan memberi volume pada bagian bawah.",
          items: ["Blus Lengan Raglan (Longgar)", "Rok Plisket Lebar", "Hijab Segiempat Polos", "Sneakers Minimalis"]
        },
        {
          name: "Smart Relaxed",
          style: "Smart Casual",
          matchScore: 92,
          description: "Atasan jatuh natural tanpa bantalan bahu, dipadukan kulot lebar.",
          items: ["Kemeja Rayon Jatuh", "Celana Kulot Lebar", "Pashmina Sifon", "Sepatu Loafers"]
        },
        {
          name: "Casual Volume",
          style: "Casual",
          matchScore: 89,
          description: "Kombinasi yang memberi volume ekstra pada bagian panggul dan kaki secara sopan.",
          items: ["Sweater Rajut Ringan", "Rok Maxi Ruffle", "Hijab Instan", "Sepatu Flat"]
        }
      ];
    }
    
    if (shape.includes("pear") || shape.includes("pir") || shape.includes("apple") || shape.includes("apel")) {
      return [
        {
          name: "Modest Balanced",
          style: "Smart Casual",
          matchScore: 95,
          description: "Menggunakan siluet longgar yang jatuh lurus untuk menyamarkan proporsi secara elegan.",
          items: ["Long Tunik Bergaris Vertikal", "Celana Bahan Lurus", "Hijab Polos Senada", "Sepatu Block Heels"]
        },
        {
          name: "Layered Comfort",
          style: "Comfort",
          matchScore: 93,
          description: "Menambahkan layer luar panjang untuk siluet tubuh vertikal.",
          items: ["Long Cardigan / Abaya Outer", "Kaos Manset Hitam", "Rok A-Line Gelap", "Pashmina Inner"]
        },
        {
          name: "Gamis Flow",
          style: "Elegant",
          matchScore: 88,
          description: "Gamis potongan lebar yang nyaman dan menutupi lekuk tubuh.",
          items: ["Gamis Syar'i Potongan Umbrella", "Khimar / Hijab Lebar", "Sepatu Flat Nyaman", "Bros Minimalis"]
        }
      ];
    }
    
    // Default Hijab
    return [
      {
        name: "Versatile Modest Everyday",
        style: "Casual",
        matchScore: 90,
        description: "Tampilan aman, sopan, dan nyaman yang cocok untuk hampir semua bentuk tubuh.",
        items: ["Tunik Kemeja Basic", "Celana Kulot Standar", "Hijab Segiempat Voal", "Sneakers/Flat Shoes"]
      }
    ];
  }
  
  // ==========================================
  // FEMALE (Non-Hijab)
  // ==========================================
  if (gender.toLowerCase() === "female") {
    if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
      return [
        {
          name: "Feminine Casual",
          style: "Casual",
          matchScore: 96,
          description: "Cocok untuk memberikan ilusi lekuk tubuh.",
          items: ["Blus Wrap", "Celana High-Waist Wide Leg", "Heels Pendek", "Tas Selempang Kecil"]
        },
        {
          name: "Chic Streetwear",
          style: "Streetwear",
          matchScore: 92,
          description: "Menambahkan dimensi dengan teknik layering.",
          items: ["Crop Top Basic", "Oversized Blazer", "Celana Jeans Lurus", "Sneakers Chunky"]
        },
        {
          name: "Classic Minimalist",
          style: "Minimalist",
          matchScore: 89,
          description: "Tampilan bersih yang menonjolkan proporsi tubuh.",
          items: ["Kaos Ribbed Pas Badan", "Rok Midi A-Line", "Sepatu Loafers", "Ikat Pinggang Kulit"]
        }
      ];
    }
    
    if ((shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) || shape.includes("pear") || shape.includes("pir")) {
      return [
        {
          name: "Balanced Modern",
          style: "Casual Modern",
          matchScore: 95,
          description: "Menyeimbangkan proporsi dengan memusatkan perhatian pada tubuh bagian atas.",
          items: ["Atasan Off-Shoulder", "Celana Kulot Gelap", "Sandal Strappy", "Kalung Statement"]
        },
        {
          name: "Structured Professional",
          style: "Professional",
          matchScore: 93,
          description: "Mempertegas garis bahu untuk menyeimbangkan pinggul lebar.",
          items: ["Blazer Berstruktur", "Kemeja Sutra", "Rok Pensil Panjang Medium", "Sepatu Pumps"]
        },
        {
          name: "Weekend Relaxed",
          style: "Relaxed",
          matchScore: 88,
          description: "Gaya nyaman yang menyeimbangkan proporsi bagian bawah.",
          items: ["Jaket Kulit Cropped", "Kaos Putih", "Celana Jeans Bootcut", "Sneakers Putih"]
        }
      ];
    }
    
    if (shape.includes("hourglass") || shape.includes("jam pasir")) {
      return [
        {
          name: "Elegant Chic",
          style: "Elegant Casual",
          matchScore: 97,
          description: "Menonjolkan proporsi tubuh yang sudah seimbang secara alami.",
          items: ["Bodycon Dress Panjang Medium", "Outer Tipis Transparan", "Heels Runcing", "Sabuk Tipis di Pinggang"]
        },
        {
          name: "Casual Fitted",
          style: "Casual",
          matchScore: 94,
          description: "Tampilan kasual yang rapi dan pas di badan.",
          items: ["Atasan Turtleneck Ketat", "Celana Skinny High-Waist", "Sepatu Boots Ankle", "Aksesoris Emas"]
        },
        {
          name: "Summer Breeze",
          style: "Feminine",
          matchScore: 91,
          description: "Ringan namun tetap menonjolkan siluet tubuh yang proporsional.",
          items: ["Wrap Dress Motif Bunga", "Tas Anyaman", "Sandal Wedges", "Kacamata Hitam Besar"]
        }
      ];
    }
    
    if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik")) {
      return [
        {
          name: "Minimalist Flow",
          style: "Minimalist",
          matchScore: 96,
          description: "Mengurangi fokus pada bahu dan memberi volume ekstra pada pinggul.",
          items: ["Kaos V-Neck Longgar", "Rok A-Line / Rok Lipit", "Sepatu Flat", "Jam Tangan Rantai"]
        },
        {
          name: "Smart Relaxed",
          style: "Smart Casual",
          matchScore: 92,
          description: "Atasan yang jatuh natural tanpa struktur tambahan di bahu.",
          items: ["Kemeja Tanpa Kerah (Collarless)", "Celana Palazzo (Lebar di Bawah)", "Sepatu Mules", "Tas Tote Lebar"]
        },
        {
          name: "Urban Casual",
          style: "Urban",
          matchScore: 89,
          description: "Kombinasi yang menarik perhatian ke area bawah tubuh.",
          items: ["Tank Top Simple", "Celana Boyfriend Jeans Berwarna Cerah", "Sneakers Platform", "Gelang Bertumpuk"]
        }
      ];
    }
    
    // Default Female
    return [
      {
        name: "Versatile Everyday (F)",
        style: "Casual",
        matchScore: 90,
        description: "Tampilan aman dan menawan yang cocok untuk hampir semua bentuk tubuh wanita.",
        items: ["Blus Katun Basic", "Celana Jeans Straight Fit", "Flat Shoes / Sneakers Putih", "Tas Bahu Minimalis"]
      }
    ];
  }

  // ==========================================
  // MALE (Atau Default Jika Unknown & Non-Hijab)
  // ==========================================
  if (shape.includes("rectangle") || shape.includes("segiempat") || shape.includes("lurus")) {
    return [
      {
        name: "Smart Casual",
        style: "Smart Casual",
        matchScore: 96,
        description: "Cocok untuk memberikan ilusi bentuk dan bahu yang lebih bidang.",
        items: ["Kemeja Oxford Biru", "Celana Chino Slim Fit Beige", "Sepatu Loafers", "Jam Tangan Kulit"]
      },
      {
        name: "Layered Streetwear",
        style: "Streetwear",
        matchScore: 92,
        description: "Menambahkan dimensi pada postur lurus.",
        items: ["Kemeja Flannel Terbuka", "Kaos Basic Hitam", "Celana Cargo", "Sepatu Kanvas Hitam"]
      }
    ];
  }
  
  if ((shape.includes("triangle") && !shape.includes("inverted") && !shape.includes("terbalik")) || shape.includes("oval") || shape.includes("apel") || shape.includes("apple")) {
    return [
      {
        name: "Structured Professional",
        style: "Professional",
        matchScore: 95,
        description: "Mempertegas garis bahu untuk menyeimbangkan proporsi area perut/pinggul.",
        items: ["Blazer Berstruktur Gelap", "Kemeja Kerah Kaku", "Celana Potongan Lurus", "Sepatu Oxford"]
      },
      {
        name: "Weekend Relaxed",
        style: "Relaxed",
        matchScore: 91,
        description: "Nyaman dan menyamarkan lekuk bagian bawah/tengah.",
        items: ["Jaket Denim Berpotongan Kotak", "Kaos Kerah V (V-Neck)", "Celana Jeans Gelap Lurus", "Sneakers Chunky"]
      }
    ];
  }

  if (shape.includes("inverted") || shape.includes("terbalik") || shape.includes("segitiga terbalik") || shape.includes("trapezoid")) {
    return [
      {
        name: "Athletic Casual",
        style: "Casual",
        matchScore: 97,
        description: "Menonjolkan bahu bidang secara proporsional.",
        items: ["Kaos Polo Fit / Kaos Henley", "Celana Jeans Slim Straight", "Sepatu Sneakers Putih", "Kacamata Aviator"]
      },
      {
        name: "Modern Minimalist",
        style: "Minimalist",
        matchScore: 93,
        description: "Tampilan bersih tanpa bantalan bahu ekstra.",
        items: ["Kemeja Lengan Pendek Minimalis", "Celana Chino Berwarna Terang", "Sepatu Derby Suede", "Ikat Pinggang Ramping"]
      }
    ];
  }

  // Default Male / Unknown
  return [
    {
      name: "Versatile Everyday",
      style: "Casual",
      matchScore: 90,
      description: "Tampilan kasual aman yang cocok untuk aktivitas harian pria.",
      items: ["Kaos Polos Basic", "Celana Jeans Straight Fit", "Sneakers Nyaman", "Jam Tangan Casual"]
    }
  ];
}
