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
}
