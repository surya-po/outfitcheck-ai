"use client";

import { LucideIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsDangerZoneProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  isLoading?: boolean;
}

export function SettingsDangerZone({ icon: Icon = Trash2, title, description, actionLabel, onClick, isLoading }: SettingsDangerZoneProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50/50 border border-red-100 rounded-[var(--radius-card)]">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-[var(--radius-button)] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <Button 
        variant="destructive" 
        onClick={onClick} 
        disabled={isLoading}
        className="rounded-[var(--radius-button)] shrink-0 font-medium"
      >
        {isLoading ? "Memproses..." : actionLabel}
      </Button>
    </div>
  );
}


