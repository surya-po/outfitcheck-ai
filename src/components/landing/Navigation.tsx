import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md border-b border-[#ECECEC]">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#ECECEC]">
          <Image
            src="/logo.jpeg"
            alt="OutfitCheck AI"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[15px] font-semibold font-heading text-[#18181B] tracking-tight">
          OutfitCheck AI
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden sm:block text-sm font-medium text-[#6B7280] hover:text-[#18181B] transition-colors duration-200"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center h-9 px-5 rounded-full bg-[#EA5C87] text-white text-sm font-semibold hover:bg-[#d44f78] transition-colors duration-200 shadow-sm"
        >
          Start Free
        </Link>
      </div>
    </nav>
  );
}
