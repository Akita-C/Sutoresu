interface RoundIconProps {
  size?: number;
  className?: string;
}

export default function RoundIcon({ size = 20, className = "" }: RoundIconProps) {
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
      aria-label="Round"
      role="img"
    >
      {/* Outer circle representing the round/cycle */}
      <circle cx="12" cy="12" r="10" />

      {/* Circular arrows indicating progression/rounds */}
      <path d="M8 12a4 4 0 0 1 4-4" />
      <path d="M16 12a4 4 0 0 1-4 4" />

      {/* Arrow heads */}
      <polyline points="7,10 8,12 10,11" />
      <polyline points="17,14 16,12 14,13" />

      {/* Center indicator dots */}
      <circle cx="12" cy="7" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
