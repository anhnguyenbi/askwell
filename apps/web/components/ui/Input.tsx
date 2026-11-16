import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Marks the field invalid (sets aria-invalid and the danger border). */
  invalid?: boolean;
};

export function Input({ invalid = false, className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-10 w-full min-w-0 rounded-control border border-border bg-glass px-3 text-sm text-foreground",
        "backdrop-blur-glass placeholder:text-muted transition-base",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30",
        className,
      )}
      {...props}
    />
  );
}
