export type QuestionMode = "exam" | "practice" | "default";

export interface AnsweredQuestion {
  isAnswered: boolean;
  isCorrect: boolean;
}

export interface QuestionNavProps {
  mode: "practice" | "category-test" | "exam";
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
