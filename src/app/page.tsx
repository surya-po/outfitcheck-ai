import Link from "next/link";
import { ArrowRight, Sparkles, Shirt, Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-md bg-white/70 dark:bg-black/70 sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            OutfitCheck AI
          </span>
        </div>
        <div className="flex items-center gap-4 font-medium text-sm">
          <Link
            href="/login"
            className="hidden sm:block text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            Daftar Sekarang
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Asisten Fashion AI Pribadi Anda</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Temukan Gaya Terbaikmu dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">AI</span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            Unggah fotomu, analisis bentuk tubuh, dan dapatkan rekomendasi outfit yang paling cocok untukmu dalam hitungan detik. 
            Tampil lebih percaya diri setiap hari!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            <Link
              href="/register"
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 text-primary-foreground font-semibold text-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
            >
              Mulai Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex h-14 w-full sm:w-auto items-center justify-center rounded-full border-2 border-zinc-200 dark:border-zinc-800 px-8 font-semibold text-lg transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            >
              Sudah punya akun?
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
          {[
            {
              title: "Analisis Tubuh Otomatis",
              description: "AI kami dapat mengenali bentuk tubuhmu hanya dari sebuah foto.",
              icon: Camera,
            },
            {
              title: "Rekomendasi Outfit",
              description: "Dapatkan saran gaya yang disesuaikan dengan proporsi tubuhmu.",
              icon: Shirt,
            },
            {
              title: "Mix & Match Cerdas",
              description: "Padu padankan pakaian di lemarimu untuk gaya tanpa batas.",
              icon: Sparkles,
            },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
