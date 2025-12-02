// 게임 모드
export type GameMode = 'menu' | 'playing' | 'result';

// 등급 정보 인터페이스
export interface RankInfo {
  title: string;
  character: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
