/**
 * Sport Scoring Validation Tests
 * Tests for table tennis, tennis, and badminton scoring rules
 */

import { describe, it, expect } from "vitest";

// Sport scoring configurations (matching the ones in match-record page)
const sportScoringConfig = {
  TABLE_TENNIS: {
    icon: "🏓",
    label: "탁구",
    pointsToWin: 11,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 3,
    maxSets: 5,
    validateSet: (a: number, b: number) => {
      const winScore = Math.max(a, b);
      const loseScore = Math.min(a, b);
      if (winScore < 11) return { valid: false, error: "최소 11점 이상이어야 합니다" };
      if (winScore - loseScore < 2 && winScore < 30) return { valid: false, error: "2점 이상 차이가 나야 합니다" };
      return { valid: true };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winSets = Math.max(setsA, setsB);
      if (winSets < 3) return { valid: false, error: "3세트 이상 이겨야 합니다" };
      if (setsA + setsB > 5) return { valid: false, error: "최대 5세트까지 가능합니다" };
      return { valid: true };
    },
  },
  TENNIS: {
    icon: "🎾",
    label: "테니스",
    gamesPerSet: 6,
    minGameDiff: 2,
    tiebreakAt: 6,
    setsToWin: 2,
    maxSets: 3,
    validateSet: (a: number, b: number) => {
      const winGames = Math.max(a, b);
      const loseGames = Math.min(a, b);
      if (winGames === 6 && loseGames <= 4) return { valid: true };
      if (winGames === 7 && (loseGames === 5 || loseGames === 6)) return { valid: true };
      return { valid: false, error: "유효하지 않은 테니스 세트 점수입니다" };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winSets = Math.max(setsA, setsB);
      if (winSets < 2) return { valid: false, error: "2세트 이상 이겨야 합니다" };
      if (setsA + setsB > 3) return { valid: false, error: "최대 3세트까지 가능합니다" };
      return { valid: true };
    },
  },
  BADMINTON: {
    icon: "🏸",
    label: "배드민턴",
    pointsToWin: 21,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 2,
    maxSets: 3,
    validateSet: (a: number, b: number) => {
      const winScore = Math.max(a, b);
      const loseScore = Math.min(a, b);
      if (winScore < 21) return { valid: false, error: "최소 21점 이상이어야 합니다" };
      if (winScore - loseScore < 2 && winScore < 30) return { valid: false, error: "2점 이상 차이가 나야 합니다" };
      return { valid: true };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winSets = Math.max(setsA, setsB);
      if (winSets < 2) return { valid: false, error: "2세트 이상 이겨야 합니다" };
      if (setsA + setsB > 3) return { valid: false, error: "최대 3세트까지 가능합니다" };
      return { valid: true };
    },
  },
};

describe("Table Tennis Scoring Validation", () => {
  const config = sportScoringConfig.TABLE_TENNIS;

  describe("Set Validation", () => {
    it("should validate standard 11-point winning score", () => {
      expect(config.validateSet(11, 5).valid).toBe(true);
      expect(config.validateSet(11, 9).valid).toBe(true);
      expect(config.validateSet(11, 0).valid).toBe(true);
    });

    it("should reject scores below 11 points", () => {
      const result = config.validateSet(10, 8);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("최소 11점 이상이어야 합니다");
    });

    it("should require 2 point difference for deuce situations", () => {
      expect(config.validateSet(11, 10).valid).toBe(false);
      expect(config.validateSet(12, 10).valid).toBe(true);
      expect(config.validateSet(15, 13).valid).toBe(true);
    });

    it("should handle 30-point cap in deuce", () => {
      // At 30 points, 1 point difference is enough
      expect(config.validateSet(30, 29).valid).toBe(true);
      expect(config.validateSet(30, 28).valid).toBe(true);
    });

    it("should validate extended deuce games", () => {
      expect(config.validateSet(14, 12).valid).toBe(true);
      expect(config.validateSet(20, 18).valid).toBe(true);
      expect(config.validateSet(25, 23).valid).toBe(true);
    });
  });

  describe("Match Validation", () => {
    it("should require minimum 3 sets to win", () => {
      expect(config.validateMatch(3, 0).valid).toBe(true);
      expect(config.validateMatch(3, 1).valid).toBe(true);
      expect(config.validateMatch(3, 2).valid).toBe(true);
      expect(config.validateMatch(2, 1).valid).toBe(false);
    });

    it("should reject more than 5 total sets", () => {
      expect(config.validateMatch(3, 3).valid).toBe(false);
      expect(config.validateMatch(4, 2).valid).toBe(false);
    });

    it("should validate valid match scores", () => {
      expect(config.validateMatch(3, 0).valid).toBe(true);
      expect(config.validateMatch(0, 3).valid).toBe(true);
      expect(config.validateMatch(3, 2).valid).toBe(true);
    });
  });
});

describe("Tennis Scoring Validation", () => {
  const config = sportScoringConfig.TENNIS;

  describe("Set Validation", () => {
    it("should validate standard 6-x winning scores", () => {
      expect(config.validateSet(6, 0).valid).toBe(true);
      expect(config.validateSet(6, 1).valid).toBe(true);
      expect(config.validateSet(6, 2).valid).toBe(true);
      expect(config.validateSet(6, 3).valid).toBe(true);
      expect(config.validateSet(6, 4).valid).toBe(true);
    });

    it("should validate 7-5 score", () => {
      expect(config.validateSet(7, 5).valid).toBe(true);
      expect(config.validateSet(5, 7).valid).toBe(true);
    });

    it("should validate 7-6 tiebreak score", () => {
      expect(config.validateSet(7, 6).valid).toBe(true);
      expect(config.validateSet(6, 7).valid).toBe(true);
    });

    it("should reject invalid tennis set scores", () => {
      expect(config.validateSet(6, 5).valid).toBe(false);
      expect(config.validateSet(7, 4).valid).toBe(false);
      expect(config.validateSet(8, 6).valid).toBe(false);
      expect(config.validateSet(5, 5).valid).toBe(false);
    });

    it("should reject scores that don't follow tennis rules", () => {
      expect(config.validateSet(11, 9).valid).toBe(false);
      expect(config.validateSet(21, 19).valid).toBe(false);
    });
  });

  describe("Match Validation", () => {
    it("should require minimum 2 sets to win", () => {
      expect(config.validateMatch(2, 0).valid).toBe(true);
      expect(config.validateMatch(2, 1).valid).toBe(true);
      expect(config.validateMatch(1, 0).valid).toBe(false);
    });

    it("should reject more than 3 total sets", () => {
      expect(config.validateMatch(2, 2).valid).toBe(false);
      expect(config.validateMatch(3, 1).valid).toBe(false);
    });

    it("should validate 3-set match", () => {
      expect(config.validateMatch(2, 1).valid).toBe(true);
      expect(config.validateMatch(1, 2).valid).toBe(true);
    });
  });
});

describe("Badminton Scoring Validation", () => {
  const config = sportScoringConfig.BADMINTON;

  describe("Set Validation", () => {
    it("should validate standard 21-point winning score", () => {
      expect(config.validateSet(21, 15).valid).toBe(true);
      expect(config.validateSet(21, 19).valid).toBe(true);
      expect(config.validateSet(21, 0).valid).toBe(true);
    });

    it("should reject scores below 21 points", () => {
      const result = config.validateSet(20, 18);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("최소 21점 이상이어야 합니다");
    });

    it("should require 2 point difference for deuce situations", () => {
      expect(config.validateSet(21, 20).valid).toBe(false);
      expect(config.validateSet(22, 20).valid).toBe(true);
      expect(config.validateSet(25, 23).valid).toBe(true);
    });

    it("should handle 30-point cap in deuce", () => {
      expect(config.validateSet(30, 29).valid).toBe(true);
      expect(config.validateSet(30, 28).valid).toBe(true);
    });

    it("should validate extended deuce games", () => {
      expect(config.validateSet(24, 22).valid).toBe(true);
      expect(config.validateSet(28, 26).valid).toBe(true);
    });
  });

  describe("Match Validation", () => {
    it("should require minimum 2 sets to win", () => {
      expect(config.validateMatch(2, 0).valid).toBe(true);
      expect(config.validateMatch(2, 1).valid).toBe(true);
      expect(config.validateMatch(1, 0).valid).toBe(false);
    });

    it("should reject more than 3 total sets", () => {
      expect(config.validateMatch(2, 2).valid).toBe(false);
      expect(config.validateMatch(3, 1).valid).toBe(false);
    });

    it("should validate valid match scores", () => {
      expect(config.validateMatch(2, 0).valid).toBe(true);
      expect(config.validateMatch(0, 2).valid).toBe(true);
      expect(config.validateMatch(2, 1).valid).toBe(true);
    });
  });
});

describe("Cross-Sport Edge Cases", () => {
  it("should not confuse table tennis and badminton scores", () => {
    // 11-9 is valid for table tennis but not badminton
    expect(sportScoringConfig.TABLE_TENNIS.validateSet(11, 9).valid).toBe(true);
    expect(sportScoringConfig.BADMINTON.validateSet(11, 9).valid).toBe(false);

    // 21-19 is valid for badminton but not standard for tennis
    expect(sportScoringConfig.BADMINTON.validateSet(21, 19).valid).toBe(true);
    expect(sportScoringConfig.TENNIS.validateSet(21, 19).valid).toBe(false);
  });

  it("should have correct sets to win for each sport", () => {
    expect(sportScoringConfig.TABLE_TENNIS.setsToWin).toBe(3);
    expect(sportScoringConfig.TENNIS.setsToWin).toBe(2);
    expect(sportScoringConfig.BADMINTON.setsToWin).toBe(2);
  });

  it("should have correct max sets for each sport", () => {
    expect(sportScoringConfig.TABLE_TENNIS.maxSets).toBe(5);
    expect(sportScoringConfig.TENNIS.maxSets).toBe(3);
    expect(sportScoringConfig.BADMINTON.maxSets).toBe(3);
  });
});
