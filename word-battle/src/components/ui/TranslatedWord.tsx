import React, { useEffect, useRef } from "react";
import { UserRecord } from "word-battle-types";
import { useTranslation } from "../../context/TranslationContext";
import { isDifferentText, needsTranslation } from "../../localization/language";
import TranslatedText from "./TranslatedText";

export interface LocalizedUserRecord extends UserRecord {
  sourceLanguage?: string;
  translations?: Record<string, string>;
}

// A player's word in the viewer's language. Uncached translations are
// requested only once the word scrolls into view.
const TranslatedWord: React.FC<{ record: LocalizedUserRecord }> = ({
  record,
}) => {
  const { language, translations, requestTranslation } = useTranslation();
  const ref = useRef<HTMLSpanElement>(null);
  const fetched = translations[record.uuid];
  const translation = record.translations?.[language] ?? fetched?.translation;
  const sourceLanguage = record.sourceLanguage ?? fetched?.sourceLanguage;
  const wanted =
    translation === undefined &&
    needsTranslation(record.word, language, sourceLanguage);

  useEffect(() => {
    const element = ref.current;
    if (!wanted || !element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        requestTranslation(record.uuid);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [wanted, record.uuid, requestTranslation]);

  return (
    <span ref={ref}>
      <TranslatedText
        original={record.word}
        translation={
          isDifferentText(record.word, translation) ? translation : undefined
        }
        sourceLanguage={sourceLanguage}
      />
    </span>
  );
};

export default TranslatedWord;
