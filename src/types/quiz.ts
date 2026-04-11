// API Response Types
export interface QuizResponse {
  id: number;
  question: string;
  options: string[];
  category: string;
}

// 정답/해설 포함 퀴즈 (로컬 채점용)
export interface FullQuizResponse extends QuizResponse {
  correct_answer: number;
  explanation: string;
}

export interface AnswerRequest {
  quiz_id: number;
  user_answer: number;
}

export interface AnswerResponse {
  is_correct: boolean;
  correct_answer: number;
  explanation: string;
  user_answer: number;
}


