import { z } from "zod";

export const ERROR_CODES = [
  "unauthorized",
  "forbidden",
  "not_found",
  "validation_failed",
  "plan_limit",
  "payment_required",
  "rate_limited",
  "quota_exceeded",
  "blocked",
  "internal_error",
] as const;
export const ErrorCodeSchema = z.enum(ERROR_CODES);
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

/** HTTP status to send with each error code. */
export const ERROR_STATUS = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_failed: 400,
  plan_limit: 403,
  payment_required: 402,
  rate_limited: 429,
  quota_exceeded: 429,
  blocked: 403,
  internal_error: 500,
} as const satisfies Record<ErrorCode, number>;

/** Every API error body: `{ error: { code, message } }`. */
export const ApiErrorSchema = z.object({
  error: z.object({
    code: ErrorCodeSchema,
    message: z.string(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/** Build an error body. Pair it with `ERROR_STATUS[code]`. */
export function apiError(code: ErrorCode, message: string): ApiError {
  return { error: { code, message } };
}
