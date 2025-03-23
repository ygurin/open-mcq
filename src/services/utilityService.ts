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
  return answeredQuestions.every((q) => q.isAnswered);
}

/**
 * Gets the question key for lookup in the answeredQuestions state
 */
export function getQuestionKey(
  mode: "exam" | "practice" | "category-test",
  examIndex?: number,
  category?: string,
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
