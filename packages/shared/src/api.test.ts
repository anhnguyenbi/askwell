import { describe, expect, it } from "vitest";
import {
  ChatRequestSchema,
  ChatResponseSchema,
  ConversationThreadResponseSchema,
  CreateProjectRequestSchema,
  CreateProjectResponseSchema,
  DEFAULT_WIDGET_CONFIG,
  DeleteKnowledgeResponseSchema,
  DeleteProjectResponseSchema,
  FinalizeKnowledgeRequestSchema,
  FinalizeKnowledgeResponseSchema,
  IdParamsSchema,
  ListConversationsResponseSchema,
  ListProjectsResponseSchema,
  MAX_KNOWLEDGE_FILE_BYTES,
  PasteKnowledgeRequestSchema,
  PasteKnowledgeResponseSchema,
  UpdateConfigRequestSchema,
  UpdateConfigResponseSchema,
  UpdateProjectRequestSchema,
  UpdateProjectResponseSchema,
  UploadUrlRequestSchema,
  UploadUrlResponseSchema,
  WidgetConfigQuerySchema,
  WidgetConfigResponseSchema,
} from "./index";

const id = "6f1c2c1e-5b7a-4c1e-9d3a-2b8f0e4a7c11";
const id2 = "0b9d7f3a-1e2c-4d5b-8a6f-9c0e1d2b3a4f";
const ts = "2026-11-16T10:00:00.123456+00:00";
const key = "pk_abc123XYZ_def";
const project = { id, name: "Docs", publicKey: key, messagesUsed: 3, periodStart: ts, createdAt: ts };
const source = { id: id2, projectId: id, title: "FAQ", type: "pdf", status: "uploading", createdAt: ts };
const conversation = { id: id2, projectId: id, visitorId: "v_12345678", createdAt: ts };

describe("shared pieces", () => {
  it("IdParamsSchema needs a UUID", () => {
    expect(IdParamsSchema.safeParse({ id }).success).toBe(true);
    expect(IdParamsSchema.safeParse({ id: "1" }).success).toBe(false);
  });
});

describe("GET /api/widget/config", () => {
  it("query needs a pk_ key", () => {
    expect(WidgetConfigQuerySchema.safeParse({ key }).success).toBe(true);
    expect(WidgetConfigQuerySchema.safeParse({ key: "sk_abc12345" }).success).toBe(false);
    expect(WidgetConfigQuerySchema.safeParse({ key: "pk_<script>" }).success).toBe(false);
    expect(WidgetConfigQuerySchema.safeParse({}).success).toBe(false);
  });

  it("response holds a config", () => {
    expect(WidgetConfigResponseSchema.safeParse({ config: DEFAULT_WIDGET_CONFIG }).success).toBe(true);
    expect(WidgetConfigResponseSchema.safeParse({ config: {} }).success).toBe(false);
  });
});

describe("POST /api/widget/chat", () => {
  const valid = { key, visitorId: "v_12345678", message: "How do I reset my password?" };

  it("accepts a message with and without a conversation", () => {
    expect(ChatRequestSchema.safeParse(valid).success).toBe(true);
    expect(ChatRequestSchema.safeParse({ ...valid, conversationId: id }).success).toBe(true);
  });

  it("accepts exactly 1,000 characters", () => {
    expect(ChatRequestSchema.safeParse({ ...valid, message: "a".repeat(1000) }).success).toBe(true);
  });

  it("rejects a 1,001-character message", () => {
    expect(ChatRequestSchema.safeParse({ ...valid, message: "a".repeat(1001) }).success).toBe(false);
  });

  it("rejects an empty or blank message", () => {
    expect(ChatRequestSchema.safeParse({ ...valid, message: "" }).success).toBe(false);
    expect(ChatRequestSchema.safeParse({ ...valid, message: "   " }).success).toBe(false);
  });

  it("rejects a bad key, visitor ID or conversation ID", () => {
    expect(ChatRequestSchema.safeParse({ ...valid, key: "nope" }).success).toBe(false);
    expect(ChatRequestSchema.safeParse({ ...valid, visitorId: "x" }).success).toBe(false);
    expect(ChatRequestSchema.safeParse({ ...valid, conversationId: "abc" }).success).toBe(false);
  });

  it("response", () => {
    expect(ChatResponseSchema.safeParse({ conversationId: id, reply: "Hi" }).success).toBe(true);
    expect(ChatResponseSchema.safeParse({ reply: "Hi" }).success).toBe(false);
  });
});

describe("projects", () => {
  it("GET response", () => {
    expect(ListProjectsResponseSchema.safeParse({ plan: "free", projects: [project] }).success).toBe(true);
    expect(ListProjectsResponseSchema.safeParse({ plan: "gold", projects: [] }).success).toBe(false);
  });

  it("POST / PATCH need a name of 1–80 chars", () => {
    for (const schema of [CreateProjectRequestSchema, UpdateProjectRequestSchema]) {
      expect(schema.safeParse({ name: "My site" }).success).toBe(true);
      expect(schema.safeParse({ name: " " }).success).toBe(false);
      expect(schema.safeParse({ name: "x".repeat(81) }).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
    }
  });

  it("POST / PATCH responses", () => {
    expect(CreateProjectResponseSchema.safeParse({ project }).success).toBe(true);
    expect(UpdateProjectResponseSchema.safeParse({ project }).success).toBe(true);
    expect(CreateProjectResponseSchema.safeParse({ project: { ...project, messagesUsed: -1 } }).success).toBe(false);
  });

  it("DELETE response", () => {
    expect(DeleteProjectResponseSchema.safeParse({ ok: true }).success).toBe(true);
    expect(DeleteProjectResponseSchema.safeParse({ ok: false }).success).toBe(false);
  });
});

describe("knowledge", () => {
  it("paste", () => {
    expect(PasteKnowledgeRequestSchema.safeParse({ title: "FAQ", content: "Q: ...\nA: ..." }).success).toBe(true);
    expect(PasteKnowledgeRequestSchema.safeParse({ title: "", content: "x" }).success).toBe(false);
    expect(PasteKnowledgeRequestSchema.safeParse({ title: "FAQ", content: "  " }).success).toBe(false);
    expect(PasteKnowledgeResponseSchema.safeParse({ source: { ...source, type: "text" } }).success).toBe(true);
  });

  describe("upload-url", () => {
    const valid = { fileName: "guide.pdf", size: 1024, mimeType: "application/pdf" };

    it("accepts pdf, md and txt", () => {
      expect(UploadUrlRequestSchema.safeParse(valid).success).toBe(true);
      expect(UploadUrlRequestSchema.safeParse({ fileName: "a.md", size: 1, mimeType: "text/markdown" }).success).toBe(true);
      expect(UploadUrlRequestSchema.safeParse({ fileName: "a.txt", size: 1, mimeType: "text/plain" }).success).toBe(true);
    });

    it("accepts exactly 10 MB", () => {
      expect(UploadUrlRequestSchema.safeParse({ ...valid, size: MAX_KNOWLEDGE_FILE_BYTES }).success).toBe(true);
    });

    it("rejects a file over 10 MB", () => {
      expect(UploadUrlRequestSchema.safeParse({ ...valid, size: MAX_KNOWLEDGE_FILE_BYTES + 1 }).success).toBe(false);
    });

    it("rejects empty files and non-integer sizes", () => {
      expect(UploadUrlRequestSchema.safeParse({ ...valid, size: 0 }).success).toBe(false);
      expect(UploadUrlRequestSchema.safeParse({ ...valid, size: 1.5 }).success).toBe(false);
    });

    it("rejects other extensions", () => {
      expect(UploadUrlRequestSchema.safeParse({ ...valid, fileName: "photo.png" }).success).toBe(false);
    });

    it("rejects a MIME type that doesn't match the extension", () => {
      expect(UploadUrlRequestSchema.safeParse({ ...valid, mimeType: "text/plain" }).success).toBe(false);
      expect(UploadUrlRequestSchema.safeParse({ ...valid, mimeType: "image/png" }).success).toBe(false);
    });

    it("response", () => {
      const res = { source, signedUrl: "https://x.supabase.co/storage/v1/upload/sign/k?token=t", path: "p/a.pdf", token: "t" };
      expect(UploadUrlResponseSchema.safeParse(res).success).toBe(true);
      expect(UploadUrlResponseSchema.safeParse({ ...res, signedUrl: "not a url" }).success).toBe(false);
    });
  });

  it("finalize", () => {
    expect(FinalizeKnowledgeRequestSchema.safeParse({ sourceId: id2 }).success).toBe(true);
    expect(FinalizeKnowledgeRequestSchema.safeParse({ sourceId: "x" }).success).toBe(false);
    expect(FinalizeKnowledgeResponseSchema.safeParse({ source: { ...source, status: "processing" } }).success).toBe(true);
    expect(FinalizeKnowledgeResponseSchema.safeParse({ source: { ...source, status: "done" } }).success).toBe(false);
  });

  it("delete", () => {
    expect(DeleteKnowledgeResponseSchema.safeParse({ ok: true }).success).toBe(true);
    expect(DeleteKnowledgeResponseSchema.safeParse({}).success).toBe(false);
  });
});

describe("conversations", () => {
  it("list", () => {
    const summary = { ...conversation, preview: "Hello", messageCount: 2, lastMessageAt: ts };
    expect(ListConversationsResponseSchema.safeParse({ conversations: [summary] }).success).toBe(true);
    expect(ListConversationsResponseSchema.safeParse({ conversations: [conversation] }).success).toBe(false);
  });

  it("thread", () => {
    const message = { id, conversationId: id2, role: "visitor", body: "Hi", createdAt: ts };
    expect(ConversationThreadResponseSchema.safeParse({ conversation, messages: [message] }).success).toBe(true);
    expect(
      ConversationThreadResponseSchema.safeParse({ conversation, messages: [{ ...message, role: "user" }] }).success,
    ).toBe(false);
  });
});

describe("PATCH /api/projects/:id/config", () => {
  it("needs a full valid config", () => {
    expect(UpdateConfigRequestSchema.safeParse(DEFAULT_WIDGET_CONFIG).success).toBe(true);
    expect(UpdateConfigRequestSchema.safeParse({ buttonColor: "#000000" }).success).toBe(false);
    expect(UpdateConfigRequestSchema.safeParse({ ...DEFAULT_WIDGET_CONFIG, position: "middle" }).success).toBe(false);
    expect(UpdateConfigResponseSchema.safeParse({ config: DEFAULT_WIDGET_CONFIG }).success).toBe(true);
  });
});
