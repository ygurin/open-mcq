import { AppMode, AnswerState } from "../types";

/**
 * Formats time in minutes:seconds format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Calculates percentage from a fraction
 */
export function calculatePercentage(
  numerator: number,
  denominator: number
): string {
  if (denominator === 0) return "0.0";
  return ((numerator / denominator) * 100).toFixed(1);
}

/**
 * Checks if all questions in an array have been answered
 */
export function areAllQuestionsAnswered(
  answeredQuestions: { isAnswered: boolean }[]
): boolean {
  return answeredQuestions.every((q) => q?.isAnswered === true);
}

/**
 * Gets the question key for lookup in the answeredQuestions state
 */
export function getQuestionKey(
  mode: Exclude<AppMode, null | "review">,
  examIndex?: number,
  category?: string | null,
  questionIndex?: string
): string {
  if (mode === "exam" && examIndex !== undefined) {
    return `exam-${examIndex}`;
  } else if (
    (mode === "practice" || mode === "category-test") &&
    category &&
    questionIndex !== undefined
  ) {
    return `${category}-${questionIndex}`;
  }

  throw new Error("Invalid parameters for getQuestionKey");
}

/**
 * Creates a question key for state management
 */
export function createQuestionKey(
  category: string,
  index: number | string
): string {
  return `${category}-${index}`;
}

/**
 * Creates an exam question key
 */
export function createExamQuestionKey(index: number): string {
  return `exam-${index}`;
}

/**
 * Gets the default answer state
 */
export function getDefaultAnswerState(): AnswerState {
  return {
    isAnswered: false,
    isCorrect: false,
    selectedAnswer: undefined,
  };
}

/**
 * Ensures valid question index within range
 */
export function getValidQuestionIndex(
  selectedIndex: string | number,
  maxIndex: number
): number {
  const index =
    typeof selectedIndex === "string" ? Number(selectedIndex) : selectedIndex;
  return Math.max(0, Math.min(index, Math.max(0, maxIndex - 1)));
}

/**
 * Safely access object property with null/undefined checks
 */
export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  return obj?.[key];
}
