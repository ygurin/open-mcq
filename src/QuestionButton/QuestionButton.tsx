import { FC } from 'react';
import './QuestionButton.css';

interface QuestionButtonProps {
  getQuestion: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  number: number;
}

const QuestionButton: FC<QuestionButtonProps> = ({ getQuestion, number }) => {
  return (
    <div className="QuestionButton">
      <button onClick={getQuestion} value={String(number)}>
        {number + 1}
      </button>
    </div>
  );
};

export default QuestionButton;
