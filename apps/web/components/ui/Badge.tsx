import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeVariant = "default" | "solid" | "outline" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-secondary text-foreground",
  solid: "bg-primary text-primary-foreground",
  outline: "border border-border text-foreground",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
