import { EmptyState } from "@/components/ui/EmptyState";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in-50 duration-500">
      <div className="w-full max-w-2xl">
        <EmptyState
          icon={User}
          title="User Profile"
          description="View and edit your personal information, measurements, and style preferences. Profile management is currently under development."
        />
      </div>
    </div>
  );
}
