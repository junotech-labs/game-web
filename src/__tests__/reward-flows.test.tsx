import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MenuScreen } from '../components/screens/MenuScreen';
import { ResultScreen } from '../components/screens/ResultScreen';

vi.mock('../utils/tossRewards', () => ({
  hasRewardAdConfigured: vi.fn(),
  isRewardAdSupported: vi.fn(),
  showRewardAd: vi.fn(),
  shareQuizResult: vi.fn(),
}));

import {
  hasRewardAdConfigured,
  isRewardAdSupported,
  shareQuizResult,
  showRewardAd,
} from '../utils/tossRewards';

const mockedHasRewardAdConfigured = vi.mocked(hasRewardAdConfigured);
const mockedIsRewardAdSupported = vi.mocked(isRewardAdSupported);
const mockedShowRewardAd = vi.mocked(showRewardAd);
const mockedShareQuizResult = vi.mocked(shareQuizResult);

describe('reward flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedHasRewardAdConfigured.mockReturnValue(true);
    mockedIsRewardAdSupported.mockReturnValue(true);
  });

  it('disables the ad reward button when the ad is not supported in the environment', () => {
    mockedHasRewardAdConfigured.mockReturnValue(true);
    mockedIsRewardAdSupported.mockReturnValue(false);

    render(
      <MenuScreen
        loading={false}
        error={null}
        playStatus={{ free_remaining: 0, bonus_remaining: 0, total_remaining: 0 }}
        canPlay={false}
        onStartGame={vi.fn()}
        onRewardPlay={vi.fn().mockResolvedValue(false)}
      />,
    );

    expect(screen.getByRole('button', { name: '📺 광고 보고 +1회 얻기' })).toBeDisabled();
    expect(screen.getByText('광고 보상은 토스 앱 안에서만 사용할 수 있어요.')).toBeInTheDocument();
  });

  it('grants an ad reward only after the rewarded ad completes successfully', async () => {
    const onRewardPlay = vi.fn().mockResolvedValue(true);
    mockedShowRewardAd.mockResolvedValue(true);

    render(
      <MenuScreen
        loading={false}
        error={null}
        playStatus={{ free_remaining: 0, bonus_remaining: 0, total_remaining: 0 }}
        canPlay={false}
        onStartGame={vi.fn()}
        onRewardPlay={onRewardPlay}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '📺 광고 보고 +1회 얻기' }));

    await waitFor(() => {
      expect(mockedShowRewardAd).toHaveBeenCalledOnce();
      expect(onRewardPlay).toHaveBeenCalledWith('ad');
    });
  });

  it('does not grant an ad reward when the ad is closed without a reward event', async () => {
    const onRewardPlay = vi.fn().mockResolvedValue(true);
    mockedShowRewardAd.mockResolvedValue(false);

    render(
      <MenuScreen
        loading={false}
        error={null}
        playStatus={{ free_remaining: 0, bonus_remaining: 0, total_remaining: 0 }}
        canPlay={false}
        onStartGame={vi.fn()}
        onRewardPlay={onRewardPlay}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '📺 광고 보고 +1회 얻기' }));

    await waitFor(() => {
      expect(mockedShowRewardAd).toHaveBeenCalledOnce();
    });
    expect(onRewardPlay).not.toHaveBeenCalled();
  });

  it('grants a share reward after a successful result share when the user has no plays left', async () => {
    const onRewardPlay = vi.fn().mockResolvedValue(true);
    mockedShareQuizResult.mockResolvedValue(true);

    render(
      <ResultScreen
        quizHistory={[]}
        correctCount={7}
        totalCount={10}
        accuracy={70}
        rankInfo={{
          title: '도전자',
          description: '계속 도전해보세요',
          color: 'from-emerald-500 to-teal-500',
          bgColor: 'from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          character: '🧠',
        }}
        showConfetti={false}
        loading={false}
        canPlay={false}
        onBackToMenu={vi.fn()}
        onRetry={vi.fn()}
        onRewardPlay={onRewardPlay}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '📤 결과 공유하고 +1회 얻기' }));

    await waitFor(() => {
      expect(mockedShareQuizResult).toHaveBeenCalledWith({
        correctCount: 7,
        totalCount: 10,
        accuracy: 70,
      });
      expect(onRewardPlay).toHaveBeenCalledWith('share');
    });
    expect(screen.getByText('공유 리워드가 지급됐어요. 바로 다시 도전할 수 있어요.')).toBeInTheDocument();
  });
});
