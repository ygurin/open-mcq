import { useCallback } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { useQuestionNavigation } from "../../../hooks/useQuestionNavigation";
import { Item } from "../../../types";

/**
 * Hook for managing practice mode functionality
 */
export function usePracticeMode(getQuestions: (category: string) => Item[]) {
  const {
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
    setSelectedCategory,
    updateAnsweredQuestion,
  } = useAppContext();

  // Use the shared navigation hook
  const { handleNext, handlePrevious } = useQuestionNavigation(getQuestions);

  /**
   * Handles answer selection in practice mode
   */
  const handleAnswerSelection = useCallback(
    (selectedAnswer: string) => {
      if (!selectedCategory) return;

      const questionKey = `${selectedCategory}-${selectedQuestion}`;
      const existingState = answeredQuestions[questionKey];

      if (!existingState?.isAnswered) {
        updateAnsweredQuestion(questionKey, {
          ...existingState,
          selectedAnswer,
        });
      }
    },
    [
      selectedCategory,
      selectedQuestion,
      answeredQuestions,
      updateAnsweredQuestion,
    ]
  );

  /**
   * Handles answer submission in practice mode
   */
  const handleAnswerSubmit = useCallback(
    (selectedAnswer: string) => {
      if (!selectedCategory) return;

      const questions = getQuestions(selectedCategory);
      const currentQuestion = questions[Number(selectedQuestion)];
      const isCorrect = selectedAnswer === currentQuestion.answer;

      const questionKey = `${selectedCategory}-${selectedQuestion}`;

      updateAnsweredQuestion(questionKey, {
        isAnswered: true,
        isCorrect,
        selectedAnswer,
      });
    },
    [selectedCategory, selectedQuestion, getQuestions, updateAnsweredQuestion]
  );

  /**
   * Quit practice mode and go back to category selection
   */
  const handleQuit = useCallback(() => {
    setSelectedCategory(null);
  }, [setSelectedCategory]);

  /**
   * Get the answer state for a specific question
   */
  const isQuestionAnswered = useCallback(
    (category: string, questionIndex: string) => {
      const questionKey = `${category}-${questionIndex}`;
      return answeredQuestions[questionKey];
    },
    [answeredQuestions]
  );

  return {
    handleAnswerSelection,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleQuit,
    isQuestionAnswered,
  };
}
