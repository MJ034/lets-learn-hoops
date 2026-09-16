export interface QuizHistoryEntry {
  score: number;
  total_questions: number;
  completed_at: string;
  quiz_title: string;
  lesson_title: string;
}

export interface ProgressSummary {
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  quizHistory: QuizHistoryEntry[];
}