import React, { useState } from "react";
import Cookies from "js-cookie";
import { RegistrationForm } from "./components/ui/RegisterForm";
import GameInterface from "./components/ui/GameInterface";
import { PlayersProvider } from "./context/PlayersContext";
import ScoreBoard from "./components/ui/ScoreBoard";

const WordBattleGame: React.FC = () => {
  const [uuid, setUuid] = useState<string | null>(
    Cookies.get("battleGameUUID") || null
  );

  const handleError = () => {
    Cookies.remove("battleGameUUID");
    setUuid(null);
  };

  return (
    <PlayersProvider>
      <div className="min-h-screen bg-gray-100 py-12">
        {!uuid ? (
          <RegistrationForm onRegister={setUuid} />
        ) : (
          <>
            <GameInterface uuid={uuid} onError={handleError} />
            <ScoreBoard />
          </>
        )}
      </div>
    </PlayersProvider>
  );
};

export default WordBattleGame;
