import React, { createContext, useContext, useState } from "react";

interface LeaderboardContextType {
  leaderboard: string | undefined;
  setLeaderboard: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined
);

interface LeaderboardProviderProps {
  children: React.ReactNode;
}

export const LeaderboardProvider: React.FC<LeaderboardProviderProps> = ({
  children,
}) => {
  const [leaderboard, setLeaderboard] = useState<string | undefined>(undefined);

  return (
    <LeaderboardContext.Provider value={{ leaderboard, setLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = (): LeaderboardContextType => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
