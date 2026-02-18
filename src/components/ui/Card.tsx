interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  animatedBorder?: boolean;
}

export function Card({ children, className = "", glow = false, animatedBorder = false }: CardProps) {
  if (animatedBorder) {
    return (
      <div
        className="rounded-2xl p-[1px]"
        style={{
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)",
          backgroundSize: "300% 300%",
          animation: "gradient-shift 6s ease infinite",
        }}
      >
        <div
          className={`rounded-2xl bg-[#06060B] p-6 backdrop-blur-xl ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/[0.05] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-200 hover:border-white/[0.10] ${
        glow
          ? "border-accent-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
