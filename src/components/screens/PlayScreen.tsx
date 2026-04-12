import { useState } from 'react';
import { FullQuizResponse, AnswerResponse } from '../../types/quiz';
import { Confetti } from '../Confetti';
import { Timer } from '../Timer';
import { getCategoryColor } from '../../utils/quiz';
import { QUIZ_COUNT, TIMER_DURATION, ANSWER_COLORS } from '../../constants/game';
import { Analytics } from '@apps-in-toss/web-framework';
import { showRewardAd } from '../../utils/tossRewards';

interface PlayScreenProps {
  currentQuiz: FullQuizResponse;
  answerResult: AnswerResponse | null;
  userAnswer: number | null;
  quizHistory: AnswerResponse[];
  loading: boolean;
  error: string | null;
  showConfetti: boolean;
  timerKey: number;
  onAnswer: (index: number) => void;
  onNextQuestion: () => void;
  onShowResults: () => void;
}

export function PlayScreen({
  currentQuiz,
  answerResult,
  userAnswer,
  quizHistory,
  loading,
  error,
  showConfetti,
  timerKey,
  onAnswer,
  onNextQuestion,
  onShowResults,
}: PlayScreenProps) {
  const handleAnswer = (index: number) => {
    Analytics.click({
      button_name: 'answer_select',
      quiz_id: currentQuiz.id,
      answer_index: index,
      question_number: quizHistory.length + 1,
    });
    onAnswer(index);
  };

  const handleNextQuestion = () => {
    Analytics.click({
      button_name: 'next_question',
      current_question: quizHistory.length,
    });
    onNextQuestion();
  };

  const handleShowResults = () => {
    Analytics.click({
      button_name: 'show_results',
      total_questions: quizHistory.length,
      correct_answers: quizHistory.filter((h) => h.is_correct).length,
    });
    onShowResults();
  };

  const handleTimeout = () => {
    Analytics.click({
      button_name: 'timer_timeout',
      quiz_id: currentQuiz.id,
      question_number: quizHistory.length + 1,
    });
    onAnswer(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
      <Confetti show={showConfetti} />

      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          {/* Top row: Category and Quiz Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`${getCategoryColor(currentQuiz.category)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}
              >
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
              onTimeout={handleTimeout}
              isRunning={userAnswer === null}
              onReset={timerKey}
            />
          </div>
        </div>

        {/* 문제 또는 피드백 영역 */}
        <div className="mb-8 min-h-[200px]">
          {!answerResult ? (
            <QuestionView
              currentQuiz={currentQuiz}
              userAnswer={userAnswer}
              loading={loading}
              onAnswer={handleAnswer}
            />
          ) : (
            <FeedbackView
              currentQuiz={currentQuiz}
              answerResult={answerResult}
              quizHistoryLength={quizHistory.length}
              loading={loading}
              onNextQuestion={handleNextQuestion}
              onShowResults={handleShowResults}
            />
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
            <p className="text-red-600 text-sm text-center font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 문제 표시 컴포넌트
interface QuestionViewProps {
  currentQuiz: FullQuizResponse;
  userAnswer: number | null;
  loading: boolean;
  onAnswer: (index: number) => void;
}

function QuestionView({ currentQuiz, userAnswer, loading, onAnswer }: QuestionViewProps) {
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);

  const handleHint = async () => {
    Analytics.click({ button_name: 'hint_ad', quiz_id: currentQuiz.id });

    // 보상형 광고 시도 (미지원 환경이나 실패 시에도 힌트 제공)
    await showRewardAd();

    // 힌트: 오답 중 랜덤 2개 선택지 숨김 (정답은 항상 남김)
    const wrongIdxs = [0, 1, 2, 3].filter(i => i !== currentQuiz.correct_answer);
    for (let i = wrongIdxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongIdxs[i], wrongIdxs[j]] = [wrongIdxs[j], wrongIdxs[i]];
    }
    setHiddenOptions(wrongIdxs.slice(0, 2));
    setHintUsed(true);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-inner min-h-[140px] flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 text-center leading-relaxed">
          {currentQuiz.question}
        </h2>
      </div>

      {/* Hint Button */}
      {!hintUsed && userAnswer === null && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleHint}
            className="bg-yellow-400 text-yellow-900 font-bold py-2 px-5 rounded-full text-sm hover:bg-yellow-500 transition-all active:scale-95 shadow-md"
          >
            💡 힌트 (선택지 2개 제거)
          </button>
        </div>
      )}

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {currentQuiz.options.map((option, index) => {
          const isHidden = hiddenOptions.includes(index);
          return (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={userAnswer !== null || loading || isHidden}
              className={`${ANSWER_COLORS[index]} text-white font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer p-6 rounded-2xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px] ${isHidden ? 'opacity-20 pointer-events-none' : ''}`}
            >
              <div className="relative z-10 flex items-center justify-center">
                <span className="text-lg font-semibold">{isHidden ? '—' : option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 피드백 표시 컴포넌트
interface FeedbackViewProps {
  currentQuiz: FullQuizResponse;
  answerResult: AnswerResponse;
  quizHistoryLength: number;
  loading: boolean;
  onNextQuestion: () => void;
  onShowResults: () => void;
}

function FeedbackView({
  currentQuiz,
  answerResult,
  quizHistoryLength,
  loading,
  onNextQuestion,
  onShowResults,
}: FeedbackViewProps) {
  const isLastQuestion = quizHistoryLength >= QUIZ_COUNT;

  return (
    <div className="animate-fade-in">
      <div
        className={`p-8 rounded-2xl border-3 shadow-lg min-h-[140px] ${
          answerResult.is_correct
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400'
        }`}
      >
        <div className="text-center mb-4">
          <span className="text-6xl mb-3 block">{answerResult.is_correct ? '🎉' : '💡'}</span>
          <h3
            className={`text-3xl font-bold mb-2 ${
              answerResult.is_correct ? 'text-green-700' : 'text-red-700'
            }`}
          >
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

      {/* Next Question or Show Results Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            if (isLastQuestion) {
              onShowResults();
            } else {
              onNextQuestion();
            }
          }}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 min-h-[56px]"
        >
          {loading ? '로딩 중...' : isLastQuestion ? '📊 결과 보기' : '➡️ 다음 문제'}
        </button>
      </div>
    </div>
  );
}
