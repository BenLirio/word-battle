import React, { useEffect, useState } from "react";
import { usePlayers } from "../../context/PlayersContext";
import { useUserData } from "../../context/UserDataContext";
import { UserRecord } from "word-battle-types";
import styles from "./ScoreBoard.module.css";

const NUM_PLAYERS_BEFORE_AND_AFTER = 5;

const PlayerList: React.FC<{
  players: UserRecord[];
  userData: UserRecord | null;
  showAllPlayers: boolean;
  startIndex: number;
  endIndex: number;
  onlyScoreboard: boolean;
}> = ({
  players,
  userData,
  showAllPlayers,
  startIndex,
  endIndex,
  onlyScoreboard,
}) => {
  return (
    <ul>
      <li className={styles.listItem}>
        <span>Rank</span>
        <span>Word</span>
        <span>Username</span>
      </li>
      {showAllPlayers || onlyScoreboard ? (
        (onlyScoreboard ? players.slice(0, 10) : players).map((player, idx) => (
          <li
            key={idx}
            className={`${styles.listItem} ${
              player.uuid === userData?.uuid ? styles.highlight : ""
            }`}
          >
            <span>{`#${idx + 1} (${Math.round(player.elo)})`}</span>
            <span>{player.word}</span>
            <span>({player.username})</span>
          </li>
        ))
      ) : (
        <>
          {startIndex > 0 && <li className={styles.listItem}>...</li>}
          {players.slice(startIndex, endIndex).map((player, idx) => (
            <li
              key={idx}
              className={`${styles.listItem} ${
                player.uuid === userData?.uuid ? styles.highlight : ""
              }`}
            >
              <span>{Math.round(player.elo)}</span>
              <span>{player.word}</span>
              <span>({player.username})</span>
            </li>
          ))}
          {endIndex < players.length && (
            <li className={styles.listItem}>...</li>
          )}
        </>
      )}
    </ul>
  );
};

const ScoreBoard: React.FC = () => {
  const { players } = usePlayers();
  const { userData } = useUserData();
  const [onlyScoreboard, setOnlyScoreboard] = useState(false);
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<
    number | null
  >(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const calculateIndices = (
    currentPlayerIndex: number,
    totalPlayers: number
  ) => {
    const startIndex = Math.max(
      0,
      currentPlayerIndex - NUM_PLAYERS_BEFORE_AND_AFTER
    );
    const endIndex = Math.min(
      totalPlayers,
      currentPlayerIndex + 1 + NUM_PLAYERS_BEFORE_AND_AFTER
    );
    return { startIndex, endIndex };
  };

  useEffect(() => {
    setOnlyScoreboard(userData?.uuid === undefined || userData?.uuid === null);
    if (players.length === 0) return;

    const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);
    const currentPlayerIndex = sortedPlayers.findIndex(
      ({ uuid }) => uuid === userData?.uuid
    );
    if (currentPlayerIndex === -1) return;

    setCurrentPlayerPosition(currentPlayerIndex + 1);

    const { startIndex, endIndex } = calculateIndices(
      currentPlayerIndex,
      sortedPlayers.length
    );
    setStartIndex(startIndex);
    setEndIndex(endIndex);
  }, [players, userData]);

  if (players.length === 0) {
    return <div>Loading...</div>;
  }

  const handleToggleShowAllPlayers = () => {
    setShowAllPlayers(!showAllPlayers);
  };

  return (
    <div className={styles.scoreboard}>
      {currentPlayerPosition !== null && (
        <div>
          <h3>You are #{currentPlayerPosition} in the world</h3>
        </div>
      )}
      {onlyScoreboard === false && (
        <button onClick={handleToggleShowAllPlayers}>
          {showAllPlayers ? "Show Nearby Players" : "Show All Players"}
        </button>
      )}
      <h2>Player List</h2>
      <PlayerList
        players={players}
        userData={userData}
        showAllPlayers={showAllPlayers}
        startIndex={startIndex}
        endIndex={endIndex}
        onlyScoreboard={onlyScoreboard}
      />
    </div>
  );
};

export default ScoreBoard;
