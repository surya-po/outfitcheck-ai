import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Belum ada produk",
  description = "Tidak ada produk yang cocok dengan pencarian atau filter Anda.",
  actionText = "Reset Filter",
  actionHref = "/marketplace",
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40 border-dashed">
      <div className="w-16 h-16 bg-[#FDF2F8] text-pink-500 rounded-full flex items-center justify-center mb-4">
        <RefreshCcw className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      
      {onAction ? (
        <Button 
          onClick={onAction}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8"
        >
          {actionText}
        </Button>
      ) : actionHref ? (
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8">
          <Link href={actionHref}>
            {actionText}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
