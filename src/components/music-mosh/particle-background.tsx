"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticleBackgroundProps {
  count?: number;
  className?: string;
  moodColors?: string[];
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  color: string;
}

export function ParticleBackground({
  count = 60,
  className,
  moodColors,
}: ParticleBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles: Particle[] = useMemo(() => {
    const colors = moodColors || [
      "rgba(0, 255, 157, 0.6)",
      "rgba(0, 212, 255, 0.4)",
      "rgba(255, 255, 255, 0.3)",
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 3,
      duration: 8 + Math.random() * 16,
      delay: Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count, moodColors]);

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
