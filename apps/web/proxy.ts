import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const SIGN_IN_PATH = "/sign-in";
export const SIGN_UP_PATH = "/sign-up";

// Owner pages: signed-out visitors are sent to sign-in.
const PROTECTED_PAGE_PREFIXES = ["/dashboard"] as const;

// Owner API routes (project.md §8): signed-out calls get a 401 JSON error.
const OWNER_API_PREFIXES = ["/api/projects", "/api/knowledge", "/api/conversations"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isProtectedPage(pathname: string): boolean {
  return matchesPrefix(pathname, PROTECTED_PAGE_PREFIXES);
}

export function isOwnerApiRoute(pathname: string): boolean {
  return matchesPrefix(pathname, OWNER_API_PREFIXES);
}

// TODO(P1F-T01): type this with the shared API error type and `ErrorCode` once the contract merges.
type UnauthorizedBody = { error: { code: "unauthorized"; message: string } };

export function unauthorizedResponse(): NextResponse<UnauthorizedBody> {
  return NextResponse.json(
    { error: { code: "unauthorized", message: "Sign in to use this route." } },
    { status: 401 },
  );
}

// This is an early gate. Each owner page and route handler still checks the
// session itself (auth.protect() / auth()); the proxy is not the only check.
export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    const ownerApi = isOwnerApiRoute(pathname);
    const protectedPage = isProtectedPage(pathname);
    if (!ownerApi && !protectedPage) return;

    const { isAuthenticated, redirectToSignIn } = await auth();
    if (isAuthenticated) return;

    if (ownerApi) return unauthorizedResponse();
    return redirectToSignIn({ returnBackUrl: req.url });
  },
  { signInUrl: SIGN_IN_PATH, signUpUrl: SIGN_UP_PATH },
);

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
