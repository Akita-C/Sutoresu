interface TimerIconProps {
  size?: number;
  className?: string;
}

export default function TimerIcon({ size = 20, className = "" }: TimerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Timer"
      role="img"
    >
      {/* Clock face circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Hour markers */}
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" />
      <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" />
      {/* Clock hands - pointing to 10:00 (showing time running out) */}
      <line x1="12" y1="12" x2="12" y2="6" strokeWidth="3" /> {/* Hour hand */}
      <line x1="12" y1="12" x2="8" y2="12" strokeWidth="2" /> {/* Minute hand */}
      {/* Center dot */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
