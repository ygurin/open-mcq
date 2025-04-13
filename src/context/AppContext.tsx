import React, { createContext, useState, ReactNode } from 'react';
import { AppMode, AnsweredQuestions, TestResults, ExamState } from '../types';

export interface AppContextType {
  // State
  mode: AppMode;
  selectedCategory: string | null;
  selectedQuestion: string;
  answeredQuestions: AnsweredQuestions;
  testResults: TestResults;
  showResults: boolean;
  exam: ExamState | null;
  
  // Actions
  setMode: (mode: AppMode) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedQuestion: (question: string) => void;
  setAnsweredQuestions: (questions: AnsweredQuestions) => void;
  setTestResults: (results: TestResults) => void;
  setShowResults: (show: boolean) => void;
  setExam: (exam: ExamState | null) => void;
  
  // Complex state updates
  updateAnsweredQuestion: (key: string, state: Partial<AnsweredQuestions[string]>) => void;
  updateTestResult: (category: string, update: Partial<TestResults[string]>) => void;
  updateExam: (update: Partial<ExamState>) => void;
  
  // Reset
  resetState: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState("0");
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>({});
  const [testResults, setTestResults] = useState<TestResults>({});
  const [showResults, setShowResults] = useState(false);
  const [exam, setExam] = useState<ExamState | null>(null);

  // Helper for updating a specific answered question
  const updateAnsweredQuestion = (key: string, state: Partial<AnsweredQuestions[string]>) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...state
      }
    }));
  };

  // Helper for updating a specific test result
  const updateTestResult = (category: string, update: Partial<TestResults[string]>) => {
    setTestResults(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        ...update
      }
    }));
  };

  // Helper for updating the exam state
  const updateExam = (update: Partial<ExamState>) => {
    setExam(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...update
      };
    });
  };

  const resetState = () => {
    setMode(null);
    setSelectedCategory(null);
    setSelectedQuestion("0");
    setAnsweredQuestions({});
    setTestResults({});
    setShowResults(false);
    setExam(null);
  };

  // all state and functions
  const contextValue: AppContextType = {
    mode,
    selectedCategory,
    selectedQuestion,
    answeredQuestions,
    testResults,
    showResults,
    exam,
    
    // State setters
    setMode,
    setSelectedCategory,
    setSelectedQuestion,
    setAnsweredQuestions,
    setTestResults,
    setShowResults,
    setExam,
    
    // Complex state updates
    updateAnsweredQuestion,
    updateTestResult,
    updateExam,
    
    resetState
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};