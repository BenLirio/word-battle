import { useState, useEffect } from "react";
import { mockDatabase } from "../../server/database";
import { mockServer } from "../../server/mockServer";
import { GameInterfaceProps, User, BattleResult } from "../../types";
import { Alert, AlertDescription } from "./alert";
import ScoreBoard from "./ScoreBoard";

export const GameInterface: React.FC<GameInterfaceProps> = ({
  uuid,
  onError,
}) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, [uuid, onError]);

  const fetchUserData = async () => {
    try {
      const data = await mockServer.getUser(uuid);
      setUserData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      onError();
    }
  };

  const handleBattle = async () => {
    if (!userData) return;

    setError("");
    setIsLoading(true);
    setBattleResult(null);

    try {
      // Select random opponent
      const opponentWord =
        mockDatabase.words[
          Math.floor(Math.random() * mockDatabase.words.length)
        ];

      // Perform battle
      const result = await mockServer.performBattle(
        userData.word,
        opponentWord
      );
      setBattleResult({ ...result, opponentWord });

      // Update ELO
      const eloUpdate = await mockServer.updateElo(uuid, result);
      if (eloUpdate.success) {
        setUserData((prev) =>
          prev ? { ...prev, elo: eloUpdate.newElo } : null
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return <div>Loading user data...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Word Battle Arena</h2>
      <div className="mb-4">
        <p className="text-lg">Welcome, {userData.username}!</p>
        <p className="text-md">
          Your battle word: <span className="font-bold">{userData.word}</span>
        </p>
        <p className="text-md">
          Current ELO: <span className="font-bold">{userData.elo}</span>
        </p>
      </div>

      <button
        onClick={handleBattle}
        disabled={isLoading}
        className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        {isLoading ? "Battling..." : "Start Battle"}
      </button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {battleResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">Battle Result</h3>
          <p className="mb-2">
            {userData.word} vs {battleResult.opponentWord}
          </p>
          <p className="mb-2">
            Winner:{" "}
            {battleResult.winner === "player1"
              ? userData.word
              : battleResult.opponentWord}
          </p>
          <p>{battleResult.reason}</p>
        </div>
      )}
      <ScoreBoard />
    </div>
  );
};

export default GameInterface;
