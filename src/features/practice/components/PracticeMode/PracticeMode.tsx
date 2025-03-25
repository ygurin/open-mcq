import React from 'react';
import { useAppContext } from '../../../../hooks/useAppContext';
import { usePracticeMode } from '../../hooks/usePracticeMode';
import Question from '../../../questions/components/Question/Question';
import CategoryButton from '../../../categories/components/CategoryButton/CategoryButton';
import { Item } from '../../../../types';

interface PracticeModeProps {
  getCategories: () => string[];
  getQuestions: (category: string) => Item[];
  getImage: (path: string) => string;
  onBackToModeSelection: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({
  getCategories,
  getQuestions,
  getImage,
  onBackToModeSelection
}) => {
  const {
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
    setSelectedCategory,
    setSelectedQuestion
  } = useAppContext();

  const {
    handleAnswerSelection,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleQuit,
    isQuestionAnswered
  } = usePracticeMode(getQuestions);

  // If no category is selected, show category selection screen
  if (!selectedCategory) {
    const categoryList = getCategories();
    
    return (
      <div>
        <h2>Select a Category</h2>
        <div className="category-list">
          {categoryList.map(categ => (
            <CategoryButton
              key={categ}
              getCategory={(e) => {
                const newCategory = e.currentTarget.value;
                const questions = getQuestions(newCategory);
                
                if (questions.length > 0) {
                  setSelectedQuestion("0");
                  setSelectedCategory(newCategory);
                }
              }}
              text={categ} 
            />
          ))}
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

  // Display questions
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
  const answerState = isQuestionAnswered(
    selectedCategory,
    String(currentIndex)
  );

  return (
    <div className="question-container">
      <Question
        mode="practice"
        heading={currentQuestion.heading}
        ques={currentQuestion.question}
        image={currentQuestion.image ? getImage(currentQuestion.image) : undefined}
        q1={currentQuestion.questions[0]}
        q2={currentQuestion.questions[1]}
        q3={currentQuestion.questions[2]}
        q4={currentQuestion.questions[3]}
        explanation={currentQuestion.explanation}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentIndex < questionList.length - 1}
        hasPrevious={currentIndex > 0}
        onAnswerSelect={handleAnswerSelection}
        onAnswerSubmit={handleAnswerSubmit}
        isCorrect={answerState?.isCorrect ?? null}
        isAnswered={answerState?.isAnswered ?? false}
        selectedAnswer={answerState?.selectedAnswer}
        onQuit={handleQuit}
        currentQuestionIndex={currentIndex}
        totalQuestions={questionList.length}
        onQuestionSelect={(index) => setSelectedQuestion(String(index))}
        answeredQuestions={questionList.map((_, index) => {
          const state = isQuestionAnswered(selectedCategory, String(index));
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

export default PracticeMode;