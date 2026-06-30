import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in-50 duration-500">
      <div className="w-full max-w-2xl">
        <EmptyState
          icon={Sparkles}
          title="Outfit Recommendations"
          description="Your personalized outfit recommendations will appear here after you complete your AI Body Scan. Stay tuned!"
        />
      </div>
    </div>
  );
}
