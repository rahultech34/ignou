export const BLOG_CATEGORIES = [
  "Admissions",
  "Admission Updates",
  "Exam & Datesheet",
  "Exam & Results",
  "Assignments",
  "Results & Grade Card",
  "Career & Placement",
  "Student Guides",
  "Library & Information Science",
  "Science & Research",
  "Media & Communication",
] as const;

/**
 * Estimates reading time from HTML or plain text content at ~200 words/minute.
 */
export function estimateReadingTime(content: string): string {
  if (!content) return "1 min read";
  const clean = content.replace(/<[^>]*>/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  if (words === 0) return "1 min read";
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Returns an explicit reading time if provided, otherwise computes one from content.
 */
export function calculateReadingTime(content: string, fallback?: string): string {
  if (fallback && fallback.trim()) return fallback.trim();
  return estimateReadingTime(content);
}
