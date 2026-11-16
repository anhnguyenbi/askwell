import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

// Placeholder so the auth redirects are testable. The dashboard shell task replaces it.
export default async function DashboardPage() {
  await auth.protect();
  return (
    <main className="flex min-h-screen items-center justify-center gap-4 p-6">
      <p>Signed in</p>
      <UserButton />
    </main>
  );
}
