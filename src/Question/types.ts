export type QuestionMode = "exam" | "practice" | "default";

export interface QuestionNavProps {
  currentQuestion: number;
  totalQuestions: number;
  onQuestionSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  answeredQuestions: {
    isAnswered: boolean;
    isCorrect: boolean;
  }[];
  mode: "practice" | "category-test" | "exam";
}
