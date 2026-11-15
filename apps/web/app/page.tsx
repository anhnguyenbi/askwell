import { APP_NAME } from "@askwell/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-white">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{APP_NAME}</h1>
      <p className="text-lg text-white/70">Coming soon</p>
    </main>
  );
}
