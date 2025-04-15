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
  COMPLETED_EXAMS: `${STORAGE_PREFIX}-completed-exams`,
  COMPLETED_TESTS: `${STORAGE_PREFIX}-completed-tests`,
};

// Expiration time (30 minutes in milliseconds)
const EXPIRATION_TIME = 30 * 60 * 1000;

/**
 * Tracks completed exams and tests to prevent recovery
 */
export function markSessionCompleted(
  type: "exam" | "test",
  identifier?: string
): void {
  try {
    const key = type === "exam" ? KEYS.COMPLETED_EXAMS : KEYS.COMPLETED_TESTS;
    const existingData = localStorage.getItem(key);
    let completedSessions: string[] = [];

    if (existingData) {
      completedSessions = JSON.parse(existingData);
    }

    // Use timestamp as identifier if none provided
    const sessionId = identifier || Date.now().toString();

    // Add to completed sessions
    if (!completedSessions.includes(sessionId)) {
      completedSessions.push(sessionId);
      localStorage.setItem(key, JSON.stringify(completedSessions));
    }

    // Clear any saved state immediately
    clearAppState();
  } catch (error) {
    console.error(`Error marking ${type} as completed:`, error);
  }
}

/**
 * Checks if session was previously completed
 */
export function isSessionCompleted(
  type: "exam" | "test",
  identifier?: string
): boolean {
  try {
    const key = type === "exam" ? KEYS.COMPLETED_EXAMS : KEYS.COMPLETED_TESTS;
    const existingData = localStorage.getItem(key);

    if (!existingData) return false;

    const completedSessions: string[] = JSON.parse(existingData);

    // If no specific identifier, check if any session was completed
    if (!identifier) return completedSessions.length > 0;

    return completedSessions.includes(identifier);
  } catch (error) {
    console.error(`Error checking if ${type} was completed:`, error);
    return false;
  }
}

/**
 * Saves current application state to localStorage
 */
export function saveAppState(state: Partial<AppState>): void {
  try {
    // Don't save state in these cases

    // Skip in review mode
    if (state.mode === "review") {
      return;
    }

    // Skip if in category test or practice with no category
    if (
      (state.mode === "category-test" || state.mode === "practice") &&
      !state.selectedCategory
    ) {
      return;
    }

    // For exam mode, check if complete or in review
    if (state.mode === "exam" && state.exam) {
      // Check if this exam has been marked as completed
      const examId = state.exam.startTime?.toString();
      if (isSessionCompleted("exam", examId)) {
        return;
      }

      // Also don't save if the exam is marked as complete or in review
      if (state.exam.isComplete || state.exam.isReview) {
        // Mark this exam as completed to prevent future recovery
        if (state.exam.isComplete) {
          markSessionCompleted("exam", examId);
        }
        return;
      }
    }

    // For category test mode, check if we're showing results
    if (state.mode === "category-test" && state.showResults) {
      // Mark this test as completed to prevent future recovery
      markSessionCompleted("test", state.selectedCategory || undefined);
      return;
    }

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

    // Parse the state
    const state = JSON.parse(storedStateString) as Partial<AppState>;

    // Don't recover for specific conditions

    // Don't recover review mode
    if (state.mode === "review") {
      clearAppState();
      return null;
    }

    // Skip if in category test or practice with no category
    if (
      (state.mode === "category-test" || state.mode === "practice") &&
      !state.selectedCategory
    ) {
      clearAppState();
      return null;
    }

    // For exam mode, check if completed or reviewing
    if (state.mode === "exam" && state.exam) {
      // Check if this exam was marked as completed
      const examId = state.exam.startTime?.toString();
      if (isSessionCompleted("exam", examId)) {
        clearAppState();
        return null;
      }

      // Also don't recover if exam is marked as complete or in review
      if (state.exam.isComplete || state.exam.isReview) {
        // Mark this exam as completed
        if (state.exam.isComplete) {
          markSessionCompleted("exam", examId);
        }
        clearAppState();
        return null;
      }
    }

    // For category test mode, check if showing results
    if (state.mode === "category-test" && state.showResults) {
      // Mark this test as completed
      markSessionCompleted("test", state.selectedCategory || undefined);
      clearAppState();
      return null;
    }

    // Check if this category test was previously completed
    if (state.mode === "category-test" && state.selectedCategory) {
      if (isSessionCompleted("test", state.selectedCategory)) {
        clearAppState();
        return null;
      }
    }

    return state;
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
  // Don't save state in specific cases

  // Skip in review mode
  if (mode === "review") {
    return;
  }

  // Skip if in category test or practice with no category
  if ((mode === "category-test" || mode === "practice") && !selectedCategory) {
    return;
  }

  // For exam mode, check completion status
  if (mode === "exam" && exam) {
    // Check if this exam was marked as completed
    const examId = exam.startTime?.toString();
    if (isSessionCompleted("exam", examId)) {
      return;
    }

    // Don't save if exam is complete or in review
    if (exam.isComplete || exam.isReview) {
      // Mark this exam as completed if it's complete
      if (exam.isComplete) {
        markSessionCompleted("exam", examId);
      }
      return;
    }
  }

  // For category test mode, check if we're at results screen
  if (
    mode === "category-test" &&
    testResults &&
    Object.keys(testResults).length > 0
  ) {
    // Check if we should consider this test complete
    let isTestComplete = false;

    // If we have a selected category and results for it
    if (selectedCategory && testResults[selectedCategory]) {
      const categoryResult = testResults[selectedCategory];
      // Test is complete if all questions have been answered
      isTestComplete =
        categoryResult.totalQuestions === categoryResult.availableQuestions;
    }

    if (isTestComplete) {
      markSessionCompleted("test", selectedCategory || undefined);
      return;
    }
  }

  const stateToSave: Partial<AppState> = {
    mode,
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
  };

  // Add mode-specific state
  if (mode === "category-test" && testResults) {
    stateToSave.testResults = testResults;
    stateToSave.showResults = false; // Always save test mode with showResults=false
  } else if (mode === "exam" && exam) {
    stateToSave.exam = exam;
  }

  saveAppState(stateToSave);
}
