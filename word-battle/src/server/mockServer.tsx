import {
  RegisterResponse,
  User,
  BattleResult,
  EloUpdateResponse,
} from "../types";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const USERS_COOKIE = "mockUsers";
const ELOS_COOKIE = "mockElos";

const getUsersFromCookies = () => {
  const users = Cookies.get(USERS_COOKIE);
  return users ? JSON.parse(users) : {};
};

const getElosFromCookies = () => {
  const elos = Cookies.get(ELOS_COOKIE);
  return elos ? JSON.parse(elos) : {};
};

const setUsersToCookies = (users: Record<string, unknown>) => {
  Cookies.set(USERS_COOKIE, JSON.stringify(users));
};

const setElosToCookies = (elos: Record<string, number>) => {
  Cookies.set(ELOS_COOKIE, JSON.stringify(elos));
};

export const mockServer = {
  async registerUser(
    username: string,
    word: string
  ): Promise<RegisterResponse> {
    try {
      const uuid = uuidv4();
      const users = getUsersFromCookies();
      const elos = getElosFromCookies();

      users[uuid] = { username, word };
      elos[uuid] = 1200; // Starting ELO

      setUsersToCookies(users);
      setElosToCookies(elos);

      return { success: true, uuid };
    } catch (error: unknown) {
      console.error("Registration error:", error);
      throw new Error("Failed to register user");
    }
  },

  async getUser(uuid: string): Promise<User> {
    try {
      const users = getUsersFromCookies();
      const elos = getElosFromCookies();

      const user = users[uuid];
      if (!user) throw new Error("User not found");

      return { ...user, elo: elos[uuid] };
    } catch (error: unknown) {
      console.error("Fetch user error:", error);
      throw new Error("Failed to fetch user data");
    }
  },

  async performBattle(
    userWord: string,
    opponentWord: string
  ): Promise<BattleResult> {
    try {
      // Simulate server processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple random battle outcome
      const winner: "player1" | "player2" =
        Math.random() > 0.5 ? "player1" : "player2";
      const reasons = {
        player1: `${userWord} emerged victorious through superior strategy!`,
        player2: `${opponentWord} surprised everyone with an unexpected move!`,
      };

      return {
        winner,
        reason: reasons[winner],
      };
    } catch (error: unknown) {
      console.error("Battle simulation error:", error);
      throw new Error("Battle simulation failed");
    }
  },

  async updateElo(
    uuid: string,
    battleResult: BattleResult
  ): Promise<EloUpdateResponse> {
    try {
      const elos = getElosFromCookies();
      const currentElo = elos[uuid];
      const eloChange = battleResult.winner === "player1" ? 25 : -25;
      elos[uuid] = currentElo + eloChange;

      setElosToCookies(elos);

      return { success: true, newElo: elos[uuid] };
    } catch (error: unknown) {
      console.error("ELO update error:", error);
      throw new Error("Failed to update ELO");
    }
  },

  async getTopPlayers(): Promise<
    { rank: number; username: string; elo: number }[]
  > {
    try {
      const users = getUsersFromCookies();
      const elos = getElosFromCookies();

      const players = Object.keys(users).map((uuid) => ({
        username: users[uuid].username,
        elo: elos[uuid],
      }));

      players.sort((a, b) => b.elo - a.elo);

      return players.slice(0, 10).map((player, index) => ({
        rank: index + 1,
        username: player.username,
        elo: player.elo,
      }));
    } catch (error: unknown) {
      console.error("Fetch top players error:", error);
      throw new Error("Failed to fetch top players");
    }
  },
};
