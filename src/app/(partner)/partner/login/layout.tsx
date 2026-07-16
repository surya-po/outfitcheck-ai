// This layout deliberately overrides the partner layout
// to allow the partner login page to render without authentication.
export default function PartnerLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



