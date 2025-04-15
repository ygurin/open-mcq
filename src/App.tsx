import React, { useEffect, useState } from 'react';
import './App.css';

import { useAppContext } from './hooks/useAppContext';
import { useExamMode } from './features/exam/hooks/useExamMode';
import ModeSelection from './features/mode-selection/components/ModeSelection/ModeSelection';
import ExamMode from './features/exam/components/ExamMode/ExamMode';
import PracticeMode from './features/practice/components/PracticeMode/PracticeMode';
import CategoryTest from './features/test/components/CategoryTest/CategoryTest';
import SessionRecovery from './components/ui/SessionRecovery/SessionRecovery';
import { getAllQuestions, getCategories, getQuestions, getImage } from './services/questionService';
import { AppMode } from './types';
import { saveModeState, updateLastActivity, clearAppState } from './services/localStorageService';

const App: React.FC = () => {
  const { 
    mode, 
    resetState, 
    setMode, 
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
    testResults,
    exam,
    showResults
  } = useAppContext();
  const { initializeExamMode } = useExamMode();
  const [isRecoveryChecked, setIsRecoveryChecked] = useState(false);
  
  // Periodically save state to localStorage
  useEffect(() => {
    if (!mode) return;
    
    // Save state immediately when mode changes
    saveModeState(mode, selectedCategory, selectedQuestion, answeredQuestions, testResults, exam);
    
    // Update last activity time periodically
    const activityInterval = setInterval(() => {
      updateLastActivity();
    }, 60000); // Every minute
    
    // Save state periodically
    const saveInterval = setInterval(() => {
      if (mode) {
        saveModeState(mode, selectedCategory, selectedQuestion, answeredQuestions, testResults, exam);
      }
    }, 5000); // Every 5 seconds
    
    // Clean up intervals
    return () => {
      clearInterval(activityInterval);
      clearInterval(saveInterval);
    };
  }, [mode, selectedCategory, selectedQuestion, answeredQuestions, testResults, exam, showResults]);
  
  // Handle mode selection
  const handleModeSelect = (newMode: Exclude<AppMode, null | "review">) => {
    // Clear any previous saved state when selecting a new mode
    clearAppState();
    
    if (newMode === 'exam') {
      initializeExamMode(getAllQuestions());
    } else {
      resetState();
      // Set the mode after reset
      setMode(newMode);
    }
  };
  
  // Handle dismiss of session recovery
  const handleRecoveryDismiss = () => {
    setIsRecoveryChecked(true);
  };

  // Show session recovery prompt if we haven't checked yet
  if (!isRecoveryChecked) {
    return <SessionRecovery onDismiss={handleRecoveryDismiss} />;
  }
  
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