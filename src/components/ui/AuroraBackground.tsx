export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blue blob */}
      <div
        className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-accent-blue/[0.15] blur-[200px]"
        style={{ animation: "aurora-drift-1 30s ease-in-out infinite" }}
      />
      {/* Purple blob */}
      <div
        className="absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-accent-purple/[0.20] blur-[200px]"
        style={{ animation: "aurora-drift-2 25s ease-in-out infinite" }}
      />
      {/* Pink blob */}
      <div
        className="absolute left-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent-pink/[0.15] blur-[200px]"
        style={{ animation: "aurora-drift-3 35s ease-in-out infinite" }}
      />
    </div>
  );
}
