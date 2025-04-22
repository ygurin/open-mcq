import React from 'react';
import { useAppContext } from '../../../../hooks/useAppContext';
import { useCategoryTest } from '../../hooks/useCategoryTest';
import { usePreventRefresh } from '../../../../hooks/usePreventRefresh';
import Question from '../../../questions/components/Question/Question';
import TestResults from '../TestResults/TestResults';
import CategoryButton from '../../../categories/components/CategoryButton/CategoryButton';
import { Item } from '../../../../types';

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

  const {
    handleAnswerSelection,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleFinishTest,
    reviewWrongAnswers,
    handleRestartTest
  } = useCategoryTest(getQuestions);
  
  // Prevent refresh when a category is selected and we're not in results view
  const shouldPreventRefresh = !!selectedCategory && !showResults;
  usePreventRefresh(shouldPreventRefresh, 'You have unsaved test progress. Are you sure you want to leave this page?');

  // If showing results
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
                onSelectCategory={(e) => {
                  const newCategory = e.currentTarget.value;
                  const questions = getQuestions(newCategory);
                  
                  if (questions.length > 0) {
                    setSelectedQuestion("0");
                    setSelectedCategory(newCategory);
                  }
                }}
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
      </div>
    );
  }

  // Question view
  const questionList = getQuestions(selectedCategory);
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