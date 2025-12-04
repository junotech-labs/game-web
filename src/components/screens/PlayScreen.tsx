import { QuizResponse, AnswerResponse } from '../../types/quiz';
import { Confetti } from '../Confetti';
import { Timer } from '../Timer';
import { getCategoryColor } from '../../utils/quiz';
import { QUIZ_COUNT, TIMER_DURATION, ANSWER_COLORS } from '../../constants/game';

interface PlayScreenProps {
  currentQuiz: QuizResponse;
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
              onTimeout={() => onAnswer(0)}
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
              onAnswer={onAnswer}
            />
          ) : (
            <FeedbackView
              currentQuiz={currentQuiz}
              answerResult={answerResult}
              quizHistoryLength={quizHistory.length}
              loading={loading}
              onNextQuestion={onNextQuestion}
              onShowResults={onShowResults}
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
  currentQuiz: QuizResponse;
  userAnswer: number | null;
  loading: boolean;
  onAnswer: (index: number) => void;
}

function QuestionView({ currentQuiz, userAnswer, loading, onAnswer }: QuestionViewProps) {
  return (
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
  );
}

// 피드백 표시 컴포넌트
interface FeedbackViewProps {
  currentQuiz: QuizResponse;
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
