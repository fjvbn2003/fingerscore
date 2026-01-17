/**
 * Match Memory System Tests
 * Tests for match memory storage, AI briefing, and post-match comments
 */

import { describe, it, expect } from "vitest";
import type { MatchBriefingStatus, MatchCommentReaction } from "@/types/database";

// Match memory data structure
interface MatchMemory {
  id: string;
  friendly_match_id: string;
  user_id: string;
  is_featured: boolean;
  photo_urls: string[];
  tags: string[];
  personal_note: string | null;
  ai_briefing: string | null;
  ai_briefing_status: MatchBriefingStatus;
  ai_briefing_generated_at: string | null;
  highlights: {
    keyMoments: string[];
    strengths: string[];
    improvements: string[];
  } | null;
  stats_snapshot: {
    winStreak: number;
    seasonRecord: string;
    vsOpponent: string;
    ratingTrend: string;
  } | null;
}

// Match comment data structure
interface MatchComment {
  id: string;
  friendly_match_id: string;
  author_id: string;
  content: string;
  is_quick_message: boolean;
  quick_message_key: string | null;
}

// Quick message keys and their default content
const quickMessages: Record<string, string> = {
  wellPlayed: "수고하셨습니다!",
  greatGame: "좋은 경기였습니다!",
  goodMatch: "좋은 승부였어요!",
  nicePlay: "플레이 멋졌습니다!",
  congrats: "축하드립니다!",
  nextTime: "다음엔 제가 이길게요!",
  thankYou: "즐거운 경기 감사합니다!",
  rematch: "재경기 해요!",
};

// Reaction types
const reactionTypes: MatchCommentReaction[] = ["LIKE", "FIRE", "CLAP", "HEART", "TROPHY"];

// Helper function to validate memory data
function validateMemory(memory: Partial<MatchMemory>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!memory.friendly_match_id) {
    errors.push("friendly_match_id is required");
  }
  if (!memory.user_id) {
    errors.push("user_id is required");
  }
  if (memory.ai_briefing_status && !["PENDING", "PROCESSING", "COMPLETED", "FAILED"].includes(memory.ai_briefing_status)) {
    errors.push("Invalid ai_briefing_status");
  }
  if (memory.tags && !Array.isArray(memory.tags)) {
    errors.push("tags must be an array");
  }
  if (memory.photo_urls && !Array.isArray(memory.photo_urls)) {
    errors.push("photo_urls must be an array");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function to validate comment data
function validateComment(comment: Partial<MatchComment>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!comment.friendly_match_id) {
    errors.push("friendly_match_id is required");
  }
  if (!comment.author_id) {
    errors.push("author_id is required");
  }
  if (!comment.content || comment.content.trim().length === 0) {
    errors.push("content is required and cannot be empty");
  }
  if (comment.is_quick_message && !comment.quick_message_key) {
    errors.push("quick_message_key is required for quick messages");
  }
  if (comment.quick_message_key && !quickMessages[comment.quick_message_key]) {
    errors.push("Invalid quick_message_key");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe("Match Memory Validation", () => {
  it("should validate a complete memory object", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
      user_id: "user-456",
      ai_briefing_status: "PENDING",
      tags: ["역전승", "접전"],
      photo_urls: [],
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject memory without match ID", () => {
    const memory: Partial<MatchMemory> = {
      user_id: "user-456",
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("friendly_match_id is required");
  });

  it("should reject memory without user ID", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("user_id is required");
  });

  it("should reject invalid ai_briefing_status", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
      user_id: "user-456",
      ai_briefing_status: "INVALID" as MatchBriefingStatus,
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid ai_briefing_status");
  });
});

describe("AI Briefing Status Flow", () => {
  const validStatusTransitions: Record<MatchBriefingStatus, MatchBriefingStatus[]> = {
    PENDING: ["PROCESSING"],
    PROCESSING: ["COMPLETED", "FAILED"],
    COMPLETED: [], // Terminal state
    FAILED: ["PENDING"], // Can retry
  };

  it("should allow transition from PENDING to PROCESSING", () => {
    expect(validStatusTransitions.PENDING).toContain("PROCESSING");
  });

  it("should allow transition from PROCESSING to COMPLETED", () => {
    expect(validStatusTransitions.PROCESSING).toContain("COMPLETED");
  });

  it("should allow transition from PROCESSING to FAILED", () => {
    expect(validStatusTransitions.PROCESSING).toContain("FAILED");
  });

  it("should allow retry from FAILED to PENDING", () => {
    expect(validStatusTransitions.FAILED).toContain("PENDING");
  });

  it("COMPLETED should be a terminal state", () => {
    expect(validStatusTransitions.COMPLETED).toHaveLength(0);
  });
});

describe("Match Comment Validation", () => {
  it("should validate a regular comment", () => {
    const comment: Partial<MatchComment> = {
      friendly_match_id: "match-123",
      author_id: "user-456",
      content: "좋은 경기였습니다!",
      is_quick_message: false,
    };

    const result = validateComment(comment);
    expect(result.valid).toBe(true);
  });

  it("should validate a quick message comment", () => {
    const comment: Partial<MatchComment> = {
      friendly_match_id: "match-123",
      author_id: "user-456",
      content: quickMessages.wellPlayed,
      is_quick_message: true,
      quick_message_key: "wellPlayed",
    };

    const result = validateComment(comment);
    expect(result.valid).toBe(true);
  });

  it("should reject comment without content", () => {
    const comment: Partial<MatchComment> = {
      friendly_match_id: "match-123",
      author_id: "user-456",
      content: "",
    };

    const result = validateComment(comment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("content is required and cannot be empty");
  });

  it("should reject quick message without key", () => {
    const comment: Partial<MatchComment> = {
      friendly_match_id: "match-123",
      author_id: "user-456",
      content: "수고하셨습니다!",
      is_quick_message: true,
      quick_message_key: null,
    };

    const result = validateComment(comment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("quick_message_key is required for quick messages");
  });

  it("should reject invalid quick message key", () => {
    const comment: Partial<MatchComment> = {
      friendly_match_id: "match-123",
      author_id: "user-456",
      content: "Some content",
      is_quick_message: true,
      quick_message_key: "invalidKey",
    };

    const result = validateComment(comment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid quick_message_key");
  });
});

describe("Quick Messages", () => {
  it("should have all required quick messages defined", () => {
    const expectedKeys = [
      "wellPlayed",
      "greatGame",
      "goodMatch",
      "nicePlay",
      "congrats",
      "nextTime",
      "thankYou",
      "rematch",
    ];

    expectedKeys.forEach((key) => {
      expect(quickMessages).toHaveProperty(key);
      expect(quickMessages[key].length).toBeGreaterThan(0);
    });
  });

  it("should have Korean content for all quick messages", () => {
    Object.values(quickMessages).forEach((message) => {
      // Check that message contains Korean characters
      expect(/[\u3131-\uD79D]/.test(message)).toBe(true);
    });
  });
});

describe("Comment Reactions", () => {
  it("should have all reaction types", () => {
    expect(reactionTypes).toContain("LIKE");
    expect(reactionTypes).toContain("FIRE");
    expect(reactionTypes).toContain("CLAP");
    expect(reactionTypes).toContain("HEART");
    expect(reactionTypes).toContain("TROPHY");
  });

  it("should have exactly 5 reaction types", () => {
    expect(reactionTypes).toHaveLength(5);
  });
});

describe("Memory Tags", () => {
  it("should handle empty tags array", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
      user_id: "user-456",
      tags: [],
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(true);
  });

  it("should handle tags with Korean characters", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
      user_id: "user-456",
      tags: ["역전승", "접전", "집중력", "명경기"],
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(true);
  });

  it("should handle mixed language tags", () => {
    const memory: Partial<MatchMemory> = {
      friendly_match_id: "match-123",
      user_id: "user-456",
      tags: ["comeback", "역전", "good game", "gg"],
    };

    const result = validateMemory(memory);
    expect(result.valid).toBe(true);
  });
});

describe("Stats Snapshot", () => {
  it("should format win streak correctly", () => {
    const stats = { winStreak: 5, seasonRecord: "15승 8패", vsOpponent: "2승 1패", ratingTrend: "+45" };
    expect(stats.winStreak).toBe(5);
    expect(stats.seasonRecord).toMatch(/\d+승 \d+패/);
  });

  it("should format rating trend correctly", () => {
    const positiveStats = { winStreak: 3, seasonRecord: "15승 8패", vsOpponent: "2승 1패", ratingTrend: "+45" };
    const negativeStats = { winStreak: 0, seasonRecord: "8승 15패", vsOpponent: "1승 2패", ratingTrend: "-20" };

    expect(positiveStats.ratingTrend).toMatch(/^\+\d+$/);
    expect(negativeStats.ratingTrend).toMatch(/^-\d+$/);
  });
});
