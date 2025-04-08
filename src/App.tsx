import React from 'react';
import './App.css';

import { useAppContext } from './hooks/useAppContext';
import { useExamMode } from './features/exam/hooks/useExamMode';
import ModeSelection from './features/mode-selection/components/ModeSelection/ModeSelection';
import ExamMode from './features/exam/components/ExamMode/ExamMode';
import PracticeMode from './features/practice/components/PracticeMode/PracticeMode';
import CategoryTest from './features/test/components/CategoryTest/CategoryTest';
import { getAllQuestions, getCategories, getQuestions, getImage } from './services/questionService';
import { AppMode } from './types';

const App: React.FC = () => {
  const { mode, resetState, setMode } = useAppContext();
  const { initializeExamMode } = useExamMode();

  // Handle mode selection
  const handleModeSelect = (newMode: Exclude<AppMode, null | "review">) => {
    if (newMode === 'exam') {
      initializeExamMode(getAllQuestions());
    } else {
      resetState();
      // Set the mode after reset
      setMode(newMode);
    }
  };

  // Render different modes
  if (!mode) {
    return <ModeSelection onSelectMode={handleModeSelect} />;
  }

  if (mode === 'exam') {
    return (
      <div className="App exam-mode">
        <div className="mode-indicator exam">Exam Mode</div>
        <ExamMode getImage={getImage} />
      </div>
    );
  }

  if (mode === 'practice') {
    return (
      <div className="App practice-mode">
        <div className="mode-indicator">Practice Mode</div>
        <PracticeMode 
          getCategories={getCategories}
          getQuestions={getQuestions}
          getImage={getImage}
          onBackToModeSelection={resetState}
        />
      </div>
    );
  }

  if (mode === 'category-test' || mode === 'review') {
    return (
      <div className={`App ${mode === 'review' ? 'review-mode' : 'category-test-mode'}`}>
        <div className="mode-indicator">
          {mode === 'review' ? 'Review Mode' : 'Category Test Mode'}
        </div>
        <CategoryTest 
          getCategories={getCategories}
          getQuestions={getQuestions}
          getImage={getImage}
          onBackToModeSelection={resetState}
        />
      </div>
    );
  }

  // Fallback in case of unknown mode
  return <ModeSelection onSelectMode={handleModeSelect} />;
};

export default App;