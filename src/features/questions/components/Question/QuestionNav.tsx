import React from 'react';
import QuestionSelector from './QuestionSelector';
import { QuestionMode } from '../../../../types';

interface QuestionNavProps {
  mode: QuestionMode;
  currentQuestion: number;
  totalQuestions: number;
  onQuestionSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  answeredQuestions: {
    isAnswered: boolean;
    isCorrect: boolean;
  }[];
  flaggedQuestions?: number[];
}

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
  flaggedQuestions = []
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