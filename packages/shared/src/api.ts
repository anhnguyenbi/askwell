import { z } from "zod";
import {
  MAX_KNOWLEDGE_FILE_BYTES,
  MAX_MESSAGE_CHARS,
  MAX_PASTED_TEXT_CHARS,
  isAllowedMimeType,
  knowledgeTypeFromFileName,
} from "./constants";
import { KnowledgeSourceStatusSchema, KnowledgeSourceTypeSchema, MessageRoleSchema } from "./enums";
import { PlanSchema } from "./plans";
import { WidgetConfigSchema } from "./widget";

// ---------- Shared pieces ----------

/** A project's public key: `pk_` + random. Identifies a project; grants nothing. */
export const PublicKeySchema = z.string().regex(/^pk_[A-Za-z0-9_-]{8,64}$/, "Invalid public key");

/** ISO 8601 timestamp as Postgres/Supabase returns it. */
export const TimestampSchema = z.iso.datetime({ offset: true });

export const IdSchema = z.uuid();

/** Path params for every `/:id` route. */
export const IdParamsSchema = z.object({ id: IdSchema });
export type IdParams = z.infer<typeof IdParamsSchema>;

/** Body for deletes. */
export const OkResponseSchema = z.object({ ok: z.literal(true) });
export type OkResponse = z.infer<typeof OkResponseSchema>;

/** Random visitor ID kept in the iframe's localStorage. */
export const VisitorIdSchema = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/, "Invalid visitor ID");

export const ProjectNameSchema = z.string().trim().min(1).max(80);

export const ProjectSchema = z.object({
  id: IdSchema,
  name: z.string(),
  publicKey: PublicKeySchema,
  messagesUsed: z.number().int().nonnegative(),
  periodStart: TimestampSchema,
  createdAt: TimestampSchema,
});
export type Project = z.infer<typeof ProjectSchema>;

export const KnowledgeSourceSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  title: z.string(),
  type: KnowledgeSourceTypeSchema,
  status: KnowledgeSourceStatusSchema,
  createdAt: TimestampSchema,
});
export type KnowledgeSource = z.infer<typeof KnowledgeSourceSchema>;

export const MessageSchema = z.object({
  id: IdSchema,
  conversationId: IdSchema,
  role: MessageRoleSchema,
  body: z.string(),
  createdAt: TimestampSchema,
});
export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  visitorId: z.string(),
  createdAt: TimestampSchema,
});
export type Conversation = z.infer<typeof ConversationSchema>;

export const ConversationSummarySchema = ConversationSchema.extend({
  /** First visitor message, shortened. */
  preview: z.string(),
  messageCount: z.number().int().nonnegative(),
  lastMessageAt: TimestampSchema,
});
export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;

// ---------- Public (widget) ----------

/** GET /api/widget/config?key= */
export const WidgetConfigQuerySchema = z.object({ key: PublicKeySchema });
export type WidgetConfigQuery = z.infer<typeof WidgetConfigQuerySchema>;
/** Plan-applied config (see `applyPlanToConfig`). */
export const WidgetConfigResponseSchema = z.object({ config: WidgetConfigSchema });
export type WidgetConfigResponse = z.infer<typeof WidgetConfigResponseSchema>;

/** POST /api/widget/chat */
export const ChatRequestSchema = z.object({
  key: PublicKeySchema,
  visitorId: VisitorIdSchema,
  conversationId: IdSchema.optional(),
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export const ChatResponseSchema = z.object({
  conversationId: IdSchema,
  reply: z.string(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// ---------- Owner: projects ----------

/** GET /api/projects. `plan` lets the dashboard show limits; the server still enforces them. */
export const ListProjectsResponseSchema = z.object({
  plan: PlanSchema,
  projects: z.array(ProjectSchema),
});
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

/** POST /api/projects */
export const CreateProjectRequestSchema = z.object({ name: ProjectNameSchema });
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;
export const CreateProjectResponseSchema = z.object({ project: ProjectSchema });
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

/** PATCH /api/projects/:id (rename only) */
export const UpdateProjectRequestSchema = z.object({ name: ProjectNameSchema });
export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>;
export const UpdateProjectResponseSchema = z.object({ project: ProjectSchema });
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

/** DELETE /api/projects/:id */
export const DeleteProjectResponseSchema = OkResponseSchema;
export type DeleteProjectResponse = OkResponse;

// ---------- Owner: knowledge ----------

/** POST /api/projects/:id/knowledge (paste text) */
export const PasteKnowledgeRequestSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(MAX_PASTED_TEXT_CHARS),
});
export type PasteKnowledgeRequest = z.infer<typeof PasteKnowledgeRequestSchema>;
export const PasteKnowledgeResponseSchema = z.object({ source: KnowledgeSourceSchema });
export type PasteKnowledgeResponse = z.infer<typeof PasteKnowledgeResponseSchema>;

/**
 * POST /api/projects/:id/knowledge/upload-url
 * Declared name, size and MIME type. The extension must be pdf/md/txt and the
 * MIME type must match it. `finalize` re-checks the real size and PDF bytes.
 */
export const UploadUrlRequestSchema = z
  .object({
    fileName: z.string().trim().min(1).max(255),
    size: z.number().int().positive().max(MAX_KNOWLEDGE_FILE_BYTES, "File is over 10 MB"),
    mimeType: z.string().min(1).max(100),
  })
  .superRefine((val, ctx) => {
    const type = knowledgeTypeFromFileName(val.fileName);
    if (!type) {
      ctx.addIssue({ code: "custom", path: ["fileName"], message: "Only PDF, Markdown and TXT files" });
      return;
    }
    if (!isAllowedMimeType(type, val.mimeType)) {
      ctx.addIssue({ code: "custom", path: ["mimeType"], message: "File type doesn't match its extension" });
    }
  });
export type UploadUrlRequest = z.infer<typeof UploadUrlRequestSchema>;
/** One-time signed upload: the browser uploads to `signedUrl` (or `uploadToSignedUrl(path, token)`). */
export const UploadUrlResponseSchema = z.object({
  source: KnowledgeSourceSchema,
  signedUrl: z.url(),
  path: z.string().min(1),
  token: z.string().min(1),
});
export type UploadUrlResponse = z.infer<typeof UploadUrlResponseSchema>;

/** POST /api/projects/:id/knowledge/finalize */
export const FinalizeKnowledgeRequestSchema = z.object({ sourceId: IdSchema });
export type FinalizeKnowledgeRequest = z.infer<typeof FinalizeKnowledgeRequestSchema>;
export const FinalizeKnowledgeResponseSchema = z.object({ source: KnowledgeSourceSchema });
export type FinalizeKnowledgeResponse = z.infer<typeof FinalizeKnowledgeResponseSchema>;

/** DELETE /api/knowledge/:id */
export const DeleteKnowledgeResponseSchema = OkResponseSchema;
export type DeleteKnowledgeResponse = OkResponse;

// ---------- Owner: conversations ----------

/** GET /api/projects/:id/conversations (newest first) */
export const ListConversationsResponseSchema = z.object({
  conversations: z.array(ConversationSummarySchema),
});
export type ListConversationsResponse = z.infer<typeof ListConversationsResponseSchema>;

/** GET /api/conversations/:id (oldest message first) */
export const ConversationThreadResponseSchema = z.object({
  conversation: ConversationSchema,
  messages: z.array(MessageSchema),
});
export type ConversationThreadResponse = z.infer<typeof ConversationThreadResponseSchema>;

// ---------- Owner: config ----------

/** PATCH /api/projects/:id/config (Pro only; Free → 402 payment_required). Full config. */
export const UpdateConfigRequestSchema = WidgetConfigSchema;
export type UpdateConfigRequest = z.infer<typeof UpdateConfigRequestSchema>;
export const UpdateConfigResponseSchema = z.object({ config: WidgetConfigSchema });
export type UpdateConfigResponse = z.infer<typeof UpdateConfigResponseSchema>;
