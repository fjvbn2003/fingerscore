-- =============================================
-- FingerScore Database Schema
-- Version: 1.0.0
-- =============================================

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE sport_type AS ENUM ('TABLE_TENNIS', 'TENNIS', 'BADMINTON');
CREATE TYPE tournament_type AS ENUM ('SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION');
CREATE TYPE match_format AS ENUM ('SINGLES', 'DOUBLES');
CREATE TYPE match_status AS ENUM ('PENDING', 'IN_PROGRESS', 'SCORE_SUBMITTED', 'COMPLETED', 'CANCELLED');
CREATE TYPE score_submission_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE user_role AS ENUM ('USER', 'ORGANIZER', 'ADMIN');
CREATE TYPE board_type AS ENUM ('FREE', 'TOURNAMENT_REVIEW', 'EQUIPMENT_REVIEW', 'TIPS');

-- =============================================
-- USERS (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'USER',
    preferred_sport sport_type DEFAULT 'TABLE_TENNIS',
    preferred_language TEXT DEFAULT 'ko' CHECK (preferred_language IN ('ko', 'en', 'ja', 'zh')),

    -- Stats (denormalized for performance)
    total_matches INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0,
    current_rating INTEGER DEFAULT 1000,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TOURNAMENTS
-- =============================================
CREATE TABLE public.tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    title TEXT NOT NULL,
    description TEXT,
    sport_type sport_type NOT NULL,
    tournament_type tournament_type NOT NULL,
    match_format match_format NOT NULL,

    location TEXT,
    venue_name TEXT,

    registration_start TIMESTAMPTZ NOT NULL,
    registration_end TIMESTAMPTZ NOT NULL,
    tournament_start TIMESTAMPTZ NOT NULL,
    tournament_end TIMESTAMPTZ,

    max_participants INTEGER,
    entry_fee INTEGER DEFAULT 0,
    prize_info TEXT,

    rules JSONB,

    is_published BOOLEAN DEFAULT FALSE,
    is_registration_open BOOLEAN DEFAULT FALSE,
    is_bracket_generated BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TOURNAMENT REGISTRATIONS
-- =============================================
CREATE TABLE public.tournament_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    team_name TEXT,

    seed_number INTEGER,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN')),

    registered_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,

    UNIQUE(tournament_id, user_id)
);

-- =============================================
-- MATCHES
-- =============================================
CREATE TABLE public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,

    round_number INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    bracket_position TEXT,

    participant_a_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    participant_b_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    partner_a_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    partner_b_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    source_match_a_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    source_match_b_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    source_type_a TEXT CHECK (source_type_a IN ('WINNER', 'LOSER')),
    source_type_b TEXT CHECK (source_type_b IN ('WINNER', 'LOSER')),

    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    sets_a INTEGER DEFAULT 0,
    sets_b INTEGER DEFAULT 0,
    set_scores JSONB,

    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    status match_status DEFAULT 'PENDING',

    scheduled_time TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    court_number TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SCORE SUBMISSIONS
-- =============================================
CREATE TABLE public.score_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    score_a INTEGER NOT NULL,
    score_b INTEGER NOT NULL,
    sets_a INTEGER DEFAULT 0,
    sets_b INTEGER DEFAULT 0,
    set_scores JSONB,

    claimed_winner TEXT CHECK (claimed_winner IN ('A', 'B')),

    photo_url TEXT,
    notes TEXT,

    status score_submission_status DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,

    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LIVE SCORES
-- =============================================
CREATE TABLE public.live_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE UNIQUE,

    current_score_a INTEGER DEFAULT 0,
    current_score_b INTEGER DEFAULT 0,
    current_sets_a INTEGER DEFAULT 0,
    current_sets_b INTEGER DEFAULT 0,
    current_set_scores JSONB DEFAULT '[]',

    is_live BOOLEAN DEFAULT FALSE,
    server TEXT CHECK (server IN ('A', 'B')),

    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMUNITY: POSTS
-- =============================================
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    board_type board_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,

    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,

    equipment_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),

    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,

    is_pinned BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMUNITY: COMMENTS
-- =============================================
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,

    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,

    is_hidden BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LIKES
-- =============================================
CREATE TABLE public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
);

-- =============================================
-- BOOKMARKS
-- =============================================
CREATE TABLE public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK ((post_id IS NOT NULL AND tournament_id IS NULL) OR (post_id IS NULL AND tournament_id IS NOT NULL)),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, tournament_id)
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MATCH HISTORY
-- =============================================
CREATE TABLE public.match_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,

    opponent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sport_type sport_type NOT NULL,

    is_winner BOOLEAN NOT NULL,
    score_for INTEGER NOT NULL,
    score_against INTEGER NOT NULL,
    sets_for INTEGER DEFAULT 0,
    sets_against INTEGER DEFAULT 0,

    rating_before INTEGER,
    rating_after INTEGER,
    rating_change INTEGER,

    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEASONS
-- =============================================
CREATE TABLE public.seasons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sport_type sport_type NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    is_active BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEASON RANKINGS
-- =============================================
CREATE TABLE public.season_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    rank INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    matches_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(season_id, user_id)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_posts_board_type ON public.posts(board_type);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_matches_tournament_id ON public.matches(tournament_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_live_scores_is_live ON public.live_scores(is_live) WHERE is_live = TRUE;
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_match_history_user_id ON public.match_history(user_id);
CREATE INDEX idx_tournament_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX idx_tournaments_dates ON public.tournaments(tournament_start);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment post comment count
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_insert AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION increment_comment_count();

-- Decrement post comment count
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_delete AFTER DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION decrement_comment_count();

-- Update user stats on match completion
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.winner_id IS NOT NULL AND OLD.status != 'COMPLETED' AND NEW.status = 'COMPLETED' THEN
        -- Update winner stats
        UPDATE public.profiles
        SET
            total_matches = total_matches + 1,
            total_wins = total_wins + 1
        WHERE id = NEW.winner_id;

        -- Update loser stats
        UPDATE public.profiles
        SET
            total_matches = total_matches + 1,
            total_losses = total_losses + 1
        WHERE id IN (NEW.participant_a_id, NEW.participant_b_id)
          AND id != NEW.winner_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_match_complete AFTER UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Handle new user signup - create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
