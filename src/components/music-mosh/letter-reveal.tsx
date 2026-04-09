"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  glow?: boolean;
}

export function LetterReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.04,
  glow = false,
}: LetterRevealProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isVisible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.4,
            delay: i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={glow ? "drop-shadow-[0_0_12px_rgba(0,255,157,0.6)]" : ""}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
