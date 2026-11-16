import { z } from "zod";
import { PLAN_LIMITS, type Plan } from "./plans";

export const WIDGET_POSITIONS = ["bottom-right", "bottom-left", "top-right", "top-left"] as const;
export const WidgetPositionSchema = z.enum(WIDGET_POSITIONS);
export type WidgetPosition = z.infer<typeof WidgetPositionSchema>;

export const WIDGET_ANIMATIONS = ["fade", "slide", "scale"] as const;
export const WidgetAnimationSchema = z.enum(WIDGET_ANIMATIONS);
export type WidgetAnimation = z.infer<typeof WidgetAnimationSchema>;

export const MAX_WIDGET_LABEL_CHARS = 40;
export const MAX_WIDGET_HEADER_CHARS = 60;

/** `#RRGGBB` hex color. */
export const HexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a #RRGGBB color");

/** The widget's look. Mirrors `widget_configs` (project.md §7) in camelCase. */
export const WidgetConfigSchema = z.object({
  buttonColor: HexColorSchema,
  position: WidgetPositionSchema,
  label: z.string().trim().min(1).max(MAX_WIDGET_LABEL_CHARS),
  animation: WidgetAnimationSchema,
  headerText: z.string().trim().min(1).max(MAX_WIDGET_HEADER_CHARS),
  showBadge: z.boolean(),
});
export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export const DEFAULT_WIDGET_CONFIG = {
  buttonColor: "#4F46E5",
  position: "bottom-right",
  label: "Ask a question",
  animation: "fade",
  headerText: "How can we help?",
  showBadge: true,
} as const satisfies WidgetConfig;

/**
 * The config the widget should render for a plan. Each field the plan can't
 * customize falls back to the default; the badge is forced on unless the plan
 * may hide it. Free → defaults + badge shown. Pro → as saved.
 */
export function applyPlanToConfig(config: WidgetConfig, plan: Plan): WidgetConfig {
  const allow = PLAN_LIMITS[plan].customize;
  const d = DEFAULT_WIDGET_CONFIG;
  return {
    buttonColor: allow.buttonColor ? config.buttonColor : d.buttonColor,
    position: allow.position ? config.position : d.position,
    label: allow.label ? config.label : d.label,
    animation: allow.animation ? config.animation : d.animation,
    headerText: allow.headerText ? config.headerText : d.headerText,
    showBadge: allow.hideBadge ? config.showBadge : true,
  };
}
