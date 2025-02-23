import React from 'react';
import './ExamResults.css';
import { EXAM_TIME_MINUTES } from '../../constants';

interface ExamResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  onBackToMenu: () => void;
  onRetry?: () => void;  
}

const ExamResults: React.FC<ExamResultsProps> = ({
  correctAnswers,
  totalQuestions,
  timeTaken,
  onBackToMenu,
}) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  const passed = correctAnswers >= 35;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="exam-results">
      <h2>Exam Results</h2>
      
      <div className={`result-status ${passed ? 'passed' : 'failed'}`}>
        {passed ? 'PASSED' : 'FAILED'}
      </div>

      <div className="results-details">
        <div className="result-item">
          <label>Score:</label>
          <span>{correctAnswers}/{totalQuestions} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="result-item">
          <label>Time Taken:</label>
          <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>
        <div className="result-item">
          <label>Required to Pass:</label>
          <span>35/40 questions (87.5%)</span>
        </div>
        <div className="result-item">
          <label>Time Allowed:</label>
          <span>{EXAM_TIME_MINUTES} minutes</span>
        </div>
      </div>

      <div className="result-actions">
        <button className="menu-button" onClick={onBackToMenu}>
          Exit to Menu
        </button>
      </div>
    </div>
  );
};

export default ExamResults;