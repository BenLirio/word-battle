import React, { useEffect, useState } from "react";
import { usePlayers } from "../../context/PlayersContext";
import styles from "./ScoreBoard.module.css";
import { useUserData } from "../../context/UserDataContext";
import { UserRecord } from "word-battle-types";
import "./ScoreBoard.module.css";

const NUM_PLAYERS_BEFORE_AND_AFTER = 5;

const ScoreBoard: React.FC = () => {
  const { players } = usePlayers();
  const { userData } = useUserData();
  const [displayedPlayers, setDisplayedPlayers] = useState([] as UserRecord[]);
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<
    number | null
  >(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  useEffect(() => {
    if (players.length === 0) {
      return;
    }

    // Sort players by Rank
    const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);

    // Find the index of the current player in the sorted list
    const currentPlayerIndex = sortedPlayers.findIndex(
      ({ uuid }) => uuid === userData?.uuid
    );
    if (currentPlayerIndex === -1) {
      return;
    }

    // Set the current player's position
    setCurrentPlayerPosition(currentPlayerIndex + 1);

    // Determine the range of players to display
    const startIndex = Math.max(
      0,
      currentPlayerIndex - NUM_PLAYERS_BEFORE_AND_AFTER
    );
    setStartIndex(startIndex);
    const endIndex = Math.min(
      sortedPlayers.length,
      currentPlayerIndex + 1 + NUM_PLAYERS_BEFORE_AND_AFTER
    );
    setEndIndex(endIndex);

    // Slice the list of players to get the desired range
    const newDisplayedPlayers = sortedPlayers.slice(startIndex, endIndex);

    setDisplayedPlayers(newDisplayedPlayers);
  }, [players, userData]);

  if (players.length === 0) {
    return <div>Loading...</div>;
  }

  if (displayedPlayers.length === 0) {
    return <div>Current player not found</div>;
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
      <button onClick={handleToggleShowAllPlayers}>
        {showAllPlayers ? "Show Nearby Players" : "Show All Players"}
      </button>
      <h2>Player List</h2>
      <ul>
        <li className={styles.listItem}>
          <span>Rank</span>
          <span>Word</span>
          <span>Username</span>
        </li>
        {showAllPlayers ? (
          players.map((player, idx) => (
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
            {displayedPlayers.map((player, idx) => (
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
    </div>
  );
};

export default ScoreBoard;
