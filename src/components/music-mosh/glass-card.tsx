"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(255,255,255,0.06)] backdrop-blur-xl",
        "bg-[rgba(16,16,20,0.72)]",
        glow && "glow-pulse",
        className
      )}
    >
      {children}
    </div>
  );
}
