import { DiceIcon } from '../icons/DiceIcon';
import { Analytics } from '@apps-in-toss/web-framework';
import { PlayStatus } from '../../api/quizApi';
import {
  hasRewardAdConfigured,
  isRewardAdSupported,
  showRewardAd,
} from '../../utils/tossRewards';

interface MenuScreenProps {
  loading: boolean;
  error: string | null;
  playStatus: PlayStatus | null;
  canPlay: boolean;
  onStartGame: () => void;
  onRewardPlay: (source: 'ad' | 'share' | 'invite') => Promise<boolean>;
}

export function MenuScreen({ loading, error, playStatus, canPlay, onStartGame, onRewardPlay }: MenuScreenProps) {
  const rewardAdConfigured = hasRewardAdConfigured();
  const rewardAdSupported = isRewardAdSupported();
  const rewardAdEnabled = rewardAdConfigured && rewardAdSupported;

  const handleStartGame = () => {
    Analytics.click({ button_name: 'game_start' });
    onStartGame();
  };

  const handleWatchAd = async () => {
    Analytics.click({ button_name: 'watch_ad_for_play' });

    const rewarded = await showRewardAd();
    if (!rewarded) {
      return;
    }

    await onRewardPlay('ad');
  };

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

        {/* 플레이 횟수 표시 */}
        {playStatus && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">오늘 남은 기회</span>
              <span className="text-2xl font-bold text-emerald-600">{playStatus.total_remaining}회</span>
            </div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>무료 {playStatus.free_remaining}회</span>
              {playStatus.bonus_remaining > 0 && (
                <span className="text-orange-500 font-semibold">+ 보너스 {playStatus.bonus_remaining}회</span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* 게임 시작 버튼 */}
          <button
            onClick={handleStartGame}
            disabled={loading || !canPlay}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold py-5 px-6 rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
          >
            {loading ? (
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>문제 생성중...</span>
              </span>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <DiceIcon className="w-6 h-6" />
                  {canPlay ? '랜덤 퀴즈 시작!' : '기회를 모두 사용했어요'}
                </span>
              </>
            )}
          </button>

          {/* 기회 얻기 섹션 — 플레이 불가 시 또는 항상 표시 */}
          {playStatus && !canPlay && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-center text-sm font-semibold text-gray-500 mb-3">기회를 더 얻으세요!</p>
              <div className="space-y-2">
                <button
                  onClick={handleWatchAd}
                  disabled={!rewardAdEnabled}
                  className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 px-4 rounded-xl hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {rewardAdConfigured ? '📺 광고 보고 +1회 얻기' : '📺 광고 보상 준비중'}
                  </span>
                </button>
                {!rewardAdSupported && (
                  <p className="text-xs text-center text-gray-500">
                    광고 보상은 토스 앱 안에서만 사용할 수 있어요.
                  </p>
                )}
              </div>
            </div>
          )}
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
