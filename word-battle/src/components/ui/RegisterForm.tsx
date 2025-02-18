import { useState } from "react";
import { mockServer } from "../../server/mockServer";
import { RegistrationFormProps, FormData } from "../../types";
import { Alert, AlertDescription } from "./alert";
import Cookies from "js-cookie";

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
      const result = await mockServer.registerUser(
        formData.username,
        formData.word
      );
      if (result.success) {
        Cookies.set("battleGameUUID", result.uuid);
        onRegister(result.uuid);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register for Word Battles</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Battle Word
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
