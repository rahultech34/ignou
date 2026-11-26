const DECORATIVE_ICON_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}\u{2728}\u{274C}\u{2714}\u{1F000}-\u{1F9FF}\u{2300}-\u{23FF}\u{2139}\u{FE0F}\u{270D}\u{2696}\u{2699}\u{269B}\u{26A0}\u{26A1}\u{2601}\u{2713}\u{25AA}\u{2197}\u{2B55}]/gu;

export function stripDecorativeIcons(input: string): string {
  if (!input) return input;
  return input
    .replace(DECORATIVE_ICON_REGEX, "")
    .replace(/(<li[^>]*>)\s+/gi, "$1")
    .replace(/\s{2,}/g, " ");
}

export function sanitizePublicHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(DECORATIVE_ICON_REGEX, "")
    .replace(
      /<a\s+[^>]*href=["']https?:\/\/[^"']*(?:distanceeducationschool\.com|ignou\.ac\.in)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
      "<strong>$1</strong>"
    )
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/(<li[^>]*>)\s+/gi, "$1");
}

export function sanitizeGuideLinkUrl(url?: string): string {
  if (!url || url.includes("distanceeducationschool.com") || url.includes("ignou.ac.in")) {
    return "/ignou-admission";
  }
  return url;
}

export function sanitizeResourceLinkUrl(url?: string, slug?: string): string {
  if (!url) return "/ignou-admission";
  if (url.startsWith("/")) return url;
  if (slug) {
    if (slug.includes("hall-ticket")) return "/ignou-hall-ticket";
    if (slug.includes("assignment")) return "/student-zone/ignou-assignment";
    if (slug.includes("grade-card")) return "/ignou-gradecard";
    if (slug.includes("re-registration")) return "/ignou-re-registration";
    if (slug.includes("egyankosh") || slug.includes("study")) return "/ignou-study-material";
  }
  if (
    url.includes("ignou.ac.in") ||
    url.includes("ignou.samarth.edu.in") ||
    url.includes("egyankosh.ac.in") ||
    url.includes("distanceeducationschool.com")
  ) {
    return "/ignou-admission";
  }
  return url;
}
