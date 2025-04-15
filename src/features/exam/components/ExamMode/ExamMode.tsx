import React, { useEffect } from 'react';
import { useAppContext } from '../../../../hooks/useAppContext';
import { useExamMode } from '../../hooks/useExamMode';
import { usePreventRefresh } from '../../../../hooks/usePreventRefresh';
import Question from '../../../questions/components/Question/Question';
import ExamTimer from '../ExamTimer/ExamTimer';
import ExamResults from '../ExamResults/ExamResults';
import { EXAM_TIME_MINUTES } from '../../../../constants/constants';
import { QuestionMode } from '../../../../types';
import { createExamQuestionKey } from '../../../../services/utilityService';

interface ExamModeProps {
  getImage: (path: string) => string;
}

const ExamMode: React.FC<ExamModeProps> = ({ getImage }) => {
  const { exam, answeredQuestions, showResults } = useAppContext();
  const {
    recalculateRemainingTime,
    handleExamTimeUp,
    handleExamAnswerSelection,
    handleExamAnswerSubmit,
    handleNext,
    handlePrevious,
    handleExamQuestionChange,
    handleQuit,
    calculateExamResults,
    reviewExamQuestions,
    handleBackToExamResults,
    handleBackToMenu,
    handleFlagQuestion
  } = useExamMode();
  
  // Only prevent refresh when there's an active exam and we're not in results view
  const shouldPreventRefresh = !!exam && !showResults;
  usePreventRefresh(shouldPreventRefresh, 'You have an active exam in progress. Are you sure you want to leave this page?');
  
  // Recalculate remaining time when restoring from localStorage
  useEffect(() => {
    if (exam?.startTime) {
      // Force an immediate update of the timeRemaining
      recalculateRemainingTime();
    }
  }, [recalculateRemainingTime, exam?.startTime]);

  if (!exam) return null;

  const { questions, currentQuestionIndex, isComplete, isReview, timeRemaining } = exam;
  const currentQuestion = questions[currentQuestionIndex];
  const questionKey = createExamQuestionKey(currentQuestionIndex);
  const answerState = answeredQuestions[questionKey];

  // Render exam results screen
  if (isComplete && !isReview && showResults) {
    const results = calculateExamResults();
    if (!results) return null;

    return (
      <ExamResults
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        timeTaken={results.timeTaken}
        onBackToMenu={handleBackToMenu}
        onReviewQuestions={reviewExamQuestions}
      />
    );
  }

  // Determine the current mode (exam or review)
  const currentMode: QuestionMode = isReview ? "review" : "exam";

  // Render question screen
  return (
    <div className="exam-mode-container">
      {!isReview && (
        <ExamTimer
          onTimeUp={handleExamTimeUp}
          totalMinutes={EXAM_TIME_MINUTES}
          initialTimeLeft={timeRemaining}
        />
      )}
      <Question
        mode={currentMode}
        heading={currentQuestion.heading}
        ques={currentQuestion.question}
        image={currentQuestion.image ? getImage(currentQuestion.image) : undefined}
        q1={currentQuestion.questions[0]}
        q2={currentQuestion.questions[1]}
        q3={currentQuestion.questions[2]}
        q4={currentQuestion.questions[3]}
        explanation={currentQuestion.explanation}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentQuestionIndex < questions.length - 1}
        hasPrevious={currentQuestionIndex > 0}
        onAnswerSelect={handleExamAnswerSelection}
        onAnswerSubmit={handleExamAnswerSubmit}
        isCorrect={answerState?.isCorrect ?? null}
        isAnswered={answerState?.isAnswered ?? false}
        selectedAnswer={answerState?.selectedAnswer}
        onQuit={isReview ? handleBackToExamResults : handleQuit}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onQuestionSelect={handleExamQuestionChange}
        answeredQuestions={questions.map((_, index) => {
          const state = answeredQuestions[createExamQuestionKey(index)];
          return {
            isAnswered: state?.isAnswered ?? false,
            isCorrect: state?.isCorrect ?? false
          };
        })}
        correctAnswer={currentQuestion.answer}
        flaggedQuestions={exam.flaggedQuestions}
        onFlagQuestion={handleFlagQuestion}
      />
    </div>
  );
};

export default ExamMode;