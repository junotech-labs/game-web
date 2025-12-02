import { useState, useEffect, useRef } from 'react';
import { quizApi, QuizApiError } from './api/quizApi';
import { QuizResponse, AnswerResponse } from './types/quiz';
import { Confetti } from './components/Confetti';
import { Timer } from './components/Timer';

import { DiceIcon } from './components/icons/DiceIcon';
import { HomeIcon } from './components/icons/HomeIcon';
import { RefreshIcon } from './components/icons/RefreshIcon';
import { ChartIcon } from './components/icons/ChartIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { XIcon } from './components/icons/XIcon';

type GameMode = 'menu' | 'playing' | 'result';

// 게임 설정 상수
const QUIZ_COUNT = 10; // 총 퀴즈 개수
const CORRECT_ANSWER_DELAY = 2500; // 정답 후 자동 전환 시간 (ms)
const WRONG_ANSWER_DELAY = 3000; // 오답 후 자동 전환 시간 (ms)
const CONFETTI_DURATION = 3000; // Confetti 표시 시간 (ms)
const TIMER_DURATION = 10; // 퀴즈 제한 시간 (초)

// 답변 버튼 색상 (Kahoot 스타일)
const ANSWER_COLORS = ['answer-btn-red', 'answer-btn-blue', 'answer-btn-yellow', 'answer-btn-green'];

function App() {
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

  const startRandomGame = async () => {
    setLoading(true);
    setError(null);
    setQuizHistory([]);

    try {
      console.log(`[App] Loading ${QUIZ_COUNT} quizzes...`);
      // 모든 퀴즈를 한번에 로드
      const promises = Array.from({ length: QUIZ_COUNT }, () => quizApi.getRandomQuiz());
      const quizzes = await Promise.all(promises);
      console.log(`[App] All ${QUIZ_COUNT} quizzes loaded:`, quizzes.map(q => q.id));

      setQuizQueue(quizzes);
      currentQuizIndex.current = 0;
      setCurrentQuiz(quizzes[currentQuizIndex.current]);
      setGameMode('playing');
      setUserAnswer(null);
      setAnswerResult(null);
      setTimerKey(prev => prev + 1);

    } catch (err) {
      console.error('[App] Start game error:', err);
      const errorMessage = err instanceof QuizApiError
        ? `${err.message} (Status: ${err.status})`
        : err instanceof Error
          ? err.message
          : '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onAnswer = (answer: number) => {
    if (userAnswer !== null) return;
    setUserAnswer(answer);
  };

  // useEffect에서 사용자 응답 통합 처리
  useEffect(() => {
    let cancelled = false;
  
    const handleAnswerClick = async (user_answer: number) => {
      // 중복 클릭 방지
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
        setTimerKey(prev => prev + 1); // 타이머 리셋 타이밍 조정

        if (result.is_correct) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

          // 지연 후 다음 문제로 자동 전환
          // 모든 문제 완료시 자동 전환하지 않음 - 사용자가 버튼 클릭
          if (newHistory.length < QUIZ_COUNT) {
            const timer = setTimeout(() => {
              handleNextQuestion();
            }, CORRECT_ANSWER_DELAY);
            setAutoTransitionTimer(timer);
          }
        } else {
          // 오답의 경우 해설을 읽을 수 있도록 더 긴 지연 후 자동 전환
          // 모든 문제 완료시 자동 전환하지 않음 - 사용자가 버튼 클릭
          if (newHistory.length < QUIZ_COUNT) {
            const timer = setTimeout(() => {
              handleNextQuestion();
            }, WRONG_ANSWER_DELAY);
            setAutoTransitionTimer(timer);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof QuizApiError
          ? err.message
          : '답변 제출 실패';
        setError(errorMessage);
        // 오류 발생시 상태 리셋
      } finally {
        setLoading(false);
      }
    };
    if (userAnswer === null) return;
    handleAnswerClick(userAnswer);

    return () => {
      cancelled = true;
    };
  }, [userAnswer]);

  const handleNextQuestion = () => {
    console.log('[App] Moving to next question...');

    // 대기 중인 자동 전환 타이머 제거
    if (autoTransitionTimer) {
      clearTimeout(autoTransitionTimer);
      setAutoTransitionTimer(null);
    }

    setError(null);

    // 부드러운 전환을 위해 현재 상태 먼저 초기화
    setAnswerResult(null);
    setUserAnswer(null); // 사용자 응답 초기화 이후 시간이 흐르도록 설정

    // 큐에서 다음 퀴즈 가져오기
    const nextIndex = currentQuizIndex.current + 1;
    if (nextIndex < quizQueue.length) {
      console.log('[App] Loading quiz from queue:', quizQueue[nextIndex].id);
      currentQuizIndex.current = nextIndex;
      setCurrentQuiz(quizQueue[nextIndex]);
    } else {
      console.error('[App] No more quizzes in queue!');
      setError('퀴즈를 불러올 수 없습니다.');
    }
  };

  const showResults = () => {
    setGameMode('result');
  };

  const backToMenu = () => {
    // 대기 중인 자동 전환 타이머 제거
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
  };



  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '지리': 'bg-teal-500',
      '과학': 'bg-green-500',
      '역사': 'bg-emerald-600',
      '수학': 'bg-lime-500',
      '일반상식': 'bg-cyan-500',
    };
    return colors[category] || 'bg-green-500';
  };

  const getRankInfo = (correctCount: number) => {
    const score = correctCount; // Out of 10

    if (score === 10) {
      return {
        title: '완벽한 천재',
        character: '🧙‍♂️',
        description: '당신은 퀴즈의 신입니다!',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'from-yellow-50 to-orange-50',
        borderColor: 'border-yellow-400'
      };
    } else if (score === 9) {
      return {
        title: '지식 박사',
        character: '🦉',
        description: '거의 완벽해요! 한 문제만 더!',
        color: 'from-purple-400 to-pink-500',
        bgColor: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-400'
      };
    } else if (score === 8) {
      return {
        title: '똑똑이',
        character: '🦊',
        description: '훌륭해요! 상위 20% 실력!',
        color: 'from-orange-400 to-red-500',
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-400'
      };
    } else if (score === 7) {
      return {
        title: '합격선 통과',
        character: '🎓',
        description: '합격! 평균 이상이에요!',
        color: 'from-emerald-400 to-teal-500',
        bgColor: 'from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-400'
      };
    } else if (score === 6) {
      return {
        title: '노력파',
        character: '🐰',
        description: '조금만 더 노력하면 합격!',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-400'
      };
    } else if (score === 5) {
      return {
        title: '반반 성공',
        character: '🌗',
        description: '반은 맞췄네요. 분발하세요!',
        color: 'from-lime-400 to-green-500',
        bgColor: 'from-lime-50 to-green-50',
        borderColor: 'border-lime-400'
      };
    } else if (score === 4) {
      return {
        title: '분발 필요',
        character: '🌱',
        description: '공부가 더 필요해요!',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-400'
      };
    } else if (score === 3) {
      return {
        title: '초보자',
        character: '🐣',
        description: '처음이라 그렇죠... 맞죠?',
        color: 'from-yellow-300 to-amber-400',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300'
      };
    } else if (score === 2) {
      return {
        title: '용기만 100점',
        character: '🎲',
        description: '용기는 인정합니다!',
        color: 'from-pink-400 to-rose-500',
        bgColor: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-400'
      };
    } else if (score === 1) {
      return {
        title: '운빨 성공',
        character: '🍀',
        description: '찍기의 달인!',
        color: 'from-indigo-400 to-purple-500',
        bgColor: 'from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-400'
      };
    } else {
      return {
        title: '역대급 도전',
        character: '💀',
        description: '이것도 재능입니다...',
        color: 'from-gray-400 to-slate-500',
        bgColor: 'from-gray-50 to-slate-50',
        borderColor: 'border-gray-400'
      };
    }
  };

  // 메인 메뉴 화면
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 animate-bounce-subtle">
              <img src="/logo.png" alt="Quiz Game Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              상식 퀴즈
            </h1>
            <p className="text-gray-600 font-semibold">당신의 상식은 얼마나 되나요?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={startRandomGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold py-5 px-6 rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>문제 생성중...</span>
                </span>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <DiceIcon className="w-6 h-6" />
                    랜덤 퀴즈 시작!
                  </span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
              <p className="text-red-600 text-sm text-center font-semibold">⚠️ {error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 결과 화면
  if (gameMode === 'result') {
    const correctCount = quizHistory.filter(h => h.is_correct).length;
    const totalCount = quizHistory.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const rankInfo = getRankInfo(correctCount);

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-emerald-600 flex items-center justify-center p-4">
        <Confetti show={showConfetti} />
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          {/* Rank Display */}
          <div className="text-center mb-8">
            <div className={`w-40 h-40 bg-gradient-to-br ${rankInfo.color} rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl animate-bounce-subtle`}>
              <span className="text-8xl">{rankInfo.character}</span>
            </div>
            <h2 className="text-4xl font-bold mb-3 text-gray-800">
              {rankInfo.title}
            </h2>
            <p className="text-lg text-gray-600 font-medium mb-4">
              {rankInfo.description}
            </p>
          </div>

          {/* Score Summary */}
          <div className={`bg-gradient-to-r ${rankInfo.bgColor} rounded-2xl p-6 mb-6 border-3 ${rankInfo.borderColor}`}>
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm mb-2">정답률</p>
              <p className="text-6xl font-bold text-gray-800">
                {accuracy}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-white/50">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">정답</p>
                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">오답</p>
                <p className="text-2xl font-bold text-red-600">{totalCount - correctCount}</p>
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
              <ChartIcon className="w-4 h-4" />
              <span>풀이 기록</span>
              <span className="text-xs text-gray-400">({totalCount}문제)</span>
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {quizHistory.map((result, index) => (
                <div
                  key={index}
                  className={`group relative rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${result.is_correct
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:border-green-400'
                    : 'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 hover:border-red-400'
                    }`}
                >
                  {/* Question Number Badge */}
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${result.is_correct ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {index + 1}
                  </div>

                  {/* Icon and Status */}
                  <div className="flex flex-col items-center justify-center h-16">
                    <div className={`mb-1 ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                      {result.is_correct ? (
                        <CheckIcon className="w-8 h-8" />
                      ) : (
                        <XIcon className="w-8 h-8" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${result.is_correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {result.is_correct ? '정답' : '오답'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={backToMenu}
              className={`w-full bg-gradient-to-r ${rankInfo.color} text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              <span className="flex items-center justify-center gap-2">
                <HomeIcon className="w-5 h-5" />
                메인 메뉴로
              </span>
            </button>
            <button
              onClick={startRandomGame}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  문제 생성중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshIcon className="w-5 h-5" />
                  다시 도전하기
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
      <Confetti show={showConfetti} />

      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          {/* Top row: Category and Quiz Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className={`${getCategoryColor(currentQuiz.category)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
                {currentQuiz.category}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-500">
              {quizHistory.length}/{QUIZ_COUNT} 문제
            </div>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <Timer
              duration={TIMER_DURATION}
              onTimeout={() => setUserAnswer(0)}
              isRunning={userAnswer === null}
              onReset={timerKey}
            />
          </div>
        </div>

        {/* 문제 또는 피드백 영역 - 레이아웃 변화 방지를 위한 고정 컨테이너 */}
        <div className="mb-8 min-h-[200px]">
          {!answerResult ? (
            // 답변 전 문제 표시
            <div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-inner min-h-[140px] flex items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-800 text-center leading-relaxed">
                  {currentQuiz.question}
                </h2>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onAnswer(index)}
                    disabled={userAnswer !== null || loading}
                    className={`${ANSWER_COLORS[index]} text-white font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer p-6 rounded-2xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px]`}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      <span className="text-lg font-semibold">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 답변 후 피드백 표시
            <div className="animate-fade-in">
              <div className={`p-8 rounded-2xl border-3 shadow-lg min-h-[140px] ${answerResult.is_correct
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400'
                }`}>
                <div className="text-center mb-4">
                  <span className="text-6xl mb-3 block">
                    {answerResult.is_correct ? '🎉' : '💡'}
                  </span>
                  <h3 className={`text-3xl font-bold mb-2 ${answerResult.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                    {answerResult.user_answer >= 0 && currentQuiz.options[answerResult.user_answer] && (
                      <div className="mb-2">
                        <span className="text-2xl">"{currentQuiz.options[answerResult.user_answer]}"</span>
                      </div>
                    )}
                    {answerResult.is_correct ? '정답입니다!' : '오답입니다!'}
                  </h3>
                </div>

                <div className="bg-white/50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">문제</p>
                  <p className="text-gray-800 font-medium">{currentQuiz.question}</p>
                </div>

                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">해설</p>
                  <p className="text-gray-800">{answerResult.explanation}</p>
                </div>
              </div>

              {/* Next Question or Show Results Button - Fixed position */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    if (quizHistory.length >= QUIZ_COUNT) {
                      showResults();
                    } else {
                      handleNextQuestion();
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 min-h-[56px]"
                >
                  {loading ? '로딩 중...' : quizHistory.length >= QUIZ_COUNT ? '📊 결과 보기' : '➡️ 다음 문제'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
            <p className="text-red-600 text-sm text-center font-semibold">⚠️ {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
