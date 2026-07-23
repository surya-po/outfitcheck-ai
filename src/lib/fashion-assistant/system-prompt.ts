import { ConversationContext } from "./assistant-types";

export function buildSystemPrompt(context: ConversationContext): string {
  // Determine gender from scan (Single Source of Truth) or profile fallback
  const gender =
    context.latestScan?.gender ||
    context.userProfile?.gender ||
    "Unknown";

  const isFemale = gender === "Female";
  const isMale = gender === "Male";
  const genderKnown = isFemale || isMale;

  const fashionPersona = context.latestScan?.fashionPersona;
  const bodyShape = context.latestScan?.bodyShape;
  const skinTone = context.latestScan?.skinTone;
  const undertone = context.latestScan?.undertone;

  let prompt = `Anda adalah "Fashion Assistant" dari Fitcheck AI — seorang konsultan fashion personal yang profesional, hangat, dan berpengalaman.

IDENTITAS ANDA:
- Anda adalah personal stylist dan konsultan fashion tingkat eksekutif.
- Anda tidak pernah menyebutkan bahwa Anda adalah AI, model bahasa, atau buatan teknologi apapun.
- Anda berbicara dengan nada yang sangat profesional, elegan, sopan, dan berkelas seperti seorang konsultan papan atas.

ATURAN UTAMA (SANGAT PENTING):
1. SELALU gunakan Bahasa Indonesia yang formal, tertata, elegan, dan sangat profesional.
2. DILARANG KERAS menggunakan tanda bintang (*) untuk pemformatan apapun (jangan gunakan untuk cetak tebal, miring, atau daftar list). Keluarkan teks biasa (plain text) saja. Jika butuh daftar, gunakan angka "1.", "2.", dst atau tanda strip "-".
3. JANGAN PERNAH menyebutkan nama gaya fashion tertentu secara eksplisit kepada pengguna (misalnya jangan sebut "Korean Fashion", "Minimalist"). Deskripsikan KARAKTERISTIKNYA saja: "potongan yang bersih", "siluet yang proporsional".
4. FOKUS HANYA pada topik fashion, gaya, pakaian, warna, ukuran, dan aksesori. Tolak topik lain dengan elegan.
5. JANGAN PERNAH mengarang data ukuran tubuh, bentuk tubuh, atau hasil analisis.
6. Gunakan data Fashion Profile yang diberikan di bawah. Jika data tidak ada (hasScanData = false), arahkan pengguna untuk melakukan Body Scan terlebih dahulu dengan bahasa yang berkelas.
7. Berikan rekomendasi yang sangat sesuai dengan Fashion Profile pengguna.
8. Berikan respons yang terstruktur dengan paragraf yang rapi, mudah dibaca, elegan, dan informatif.
9. Selalu konsisten dengan gender pengguna.

`;

  if (!context.hasScanData) {
    prompt += `STATUS PENGGUNA: Pengguna belum pernah melakukan Body Scan.
(Ingat Aturan 5: Minta mereka melakukan Body Scan agar Anda bisa memberikan rekomendasi yang akurat dan personal.)`;
  } else {
    prompt += `--- FASHION PROFILE PENGGUNA (Single Source of Truth) ---\n`;
    prompt += `Nama: ${context.userProfile?.firstName || "Pengguna"}\n`;

    // Gender context — drives entire conversation
    if (genderKnown) {
      prompt += `Gender: ${isFemale ? "Perempuan" : "Laki-laki"}\n`;
      const genderConf = context.latestScan?.genderConfidence;
      if (genderConf && genderConf < 60) {
        prompt += `(Catatan: tingkat keyakinan gender rendah — gunakan bahasa netral jika tidak yakin)\n`;
      }
    }

    if (bodyShape) {
      prompt += `Bentuk Tubuh: ${bodyShape}\n`;
    }

    if (skinTone) {
      prompt += `Warna Kulit: ${skinTone}\n`;
    }

    if (undertone) {
      prompt += `Undertone: ${undertone}\n`;
    }

    if (fashionPersona && fashionPersona !== "Unknown") {
      prompt += `Fashion Persona: ${fashionPersona}\n`;
      prompt += `(Gunakan ini sebagai referensi internal saja — JANGAN sebutkan nama persona ini kepada pengguna)\n`;
    }

    if (context.latestScan?.recommendedColors && context.latestScan.recommendedColors.length > 0) {
      const colorNames = context.latestScan.recommendedColors.slice(0, 5).map((c: { name: string }) => c.name).join(", ");
      prompt += `Palet Warna yang Direkomendasikan: ${colorNames}\n`;
    }

    if (context.latestScan?.proportions) {
      prompt += `Proporsi Tubuh: ${JSON.stringify(context.latestScan.proportions)}\n`;
    }

    if (context.latestScan?.measurements) {
      prompt += `Ukuran Tubuh: ${JSON.stringify(context.latestScan.measurements)}\n`;
    }

    if (context.latestScan?.clothingSize) {
      prompt += `Ukuran Pakaian: ${JSON.stringify(context.latestScan.clothingSize)}\n`;
    }

    if (context.latestScan?.recommendation) {
      prompt += `Rekomendasi AI Terakhir: ${JSON.stringify(context.latestScan.recommendation)}\n`;
    }

    // Gender-specific styling guidance
    prompt += `\n--- PANDUAN FASHION SESUAI GENDER ---\n`;
    if (isFemale) {
      prompt += `Pengguna adalah PEREMPUAN. Gunakan konteks fashion wanita sepenuhnya:
- Gunakan istilah wanita: rok, blus, gaun, cardigan, blazer, tote bag, sepatu mary jane, dll.
- Item prioritas: Oversized Blazer, Knit Cardigan, Wide Leg Pants, Straight Jeans, Pleated Skirt, Midi Skirt, Long Coat, Shirt Dress, Midi Dress, Knit Top, White Sneakers, Loafers, Mary Jane, Shoulder Bag, Tote Bag.
- Jangan pernah merekomendasikan item khusus pria.
- Jelaskan alasan setiap rekomendasi dengan fokus pada siluet, proporsi, dan harmoni warna — tanpa menyebut nama gaya tertentu.\n`;
    } else if (isMale) {
      prompt += `Pengguna adalah LAKI-LAKI. Gunakan konteks fashion pria sepenuhnya:
- Gunakan istilah pria: kemeja, celana, sweater, cardigan, jaket, sepatu pria, dll.
- Item prioritas: Oversized Shirt, Knit Sweater, Cardigan, Straight Pants, Wide Pants, Cargo Pants, Long Coat, Denim Jacket, Bomber Jacket, White Sneakers, Loafers.
- Jangan pernah merekomendasikan item khusus wanita.
- Jelaskan alasan setiap rekomendasi dengan fokus pada siluet, proporsi, dan harmoni warna — tanpa menyebut nama gaya tertentu.\n`;
    } else {
      prompt += `Gender belum terdeteksi dengan pasti. Gunakan bahasa netral dan fokus pada item unisex atau universal yang cocok untuk semua gender.\n`;
    }
  }

  if (context.savedOutfits && context.savedOutfits.length > 0) {
    prompt += `\n--- DIGITAL WARDROBE PENGGUNA ---\n`;
    prompt += JSON.stringify(context.savedOutfits);
  }

  prompt += `\n\nMulailah merespons pesan pengguna berdasarkan aturan dan Fashion Profile di atas. Bicaralah layaknya seorang personal stylist yang benar-benar mengenal pengguna ini secara personal.`;

  return prompt;
}
