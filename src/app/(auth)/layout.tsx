export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-[#F7A8B8]/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-[#E88CA0]/15 blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D86A84]/5 blur-3xl" />

      <div className="w-full max-w-md p-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
