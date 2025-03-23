export type QuestionMode = "practice" | "category-test" | "exam" | "review";

export interface AnsweredQuestion {
  isAnswered: boolean;
  isCorrect: boolean;
}

export interface QuestionNavProps {
  mode: "practice" | "category-test" | "exam" | "review";
  currentQuestion: number;
  totalQuestions: number;
  onQuestionSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  answeredQuestions: AnsweredQuestion[];
  flaggedQuestions?: number[];
}
