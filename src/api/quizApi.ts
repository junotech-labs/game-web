import { FullQuizResponse, AnswerRequest, AnswerResponse } from '../types/quiz';
import {
  getRandomDefaultQuizzes,
  checkDefaultAnswer,
} from '../data/defaultQuizzes';

// API URL 끝의 슬래시 제거 (있는 경우)
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

// 오프라인 모드 상태 관리
let isOfflineMode = false;

export function setOfflineMode(offline: boolean): void {
  isOfflineMode = offline;
}

export class QuizApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'QuizApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.detail || error.message || `HTTP Error: ${response.status}`;
    throw new QuizApiError(
      errorMessage,
      response.status,
      error
    );
  }
  return response.json();
}

// --- Session API (fire-and-forget, 실패해도 게임에 영향 없음) ---

async function fireAndForget<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export const sessionApi = {
  async createSession(userHash?: string): Promise<string | null> {
    return fireAndForget(async () => {
      const url = `${API_BASE_URL}/sessions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_hash: userHash || null }),
      });
      const data = await handleResponse<{ session_id: string }>(res);
      return data.session_id;
    });
  },

  async submitAnswer(
    sessionId: string,
    request: { quiz_id: number; user_answer: number; category: string; time_spent_ms: number; question_index: number }
  ): Promise<void> {
    fireAndForget(async () => {
      const url = `${API_BASE_URL}/sessions/${sessionId}/answers`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
    });
  },

  async completeSession(
    sessionId: string,
    stats: { correct_count: number; accuracy: number }
  ): Promise<void> {
    fireAndForget(async () => {
      const url = `${API_BASE_URL}/sessions/${sessionId}/complete`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
    });
  },
};

// --- Play Limit API ---

export interface PlayStatus {
  free_remaining: number;
  bonus_remaining: number;
  total_remaining: number;
}

export const playsApi = {
  async getRemaining(userHash: string): Promise<PlayStatus | null> {
    return fireAndForget(async () => {
      const url = `${API_BASE_URL}/plays/${userHash}`;
      const res = await fetch(url);
      return handleResponse<PlayStatus>(res);
    });
  },

  async consume(userHash: string): Promise<{ success: boolean } | null> {
    return fireAndForget(async () => {
      const url = `${API_BASE_URL}/plays/${userHash}/consume`;
      const res = await fetch(url, { method: 'POST' });
      return handleResponse<{ success: boolean }>(res);
    });
  },

  async reward(userHash: string, source: 'ad' | 'share' | 'invite'): Promise<PlayStatus | null> {
    return fireAndForget(async () => {
      const url = `${API_BASE_URL}/plays/reward`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_hash: userHash, source }),
      });
      return handleResponse<PlayStatus>(res);
    });
  },
};

// --- Quiz API ---

// 로컬 퀴즈 캐시 (정답 포함) — 로컬 채점용
let quizCache: Map<number, FullQuizResponse> = new Map();

// 로컬에서 채점 (서버 불필요)
export function gradeLocally(quizId: number, userAnswer: number): AnswerResponse | null {
  // 온라인 캐시에서 찾기
  const cached = quizCache.get(quizId);
  if (cached) {
    return {
      is_correct: userAnswer === cached.correct_answer,
      correct_answer: cached.correct_answer,
      explanation: cached.explanation,
      user_answer: userAnswer,
    };
  }
  // 오프라인 기본 퀴즈에서 찾기
  return checkDefaultAnswer(quizId, userAnswer);
}

export const quizApi = {
  // 랜덤 퀴즈 여러 개 가져오기 (정답 포함, API 실패 시 기본 문제셋 사용)
  async getRandomQuizzes(count: number): Promise<{ quizzes: FullQuizResponse[]; isOffline: boolean }> {
    try {
      const promises = Array.from({ length: count }, () => this.getRandomQuizFull());
      const quizzes = await Promise.all(promises);
      isOfflineMode = false;
      quizCache = new Map();
      quizzes.forEach(q => quizCache.set(q.id, q));
      return { quizzes, isOffline: false };
    } catch {
      isOfflineMode = true;
      // DefaultQuiz는 FullQuizResponse와 동일 구조 (QuizResponse + correct_answer + explanation)
      const quizzes: FullQuizResponse[] = getRandomDefaultQuizzes(count);
      quizCache = new Map();
      quizzes.forEach(q => quizCache.set(q.id, q));
      return { quizzes, isOffline: true };
    }
  },

  // 정답/해설 포함 랜덤 퀴즈 가져오기
  async getRandomQuizFull(): Promise<FullQuizResponse> {
    const url = `${API_BASE_URL}/quizzes/random/full`;
    const response = await fetch(url);
    return handleResponse<FullQuizResponse>(response);
  },

  // 답변을 서버에 제출 (트래킹 목적, fire-and-forget)
  submitAnswerToServer(request: AnswerRequest): void {
    fireAndForget(async () => {
      const url = `${API_BASE_URL}/quizzes/answer`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
    });
  },
};
