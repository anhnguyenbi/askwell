import { describe, expect, it } from "vitest";
import {
  KnowledgeSourceStatusSchema,
  KnowledgeSourceTypeSchema,
  MessageRoleSchema,
  displayKnowledgeStatus,
} from "./index";

describe("row enums (project.md §7)", () => {
  it("knowledge source type", () => {
    expect(KnowledgeSourceTypeSchema.options).toEqual(["text", "pdf", "md", "txt"]);
    expect(KnowledgeSourceTypeSchema.safeParse("docx").success).toBe(false);
  });

  it("knowledge source status", () => {
    expect(KnowledgeSourceStatusSchema.options).toEqual(["uploading", "processing", "ready", "failed"]);
    expect(KnowledgeSourceStatusSchema.safeParse("done").success).toBe(false);
  });

  it("message role", () => {
    expect(MessageRoleSchema.options).toEqual(["visitor", "bot"]);
    expect(MessageRoleSchema.safeParse("user").success).toBe(false);
  });
});

describe("displayKnowledgeStatus", () => {
  it("shows uploading as processing, others as is", () => {
    expect(displayKnowledgeStatus("uploading")).toBe("processing");
    expect(displayKnowledgeStatus("processing")).toBe("processing");
    expect(displayKnowledgeStatus("ready")).toBe("ready");
    expect(displayKnowledgeStatus("failed")).toBe("failed");
  });
});
