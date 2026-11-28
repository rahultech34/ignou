/**
 * Normalizes a URL slug while the user is actively typing.
 * Converts whitespace and underscores to hyphens and strips invalid characters,
 * while preserving a trailing hyphen so multi-word slugs can be typed naturally.
 */
export function normalizeSlugInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "");
}

/**
 * Produces a final clean URL-safe slug without leading or trailing hyphens.
 */
export function slugify(text: string): string {
  return normalizeSlugInput(text.trim()).replace(/^-+|-+$/g, "");
}
