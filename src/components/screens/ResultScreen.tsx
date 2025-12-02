import { AnswerResponse } from '../../types/quiz';
import { RankInfo } from '../../types/game';
import { Confetti } from '../Confetti';
import { HomeIcon } from '../icons/HomeIcon';
import { RefreshIcon } from '../icons/RefreshIcon';
import { ChartIcon } from '../icons/ChartIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';

interface ResultScreenProps {
  quizHistory: AnswerResponse[];
  correctCount: number;
  totalCount: number;
  accuracy: number;
  rankInfo: RankInfo;
  showConfetti: boolean;
  loading: boolean;
  onBackToMenu: () => void;
  onRetry: () => void;
}

export function ResultScreen({
  quizHistory,
  correctCount,
  totalCount,
  accuracy,
  rankInfo,
  showConfetti,
  loading,
  onBackToMenu,
  onRetry,
}: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-emerald-600 flex items-center justify-center p-4">
      <Confetti show={showConfetti} />
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Rank Display */}
        <div className="text-center mb-8">
          <div
            className={`w-40 h-40 bg-gradient-to-br ${rankInfo.color} rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl animate-bounce-subtle`}
          >
            <span className="text-8xl">{rankInfo.character}</span>
          </div>
          <h2 className="text-4xl font-bold mb-3 text-gray-800">{rankInfo.title}</h2>
          <p className="text-lg text-gray-600 font-medium mb-4">{rankInfo.description}</p>
        </div>

        {/* Score Summary */}
        <div
          className={`bg-gradient-to-r ${rankInfo.bgColor} rounded-2xl p-6 mb-6 border-3 ${rankInfo.borderColor}`}
        >
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm mb-2">정답률</p>
            <p className="text-6xl font-bold text-gray-800">{accuracy}%</p>
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
                className={`group relative rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  result.is_correct
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:border-green-400'
                    : 'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 hover:border-red-400'
                }`}
              >
                {/* Question Number Badge */}
                <div
                  className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                    result.is_correct ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
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
                  <span
                    className={`text-xs font-semibold ${
                      result.is_correct ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
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
            onClick={onBackToMenu}
            className={`w-full bg-gradient-to-r ${rankInfo.color} text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg`}
          >
            <span className="flex items-center justify-center gap-2">
              <HomeIcon className="w-5 h-5" />
              메인 메뉴로
            </span>
          </button>
          <button
            onClick={onRetry}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
