import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRecord,
  ListTopUsersRequest,
  WordBattleFunctionName,
} from "word-battle-types";
import axios from "axios";
import { DOMAIN, PROTOCOL } from "../constants";

interface PlayersContextType {
  players: UserRecord[];
  setPlayers: React.Dispatch<React.SetStateAction<UserRecord[]>>;
  updatePlayer: (uuid: string, updatedPlayer: Partial<UserRecord>) => void;
  addPlayer: (newPlayer: UserRecord) => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

interface PlayersProviderProps {
  children: React.ReactNode;
}

export const PlayersProvider: React.FC<PlayersProviderProps> = ({
  children,
}) => {
  const [players, setPlayers] = useState<UserRecord[]>([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
          funcName: WordBattleFunctionName.LIST_TOP_USERS,
          data: {} as ListTopUsersRequest,
        });
        if (res.status === 200) {
          setPlayers(res.data.userRecords);
        } else {
          throw new Error("Failed to fetch top players");
        }
      } catch (error) {
        console.error("Failed to fetch top players:", error);
      }
    };

    fetchTopPlayers();
  }, []);

  const updatePlayer = (uuid: string, updatedPlayer: Partial<UserRecord>) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.uuid === uuid ? { ...player, ...updatedPlayer } : player
      );
      // Sort players by Rank in descending order
      return updatedPlayers.sort((a, b) => b.elo - a.elo);
    });
  };

  const addPlayer = (newPlayer: UserRecord) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers, newPlayer];
      // Sort players by Rank in descending order
      return updatedPlayers.sort((a, b) => b.elo - a.elo);
    });
  };

  return (
    <PlayersContext.Provider
      value={{ players, setPlayers, updatePlayer, addPlayer }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = (): PlayersContextType => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
