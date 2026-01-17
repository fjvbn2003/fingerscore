export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SportType = "TABLE_TENNIS" | "TENNIS" | "BADMINTON";
export type TournamentType = "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION";
export type MatchFormat = "SINGLES" | "DOUBLES";
export type MatchStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SCORE_SUBMITTED"
  | "COMPLETED"
  | "CANCELLED";
export type ScoreSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type UserRole = "USER" | "ORGANIZER" | "ADMIN";
export type BoardType = "FREE" | "TOURNAMENT_REVIEW" | "EQUIPMENT_REVIEW" | "TIPS";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          preferred_sport: SportType;
          preferred_language: string;
          total_matches: number;
          total_wins: number;
          total_losses: number;
          current_rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          preferred_sport?: SportType;
          preferred_language?: string;
          total_matches?: number;
          total_wins?: number;
          total_losses?: number;
          current_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          preferred_sport?: SportType;
          preferred_language?: string;
          total_matches?: number;
          total_wins?: number;
          total_losses?: number;
          current_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          organizer_id: string | null;
          title: string;
          description: string | null;
          sport_type: SportType;
          tournament_type: TournamentType;
          match_format: MatchFormat;
          location: string | null;
          venue_name: string | null;
          registration_start: string;
          registration_end: string;
          tournament_start: string;
          tournament_end: string | null;
          max_participants: number | null;
          entry_fee: number;
          prize_info: string | null;
          rules: Json | null;
          is_published: boolean;
          is_registration_open: boolean;
          is_bracket_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organizer_id?: string | null;
          title: string;
          description?: string | null;
          sport_type: SportType;
          tournament_type: TournamentType;
          match_format: MatchFormat;
          location?: string | null;
          venue_name?: string | null;
          registration_start: string;
          registration_end: string;
          tournament_start: string;
          tournament_end?: string | null;
          max_participants?: number | null;
          entry_fee?: number;
          prize_info?: string | null;
          rules?: Json | null;
          is_published?: boolean;
          is_registration_open?: boolean;
          is_bracket_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organizer_id?: string | null;
          title?: string;
          description?: string | null;
          sport_type?: SportType;
          tournament_type?: TournamentType;
          match_format?: MatchFormat;
          location?: string | null;
          venue_name?: string | null;
          registration_start?: string;
          registration_end?: string;
          tournament_start?: string;
          tournament_end?: string | null;
          max_participants?: number | null;
          entry_fee?: number;
          prize_info?: string | null;
          rules?: Json | null;
          is_published?: boolean;
          is_registration_open?: boolean;
          is_bracket_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournament_registrations: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          partner_id: string | null;
          team_name: string | null;
          seed_number: number | null;
          status: string;
          registered_at: string;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          user_id: string;
          partner_id?: string | null;
          team_name?: string | null;
          seed_number?: number | null;
          status?: string;
          registered_at?: string;
          confirmed_at?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          user_id?: string;
          partner_id?: string | null;
          team_name?: string | null;
          seed_number?: number | null;
          status?: string;
          registered_at?: string;
          confirmed_at?: string | null;
        };
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          round_number: number;
          match_number: number;
          bracket_position: string | null;
          participant_a_id: string | null;
          participant_b_id: string | null;
          partner_a_id: string | null;
          partner_b_id: string | null;
          source_match_a_id: string | null;
          source_match_b_id: string | null;
          source_type_a: string | null;
          source_type_b: string | null;
          score_a: number;
          score_b: number;
          sets_a: number;
          sets_b: number;
          set_scores: Json | null;
          winner_id: string | null;
          status: MatchStatus;
          scheduled_time: string | null;
          started_at: string | null;
          completed_at: string | null;
          court_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round_number: number;
          match_number: number;
          bracket_position?: string | null;
          participant_a_id?: string | null;
          participant_b_id?: string | null;
          partner_a_id?: string | null;
          partner_b_id?: string | null;
          source_match_a_id?: string | null;
          source_match_b_id?: string | null;
          source_type_a?: string | null;
          source_type_b?: string | null;
          score_a?: number;
          score_b?: number;
          sets_a?: number;
          sets_b?: number;
          set_scores?: Json | null;
          winner_id?: string | null;
          status?: MatchStatus;
          scheduled_time?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          court_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round_number?: number;
          match_number?: number;
          bracket_position?: string | null;
          participant_a_id?: string | null;
          participant_b_id?: string | null;
          partner_a_id?: string | null;
          partner_b_id?: string | null;
          source_match_a_id?: string | null;
          source_match_b_id?: string | null;
          source_type_a?: string | null;
          source_type_b?: string | null;
          score_a?: number;
          score_b?: number;
          sets_a?: number;
          sets_b?: number;
          set_scores?: Json | null;
          winner_id?: string | null;
          status?: MatchStatus;
          scheduled_time?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          court_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      score_submissions: {
        Row: {
          id: string;
          match_id: string;
          submitted_by: string | null;
          score_a: number;
          score_b: number;
          sets_a: number;
          sets_b: number;
          set_scores: Json | null;
          claimed_winner: string | null;
          photo_url: string | null;
          notes: string | null;
          status: ScoreSubmissionStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          submitted_by?: string | null;
          score_a: number;
          score_b: number;
          sets_a?: number;
          sets_b?: number;
          set_scores?: Json | null;
          claimed_winner?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          status?: ScoreSubmissionStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          submitted_by?: string | null;
          score_a?: number;
          score_b?: number;
          sets_a?: number;
          sets_b?: number;
          set_scores?: Json | null;
          claimed_winner?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          status?: ScoreSubmissionStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          submitted_at?: string;
        };
      };
      live_scores: {
        Row: {
          id: string;
          match_id: string;
          current_score_a: number;
          current_score_b: number;
          current_sets_a: number;
          current_sets_b: number;
          current_set_scores: Json;
          is_live: boolean;
          server: string | null;
          last_updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          current_score_a?: number;
          current_score_b?: number;
          current_sets_a?: number;
          current_sets_b?: number;
          current_set_scores?: Json;
          is_live?: boolean;
          server?: string | null;
          last_updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          current_score_a?: number;
          current_score_b?: number;
          current_sets_a?: number;
          current_sets_b?: number;
          current_set_scores?: Json;
          is_live?: boolean;
          server?: string | null;
          last_updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          board_type: BoardType;
          title: string;
          content: string;
          tournament_id: string | null;
          equipment_name: string | null;
          rating: number | null;
          view_count: number;
          like_count: number;
          comment_count: number;
          is_pinned: boolean;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          board_type: BoardType;
          title: string;
          content: string;
          tournament_id?: string | null;
          equipment_name?: string | null;
          rating?: number | null;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          is_pinned?: boolean;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          board_type?: BoardType;
          title?: string;
          content?: string;
          tournament_id?: string | null;
          equipment_name?: string | null;
          rating?: number | null;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          is_pinned?: boolean;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string | null;
          parent_id: string | null;
          content: string;
          like_count: number;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id?: string | null;
          parent_id?: string | null;
          content: string;
          like_count?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string | null;
          parent_id?: string | null;
          content?: string;
          like_count?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          comment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          tournament_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          tournament_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string | null;
          tournament_id?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      sport_type: SportType;
      tournament_type: TournamentType;
      match_format: MatchFormat;
      match_status: MatchStatus;
      score_submission_status: ScoreSubmissionStatus;
      user_role: UserRole;
      board_type: BoardType;
    };
  };
}
