export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-48 bg-muted rounded-xl" />

      {/* Card row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-[var(--radius-card)]" />
        ))}
      </div>

      {/* Content block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-muted rounded-[var(--radius-card)]" />
        <div className="h-64 bg-muted rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}
