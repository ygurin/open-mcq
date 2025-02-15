export interface ShuffledQuestion {
  options: string[];
  correctAnswerIndex: number;
}

/**
 * Fisher-Yates shuffle algorithm to randomize array elements
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffles the question options and returns the new order with the correct answer index
 */
export function shuffleQuestionOptions(
  options: string[],
  correctAnswer: string
): ShuffledQuestion {
  const shuffledOptions = shuffleArray(options);
  const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    options: shuffledOptions,
    correctAnswerIndex,
  };
}
