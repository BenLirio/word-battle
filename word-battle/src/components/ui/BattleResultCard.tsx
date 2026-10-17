import React from "react";
import { BattleResponse } from "word-battle-types/dist/battle";
import { MdOutlineIosShare } from "react-icons/md";
import TranslatedWord from "./TranslatedWord";
import TranslatedText from "./TranslatedText";
import { isDifferentText } from "../../localization/language";

interface BattleResultCardProps {
  battleResult: BattleResponse & {
    originalMessage?: string;
    messageLanguage?: string;
  };
}

const BattleResultCard: React.FC<BattleResultCardProps> = ({
  battleResult,
}) => {
  const battleUuid = `${battleResult.userRecord.uuid}:${battleResult.timestamp}`;
  const shareUrl = `${window.location.origin}?battleUuid=${battleUuid}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Battle Details",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="battle-result-card">
      <h3 className="battle-result-title">Battle Result</h3>
      <p className="battle-result-text">
        <span className="battle-result-word">
          <TranslatedWord record={battleResult.userRecord} />
        </span>{" "}
        vs{" "}
        <span className="battle-result-word">
          <TranslatedWord record={battleResult.otherUserRecord} />
        </span>
      </p>
      <p className="battle-result-text">
        <em>
          {battleResult.originalMessage &&
          isDifferentText(
            battleResult.originalMessage,
            battleResult.message,
          ) ? (
            <TranslatedText
              original={battleResult.originalMessage}
              translation={battleResult.message}
              sourceLanguage={battleResult.messageLanguage}
            />
          ) : (
            battleResult.message
          )}
        </em>
      </p>
      <p className="battle-result-text">
        Winner:{" "}
        <span className="battle-result-word">
          <TranslatedWord record={battleResult.winnerUserRecord} />
        </span>
      </p>
      <p className="battle-result-text">
        Rank Change:{" "}
        <span
          className={`battle-result-elo ${
            battleResult.eloChange > 0 ? "elo-positive" : "elo-negative"
          }`}
        >
          {battleResult.eloChange > 0 ? "↑" : "↓"}{" "}
          {Math.round(Math.abs(battleResult.eloChange))}
        </span>
      </p>
      <p className="battle-result-text">
        <MdOutlineIosShare
          size={24}
          onClick={handleShare}
          style={{ cursor: "pointer" }}
        />
      </p>
    </div>
  );
};

export default BattleResultCard;
