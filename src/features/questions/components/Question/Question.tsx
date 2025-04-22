import { FC, useState, useEffect, useCallback } from 'react';
import Modal from '../../../../components/ui/Modal/Modal';
import './Question.css';
import QuestionNav from './QuestionNav';
import { ShuffledQuestion, shuffleQuestionOptions } from '../../../../utils/shuffle';
import QuestionOptions from './QuestionOptions';
import { QuestionMode } from '../../../../types';

interface QuestionProps {
  mode: QuestionMode;
  heading: string;
  ques: string;
  image?: string;
  options: string[];
  explanation?: string;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onAnswerSubmit: (selectedAnswer: string) => void;
  onAnswerSelect: (selectedAnswer: string) => void;
  isCorrect: boolean | null;
  isAnswered: boolean;
  selectedAnswer?: string;
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
  options,
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
  flaggedQuestions = []
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'quit' | 'finish'>('quit'); 
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledQuestion>({ 
    options: [...options],
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
    const shuffled = shuffleQuestionOptions(options, correctAnswer);
    setShuffledOptions(shuffled);
    setShowAnswer(false);
  }, [currentQuestionIndex, options, correctAnswer]);

  const areAllQuestionsAnswered = answeredQuestions.every(q => q.isAnswered);

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
              const optionsList = shuffledOptions.options;
              if (!selectedAnswer) {
                onAnswerSelect(optionsList[0]);
                return;
              }
              const currentIndex = optionsList.indexOf(selectedAnswer);
              if (currentIndex === -1) return;
              
              let newIndex;
              if (e.key === 'ArrowUp') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : optionsList.length - 1;
              } else {
                newIndex = currentIndex < optionsList.length - 1 ? currentIndex + 1 : 0;
              }
              onAnswerSelect(optionsList[newIndex]);
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
      <QuestionOptions
        options={shuffledOptions.options}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
        mode={mode}
        onOptionSelect={onAnswerSelect}
        flaggedQuestions={flaggedQuestions}
        currentQuestionIndex={currentQuestionIndex}
        hintedAnswer={hintedAnswer}
      />
      <div className="answer-section">
        {/* Show feedback section in these cases:
           1. If the question is answered and not in exam mode
           2. If in review mode (regardless of whether it was answered) 
        */}
        {(isAnswered && mode !== 'exam') || mode === 'review' ? (
          <div className="feedback-section">
            {/* For answered questions, show correct/incorrect feedback */}
            {isAnswered ? (
              <p className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
            ) : mode === 'review' ? (
              // For unanswered questions in review mode
              <p className="answer-feedback unanswered">
                No answer submitted. The correct answer is highlighted.
              </p>
            ) : null}
            
            {/* Show explanation in these cases:
               1. If the user got it wrong
               2. If a hint was used
               3. If in review mode (always)
            */}
            {(mode === 'review' || isCorrect === false || wasHintUsed) && explanation ? (
              <div className="explanation">
                <h4>Explanation:</h4>
                <p>{explanation}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="navigation-buttons">
        <div className="primary-buttons">
        <button 
          className="answer-button"
          onClick={() => selectedAnswer && onAnswerSubmit(selectedAnswer)}
          disabled={
            !selectedAnswer || 
            isAnswered || 
            (mode === 'review' && !isAnswered) ||
            (mode === 'exam' && flaggedQuestions?.includes(currentQuestionIndex))
          }
        >
          {isAnswered 
            ? 'Answer Submitted' 
            : mode === 'exam' && flaggedQuestions?.includes(currentQuestionIndex)
              ? 'Question Flagged'
              : 'Submit Answer'
          }
        </button>

          {mode === 'exam' && onFlagQuestion && (
            <button 
              onClick={() => onFlagQuestion(currentQuestionIndex)}
              className={`answer-button flag-button ${flaggedQuestions.includes(currentQuestionIndex) ? 'flagged' : ''}`}
              disabled={isAnswered}
            >
              {flaggedQuestions.includes(currentQuestionIndex) ? 'Unflag' : 'Flag'}
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
          {
            mode === 'exam' 
              ? 'Quit Exam' 
              : mode === 'review' 
                ? 'Back to Results' 
                : 'Quit'
          }
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