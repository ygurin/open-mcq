import { Item } from "../types";
import { shuffleArray } from "./shuffle";

/**
 * Gets a random subset of questions from a category
 * @param questions Array of questions to select from
 * @param count Maximum number of questions to select (defaults to 20)
 * @returns Random subset of questions
 */
export function getRandomQuestions(
  questions: Item[],
  count: number = 20
): Item[] {
  // If there are fewer questions than requested count, return all questions shuffled
  if (questions.length <= count) {
    return shuffleArray([...questions]);
  }

  return shuffleArray([...questions]).slice(0, count);
}

/**
 * Type to represent a category's test questions
 */
export interface CategoryTestQuestions {
  randomQuestions: Item[];
  originalQuestions: Item[];
}
