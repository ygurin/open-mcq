import { FC, useState, useEffect } from 'react';
import Modal from './../Modal/Modal';
import './Question.css';
import QuestionNav from './QuestionNav';
import { ShuffledQuestion, shuffleQuestionOptions } from '../utils/shuffle';

interface QuestionProps {
  mode: 'practice' | 'category-test' | 'exam';
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
  onFlagQuestion?: (index: number) => void;
  flaggedQuestions?: number[];
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
  correctAnswer,
  onFlagQuestion,
  flaggedQuestions
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledQuestion>({ 
    options: [q1, q2, q3, q4],
    correctAnswerIndex: 0
});
  const [hintedAnswer, setHintedAnswer] = useState<string | null>(null);
  const [wasHintUsed, setWasHintUsed] = useState(false);

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
    const options = [q1, q2, q3, q4];
    const shuffled = shuffleQuestionOptions(options, correctAnswer);
    setShuffledOptions(shuffled);
    setShowAnswer(false);
}, [currentQuestionIndex, q1, q2, q3, q4, correctAnswer]);

  const areAllQuestionsAnswered = answeredQuestions.every(q => q.isAnswered);

  const getButtonStyle = (answer: string) => {
    let className = 'option-button';
    
    if (hintedAnswer === answer) {
      className += ' hint-flash';
    }
    
    // If question is flagged and this is the selected answer, show yellow
    if (flaggedQuestions?.includes(currentQuestionIndex) && selectedAnswer === answer) {
      className += ' flagged';
    } else if (isAnswered) {
      if (mode === 'exam') {
        if (selectedAnswer === answer) {
          className += ' exam-answered';
        }
      } else {
        if (selectedAnswer === answer && isCorrect) {
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

  return (
    <div className="Question">
      <h2 className="question-header">{heading}</h2>
      <QuestionNav
        mode={mode}
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onQuestionSelect={onQuestionSelect}
        onNext={onNext}
        onPrevious={onPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        answeredQuestions={answeredQuestions}
        flaggedQuestions={flaggedQuestions}
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
                  onError={(e) => {
                      console.error('Image failed to load:', image);
                      e.currentTarget.style.display = 'none';
                  }}
              />
          </div>
      )}
      <div className="question-options">
          {shuffledOptions.options.map((option, index) => (
              <button 
                  key={index}
                  className={getButtonStyle(option)}
                  onClick={() => onAnswerSelect(option)}
                  disabled={isAnswered}
              >
                  {option}
              </button>
          ))}
      </div>
      <div className="answer-section">
        {isAnswered && mode !== 'exam' && (
          <div className="feedback-section">
            <p className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            {(!isCorrect || wasHintUsed) && explanation && (
              <div className="explanation">
                <h4>Explanation:</h4>
                <p>{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <div className="primary-buttons">
          <button 
            className="answer-button"
            onClick={() => selectedAnswer && onAnswerSubmit(selectedAnswer)}
            disabled={!selectedAnswer || isAnswered || (mode === 'exam' && flaggedQuestions?.includes(currentQuestionIndex))}
          >
            {mode === 'practice' ? 'Check Answer' : 'Submit Answer'}
          </button>

          {mode === 'exam' && (
            <button 
              onClick={() => onFlagQuestion?.(currentQuestionIndex)}
              className={`answer-button flag-button ${flaggedQuestions?.includes(currentQuestionIndex) ? 'flagged' : ''}`}
              disabled={isAnswered}
            >
              {flaggedQuestions?.includes(currentQuestionIndex) ? 'Unflag' : 'Flag'}
            </button>
          )}
        </div>

        <div className="button-group">
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

        {mode === 'practice' && (
          <div className="button-group">
            {!isAnswered && !showAnswer && (
              <button 
                onClick={() => {
                  setHintedAnswer(correctAnswer);
                  setWasHintUsed(true);
                  let count = 0;
                  const flash = () => {
                    setHintedAnswer(correctAnswer);
                    setTimeout(() => {
                      setHintedAnswer(null);
                      count++;
                      if (count < 3) {
                        setTimeout(flash, 200);
                      }
                    }, 200);
                  };
                  flash();
                }}
                className="nav-button"
              >
                Get Answer
              </button>
            )}
            <button 
              onClick={handleFinish}
              disabled={!areAllQuestionsAnswered}
              className="nav-button"
            >
              Finish
            </button>
          </div>
        )}

        {mode !== 'practice' && (
          <button 
            onClick={handleFinish}
            disabled={!areAllQuestionsAnswered}
            className="nav-button"
          >
            Finish Test
          </button>
        )}

        <button 
          onClick={handleQuit}
          className="nav-button quit-button"
        >
          Quit
        </button>
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmQuit}
        title={
          mode === 'practice' 
            ? 'Quit to Menu' 
            : mode === 'category-test'
              ? 'Exit to Results'
              : 'Finish Exam'
        }
        message={
          mode === 'practice' 
            ? 'Are you sure you want to quit to the menu?' 
            : mode === 'exam'
              ? 'Are you sure you want to finish the exam?'
              : 'Are you sure you want to exit to results?'
        }
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