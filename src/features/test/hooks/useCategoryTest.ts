import { useCallback } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { useQuestionNavigation } from "../../../hooks/useQuestionNavigation";
import { Item } from "../../../types";

/**
 * Hook for managing category test functionality
 */
export function useCategoryTest(getQuestions: (category: string) => Item[]) {
  const {
    selectedCategory,
    answeredQuestions,
    selectedQuestion,
    testResults,
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
   * Handles answer submission in category test mode
   */
  const handleAnswerSubmit = useCallback(
    (selectedAnswer: string) => {
      if (!selectedCategory) return;

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

      // Update test results for this category
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
    ]
  );

  /**
   * Finish the test and show results
   */
  const handleFinishTest = useCallback(() => {
    setShowResults(true);
  }, [setShowResults]);

  /**
   * Review wrong answers
   */
  const reviewWrongAnswers = useCallback(
    (category: string, wrongAnswers: string[]) => {
      const questions = getQuestions(category);
      const firstWrongQuestionIndex = questions.findIndex((q) =>
        wrongAnswers.includes(q.id)
      );

      setShowResults(false);
      setSelectedCategory(category);
      setSelectedQuestion(String(Math.max(0, firstWrongQuestionIndex)));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getQuestions, setShowResults, setSelectedCategory]
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
