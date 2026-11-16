import { describe, expect, it } from "vitest";
import { PLAN_LIMITS, PLAN_PRICES_USD, PlanSchema } from "./index";

describe("PLAN_LIMITS (project.md §5)", () => {
  it("Free", () => {
    expect(PLAN_LIMITS.free).toEqual({
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
    });
  });

  it("Pro", () => {
    expect(PLAN_LIMITS.pro).toEqual({
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
    });
  });
});

describe("PLAN_PRICES_USD", () => {
  it("Free is $0, Pro is $19", () => {
    expect(PLAN_PRICES_USD).toEqual({ free: 0, pro: 19 });
  });
});

describe("PlanSchema", () => {
  it("accepts free and pro only", () => {
    expect(PlanSchema.parse("free")).toBe("free");
    expect(PlanSchema.parse("pro")).toBe("pro");
    expect(PlanSchema.safeParse("enterprise").success).toBe(false);
  });
});
