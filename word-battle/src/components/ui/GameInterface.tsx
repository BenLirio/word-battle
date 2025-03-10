import axios from "axios";
import { useEffect, useState } from "react";
import {
  GetUserRequest,
  GetUserResponse,
  UserRecord,
  WordBattleFunctionName,
} from "word-battle-types";
import { BattleRequest, BattleResponse } from "word-battle-types/dist/battle";
import { GameInterfaceProps } from "../../types";
import { Alert, AlertDescription } from "./alert";
import { DOMAIN, PROTOCOL } from "../../constants";
import { usePlayers } from "../../context/PlayersContext";
import "./GameInterface.css";

const getUser = async (req: GetUserRequest): Promise<GetUserResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.GET_USER,
    data: req,
  });
  if (res.status !== 200) {
    throw new Error("Failed to get user");
  }
  return res.data as GetUserResponse;
};

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
  const [userData, setUserData] = useState<UserRecord | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, [uuid, onError]);

  const fetchUserData = async () => {
    try {
      const { userRecord } = await getUser({ uuid });
      setUserData(userRecord);
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
      const battleResult = await battle({ uuid });
      setBattleResult(battleResult);

      setUserData(battleResult.userRecord);
      updatePlayer(battleResult.userRecord.uuid, {
        elo: battleResult.userRecord.elo,
      });
      updatePlayer(battleResult.otherUserRecord.uuid, {
        elo: battleResult.otherUserRecord.elo,
      });
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
          Current ELO:{" "}
          <span className="font-bold">{Math.round(userData.elo)}</span>
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
