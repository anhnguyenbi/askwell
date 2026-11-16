import type { ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

export type ErrorStateProps = {
  title?: string;
  message?: ReactNode;
  /** Shows a retry button when given. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Puts the retry button in its loading state. */
  retrying?: boolean;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  retrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <div
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-pill bg-danger-soft text-lg font-semibold text-danger"
      >
        !
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} loading={retrying} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
