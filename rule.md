# Quiz Game Web - 아키텍처 및 개발 표준

## 1. 프로젝트 개요

상식 퀴즈 게임 웹 애플리케이션으로 React + TypeScript + Vite + Tailwind CSS 기반으로 개발되었습니다.

---

## 2. 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| UI 프레임워크 | React | ^18.2.0 |
| 언어 | TypeScript | ^5.2.2 |
| 빌드 도구 | Vite | ^5.0.8 |
| CSS 프레임워크 | Tailwind CSS | ^3.3.6 |
| 배포 플랫폼 | Granite (Toss) | ^1.5.0 |

---

## 3. 디렉토리 구조

```
src/
├── api/                    # API 클라이언트 및 통신 로직
│   └── quizApi.ts
│
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── icons/             # SVG 아이콘 컴포넌트
│   │   ├── CheckIcon.tsx
│   │   ├── DiceIcon.tsx
│   │   └── ...
│   ├── screens/           # 화면 단위 컴포넌트
│   │   ├── MenuScreen.tsx
│   │   ├── PlayScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── Confetti.tsx       # 공통 UI 컴포넌트
│   └── Timer.tsx
│
├── constants/              # 상수 정의
│   └── game.ts            # 게임 관련 상수
│
├── hooks/                  # 커스텀 React 훅
│   └── useQuizGame.ts     # 게임 로직 훅
│
├── types/                  # TypeScript 타입 정의
│   ├── quiz.ts            # API 관련 타입
│   └── game.ts            # 게임 상태 관련 타입
│
├── utils/                  # 유틸리티 함수
│   └── quiz.ts            # 퀴즈 관련 헬퍼 함수
│
├── App.tsx                 # 루트 컴포넌트
├── main.tsx               # 엔트리 포인트
└── index.css              # 전역 스타일 및 애니메이션
```

### 3.1 디렉토리 역할 정의

| 디렉토리 | 역할 | 예시 |
|----------|------|------|
| `api/` | 외부 API 통신 로직, 에러 핸들링 | `quizApi.ts` |
| `components/` | 재사용 가능한 UI 컴포넌트 | `Timer.tsx`, `Confetti.tsx` |
| `components/icons/` | SVG 아이콘 컴포넌트 | `DiceIcon.tsx` |
| `components/screens/` | 화면 단위 컴포넌트 | `MenuScreen.tsx` |
| `constants/` | 불변 상수 값 | 게임 설정값, 색상 맵 |
| `hooks/` | 커스텀 React 훅 | `useQuizGame.ts` |
| `types/` | TypeScript 인터페이스 및 타입 | `QuizResponse` |
| `utils/` | 순수 함수, 헬퍼 | `getRankInfo()` |

---

## 4. 네이밍 컨벤션

### 4.1 파일명

| 분류 | 컨벤션 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase + `.tsx` | `Timer.tsx`, `MenuScreen.tsx` |
| 아이콘 | PascalCase + `Icon.tsx` | `DiceIcon.tsx`, `CheckIcon.tsx` |
| 훅 | camelCase + `use` 접두사 | `useQuizGame.ts` |
| API 클라이언트 | camelCase + `Api.ts` | `quizApi.ts` |
| 타입 정의 | camelCase + `.ts` | `quiz.ts`, `game.ts` |
| 유틸리티 | camelCase + `.ts` | `quiz.ts` |
| 상수 | camelCase + `.ts` | `game.ts` |
| 디렉토리 | lowercase | `components/`, `hooks/` |

### 4.2 변수/함수명

| 분류 | 컨벤션 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase | `function Timer()` |
| 함수 | camelCase | `handleAnswerClick()` |
| 상수 | SCREAMING_SNAKE_CASE | `QUIZ_COUNT`, `TIMER_DURATION` |
| 타입/인터페이스 | PascalCase | `QuizResponse`, `GameMode` |
| Props 인터페이스 | PascalCase + `Props` | `TimerProps`, `ConfettiProps` |
| Boolean 변수 | `is`, `has`, `should` 접두사 | `isAnswered`, `isLoading` |
| 이벤트 핸들러 | `handle` + 동작 | `handleClick`, `handleTimeout` |

### 4.3 CSS 클래스명

```css
/* 컴포넌트별 커스텀 클래스: kebab-case */
.answer-btn-red { }
.animate-confetti { }
.animate-bounce-subtle { }
```

---

## 5. 컴포넌트 설계 원칙

### 5.1 컴포넌트 크기 제한

- **단일 컴포넌트 최대 200줄** 권장
- 200줄 초과 시 하위 컴포넌트로 분리
- 화면 단위 컴포넌트는 `components/screens/`에 배치

### 5.2 컴포넌트 구조

```tsx
// 1. Import 순서
import { useState, useEffect } from 'react';        // React 내장
import { quizApi } from '../api/quizApi';          // 내부 모듈
import { QuizResponse } from '../types/quiz';       // 타입
import { Timer } from '../components/Timer';        // 컴포넌트
import { QUIZ_COUNT } from '../constants/game';     // 상수

// 2. Props 인터페이스 (컴포넌트 바로 위에 정의)
interface TimerProps {
  duration: number;
  onTimeout: () => void;
  isRunning: boolean;
}

// 3. 컴포넌트 정의
export function Timer({ duration, onTimeout, isRunning }: TimerProps) {
  // 3-1. 상태 정의
  const [timeLeft, setTimeLeft] = useState(duration);

  // 3-2. 효과
  useEffect(() => { /* ... */ }, []);

  // 3-3. 이벤트 핸들러
  const handleClick = () => { /* ... */ };

  // 3-4. 렌더링 헬퍼 (조건부 렌더링)
  const renderContent = () => { /* ... */ };

  // 3-5. 반환
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 5.3 Props 설계

```tsx
// Good: 필수/선택 구분, 기본값 활용
interface IconProps {
  className?: string;  // 선택적 prop에 기본값 제공
}

export function DiceIcon({ className = "w-6 h-6" }: IconProps) {
  return <svg className={className}>...</svg>;
}

// Good: 이벤트 핸들러는 콜백 형태
interface ButtonProps {
  onClick: () => void;      // 반환값 void
  onComplete?: () => void;  // 선택적 콜백
}
```

### 5.4 공통 타입 정의

아이콘 컴포넌트 등 공통 Props는 `types/common.ts`에 정의:

```tsx
// types/common.ts
export interface IconProps {
  className?: string;
}
```

---

## 6. 상태 관리 원칙

### 6.1 상태 관리 전략

| 상태 유형 | 관리 방식 | 예시 |
|-----------|-----------|------|
| 로컬 UI 상태 | `useState` | `loading`, `error` |
| 파생 상태 | 계산 (memo 불필요) | `accuracy = correct / total` |
| 복잡한 게임 로직 | 커스텀 훅 | `useQuizGame()` |
| 전역 상태 (필요시) | Context API | 테마, 사용자 설정 |

### 6.2 커스텀 훅 패턴

```tsx
// hooks/useQuizGame.ts
export function useQuizGame() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [quizQueue, setQuizQueue] = useState<QuizResponse[]>([]);
  // ... 상태 정의

  const startGame = async () => { /* ... */ };
  const submitAnswer = async (index: number) => { /* ... */ };
  // ... 액션 함수

  return {
    // 상태
    gameMode,
    currentQuiz,
    isLoading,
    error,
    // 액션
    startGame,
    submitAnswer,
    goToNextQuestion,
  };
}
```

### 6.3 상태 초기화 패턴

```tsx
// Good: 관련 상태 그룹화하여 리셋
const resetGameState = () => {
  setGameMode('menu');
  setCurrentQuiz(null);
  setQuizQueue([]);
  setQuizHistory([]);
  setError(null);
};
```

---

## 7. API 통신 규칙

### 7.1 API 클라이언트 구조

```tsx
// api/quizApi.ts

// 커스텀 에러 클래스
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

// 응답 핸들러 (재사용)
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new QuizApiError(error.message, response.status, error);
  }
  return response.json();
}

// API 객체
export const quizApi = {
  async getRandomQuiz(): Promise<QuizResponse> { /* ... */ },
  async submitAnswer(request: AnswerRequest): Promise<AnswerResponse> { /* ... */ },
};
```

### 7.2 API 호출 패턴

```tsx
// Good: try-catch 패턴 + 사용자 친화적 에러 메시지
try {
  const result = await quizApi.getRandomQuiz();
  setData(result);
} catch (err) {
  const errorMessage = err instanceof QuizApiError
    ? `${err.message} (Status: ${err.status})`
    : err instanceof Error
      ? err.message
      : '서버에 연결할 수 없습니다.';
  setError(errorMessage);
}
```

### 7.3 로깅 규칙

```tsx
// 모듈별 prefix 사용
console.log('[API] GET', url);
console.log('[App] Loading quizzes...');
console.error('[API] Error:', errorMessage);
```

---

## 8. 타입 정의 규칙

### 8.1 타입 파일 구조

```tsx
// types/quiz.ts - API 관련 타입
export interface QuizResponse {
  id: number;
  question: string;
  options: string[];
  category: string;
}

export interface AnswerRequest {
  quiz_id: number;
  user_answer: number;
}

// types/game.ts - 게임 로직 관련 타입
export type GameMode = 'menu' | 'playing' | 'result';

export interface RankInfo {
  title: string;
  character: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
```

### 8.2 타입 정의 원칙

- API 응답/요청 타입은 `types/` 디렉토리에 정의
- Props 인터페이스는 컴포넌트 파일 내 정의 (재사용 시 export)
- Union 타입은 `type` 사용, 객체 구조는 `interface` 사용

```tsx
// Union 타입
export type GameMode = 'menu' | 'playing' | 'result';

// 객체 구조
export interface QuizResponse {
  id: number;
  question: string;
}
```

---

## 9. 스타일링 규칙

### 9.1 Tailwind CSS 사용 원칙

```tsx
// Good: Tailwind 유틸리티 클래스 사용
<button className="bg-gradient-to-r from-green-500 to-emerald-500
                   text-white font-bold py-4 px-6 rounded-xl
                   hover:from-green-600 hover:to-emerald-600
                   transition-all transform hover:scale-105">
  시작하기
</button>

// Good: 조건부 클래스는 템플릿 리터럴
<div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
```

### 9.2 커스텀 CSS 클래스

반복되는 스타일 조합은 `index.css`에 `@apply`로 정의:

```css
/* index.css */
.answer-btn-red {
  @apply bg-gradient-to-br from-red-500 to-red-600
         hover:from-red-600 hover:to-red-700;
}

.animate-confetti {
  animation: confetti 3s ease-out forwards;
}
```

### 9.3 애니메이션 정의

```css
/* keyframes는 index.css에 정의 */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
```

---

## 10. 상수 관리

### 10.1 상수 파일 구조

```tsx
// constants/game.ts

// 게임 설정
export const QUIZ_COUNT = 10;
export const TIMER_DURATION = 10; // 초
export const CORRECT_ANSWER_DELAY = 2500; // ms
export const WRONG_ANSWER_DELAY = 3000; // ms
export const CONFETTI_DURATION = 3000; // ms

// UI 설정
export const ANSWER_COLORS = [
  'answer-btn-red',
  'answer-btn-blue',
  'answer-btn-yellow',
  'answer-btn-green'
] as const;

// 카테고리별 색상 맵
export const CATEGORY_COLORS: Record<string, string> = {
  '지리': 'bg-teal-500',
  '과학': 'bg-green-500',
  '역사': 'bg-emerald-600',
  '수학': 'bg-lime-500',
  '일반상식': 'bg-cyan-500',
};
```

---

## 11. 유틸리티 함수

### 11.1 유틸리티 함수 원칙

- 순수 함수로 작성 (부작용 없음)
- 단일 책임 원칙 준수
- 타입 안전성 보장

```tsx
// utils/quiz.ts
import { RankInfo } from '../types/game';

/**
 * 정답 개수에 따른 등급 정보 반환
 */
export function getRankInfo(correctCount: number): RankInfo {
  if (correctCount === 10) {
    return {
      title: '완벽한 천재',
      character: '🧙‍♂️',
      description: '당신은 퀴즈의 신입니다!',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-400'
    };
  }
  // ... 나머지 등급
}

/**
 * 카테고리에 해당하는 배경색 클래스 반환
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'bg-green-500';
}
```

---

## 12. 에러 처리 패턴

### 12.1 API 에러

```tsx
// 커스텀 에러 클래스 사용
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

// 에러 타입 분기 처리
catch (err) {
  if (err instanceof QuizApiError) {
    // API 에러 처리
  } else if (err instanceof Error) {
    // 일반 에러 처리
  } else {
    // 알 수 없는 에러
  }
}
```

### 12.2 UI 에러 표시

```tsx
{error && (
  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
    <p className="text-red-600 text-sm text-center font-semibold">
      ⚠️ {error}
    </p>
  </div>
)}
```

---

## 13. 성능 최적화 가이드

### 13.1 비동기 데이터 로딩

```tsx
// Good: 병렬 로딩
const promises = Array.from({ length: 10 }, () => api.getQuiz());
const quizzes = await Promise.all(promises);

// Bad: 순차 로딩
for (let i = 0; i < 10; i++) {
  const quiz = await api.getQuiz(); // 느림
}
```

### 13.2 타이머/인터벌 정리

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // ...
  }, 1000);

  // 반드시 cleanup
  return () => clearInterval(interval);
}, [dependencies]);
```

### 13.3 중복 클릭 방지

```tsx
const handleClick = async () => {
  if (isLoading || isProcessed) return; // 가드 클로즈

  setIsLoading(true);
  try {
    await doSomething();
  } finally {
    setIsLoading(false);
  }
};
```

---

## 14. 코드 품질 체크리스트

### 14.1 컴포넌트 체크리스트

- [ ] Props 인터페이스가 정의되어 있는가?
- [ ] 컴포넌트 크기가 200줄 이하인가?
- [ ] 조건부 렌더링이 명확한가?
- [ ] 이벤트 핸들러가 적절히 바인딩되어 있는가?

### 14.2 상태 관리 체크리스트

- [ ] 불필요한 상태가 없는가?
- [ ] 파생 상태는 계산으로 처리하는가?
- [ ] 상태 업데이트가 불변성을 유지하는가?

### 14.3 API 체크리스트

- [ ] 에러 처리가 되어 있는가?
- [ ] 로딩 상태를 표시하는가?
- [ ] 타입 안전성이 보장되는가?

---

## 15. Git 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩터링
style: 스타일 변경 (CSS 등)
docs: 문서 수정
chore: 빌드, 설정 파일 수정
```

예시:
```
feat: 타이머 컴포넌트 추가
fix: 중복 클릭 버그 수정
refactor: App 컴포넌트를 screens로 분리
```

---

## 16. 추가 권장 사항

### 16.1 접근성 (A11y)

- 버튼에 적절한 `aria-label` 제공
- 색상만으로 정보 전달하지 않기
- 키보드 네비게이션 지원

### 16.2 반응형 디자인

- 모바일 우선 설계 (min-width 사용)
- Tailwind 반응형 접두사 활용 (`sm:`, `md:`, `lg:`)

### 16.3 환경 변수

- 클라이언트 환경 변수는 `VITE_` 접두사 필수
- 민감한 정보는 환경 변수로 관리
