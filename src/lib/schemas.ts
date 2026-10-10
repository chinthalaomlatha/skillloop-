import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  headline: z.string().max(120, 'Headline must be under 120 characters').optional().or(z.literal('')),
  bio: z.string().max(800, 'Bio must be under 800 characters').optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Preferred language is required'),
  preferred_format: z.enum(['1:1', 'small_group', 'self_paced_ai']),
  free_exchange_only: z.boolean().default(true),
  paid_tutoring_offered: z.boolean().default(false),
  hourly_rate: z.number().min(0).max(500).optional().nullable(),
});

export const teachingSkillSchema = z.object({
  skill_id: z.string().uuid('Please select a valid skill'),
  proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years_experience: z.number().min(0.1, 'Must be at least 0.1 years').max(50, 'Years exceeds limit'),
  teaching_style: z.string().max(300).optional().or(z.literal('')),
  is_free_exchange: z.boolean().default(true),
  price_per_hour: z.number().min(0).optional().nullable(),
  availability_hours_per_week: z.number().min(1).max(40),
});

export const learningGoalSchema = z.object({
  skill_id: z.string().uuid('Please select a valid skill'),
  current_proficiency: z.enum(['none', 'beginner', 'intermediate', 'advanced']),
  desired_proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  learning_objective: z.string().max(300).optional().or(z.literal('')),
  target_date: z.string().optional().or(z.literal('')),
  preferred_format: z.enum(['1:1', 'small_group', 'self_paced_ai']).default('1:1'),
});

export const customSkillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters').max(50, 'Skill name is too long'),
  category_id: z.string().uuid('Category is required'),
  description: z.string().min(10, 'Provide at least a short 10-character description').max(300),
  tags: z.array(z.string()).default([]),
});

export const matchRequestSchema = z.object({
  receiver_id: z.string().uuid(),
  sender_teaches_skill_id: z.string().uuid(),
  sender_learns_skill_id: z.string().uuid(),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const sessionSchema = z.object({
  partner_id: z.string().uuid('Partner is required'),
  skill_id: z.string().uuid('Skill is required'),
  title: z.string().min(3, 'Title is required').max(100),
  objectives: z.string().max(500).optional().or(z.literal('')),
  scheduled_at: z.string().min(1, 'Date and time are required'),
  duration_minutes: z.number().min(15).max(180),
  meeting_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const reportSchema = z.object({
  reported_user_id: z.string().uuid(),
  reason: z.enum(['spam', 'inappropriate_behavior', 'harassment', 'commercial_solicitation', 'other']),
  details: z.string().min(10, 'Please provide details with at least 10 characters').max(1000),
});
