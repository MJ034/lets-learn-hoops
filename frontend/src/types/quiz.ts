export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  quiz: Quiz;
}

export interface SubmitAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizAnswerReview {
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string | null;
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string | null;
  answers: QuizAnswerReview[];
}

export interface SubmitQuizResponse {
  result: QuizResult;
}