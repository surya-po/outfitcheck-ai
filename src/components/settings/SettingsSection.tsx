import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, icon: Icon, children, className }: SettingsSectionProps) {
  return (
    <Card className={`overflow-hidden border-[#FDF2F8] shadow-sm ${className || ''}`}>
      <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center gap-4 space-y-0">
        <div className="h-12 w-12 bg-[#FFF7FB] text-[#EC4899] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#FCE7F3]/50">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
          {description && <CardDescription className="text-sm text-gray-500 mt-0.5">{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
}
