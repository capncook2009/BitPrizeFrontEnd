import { useState, useEffect } from "react";

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
// const BEST_SCORE_KEY = "bestScore";

export const useGameState = ({
  userId,
  initialState = {},
}: UseGameStateProps): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize game state from localStorage or default values
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState) as GameState;
        setGameState(parsedState);
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
  }, [userId, initialState]);

  // Sync with backend when localStorage changes
  const syncWithBackend = async (state: GameState) => {
    try {
      console.log("game state test : syncing state with backend", state);
      //   const response = await fetch(apiEndpoint, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(state),
      //   });

      //   if (!response.ok) {
      //     throw new Error(`Failed to sync with backend: ${response.statusText}`);
      //   }

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

          console.log("game state test:  new state ", { newState });
          setGameState(newState);
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
    updateGameState,
    error,
    isLoading,
  };
};
