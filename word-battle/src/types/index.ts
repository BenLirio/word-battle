// Type definitions
export interface User {
  username: string;
  word: string;
  elo?: number;
}

export interface MockDatabase {
  users: { [key: string]: User };
  words: string[];
  elos: { [key: string]: number };
}

export interface BattleResult {
  winner: "player1" | "player2";
  reason: string;
  opponentWord?: string;
}

export interface RegisterResponse {
  success: boolean;
  uuid: string;
}

export interface EloUpdateResponse {
  success: boolean;
  newElo: number;
}

export interface RegistrationFormProps {
  onRegister: (uuid: string) => void;
}

export interface FormData {
  username: string;
  word: string;
}

export interface GameInterfaceProps {
  uuid: string;
  onError: () => void;
}
