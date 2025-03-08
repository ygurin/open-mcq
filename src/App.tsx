import React, { Component } from 'react';
import './App.css';

import Data from './data.json';
import CategoryButton from './components/CategoryButton/CategoryButton';
import Question from './Question/Question';
import ModeSelection from './components/ModeSelection/ModeSelection';
import TestResults from './components/TestResults/TestResults';
import { shuffleArray } from './utils/shuffle';
import ExamTimer from './components/ExamTimer/ExamTimer';
import ExamResults from './components/ExamResults/ExamResults';
import { EXAM_TIME_MINUTES } from './constants';

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

interface ExamState {
  questions: Item[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isComplete: boolean;
  startTime?: number;
  flaggedQuestions: number[];
  isReview?: boolean; // Add this property
}

interface AppState {
  mode: 'practice' | 'category-test' | 'exam' | null;
  selectedCategory: string | null;
  selectedQuestion: string;
  answeredQuestions: { [key: string]: AnswerState };
  testResults: TestResults;
  showResults: boolean;
  exam: ExamState | null;
}

class App extends Component<object, AppState> {
  state: AppState = {
    mode: null,
    selectedCategory: null,
    selectedQuestion: "0",
    answeredQuestions: {},
    testResults: {},
    showResults: false,
    exam: null
  };

  handleModeSelect = (mode: 'practice' | 'category-test' | 'exam') => {
    if (mode === 'exam') {
      this.initializeExamMode();
    } else {
      this.setState({
        mode,
        showResults: false,
        answeredQuestions: {},
        testResults: {}
      });
    }
  };

  initializeExamMode = () => {
    const allQuestions: Item[] = [...Data];
    const shuffledQuestions = shuffleArray(allQuestions).slice(0, 40);
    
    this.setState({
      mode: 'exam',
      exam: {
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        timeRemaining: EXAM_TIME_MINUTES * 60,
        isComplete: false,
        startTime: Date.now(),
        flaggedQuestions: [] 
      }
    });
  };

  handleFlagQuestion = (index: number) => {
    this.setState(prevState => {
      if (!prevState.exam) return prevState;
      
      const flaggedQuestions = [...prevState.exam.flaggedQuestions];
      const flagIndex = flaggedQuestions.indexOf(index);
      
      if (flagIndex === -1) {
        flaggedQuestions.push(index);
      } else {
        flaggedQuestions.splice(flagIndex, 1);
      }
      return {
        ...prevState,
        exam: {
          ...prevState.exam,
          flaggedQuestions
        }
      };
    });
  };

  handleExamTimeUp = () => {
    if (this.state.exam) {
      this.setState(prevState => ({
        ...prevState, 
        exam: {
          ...prevState.exam!,
          isComplete: true
        },
        showResults: true
      }));
    }
  };

  calculateExamResults = () => {
    if (!this.state.exam) return null;

    const correctAnswers = Object.values(this.state.answeredQuestions).reduce(
      (count, answer) => count + (answer.isCorrect ? 1 : 0),
      0
    );

    const timeTaken = this.state.exam.startTime
      ? Math.floor((Date.now() - this.state.exam.startTime) / 1000)
      : 45 * 60;

    return {
      correctAnswers,
      totalQuestions: 40,
      timeTaken
    };
  };

  handleExamQuestionChange = (index: number) => {
    if (this.state.exam) {
      this.setState(prevState => ({
        ...prevState, 
        exam: {
          ...prevState.exam!,
          currentQuestionIndex: index
        }
      }));
    }
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
    if (this.state.mode === 'exam' && this.state.exam) {
      const nextIndex = this.state.exam.currentQuestionIndex + 1;
      if (nextIndex < 40) {
        this.handleExamQuestionChange(nextIndex);
      }
    } else if (this.state.selectedCategory) {
      const questions = this.getQuestions(this.state.selectedCategory);
      const currentIndex = Number(this.state.selectedQuestion);
      if (currentIndex < questions.length - 1) {
        this.setState({ selectedQuestion: String(currentIndex + 1) });
      }
    }
  };

  handlePrevious = () => {
    if (this.state.mode === 'exam' && this.state.exam) {
      const prevIndex = this.state.exam.currentQuestionIndex - 1;
      if (prevIndex >= 0) {
        this.handleExamQuestionChange(prevIndex);
      }
    } else {
      const currentIndex = Number(this.state.selectedQuestion);
      if (currentIndex > 0) {
        this.setState({ selectedQuestion: String(currentIndex - 1) });
      }
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
    if (this.state.mode === 'exam' && this.state.exam) {
      const questionKey = `exam-${this.state.exam.currentQuestionIndex}`;
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
    } else if (this.state.selectedCategory) {
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
    if (this.state.mode === 'exam' && this.state.exam) {
      const currentQuestion = this.state.exam.questions[this.state.exam.currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.answer;
      
      const questionKey = `exam-${this.state.exam.currentQuestionIndex}`;
      
      this.setState(prevState => ({
        answeredQuestions: {
          ...prevState.answeredQuestions,
          [questionKey]: {
            isAnswered: true,
            isCorrect,
            selectedAnswer
          }
        }
      }));
    } else if (this.state.selectedCategory) {
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
        if (this.state.mode === 'category-test') {
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
    if (this.state.mode === 'exam') {
      this.setState(prevState => ({
        exam: {
          ...prevState.exam!,
          isComplete: true
        },
        showResults: true
      }));
    } else if (this.state.mode === 'category-test') {
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
      showResults: false,
      exam: null
    });
  };

  handleBackToModeSelection = () => {
    this.setState({
      mode: null,
      selectedCategory: null,
      selectedQuestion: "0",
      answeredQuestions: {},
      testResults: {},
      showResults: false,
      exam: null
    });
  };

  reviewExamQuestions = () => {
    if (this.state.exam) {
      this.setState(prevState => ({
        ...prevState,  // Include all existing state
        showResults: false,
        exam: {
          ...prevState.exam!,
          isReview: true
        }
      }));
    }
  };

  renderExamMode = () => {
    if (!this.state.exam) return null;

    const { questions, currentQuestionIndex, isComplete, isReview } = this.state.exam;
    const currentQuestion = questions[currentQuestionIndex];
    const questionKey = `exam-${currentQuestionIndex}`;
    const answerState = this.state.answeredQuestions[questionKey];

    if (isComplete && !isReview && this.state.showResults) {
      return this.renderResults();
    }

    return (
      <div className="exam-mode-container">
        {!isReview && (
          <ExamTimer
            onTimeUp={this.handleExamTimeUp}
            totalMinutes={EXAM_TIME_MINUTES}
          />
        )}
        <Question
          mode={isReview ? "review" : "exam"}
          heading={currentQuestion.heading}
          ques={currentQuestion.question}
          image={this.getImage(currentQuestion.image ?? '')}
          q1={currentQuestion.questions[0]}
          q2={currentQuestion.questions[1]}
          q3={currentQuestion.questions[2]}
          q4={currentQuestion.questions[3]}
          explanation={currentQuestion.explanation}
          onNext={this.handleNext}
          onPrevious={this.handlePrevious}
          hasNext={currentQuestionIndex < questions.length - 1}
          hasPrevious={currentQuestionIndex > 0}
          onAnswerSelect={this.handleAnswerSelection}
          onAnswerSubmit={this.handleAnswerSubmit}
          isCorrect={answerState?.isCorrect ?? null}
          isAnswered={answerState?.isAnswered ?? false}
          selectedAnswer={answerState?.selectedAnswer}
          onQuit={isReview ? this.handleBackToExamResults : this.handleQuit}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onQuestionSelect={this.handleExamQuestionChange}
          answeredQuestions={questions.map((_, index) => {
            const state = this.state.answeredQuestions[`exam-${index}`];
            return {
              isAnswered: state?.isAnswered ?? false,
              isCorrect: state?.isCorrect ?? false
            };
          })}
          correctAnswer={currentQuestion.answer}
          flaggedQuestions={this.state.exam.flaggedQuestions}
          onFlagQuestion={this.handleFlagQuestion}
        />
      </div>
    );
  };

  renderResults = () => {
    if (this.state.mode === 'exam') {
      const results = this.calculateExamResults();
      if (!results) return null;

      return (
        <ExamResults
          correctAnswers={results.correctAnswers}
          totalQuestions={results.totalQuestions}
          timeTaken={results.timeTaken}
          onBackToMenu={this.handleBackToModeSelection}
          onReviewQuestions={this.reviewExamQuestions} // Add the review handler
        />
      );
    }

    return (
      <TestResults
        results={this.state.testResults}
        onReviewWrongAnswers={this.reviewWrongAnswers}
        onRestartTest={this.handleRestartTest}
      />
    );
  };

  reviewWrongAnswers = (category: string, wrongAnswers: string[]) => {
    const questions = this.getQuestions(category);
    const firstWrongQuestionIndex = questions.findIndex(q => wrongAnswers.includes(q.id));
    
    this.setState({
      showResults: false,
      selectedCategory: category,
      selectedQuestion: String(Math.max(0, firstWrongQuestionIndex))
    });
  };

  handleBackToExamResults = () => {
    this.setState(prevState => ({
      ...prevState,  // Include all existing state
      showResults: true,
      exam: {
        ...prevState.exam!,
        isReview: false
      }
    }));
  };

  render() {
    const { mode, selectedCategory, showResults } = this.state;

    if (!mode) {
      return <ModeSelection onSelectMode={this.handleModeSelect} />;
    }

    if (mode === 'exam') {
      return (
        <div className="App exam-mode">
          <div className="mode-indicator exam">
            Exam Mode
          </div>
          {this.renderExamMode()}
        </div>
      );
    }

    if (showResults) {
      return this.renderResults();
    }

    const categoryList = this.getCategories();
    let categories = null;
    let questionList: Item[] | null = null;

    if (!selectedCategory) {
      categories = (
        <div>
          <h2>Select a Category</h2>
          {mode === 'category-test' && (
            <p className="test-mode-info">
              Category Test Mode: Your answers will be scored and you'll receive a final result
            </p>
          )}
          <div className="category-list">
            {categoryList.map(categ => {
              const categoryProgress = mode === 'category-test' && this.state.testResults[categ] 
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

    if (selectedCategory && (!questionList || questionList.length === 0)) {
      console.error('No questions available for category:', selectedCategory);
    }

    return (
      <div className={`App ${mode}-mode`}>
        <div className="mode-indicator">
          {mode === 'practice' ? 'Practice Mode' : 'Category Test Mode'}
        </div>
        {categories}
        {questionView}
      </div>
    );
  }
}

export default App;