import { useCallback } from "react";
import { useAppContext } from "./useAppContext";
import { Item } from "../types";

/**
 * Hook for handling question navigation across different modes
 */
export function useQuestionNavigation(
  getQuestions?: (category: string) => Item[]
) {
  const { selectedCategory, selectedQuestion, setSelectedQuestion } =
    useAppContext();

  /**
   * Navigate to next question
   */
  const handleNext = useCallback(() => {
    if (!selectedCategory || !getQuestions) return;

    const questions = getQuestions(selectedCategory);
    const currentIndex = Number(selectedQuestion);
    if (currentIndex < questions.length - 1) {
      setSelectedQuestion(String(currentIndex + 1));
    }
  }, [selectedCategory, selectedQuestion, getQuestions, setSelectedQuestion]);

  /**
   * Navigate to previous question
   */
  const handlePrevious = useCallback(() => {
    const currentIndex = Number(selectedQuestion);
    if (currentIndex > 0) {
      setSelectedQuestion(String(currentIndex - 1));
    }
  }, [selectedQuestion, setSelectedQuestion]);

  /**
   * Navigate to a specific question
   */
  const handleGoToQuestion = useCallback(
    (index: number) => {
      setSelectedQuestion(String(index));
    },
    [setSelectedQuestion]
  );

  return {
    handleNext,
    handlePrevious,
    handleGoToQuestion,
  };
}
