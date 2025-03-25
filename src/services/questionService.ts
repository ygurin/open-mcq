import Data from "../data.json";
import { Item } from "../types";

/**
 * Gets a list of all available categories
 */
export function getCategories(): string[] {
  try {
    const lookup: { [key: string]: number } = {};
    const items: Item[] = Array.isArray(Data) ? Data : [];
    const result: string[] = [];

    for (const item of items) {
      const name = item?.heading;
      if (name && !(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    return result;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

/**
 * Gets questions for a specific category
 */
export function getQuestions(category: string | null): Item[] {
  if (!category) {
    console.warn("No category provided to getQuestions");
    return [];
  }

  try {
    const items: Item[] = Array.isArray(Data) ? Data : [];

    // Try exact match first
    const exactMatches = items.filter((item) => item?.heading === category);

    // If no exact matches, try normalized comparison
    if (exactMatches.length === 0) {
      const normalizedCategory = category.trim().toLowerCase();
      return items.filter(
        (item) => item?.heading?.trim().toLowerCase() === normalizedCategory
      );
    }

    return exactMatches;
  } catch (error) {
    console.error(
      `Error fetching questions for category "${category}":`,
      error
    );
    return [];
  }
}

/**
 * Extracts image path from a URL or path string
 */
export function getImage(path: string): string {
  if (!path) return "";

  try {
    // Handle case where path is already a filename
    if (!path.includes("/")) {
      return path;
    }

    // Extract filename from path
    const parts = path.split("/");
    return parts[parts.length - 1] || "";
  } catch (error) {
    console.error("Error parsing image path:", error);
    return "";
  }
}

/**
 * Gets all questions from the data source
 */
export function getAllQuestions(): Item[] {
  try {
    return Array.isArray(Data) ? [...Data] : [];
  } catch (error) {
    console.error("Error loading all questions:", error);
    return [];
  }
}

/**
 * Gets a specific question by ID
 */
export function getQuestionById(id: string): Item | undefined {
  if (!id) return undefined;

  try {
    const items: Item[] = Array.isArray(Data) ? Data : [];
    return items.find((item) => item?.id === id);
  } catch (error) {
    console.error(`Error fetching question with ID "${id}":`, error);
    return undefined;
  }
}

/**
 * Gets the count of questions in a specific category
 */
export function getCategoryQuestionCount(category: string | null): number {
  if (!category) return 0;

  try {
    return getQuestions(category).length;
  } catch (error) {
    console.error(
      `Error counting questions for category "${category}":`,
      error
    );
    return 0;
  }
}

/**
 * Checks if data is loaded properly
 */
export function isDataLoaded(): boolean {
  return Array.isArray(Data) && Data.length > 0;
}
