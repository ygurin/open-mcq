import React from 'react';
import QuestionSelector from './QuestionSelector';
import { QuestionNavProps } from '../../types';

const QuestionNav: React.FC<QuestionNavProps> = ({
  currentQuestion,
  totalQuestions,
  onQuestionSelect,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  answeredQuestions,
  mode,
  flaggedQuestions = [], // Added default value
}) => {
  return (
    <div className="question-nav">
      <div className="selector-row">
        <QuestionSelector
          mode={mode} 
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          onQuestionSelect={onQuestionSelect}
          answeredQuestions={answeredQuestions}
          flaggedQuestions={flaggedQuestions}
        />
      </div>
      <div className="nav-buttons-row">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="nav-button"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="nav-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionNav;