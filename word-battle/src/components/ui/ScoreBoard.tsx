import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ListTopUsersRequest,
  ListTopUsersResponse,
  UserRecord,
  WordBattleFunctionName,
} from "word-battle-types";
import { DOMAIN, PROTOCOL } from "../../constants";

const listTopUsers = async (
  req: ListTopUsersRequest
): Promise<ListTopUsersResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.LIST_TOP_USERS,
    data: req,
  });
  if (res.status !== 200) {
    throw new Error("Failed to register user");
  }
  return res.data as ListTopUsersResponse;
};

const ScoreBoard: React.FC = () => {
  const [players, setPlayers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const topPlayers = (await listTopUsers({})).userRecords;
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
