import Data from "../data.json";
import { Item } from "../types";

/**
 * Gets a list of all available categories
 */
export function getCategories(): string[] {
  try {
    const lookup: { [key: string]: number } = {};
    const items: Item[] = Data || [];
    const result: string[] = [];

    for (const item of items) {
      const name = item.heading;
      if (!(name in lookup)) {
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
export function getQuestions(category: string): Item[] {
  if (!category) {
    console.warn("No category provided to getQuestions");
    return [];
  }

  try {
    const items: Item[] = Data || [];

    // Try exact match first
    const exactMatches = items.filter((item) => item.heading === category);

    // If no exact matches, try normalized comparison
    if (exactMatches.length === 0) {
      const normalizedCategory = category.trim().toLowerCase();
      return items.filter(
        (item) => item.heading.trim().toLowerCase() === normalizedCategory
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
    return path.split("/").pop() || "";
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
    return [...(Data || [])];
  } catch (error) {
    console.error("Error loading all questions:", error);
    return [];
  }
}
