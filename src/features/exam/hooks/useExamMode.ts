import { useCallback, useRef } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import { shuffleArray } from "../../../utils/shuffle";
import { EXAM_TIME_MINUTES } from "../../../constants/constants";
import { Item } from "../../../types";
import { createExamQuestionKey } from "../../../services/utilityService";

/**
 * Hook for managing exam mode functionality
 */
export function useExamMode() {
  const {
    exam,
    answeredQuestions,
    setMode,
    setExam,
    updateExam,
    setShowResults,
    updateAnsweredQuestion,
    resetState,
  } = useAppContext();

  // Store a reference to the final exam time to ensure it doesn't change
  const finalExamTimeRef = useRef<number | undefined>(undefined);

  /**
   * Initializes exam mode with shuffled questions
   */
  const initializeExamMode = useCallback(
    (questions: Item[]) => {
      const shuffledQuestions = shuffleArray(questions).slice(0, 40);
      const startTime = Date.now();
      finalExamTimeRef.current = undefined;

      setMode("exam");
      setExam({
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        timeRemaining: EXAM_TIME_MINUTES * 60,
        isComplete: false,
        startTime,
        flaggedQuestions: [],
        completedTime: undefined,
      });
    },
    [setMode, setExam]
  );

  /**
   * Recalculates remaining time based on saved startTime
   * Called when restoring an exam session from localStorage
   */
  const recalculateRemainingTime = useCallback(() => {
    if (!exam?.startTime) return;

    // exam completed, don't recalculate time
    if (exam.isComplete) return;

    const totalAllowedTimeMs = EXAM_TIME_MINUTES * 60 * 1000;
    const elapsedTimeMs = Date.now() - exam.startTime;

    // Calculate remaining time in milliseconds, ensuring it doesn't go negative
    const remainingTimeMs = Math.max(0, totalAllowedTimeMs - elapsedTimeMs);

    // Convert to seconds and update the exam state
    const remainingTimeSec = Math.ceil(remainingTimeMs / 1000);

    // time is up, complete the exam
    if (remainingTimeSec <= 0) {
      const completedTime = Date.now();
      finalExamTimeRef.current = completedTime - exam.startTime;

      updateExam({
        isComplete: true,
        timeRemaining: 0,
        completedTime,
      });
      setShowResults(true);
    } else {
      // update with the calculated remaining time
      updateExam({ timeRemaining: remainingTimeSec });
    }
  }, [exam, updateExam, setShowResults]);

  /**
   * Handles flagging/unflagging a question
   */
  const handleFlagQuestion = useCallback(
    (index: number) => {
      if (!exam) return;

      const flaggedQuestions = [...exam.flaggedQuestions];
      const flagIndex = flaggedQuestions.indexOf(index);

      if (flagIndex === -1) {
        flaggedQuestions.push(index);
      } else {
        flaggedQuestions.splice(flagIndex, 1);
      }

      updateExam({ flaggedQuestions });
    },
    [exam, updateExam]
  );

  /**
   * Handles time up event in exam
   */
  const handleExamTimeUp = useCallback(() => {
    if (!exam || exam.isComplete) return;

    const completedTime = Date.now();
    finalExamTimeRef.current = completedTime - (exam.startTime || 0);

    updateExam({
      isComplete: true,
      completedTime,
    });
    setShowResults(true);
  }, [exam, updateExam, setShowResults]);

  /**
   * Calculate exam results
   */
  const calculateExamResults = useCallback(() => {
    if (!exam) return null;

    const correctAnswers = Object.values(answeredQuestions).reduce(
      (count, answer) => count + (answer.isCorrect ? 1 : 0),
      0
    );

    // Calculate time taken using a consistent approach that doesn't change after exam completion
    let timeTaken: number;

    // Use the stored final time if available
    if (finalExamTimeRef.current !== undefined) {
      timeTaken = Math.floor(finalExamTimeRef.current / 1000);
    }
    // Or use the completedTime from exam state if available
    else if (exam.completedTime && exam.startTime) {
      const examDuration = exam.completedTime - exam.startTime;
      finalExamTimeRef.current = examDuration; // Store for future use
      timeTaken = Math.floor(examDuration / 1000);
    }
    // Fallback for backward compatibility
    else if (exam.isComplete && exam.startTime) {
      const examDuration = Date.now() - exam.startTime;
      finalExamTimeRef.current = examDuration; // Store for future use

      // Also update the exam state with the completedTime for persistence
      if (!exam.completedTime) {
        updateExam({ completedTime: Date.now() });
      }

      timeTaken = Math.floor(examDuration / 1000);
    }
    // Default fallback
    else {
      timeTaken = EXAM_TIME_MINUTES * 60;
    }

    return {
      correctAnswers,
      totalQuestions: 40,
      timeTaken,
    };
  }, [exam, answeredQuestions, updateExam]);

  /**
   * Changes current question in exam
   */
  const handleExamQuestionChange = useCallback(
    (index: number) => {
      if (exam) {
        updateExam({ currentQuestionIndex: index });
      }
    },
    [exam, updateExam]
  );

  /**
   * Handles answer selection in exam mode
   */
  const handleExamAnswerSelection = useCallback(
    (selectedAnswer: string) => {
      if (!exam) return;

      const questionKey = createExamQuestionKey(exam.currentQuestionIndex);
      const existingState = answeredQuestions[questionKey];

      if (!existingState?.isAnswered) {
        updateAnsweredQuestion(questionKey, {
          ...existingState,
          selectedAnswer,
        });
      }
    },
    [exam, answeredQuestions, updateAnsweredQuestion]
  );

  /**
   * Handles answer submission in exam mode
   */
  const handleExamAnswerSubmit = useCallback(
    (selectedAnswer: string) => {
      if (!exam) return;

      const currentQuestion = exam.questions[exam.currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.answer;

      const questionKey = createExamQuestionKey(exam.currentQuestionIndex);

      updateAnsweredQuestion(questionKey, {
        isAnswered: true,
        isCorrect,
        selectedAnswer,
      });
    },
    [exam, updateAnsweredQuestion]
  );

  /**
   * Navigate to next question in exam
   */
  const handleNext = useCallback(() => {
    if (!exam) return;

    const nextIndex = exam.currentQuestionIndex + 1;
    if (nextIndex < exam.questions.length) {
      handleExamQuestionChange(nextIndex);
    }
  }, [exam, handleExamQuestionChange]);

  /**
   * Navigate to previous question in exam
   */
  const handlePrevious = useCallback(() => {
    if (!exam) return;

    const prevIndex = exam.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      handleExamQuestionChange(prevIndex);
    }
  }, [exam, handleExamQuestionChange]);

  /**
   * Quit the exam and go to results
   */
  const handleQuit = useCallback(() => {
    if (!exam || exam.isComplete) return;

    const completedTime = Date.now();
    finalExamTimeRef.current = completedTime - (exam.startTime || 0);

    updateExam({
      isComplete: true,
      completedTime,
    });
    setShowResults(true);
  }, [exam, updateExam, setShowResults]);

  /**
   * Enable review mode for exam questions
   */
  const reviewExamQuestions = useCallback(() => {
    if (exam) {
      setShowResults(false);
      updateExam({ isReview: true });
    }
  }, [exam, setShowResults, updateExam]);

  /**
   * Go back to exam results from review mode
   */
  const handleBackToExamResults = useCallback(() => {
    setShowResults(true);
    updateExam({ isReview: false });
  }, [setShowResults, updateExam]);

  /**
   * Exit exam mode and reset state
   */
  const handleBackToMenu = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    initializeExamMode,
    recalculateRemainingTime,
    handleExamTimeUp,
    handleFlagQuestion,
    calculateExamResults,
    handleExamQuestionChange,
    handleExamAnswerSelection,
    handleExamAnswerSubmit,
    handleNext,
    handlePrevious,
    handleQuit,
    reviewExamQuestions,
    handleBackToExamResults,
    handleBackToMenu,
  };
}
