import { cn } from "./cn";

export type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "size-4 border-2", md: "size-6 border-2", lg: "size-8 border-[3px]" } as const;

/** Decorative spinner. Pair it with visible or screen-reader text. */
export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 rounded-full border-current border-r-transparent motion-safe:animate-spin",
        sizes[size],
        className,
      )}
    />
  );
}
