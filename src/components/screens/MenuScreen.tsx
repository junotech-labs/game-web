import { DiceIcon } from '../icons/DiceIcon';

interface MenuScreenProps {
  loading: boolean;
  error: string | null;
  onStartGame: () => void;
}

export function MenuScreen({ loading, error, onStartGame }: MenuScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle"
          style={{ animationDelay: '2s' }}
        ></div>
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
            onClick={onStartGame}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold py-5 px-6 rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {loading ? (
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
            <p className="text-red-600 text-sm text-center font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
