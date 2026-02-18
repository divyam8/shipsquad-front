export function GradientDivider() {
  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Glow behind the line */}
      <div
        className="absolute left-1/2 top-1/2 h-8 w-2/3 -translate-x-1/2 -translate-y-1/2 opacity-15 blur-xl"
        style={{
          background:
            "linear-gradient(to right, transparent, #3B82F6, #8B5CF6, transparent)",
        }}
      />
      {/* The line itself */}
      <div
        className="relative h-px opacity-30"
        style={{
          background:
            "linear-gradient(to right, transparent, #3B82F6, #8B5CF6, transparent)",
        }}
      />
    </div>
  );
}
