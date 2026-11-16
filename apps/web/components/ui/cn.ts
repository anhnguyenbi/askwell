export type ClassValue = string | number | null | undefined | false | ClassDictionary | ClassValue[];
export type ClassDictionary = Record<string, boolean | null | undefined>;

/**
 * Join class names, skipping falsy values.
 * Accepts strings, arrays and `{ className: condition }` objects.
 * It does not resolve Tailwind conflicts: pass overrides last and avoid
 * giving two classes for the same property.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input && input !== 0) continue;
    if (typeof input === "string" || typeof input === "number") {
      const s = String(input).trim();
      if (s) out.push(s);
    } else if (Array.isArray(input)) {
      const s = cn(...input);
      if (s) out.push(s);
    } else {
      for (const [key, on] of Object.entries(input)) {
        if (on && key.trim()) out.push(key.trim());
      }
    }
  }
  return out.join(" ");
}
