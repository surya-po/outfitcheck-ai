import { EmptyState } from "@/components/ui/EmptyState";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in-50 duration-500">
      <div className="w-full max-w-2xl">
        <EmptyState
          icon={Settings}
          title="Account Settings"
          description="Configure your account settings, preferences, and privacy options. This section is currently being built."
        />
      </div>
    </div>
  );
}
