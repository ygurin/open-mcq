import { FC } from 'react';
import './QuestionButton.css';

interface QuestionButtonProps {
  getQuestion: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  number: number;
  isSelected: boolean;
}

const QuestionButton: FC<QuestionButtonProps> = ({ getQuestion, number, isSelected }) => {
  return (
    <div className="QuestionButton">
      <button 
        onClick={getQuestion} 
        value={String(number)}
        className={isSelected ? 'selected' : ''}
      >
        {number + 1}
      </button>
    </div>
  );
};

export default QuestionButton;