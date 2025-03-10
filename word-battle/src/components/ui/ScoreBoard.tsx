import React from "react";
import { usePlayers } from "../../context/PlayersContext";

const ScoreBoard: React.FC = () => {
  const { players } = usePlayers();

  if (players.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Top 10 Players</h2>
      <ul>
        {players.map((player, idx) => (
          <li key={idx}>
            {idx + 1}. {Math.round(player.elo)} - {player.word} (
            {player.username})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;
