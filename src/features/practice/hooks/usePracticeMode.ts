import { useCallback } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { Item } from "../../../types";

/**
 * Hook for managing practice mode functionality
 */
export function usePracticeMode(getQuestions: (category: string) => Item[]) {
  const {
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
    setSelectedQuestion,
    setSelectedCategory,
    updateAnsweredQuestion,
  } = useAppContext();

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
   * Navigate to next question
   */
  const handleNext = useCallback(() => {
    if (!selectedCategory) return;

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
   * Quit practice mode and go back to category selection
   */
  const handleQuit = useCallback(() => {
    setSelectedCategory(null);
    setSelectedQuestion("0");
  }, [setSelectedCategory, setSelectedQuestion]);

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
