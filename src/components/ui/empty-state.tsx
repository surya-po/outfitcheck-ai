import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-16 text-center animate-in fade-in-50 duration-500",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 text-primary mb-6 ring-8 ring-secondary/20">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

