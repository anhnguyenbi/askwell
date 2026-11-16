import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, Button, EmptyState, ErrorState, GlassPanel, Input, LoadingState, buttonClasses } from "./index";

const here = dirname(fileURLToPath(import.meta.url));

describe("ui kit uses only tokens", () => {
  const files = readdirSync(here).filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"));

  it.each(files)("%s has no hardcoded colors", (file) => {
    const src = readFileSync(join(here, file), "utf8");
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(src).not.toMatch(/\b(rgb|rgba|hsl|hsla|oklch)\(/);
    // Raw Tailwind palette colors (e.g. bg-black, text-white/70, bg-zinc-500) bypass the tokens.
    expect(src).not.toMatch(/\b(?:bg|text|border|ring|from|to|via)-(?:black|white|slate|gray|zinc|neutral|stone|red)\b/);
  });
});

describe("Button", () => {
  it("defaults to type=button and the primary variant", () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).toContain('type="button"');
    expect(html).toContain("bg-primary");
  });

  it("is disabled and busy while loading", () => {
    const html = renderToStaticMarkup(<Button loading>Save</Button>);
    expect(html).toContain("disabled");
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("animate-spin");
  });

  it("buttonClasses applies variant and size", () => {
    expect(buttonClasses({ variant: "ghost", size: "lg" })).toContain("bg-transparent");
    expect(buttonClasses({ variant: "ghost", size: "lg" })).toContain("h-12");
  });
});

describe("Input", () => {
  it("marks invalid fields", () => {
    expect(renderToStaticMarkup(<Input invalid />)).toContain('aria-invalid="true"');
    expect(renderToStaticMarkup(<Input />)).not.toContain("aria-invalid=");
  });
});

describe("GlassPanel and Badge", () => {
  it("render with their token classes", () => {
    expect(renderToStaticMarkup(<GlassPanel>x</GlassPanel>)).toContain("glass");
    expect(renderToStaticMarkup(<GlassPanel variant="strong">x</GlassPanel>)).toContain("glass-strong");
    expect(renderToStaticMarkup(<Badge variant="danger">Off</Badge>)).toContain("text-danger");
  });
});

describe("state components", () => {
  it("EmptyState shows title, description and action", () => {
    const html = renderToStaticMarkup(
      <EmptyState title="No projects" description="Create one" action={<Button>New</Button>} />,
    );
    expect(html).toContain("No projects");
    expect(html).toContain("Create one");
    expect(html).toContain("New");
  });

  it("LoadingState is a live status region in both variants", () => {
    expect(renderToStaticMarkup(<LoadingState />)).toContain('role="status"');
    const skeleton = renderToStaticMarkup(<LoadingState variant="skeleton" lines={4} label="Loading rows" />);
    expect(skeleton).toContain("Loading rows");
    expect(skeleton.match(/animate-pulse/g)).toHaveLength(4);
  });

  it("ErrorState is an alert and only shows retry when given a handler", () => {
    const withRetry = renderToStaticMarkup(<ErrorState message="Network down" onRetry={() => undefined} />);
    expect(withRetry).toContain('role="alert"');
    expect(withRetry).toContain("Network down");
    expect(withRetry).toContain("Try again");
    expect(renderToStaticMarkup(<ErrorState />)).not.toContain("Try again");
  });
});
