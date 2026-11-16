import { describe, expect, it } from "vitest";
import { DEFAULT_WIDGET_CONFIG, WidgetConfigSchema, applyPlanToConfig, type WidgetConfig } from "./index";

const custom: WidgetConfig = {
  buttonColor: "#FF0055",
  position: "top-left",
  label: "Help",
  animation: "scale",
  headerText: "Talk to Acme",
  showBadge: false,
};

describe("applyPlanToConfig", () => {
  it("Free returns the defaults with the badge on", () => {
    const result = applyPlanToConfig(custom, "free");
    expect(result).toEqual(DEFAULT_WIDGET_CONFIG);
    expect(result.showBadge).toBe(true);
    expect(result.position).toBe("bottom-right");
    expect(result.animation).toBe("fade");
  });

  it("Free forces the badge on even if the defaults are saved with it off", () => {
    expect(applyPlanToConfig({ ...DEFAULT_WIDGET_CONFIG, showBadge: false }, "free").showBadge).toBe(true);
  });

  it("Pro keeps custom values", () => {
    expect(applyPlanToConfig(custom, "pro")).toEqual(custom);
  });

  it("Pro may keep the badge shown", () => {
    expect(applyPlanToConfig({ ...custom, showBadge: true }, "pro").showBadge).toBe(true);
  });

  it("does not mutate its input", () => {
    const input = { ...custom };
    applyPlanToConfig(input, "free");
    expect(input).toEqual(custom);
  });
});

describe("WidgetConfigSchema", () => {
  it("accepts the defaults and a custom config", () => {
    expect(WidgetConfigSchema.safeParse(DEFAULT_WIDGET_CONFIG).success).toBe(true);
    expect(WidgetConfigSchema.safeParse(custom).success).toBe(true);
  });

  it.each([
    ["bad color", { buttonColor: "red" }],
    ["short hex", { buttonColor: "#fff" }],
    ["bad position", { position: "center" }],
    ["bad animation", { animation: "bounce" }],
    ["empty label", { label: "   " }],
    ["long label", { label: "x".repeat(41) }],
    ["long header", { headerText: "x".repeat(61) }],
    ["badge not boolean", { showBadge: "no" }],
  ])("rejects %s", (_name, patch) => {
    expect(WidgetConfigSchema.safeParse({ ...custom, ...patch }).success).toBe(false);
  });
});
