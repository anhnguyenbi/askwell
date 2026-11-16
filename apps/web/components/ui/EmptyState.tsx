import type { ReactNode } from "react";
import { cn } from "./cn";

export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  /** Optional decorative icon shown above the title. */
  icon?: ReactNode;
  /** Optional call to action, e.g. a Button. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      {icon && (
        <div aria-hidden="true" className="glass flex size-12 items-center justify-center rounded-pill text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
