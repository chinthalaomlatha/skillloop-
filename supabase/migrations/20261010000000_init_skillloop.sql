-- =============================================================================
-- SkillLoop AI - Complete PostgreSQL Database Schema & Row Level Security (RLS)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Profiles Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'English',
    preferred_format TEXT DEFAULT '1:1' CHECK (preferred_format IN ('1:1', 'small_group', 'self_paced_ai')),
    free_exchange_only BOOLEAN DEFAULT true,
    paid_tutoring_offered BOOLEAN DEFAULT false,
    hourly_rate NUMERIC(10, 2) DEFAULT NULL,
    currency TEXT DEFAULT 'USD',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Skill Categories & Skills Catalogue
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_custom BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    alias TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. User Teaching Skills & Learning Goals
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_teaching_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience NUMERIC(4, 1) DEFAULT 1.0,
    teaching_style TEXT,
    is_free_exchange BOOLEAN DEFAULT true,
    price_per_hour NUMERIC(10, 2) DEFAULT NULL,
    availability_hours_per_week INT DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.user_learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    current_proficiency TEXT NOT NULL CHECK (current_proficiency IN ('none', 'beginner', 'intermediate', 'advanced')),
    desired_proficiency TEXT NOT NULL CHECK (desired_proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    learning_objective TEXT,
    target_date DATE,
    preferred_format TEXT DEFAULT '1:1',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- -----------------------------------------------------------------------------
-- 4. Match Requests & Connections
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.match_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_teaches_skill_id UUID NOT NULL REFERENCES public.skills(id),
    sender_learns_skill_id UUID NOT NULL REFERENCES public.skills(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'ended')),
    message TEXT,
    explanation TEXT,
    compatibility_score INT DEFAULT 85,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (sender_id <> receiver_id)
);

-- -----------------------------------------------------------------------------
-- 5. Skill Circles (3+ Person Loops & Fallbacks)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skill_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    shared_goal TEXT,
    status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'disbanded')),
    loop_size INT NOT NULL DEFAULT 3,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES public.skill_circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teaches_skill_id UUID NOT NULL REFERENCES public.skills(id),
    learns_skill_id UUID NOT NULL REFERENCES public.skills(id),
    teaches_to_user_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'left')),
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(circle_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.skill_circle_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES public.skill_circles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. Personalized Learning Paths & Roadmaps
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    domain_type TEXT NOT NULL DEFAULT 'general',
    target_proficiency TEXT NOT NULL,
    estimated_weeks INT DEFAULT 4,
    progress_percent INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_path_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('study', 'practice', 'quiz', 'peer_exchange', 'project')),
    step_order INT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. Quizzes and AI Assessments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    questions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    ai_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. Learning Resources, Cache & Personal Library
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'article', 'docs', 'course', 'exercise')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    pricing_status TEXT NOT NULL DEFAULT 'free' CHECK (pricing_status IN ('free', 'freemium', 'paid', 'unknown')),
    source TEXT NOT NULL DEFAULT 'curated', -- 'youtube', 'curated'
    relevance_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resource_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_key TEXT NOT NULL UNIQUE,
    data JSONB NOT NULL,
    source TEXT NOT NULL DEFAULT 'youtube',
    cached_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS public.personal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. Learning Sessions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id),
    title TEXT NOT NULL,
    objectives TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 45,
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
    meeting_link TEXT,
    host_notes TEXT,
    partner_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. Achievements & Progress Milestones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    required_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievement_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- -----------------------------------------------------------------------------
-- 11. Notifications
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('match_request', 'circle_invite', 'session_scheduled', 'milestone', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. Safety, Reports, and Moderation
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate_behavior', 'harassment', 'commercial_solicitation', 'other')),
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, blocked_user_id)
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_teaching_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_circle_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update only their own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. User Teaching Skills
CREATE POLICY "Teaching skills are viewable by all authenticated users"
ON public.user_teaching_skills FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users manage own teaching skills"
ON public.user_teaching_skills FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. User Learning Goals
CREATE POLICY "Learning goals are viewable by all authenticated users"
ON public.user_learning_goals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users manage own learning goals"
ON public.user_learning_goals FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Match Requests
CREATE POLICY "Users can view match requests they are involved in"
ON public.match_requests FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create match requests as sender"
ON public.match_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update match requests they are involved in"
ON public.match_requests FOR UPDATE TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 5. Skill Circles & Members
CREATE POLICY "Users can view circles they belong to or active circles"
ON public.skill_circles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can insert skill circles"
ON public.skill_circles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Circle members can view memberships"
ON public.skill_circle_members FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own circle membership"
ON public.skill_circle_members FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- 6. Learning Paths & Steps
CREATE POLICY "Users view only their own learning paths"
ON public.learning_paths FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own learning paths"
ON public.learning_paths FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their learning path steps"
ON public.learning_path_steps FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.learning_paths lp WHERE lp.id = learning_path_steps.learning_path_id AND lp.user_id = auth.uid()));

-- 7. Quiz Attempts
CREATE POLICY "Users view only own quiz attempts"
ON public.quiz_attempts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own quiz attempts"
ON public.quiz_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8. Saved Resources & Notes
CREATE POLICY "Users view own saved resources"
ON public.saved_resources FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own saved resources"
ON public.saved_resources FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own personal notes"
ON public.personal_notes FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 9. Sessions
CREATE POLICY "Participants view their sessions"
ON public.learning_sessions FOR SELECT TO authenticated
USING (auth.uid() = host_id OR auth.uid() = partner_id);

CREATE POLICY "Participants update their sessions"
ON public.learning_sessions FOR UPDATE TO authenticated
USING (auth.uid() = host_id OR auth.uid() = partner_id);

CREATE POLICY "Host creates sessions"
ON public.learning_sessions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = host_id);

-- 10. Notifications
CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- 11. Reports & Blocks
CREATE POLICY "Users view own reports"
ON public.reports FOR SELECT TO authenticated
USING (auth.uid() = reporter_id);

CREATE POLICY "Users create reports"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users manage own blocked list"
ON public.blocked_users FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Indexes for Performance
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_teaching_user ON public.user_teaching_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_teaching_skill ON public.user_teaching_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_user ON public.user_learning_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_skill ON public.user_learning_goals(skill_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_users ON public.match_requests(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.skill_circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON public.saved_resources(user_id);
