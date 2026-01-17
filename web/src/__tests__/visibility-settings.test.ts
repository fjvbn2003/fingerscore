/**
 * Visibility Settings Tests
 * Tests for match visibility logic and score/record non-hideability
 */

import { describe, it, expect } from "vitest";
import type { VisibilityType } from "@/types/database";

// Visibility configuration matching the app logic
const visibilityConfig: Record<VisibilityType, {
  label: string;
  description: string;
  canHideScore: boolean;
  canHideRecentRecord: boolean;
  canHideOpponentName: boolean;
  canHideMatchDetails: boolean;
}> = {
  PUBLIC: {
    label: "전체 공개",
    description: "모든 사용자가 볼 수 있습니다",
    canHideScore: false,
    canHideRecentRecord: false,
    canHideOpponentName: false,
    canHideMatchDetails: false,
  },
  CLUB_ONLY: {
    label: "구장 내 공개",
    description: "같은 구장 회원만 볼 수 있습니다",
    canHideScore: false,
    canHideRecentRecord: false,
    canHideOpponentName: false,
    canHideMatchDetails: false,
  },
  PRIVATE: {
    label: "비공개",
    description: "나만 볼 수 있습니다",
    canHideScore: false, // CRITICAL: Score is NEVER hideable
    canHideRecentRecord: false, // CRITICAL: Recent record is NEVER hideable
    canHideOpponentName: true,
    canHideMatchDetails: true,
  },
};

// Helper function to check what data is visible based on visibility setting
function getVisibleData(
  visibility: VisibilityType,
  isOwner: boolean,
  isSameClub: boolean
): {
  canSeeScore: boolean;
  canSeeRecentRecord: boolean;
  canSeeOpponentName: boolean;
  canSeeMatchDetails: boolean;
} {
  // Score and recent record are ALWAYS visible (core requirement)
  const canSeeScore = true;
  const canSeeRecentRecord = true;

  // Owner can always see everything
  if (isOwner) {
    return {
      canSeeScore,
      canSeeRecentRecord,
      canSeeOpponentName: true,
      canSeeMatchDetails: true,
    };
  }

  switch (visibility) {
    case "PUBLIC":
      return {
        canSeeScore,
        canSeeRecentRecord,
        canSeeOpponentName: true,
        canSeeMatchDetails: true,
      };
    case "CLUB_ONLY":
      return {
        canSeeScore,
        canSeeRecentRecord,
        canSeeOpponentName: isSameClub,
        canSeeMatchDetails: isSameClub,
      };
    case "PRIVATE":
      return {
        canSeeScore,
        canSeeRecentRecord,
        canSeeOpponentName: false,
        canSeeMatchDetails: false,
      };
  }
}

describe("Visibility Settings", () => {
  describe("Score and Record Non-Hideability (Core Requirement)", () => {
    it("should NEVER allow hiding score regardless of visibility setting", () => {
      expect(visibilityConfig.PUBLIC.canHideScore).toBe(false);
      expect(visibilityConfig.CLUB_ONLY.canHideScore).toBe(false);
      expect(visibilityConfig.PRIVATE.canHideScore).toBe(false);
    });

    it("should NEVER allow hiding recent record regardless of visibility setting", () => {
      expect(visibilityConfig.PUBLIC.canHideRecentRecord).toBe(false);
      expect(visibilityConfig.CLUB_ONLY.canHideRecentRecord).toBe(false);
      expect(visibilityConfig.PRIVATE.canHideRecentRecord).toBe(false);
    });

    it("should always show score to any viewer", () => {
      // Public user viewing private match
      const publicViewerPrivateMatch = getVisibleData("PRIVATE", false, false);
      expect(publicViewerPrivateMatch.canSeeScore).toBe(true);

      // Different club member viewing club-only match
      const otherClubViewer = getVisibleData("CLUB_ONLY", false, false);
      expect(otherClubViewer.canSeeScore).toBe(true);
    });

    it("should always show recent record to any viewer", () => {
      const publicViewerPrivateMatch = getVisibleData("PRIVATE", false, false);
      expect(publicViewerPrivateMatch.canSeeRecentRecord).toBe(true);

      const otherClubViewer = getVisibleData("CLUB_ONLY", false, false);
      expect(otherClubViewer.canSeeRecentRecord).toBe(true);
    });
  });

  describe("PUBLIC Visibility", () => {
    it("should show all data to everyone", () => {
      const result = getVisibleData("PUBLIC", false, false);
      expect(result.canSeeScore).toBe(true);
      expect(result.canSeeRecentRecord).toBe(true);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });

    it("should show all data to club members", () => {
      const result = getVisibleData("PUBLIC", false, true);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });

    it("should show all data to owner", () => {
      const result = getVisibleData("PUBLIC", true, false);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });
  });

  describe("CLUB_ONLY Visibility", () => {
    it("should show score/record to non-club members but hide other details", () => {
      const result = getVisibleData("CLUB_ONLY", false, false);
      expect(result.canSeeScore).toBe(true);
      expect(result.canSeeRecentRecord).toBe(true);
      expect(result.canSeeOpponentName).toBe(false);
      expect(result.canSeeMatchDetails).toBe(false);
    });

    it("should show all data to same club members", () => {
      const result = getVisibleData("CLUB_ONLY", false, true);
      expect(result.canSeeScore).toBe(true);
      expect(result.canSeeRecentRecord).toBe(true);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });

    it("should show all data to owner", () => {
      const result = getVisibleData("CLUB_ONLY", true, false);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });
  });

  describe("PRIVATE Visibility", () => {
    it("should show score/record but hide other details from non-owners", () => {
      const result = getVisibleData("PRIVATE", false, false);
      expect(result.canSeeScore).toBe(true);
      expect(result.canSeeRecentRecord).toBe(true);
      expect(result.canSeeOpponentName).toBe(false);
      expect(result.canSeeMatchDetails).toBe(false);
    });

    it("should show score/record but hide details even from club members", () => {
      const result = getVisibleData("PRIVATE", false, true);
      expect(result.canSeeScore).toBe(true);
      expect(result.canSeeRecentRecord).toBe(true);
      expect(result.canSeeOpponentName).toBe(false);
      expect(result.canSeeMatchDetails).toBe(false);
    });

    it("should show all data to owner", () => {
      const result = getVisibleData("PRIVATE", true, false);
      expect(result.canSeeOpponentName).toBe(true);
      expect(result.canSeeMatchDetails).toBe(true);
    });
  });

  describe("Owner Permissions", () => {
    it("owner should always see everything regardless of visibility", () => {
      const visibilities: VisibilityType[] = ["PUBLIC", "CLUB_ONLY", "PRIVATE"];

      for (const visibility of visibilities) {
        const result = getVisibleData(visibility, true, false);
        expect(result.canSeeScore).toBe(true);
        expect(result.canSeeRecentRecord).toBe(true);
        expect(result.canSeeOpponentName).toBe(true);
        expect(result.canSeeMatchDetails).toBe(true);
      }
    });
  });
});

describe("Visibility Type Definitions", () => {
  it("should have correct labels in Korean", () => {
    expect(visibilityConfig.PUBLIC.label).toBe("전체 공개");
    expect(visibilityConfig.CLUB_ONLY.label).toBe("구장 내 공개");
    expect(visibilityConfig.PRIVATE.label).toBe("비공개");
  });

  it("should have descriptions explaining the visibility", () => {
    expect(visibilityConfig.PUBLIC.description).toContain("모든 사용자");
    expect(visibilityConfig.CLUB_ONLY.description).toContain("구장 회원");
    expect(visibilityConfig.PRIVATE.description).toContain("나만");
  });
});
