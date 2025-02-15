import React, { Component } from 'react';
import './App.css';

import Data from './data.json';
import CategoryButton from './components/CategoryButton/CategoryButton';
import Question from './Question/Question';
import ModeSelection from './components/ModeSelection/ModeSelection';
import TestResults from './components/TestResults/TestResults';

interface Item {
  question: string;
  heading: string;
  explanation: string;
  questions: string[];
  answer: string;
  id: string;
  update: string;
  image?: string;
}

interface AnswerState {
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer?: string;
}

interface TestResults {
  [category: string]: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: string[];
    availableQuestions: number;
  };
}

interface AppState {
  mode: 'practice' | 'test' | null;
  selectedCategory: string | null;
  selectedQuestion: string;
  answeredQuestions: { [key: string]: AnswerState };
  testResults: TestResults;
  showResults: boolean;
}

class App extends Component<object, AppState> {
  state: AppState = {
    mode: null,
    selectedCategory: null,
    selectedQuestion: "0",
    answeredQuestions: {},
    testResults: {},
    showResults: false
  };

  handleModeSelect = (mode: 'practice' | 'test') => {
    this.setState({ mode });
  };

  handleExit = () => {
    this.setState({
      mode: null,
      selectedCategory: null,
      selectedQuestion: "0",
      answeredQuestions: {},
      testResults: {},
      showResults: false
    });
  };

  getCategories = () => {
    const lookup: { [key: string]: number } = {};
    const items: Item[] = Data;
    const result: string[] = [];

    for (const item of items) {
      const name = item.heading;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    return result;
  };

  getQuestions = (categ: string): Item[] => {
    const items: Item[] = Data;
    
    // Try exact match first
    const exactMatches = items.filter(item => item.heading === categ);
    
    // If no exact matches, try normalized comparison
    if (exactMatches.length === 0) {
      const normalizedCateg = categ.trim().toLowerCase();
      return items.filter(item => 
        item.heading.trim().toLowerCase() === normalizedCateg
      );
    }
    
    return exactMatches;
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newCategory = e.currentTarget.value;
    const questions = this.getQuestions(newCategory);
    
    if (questions.length > 0) {
      this.setState({
        selectedQuestion: "0",
        selectedCategory: newCategory
      });
    }
  };

  questionClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ selectedQuestion: e.currentTarget.value });
  };

  handleNext = () => {
    if (this.state.selectedCategory) {
      const questions = this.getQuestions(this.state.selectedCategory);
      const currentIndex = Number(this.state.selectedQuestion);
      if (currentIndex < questions.length - 1) {
        this.setState({ selectedQuestion: String(currentIndex + 1) });
      }
    }
  };

  handlePrevious = () => {
    const currentIndex = Number(this.state.selectedQuestion);
    if (currentIndex > 0) {
      this.setState({ selectedQuestion: String(currentIndex - 1) });
    }
  };

  getImage = (path: string) => {
    try {
      return path.split('/').pop() || "";
    } catch {
      return "";
    }
  };

  handleAnswerSelection = (selectedAnswer: string) => {
    if (this.state.selectedCategory) {
      const questionKey = `${this.state.selectedCategory}-${this.state.selectedQuestion}`;
      const existingState = this.state.answeredQuestions[questionKey];
      
      if (!existingState?.isAnswered) {
        this.setState(prevState => ({
          answeredQuestions: {
            ...prevState.answeredQuestions,
            [questionKey]: {
              ...existingState,
              selectedAnswer
            }
          }
        }));
      }
    }
  };

  handleAnswerSubmit = (selectedAnswer: string) => {
    if (this.state.selectedCategory) {
      const questions = this.getQuestions(this.state.selectedCategory);
      const currentQuestion = questions[Number(this.state.selectedQuestion)];
      const isCorrect = selectedAnswer === currentQuestion.answer;
      
      const questionKey = `${this.state.selectedCategory}-${this.state.selectedQuestion}`;
      
      this.setState(prevState => {
        const newAnsweredQuestions = {
          ...prevState.answeredQuestions,
          [questionKey]: {
            isAnswered: true,
            isCorrect,
            selectedAnswer
          }
        };

        let newTestResults = { ...prevState.testResults };
        if (this.state.mode === 'test') {
          const categoryQuestions = this.getQuestions(this.state.selectedCategory!);
          const categoryResults = prevState.testResults[this.state.selectedCategory!] || {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: [],
            availableQuestions: categoryQuestions.length
          };

          newTestResults = {
            ...newTestResults,
            [this.state.selectedCategory!]: {
              ...categoryResults,
              totalQuestions: categoryResults.totalQuestions + 1,
              correctAnswers: categoryResults.correctAnswers + (isCorrect ? 1 : 0),
              wrongAnswers: isCorrect 
                ? categoryResults.wrongAnswers 
                : [...categoryResults.wrongAnswers, currentQuestion.id],
              availableQuestions: categoryQuestions.length
            }
          };
          }

          return {
            answeredQuestions: newAnsweredQuestions,
            testResults: newTestResults
          };
        });
    }
  };

  isQuestionAnswered = (category: string, questionIndex: string): AnswerState | undefined => {
    const questionKey = `${category}-${questionIndex}`;
    return this.state.answeredQuestions[questionKey];
  };

  handleQuit = () => {
    if (this.state.mode === 'test') {
      this.setState({ showResults: true });
    } else {
      this.setState({
        selectedCategory: null,
        selectedQuestion: "0"
      });
    }
  };

  handleRestartTest = () => {
    this.setState({
      mode: null,
      selectedCategory: null,
      selectedQuestion: "0",
      answeredQuestions: {},
      testResults: {},
      showResults: false
    });
  };

  renderResults = () => {
    return (
      <TestResults
        results={this.state.testResults}
        onReviewWrongAnswers={this.reviewWrongAnswers}
        onRestartTest={this.handleRestartTest}
      />
    );
  };

  reviewWrongAnswers = (category: string, wrongAnswers: string[]) => {
    // Find the index of the first wrong answer in the current category
    const questions = this.getQuestions(category);
    const firstWrongQuestionIndex = questions.findIndex(q => wrongAnswers.includes(q.id));
    
    this.setState({
      showResults: false,
      selectedCategory: category,
      selectedQuestion: String(Math.max(0, firstWrongQuestionIndex))
    });
  };

  handleBackToModeSelection = () => {
    this.setState({
      mode: null,
      selectedCategory: null,
      selectedQuestion: "0",
      answeredQuestions: {},
      testResults: {}
    });
  };

  render() {
    const { mode, selectedCategory, showResults } = this.state;

    if (showResults) {
      return this.renderResults();
    }

    if (!mode) {
      return <ModeSelection onSelectMode={this.handleModeSelect} />;
    }

    const categoryList = this.getCategories();
    let categories = null;
    let questionList: Item[] | null = null;

    if (!selectedCategory) {
      categories = (
        <div>
          <h2>Select a Category</h2>
          {mode === 'test' && (
            <p className="test-mode-info">
              Test Mode: Your answers will be scored and you'll receive a final result
            </p>
          )}
          <div className="category-list">
            {categoryList.map(categ => {
              const categoryProgress = mode === 'test' && this.state.testResults[categ] 
                ? `(${this.state.testResults[categ].correctAnswers}/${this.state.testResults[categ].totalQuestions})`
                : '';
              
              return (
                <CategoryButton
                  key={categ}
                  getCategory={this.handleClick}
                  text={`${categ} ${categoryProgress}`} 
                />
              );
            })}
          </div>
          <div className="navigation-buttons">
            <button 
              onClick={this.handleBackToModeSelection}
              className="nav-button back-button"
            >
              Back to Mode Selection
            </button>
          </div>
        </div>
      );
    } else {
      questionList = this.getQuestions(selectedCategory);
    }

    let questionView = null;

    if (selectedCategory && questionList && questionList.length > 0) {
      const currentIndex = Math.min(
        Number(this.state.selectedQuestion),
        questionList.length - 1
      );

      // Get current question with safety checks
      const currentQuestion = questionList[currentIndex];

      if (currentQuestion) {
        const answerState = this.isQuestionAnswered(
          selectedCategory,
          String(currentIndex)
        );

        questionView = (
          <div className="question-container">
            <Question
              mode={mode}
              heading={currentQuestion.heading}
              ques={currentQuestion.question}
              image={this.getImage(currentQuestion.image ?? '')}
              q1={currentQuestion.questions[0]}
              q2={currentQuestion.questions[1]}
              q3={currentQuestion.questions[2]}
              q4={currentQuestion.questions[3]}
              explanation={mode === 'practice' ? currentQuestion.explanation : undefined}
              onNext={this.handleNext}
              onPrevious={this.handlePrevious}
              hasNext={currentIndex < questionList.length - 1}
              hasPrevious={currentIndex > 0}
              onAnswerSelect={this.handleAnswerSelection}
              onAnswerSubmit={this.handleAnswerSubmit}
              isCorrect={answerState?.isCorrect ?? null}
              isAnswered={answerState?.isAnswered ?? false}
              selectedAnswer={answerState?.selectedAnswer}
              onQuit={this.handleQuit}
              currentQuestionIndex={currentIndex}
              totalQuestions={questionList.length}
              onQuestionSelect={(index) => this.setState({ selectedQuestion: String(index) })}
              answeredQuestions={questionList.map((_, index) => {
                const state = this.isQuestionAnswered(selectedCategory, String(index));
                return {
                  isAnswered: state?.isAnswered ?? false,
                  isCorrect: state?.isCorrect ?? false
                };
              })}
              correctAnswer={currentQuestion.answer}
            />
          </div>
        );
      }
    }

    // Debug information for when no question is shown
    if (selectedCategory && (!questionList || questionList.length === 0)) {
      console.error('No questions available for category:', selectedCategory);
    }

    return (
      <div className={`App ${mode}-mode`}>
        <div className="mode-indicator">
          {mode === 'practice' ? 'Practice Mode' : 'Test Mode'}
        </div>
        {categories}
        {questionView}
      </div>
    );
  }
}

export default App;