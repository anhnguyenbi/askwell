import { z } from "zod";

/** Billing plans. The server reads the plan from `accounts.plan`; clients never decide it. */
export const PLANS = ["free", "pro"] as const;
export const PlanSchema = z.enum(PLANS);
export type Plan = z.infer<typeof PlanSchema>;

/** Which Customize fields a plan may change. `false` means the default is forced. */
export interface CustomizeAllowance {
  buttonColor: boolean;
  /** Free: bottom right only. Pro: any corner. */
  position: boolean;
  label: boolean;
  /** Free: fade only. Pro: fade / slide / scale. */
  animation: boolean;
  headerText: boolean;
  /** May the "Powered by" badge be hidden? */
  hideBadge: boolean;
}

export interface PlanLimits {
  projects: number;
  /** Per project, per monthly period. */
  messagesPerMonth: number;
  /** Per project, files + pasted texts together. */
  knowledgeSources: number;
  customize: CustomizeAllowance;
}

/** project.md §5. The one place plan limits live. */
export const PLAN_LIMITS = {
  free: {
    projects: 1,
    messagesPerMonth: 100,
    knowledgeSources: 3,
    customize: {
      buttonColor: false,
      position: false,
      label: false,
      animation: false,
      headerText: false,
      hideBadge: false,
    },
  },
  pro: {
    projects: 5,
    messagesPerMonth: 2000,
    knowledgeSources: 25,
    customize: {
      buttonColor: true,
      position: true,
      label: true,
      animation: true,
      headerText: true,
      hideBadge: true,
    },
  },
} as const satisfies Record<Plan, PlanLimits>;

/** Monthly price in USD. Pro = $19/month (product owner decision). */
export const PLAN_PRICES_USD = { free: 0, pro: 19 } as const satisfies Record<Plan, number>;
