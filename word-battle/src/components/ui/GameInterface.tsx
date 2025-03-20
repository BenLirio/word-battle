import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Add this import
import { BattleRequest, BattleResponse } from "word-battle-types/dist/battle";
import { GameInterfaceProps } from "../../types";
import { Alert, AlertDescription } from "./alert";
import { DOMAIN, PROTOCOL } from "../../constants";
import { usePlayers } from "../../context/PlayersContext";
import { useUserData } from "../../context/UserDataContext";
import "./GameInterface.css";
import { WordBattleFunctionName } from "word-battle-types";

const battle = async (req: BattleRequest): Promise<BattleResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.BATTLE,
    data: req,
  });
  if (res.status !== 200) {
    throw new Error("Failed to register user");
  }
  return res.data as BattleResponse;
};

export const GameInterface: React.FC<GameInterfaceProps> = ({
  uuid,
  onError,
}) => {
  const { updatePlayer } = usePlayers();
  const { userData, fetchUserData, error, isLoading } = useUserData();
  const [battleResult, setBattleResult] = useState<BattleResponse | null>(null);

  useEffect(() => {
    fetchUserData(uuid).catch(onError);
  }, [uuid, onError, fetchUserData]);

  const handleBattle = async () => {
    if (!userData) return;

    setBattleResult(null);

    try {
      const battleResult = await battle({ uuid });
      setBattleResult(battleResult);

      updatePlayer(battleResult.userRecord.uuid, {
        elo: battleResult.userRecord.elo,
      });
      updatePlayer(battleResult.otherUserRecord.uuid, {
        elo: battleResult.otherUserRecord.elo,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTryAnotherWord = () => {
    Cookies.remove("battleGameUUID");
    window.location.reload();
  };

  if (isLoading) return <div>Loading user data...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={handleTryAnotherWord}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 mb-4"
      >
        Restart (Try another word)
      </button>
      <h2 className="text-2xl font-bold mb-4">word-battle.com</h2>
      {userData && (
        <div className="mb-4">
          <p className="text-lg">Welcome, {userData.username}!</p>
          <p className="text-md">
            Your battle word: <span className="font-bold">{userData.word}</span>
          </p>
          <p className="text-md">
            Current Rank:{" "}
            <span className="font-bold">{Math.round(userData.elo)}</span>
          </p>
        </div>
      )}

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
            Winner:{" "}
            <span className="battle-result-word">
              {battleResult.winnerUserRecord.word}
            </span>
          </p>
          <p className="battle-result-text">{battleResult.message}</p>
          <p className="battle-result-text">
            ELO Change:{" "}
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
      )}
    </div>
  );
};

export default GameInterface;
