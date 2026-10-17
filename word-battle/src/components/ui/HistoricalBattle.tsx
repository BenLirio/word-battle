import React, { useEffect, useState } from "react";
import {
  GetBattleRequest,
  GetBattleResponse,
} from "word-battle-types/dist/getBattle";
import { DOMAIN, PROTOCOL } from "../../constants";
import { WordBattleFunctionName } from "word-battle-types";
import axios from "axios";
import Cookies from "js-cookie";
import BattleResultCard from "./BattleResultCard"; // Import the BattleResultCard component
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useTranslation } from "../../context/TranslationContext";

interface HistoricalBattleProps {
  uuid: string;
  timestamp: number;
}

type LocalizedBattleResponse = GetBattleResponse & {
  originalMessage?: string;
  messageLanguage?: string;
};

const getBattle = async ({
  uuid,
  timestamp,
  locale,
}: GetBattleRequest & { locale: string }): Promise<LocalizedBattleResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.GET_BATTLE,
    data: { uuid, timestamp, locale },
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch battle data");
  }
  return res.data as LocalizedBattleResponse;
};

const HistoricalBattle: React.FC<HistoricalBattleProps> = ({
  uuid,
  timestamp,
}) => {
  const [battleResult, setBattleResult] =
    useState<LocalizedBattleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const { language } = useTranslation();

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const result = await getBattle({ uuid, timestamp, locale: language });
        setBattleResult(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        setError("Failed to fetch battle data");
      }
    };

    fetchBattle();
  }, [uuid, timestamp, language]);

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
      <button onClick={handleBackClick}>
        {Cookies.get("battleGameUUID")
          ? "Back to your game"
          : "Play Word Battle"}
      </button>
      {battleResult && (
        <BattleResultCard battleResult={{ ...battleResult, timestamp }} />
      )}
    </div>
  );
};

export default HistoricalBattle;
