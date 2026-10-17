import React, { useState } from "react";
import { BattleResponse } from "word-battle-types/dist/battle";
import { MdOutlineIosShare } from "react-icons/md";
import TranslatedWord from "./TranslatedWord";
import TranslatedText from "./TranslatedText";
import { isDifferentText } from "../../localization/language";

interface BattleResultCardProps {
  onBattleAgain?: () => void;
  isBattling?: boolean;
  battleResult: BattleResponse & {
    originalMessage?: string;
    messageLanguage?: string;
  };
}

const BattleResultCard: React.FC<BattleResultCardProps> = ({
  battleResult,
  onBattleAgain,
  isBattling,
}) => {
  const [shareStatus, setShareStatus] = useState("");
  const battleUuid = `${battleResult.userRecord.uuid}:${battleResult.timestamp}`;
  const shareUrl = `${window.location.origin}?battleUuid=${battleUuid}`;

  const shareTitle = `${battleResult.userRecord.word} vs ${battleResult.otherUserRecord.word}`;
  const userWon =
    battleResult.winnerUserRecord.uuid === battleResult.userRecord.uuid;
  const wordClass = (won: boolean) =>
    `battle-result-word ${won ? "battle-winner" : "battle-loser"}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch (error) {
        console.error("Error sharing:", error);
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied");
    } catch {
      setShareStatus(shareUrl);
    }
  };

  return (
    <div className="battle-result-card">
      <h3 className="battle-result-title">Battle Result</h3>
      <p className="battle-result-text">
        <span className={wordClass(userWon)}>
          {userWon && <span aria-label="Winner">🏆 </span>}
          <TranslatedWord record={battleResult.userRecord} />
        </span>{" "}
        vs{" "}
        <span className={wordClass(!userWon)}>
          {!userWon && <span aria-label="Winner">🏆 </span>}
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
      <div className="battle-result-actions">
        {onBattleAgain && (
          <button onClick={onBattleAgain} disabled={isBattling}>
            {isBattling ? "Battling..." : "Battle again"}
          </button>
        )}
        <button onClick={handleShare} aria-label="Share this battle">
          <MdOutlineIosShare size={20} /> Share
        </button>
      </div>
      {shareStatus && (
        <p className="battle-result-share-status" role="status">
          {shareStatus}
        </p>
      )}
    </div>
  );
};

export default BattleResultCard;
