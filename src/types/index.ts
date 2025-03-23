// Question item from data.json
export interface Item {
  question: string;
  heading: string;
  explanation: string;
  questions: string[];
  answer: string;
  id: string;
  update: string;
  image?: string;
}

// Answer state for a specific question
export interface AnswerState {
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer?: string;
}

// Test results by category
export interface TestResults {
  [category: string]: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: string[];
    availableQuestions: number;
  };
}

// Exam state
export interface ExamState {
  questions: Item[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isComplete: boolean;
  startTime?: number;
  flaggedQuestions: number[];
  isReview?: boolean;
}

// Application state
export interface AppState {
  mode: "practice" | "category-test" | "exam" | null;
  selectedCategory: string | null;
  selectedQuestion: string;
  answeredQuestions: { [key: string]: AnswerState };
  testResults: TestResults;
  showResults: boolean;
  exam: ExamState | null;
}

// Shared question components
export interface AnsweredQuestion {
  isAnswered: boolean;
  isCorrect: boolean;
}

// Application modes
export type AppMode = "practice" | "category-test" | "exam" | null;

// Map of question keys to answer states
export interface AnsweredQuestions {
  [key: string]: AnswerState;
}
