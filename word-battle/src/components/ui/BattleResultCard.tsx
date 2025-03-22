import React from "react";
import { BattleResponse } from "word-battle-types/dist/battle";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import { FaShareAlt } from "react-icons/fa"; // Import a share icon from react-icons

interface BattleResultCardProps {
  battleResult: BattleResponse;
}

const BattleResultCard: React.FC<BattleResultCardProps> = ({
  battleResult,
}) => {
  const battleUuid = `${battleResult.userRecord.uuid}:${battleResult.timestamp}`;
  const shareUrl = `${window.location.origin}/battle-details?battleUuid=${battleUuid}`;

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
          {battleResult.userRecord.word}
        </span>{" "}
        vs{" "}
        <span className="battle-result-word">
          {battleResult.otherUserRecord.word}
        </span>
      </p>
      <p className="battle-result-text">
        <em>{battleResult.message}</em>
      </p>
      <p className="battle-result-text">
        Winner:{" "}
        <span className="battle-result-word">
          {battleResult.winnerUserRecord.word}
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
        <FaShareAlt onClick={handleShare} style={{ cursor: "pointer" }} />
      </p>
    </div>
  );
};

export default BattleResultCard;
