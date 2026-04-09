"use client";

interface EqualizerBarsProps {
  barCount?: number;
  className?: string;
  active?: boolean;
  color?: string;
}

export function EqualizerBars({
  barCount = 9,
  className = "",
  active = true,
  color = "bg-[var(--mm-accent,#00ff9d)]",
}: EqualizerBarsProps) {
  const bars = Array.from({ length: barCount }, (_, i) => ({
    height: 12 + Math.random() * 28,
    speed: 0.4 + Math.random() * 0.8,
    delay: i * 0.1,
  }));

  return (
    <div
      className={`flex items-end gap-[3px] h-10 ${className}`}
      aria-hidden="true"
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${color} eq-bar transition-opacity ${
            active ? "opacity-100" : "opacity-20"
          }`}
          style={
            {
              "--eq-height": `${bar.height}px`,
              "--eq-speed": `${bar.speed}s`,
              "--eq-delay": `${bar.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
