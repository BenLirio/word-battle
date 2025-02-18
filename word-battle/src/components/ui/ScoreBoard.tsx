import React, { useEffect, useState } from "react";
import { mockServer } from "../../server/mockServer";

interface Player {
  rank: number;
  username: string;
  elo: number;
}

const ScoreBoard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const topPlayers = await mockServer.getTopPlayers();
        setPlayers(topPlayers);
      } catch (error) {
        console.error("Failed to fetch top players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Top 10 Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.rank}>
            {player.rank}. {player.username} - ELO: {player.elo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;
