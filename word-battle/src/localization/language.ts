// Must match SUPPORTED_LANGUAGES in word-battle-server.
const SUPPORTED_LANGUAGES = [
  "en",
  "zh-Hans",
  "zh-Hant",
  "ja",
  "ko",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ru",
  "uk",
  "pl",
  "nl",
  "sv",
  "tr",
  "el",
  "ar",
  "he",
  "fa",
  "hi",
  "bn",
  "vi",
  "th",
  "id",
  "ms",
];

export const DEFAULT_LANGUAGE = "en";

export const normalizeLanguage = (
  locale?: string | null,
): string | undefined => {
  if (!locale) return undefined;
  const parts = locale.trim().toLowerCase().split(/[-_]/);
  const primary = parts[0];
  if (primary === "zh") {
    const traditional = parts
      .slice(1)
      .some((part) => ["hant", "tw", "hk", "mo"].includes(part));
    return traditional ? "zh-Hant" : "zh-Hans";
  }
  return SUPPORTED_LANGUAGES.includes(primary) ? primary : undefined;
};

// The visitor's language: ?lang= first, then the browser's preferred
// languages in order, then English.
export const getViewerLanguage = (): string => {
  const override = new URLSearchParams(window.location.search).get("lang");
  const candidates = [
    override,
    ...(navigator.languages || []),
    navigator.language,
  ];
  for (const candidate of candidates) {
    const language = normalizeLanguage(candidate);
    if (language) return language;
  }
  return DEFAULT_LANGUAGE;
};

const comparable = (text: string) => text.trim().toLowerCase();

// Whether a word could read differently in the viewer's language. Emoji and
// symbols need no translation, and plain ASCII is assumed readable in English.
export const needsTranslation = (
  word: string,
  language: string,
  sourceLanguage?: string,
) => {
  if (!/\p{L}/u.test(word)) return false;
  if (sourceLanguage === language) return false;
  if (language === DEFAULT_LANGUAGE && /^[\x20-\x7E]*$/.test(word))
    return false;
  return true;
};

export const isDifferentText = (original: string, translation?: string) =>
  translation !== undefined && comparable(original) !== comparable(translation);

export const languageName = (
  code: string | undefined,
  displayLanguage: string,
) => {
  if (!code || code === "und") return undefined;
  try {
    return new Intl.DisplayNames([displayLanguage], { type: "language" }).of(
      code,
    );
  } catch {
    return code;
  }
};
