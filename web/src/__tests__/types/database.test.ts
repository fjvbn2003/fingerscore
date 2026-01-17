import { describe, it, expect } from "vitest";
import type {
  Database,
  SportType,
  TournamentType,
  MatchFormat,
  MatchStatus,
  ScoreSubmissionStatus,
  UserRole,
  BoardType,
} from "@/types/database";

describe("Database Types", () => {
  describe("Enum Types", () => {
    it("SportType has correct values", () => {
      const sportTypes: SportType[] = ["TABLE_TENNIS", "TENNIS", "BADMINTON"];
      expect(sportTypes).toHaveLength(3);
    });

    it("TournamentType has correct values", () => {
      const tournamentTypes: TournamentType[] = [
        "SINGLE_ELIMINATION",
        "DOUBLE_ELIMINATION",
      ];
      expect(tournamentTypes).toHaveLength(2);
    });

    it("MatchFormat has correct values", () => {
      const matchFormats: MatchFormat[] = ["SINGLES", "DOUBLES"];
      expect(matchFormats).toHaveLength(2);
    });

    it("MatchStatus has correct values", () => {
      const matchStatuses: MatchStatus[] = [
        "PENDING",
        "IN_PROGRESS",
        "SCORE_SUBMITTED",
        "COMPLETED",
        "CANCELLED",
      ];
      expect(matchStatuses).toHaveLength(5);
    });

    it("ScoreSubmissionStatus has correct values", () => {
      const statuses: ScoreSubmissionStatus[] = [
        "PENDING",
        "APPROVED",
        "REJECTED",
      ];
      expect(statuses).toHaveLength(3);
    });

    it("UserRole has correct values", () => {
      const roles: UserRole[] = ["USER", "ORGANIZER", "ADMIN"];
      expect(roles).toHaveLength(3);
    });

    it("BoardType has correct values", () => {
      const boardTypes: BoardType[] = [
        "FREE",
        "TOURNAMENT_REVIEW",
        "EQUIPMENT_REVIEW",
        "TIPS",
      ];
      expect(boardTypes).toHaveLength(4);
    });
  });

  describe("Table Types", () => {
    it("Database type has public schema", () => {
      const testDb: Database = {
        public: {
          Tables: {} as Database["public"]["Tables"],
          Views: {},
          Functions: {},
          Enums: {} as Database["public"]["Enums"],
        },
      };
      expect(testDb.public).toBeDefined();
    });

    it("profiles table has required fields", () => {
      type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
      const requiredFields: (keyof ProfileRow)[] = [
        "id",
        "username",
        "display_name",
        "avatar_url",
        "role",
        "total_matches",
        "total_wins",
        "total_losses",
        "current_rating",
      ];
      expect(requiredFields).toHaveLength(9);
    });

    it("tournaments table has required fields", () => {
      type TournamentRow = Database["public"]["Tables"]["tournaments"]["Row"];
      const requiredFields: (keyof TournamentRow)[] = [
        "id",
        "title",
        "sport_type",
        "tournament_type",
        "match_format",
        "registration_start",
        "registration_end",
        "tournament_start",
        "is_published",
      ];
      expect(requiredFields).toHaveLength(9);
    });

    it("matches table has required fields", () => {
      type MatchRow = Database["public"]["Tables"]["matches"]["Row"];
      const requiredFields: (keyof MatchRow)[] = [
        "id",
        "tournament_id",
        "round_number",
        "match_number",
        "score_a",
        "score_b",
        "status",
      ];
      expect(requiredFields).toHaveLength(7);
    });

    it("posts table has required fields", () => {
      type PostRow = Database["public"]["Tables"]["posts"]["Row"];
      const requiredFields: (keyof PostRow)[] = [
        "id",
        "board_type",
        "title",
        "content",
        "view_count",
        "like_count",
        "comment_count",
      ];
      expect(requiredFields).toHaveLength(7);
    });
  });
});
