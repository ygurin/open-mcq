import { FC, useState, useEffect } from 'react';
import Modal from './../Modal/Modal';
import './Question.css';
import QuestionNav from './QuestionNav';

interface QuestionProps {
  mode: 'practice' | 'test';
  heading: string;
  ques: string;
  image?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  explanation?: string;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onAnswerSubmit: (selectedAnswer: string) => void;
  onAnswerSelect: (selectedAnswer: string) => void;
  isCorrect: boolean | null;
  isAnswered: boolean;
  selectedAnswer: string | undefined;
  onQuit: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  onQuestionSelect: (index: number) => void;
  correctAnswer: string;
  answeredQuestions: {
    isAnswered: boolean;
    isCorrect: boolean;
  }[];
}

const Question: FC<QuestionProps> = ({
  mode,
  heading,
  ques,
  image,
  q1,
  q2,
  q3,
  q4,
  explanation,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
  onAnswerSelect,
  onAnswerSubmit,
  isCorrect,
  isAnswered,
  selectedAnswer,
  onQuit,
  currentQuestionIndex,
  totalQuestions,
  onQuestionSelect,
  answeredQuestions,
  correctAnswer
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleQuit = () => {
    setIsModalOpen(true);
  };

  const handleFinish = () => {
    setIsFinishModalOpen(true);
  };

  const handleConfirmQuit = () => {
    setIsModalOpen(false);
    onQuit();
  };

  const handleConfirmFinish = () => {
    setIsFinishModalOpen(false);
    onQuit();
  };

  useEffect(() => {
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  const areAllQuestionsAnswered = answeredQuestions.every(q => q.isAnswered);

  const getButtonStyle = (answer: string) => {
    if (isAnswered || (mode === 'practice' && showAnswer)) {
      if (selectedAnswer === answer) {
        return `option-button ${isCorrect ? 'correct' : 'incorrect'}`;
      }
      if ((!isCorrect || showAnswer) && mode === 'practice' && answer === correctAnswer) {
        return 'option-button show-correct';
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
      <QuestionNav
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onQuestionSelect={onQuestionSelect}
        onNext={onNext}
        onPrevious={onPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        answeredQuestions={answeredQuestions}
      />
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
          onClick={() => onAnswerSelect(q1)}
          disabled={isAnswered}
        >
          {q1}
        </button>
        <button 
          className={getButtonStyle(q2)}
          onClick={() => onAnswerSelect(q2)}
          disabled={isAnswered}
        >
          {q2}
        </button>
        <button 
          className={getButtonStyle(q3)}
          onClick={() => onAnswerSelect(q3)}
          disabled={isAnswered}
        >
          {q3}
        </button>
        <button 
          className={getButtonStyle(q4)}
          onClick={() => onAnswerSelect(q4)}
          disabled={isAnswered}
        >
          {q4}
        </button>
      </div>
      <div className="answer-section">
        {mode === 'practice' && !isAnswered && !showAnswer && (
          <button 
            className="get-answer-button"
            onClick={() => setShowAnswer(true)}
          >
            Get Answer
          </button>
        )}
        <button 
          className="answer-button"
          onClick={() => selectedAnswer && onAnswerSubmit(selectedAnswer)}
          disabled={!selectedAnswer || isAnswered}
        >
          {mode === 'practice' ? 'Check Answer' : 'Submit Answer'}
        </button>
        {(isAnswered || showAnswer) && (
          <div className="feedback-section">
            {isAnswered && (
              <p className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
            )}
            {showAnswer && !isAnswered && (
              <p className="answer-feedback">
                The correct answer is: <span className="correct">{correctAnswer}</span>
              </p>
            )}
            {mode === 'practice' && explanation && (showAnswer || !isCorrect) && (
              <div className="explanation">
                <h4>Explanation:</h4>
                <p>{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button 
          onClick={handleQuit}
          className="nav-button quit-button"
        >
          {mode === 'test' ? 'Finish Test' : 'Quit'}
        </button>
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
        {mode === 'practice' && (
          <button 
            onClick={handleFinish}
            disabled={!areAllQuestionsAnswered}
            className="nav-button finish-button"
          >
            Finish
          </button>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmQuit}
        message={mode === 'test' ? 'Are you sure you want to finish the test?' : 'Are you sure you want to quit to the menu?'}
      />
       <Modal 
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleConfirmFinish}
        message="Are you sure you want to finish the practice session?"
      />
    </div>
  );
};

export default Question;