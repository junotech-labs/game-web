import { describe, it, expect } from 'vitest';
import { getCategoryColor, getRankInfo } from '../utils/quiz';

describe('getCategoryColor', () => {
  it('알려진 카테고리에 대해 색상 반환', () => {
    const color = getCategoryColor('지리');
    expect(color).toBeTruthy();
    expect(color).toContain('bg-');
  });

  it('알 수 없는 카테고리에 대해 기본 색상 반환', () => {
    const color = getCategoryColor('존재하지않는카테고리');
    expect(color).toBeTruthy();
  });
});

describe('getRankInfo', () => {
  it('10점 만점 시 최고 등급 반환', () => {
    const rank = getRankInfo(10);
    expect(rank.title).toBe('완벽한 천재');
    expect(rank.character).toBe('🧙‍♂️');
  });

  it('0점 시 최저 등급 반환', () => {
    const rank = getRankInfo(0);
    expect(rank.title).toBe('역대급 도전');
    expect(rank.character).toBe('💀');
  });

  it('모든 점수(0~10)에 대해 유효한 rank 반환', () => {
    for (let i = 0; i <= 10; i++) {
      const rank = getRankInfo(i);
      expect(rank.title).toBeTruthy();
      expect(rank.character).toBeTruthy();
      expect(rank.description).toBeTruthy();
      expect(rank.color).toBeTruthy();
      expect(rank.bgColor).toBeTruthy();
      expect(rank.borderColor).toBeTruthy();
    }
  });

  it('범위 밖 점수에 대해 기본값 반환', () => {
    const rank = getRankInfo(-1);
    expect(rank.title).toBe('역대급 도전');

    const rankOver = getRankInfo(11);
    expect(rankOver.title).toBe('역대급 도전');
  });

  it('각 등급의 title이 고유함', () => {
    const titles = new Set<string>();
    for (let i = 0; i <= 10; i++) {
      titles.add(getRankInfo(i).title);
    }
    expect(titles.size).toBe(11);
  });
});
