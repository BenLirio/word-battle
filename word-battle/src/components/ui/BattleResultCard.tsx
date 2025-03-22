import React from "react";
import { BattleResponse } from "word-battle-types/dist/battle";

interface BattleResultCardProps {
  battleResult: BattleResponse;
}

const BattleResultCard: React.FC<BattleResultCardProps> = ({
  battleResult,
}) => {
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
    </div>
  );
};

export default BattleResultCard;
