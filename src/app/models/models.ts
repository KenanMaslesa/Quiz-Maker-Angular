export interface Quiz {
  id: number;
  name: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
}
