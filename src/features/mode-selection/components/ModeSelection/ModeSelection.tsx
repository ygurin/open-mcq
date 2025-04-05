import { FC } from 'react';
import './ModeSelection.css';
import { AppMode } from '../../../../types';

interface ModeSelectionProps {
  onSelectMode: (mode: Exclude<AppMode, null | "review">) => void;
}

const ModeSelection: FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="mode-selection">
      <h2>Select Mode</h2>
      <div className="mode-buttons-vertical">
        <button onClick={() => onSelectMode('practice')} className="mode-button practice">
          <h3>Practice Mode</h3>
          <p>Practice questions with instant feedback and explanations</p>
        </button>
        <button onClick={() => onSelectMode('category-test')} className="mode-button category-test">
          <h3>Category Test Mode</h3>
          <p>Take a test in a specific category and get scored on your performance</p>
        </button>
        <button onClick={() => onSelectMode('exam')} className="mode-button exam">
          <h3>Exam Mode</h3>
          <p>45-minute timed exam with 40 random questions from all categories</p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;