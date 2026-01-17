/**
 * ELO Rating System for FingerScore
 * 탁구 동호인을 위한 ELO 레이팅 시스템
 */

// 기본 설정
const DEFAULT_RATING = 1500;
const K_FACTOR_NEW = 40; // 신규 선수 (10경기 미만)
const K_FACTOR_NORMAL = 20; // 일반 선수
const K_FACTOR_VETERAN = 10; // 고레이팅 선수 (2400+)

export interface Player {
  id: string;
  name: string;
  rating: number;
  matchCount: number;
}

export interface MatchResult {
  winnerId: string;
  loserId: string;
  winnerScore: number;
  loserScore: number;
  isForfeit?: boolean;
}

export interface RatingChange {
  playerId: string;
  oldRating: number;
  newRating: number;
  change: number;
}

/**
 * K-Factor 계산 (선수의 경험과 레이팅에 따라 변동)
 */
export function getKFactor(player: Player): number {
  if (player.matchCount < 10) {
    return K_FACTOR_NEW; // 신규 선수는 빠르게 적정 레이팅 도달
  }
  if (player.rating >= 2400) {
    return K_FACTOR_VETERAN; // 고레이팅은 변동 최소화
  }
  return K_FACTOR_NORMAL;
}

/**
 * 예상 승률 계산 (ELO 공식)
 */
export function calculateExpectedScore(
  playerRating: number,
  opponentRating: number
): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * 레이팅 변화량 계산
 */
export function calculateRatingChange(
  winner: Player,
  loser: Player,
  scoreMargin?: number
): { winnerChange: number; loserChange: number } {
  const expectedWin = calculateExpectedScore(winner.rating, loser.rating);
  const expectedLose = calculateExpectedScore(loser.rating, winner.rating);

  const kWinner = getKFactor(winner);
  const kLoser = getKFactor(loser);

  // 점수 차이에 따른 보너스 (대승 시 추가 점수)
  let marginBonus = 1;
  if (scoreMargin !== undefined && scoreMargin > 0) {
    // 3-0 승리 시 1.25배, 3-1 승리 시 1.1배
    marginBonus = 1 + Math.min(scoreMargin * 0.05, 0.25);
  }

  const winnerChange = Math.round(kWinner * (1 - expectedWin) * marginBonus);
  const loserChange = Math.round(kLoser * (0 - expectedLose));

  return { winnerChange, loserChange };
}

/**
 * 경기 결과 반영하여 새 레이팅 계산
 */
export function processMatch(
  winner: Player,
  loser: Player,
  winnerScore: number,
  loserScore: number
): { winner: RatingChange; loser: RatingChange } {
  const scoreMargin = winnerScore - loserScore;
  const { winnerChange, loserChange } = calculateRatingChange(
    winner,
    loser,
    scoreMargin
  );

  return {
    winner: {
      playerId: winner.id,
      oldRating: winner.rating,
      newRating: Math.max(100, winner.rating + winnerChange), // 최소 100
      change: winnerChange,
    },
    loser: {
      playerId: loser.id,
      oldRating: loser.rating,
      newRating: Math.max(100, loser.rating + loserChange),
      change: loserChange,
    },
  };
}

/**
 * 레이팅 시뮬레이터 - "이 상대를 이기면 몇 점 오를까?" 미리보기
 */
export function simulateMatch(
  myRating: number,
  opponentRating: number,
  myMatchCount: number = 30
): {
  winPoints: number;
  losePoints: number;
  expectedWinRate: number;
  upsetBonus: number;
} {
  const me: Player = {
    id: "me",
    name: "Me",
    rating: myRating,
    matchCount: myMatchCount,
  };

  const opponent: Player = {
    id: "opponent",
    name: "Opponent",
    rating: opponentRating,
    matchCount: 30,
  };

  const expectedWinRate = calculateExpectedScore(myRating, opponentRating);
  const { winnerChange: winPoints } = calculateRatingChange(me, opponent);
  const { loserChange: losePoints } = calculateRatingChange(opponent, me);

  // 업셋 보너스 (언더독이 이길 경우)
  const upsetBonus = myRating < opponentRating ? winPoints : 0;

  return {
    winPoints,
    losePoints: Math.abs(losePoints),
    expectedWinRate: Math.round(expectedWinRate * 100),
    upsetBonus,
  };
}

/**
 * 레이팅 티어 계산
 */
export type RatingTier =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER";

export interface TierInfo {
  tier: RatingTier;
  name: string;
  koreanName: string;
  minRating: number;
  maxRating: number;
  color: string;
  icon: string;
}

export const TIER_CONFIG: TierInfo[] = [
  { tier: "BRONZE", name: "Bronze", koreanName: "브론즈", minRating: 0, maxRating: 1199, color: "#CD7F32", icon: "🥉" },
  { tier: "SILVER", name: "Silver", koreanName: "실버", minRating: 1200, maxRating: 1399, color: "#C0C0C0", icon: "🥈" },
  { tier: "GOLD", name: "Gold", koreanName: "골드", minRating: 1400, maxRating: 1599, color: "#FFD700", icon: "🥇" },
  { tier: "PLATINUM", name: "Platinum", koreanName: "플래티넘", minRating: 1600, maxRating: 1799, color: "#00CED1", icon: "💎" },
  { tier: "DIAMOND", name: "Diamond", koreanName: "다이아몬드", minRating: 1800, maxRating: 1999, color: "#B9F2FF", icon: "💠" },
  { tier: "MASTER", name: "Master", koreanName: "마스터", minRating: 2000, maxRating: 2199, color: "#9932CC", icon: "👑" },
  { tier: "GRANDMASTER", name: "Grandmaster", koreanName: "그랜드마스터", minRating: 2200, maxRating: 9999, color: "#FF4500", icon: "🏆" },
];

export function getTierInfo(rating: number): TierInfo {
  return TIER_CONFIG.find(
    (tier) => rating >= tier.minRating && rating <= tier.maxRating
  ) || TIER_CONFIG[0];
}

/**
 * 다음 티어까지 필요한 포인트 계산
 */
export function getProgressToNextTier(rating: number): {
  currentTier: TierInfo;
  nextTier: TierInfo | null;
  pointsNeeded: number;
  progressPercent: number;
} {
  const currentTier = getTierInfo(rating);
  const currentIndex = TIER_CONFIG.indexOf(currentTier);
  const nextTier = TIER_CONFIG[currentIndex + 1] || null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      pointsNeeded: 0,
      progressPercent: 100,
    };
  }

  const tierRange = currentTier.maxRating - currentTier.minRating + 1;
  const pointsInTier = rating - currentTier.minRating;
  const progressPercent = Math.round((pointsInTier / tierRange) * 100);

  return {
    currentTier,
    nextTier,
    pointsNeeded: nextTier.minRating - rating,
    progressPercent,
  };
}

/**
 * 연승/연패 스트릭 보너스 계산
 */
export function getStreakBonus(streak: number, isWinStreak: boolean): number {
  if (streak < 3) return 0;

  const bonusTable = [0, 0, 0, 5, 10, 15, 20, 25, 30];
  const bonus = bonusTable[Math.min(streak, 8)] || 30;

  return isWinStreak ? bonus : -Math.floor(bonus / 2);
}
