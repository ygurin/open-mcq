// src/ModeSelection/ModeSelection.tsx
import { FC } from 'react';
import './ModeSelection.css';

interface ModeSelectionProps {
  onSelectMode: (mode: 'practice' | 'test') => void;
}

const ModeSelection: FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="mode-selection">
      <h2>Select Mode</h2>
      <div className="mode-buttons">
        <button onClick={() => onSelectMode('practice')} className="mode-button practice">
          <h3>Practice Mode</h3>
          <p>Practice questions with instant feedback and explanations</p>
        </button>
        <button onClick={() => onSelectMode('test')} className="mode-button test">
          <h3>Test Mode</h3>
          <p>Take a timed test and get scored on your performance</p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;