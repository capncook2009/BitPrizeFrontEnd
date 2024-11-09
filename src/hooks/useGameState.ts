import { BACKEND_API_URL } from "@constants/config";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// Define types for your game state
interface GameState {
  score: number;
  level: number;
  lastUpdated: string;
  userId: string;
}

interface UseGameStateProps {
  userId: string;
  initialState?: Partial<GameState>;
}

interface UseGameStateReturn {
  gameState: GameState | null;
  bestScore: string | null;
  updateGameState: (newState: Partial<GameState>) => void;
  error: Error | null;
  isLoading: boolean;
}

const defaultGameState: GameState = {
  score: 0,
  level: 1,
  lastUpdated: new Date().toISOString(),
  userId: "",
};

const STORAGE_KEY = "gameState";
const BEST_SCORE_KEY = "bestScore";

export const useGameState = ({
  userId,
  initialState = {},
}: UseGameStateProps): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [bestScore, setBestScore] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null);
  const { address } = useAccount();

  // Initialize game state from localStorage or default values
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      const bestScore = localStorage.getItem(BEST_SCORE_KEY);

      if (storedState) {
        const parsedState = JSON.parse(storedState) as GameState;

        setGameState(parsedState);
        setBestScore(bestScore);
      } else {
        const newState = {
          ...defaultGameState,
          ...initialState,
          userId,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setGameState(newState);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to initialize game state")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync with backend when localStorage changes
  const syncWithBackend = async (state: GameState) => {
    try {
      console.log("game state test : syncing state with backend", state);

      const body: any = {
        walletAddress: address?.toLocaleLowerCase(),
        score: state.score,
      };

      const response = await axios.post(
        `${BACKEND_API_URL}/api/bitprize/updateGameScore`,
        body
      );

      if (response.data?.error) {
        throw new Error(`Failed to sync with backend: ${response.statusText}`);
      }
      console.log("backend sync success");

      //   const updatedState = await response.json();
      //   return updatedState;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to sync with backend")
      );
      return null;
    }
  };

  // Debounced sync with backend
  const debouncedSync = (state: GameState) => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    const timeoutId = setTimeout(() => {
      syncWithBackend(state);
    }, 1000); // Debounce for 1 second

    setSyncTimeout(timeoutId);
  };

  // Watch for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue) as GameState;

          const bestScore = localStorage.getItem(BEST_SCORE_KEY);

          console.log("game state test:  new state ", { newState });
          setGameState(newState);
          setBestScore(bestScore);
          debouncedSync(newState);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to parse storage change")
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update game state function
  const updateGameState = (newState: Partial<GameState>) => {
    try {
      const updatedState: GameState = {
        ...(gameState || defaultGameState),
        ...newState,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      setGameState(updatedState);
      debouncedSync(updatedState);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update game state")
      );
    }
  };

  return {
    gameState,
    bestScore,
    updateGameState,
    error,
    isLoading,
  };
};
