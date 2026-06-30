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
    <div className={`bg-[#1E1E2D]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <div className="bg-gradient-to-r from-[#EC4899]/20 to-[#F472B6]/10 p-3.5 border-b border-white/10 flex items-center gap-3">
        <div className="bg-[#EC4899] p-2 rounded-lg">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
