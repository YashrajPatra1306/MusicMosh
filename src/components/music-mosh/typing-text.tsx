"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  startDelay?: number;
}

export function TypingText({
  text,
  speed = 50,
  className,
  onComplete,
  startDelay = 0,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, started, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && started && (
        <span className="inline-block w-[2px] h-[1em] bg-[var(--mm-accent,#00ff9d)] ml-[2px] align-middle animate-pulse" />
      )}
    </span>
  );
}
