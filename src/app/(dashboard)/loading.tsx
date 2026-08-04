// Shared loading skeleton for all dashboard routes.
// Shows immediately while server components fetch data.
export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-muted rounded-xl" />
      <div className="h-64 bg-muted rounded-[var(--radius-card)]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-48 bg-muted rounded-[var(--radius-card)]" />
        <div className="h-48 bg-muted rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}
