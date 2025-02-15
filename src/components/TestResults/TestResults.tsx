import React from 'react';
import './TestResults.css';

interface TestResultsData {
  [category: string]: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: string[];
    availableQuestions: number
  };
}

interface TestResultsProps {
  results: TestResultsData;
  onReviewWrongAnswers: (category: string, wrongAnswers: string[]) => void;
  onRestartTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  results,
  onReviewWrongAnswers,
  onRestartTest
}) => {
  let totalCorrect = 0;
  let totalQuestions = 0;

  Object.values(results).forEach(result => {
    totalCorrect += result.correctAnswers;
    totalQuestions += result.availableQuestions;
  });

  const percentage = totalQuestions > 0 
    ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
    : '0.0';

    return (
      <div className="test-results-container">
        <div className="test-results">
          <h2>Test Results</h2>
          
          <div className="score-summary">
            <div className="score-item">
              <strong>{totalCorrect} out of {totalQuestions}</strong> questions answered correctly
            </div>
            <div className="score-item">
              <strong>{percentage}%</strong> correct answers
            </div>
          </div>
  
          <div className="category-results">
            {Object.entries(results).map(([category, result]) => (
              <div key={category} className="category-result">
                <h4>{category}</h4>
                <p>Score: {result.correctAnswers} out of {result.availableQuestions}</p>
                {result.wrongAnswers.length > 0 && (
                  <div className="wrong-answers-section">
                    <p>Incorrect Questions: {result.wrongAnswers.length}</p>
                    <button 
                      onClick={() => onReviewWrongAnswers(category, result.wrongAnswers)}
                      className="review-button"
                    >
                      Review Wrong Answers
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
  
          <button 
            onClick={onRestartTest}
            className="restart-button"
          >
            Start New Test
          </button>
        </div>
      </div>
    );
};

export default TestResults;