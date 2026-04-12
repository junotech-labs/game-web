import '@testing-library/jest-dom/vitest';

// @apps-in-toss/web-framework 모킹
vi.mock('@apps-in-toss/web-framework', () => ({
  Analytics: {
    impression: vi.fn(),
    click: vi.fn(),
  },
  getAnonymousKey: vi.fn().mockResolvedValue({ hash: 'test-user-hash', type: 'HASH' }),
  submitGameCenterLeaderBoardScore: vi.fn().mockResolvedValue({ statusCode: 'SUCCESS' }),
  getTossShareLink: vi.fn().mockResolvedValue('https://test-share-link'),
  share: vi.fn().mockResolvedValue(undefined),
  loadFullScreenAd: Object.assign(vi.fn(), { isSupported: () => false }),
  showFullScreenAd: Object.assign(vi.fn(), { isSupported: () => false }),
}));
