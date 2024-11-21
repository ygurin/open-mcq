import React, { Component } from 'react';
import './App.css';

import Data from './data.json';

import CategoryButton from './CategoryButton/CategoryButton';
import QuestionButton from './QuestionButton/QuestionButton';
import Question from './Question/Question';

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
  selectedAnswer?: string;  // Added to track the selected answer
}

interface AppState {
  selectedCategory: string | null;
  selectedQuestion: string;
  answeredQuestions: { [key: string]: AnswerState };
}

class App extends Component<object, AppState> {
  state: AppState = {
    selectedCategory: null,
    selectedQuestion: "0",
    answeredQuestions: {}
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

  getQuestions = (categ: string) => {
    const items: Item[] = Data;
    return items.filter(item => item.heading === categ);
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ selectedQuestion: "0" });
    this.setState({ selectedCategory: e.currentTarget.value });
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
    } catch (e) {
      return "";
    }
  };

  handleAnswerSelection = (selectedAnswer: string) => {
    if (this.state.selectedCategory) {
      const questionKey = `${this.state.selectedCategory}-${this.state.selectedQuestion}`;
      const existingState = this.state.answeredQuestions[questionKey];
      
      // Only update if not already answered
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
    }
  };

  isQuestionAnswered = (category: string, questionIndex: string): AnswerState | undefined => {
    const questionKey = `${category}-${questionIndex}`;
    return this.state.answeredQuestions[questionKey];
  };

  handleQuit = () => {
    this.setState({
      selectedCategory: null,
      selectedQuestion: "0"
    });
  };

  render() {
    const categoryList = this.getCategories();
    let categories = null;
    let questionList: Item[] | null = null;

    if (this.state.selectedCategory === null) {
      categories = (
        <div>
          <p>Select a Category</p>
          {categoryList.map(categ => {
            return <CategoryButton
              key={categ}
              getCategory={this.handleClick}
              text={categ} />;
          })}
        </div>
      );
    } else {
      questionList = this.getQuestions(this.state.selectedCategory);
    }

    let questionButtons = null;
    if (this.state.selectedCategory !== null && questionList !== null) {
      questionButtons = (
        <div>
          {[...Array(questionList.length).keys()].map(key => {
            const answerState = this.isQuestionAnswered(
              this.state.selectedCategory!,
              String(key)
            );
            return <QuestionButton
              key={key}
              number={key}
              isSelected={String(key) === this.state.selectedQuestion}
              getQuestion={this.questionClickHandler}
              isAnswered={answerState?.isAnswered}
              isCorrect={answerState?.isCorrect} />;
          })}
        </div>
      );
    }

    let questionView = null;
    if (this.state.selectedCategory !== null && questionList !== null) {
      const currentIndex = Number(this.state.selectedQuestion);
      const answerState = this.isQuestionAnswered(
        this.state.selectedCategory,
        this.state.selectedQuestion
      );
      questionView = (
        <div>
          <Question
            heading={questionList[currentIndex].heading}
            ques={questionList[currentIndex].question}
            image={this.getImage(questionList[currentIndex].image ?? '')}
            q1={questionList[currentIndex].questions[0]}
            q2={questionList[currentIndex].questions[1]}
            q3={questionList[currentIndex].questions[2]}
            q4={questionList[currentIndex].questions[3]}
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
          />
        </div>
      );
    }

    return (
      <div className="App">
        {categories}
        {questionButtons}
        {questionView}
      </div>
    );
  }
}

export default App;