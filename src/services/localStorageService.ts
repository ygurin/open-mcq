import {
  AnsweredQuestions,
  AppMode,
  AppState,
  ExamState,
  TestResults,
} from "../types";

// Storage keys
const STORAGE_PREFIX = "open-mcq";
const KEYS = {
  APP_STATE: `${STORAGE_PREFIX}-app-state`,
  LAST_ACTIVITY: `${STORAGE_PREFIX}-last-activity`,
};

// Expiration time (30 minutes in milliseconds)
const EXPIRATION_TIME = 30 * 60 * 1000;

/**
 * Saves current application state to localStorage
 */
export function saveAppState(state: Partial<AppState>): void {
  try {
    // Get current timestamp
    const timestamp = Date.now();

    // Save last activity time
    localStorage.setItem(KEYS.LAST_ACTIVITY, timestamp.toString());

    // Save app state
    localStorage.setItem(KEYS.APP_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving app state:", error);
  }
}

/**
 * Loads application state from localStorage
 */
export function loadAppState(): Partial<AppState> | null {
  try {
    // Check if we have a stored state
    const storedStateString = localStorage.getItem(KEYS.APP_STATE);
    if (!storedStateString) return null;

    // Check if the stored state has expired
    const lastActivity = localStorage.getItem(KEYS.LAST_ACTIVITY);
    if (lastActivity) {
      const activityTime = parseInt(lastActivity, 10);
      const currentTime = Date.now();

      // If more than expiration time has passed, consider the state expired
      if (currentTime - activityTime > EXPIRATION_TIME) {
        clearAppState();
        return null;
      }
    }

    // Parse and return the state
    return JSON.parse(storedStateString) as Partial<AppState>;
  } catch (error) {
    console.error("Error loading app state:", error);
    return null;
  }
}

/**
 * Clears saved application state
 */
export function clearAppState(): void {
  try {
    localStorage.removeItem(KEYS.APP_STATE);
    localStorage.removeItem(KEYS.LAST_ACTIVITY);
  } catch (error) {
    console.error("Error clearing app state:", error);
  }
}

/**
 * Updates last activity timestamp
 */
export function updateLastActivity(): void {
  try {
    localStorage.setItem(KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
}

/**
 * Saves mode-specific state
 */
export function saveModeState(
  mode: AppMode,
  selectedCategory: string | null,
  selectedQuestion: string,
  answeredQuestions: AnsweredQuestions,
  testResults?: TestResults,
  exam?: ExamState | null
): void {
  const stateToSave: Partial<AppState> = {
    mode,
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
  };

  // Add mode-specific state
  if (mode === "category-test" && testResults) {
    stateToSave.testResults = testResults;
  } else if (mode === "exam" && exam) {
    stateToSave.exam = exam;
  }

  saveAppState(stateToSave);
}
