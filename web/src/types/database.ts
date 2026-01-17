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
export type UserRole = "USER" | "ORGANIZER" | "CLUB_OWNER" | "ADMIN";
export type MembershipType = "MONTHLY" | "LESSON" | "TRIAL";
export type MembershipStatus = "ACTIVE" | "EXPIRED" | "SUSPENDED";
export type LessonFrequency = "ONCE_WEEK" | "TWICE_WEEK" | "THREE_TIMES_WEEK" | "FOUR_TIMES_WEEK" | "FIVE_TIMES_WEEK" | "DAILY";
export type ExchangeMatchStatus = "PROPOSED" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM";
export type BoardType = "FREE" | "TOURNAMENT_REVIEW" | "EQUIPMENT_REVIEW" | "TIPS";
export type FriendlyMatchStatus = "PENDING_OPPONENT" | "PENDING_SUBMITTER" | "CONFIRMED" | "REJECTED";
export type ChallengeStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type NewsCategory = "GENERAL" | "TOURNAMENT" | "PLAYER" | "EQUIPMENT" | "TECHNIQUE";
export type VisibilityType = "PUBLIC" | "CLUB_ONLY" | "PRIVATE";
export type MatchBriefingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type MatchCommentReaction = "LIKE" | "FIRE" | "CLAP" | "HEART" | "TROPHY";

// Sport-specific scoring rules
export interface SportScoringRules {
  TABLE_TENNIS: {
    maxSets: 5 | 7;
    pointsToWin: 11;
    minPointDiff: 2;
    maxPoints: 99;
  };
  TENNIS: {
    maxSets: 3 | 5;
    gamesPerSet: 6;
    tiebreakAt: 6;
    tiebreakPoints: 7;
    minGameDiff: 2;
    finalSetTiebreak: boolean;
  };
  BADMINTON: {
    maxSets: 3;
    pointsToWin: 21;
    maxPoints: 30;
    minPointDiff: 2;
  };
}

// News sources by sport
export interface NewsSources {
  TABLE_TENNIS: string[];
  TENNIS: string[];
  BADMINTON: string[];
}

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
      // Club Management Tables
      clubs: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          address: string;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          operating_hours: Json | null;
          facilities: string[] | null;
          monthly_fee: number;
          lesson_fee_per_session: number;
          max_capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          address: string;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          operating_hours?: Json | null;
          facilities?: string[] | null;
          monthly_fee?: number;
          lesson_fee_per_session?: number;
          max_capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          operating_hours?: Json | null;
          facilities?: string[] | null;
          monthly_fee?: number;
          lesson_fee_per_session?: number;
          max_capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      club_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          membership_type: MembershipType;
          membership_status: MembershipStatus;
          lesson_frequency: LessonFrequency | null;
          sessions_per_month: number;
          sessions_used: number;
          monthly_fee: number;
          start_date: string;
          end_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          club_id: string;
          user_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          membership_type?: MembershipType;
          membership_status?: MembershipStatus;
          lesson_frequency?: LessonFrequency | null;
          sessions_per_month?: number;
          sessions_used?: number;
          monthly_fee?: number;
          start_date: string;
          end_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          club_id?: string;
          user_id?: string | null;
          name?: string;
          phone?: string;
          email?: string | null;
          membership_type?: MembershipType;
          membership_status?: MembershipStatus;
          lesson_frequency?: LessonFrequency | null;
          sessions_per_month?: number;
          sessions_used?: number;
          monthly_fee?: number;
          start_date?: string;
          end_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_schedules: {
        Row: {
          id: string;
          club_id: string;
          member_id: string;
          coach_name: string | null;
          scheduled_date: string;
          start_time: string;
          end_time: string;
          is_completed: boolean;
          is_cancelled: boolean;
          cancellation_reason: string | null;
          notes: string | null;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          club_id: string;
          member_id: string;
          coach_name?: string | null;
          scheduled_date: string;
          start_time: string;
          end_time: string;
          is_completed?: boolean;
          is_cancelled?: boolean;
          cancellation_reason?: string | null;
          notes?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          club_id?: string;
          member_id?: string;
          coach_name?: string | null;
          scheduled_date?: string;
          start_time?: string;
          end_time?: string;
          is_completed?: boolean;
          is_cancelled?: boolean;
          cancellation_reason?: string | null;
          notes?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_records: {
        Row: {
          id: string;
          club_id: string;
          member_id: string;
          amount: number;
          payment_type: string;
          payment_method: string | null;
          payment_date: string;
          period_start: string;
          period_end: string;
          is_paid: boolean;
          paid_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          club_id: string;
          member_id: string;
          amount: number;
          payment_type: string;
          payment_method?: string | null;
          payment_date: string;
          period_start: string;
          period_end: string;
          is_paid?: boolean;
          paid_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          club_id?: string;
          member_id?: string;
          amount?: number;
          payment_type?: string;
          payment_method?: string | null;
          payment_date?: string;
          period_start?: string;
          period_end?: string;
          is_paid?: boolean;
          paid_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      exchange_matches: {
        Row: {
          id: string;
          host_club_id: string;
          guest_club_id: string;
          title: string;
          description: string | null;
          match_date: string;
          venue: string;
          max_participants: number;
          status: ExchangeMatchStatus;
          proposed_by: string;
          accepted_at: string | null;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_club_id: string;
          guest_club_id: string;
          title: string;
          description?: string | null;
          match_date: string;
          venue: string;
          max_participants?: number;
          status?: ExchangeMatchStatus;
          proposed_by: string;
          accepted_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_club_id?: string;
          guest_club_id?: string;
          title?: string;
          description?: string | null;
          match_date?: string;
          venue?: string;
          max_participants?: number;
          status?: ExchangeMatchStatus;
          proposed_by?: string;
          accepted_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exchange_match_participants: {
        Row: {
          id: string;
          exchange_match_id: string;
          club_id: string;
          member_id: string;
          is_confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          exchange_match_id: string;
          club_id: string;
          member_id: string;
          is_confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          exchange_match_id?: string;
          club_id?: string;
          member_id?: string;
          is_confirmed?: boolean;
          created_at?: string;
        };
      };
      club_chat_rooms: {
        Row: {
          id: string;
          club_a_id: string;
          club_b_id: string;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          club_a_id: string;
          club_b_id: string;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          club_a_id?: string;
          club_b_id?: string;
          last_message_at?: string | null;
          created_at?: string;
        };
      };
      club_chat_messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          sender_club_id: string;
          message_type: ChatMessageType;
          content: string;
          image_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          sender_club_id: string;
          message_type?: ChatMessageType;
          content: string;
          image_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          sender_club_id?: string;
          message_type?: ChatMessageType;
          content?: string;
          image_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      // News aggregation tables
      sports_news: {
        Row: {
          id: string;
          sport_type: SportType;
          category: NewsCategory;
          title: string;
          summary: string;
          content: string | null;
          source_url: string;
          source_name: string;
          image_url: string | null;
          published_at: string;
          fetched_at: string;
          is_featured: boolean;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sport_type: SportType;
          category?: NewsCategory;
          title: string;
          summary: string;
          content?: string | null;
          source_url: string;
          source_name: string;
          image_url?: string | null;
          published_at: string;
          fetched_at?: string;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sport_type?: SportType;
          category?: NewsCategory;
          title?: string;
          summary?: string;
          content?: string | null;
          source_url?: string;
          source_name?: string;
          image_url?: string | null;
          published_at?: string;
          fetched_at?: string;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
        };
      };
      // User registered clubs
      user_clubs: {
        Row: {
          id: string;
          user_id: string;
          club_id: string;
          sport_type: SportType;
          is_primary: boolean;
          nickname: string | null;
          joined_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          club_id: string;
          sport_type: SportType;
          is_primary?: boolean;
          nickname?: string | null;
          joined_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          club_id?: string;
          sport_type?: SportType;
          is_primary?: boolean;
          nickname?: string | null;
          joined_at?: string;
          created_at?: string;
        };
      };
      // User sport-specific ratings
      user_sport_ratings: {
        Row: {
          id: string;
          user_id: string;
          sport_type: SportType;
          rating: number;
          highest_rating: number;
          total_matches: number;
          wins: number;
          losses: number;
          win_streak: number;
          max_win_streak: number;
          last_match_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sport_type: SportType;
          rating?: number;
          highest_rating?: number;
          total_matches?: number;
          wins?: number;
          losses?: number;
          win_streak?: number;
          max_win_streak?: number;
          last_match_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sport_type?: SportType;
          rating?: number;
          highest_rating?: number;
          total_matches?: number;
          wins?: number;
          losses?: number;
          win_streak?: number;
          max_win_streak?: number;
          last_match_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // User notification settings
      user_notification_settings: {
        Row: {
          id: string;
          user_id: string;
          email_enabled: boolean;
          push_enabled: boolean;
          sms_enabled: boolean;
          match_result_notifications: boolean;
          challenge_notifications: boolean;
          news_notifications: boolean;
          club_notifications: boolean;
          marketing_notifications: boolean;
          quiet_hours_start: string | null;
          quiet_hours_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_enabled?: boolean;
          push_enabled?: boolean;
          sms_enabled?: boolean;
          match_result_notifications?: boolean;
          challenge_notifications?: boolean;
          news_notifications?: boolean;
          club_notifications?: boolean;
          marketing_notifications?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_enabled?: boolean;
          push_enabled?: boolean;
          sms_enabled?: boolean;
          match_result_notifications?: boolean;
          challenge_notifications?: boolean;
          news_notifications?: boolean;
          club_notifications?: boolean;
          marketing_notifications?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Friendly matches with sport type
      friendly_matches: {
        Row: {
          id: string;
          sport_type: SportType;
          player_a_id: string;
          player_b_id: string;
          club_id: string | null;
          score_data: Json;
          winner_id: string | null;
          status: FriendlyMatchStatus;
          visibility: VisibilityType;
          submitted_by: string;
          match_date: string;
          venue: string | null;
          notes: string | null;
          rating_change_a: number | null;
          rating_change_b: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sport_type: SportType;
          player_a_id: string;
          player_b_id: string;
          club_id?: string | null;
          score_data: Json;
          winner_id?: string | null;
          status?: FriendlyMatchStatus;
          visibility?: VisibilityType;
          submitted_by: string;
          match_date: string;
          venue?: string | null;
          notes?: string | null;
          rating_change_a?: number | null;
          rating_change_b?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sport_type?: SportType;
          player_a_id?: string;
          player_b_id?: string;
          club_id?: string | null;
          score_data?: Json;
          winner_id?: string | null;
          status?: FriendlyMatchStatus;
          visibility?: VisibilityType;
          submitted_by?: string;
          match_date?: string;
          venue?: string | null;
          notes?: string | null;
          rating_change_a?: number | null;
          rating_change_b?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Live scoreboard entries
      live_scoreboard: {
        Row: {
          id: string;
          friendly_match_id: string;
          club_id: string | null;
          sport_type: SportType;
          player_a_name: string;
          player_b_name: string;
          player_a_rating: number;
          player_b_rating: number;
          score_summary: string;
          winner_name: string | null;
          rating_change: number;
          is_upset: boolean;
          visibility: VisibilityType;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          friendly_match_id: string;
          club_id?: string | null;
          sport_type: SportType;
          player_a_name: string;
          player_b_name: string;
          player_a_rating: number;
          player_b_rating: number;
          score_summary: string;
          winner_name?: string | null;
          rating_change?: number;
          is_upset?: boolean;
          visibility?: VisibilityType;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          friendly_match_id?: string;
          club_id?: string | null;
          sport_type?: SportType;
          player_a_name?: string;
          player_b_name?: string;
          player_a_rating?: number;
          player_b_rating?: number;
          score_summary?: string;
          winner_name?: string | null;
          rating_change?: number;
          is_upset?: boolean;
          visibility?: VisibilityType;
          created_at?: string;
          expires_at?: string;
        };
      };
      // Match memories with AI briefings
      match_memories: {
        Row: {
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
          highlights: Json | null;
          stats_snapshot: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          friendly_match_id: string;
          user_id: string;
          is_featured?: boolean;
          photo_urls?: string[];
          tags?: string[];
          personal_note?: string | null;
          ai_briefing?: string | null;
          ai_briefing_status?: MatchBriefingStatus;
          ai_briefing_generated_at?: string | null;
          highlights?: Json | null;
          stats_snapshot?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          friendly_match_id?: string;
          user_id?: string;
          is_featured?: boolean;
          photo_urls?: string[];
          tags?: string[];
          personal_note?: string | null;
          ai_briefing?: string | null;
          ai_briefing_status?: MatchBriefingStatus;
          ai_briefing_generated_at?: string | null;
          highlights?: Json | null;
          stats_snapshot?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Post-match comments and encouragement
      match_comments: {
        Row: {
          id: string;
          friendly_match_id: string;
          author_id: string;
          content: string;
          is_quick_message: boolean;
          quick_message_key: string | null;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          friendly_match_id: string;
          author_id: string;
          content: string;
          is_quick_message?: boolean;
          quick_message_key?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          friendly_match_id?: string;
          author_id?: string;
          content?: string;
          is_quick_message?: boolean;
          quick_message_key?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Match comment reactions
      match_comment_reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          reaction: MatchCommentReaction;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          reaction: MatchCommentReaction;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          reaction?: MatchCommentReaction;
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
      membership_type: MembershipType;
      membership_status: MembershipStatus;
      lesson_frequency: LessonFrequency;
      exchange_match_status: ExchangeMatchStatus;
      chat_message_type: ChatMessageType;
      friendly_match_status: FriendlyMatchStatus;
      challenge_status: ChallengeStatus;
      news_category: NewsCategory;
      visibility_type: VisibilityType;
      match_briefing_status: MatchBriefingStatus;
      match_comment_reaction: MatchCommentReaction;
    };
  };
}
