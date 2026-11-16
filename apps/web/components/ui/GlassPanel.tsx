import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  /** `strong` is more opaque with a deeper shadow, for overlays and popovers. */
  variant?: "default" | "strong";
  padding?: "none" | "sm" | "md" | "lg";
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function GlassPanel({ variant = "default", padding = "md", className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(variant === "strong" ? "glass-strong" : "glass", "rounded-panel text-foreground", paddings[padding], className)}
      {...props}
    />
  );
}
