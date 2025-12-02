import { RankInfo } from '../types/game';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../constants/game';

/**
 * 카테고리에 해당하는 배경색 클래스 반환
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
}

/**
 * 정답 개수에 따른 등급 정보 반환
 */
export function getRankInfo(correctCount: number): RankInfo {
  const rankMap: Record<number, RankInfo> = {
    10: {
      title: '완벽한 천재',
      character: '🧙‍♂️',
      description: '당신은 퀴즈의 신입니다!',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-400',
    },
    9: {
      title: '지식 박사',
      character: '🦉',
      description: '거의 완벽해요! 한 문제만 더!',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-400',
    },
    8: {
      title: '똑똒이',
      character: '🦊',
      description: '훌륭해요! 상위 20% 실력!',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-400',
    },
    7: {
      title: '합격선 통과',
      character: '🎓',
      description: '합격! 평균 이상이에요!',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-400',
    },
    6: {
      title: '노력파',
      character: '🐰',
      description: '조금만 더 노력하면 합격!',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-400',
    },
    5: {
      title: '반반 성공',
      character: '🌗',
      description: '반은 맞췄네요. 분발하세요!',
      color: 'from-lime-400 to-green-500',
      bgColor: 'from-lime-50 to-green-50',
      borderColor: 'border-lime-400',
    },
    4: {
      title: '분발 필요',
      character: '🌱',
      description: '공부가 더 필요해요!',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-400',
    },
    3: {
      title: '초보자',
      character: '🐣',
      description: '처음이라 그렇죠... 맞죠?',
      color: 'from-yellow-300 to-amber-400',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
    },
    2: {
      title: '용기만 100점',
      character: '🎲',
      description: '용기는 인정합니다!',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-400',
    },
    1: {
      title: '운빨 성공',
      character: '🍀',
      description: '찍기의 달인!',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-400',
    },
  };

  // 기본값 (0점)
  const defaultRank: RankInfo = {
    title: '역대급 도전',
    character: '💀',
    description: '이것도 재능입니다...',
    color: 'from-gray-400 to-slate-500',
    bgColor: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-400',
  };

  return rankMap[correctCount] || defaultRank;
}
