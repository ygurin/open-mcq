import { FC } from 'react';
import './QuestionButton.css';

interface QuestionButtonProps {
  number: number;
  isSelected: boolean;
  getQuestion: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

const QuestionButton: FC<QuestionButtonProps> = ({ 
  number, 
  isSelected, 
  getQuestion,
  isAnswered,
  isCorrect 
}) => {
  const getButtonClass = () => {
    let className = 'QuestionButton';
    if (isSelected) className += ' selected';
    if (isAnswered) {
      className += isCorrect ? ' correct' : ' incorrect';
    }
    return className;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={getQuestion}
      value={number}
    >
      {number + 1}
    </button>
  );
};

export default QuestionButton;