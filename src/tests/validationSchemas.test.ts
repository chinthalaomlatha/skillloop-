import { describe, it, expect } from 'vitest';
import {
  profileSchema,
  teachingSkillSchema,
  learningGoalSchema,
  customSkillSchema,
  reportSchema,
} from '../lib/schemas';

describe('Zod Validation Schemas (§3 & §16)', () => {
  it('validates compliant profile payload', () => {
    const validProfile = {
      full_name: 'Elena Rostova',
      headline: 'Brand & Visual Identity Designer',
      bio: 'Figma designer ready to trade knowledge.',
      timezone: 'Europe/London',
      language: 'English',
      preferred_format: 'small_group',
      free_exchange_only: true,
      paid_tutoring_offered: false,
    };

    const parsed = profileSchema.safeParse(validProfile);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid short name in profile', () => {
    const invalidProfile = {
      full_name: 'A',
      timezone: 'UTC',
      language: 'English',
      preferred_format: '1:1',
    };

    const parsed = profileSchema.safeParse(invalidProfile);
    expect(parsed.success).toBe(false);
  });

  it('validates teaching skill with experience and hours boundaries', () => {
    const validTeaching = {
      skill_id: '123e4567-e89b-12d3-a456-426614174000',
      proficiency_level: 'expert',
      years_experience: 5.5,
      is_free_exchange: true,
      availability_hours_per_week: 4,
    };

    const parsed = teachingSkillSchema.safeParse(validTeaching);
    expect(parsed.success).toBe(true);
  });

  it('rejects custom skill with short description', () => {
    const invalidCustom = {
      name: 'Ceramics',
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Pottery', // Too short (< 10 chars)
    };

    const parsed = customSkillSchema.safeParse(invalidCustom);
    expect(parsed.success).toBe(false);
  });

  it('validates report payload', () => {
    const validReport = {
      reported_user_id: '123e4567-e89b-12d3-a456-426614174000',
      reason: 'commercial_solicitation',
      details: 'User repeatedly sent private messages trying to sell an off-platform paid course.',
    };

    const parsed = reportSchema.safeParse(validReport);
    expect(parsed.success).toBe(true);
  });
});
