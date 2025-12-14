import { QuizResponse, AnswerRequest, AnswerResponse } from '../types/quiz';
import {
  getRandomDefaultQuiz,
  getRandomDefaultQuizzes,
  checkDefaultAnswer,
  DefaultQuiz,
} from '../data/defaultQuizzes';

// API URL 끝의 슬래시 제거 (있는 경우)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:12233').replace(/\/$/, '');

console.log('[API] Base URL:', API_BASE_URL);

// 오프라인 모드 상태 관리
let isOfflineMode = false;
let offlineQuizzes: DefaultQuiz[] = [];

export function getIsOfflineMode(): boolean {
  return isOfflineMode;
}

export function setOfflineMode(offline: boolean): void {
  isOfflineMode = offline;
  if (!offline) {
    offlineQuizzes = [];
  }
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
    console.error('[API] Error:', errorMessage, 'Status:', response.status, 'Data:', error);
    throw new QuizApiError(
      errorMessage,
      response.status,
      error
    );
  }
  return response.json();
}

export const quizApi = {
  // 랜덤 퀴즈 여러 개 가져오기 (API 실패 시 기본 문제셋 사용)
  async getRandomQuizzes(count: number): Promise<{ quizzes: QuizResponse[]; isOffline: boolean }> {
    try {
      console.log(`[API] Fetching ${count} random quizzes...`);
      const promises = Array.from({ length: count }, () => this.getRandomQuiz());
      const quizzes = await Promise.all(promises);
      console.log(`[API] Successfully fetched ${count} quizzes from API`);
      isOfflineMode = false;
      offlineQuizzes = [];
      return { quizzes, isOffline: false };
    } catch (error) {
      console.warn('[API] Failed to fetch quizzes from API, using default quiz set:', error);
      isOfflineMode = true;
      offlineQuizzes = getRandomDefaultQuizzes(count);
      console.log(`[API] Using ${offlineQuizzes.length} quizzes from default set`);
      return { quizzes: offlineQuizzes, isOffline: true };
    }
  },

  // 랜덤 퀴즈 가져오기
  async getRandomQuiz(): Promise<QuizResponse> {
    const url = `${API_BASE_URL}/quizzes/random`;
    console.log('[API] GET', url);
    try {
      const response = await fetch(url);
      return handleResponse<QuizResponse>(response);
    } catch (error) {
      console.error('[API] getRandomQuiz failed:', error);
      throw error;
    }
  },

  // 답변 제출하기 (오프라인 모드면 로컬에서 체크)
  async submitAnswer(request: AnswerRequest): Promise<AnswerResponse> {
    // 오프라인 모드인 경우 로컬에서 답변 체크
    if (isOfflineMode) {
      console.log('[API] Offline mode - checking answer locally:', request);
      const result = checkDefaultAnswer(request.quiz_id, request.user_answer);
      if (result) {
        console.log('[API] Local answer result:', result);
        return result;
      }
      // 로컬에서 찾을 수 없는 경우 (발생하면 안 됨)
      throw new QuizApiError('퀴즈를 찾을 수 없습니다.');
    }

    const url = `${API_BASE_URL}/quizzes/answer`;
    console.log('[API] POST', url, request);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      return handleResponse<AnswerResponse>(response);
    } catch (error) {
      console.error('[API] submitAnswer failed:', error);
      throw error;
    }
  },
};
