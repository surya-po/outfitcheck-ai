import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#ECECEC] bg-white py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#9CA3AF]">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.jpeg"
            alt="OutfitCheck AI"
            width={24}
            height={24}
            className="rounded-lg object-cover opacity-80"
          />
          <span className="font-semibold font-heading text-[#18181B] group-hover:text-[#EA5C87] transition-colors">
            OutfitCheck AI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-[#18181B] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[#18181B] transition-colors">Terms</Link>
          <Link href="/partner-register" className="hover:text-[#18181B] transition-colors">For Boutiques</Link>
          <Link href="/login" className="hover:text-[#18181B] transition-colors">Sign In</Link>
        </div>

        <span>© {new Date().getFullYear()} OutfitCheck AI</span>
      </div>
    </footer>
  );
}
