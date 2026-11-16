/** Max knowledge file size: 10 MB. The Storage bucket enforces the same limit. */
export const MAX_KNOWLEDGE_FILE_BYTES = 10 * 1024 * 1024;

/** File types a knowledge upload may have, with the extension and MIME types accepted for each. */
export const KNOWLEDGE_FILE_TYPES = {
  pdf: { extensions: [".pdf"], mimeTypes: ["application/pdf"] },
  md: { extensions: [".md", ".markdown"], mimeTypes: ["text/markdown", "text/x-markdown", "text/plain"] },
  txt: { extensions: [".txt"], mimeTypes: ["text/plain"] },
} as const;

export type KnowledgeFileType = keyof typeof KNOWLEDGE_FILE_TYPES;

export const KNOWLEDGE_FILE_TYPE_KEYS = Object.keys(KNOWLEDGE_FILE_TYPES) as KnowledgeFileType[];

/** Every MIME type the knowledge bucket accepts. */
export const ALLOWED_KNOWLEDGE_MIME_TYPES: readonly string[] = [
  ...new Set(Object.values(KNOWLEDGE_FILE_TYPES).flatMap((t) => t.mimeTypes)),
];

/** Every file extension accepted for knowledge uploads (lowercase, with the dot). */
export const ALLOWED_KNOWLEDGE_EXTENSIONS: readonly string[] = Object.values(KNOWLEDGE_FILE_TYPES).flatMap(
  (t) => t.extensions,
);

/** Max characters in one visitor chat message. */
export const MAX_MESSAGE_CHARS = 1000;

/** Max characters in one pasted knowledge text. */
export const MAX_PASTED_TEXT_CHARS = 200_000;

/** Arcjet rate limit on the chat route, per public key + IP. */
export const CHAT_RATE_LIMIT = { max: 20, windowSeconds: 60 } as const;

/**
 * The knowledge type for a file name, from its extension (case-insensitive),
 * or `null` if the extension isn't allowed.
 */
export function knowledgeTypeFromFileName(fileName: string): KnowledgeFileType | null {
  const lower = fileName.toLowerCase();
  for (const type of KNOWLEDGE_FILE_TYPE_KEYS) {
    if ((KNOWLEDGE_FILE_TYPES[type].extensions as readonly string[]).some((ext) => lower.endsWith(ext))) {
      return type;
    }
  }
  return null;
}

/** Is this MIME type accepted for this knowledge file type? */
export function isAllowedMimeType(type: KnowledgeFileType, mimeType: string): boolean {
  return (KNOWLEDGE_FILE_TYPES[type].mimeTypes as readonly string[]).includes(mimeType.toLowerCase());
}
