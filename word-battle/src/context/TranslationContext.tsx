import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { DOMAIN, PROTOCOL } from "../constants";
import { getViewerLanguage } from "../localization/language";

// Not in word-battle-types yet; the server registers the same name.
const TRANSLATE_WORDS = "TRANSLATE_WORDS";
const BATCH_SIZE = 25;
const BATCH_DELAY_MS = 100;

interface WordTranslation {
  uuid: string;
  sourceLanguage?: string;
  translation: string;
}

interface TranslationContextType {
  language: string;
  translations: Record<string, WordTranslation>;
  requestTranslation: (uuid: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language] = useState(getViewerLanguage);
  const [translations, setTranslations] = useState<
    Record<string, WordTranslation>
  >({});
  const queue = useRef(new Set<string>());
  const requested = useRef(new Set<string>());
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const flush = useCallback(async () => {
    timer.current = undefined;
    const uuids = [...queue.current];
    queue.current.clear();
    for (let i = 0; i < uuids.length; i += BATCH_SIZE) {
      const batch = uuids.slice(i, i + BATCH_SIZE);
      try {
        const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
          funcName: TRANSLATE_WORDS,
          data: { uuids: batch, locale: language },
        });
        const received = res.data.translations as WordTranslation[];
        setTranslations((previous) => ({
          ...previous,
          ...Object.fromEntries(received.map((t) => [t.uuid, t])),
        }));
      } catch (error) {
        // Words stay in their original language; they are not retried.
        console.error("Failed to translate words:", error);
      }
    }
  }, [language]);

  const requestTranslation = useCallback(
    (uuid: string) => {
      if (requested.current.has(uuid)) return;
      requested.current.add(uuid);
      queue.current.add(uuid);
      if (timer.current === undefined) {
        timer.current = window.setTimeout(flush, BATCH_DELAY_MS);
      }
    },
    [flush],
  );

  return (
    <TranslationContext.Provider
      value={{ language, translations, requestTranslation }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
