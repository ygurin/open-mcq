import React from 'react';

interface QuestionOptionsProps {
  options: string[];
  selectedAnswer?: string;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer: string;
  mode: 'practice' | 'category-test' | 'exam' | 'review';
  onOptionSelect: (option: string) => void;
  flaggedQuestions?: number[];
  currentQuestionIndex: number;
  hintedAnswer: string | null;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  selectedAnswer,
  isAnswered,
  isCorrect,
  correctAnswer,
  mode,
  onOptionSelect,
  flaggedQuestions = [],
  currentQuestionIndex,
  hintedAnswer
}) => {
  
  const getButtonStyle = (answer: string) => {
    let className = 'option-button';
    
    if (hintedAnswer === answer) {
      className += ' hint-flash';
    }
    
    // Special handling for review mode
    if (mode === 'review') {
      // Always highlight the correct answer in review mode
      if (answer === correctAnswer) {
        className += ' correct-answer';
      }
      
      // If the user answered and selected this option (but it was wrong)
      if (selectedAnswer === answer && answer !== correctAnswer && isAnswered) {
        className += ' wrong-answer';
      }
    }
    // Regular styling for other modes
    else if (flaggedQuestions?.includes(currentQuestionIndex) && selectedAnswer === answer) {
      className += ' flagged';
    } else if (isAnswered) {
      if (mode === 'exam') {
        if (selectedAnswer === answer) {
          className += ' exam-answered';
        }
      } else {
        // For practice and category-test modes
        if (answer === correctAnswer && !isCorrect) {
          // Highlight the correct answer when user got it wrong
          className += ' show-correct';
        } else if (selectedAnswer === answer && isCorrect) {
          className += ' correct';
        } else if (selectedAnswer === answer && !isCorrect) {
          className += ' incorrect';
        }
      }
    } else if (selectedAnswer === answer) {
      className += ' selected';
    }
    
    return className;
  };

  const handleOptionSelect = (option: string) => {
    // In review mode, prevent selecting answers for unanswered questions
    if (mode === 'review' && !isAnswered) {
      return;
    }
    
    // Regular behavior for answered questions or non-review modes
    if (!isAnswered || mode === 'practice') {
      onOptionSelect(option);
    }
  };

  return (
    <div className="question-options">
      {options.map((option, index) => (
        <button 
          key={index}
          className={getButtonStyle(option)}
          onClick={() => handleOptionSelect(option)}
          // Only disable if in review mode AND question wasn't previously answered
          disabled={mode === 'review' && !isAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default QuestionOptions;