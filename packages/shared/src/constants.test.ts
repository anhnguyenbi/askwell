import { describe, expect, it } from "vitest";
import {
  ALLOWED_KNOWLEDGE_MIME_TYPES,
  CHAT_RATE_LIMIT,
  MAX_KNOWLEDGE_FILE_BYTES,
  MAX_MESSAGE_CHARS,
  isAllowedMimeType,
  knowledgeTypeFromFileName,
} from "./index";

describe("constants", () => {
  it("match project.md", () => {
    expect(MAX_KNOWLEDGE_FILE_BYTES).toBe(10 * 1024 * 1024);
    expect(MAX_MESSAGE_CHARS).toBe(1000);
    expect(CHAT_RATE_LIMIT).toEqual({ max: 20, windowSeconds: 60 });
  });

  it("lists every bucket MIME type once", () => {
    expect([...ALLOWED_KNOWLEDGE_MIME_TYPES].sort()).toEqual(
      ["application/pdf", "text/markdown", "text/plain", "text/x-markdown"].sort(),
    );
  });
});

describe("knowledgeTypeFromFileName", () => {
  it.each([
    ["guide.pdf", "pdf"],
    ["GUIDE.PDF", "pdf"],
    ["notes.md", "md"],
    ["notes.markdown", "md"],
    ["faq.txt", "txt"],
  ])("%s → %s", (name, type) => {
    expect(knowledgeTypeFromFileName(name)).toBe(type);
  });

  it.each(["image.png", "doc.docx", "pdf", "archive.pdf.zip", "noext"])("refuses %s", (name) => {
    expect(knowledgeTypeFromFileName(name)).toBeNull();
  });
});

describe("isAllowedMimeType", () => {
  it("matches MIME type to file type", () => {
    expect(isAllowedMimeType("pdf", "application/pdf")).toBe(true);
    expect(isAllowedMimeType("md", "text/markdown")).toBe(true);
    expect(isAllowedMimeType("md", "text/plain")).toBe(true);
    expect(isAllowedMimeType("txt", "TEXT/PLAIN")).toBe(true);
    expect(isAllowedMimeType("pdf", "text/plain")).toBe(false);
    expect(isAllowedMimeType("txt", "application/pdf")).toBe(false);
  });
});
