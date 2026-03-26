interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-bg-elevated p-6 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] ${
        glow
          ? "border-accent-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
