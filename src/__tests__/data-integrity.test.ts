import { describe, it, expect } from 'vitest';
import { DEFAULT_QUIZZES, getRandomDefaultQuiz, getRandomDefaultQuizzes, checkDefaultAnswer } from '../data/defaultQuizzes';
import { QUIZ_COUNT, TIMER_DURATION, ANSWER_COLORS } from '../constants/game';

describe('DEFAULT_QUIZZES (오프라인 퀴즈셋)', () => {
  it('충분한 수의 퀴즈가 있음', () => {
    expect(DEFAULT_QUIZZES.length).toBeGreaterThanOrEqual(QUIZ_COUNT);
  });

  it('모든 퀴즈에 필수 필드가 있음', () => {
    for (const quiz of DEFAULT_QUIZZES) {
      expect(quiz.id).toBeGreaterThan(0);
      expect(quiz.question.length).toBeGreaterThan(0);
      expect(quiz.options).toHaveLength(4);
      expect(quiz.correct_answer).toBeGreaterThanOrEqual(0);
      expect(quiz.correct_answer).toBeLessThanOrEqual(3);
      expect(quiz.explanation.length).toBeGreaterThan(0);
      expect(quiz.category.length).toBeGreaterThan(0);
    }
  });

  it('퀴즈 ID가 모두 고유함', () => {
    const ids = DEFAULT_QUIZZES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getRandomDefaultQuiz', () => {
  it('유효한 퀴즈 반환', () => {
    const quiz = getRandomDefaultQuiz();
    expect(quiz).toBeDefined();
    expect(quiz.id).toBeGreaterThan(0);
    expect(quiz.options).toHaveLength(4);
  });
});

describe('getRandomDefaultQuizzes', () => {
  it('요청 수만큼 퀴즈 반환', () => {
    const quizzes = getRandomDefaultQuizzes(5);
    expect(quizzes).toHaveLength(5);
  });

  it('QUIZ_COUNT만큼 요청해도 동작', () => {
    const quizzes = getRandomDefaultQuizzes(QUIZ_COUNT);
    expect(quizzes).toHaveLength(QUIZ_COUNT);
  });
});

describe('checkDefaultAnswer', () => {
  it('정답 제출 시 is_correct: true', () => {
    const quiz = DEFAULT_QUIZZES[0];
    const result = checkDefaultAnswer(quiz.id, quiz.correct_answer);
    expect(result).toBeDefined();
    expect(result!.is_correct).toBe(true);
    expect(result!.correct_answer).toBe(quiz.correct_answer);
  });

  it('오답 제출 시 is_correct: false', () => {
    const quiz = DEFAULT_QUIZZES[0];
    const wrong = (quiz.correct_answer + 1) % 4;
    const result = checkDefaultAnswer(quiz.id, wrong);
    expect(result).toBeDefined();
    expect(result!.is_correct).toBe(false);
  });

  it('존재하지 않는 quiz_id는 null 반환', () => {
    const result = checkDefaultAnswer(99999, 0);
    expect(result).toBeNull();
  });
});

describe('게임 상수', () => {
  it('QUIZ_COUNT는 양수', () => {
    expect(QUIZ_COUNT).toBeGreaterThan(0);
  });

  it('TIMER_DURATION는 양수', () => {
    expect(TIMER_DURATION).toBeGreaterThan(0);
  });

  it('ANSWER_COLORS는 4개', () => {
    expect(ANSWER_COLORS).toHaveLength(4);
  });
});
