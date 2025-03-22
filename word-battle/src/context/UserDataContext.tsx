import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import {
  GetUserRequest,
  GetUserResponse,
  UserRecord,
  WordBattleFunctionName,
} from "word-battle-types";
import { DOMAIN, PROTOCOL } from "../constants";

interface UserDataContextType {
  userData: UserRecord | null;
  fetchUserData: (uuid: string) => Promise<void>;
  setUserData: React.Dispatch<React.SetStateAction<UserRecord | null>>;
  error: string;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserData = useCallback(async (uuid: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
        funcName: WordBattleFunctionName.GET_USER,
        data: { uuid } as GetUserRequest,
      });
      if (res.status !== 200) {
        throw new Error("Failed to get user");
      }
      const { userRecord } = res.data as GetUserResponse;
      setUserData(userRecord);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserDataContext.Provider
      value={{ userData, fetchUserData, setUserData, error, isLoading }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
