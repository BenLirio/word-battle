import React, { useEffect, useState } from "react";
import {
  GetBattleRequest,
  GetBattleResponse,
} from "word-battle-types/dist/getBattle";
import { DOMAIN, PROTOCOL } from "../../constants";
import { WordBattleFunctionName } from "word-battle-types";
import axios from "axios";
import BattleResultCard from "./BattleResultCard"; // Import the BattleResultCard component
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

interface HistoricalBattleProps {
  uuid: string;
  timestamp: number;
}

const getBattle = async ({
  uuid,
  timestamp,
}: GetBattleRequest): Promise<GetBattleResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.GET_BATTLE,
    data: { uuid, timestamp },
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch battle data");
  }
  return res.data as GetBattleResponse;
};

const HistoricalBattle: React.FC<HistoricalBattleProps> = ({
  uuid,
  timestamp,
}) => {
  const [battleResult, setBattleResult] = useState<GetBattleResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const result = await getBattle({ uuid, timestamp });
        setBattleResult(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        setError("Failed to fetch battle data");
      }
    };

    fetchBattle();
  }, [uuid, timestamp]);

  const handleBackClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("battleUuid");
    navigate({ search: searchParams.toString() });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button onClick={handleBackClick}>Back</button>
      {battleResult && <BattleResultCard battleResult={battleResult} />}
    </div>
  );
};

export default HistoricalBattle;
