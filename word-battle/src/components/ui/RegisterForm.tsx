import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import {
  RegisterUserRequest,
  RegisterUserResponse,
  WordBattleFunctionName,
} from "word-battle-types";
import { FormData, RegistrationFormProps } from "../../types";
import { Alert, AlertDescription } from "./alert";
import { DOMAIN, PROTOCOL } from "../../constants";
import styles from "./Register.module.css";

const DESCRIPTION = `
Submit words, challenge others, and watch AI pick winners in matchups like "Would lightning beat rock?" Jump in and see how your picks rank!
  `;

const registerUser = async (
  req: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const res = await axios.post(`${PROTOCOL}://${DOMAIN}/dev/app`, {
    funcName: WordBattleFunctionName.REGISTER_USER,
    data: req,
  });
  if (res.status !== 200) {
    throw new Error("Failed to register user");
  }
  return res.data as RegisterUserResponse;
};

// Registration Form Component
export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegister,
}) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    word: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await registerUser({
        username: formData.username,
        word: formData.word,
      });
      const {
        userRecord: { uuid },
      } = result;
      Cookies.set("battleGameUUID", uuid);
      onRegister(uuid);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Unknown error";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>word-battle.com</h2>
      <p className={styles.description}>
        <em>{DESCRIPTION}</em>
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            className={styles.input}
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className={styles.label}>Battle Word</label>
          <input
            type="text"
            className={styles.input}
            value={formData.word}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, word: e.target.value }))
            }
            required
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
