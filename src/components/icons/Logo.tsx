interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
        {/* Central node */}
        <circle cx="16" cy="16" r="3.5" fill="white" opacity="0.95" />
        {/* Orbiting nodes */}
        <circle cx="8.5" cy="10" r="1.8" fill="white" opacity="0.7" />
        <circle cx="23.5" cy="10" r="1.8" fill="white" opacity="0.7" />
        <circle cx="8.5" cy="22" r="1.8" fill="white" opacity="0.7" />
        <circle cx="23.5" cy="22" r="1.8" fill="white" opacity="0.7" />
        {/* Connection lines */}
        <line x1="16" y1="16" x2="8.5" y2="10" stroke="white" strokeWidth="0.8" opacity="0.35" />
        <line x1="16" y1="16" x2="23.5" y2="10" stroke="white" strokeWidth="0.8" opacity="0.35" />
        <line x1="16" y1="16" x2="8.5" y2="22" stroke="white" strokeWidth="0.8" opacity="0.35" />
        <line x1="16" y1="16" x2="23.5" y2="22" stroke="white" strokeWidth="0.8" opacity="0.35" />
        {/* Orbit ring */}
        <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="0.5" opacity="0.15" fill="none" />
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg tracking-[-0.02em] text-white">
        <span className="font-light">Ship</span>
        <span className="font-bold">Squad</span>
      </span>
    </div>
  );
}
