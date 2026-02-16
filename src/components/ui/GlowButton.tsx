"use client";

import { type ButtonHTMLAttributes } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function GlowButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const base =
    "relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const variants = {
    primary:
      "bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple text-white shadow-md hover:shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "border border-accent-blue/30 text-text-primary hover:border-accent-blue/60 hover:bg-accent-blue/10",
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
