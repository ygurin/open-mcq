import React, { useState } from 'react';
import { useAppContext } from '../../../../hooks/useAppContext';
import { useCategoryTest } from '../../hooks/useCategoryTest';
import { usePreventRefresh } from '../../../../hooks/usePreventRefresh';
import Question from '../../../questions/components/Question/Question';
import TestResults from '../TestResults/TestResults';
import CategoryButton from '../../../categories/components/CategoryButton/CategoryButton';
import { Item } from '../../../../types';
import { getRandomQuestions, CategoryTestQuestions } from '../../../../utils/getRandomQuestions';
import './CategoryTest.css';

interface CategoryTestProps {
  getCategories: () => string[];
  getQuestions: (category: string) => Item[];
  getImage: (path: string) => string;
  onBackToModeSelection: () => void;
}

const CategoryTest: React.FC<CategoryTestProps> = ({
  getCategories,
  getQuestions,
  getImage,
  onBackToModeSelection
}) => {
  const {
    selectedCategory,
    selectedQuestion,
    testResults,
    showResults,
    answeredQuestions,
    setSelectedCategory,
    setSelectedQuestion,
    mode
  } = useAppContext();

  // Store random questions for each category
  const [categoryTestQuestions, setCategoryTestQuestions] = useState<Record<string, CategoryTestQuestions>>({});
  
  // New state for question count selection UI
  const [showQuestionCountSelector, setShowQuestionCountSelector] = useState(false);
  const [selectedCategoryForCount, setSelectedCategoryForCount] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(20);

  const {
    handleAnswerSelection,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleFinishTest,
    reviewWrongAnswers,
    handleRestartTest
  } = useCategoryTest((category: string) => {
    // For both test and review modes, use the random subset
    if (categoryTestQuestions[category]) {
      return categoryTestQuestions[category].randomQuestions;
    }
    
    // If no random questions exist yet for this category, return empty array
    // (this should never happen as we initialize the questions when selecting a category)
    return [];
  });
  
  // Prevent refresh when a category is selected and we're not in results view
  const shouldPreventRefresh = !!selectedCategory && !showResults;
  usePreventRefresh(shouldPreventRefresh, 'You have unsaved test progress. Are you sure you want to leave this page?');

  // Generate the random question set when a category is selected
  const initializeRandomQuestions = (category: string, count: number) => {
    const allQuestions = getQuestions(category);
    if (allQuestions.length === 0) return;
    
    // Generate random subset of questions
    const randomQuestions = getRandomQuestions(allQuestions, count);
    
    // Store both the random subset and the original questions
    setCategoryTestQuestions(prev => ({
      ...prev,
      [category]: {
        randomQuestions,
        originalQuestions: allQuestions
      }
    }));
    
    // Reset to the first question
    setSelectedQuestion("0");
  };

  // Handler for when a category is clicked
  const handleCategoryClick = (category: string) => {
    const allQuestions = getQuestions(category);
    
    if (allQuestions.length > 0) {
      setSelectedCategoryForCount(category);
      
      // Set default to 20 or the maximum available if less than 20
      setSliderValue(Math.min(20, allQuestions.length));
      setShowQuestionCountSelector(true);
    }
  };

  // Handler for when user selects the number of questions
  const handleQuestionCountSelection = (count: number) => {
    if (!selectedCategoryForCount) return;
    
    setSelectedCategory(selectedCategoryForCount);
    
    if (mode !== 'review') {
      initializeRandomQuestions(selectedCategoryForCount, count);
    } else {
      setSelectedQuestion("0");
    }
    
    setShowQuestionCountSelector(false);
    setSelectedCategoryForCount(null);
  };

  // Render exam results screen
  if (showResults) {
    return (
      <TestResults
        results={testResults}
        onReviewWrongAnswers={reviewWrongAnswers}
        onRestartTest={handleRestartTest}
      />
    );
  }

  // Category selection screen
  if (!selectedCategory) {
    const categoryList = getCategories();
    
    return (
      <div>
        <h2>Select a Category</h2>
        <p className="test-mode-info">
          {mode === 'review' 
            ? 'Review Mode: Review your incorrect answers' 
            : 'Category Test Mode: Your answers will be scored and you\'ll receive a final result'
          }
        </p>
        <div className="category-list">
          {categoryList.map(categ => {
            const categoryProgress = testResults[categ] 
              ? `(${testResults[categ].correctAnswers}/${testResults[categ].totalQuestions})`
              : '';
            
            return (
              <CategoryButton
                key={categ}
                onSelectCategory={() => handleCategoryClick(categ)}
                text={`${categ} ${categoryProgress}`} 
              />
            );
          })}
        </div>
        <div className="navigation-buttons">
          <button 
            onClick={onBackToModeSelection}
            className="nav-button back-button"
          >
            Back to Mode Selection
          </button>
        </div>

        {/* Question Count Selector Modal */}
        {showQuestionCountSelector && selectedCategoryForCount && (
          <div className="question-count-selector-overlay" onClick={() => {
            setShowQuestionCountSelector(false);
            setSelectedCategoryForCount(null);
          }}>
            <div className="question-count-selector-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Select Number of Questions</h3>
              <p>Category: {selectedCategoryForCount}</p>
              <p>Total Available: {getQuestions(selectedCategoryForCount).length} questions</p>
              
              <div className="question-count-slider-container">
                <button 
                  className="slider-arrow-button"
                  onClick={() => setSliderValue(prev => Math.max(1, prev - 1))}
                  disabled={sliderValue <= 1}
                >
                  &#x25C0;
                </button>
                <input
                  type="range"
                  min="1"
                  max={getQuestions(selectedCategoryForCount).length}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="question-count-slider"
                />
                <button 
                  className="slider-arrow-button"
                  onClick={() => setSliderValue(prev => Math.min(getQuestions(selectedCategoryForCount).length, prev + 1))}
                  disabled={sliderValue >= getQuestions(selectedCategoryForCount).length}
                >
                  &#x25B6;
                </button>
                <div className="slider-value-display">
                  <span>{sliderValue} Questions</span>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="confirm-button"
                  onClick={() => handleQuestionCountSelection(sliderValue)}
                >
                  Start Test
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowQuestionCountSelector(false);
                    setSelectedCategoryForCount(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Question view
  let questionList: Item[] = [];
  
  // For both test and review modes, use the random subset
  // This ensures review mode only shows the questions that were actually tested
  questionList = categoryTestQuestions[selectedCategory]?.randomQuestions || [];
    
  // If random questions don't exist yet (somehow), initialize them now
  if (questionList.length === 0) {
    initializeRandomQuestions(selectedCategory, 20);
    // Use the full set temporarily until initialization completes
    questionList = getQuestions(selectedCategory);
  }
  
  if (questionList.length === 0) {
    console.error('No questions available for category:', selectedCategory);
    return <div>No questions available for this category.</div>;
  }

  const currentIndex = Math.min(
    Number(selectedQuestion),
    questionList.length - 1
  );

  const currentQuestion = questionList[currentIndex];
  const questionKey = `${selectedCategory}-${currentIndex}`;
  const answerState = answeredQuestions[questionKey] || {
    isAnswered: false,
    isCorrect: false,
    selectedAnswer: undefined
  };

  const isReviewMode = mode === 'review';
  
  return (
    <div className="question-container">
      <Question
        mode={isReviewMode ? 'review' : 'category-test'}
        heading={currentQuestion.heading}
        ques={currentQuestion.question}
        image={currentQuestion.image ? getImage(currentQuestion.image) : undefined}
        options={currentQuestion.questions}
        explanation={isReviewMode ? currentQuestion.explanation : undefined}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentIndex < questionList.length - 1}
        hasPrevious={currentIndex > 0}
        onAnswerSelect={handleAnswerSelection}
        onAnswerSubmit={handleAnswerSubmit}
        isCorrect={answerState.isCorrect ?? null}
        isAnswered={answerState.isAnswered ?? false}
        selectedAnswer={answerState.selectedAnswer}
        onQuit={handleFinishTest}
        currentQuestionIndex={currentIndex}
        totalQuestions={questionList.length}
        onQuestionSelect={(index) => setSelectedQuestion(String(index))}
        answeredQuestions={questionList.map((_, index) => {
          const key = `${selectedCategory}-${index}`;
          const state = answeredQuestions[key];
          return {
            isAnswered: state?.isAnswered ?? false,
            isCorrect: state?.isCorrect ?? false
          };
        })}
        correctAnswer={currentQuestion.answer}
      />
    </div>
  );
};

export default CategoryTest;
