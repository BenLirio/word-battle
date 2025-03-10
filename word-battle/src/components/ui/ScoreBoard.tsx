import React from "react";
import { usePlayers } from "../../context/PlayersContext";
import styles from "./ScoreBoard.module.css";

const ScoreBoard: React.FC = () => {
  const { players } = usePlayers();

  if (players.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.scoreboard}>
      <h2>Top 10 Players</h2>
      <ul>
        {players.map((player, idx) => (
          <li key={idx}>
            <span>
              {idx + 1}. {Math.round(player.elo)}
            </span>
            <span>{player.word}</span>
            <span>({player.username})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;
