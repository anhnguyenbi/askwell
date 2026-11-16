import { cn } from "./cn";
import { Spinner } from "./Spinner";

export type SkeletonProps = { className?: string };

/** A pulsing placeholder block. Size it with className. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("rounded-control bg-secondary motion-safe:animate-pulse", className)} />;
}

export type LoadingStateProps = {
  /** `spinner` for short waits; `skeleton` to sketch content rows. */
  variant?: "spinner" | "skeleton";
  /** Announced to screen readers; shown under the spinner. */
  label?: string;
  /** Number of skeleton rows. */
  lines?: number;
  className?: string;
};

export function LoadingState({ variant = "spinner", label = "Loading…", lines = 3, className }: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div role="status" aria-live="polite" className={cn("flex flex-col gap-3", className)}>
        <span className="sr-only">{label}</span>
        {Array.from({ length: Math.max(1, lines) }, (_, i) => (
          <Skeleton key={i} className={cn("h-4", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-muted", className)}
    >
      <Spinner size="lg" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
