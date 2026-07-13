import { LucideIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsActionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
  actionLabel?: string;
}

export function SettingsActionCard({ icon: Icon, title, description, onClick, actionLabel }: SettingsActionCardProps) {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-gray-500 group-hover:text-[#EC4899] transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {actionLabel ? (
        <Button variant="ghost" size="sm" className="text-[#EC4899] hover:text-[#EC4899] hover:bg-[#FCE7F3] rounded-xl font-medium">
          {actionLabel}
        </Button>
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      )}
    </div>
  );
}
