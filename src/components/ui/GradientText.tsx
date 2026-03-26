"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

export function GradientText({
  children,
  className = "",
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag
      className={`bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Tag>
  );
}
