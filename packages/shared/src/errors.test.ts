import { describe, expect, it } from "vitest";
import { ApiErrorSchema, ERROR_CODES, ERROR_STATUS, apiError } from "./index";

describe("apiError", () => {
  it("builds the error shape", () => {
    expect(apiError("not_found", "No such project")).toEqual({
      error: { code: "not_found", message: "No such project" },
    });
  });
});

describe("ApiErrorSchema", () => {
  it("accepts every error code", () => {
    for (const code of ERROR_CODES) {
      expect(ApiErrorSchema.safeParse(apiError(code, "x")).success).toBe(true);
    }
  });

  it("rejects unknown codes and wrong shapes", () => {
    expect(ApiErrorSchema.safeParse({ error: { code: "teapot", message: "x" } }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ code: "not_found", message: "x" }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ error: { code: "not_found" } }).success).toBe(false);
  });
});

describe("ERROR_STATUS", () => {
  it("maps codes to HTTP statuses", () => {
    expect(ERROR_STATUS.unauthorized).toBe(401);
    expect(ERROR_STATUS.not_found).toBe(404);
    expect(ERROR_STATUS.validation_failed).toBe(400);
    expect(ERROR_STATUS.payment_required).toBe(402);
    expect(ERROR_STATUS.rate_limited).toBe(429);
    expect(ERROR_STATUS.quota_exceeded).toBe(429);
  });
});
