export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type LearningProficiencyLevel = 'none' | 'beginner' | 'intermediate' | 'advanced';
export type PreferredFormat = '1:1' | 'small_group' | 'self_paced_ai';
export type ResourcePricingStatus = 'free' | 'freemium' | 'paid' | 'unknown';
export type ResourceType = 'video' | 'article' | 'docs' | 'course' | 'exercise';
export type SessionStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'ended';
export type CircleStatus = 'forming' | 'active' | 'completed' | 'disbanded';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  preferred_format: PreferredFormat;
  free_exchange_only: boolean;
  paid_tutoring_offered: boolean;
  hourly_rate?: number;
  currency: string;
  is_admin?: boolean;
  is_demo?: boolean;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  is_custom: boolean;
  created_by?: string;
  tags: string[];
}

export interface UserTeachingSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  years_experience: number;
  teaching_style?: string;
  is_free_exchange: boolean;
  price_per_hour?: number;
  availability_hours_per_week: number;
  skill?: Skill;
}

export interface UserLearningGoal {
  id: string;
  user_id: string;
  skill_id: string;
  current_proficiency: LearningProficiencyLevel;
  desired_proficiency: ProficiencyLevel;
  learning_objective?: string;
  target_date?: string;
  preferred_format: PreferredFormat;
  skill?: Skill;
}

export interface PeerMatch {
  partnerId: string;
  partnerProfile: Profile;
  partnerTeaches: UserTeachingSkill[];
  partnerLearns: UserLearningGoal[];
  matchedTeachingSkill: UserTeachingSkill; // What they can teach you
  matchedLearningGoal: UserLearningGoal;   // What you can teach them (they want to learn)
  compatibilityScore: number;             // 0-100 explainable score
  scoreBreakdown: {
    skillComplementScore: number;         // Up to 50 pts
    proficiencyBalanceScore: number;     // Up to 20 pts
    availabilityOverlapScore: number;    // Up to 15 pts
    languageFormatScore: number;         // Up to 15 pts
  };
  explanation: string;
  exchangeOpportunity: string;
  mutualAvailabilityOverlap: string;
  isFreeExchange: boolean;
  existingRequest?: MatchRequest;
}

export interface MatchRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_teaches_skill_id: string;
  sender_learns_skill_id: string;
  status: MatchStatus;
  message?: string;
  explanation?: string;
  compatibility_score: number;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
  sender_skill?: Skill;
  receiver_skill?: Skill;
}

export interface SkillCircleMember {
  id: string;
  circle_id: string;
  user_id: string;
  teaches_skill_id: string;
  learns_skill_id: string;
  teaches_to_user_id?: string;
  status: 'invited' | 'accepted' | 'declined' | 'left';
  role: string;
  joined_at?: string;
  profile?: Profile;
  teaches_skill?: Skill;
  learns_skill?: Skill;
  teaches_to_profile?: Profile;
}

export interface SkillCircleMilestone {
  id: string;
  circle_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface SkillCircle {
  id: string;
  name: string;
  description?: string;
  shared_goal?: string;
  status: CircleStatus;
  loop_size: number;
  created_by?: string;
  created_at: string;
  members: SkillCircleMember[];
  milestones: SkillCircleMilestone[];
  loopExplanation?: string[];
  isFallbackTwoPerson?: boolean;
}

export interface LearningPathStep {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  action_type: 'study' | 'practice' | 'quiz' | 'peer_exchange' | 'project';
  step_order: number;
  is_completed: boolean;
  completed_at?: string;
  notes?: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  skill_id: string;
  skill?: Skill;
  title: string;
  domain_type: string;
  target_proficiency: string;
  estimated_weeks: number;
  progress_percent: number;
  steps: LearningPathStep[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  skill_id: string;
  skill?: Skill;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  answers: Record<string, number>;
  ai_feedback?: string;
  created_at: string;
}

export interface LearningResource {
  id: string;
  skill_id?: string;
  skill_name?: string;
  title: string;
  provider: string;
  resource_type: ResourceType;
  url: string;
  thumbnail_url?: string;
  description?: string;
  pricing_status: ResourcePricingStatus;
  source: 'youtube' | 'curated';
  relevance_reason?: string;
  isSaved?: boolean;
}

export interface SavedResource {
  id: string;
  user_id: string;
  resource_id: string;
  resource: LearningResource;
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalNote {
  id: string;
  user_id: string;
  skill_id?: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LearningSession {
  id: string;
  host_id: string;
  partner_id: string;
  skill_id: string;
  title: string;
  objectives?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: SessionStatus;
  meeting_link?: string;
  host_notes?: string;
  partner_notes?: string;
  created_at: string;
  host?: Profile;
  partner?: Profile;
  skill?: Skill;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  required_count: number;
  awarded?: boolean;
  awarded_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'match_request' | 'circle_invite' | 'session_scheduled' | 'milestone' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: 'spam' | 'inappropriate_behavior' | 'harassment' | 'commercial_solicitation' | 'other';
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
}
