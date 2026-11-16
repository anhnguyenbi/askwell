import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: () => () => undefined,
}));

const { isOwnerApiRoute, isProtectedPage, unauthorizedResponse, config } = await import("./proxy");

describe("isProtectedPage", () => {
  it.each(["/dashboard", "/dashboard/", "/dashboard/projects/abc"])("protects %s", (path) => {
    expect(isProtectedPage(path)).toBe(true);
  });

  it.each(["/", "/dashboards", "/sign-in", "/sign-up/verify", "/embed", "/api/projects"])(
    "leaves %s alone",
    (path) => {
      expect(isProtectedPage(path)).toBe(false);
    },
  );
});

describe("isOwnerApiRoute", () => {
  it.each([
    "/api/projects",
    "/api/projects/123",
    "/api/projects/123/knowledge/upload-url",
    "/api/projects/123/conversations",
    "/api/projects/123/config",
    "/api/knowledge/abc",
    "/api/conversations/abc",
  ])("protects %s", (path) => {
    expect(isOwnerApiRoute(path)).toBe(true);
  });

  it.each([
    "/",
    "/embed",
    "/embed/abc",
    "/api/widget/config",
    "/api/widget/chat",
    "/api/clerk/webhook",
    "/api/posthog-config",
    "/api/projectsx",
    "/sign-in",
    "/sign-up",
    "/dashboard",
  ])("leaves %s public", (path) => {
    expect(isOwnerApiRoute(path)).toBe(false);
  });
});

describe("unauthorizedResponse", () => {
  it("returns a 401 JSON error", async () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual({
      error: { code: "unauthorized", message: expect.any(String) },
    });
  });
});

describe("config.matcher", () => {
  it("always runs on API routes", () => {
    expect(config.matcher).toContain("/(api|trpc)(.*)");
  });

  it("always runs on Clerk proxy routes", () => {
    expect(config.matcher).toContain("/__clerk/(.*)");
  });
});
