// 게임 설정 상수
export const QUIZ_COUNT = 10; // 총 퀴즈 개수
export const TIMER_DURATION = 10; // 퀴즈 제한 시간 (초)
export const CORRECT_ANSWER_DELAY = 2500; // 정답 후 자동 전환 시간 (ms)
export const WRONG_ANSWER_DELAY = 3000; // 오답 후 자동 전환 시간 (ms)
export const CONFETTI_DURATION = 3000; // Confetti 표시 시간 (ms)

// 답변 버튼 색상 (Kahoot 스타일)
export const ANSWER_COLORS = [
  'answer-btn-red',
  'answer-btn-blue',
  'answer-btn-yellow',
  'answer-btn-green',
] as const;

// 카테고리별 배경색 맵
export const CATEGORY_COLORS: Record<string, string> = {
  '지리': 'bg-teal-500',
  '과학': 'bg-green-500',
  '역사': 'bg-emerald-600',
  '수학': 'bg-lime-500',
  '일반상식': 'bg-cyan-500',
};

// 기본 카테고리 색상
export const DEFAULT_CATEGORY_COLOR = 'bg-green-500';
