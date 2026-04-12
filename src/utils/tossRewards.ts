import {
  GoogleAdMob,
  getTossShareLink,
  share,
} from '@apps-in-toss/web-framework';

interface ShareQuizResultOptions {
  correctCount: number;
  totalCount: number;
  accuracy: number;
}

function getRewardAdGroupId(): string {
  return import.meta.env.VITE_REWARD_AD_GROUP_ID?.trim() ?? '';
}

export function hasRewardAdConfigured(): boolean {
  return getRewardAdGroupId().length > 0;
}

export function isRewardAdSupported(): boolean {
  return (
    GoogleAdMob?.loadAppsInTossAdMob?.isSupported?.() === true &&
    GoogleAdMob?.showAppsInTossAdMob?.isSupported?.() === true
  );
}

export async function showRewardAd(): Promise<boolean> {
  const adGroupId = getRewardAdGroupId();

  if (!adGroupId || !isRewardAdSupported()) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    let settled = false;
    let cleanupLoad: (() => void) | undefined;
    let cleanupShow: (() => void) | undefined;

    const finish = (rewarded: boolean) => {
      if (settled) return;
      settled = true;
      cleanupLoad?.();
      cleanupShow?.();
      resolve(rewarded);
    };

    cleanupLoad = GoogleAdMob.loadAppsInTossAdMob({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type !== 'loaded') return;

        cleanupShow = GoogleAdMob.showAppsInTossAdMob({
          options: { adGroupId },
          onEvent: (showEvent) => {
            if (showEvent.type === 'userEarnedReward') {
              finish(true);
              return;
            }

            if (showEvent.type === 'dismissed' || showEvent.type === 'failedToShow') {
              finish(false);
            }
          },
          onError: () => finish(false),
        });
      },
      onError: () => finish(false),
    });
  });
}

export async function shareQuizResult({
  correctCount,
  totalCount,
  accuracy,
}: ShareQuizResultOptions): Promise<boolean> {
  try {
    const link = await getTossShareLink('intoss://common-sense');
    await share({
      message: `🧠 상식 퀴즈에서 ${correctCount}/${totalCount} 맞췄어요! (${accuracy}%) 도전해보세요!\n${link}`,
    });
    return true;
  } catch {
    return false;
  }
}
