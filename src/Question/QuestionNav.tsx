import React from 'react';
import QuestionSelector from './QuestionSelector';
import { QuestionNavProps } from './types';

const QuestionNav: React.FC<QuestionNavProps> = ({
  currentQuestion,
  totalQuestions,
  onQuestionSelect,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  answeredQuestions,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="nav-button"
      >
        Previous
      </button>

      <QuestionSelector
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onQuestionSelect={onQuestionSelect}
        answeredQuestions={answeredQuestions}
      />

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="nav-button"
      >
        Next
      </button>
    </div>
  );
};

export default QuestionNav;