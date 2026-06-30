import { EmptyState } from "@/components/ui/EmptyState";
import { Heart } from "lucide-react";

export default function CollectionPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in-50 duration-500">
      <div className="w-full max-w-2xl">
        <EmptyState
          icon={Heart}
          title="Saved Collection"
          description="Your favorite outfit recommendations and saved looks will be organized here. This feature is coming in a future update."
        />
      </div>
    </div>
  );
}
