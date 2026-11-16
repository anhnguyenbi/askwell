import { z } from "zod";

/** `knowledge_sources.type` (project.md §7). `text` = pasted text. */
export const KNOWLEDGE_SOURCE_TYPES = ["text", "pdf", "md", "txt"] as const;
export const KnowledgeSourceTypeSchema = z.enum(KNOWLEDGE_SOURCE_TYPES);
export type KnowledgeSourceType = z.infer<typeof KnowledgeSourceTypeSchema>;

/** `knowledge_sources.status` (project.md §7). */
export const KNOWLEDGE_SOURCE_STATUSES = ["uploading", "processing", "ready", "failed"] as const;
export const KnowledgeSourceStatusSchema = z.enum(KNOWLEDGE_SOURCE_STATUSES);
export type KnowledgeSourceStatus = z.infer<typeof KnowledgeSourceStatusSchema>;

/** `messages.role` (project.md §7). */
export const MESSAGE_ROLES = ["visitor", "bot"] as const;
export const MessageRoleSchema = z.enum(MESSAGE_ROLES);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

/** The status to show an owner: a reserved `uploading` source shows as `processing` (§6.4). */
export function displayKnowledgeStatus(
  status: KnowledgeSourceStatus,
): Exclude<KnowledgeSourceStatus, "uploading"> {
  return status === "uploading" ? "processing" : status;
}
