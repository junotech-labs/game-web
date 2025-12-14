import { useState, useEffect, useRef, useCallback } from 'react';
import { quizApi, QuizApiError, setOfflineMode } from '../api/quizApi';
import { QuizResponse, AnswerResponse } from '../types/quiz';
import { GameMode } from '../types/game';
import {
  QUIZ_COUNT,
  CORRECT_ANSWER_DELAY,
  WRONG_ANSWER_DELAY,
  CONFETTI_DURATION,
} from '../constants/game';
import { Analytics } from '@apps-in-toss/web-framework';

interface UseQuizGameReturn {
  // 상태
  gameMode: GameMode;
  currentQuiz: QuizResponse | null;
  answerResult: AnswerResponse | null;
  userAnswer: number | null;
  quizHistory: AnswerResponse[];
  loading: boolean;
  error: string | null;
  showConfetti: boolean;
  timerKey: number;
  isOfflineMode: boolean;

  // 계산된 값
  correctCount: number;
  totalCount: number;
  accuracy: number;

  // 액션
  startGame: () => Promise<void>;
  onAnswer: (answerIndex: number) => void;
  handleNextQuestion: () => void;
  showResults: () => void;
  backToMenu: () => void;
}

export function useQuizGame(): UseQuizGameReturn {
  // 게임 상태
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [quizQueue, setQuizQueue] = useState<QuizResponse[]>([]);
  const currentQuizIndex = useRef(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizResponse | null>(null);

  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [quizHistory, setQuizHistory] = useState<AnswerResponse[]>([]);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [autoTransitionTimer, setAutoTransitionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // 계산된 값
  const correctCount = quizHistory.filter((h) => h.is_correct).length;
  const totalCount = quizHistory.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // 다음 문제로 이동
  const handleNextQuestion = useCallback(() => {
    console.log('[App] Moving to next question...');

    if (autoTransitionTimer) {
      clearTimeout(autoTransitionTimer);
      setAutoTransitionTimer(null);
    }

    setError(null);
    setAnswerResult(null);
    setUserAnswer(null);

    const nextIndex = currentQuizIndex.current + 1;
    if (nextIndex < quizQueue.length) {
      console.log('[App] Loading quiz from queue:', quizQueue[nextIndex].id);
      currentQuizIndex.current = nextIndex;
      setCurrentQuiz(quizQueue[nextIndex]);
    } else {
      console.error('[App] No more quizzes in queue!');
      setError('퀴즈를 불러올 수 없습니다.');
    }
  }, [autoTransitionTimer, quizQueue]);

  // 게임 시작
  const startGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuizHistory([]);

    console.log(`[App] Loading ${QUIZ_COUNT} quizzes...`);
    const { quizzes, isOffline } = await quizApi.getRandomQuizzes(QUIZ_COUNT);
    console.log(`[App] All ${quizzes.length} quizzes loaded:`, quizzes.map((q) => q.id), isOffline ? '(오프라인 모드)' : '');

    setIsOfflineMode(isOffline);
    setQuizQueue(quizzes);
    currentQuizIndex.current = 0;
    setCurrentQuiz(quizzes[currentQuizIndex.current]);
    setGameMode('playing');
    setUserAnswer(null);
    setAnswerResult(null);
    setTimerKey((prev) => prev + 1);
    setLoading(false);

    Analytics.impression({
      event_name: 'game_started',
      quiz_count: quizzes.length,
      is_offline_mode: isOffline,
    });
  }, []);

  // 답변 선택 처리
  const onAnswer = useCallback((answerIndex: number) => {
    if (userAnswer !== null) return;
    console.log('[useQuizGame] User answer selected:', { answerIndex });
    setUserAnswer(answerIndex);
  }, [userAnswer]);

  // useEffect에서 사용자 응답 통합 처리
  useEffect(() => {
    let cancelled = false;

    const handleAnswerSubmit = async (user_answer: number) => {
      if (loading || !currentQuiz || cancelled) return;

      setLoading(true);
      setError(null);

      try {
        console.log('[App] Submitting answer:', { quiz_id: currentQuiz.id, user_answer });
        const result = await quizApi.submitAnswer({
          quiz_id: currentQuiz.id,
          user_answer,
        });
        console.log('[App] Answer result:', result);

        setAnswerResult(result);
        const newHistory = [...quizHistory, result];
        setQuizHistory(newHistory);
        setTimerKey((prev) => prev + 1);

        const isGameComplete = newHistory.length >= QUIZ_COUNT;

        if (result.is_correct) {
          console.log('[useQuizGame] Correct answer!', {
            quiz_id: currentQuiz.id,
            question_number: newHistory.length,
            total_correct: newHistory.filter((h) => h.is_correct).length,
            is_game_complete: isGameComplete,
          });
          Analytics.impression({
            event_name: 'answer_correct',
            quiz_id: currentQuiz.id,
            question_number: newHistory.length,
            total_correct: newHistory.filter((h) => h.is_correct).length,
          });

          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

          if (newHistory.length < QUIZ_COUNT) {
            console.log('[useQuizGame] Auto-transitioning to next question after correct answer');
            const timer = setTimeout(() => {
              handleNextQuestion();
            }, CORRECT_ANSWER_DELAY);
            setAutoTransitionTimer(timer);
          } else {
            console.log('[useQuizGame] Game completed!', {
              final_score: {
                correct: newHistory.filter((h) => h.is_correct).length,
                total: newHistory.length,
              },
            });
            Analytics.impression({
              event_name: 'game_complete',
              final_correct: newHistory.filter((h) => h.is_correct).length,
              final_total: newHistory.length,
              accuracy: Math.round((newHistory.filter((h) => h.is_correct).length / newHistory.length) * 100),
            });
          }
        } else {
          console.log('[useQuizGame] Wrong answer!', {
            quiz_id: currentQuiz.id,
            question_number: newHistory.length,
            total_correct: newHistory.filter((h) => h.is_correct).length,
            is_game_complete: isGameComplete,
          });
          Analytics.impression({
            event_name: 'answer_wrong',
            quiz_id: currentQuiz.id,
            question_number: newHistory.length,
            total_correct: newHistory.filter((h) => h.is_correct).length,
          });

          if (newHistory.length < QUIZ_COUNT) {
            console.log('[useQuizGame] Auto-transitioning to next question after wrong answer');
            const timer = setTimeout(() => {
              handleNextQuestion();
            }, WRONG_ANSWER_DELAY);
            setAutoTransitionTimer(timer);
          } else {
            console.log('[useQuizGame] Game completed!', {
              final_score: {
                correct: newHistory.filter((h) => h.is_correct).length,
                total: newHistory.length,
              },
            });
            Analytics.impression({
              event_name: 'game_complete',
              final_correct: newHistory.filter((h) => h.is_correct).length,
              final_total: newHistory.length,
              accuracy: Math.round((newHistory.filter((h) => h.is_correct).length / newHistory.length) * 100),
            });
          }
        }
      } catch (err) {
        const errorMessage = err instanceof QuizApiError ? err.message : '답변 제출 실패';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userAnswer === null) return;
    handleAnswerSubmit(userAnswer);

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer]);

  // 결과 화면 표시
  const showResults = useCallback(() => {
    console.log('[useQuizGame] Showing results screen', {
      total_questions: quizHistory.length,
      correct_count: quizHistory.filter((h) => h.is_correct).length,
    });
    setGameMode('result');
  }, [quizHistory]);

  // 메인 메뉴로 돌아가기
  const backToMenu = useCallback(() => {
    console.log('[useQuizGame] Returning to menu');

    if (autoTransitionTimer) {
      clearTimeout(autoTransitionTimer);
      setAutoTransitionTimer(null);
    }

    setGameMode('menu');
    setCurrentQuiz(null);
    setQuizQueue([]);
    currentQuizIndex.current = 0;
    setQuizHistory([]);
    setAnswerResult(null);
    setError(null);
    setIsOfflineMode(false);
    setOfflineMode(false);
  }, [autoTransitionTimer]);

  return {
    // 상태
    gameMode,
    currentQuiz,
    answerResult,
    userAnswer,
    quizHistory,
    loading,
    error,
    showConfetti,
    timerKey,
    isOfflineMode,

    // 계산된 값
    correctCount,
    totalCount,
    accuracy,

    // 액션
    startGame,
    onAnswer,
    handleNextQuestion,
    showResults,
    backToMenu,
  };
}
