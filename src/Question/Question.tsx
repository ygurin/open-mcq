import { FC, useEffect } from 'react';
import './Question.css';

interface QuestionProps {
  heading: string;
  ques: string;
  image?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onAnswerSubmit: (selectedAnswer: string) => void;
  onAnswerSelect: (selectedAnswer: string) => void;
  isCorrect: boolean | null;
  isAnswered: boolean;
  selectedAnswer: string | undefined;
}

const Question: FC<QuestionProps> = ({ 
  heading, 
  ques, 
  image, 
  q1, 
  q2, 
  q3, 
  q4,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  onAnswerSubmit,
  onAnswerSelect,
  isCorrect,
  isAnswered,
  selectedAnswer
}) => {
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      onAnswerSelect(answer);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer && !isAnswered) {
      onAnswerSubmit(selectedAnswer);
    }
  };

  const getButtonStyle = (answer: string) => {
    if (isAnswered) {
      if (selectedAnswer === answer) {
        return `option-button ${isCorrect ? 'correct' : 'incorrect'}`;
      }
      return 'option-button';
    }
    
    if (selectedAnswer === answer) {
      return 'option-button selected';
    }
    
    return 'option-button';
  };

  return (
    <div className="Question">
      <h2 className="question-header">{heading}</h2>
      <div className="question-text-container">
        <p className="question-text">{ques}</p>
      </div>
      {image && (
        <div className="image-container">
          <img
            className="question-image"
            src={`/images/${image}`}
            alt="Question illustration"
          />
        </div>
      )}
      <div className="question-options">
        <button 
          className={getButtonStyle(q1)}
          onClick={() => handleAnswerSelect(q1)}
          disabled={isAnswered}
        >
          {q1}
        </button>
        <button 
          className={getButtonStyle(q2)}
          onClick={() => handleAnswerSelect(q2)}
          disabled={isAnswered}
        >
          {q2}
        </button>
        <button 
          className={getButtonStyle(q3)}
          onClick={() => handleAnswerSelect(q3)}
          disabled={isAnswered}
        >
          {q3}
        </button>
        <button 
          className={getButtonStyle(q4)}
          onClick={() => handleAnswerSelect(q4)}
          disabled={isAnswered}
        >
          {q4}
        </button>
      </div>
      <div className="answer-section">
        <button 
          className="answer-button"
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer || isAnswered}
        >
          Answer
        </button>
        {isAnswered && (
          <p className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </p>
        )}
      </div>
      <div className="navigation-buttons">
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

export default Question;