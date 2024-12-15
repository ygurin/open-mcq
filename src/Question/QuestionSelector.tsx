import React from 'react';
import './QuestionSelector.css';

interface QuestionSelectorProps {
  currentQuestion: number;
  totalQuestions: number;
  onQuestionSelect: (index: number) => void;
  answeredQuestions: {
    isAnswered: boolean;
    isCorrect: boolean;
  }[];
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  currentQuestion,
  totalQuestions,
  onQuestionSelect,
  answeredQuestions,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getButtonClass = (index: number) => {
    const answered = answeredQuestions[index];
    let className = "selector-button ";
    
    if (index === currentQuestion) {
      className += "current ";
    }
    
    if (answered?.isAnswered) {
      className += answered.isCorrect ? "correct " : "incorrect ";
    }
    
    return className.trim();
  };

  return (
    <div className="question-selector">
      <div className="question-counter">
        <span className="counter-label">Question</span>
        <span className="counter-number">{currentQuestion + 1}/{totalQuestions}</span>
      </div>
      
      <button
        className="open-selector-button"
        onClick={() => setIsOpen(true)}
      >
        All Questions
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Question</h3>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="question-grid">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i}
                  className={getButtonClass(i)}
                  onClick={() => {
                    onQuestionSelect(i);
                    setIsOpen(false);
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSelector;