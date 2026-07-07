interface MarkProps {
  size?: number;
  onDark?: boolean;
}

export function LogoMark({ size = 44, onDark = false }: MarkProps) {
  const burgundy = onDark ? "#EAE2D1" : "#630E14";
  const gold = onDark ? "#D4B06A" : "#967531";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Shanyrak — yurt dome */}
      <circle
        cx="24"
        cy="20"
        r="11"
        stroke={gold}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="24" cy="20" r="3" fill={gold} opacity="0.9" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = 24 + 11 * Math.cos(rad);
        const y2 = 20 + 11 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1="24"
            y1="20"
            x2={x2}
            y2={y2}
            stroke={gold}
            strokeWidth="1"
            opacity="0.7"
          />
        );
      })}
      {/* Bowl */}
      <path
        d="M14 34 C14 30 34 30 34 34 L34 36 C34 38 14 38 14 36 Z"
        fill={gold}
        opacity="0.85"
      />
      <ellipse cx="24" cy="34" rx="10" ry="2" fill={burgundy} opacity="0.3" />
      {/* Steam */}
      <path
        d="M22 28 C21 26 23 24 22 22 M26 28 C27 26 25 24 26 22"
        stroke={gold}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Ornamental arcs */}
      <path
        d="M8 12 C12 6 36 6 40 12"
        stroke={gold}
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M10 40 C16 44 32 44 38 40"
        stroke={gold}
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

interface Props {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
}

export function BrandLogo({ size = "md", onDark = false }: Props) {
  const sizes = { sm: 36, md: 48, lg: 60 };
  const h = sizes[size];
  const titleSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  const subSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={h} onDark={onDark} />
      <div className="leading-none">
        <p
          className={`font-display font-bold tracking-wide ${titleSize} ${
            onDark ? "header-title" : "text-primary"
          }`}
        >
          Amanbek
        </p>
        <p
          className={`font-display font-semibold tracking-widest ${subSize} ${
            onDark ? "header-subtitle" : "text-gold"
          }`}
        >
          Ata
        </p>
      </div>
    </div>
  );
}

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="gold-line flex-1" />
      <span className="text-gold text-xs">✦</span>
      <div className="gold-line flex-1" />
    </div>
  );
}
