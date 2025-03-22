import React, { useState } from "react";
import Cookies from "js-cookie";
import { RegistrationForm } from "./components/ui/RegisterForm";
import { useSearchParams } from "react-router-dom";
import GameInterface from "./components/ui/GameInterface";
import { PlayersProvider } from "./context/PlayersContext";
import ScoreBoard from "./components/ui/ScoreBoard";
import { UserDataProvider } from "./context/UserDataContext";
import Footer from "./components/ui/Footer";
import HistoricalBattle from "./components/ui/HistoricalBattle";

const WordBattleGame: React.FC = () => {
  const [uuid, setUuid] = useState<string | null>(
    Cookies.get("battleGameUUID") || null
  );
  const [searchParams] = useSearchParams();
  const battleUuid = searchParams.get("battleUuid");

  const handleError = () => {
    Cookies.remove("battleGameUUID");
    setUuid(null);
  };

  const parseBattleUuid = (battleUuid: string | null) => {
    if (!battleUuid) return { uuid: null, timestamp: null };
    const [uuid, timestamp] = battleUuid.split(":");
    return { uuid, timestamp: timestamp ? Number(timestamp) : null };
  };

  const { uuid: parsedUuid, timestamp } = parseBattleUuid(battleUuid);

  return (
    <UserDataProvider>
      <div className="min-h-screen bg-gray-100 py-12 flex flex-col">
        <div className="main-content">
          {parsedUuid ? (
            <HistoricalBattle
              uuid={parsedUuid}
              timestamp={timestamp as number}
            />
          ) : !uuid ? (
            <RegistrationForm onRegister={setUuid} />
          ) : (
            <>
              <PlayersProvider>
                <GameInterface uuid={uuid} onError={handleError} />
                <ScoreBoard />
                <Footer />
              </PlayersProvider>
            </>
          )}
        </div>
      </div>
    </UserDataProvider>
  );
};

export default WordBattleGame;
