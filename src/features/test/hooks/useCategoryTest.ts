import { useCallback } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { useQuestionNavigation } from "../../../hooks/useQuestionNavigation";
import { Item } from "../../../types";
import { markSessionCompleted } from "../../../services/localStorageService";

/**
 * Hook for managing category test functionality
 */
export function useCategoryTest(getQuestions: (category: string) => Item[]) {
  const {
    selectedCategory,
    answeredQuestions,
    selectedQuestion,
    testResults,
    mode,
    setMode,
    setShowResults,
    updateAnsweredQuestion,
    updateTestResult,
    resetState,
    setSelectedCategory,
    setSelectedQuestion,
  } = useAppContext();

  // Use the shared navigation hook
  const { handleNext, handlePrevious } = useQuestionNavigation(getQuestions);

  /**
   * Handles answer selection in category test mode
   */
  const handleAnswerSelection = useCallback(
    (selectedAnswer: string) => {
      if (!selectedCategory) return;

      // In review mode, don't allow answer selection
      if (mode === "review") return;

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
      mode,
    ]
  );

  /**
   * Handles answer submission in category test mode
   */
  const handleAnswerSubmit = useCallback(
    (selectedAnswer: string) => {
      if (!selectedCategory) return;

      // In review mode, don't allow answer submission
      if (mode === "review") return;

      const questions = getQuestions(selectedCategory);
      const currentQuestion = questions[Number(selectedQuestion)];
      const isCorrect = selectedAnswer === currentQuestion.answer;

      const questionKey = `${selectedCategory}-${selectedQuestion}`;

      // Update the answer state
      updateAnsweredQuestion(questionKey, {
        isAnswered: true,
        isCorrect,
        selectedAnswer,
      });

      // We use the random subset which is what getQuestions returns
      const categoryQuestions = getQuestions(selectedCategory);
      const categoryResults = testResults[selectedCategory] || {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: [],
        availableQuestions: categoryQuestions.length,
      };

      updateTestResult(selectedCategory, {
        totalQuestions: categoryResults.totalQuestions + 1,
        correctAnswers: categoryResults.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: isCorrect
          ? categoryResults.wrongAnswers
          : [...categoryResults.wrongAnswers, currentQuestion.id],
        availableQuestions: categoryQuestions.length,
      });
    },
    [
      selectedCategory,
      selectedQuestion,
      getQuestions,
      updateAnsweredQuestion,
      testResults,
      updateTestResult,
      mode,
    ]
  );

  /**
   * Finish the test and show results
   */
  const handleFinishTest = useCallback(() => {
    // If in review mode, go back to the results screen
    if (mode === "review") {
      setShowResults(true);
    } else {
      // If in regular test mode, show results and mark as completed
      if (selectedCategory) {
        // Mark this category test as completed in localStorage
        markSessionCompleted("test", selectedCategory);
      }
      setShowResults(true);
    }
  }, [setShowResults, mode, selectedCategory]);

  /**
   * Review wrong answers
   */
  const reviewWrongAnswers = useCallback(
    (category: string, wrongAnswers: string[]) => {
      if (wrongAnswers.length === 0) return;

      // Use the same question set that was used for the test (random subset)
      const questions = getQuestions(category);
      const firstWrongQuestionIndex = questions.findIndex((q) =>
        wrongAnswers.includes(q.id)
      );

      if (firstWrongQuestionIndex === -1) return;

      setShowResults(false);
      setMode("review");
      setSelectedCategory(category);
      setSelectedQuestion(String(Math.max(0, firstWrongQuestionIndex)));
    },
    [
      getQuestions,
      setShowResults,
      setMode,
      setSelectedCategory,
      setSelectedQuestion,
    ]
  );

  /**
   * Restart the test
   */
  const handleRestartTest = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    handleAnswerSelection,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleFinishTest,
    reviewWrongAnswers,
    handleRestartTest,
  };
}
