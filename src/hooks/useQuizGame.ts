import { useState, useEffect, useRef, useCallback } from 'react';
import { quizApi, sessionApi, playsApi, gradeLocally, PlayStatus, setOfflineMode } from '../api/quizApi';
import { FullQuizResponse, AnswerResponse } from '../types/quiz';
import { GameMode } from '../types/game';
import {
  QUIZ_COUNT,
  CORRECT_ANSWER_DELAY,
  WRONG_ANSWER_DELAY,
  CONFETTI_DURATION,
} from '../constants/game';
import {
  Analytics,
  getAnonymousKey,
  submitGameCenterLeaderBoardScore,
} from '@apps-in-toss/web-framework';

interface UseQuizGameReturn {
  // 상태
  gameMode: GameMode;
  currentQuiz: FullQuizResponse | null;
  answerResult: AnswerResponse | null;
  userAnswer: number | null;
  quizHistory: AnswerResponse[];
  loading: boolean;
  error: string | null;
  showConfetti: boolean;
  timerKey: number;

  // 플레이 횟수
  playStatus: PlayStatus | null;
  canPlay: boolean;

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
  rewardPlay: (source: 'ad' | 'share' | 'invite') => Promise<boolean>;
  refreshPlayStatus: () => Promise<void>;
}

export function useQuizGame(): UseQuizGameReturn {
  // 게임 상태
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [quizQueue, setQuizQueue] = useState<FullQuizResponse[]>([]);
  const currentQuizIndex = useRef(0);
  const [currentQuiz, setCurrentQuiz] = useState<FullQuizResponse | null>(null);

  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [quizHistory, setQuizHistory] = useState<AnswerResponse[]>([]);

  // 세션 추적
  const sessionId = useRef<string | null>(null);
  const questionStartTime = useRef<number>(0);
  const userHash = useRef<string | null>(null);

  // 플레이 횟수
  const [playStatus, setPlayStatus] = useState<PlayStatus | null>(null);
  const canPlay = playStatus === null || playStatus.total_remaining > 0;

  const refreshPlayStatus = useCallback(async () => {
    if (!userHash.current) return;
    const status = await playsApi.getRemaining(userHash.current);
    if (status) setPlayStatus(status);
  }, []);

  const rewardPlay = useCallback(async (source: 'ad' | 'share' | 'invite') => {
    if (!userHash.current) return false;
    const result = await playsApi.reward(userHash.current, source);
    if (!result) return false;
    setPlayStatus(result);
    return true;
  }, []);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [autoTransitionTimer, setAutoTransitionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // 유저 식별키 초기화 + 플레이 횟수 로드 (앱 시작 시 1회)
  useEffect(() => {
    getAnonymousKey().then((result) => {
      if (result && result !== 'ERROR' && typeof result === 'object' && 'hash' in result) {
        userHash.current = result.hash;
        refreshPlayStatus();
      }
    }).catch(() => {});
  }, [refreshPlayStatus]);

  // 계산된 값
  const correctCount = quizHistory.filter((h) => h.is_correct).length;
  const totalCount = quizHistory.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // 다음 문제로 이동
  const handleNextQuestion = useCallback(() => {
    if (autoTransitionTimer) {
      clearTimeout(autoTransitionTimer);
      setAutoTransitionTimer(null);
    }

    setError(null);
    setAnswerResult(null);
    setUserAnswer(null);

    const nextIndex = currentQuizIndex.current + 1;
    if (nextIndex < quizQueue.length) {
      currentQuizIndex.current = nextIndex;
      setCurrentQuiz(quizQueue[nextIndex]);
      questionStartTime.current = Date.now();
    } else {
      setError('퀴즈를 불러올 수 없습니다.');
    }
  }, [autoTransitionTimer, quizQueue]);

  // 게임 시작
  const startGame = useCallback(async () => {
    // 플레이 횟수 차감 (유저 식별 된 경우)
    if (userHash.current) {
      const result = await playsApi.consume(userHash.current);
      if (result && !result.success) {
        setError('오늘 플레이 횟수를 모두 사용했어요! 광고 시청이나 친구 초대로 기회를 얻으세요.');
        return;
      }
      if (result) {
        setPlayStatus(result as unknown as PlayStatus);
      }
    }

    setLoading(true);
    setError(null);
    setQuizHistory([]);

    const { quizzes, isOffline } = await quizApi.getRandomQuizzes(QUIZ_COUNT);

    setIsOfflineMode(isOffline);
    setQuizQueue(quizzes);
    currentQuizIndex.current = 0;
    setCurrentQuiz(quizzes[currentQuizIndex.current]);
    setGameMode('playing');
    setUserAnswer(null);
    setAnswerResult(null);
    setTimerKey((prev) => prev + 1);
    setLoading(false);
    questionStartTime.current = Date.now();

    // 세션 생성 (fire-and-forget, 오프라인 시 스킵)
    if (!isOffline) {
      sessionApi.createSession(userHash.current ?? undefined).then((id) => {
        sessionId.current = id;
      });
    }

    Analytics.impression({
      event_name: 'game_started',
      quiz_count: quizzes.length,
      is_offline_mode: isOffline,
    });
  }, []);

  // 답변 선택 처리
  const onAnswer = useCallback((answerIndex: number) => {
    if (userAnswer !== null) return;
    setUserAnswer(answerIndex);
  }, [userAnswer]);

  // useEffect에서 사용자 응답 통합 처리
  useEffect(() => {
    let cancelled = false;

    const handleAnswerSubmit = (user_answer: number) => {
      if (loading || !currentQuiz || cancelled) return;

      setLoading(true);
      setError(null);

      const timeSpent = Date.now() - questionStartTime.current;
      const questionIdx = currentQuizIndex.current;

      // 로컬 채점 (서버 불필요, 절대 실패하지 않음)
      const result = gradeLocally(currentQuiz.id, user_answer) ?? {
        is_correct: false,
        correct_answer: 0,
        explanation: '',
        user_answer,
      };

      // 트래킹: 서버에 비동기 전송 (fire-and-forget, 실패해도 게임에 영향 없음)
      quizApi.submitAnswerToServer({ quiz_id: currentQuiz.id, user_answer });
      if (sessionId.current) {
        sessionApi.submitAnswer(sessionId.current, {
          quiz_id: currentQuiz.id,
          user_answer,
          category: currentQuiz.category,
          time_spent_ms: timeSpent,
          question_index: questionIdx,
        });
      }

      setAnswerResult(result);
      const newHistory = [...quizHistory, result];
      setQuizHistory(newHistory);
      setTimerKey((prev) => prev + 1);
      setLoading(false);

      const correctInHistory = newHistory.filter((h) => h.is_correct).length;
      const isGameComplete = newHistory.length >= QUIZ_COUNT;

      if (result.is_correct) {
        Analytics.impression({
          event_name: 'answer_correct',
          quiz_id: currentQuiz.id,
          question_number: newHistory.length,
          total_correct: correctInHistory,
        });

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

        if (!isGameComplete) {
          const timer = setTimeout(() => {
            handleNextQuestion();
          }, CORRECT_ANSWER_DELAY);
          setAutoTransitionTimer(timer);
        }
      } else {
        Analytics.impression({
          event_name: 'answer_wrong',
          quiz_id: currentQuiz.id,
          question_number: newHistory.length,
          total_correct: correctInHistory,
        });

        if (!isGameComplete) {
          const timer = setTimeout(() => {
            handleNextQuestion();
          }, WRONG_ANSWER_DELAY);
          setAutoTransitionTimer(timer);
        }
      }

      // 게임 완료 처리
      if (isGameComplete) {
        const finalAccuracy = Math.round((correctInHistory / newHistory.length) * 100);
        Analytics.impression({
          event_name: 'game_complete',
          final_correct: correctInHistory,
          final_total: newHistory.length,
          accuracy: finalAccuracy,
        });

        // 트래킹: 세션 완료 + 리더보드 (fire-and-forget)
        if (sessionId.current) {
          sessionApi.completeSession(sessionId.current, {
            correct_count: correctInHistory,
            accuracy: finalAccuracy,
          });
        }
        submitGameCenterLeaderBoardScore({ score: String(correctInHistory * 10) }).catch(() => {});
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
    setGameMode('result');
  }, [quizHistory]);

  // 메인 메뉴로 돌아가기
  const backToMenu = useCallback(() => {
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
    sessionId.current = null;
    refreshPlayStatus();
  }, [autoTransitionTimer, refreshPlayStatus]);

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

    // 플레이 횟수
    playStatus,
    canPlay,

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
    rewardPlay,
    refreshPlayStatus,
  };
}
