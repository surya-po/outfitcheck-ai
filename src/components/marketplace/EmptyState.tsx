import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState as GlobalEmptyState } from "@/components/ui/empty-state";

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
  
  const actionElement = onAction ? (
    <Button onClick={onAction}>
      {actionText}
    </Button>
  ) : actionHref ? (
    <Button asChild>
      <Link href={actionHref}>
        {actionText}
      </Link>
    </Button>
  ) : undefined;

  return (
    <div className="w-full rounded-[var(--radius-card)] bg-card border border-dashed border-border">
      <GlobalEmptyState 
        icon={RefreshCcw}
        title={title}
        description={description}
        action={actionElement}
      />
    </div>
  );
}


