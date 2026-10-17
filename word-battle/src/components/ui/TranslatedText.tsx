import React, { useState } from "react";
import { MdTranslate } from "react-icons/md";
import { useTranslation } from "../../context/TranslationContext";
import { languageName } from "../../localization/language";

interface TranslatedTextProps {
  original: string;
  translation?: string;
  sourceLanguage?: string;
}

// Shows a translation with a button that switches back to the original.
const TranslatedText: React.FC<TranslatedTextProps> = ({
  original,
  translation,
  sourceLanguage,
}) => {
  const { language } = useTranslation();
  const [showOriginal, setShowOriginal] = useState(false);

  if (translation === undefined) return <>{original}</>;

  const from = languageName(sourceLanguage, language);
  const label = showOriginal
    ? "Show translation"
    : from
      ? `Translated from ${from}. Show original`
      : "Translated. Show original";

  return (
    <>
      <span lang={showOriginal ? undefined : language}>
        {showOriginal ? original : translation}
      </span>{" "}
      <button
        type="button"
        onClick={() => setShowOriginal(!showOriginal)}
        aria-pressed={showOriginal}
        aria-label={label}
        title={label}
        style={{
          background: "none",
          color: "inherit",
          border: "none",
          padding: 0,
          cursor: "pointer",
          verticalAlign: "middle",
          opacity: showOriginal ? 0.4 : 0.7,
        }}
      >
        <MdTranslate size={14} />
      </button>
    </>
  );
};

export default TranslatedText;
