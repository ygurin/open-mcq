import { FC, useState, useEffect, useCallback } from 'react';
import Modal from './../Modal/Modal';
import './Question.css';
import QuestionNav from './QuestionNav';
import { ShuffledQuestion, shuffleQuestionOptions } from '../utils/shuffle';

interface QuestionProps {
  mode: 'practice' | 'category-test' | 'exam' | 'review';
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
  const [modalType, setModalType] = useState<'quit' | 'finish'>('quit'); 
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledQuestion>({ 
    options: [q1, q2, q3, q4],
    correctAnswerIndex: 0
  });
  const [hintedAnswer, setHintedAnswer] = useState<string | null>(null);
  const [wasHintUsed, setWasHintUsed] = useState(false);

  const handleQuit = useCallback(() => {
    setModalType('quit');
    setIsModalOpen(true);
  }, []);

  const handleFinish = useCallback(() => {
    setModalType('finish');
    setIsModalOpen(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    setIsModalOpen(false);
    onQuit();
  }, [onQuit]);

  const handleConfirmFinish = useCallback(() => {
    setIsFinishModalOpen(false);
    onQuit();
  }, [onQuit]);

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

  // Add keyboard navigation effect
  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          // Toggle modal state with Escape key
          if (isModalOpen) {
            setIsModalOpen(false);
          } else if (isFinishModalOpen) {
            setIsFinishModalOpen(false);
          } else {
            handleQuit();
          }
          break;

        // Only handle other keys if modals are closed
        default:
          if (isModalOpen || isFinishModalOpen) {
            return;
          }

          switch (e.key) {
            case 'ArrowLeft':
              if (hasPrevious) {
                onPrevious();
              }
              break;
            
            case 'ArrowRight':
              if (hasNext) {
                onNext();
              }
              break;
            
            case 'ArrowUp':
            case 'ArrowDown': {
              e.preventDefault();
              const options = shuffledOptions.options;
              if (!selectedAnswer) {
                onAnswerSelect(options[0]);
                return;
              }
              const currentIndex = options.indexOf(selectedAnswer);
              if (currentIndex === -1) return;
              
              let newIndex;
              if (e.key === 'ArrowUp') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
              } else {
                newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
              }
              onAnswerSelect(options[newIndex]);
              break;
            }
            
            case 'Enter':
              if (selectedAnswer && !isAnswered && 
                  // Add check for flagged questions in exam mode
                  !(mode === 'exam' && flaggedQuestions?.includes(currentQuestionIndex))) {
                onAnswerSubmit(selectedAnswer);
              }
              break;
            
            case 'f':
            case 'F':
              if (mode === 'exam' && !isAnswered && onFlagQuestion) {
                onFlagQuestion(currentQuestionIndex);
              }
              break;
          }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    hasPrevious, 
    hasNext, 
    onPrevious, 
    onNext, 
    shuffledOptions, 
    selectedAnswer,
    onAnswerSelect,
    onAnswerSubmit,
    isAnswered,
    isModalOpen,
    isFinishModalOpen,
    mode,
    onFlagQuestion,
    currentQuestionIndex,
    flaggedQuestions, 
    handleQuit
  ]);

  const handleOptionSelect = (option: string) => {
    // In review mode, prevent selecting answers for unanswered questions
    if (mode === 'review' && !isAnswered) {
      return;
    }
    
    // Regular behavior for answered questions or non-review modes
    if (!isAnswered || mode === 'practice') {
      onAnswerSelect(option);
    }
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
                  onClick={() => handleOptionSelect(option)}
                  // Only disable if in review mode AND question wasn't previously answered
                  disabled={mode === 'review' && !isAnswered}
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
            // Disable submit button in review mode for unanswered questions
            disabled={!selectedAnswer || isAnswered || (mode === 'review' && !isAnswered)}
          >
            {isAnswered ? 'Answer Submitted' : 'Submit Answer'}
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
          {mode === 'exam' ? 'Quit Exam' : 'Quit'}
        </button>
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          mode === 'practice' 
            ? 'Quit to Menu' 
            : mode === 'category-test'
              ? 'Exit to Results'
              : modalType === 'finish'
                ? 'Finish Exam'
                : 'Quit Exam'
        }
        message={
          mode === 'practice' 
            ? 'Are you sure you want to quit to the menu?' 
            : mode === 'exam'
              ? modalType === 'finish'
                ? 'Are you sure you want to finish the exam?'
                : 'Are you sure you want to quit the exam?'
              : 'Are you sure you want to exit to results?'
        }
      />
       <Modal 
        isOpen={isFinishModalOpen && mode === 'practice'}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleConfirmFinish}
        title="Finish Practice"
        message="Are you sure you want to finish the practice session?"
      />
    </div>
  );
};

export default Question;