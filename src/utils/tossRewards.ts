import {
  loadFullScreenAd,
  showFullScreenAd,
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
    loadFullScreenAd?.isSupported?.() === true &&
    showFullScreenAd?.isSupported?.() === true
  );
}

/**
 * 보상형 광고를 표시하고, userEarnedReward 이벤트 발생 시에만 true를 반환합니다.
 * 문서: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/광고/IntegratedAd.md
 */
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

    // load → show 순서 (문서 권장 패턴)
    cleanupLoad = loadFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type !== 'loaded') return;

        cleanupShow = showFullScreenAd({
          options: { adGroupId },
          onEvent: (showEvent) => {
            // userEarnedReward 이벤트에서만 리워드 지급 (문서 명시)
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

/**
 * 결과 공유 (순수 공유만, 리워드 없음).
 * 공유 리워드가 필요하면 contactsViral + 콘솔 moduleId 등록이 필요합니다.
 */
export async function shareQuizResult({
  correctCount,
  totalCount,
  accuracy,
}: ShareQuizResultOptions): Promise<void> {
  const link = await getTossShareLink('intoss://common-sense');
  await share({
    message: `🧠 상식 퀴즈에서 ${correctCount}/${totalCount} 맞췄어요! (${accuracy}%) 도전해보세요!\n${link}`,
  });
}
