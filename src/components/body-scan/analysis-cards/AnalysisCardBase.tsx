import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface AnalysisCardBaseProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function AnalysisCardBase({ title, icon: Icon, children, className = "" }: AnalysisCardBaseProps) {
  return (
    <div className={`bg-card/80 backdrop-blur-xl border border-border/60 rounded-[var(--radius-card)] overflow-hidden shadow-sm ${className}`}>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3.5 border-b border-border/60 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="font-bold text-foreground text-sm">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}




