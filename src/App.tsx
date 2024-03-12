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
  image?: string; // Optional property
}

interface AppState {
  selectedCategory: string | null;
  selectedQuestion: string;
}

class App extends Component<{}, AppState> {

  state: AppState = {
    selectedCategory: null,
    selectedQuestion: "0"
  };

  getCategories = () => {
    let lookup: { [key: string]: number } = {};
    let items: Item[] = Data;
    let result: string[] = [];

    for (let item of items) {
      let name = item.heading;

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

  getImage = (path: string) => {
    try {
      return path.split('/').pop() || "";
    } catch (e) {
      return "";
    }
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
      console.log(this.state.selectedQuestion);
      console.log(questionList?.[Number(this.state.selectedQuestion)]);
    }

    let questionButtons = null;
    if (this.state.selectedCategory !== null && questionList !== null) {
      questionButtons = (
        <div>
          {[...Array(questionList.length).keys()].map(key => {
            return <QuestionButton
              key={key}
              number={key}
              getQuestion={this.questionClickHandler} />;
          })}
        </div>
      );
    }

    let questionView = null;
    if (this.state.selectedCategory !== null && questionList !== null) {
      questionView = (
        <div>
          {
            <Question
              heading={questionList[Number(this.state.selectedQuestion)].heading}
              ques={questionList[Number(this.state.selectedQuestion)].question}
              image={this.getImage(questionList[Number(this.state.selectedQuestion)].image ?? '')}
              q1={questionList[Number(this.state.selectedQuestion)].questions[0]}
              q2={questionList[Number(this.state.selectedQuestion)].questions[1]}
              q3={questionList[Number(this.state.selectedQuestion)].questions[2]}
              q4={questionList[Number(this.state.selectedQuestion)].questions[3]}
            />
          }
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
