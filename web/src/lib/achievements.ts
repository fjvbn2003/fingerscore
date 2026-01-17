/**
 * Achievement System for FingerScore
 * 탁구 동호인을 위한 업적/뱃지 시스템
 */

export type AchievementCategory =
  | "MATCHES"
  | "TOURNAMENTS"
  | "RATING"
  | "STREAK"
  | "SOCIAL"
  | "SPECIAL";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "LEGENDARY";
  requirement: number;
  points: number;
  secret?: boolean;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  progress: number;
}

// 업적 정의
export const ACHIEVEMENTS: Achievement[] = [
  // === MATCHES 카테고리 ===
  {
    id: "first_match",
    name: "첫 발을 내딛다",
    description: "첫 경기를 완료하세요",
    icon: "🎾",
    category: "MATCHES",
    tier: "BRONZE",
    requirement: 1,
    points: 10,
  },
  {
    id: "matches_10",
    name: "워밍업 완료",
    description: "10경기를 완료하세요",
    icon: "🏃",
    category: "MATCHES",
    tier: "BRONZE",
    requirement: 10,
    points: 25,
  },
  {
    id: "matches_50",
    name: "단골 선수",
    description: "50경기를 완료하세요",
    icon: "⭐",
    category: "MATCHES",
    tier: "SILVER",
    requirement: 50,
    points: 50,
  },
  {
    id: "matches_100",
    name: "백전노장",
    description: "100경기를 완료하세요",
    icon: "💯",
    category: "MATCHES",
    tier: "GOLD",
    requirement: 100,
    points: 100,
  },
  {
    id: "matches_500",
    name: "철인",
    description: "500경기를 완료하세요",
    icon: "🦾",
    category: "MATCHES",
    tier: "PLATINUM",
    requirement: 500,
    points: 300,
  },
  {
    id: "matches_1000",
    name: "탁구의 신",
    description: "1000경기를 완료하세요",
    icon: "👑",
    category: "MATCHES",
    tier: "LEGENDARY",
    requirement: 1000,
    points: 500,
  },

  // === TOURNAMENTS 카테고리 ===
  {
    id: "first_tournament",
    name: "도전자",
    description: "첫 대회에 참가하세요",
    icon: "🎯",
    category: "TOURNAMENTS",
    tier: "BRONZE",
    requirement: 1,
    points: 15,
  },
  {
    id: "first_win",
    name: "승리의 맛",
    description: "대회에서 첫 승리를 거두세요",
    icon: "✌️",
    category: "TOURNAMENTS",
    tier: "BRONZE",
    requirement: 1,
    points: 20,
  },
  {
    id: "tournament_top4",
    name: "4강 진출",
    description: "대회에서 4강에 진출하세요",
    icon: "🏅",
    category: "TOURNAMENTS",
    tier: "SILVER",
    requirement: 1,
    points: 50,
  },
  {
    id: "tournament_finals",
    name: "결승 진출자",
    description: "대회 결승에 진출하세요",
    icon: "🥈",
    category: "TOURNAMENTS",
    tier: "GOLD",
    requirement: 1,
    points: 75,
  },
  {
    id: "tournament_champion",
    name: "챔피언",
    description: "대회에서 우승하세요",
    icon: "🏆",
    category: "TOURNAMENTS",
    tier: "GOLD",
    requirement: 1,
    points: 100,
  },
  {
    id: "tournaments_5",
    name: "대회 마니아",
    description: "5개 대회에 참가하세요",
    icon: "📋",
    category: "TOURNAMENTS",
    tier: "SILVER",
    requirement: 5,
    points: 50,
  },
  {
    id: "champion_3",
    name: "트리플 크라운",
    description: "3개 대회에서 우승하세요",
    icon: "👑",
    category: "TOURNAMENTS",
    tier: "PLATINUM",
    requirement: 3,
    points: 200,
  },

  // === RATING 카테고리 ===
  {
    id: "rating_1200",
    name: "실버 달성",
    description: "레이팅 1200점에 도달하세요",
    icon: "🥈",
    category: "RATING",
    tier: "BRONZE",
    requirement: 1200,
    points: 30,
  },
  {
    id: "rating_1400",
    name: "골드 달성",
    description: "레이팅 1400점에 도달하세요",
    icon: "🥇",
    category: "RATING",
    tier: "SILVER",
    requirement: 1400,
    points: 50,
  },
  {
    id: "rating_1600",
    name: "플래티넘 달성",
    description: "레이팅 1600점에 도달하세요",
    icon: "💎",
    category: "RATING",
    tier: "GOLD",
    requirement: 1600,
    points: 100,
  },
  {
    id: "rating_1800",
    name: "다이아 달성",
    description: "레이팅 1800점에 도달하세요",
    icon: "💠",
    category: "RATING",
    tier: "GOLD",
    requirement: 1800,
    points: 150,
  },
  {
    id: "rating_2000",
    name: "마스터 등극",
    description: "레이팅 2000점에 도달하세요",
    icon: "🏅",
    category: "RATING",
    tier: "PLATINUM",
    requirement: 2000,
    points: 250,
  },
  {
    id: "rating_2200",
    name: "그랜드마스터",
    description: "레이팅 2200점에 도달하세요",
    icon: "👑",
    category: "RATING",
    tier: "LEGENDARY",
    requirement: 2200,
    points: 500,
  },

  // === STREAK 카테고리 ===
  {
    id: "win_streak_3",
    name: "연승 시작",
    description: "3연승을 달성하세요",
    icon: "🔥",
    category: "STREAK",
    tier: "BRONZE",
    requirement: 3,
    points: 15,
  },
  {
    id: "win_streak_5",
    name: "핫 스트릭",
    description: "5연승을 달성하세요",
    icon: "🔥🔥",
    category: "STREAK",
    tier: "SILVER",
    requirement: 5,
    points: 30,
  },
  {
    id: "win_streak_10",
    name: "무적",
    description: "10연승을 달성하세요",
    icon: "🔥🔥🔥",
    category: "STREAK",
    tier: "GOLD",
    requirement: 10,
    points: 75,
  },
  {
    id: "perfect_match",
    name: "완벽한 경기",
    description: "3-0 완승을 거두세요",
    icon: "💯",
    category: "STREAK",
    tier: "BRONZE",
    requirement: 1,
    points: 20,
  },
  {
    id: "comeback_king",
    name: "역전의 명수",
    description: "0-2에서 3-2 역전승을 거두세요",
    icon: "🔄",
    category: "STREAK",
    tier: "GOLD",
    requirement: 1,
    points: 50,
  },

  // === SOCIAL 카테고리 ===
  {
    id: "first_post",
    name: "소통 시작",
    description: "첫 게시글을 작성하세요",
    icon: "✍️",
    category: "SOCIAL",
    tier: "BRONZE",
    requirement: 1,
    points: 10,
  },
  {
    id: "helpful_post",
    name: "도움이 되는 글",
    description: "게시글이 10개 좋아요를 받으세요",
    icon: "❤️",
    category: "SOCIAL",
    tier: "SILVER",
    requirement: 10,
    points: 30,
  },
  {
    id: "popular_post",
    name: "인기 작성자",
    description: "게시글이 50개 좋아요를 받으세요",
    icon: "💖",
    category: "SOCIAL",
    tier: "GOLD",
    requirement: 50,
    points: 75,
  },
  {
    id: "rivals_3",
    name: "라이벌 탄생",
    description: "같은 상대와 3번 이상 대결하세요",
    icon: "⚔️",
    category: "SOCIAL",
    tier: "BRONZE",
    requirement: 3,
    points: 20,
  },
  {
    id: "rivals_10",
    name: "숙명의 라이벌",
    description: "같은 상대와 10번 이상 대결하세요",
    icon: "🗡️",
    category: "SOCIAL",
    tier: "SILVER",
    requirement: 10,
    points: 50,
  },

  // === SPECIAL 카테고리 (숨겨진 업적) ===
  {
    id: "giant_killer",
    name: "자이언트 킬러",
    description: "200점 이상 높은 상대를 이기세요",
    icon: "🐉",
    category: "SPECIAL",
    tier: "GOLD",
    requirement: 1,
    points: 100,
    secret: true,
  },
  {
    id: "deuce_master",
    name: "듀스 마스터",
    description: "듀스에서 3번 연속 승리하세요",
    icon: "⚡",
    category: "SPECIAL",
    tier: "SILVER",
    requirement: 3,
    points: 40,
    secret: true,
  },
  {
    id: "night_owl",
    name: "밤의 수호자",
    description: "자정 이후에 경기를 완료하세요",
    icon: "🦉",
    category: "SPECIAL",
    tier: "BRONZE",
    requirement: 1,
    points: 15,
    secret: true,
  },
  {
    id: "early_bird",
    name: "아침형 인간",
    description: "오전 7시 이전에 경기를 완료하세요",
    icon: "🐦",
    category: "SPECIAL",
    tier: "BRONZE",
    requirement: 1,
    points: 15,
    secret: true,
  },
  {
    id: "marathon",
    name: "마라톤 매치",
    description: "5세트 풀세트 경기를 완료하세요",
    icon: "🏃‍♂️",
    category: "SPECIAL",
    tier: "SILVER",
    requirement: 1,
    points: 30,
    secret: true,
  },
];

/**
 * 업적 진행도 계산
 */
export function calculateProgress(
  achievement: Achievement,
  currentValue: number
): number {
  return Math.min(100, Math.round((currentValue / achievement.requirement) * 100));
}

/**
 * 업적 달성 여부 확인
 */
export function isAchievementUnlocked(
  achievement: Achievement,
  currentValue: number
): boolean {
  return currentValue >= achievement.requirement;
}

/**
 * 카테고리별 업적 필터링
 */
export function getAchievementsByCategory(
  category: AchievementCategory
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * 티어별 색상
 */
export const TIER_COLORS = {
  BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
  SILVER: "bg-gray-100 text-gray-800 border-gray-300",
  GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PLATINUM: "bg-cyan-100 text-cyan-800 border-cyan-300",
  LEGENDARY: "bg-purple-100 text-purple-800 border-purple-300",
};

/**
 * 총 업적 포인트 계산
 */
export function calculateTotalPoints(unlockedAchievements: UserAchievement[]): number {
  return unlockedAchievements.reduce((total, ua) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === ua.achievementId);
    return total + (achievement?.points || 0);
  }, 0);
}

/**
 * 다음 달성 가능한 업적 추천
 */
export function getNextRecommendedAchievements(
  unlockedIds: string[],
  stats: {
    matchCount: number;
    tournamentCount: number;
    rating: number;
    winStreak: number;
  }
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => {
    if (unlockedIds.includes(a.id)) return false;
    if (a.secret) return false;

    // 진행률 50% 이상인 업적만 추천
    let progress = 0;
    switch (a.category) {
      case "MATCHES":
        progress = calculateProgress(a, stats.matchCount);
        break;
      case "TOURNAMENTS":
        progress = calculateProgress(a, stats.tournamentCount);
        break;
      case "RATING":
        progress = calculateProgress(a, stats.rating);
        break;
      case "STREAK":
        progress = calculateProgress(a, stats.winStreak);
        break;
      default:
        progress = 0;
    }

    return progress >= 50 && progress < 100;
  }).slice(0, 3);
}
