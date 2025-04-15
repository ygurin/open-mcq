import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { loadAppState, clearAppState } from '../../../services/localStorageService';
import './SessionRecovery.css';
import { AppState } from '../../../types';

interface SessionRecoveryProps {
  onDismiss: () => void;
}

const SessionRecovery: React.FC<SessionRecoveryProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionData, setSessionData] = useState<Partial<AppState> | null>(null);
  const { 
    setMode, 
    setSelectedCategory, 
    setSelectedQuestion, 
    setAnsweredQuestions, 
    setTestResults,
    setExam,
    setShowResults
  } = useAppContext();

  useEffect(() => {
    // Try to load saved state
    const savedState = loadAppState();
    
    // Determine if we should show the recovery prompt
    const shouldShowRecovery = savedState && shouldRecoverSession(savedState);
    
    if (shouldShowRecovery) {
      setSessionData(savedState);
      setIsVisible(true);
    } else {
      // If no state to recover or we shouldn't recover, immediately call onDismiss
      onDismiss();
    }
  }, [onDismiss]);

  // Determine if we should recover the session based on its state
  const shouldRecoverSession = (state: Partial<AppState>): boolean => {
    // Don't recover if there's no mode
    if (!state.mode) return false;
    
    // Don't recover if in review mode
    if (state.mode === 'review') return false;
    
    // For practice mode, only recover if a category is selected
    if (state.mode === 'practice') {
      return !!state.selectedCategory;
    }
    
    // For category-test mode, only recover if a category is selected and not showing results
    if (state.mode === 'category-test') {
      return !!state.selectedCategory && !state.showResults;
    }
    
    // For exam mode, only recover if not completed
    if (state.mode === 'exam' && state.exam) {
      return !state.exam.isComplete && !state.exam.isReview;
    }
    
    return true;
  };

  const handleRestore = () => {
    if (!sessionData) {
      onDismiss();
      return;
    }
    
    // Restore app state from saved data
    if (sessionData.mode) setMode(sessionData.mode);
    if (sessionData.selectedCategory !== undefined) setSelectedCategory(sessionData.selectedCategory);
    if (sessionData.selectedQuestion) setSelectedQuestion(sessionData.selectedQuestion);
    if (sessionData.answeredQuestions) setAnsweredQuestions(sessionData.answeredQuestions);
    
    // Mode-specific state
    if (sessionData.testResults) setTestResults(sessionData.testResults);
    if (sessionData.exam) setExam(sessionData.exam);
    if (sessionData.showResults) setShowResults(sessionData.showResults);
    
    // Hide the dialog and continue to the app
    setIsVisible(false);
    onDismiss();
  };

  const handleDiscard = () => {
    // Clear saved state
    clearAppState();
    
    // Hide the dialog
    setIsVisible(false);
    
    // Call the onDismiss callback
    onDismiss();
  };

  if (!isVisible) {
    return null;
  }

  // Get session type for display
  let sessionType = 'session';
  if (sessionData?.mode === 'practice') {
    sessionType = 'practice session';
  } else if (sessionData?.mode === 'category-test') {
    sessionType = 'category test';
  } else if (sessionData?.mode === 'exam') {
    sessionType = 'exam';
  }

  return (
    <div className="session-recovery-overlay">
      <div className="session-recovery-modal">
        <h3>Recover Previous Session</h3>
        <p>
          We found an unfinished {sessionType} from your previous visit.
          Would you like to continue where you left off?
        </p>
        
        <div className="session-recovery-buttons">
          <button className="discard-button" onClick={handleDiscard}>
            Start New
          </button>
          <button className="restore-button" onClick={handleRestore}>
            Restore Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecovery;