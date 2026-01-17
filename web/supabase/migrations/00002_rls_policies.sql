-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_rankings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES
-- =============================================
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =============================================
-- TOURNAMENTS
-- =============================================
CREATE POLICY "Published tournaments are viewable"
    ON public.tournaments FOR SELECT
    USING (is_published = true OR organizer_id = auth.uid());

CREATE POLICY "Organizers can create tournaments"
    ON public.tournaments FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own tournaments"
    ON public.tournaments FOR UPDATE
    USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete own tournaments"
    ON public.tournaments FOR DELETE
    USING (organizer_id = auth.uid());

-- =============================================
-- TOURNAMENT REGISTRATIONS
-- =============================================
CREATE POLICY "Registrations are viewable by participants and organizers"
    ON public.tournament_registrations FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.is_published = true
        )
    );

CREATE POLICY "Users can register for tournaments"
    ON public.tournament_registrations FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own registration"
    ON public.tournament_registrations FOR UPDATE
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Users can cancel own registration"
    ON public.tournament_registrations FOR DELETE
    USING (user_id = auth.uid());

-- =============================================
-- MATCHES
-- =============================================
CREATE POLICY "Matches are viewable by everyone"
    ON public.matches FOR SELECT
    USING (true);

CREATE POLICY "Organizers can manage matches"
    ON public.matches FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments t
            WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
        )
    );

-- =============================================
-- SCORE SUBMISSIONS
-- =============================================
CREATE POLICY "Score submissions are viewable by participants and organizers"
    ON public.score_submissions FOR SELECT
    USING (
        submitted_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.matches m
            JOIN public.tournaments t ON t.id = m.tournament_id
            WHERE m.id = match_id AND t.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Participants can submit scores"
    ON public.score_submissions FOR INSERT
    WITH CHECK (
        auth.uid() = submitted_by
        AND EXISTS (
            SELECT 1 FROM public.matches m
            WHERE m.id = match_id
            AND (m.participant_a_id = auth.uid() OR m.participant_b_id = auth.uid())
        )
    );

CREATE POLICY "Organizers can update score submissions"
    ON public.score_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.matches m
            JOIN public.tournaments t ON t.id = m.tournament_id
            WHERE m.id = match_id AND t.organizer_id = auth.uid()
        )
    );

-- =============================================
-- LIVE SCORES
-- =============================================
CREATE POLICY "Live scores are viewable by everyone"
    ON public.live_scores FOR SELECT
    USING (true);

CREATE POLICY "Organizers can manage live scores"
    ON public.live_scores FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.matches m
            JOIN public.tournaments t ON t.id = m.tournament_id
            WHERE m.id = match_id AND t.organizer_id = auth.uid()
        )
    );

-- =============================================
-- POSTS
-- =============================================
CREATE POLICY "Posts are viewable by everyone"
    ON public.posts FOR SELECT
    USING (is_hidden = false);

CREATE POLICY "Authenticated users can create posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
    ON public.posts FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts"
    ON public.posts FOR DELETE
    USING (author_id = auth.uid());

-- =============================================
-- COMMENTS
-- =============================================
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (is_hidden = false);

CREATE POLICY "Authenticated users can create comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own comments"
    ON public.comments FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own comments"
    ON public.comments FOR DELETE
    USING (author_id = auth.uid());

-- =============================================
-- LIKES
-- =============================================
CREATE POLICY "Likes are viewable by everyone"
    ON public.likes FOR SELECT
    USING (true);

CREATE POLICY "Users can create likes"
    ON public.likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
    ON public.likes FOR DELETE
    USING (user_id = auth.uid());

-- =============================================
-- BOOKMARKS
-- =============================================
CREATE POLICY "Users can view own bookmarks"
    ON public.bookmarks FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create bookmarks"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
    ON public.bookmarks FOR DELETE
    USING (user_id = auth.uid());

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- =============================================
-- MATCH HISTORY
-- =============================================
CREATE POLICY "Match history is viewable by everyone"
    ON public.match_history FOR SELECT
    USING (true);

-- =============================================
-- SEASONS
-- =============================================
CREATE POLICY "Seasons are viewable by everyone"
    ON public.seasons FOR SELECT
    USING (true);

-- =============================================
-- SEASON RANKINGS
-- =============================================
CREATE POLICY "Season rankings are viewable by everyone"
    ON public.season_rankings FOR SELECT
    USING (true);
