import sanitizeHtml from "sanitize-html";

const DECORATIVE_ICON_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}\u{2728}\u{274C}\u{2714}\u{1F000}-\u{1F9FF}\u{2300}-\u{23FF}\u{2139}\u{FE0F}\u{270D}\u{2696}\u{2699}\u{269B}\u{26A0}\u{26A1}\u{2601}\u{2713}\u{25AA}\u{2197}\u{2B55}]/gu;

const SAFE_ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "div",
  "span",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "small",
  "sub",
  "sup",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "figure",
  "figcaption",
];

const BLOCKED_LINK_DOMAIN_REGEX =
  /^https?:\/\/[^"']*(?:distanceeducationschool\.com|ignou\.ac\.in)/i;

/**
 * Validates a user-supplied URL and returns the trimmed URL if safe, or null otherwise.
 * Rejects javascript:, data:, vbscript:, protocol-relative //, and other unsafe schemes.
 */
export function sanitizeSafeUrl(
  rawUrl?: string | null,
  options: { allowMailtoTel?: boolean; allowHash?: boolean } = {}
): string | null {
  if (!rawUrl) return null;
  // Remove ASCII control characters and whitespace before scheme checks
  const cleaned = rawUrl.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!cleaned) return null;

  if (options.allowHash && cleaned.startsWith("#")) {
    return cleaned;
  }

  // Allow relative paths starting with a single '/' (reject protocol-relative '//')
  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return cleaned;
  }

  try {
    const parsed = new URL(cleaned);
    const allowedProtocols = options.allowMailtoTel
      ? new Set(["http:", "https:", "mailto:", "tel:"])
      : new Set(["http:", "https:"]);
    if (allowedProtocols.has(parsed.protocol)) {
      return cleaned;
    }
  } catch {
    return null;
  }

  return null;
}

export function stripDecorativeIcons(input: string): string {
  if (!input) return input;
  return input
    .replace(DECORATIVE_ICON_REGEX, "")
    .replace(/(<li[^>]*>)\s+/gi, "$1")
    .replace(/\s{2,}/g, " ");
}

function buildSanitizerOptions(allowClasses: boolean): sanitizeHtml.IOptions {
  return {
    allowedTags: SAFE_ALLOWED_TAGS,
    allowedAttributes: {
      ...(allowClasses ? { "*": ["class"] } : {}),
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        if (BLOCKED_LINK_DOMAIN_REGEX.test(href)) {
          return { tagName: "strong", attribs: {} };
        }
        const safeHref = sanitizeSafeUrl(href, { allowMailtoTel: true, allowHash: true });
        if (!safeHref) {
          const rest = { ...attribs };
          delete rest.href;
          return { tagName, attribs: rest };
        }
        const nextAttribs: Record<string, string> = {
          ...attribs,
          href: safeHref,
        };
        if (nextAttribs.target === "_blank") {
          nextAttribs.rel = "noopener noreferrer";
        }
        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        const safeSrc = sanitizeSafeUrl(attribs.src);
        if (!safeSrc) {
          return { tagName: "span", attribs: {} };
        }
        return {
          tagName,
          attribs: {
            ...attribs,
            src: safeSrc,
          },
        };
      },
    },
  };
}

export function sanitizePublicHtml(html: string): string {
  if (!html) return html;
  const sanitized = sanitizeHtml(html, buildSanitizerOptions(true));
  return sanitized
    .replace(DECORATIVE_ICON_REGEX, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/(<li[^>]*>)\s+/gi, "$1");
}

export function sanitizePastedHtml(html: string): string {
  if (!html) return "";
  const sanitized = sanitizeHtml(html, buildSanitizerOptions(false));
  return sanitized.replace(/&nbsp;/g, " ");
}

export function sanitizeGuideLinkUrl(url?: string): string {
  if (!url || url.includes("distanceeducationschool.com") || url.includes("ignou.ac.in")) {
    return "/ignou-admission";
  }
  return sanitizeSafeUrl(url, { allowHash: true }) || "/ignou-admission";
}

export function sanitizeResourceLinkUrl(url?: string, slug?: string): string {
  if (!url) return "/ignou-admission";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
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
  return sanitizeSafeUrl(url) || "/ignou-admission";
}
