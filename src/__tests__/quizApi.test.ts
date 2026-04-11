import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quizApi, sessionApi, playsApi, gradeLocally, QuizApiError, setOfflineMode } from '../api/quizApi';

// fetch 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  setOfflineMode(false);
});

describe('quizApi', () => {
  describe('getRandomQuizFull', () => {
    it('성공 시 정답 포함 퀴즈 반환', async () => {
      const quiz = { id: 1, question: 'test', options: ['a', 'b', 'c', 'd'], category: '지리', correct_answer: 0, explanation: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(quiz),
      });

      const result = await quizApi.getRandomQuizFull();
      expect(result.correct_answer).toBe(0);
      expect(result.explanation).toBe('test');
    });

    it('API 실패 시 에러 throw', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Server Error' }),
      });

      await expect(quizApi.getRandomQuizFull()).rejects.toThrow(QuizApiError);
    });
  });

  describe('getRandomQuizzes', () => {
    it('성공 시 정답 포함 퀴즈 반환, 오프라인 모드 false', async () => {
      const quiz = { id: 1, question: 'test', options: ['a', 'b', 'c', 'd'], category: '지리', correct_answer: 0, explanation: 'x' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(quiz),
      });

      const { quizzes, isOffline } = await quizApi.getRandomQuizzes(3);
      expect(quizzes).toHaveLength(3);
      expect(isOffline).toBe(false);
      expect(quizzes[0].correct_answer).toBeDefined();
    });

    it('API 실패 시 오프라인 모드로 전환 + 기본 퀴즈 반환', async () => {
      mockFetch.mockRejectedValue(new Error('Network Error'));

      const { quizzes, isOffline } = await quizApi.getRandomQuizzes(5);
      expect(isOffline).toBe(true);
      expect(quizzes.length).toBeGreaterThan(0);
    });
  });

  describe('gradeLocally', () => {
    it('캐시된 퀴즈에서 로컬 채점', async () => {
      const quiz = { id: 99, question: 'q', options: ['a', 'b', 'c', 'd'], category: 'c', correct_answer: 2, explanation: 'exp' };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(quiz) });
      await quizApi.getRandomQuizzes(1);

      const correct = gradeLocally(99, 2);
      expect(correct?.is_correct).toBe(true);

      const wrong = gradeLocally(99, 0);
      expect(wrong?.is_correct).toBe(false);
      expect(wrong?.correct_answer).toBe(2);
    });

    it('오프라인 기본 퀴즈에서도 채점 가능', async () => {
      mockFetch.mockRejectedValue(new Error('offline'));
      const { quizzes } = await quizApi.getRandomQuizzes(5);

      const result = gradeLocally(quizzes[0].id, 0);
      expect(result).toBeDefined();
      expect('is_correct' in result!).toBe(true);
    });
  });

  describe('submitAnswerToServer', () => {
    it('fire-and-forget로 서버에 전송 (에러 무시)', () => {
      mockFetch.mockRejectedValue(new Error('server down'));
      // 에러 throw하지 않음
      expect(() => quizApi.submitAnswerToServer({ quiz_id: 1, user_answer: 0 })).not.toThrow();
    });
  });
});

describe('sessionApi', () => {
  describe('createSession', () => {
    it('성공 시 session_id 반환', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ session_id: 'uuid-123' }),
      });

      const id = await sessionApi.createSession();
      expect(id).toBe('uuid-123');
    });

    it('user_hash 포함하여 전송', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ session_id: 'uuid-456' }),
      });

      await sessionApi.createSession('my-hash');
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.user_hash).toBe('my-hash');
    });

    it('실패 시 null 반환 (fire-and-forget)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      const id = await sessionApi.createSession();
      expect(id).toBeNull();
    });
  });

  describe('submitAnswer', () => {
    it('question_index 포함하여 전송', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      await sessionApi.submitAnswer('sess-1', {
        quiz_id: 1,
        user_answer: 0,
        category: '지리',
        time_spent_ms: 3000,
        question_index: 2,
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.question_index).toBe(2);
      expect(body.time_spent_ms).toBe(3000);
    });

    it('실패해도 에러 throw하지 않음', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      // fire-and-forget이므로 에러 없이 완료
      await sessionApi.submitAnswer('sess-1', {
        quiz_id: 1, user_answer: 0, category: 'test', time_spent_ms: 100, question_index: 0,
      });
    });
  });

  describe('completeSession', () => {
    it('정상 호출', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      await sessionApi.completeSession('sess-1', { correct_count: 7, accuracy: 70 });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.correct_count).toBe(7);
      expect(body.accuracy).toBe(70);
    });

    it('실패해도 에러 throw하지 않음', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      await sessionApi.completeSession('sess-1', { correct_count: 5, accuracy: 50 });
    });
  });
});

describe('playsApi', () => {
  describe('getRemaining', () => {
    it('남은 플레이 수 반환', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ free_remaining: 2, bonus_remaining: 1, total_remaining: 3 }),
      });

      const result = await playsApi.getRemaining('user-hash');
      expect(result?.total_remaining).toBe(3);
      expect(result?.free_remaining).toBe(2);
    });

    it('실패 시 null 반환', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      const result = await playsApi.getRemaining('user-hash');
      expect(result).toBeNull();
    });
  });

  describe('consume', () => {
    it('플레이 차감 성공', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await playsApi.consume('user-hash');
      expect(result?.success).toBe(true);
    });

    it('횟수 소진 시 success: false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, reason: 'no_plays_remaining' }),
      });

      const result = await playsApi.consume('user-hash');
      expect(result?.success).toBe(false);
    });
  });

  describe('reward', () => {
    it('보너스 플레이 추가', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ free_remaining: 0, bonus_remaining: 1, total_remaining: 1 }),
      });

      const result = await playsApi.reward('user-hash', 'ad');
      expect(result?.bonus_remaining).toBe(1);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.source).toBe('ad');
      expect(body.user_hash).toBe('user-hash');
    });
  });
});

describe('QuizApiError', () => {
  it('status와 data를 포함', () => {
    const err = new QuizApiError('test error', 404, { detail: 'not found' });
    expect(err.message).toBe('test error');
    expect(err.status).toBe(404);
    expect(err.data).toEqual({ detail: 'not found' });
    expect(err.name).toBe('QuizApiError');
  });
});
