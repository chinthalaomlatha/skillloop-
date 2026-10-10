import { describe, it, expect } from 'vitest';
import { validateCircleLoop, discoverSkillCircles } from '../lib/circleEngine';
import { Profile, UserTeachingSkill, UserLearningGoal, Skill } from '../types';

describe('AI Skill Circles Engine Tests (§7)', () => {
  it('validates a correct 3-person closed loop (A -> B -> C -> A)', () => {
    const loop = [
      { userId: 'u1', teachesSkillId: 's1', learnsSkillId: 's3', teachesToUserId: 'u2' },
      { userId: 'u2', teachesSkillId: 's2', learnsSkillId: 's1', teachesToUserId: 'u3' },
      { userId: 'u3', teachesSkillId: 's3', learnsSkillId: 's2', teachesToUserId: 'u1' },
    ];

    const validation = validateCircleLoop(loop);
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeUndefined();
  });

  it('rejects an invalid disconnected loop', () => {
    const brokenLoop = [
      { userId: 'u1', teachesSkillId: 's1', learnsSkillId: 's3', teachesToUserId: 'u2' },
      { userId: 'u2', teachesSkillId: 's2', learnsSkillId: 's1', teachesToUserId: 'u2' }, // Self loop!
      { userId: 'u3', teachesSkillId: 's3', learnsSkillId: 's2', teachesToUserId: 'u1' },
    ];

    const validation = validateCircleLoop(brokenLoop);
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBeDefined();
  });

  it('rejects duplicate users in circle proposal', () => {
    const duplicateLoop = [
      { userId: 'u1', teachesSkillId: 's1', learnsSkillId: 's2', teachesToUserId: 'u1' },
      { userId: 'u1', teachesSkillId: 's2', learnsSkillId: 's1', teachesToUserId: 'u1' },
    ];

    const validation = validateCircleLoop(duplicateLoop);
    expect(validation.isValid).toBe(false);
    expect(validation.error).toContain('Duplicate user');
  });

  it('discovers 3-person closed loop among realistic candidate users', () => {
    const skillsById: Record<string, Skill> = {
      's-design': { id: 's-design', name: 'Graphic Design', slug: 'design', is_custom: false, tags: [] },
      's-video': { id: 's-video', name: 'Video Editing', slug: 'video', is_custom: false, tags: [] },
      's-story': { id: 's-story', name: 'Storytelling', slug: 'story', is_custom: false, tags: [] },
    };

    const makeProfile = (id: string, name: string): Profile => ({
      id,
      email: `${id}@example.com`,
      full_name: name,
      timezone: 'UTC',
      language: 'English',
      preferred_format: 'small_group',
      free_exchange_only: true,
      paid_tutoring_offered: false,
      currency: 'USD',
      created_at: '',
      updated_at: '',
    });

    // Elena: teaches Design, wants Video
    const elena = {
      profile: makeProfile('elena', 'Elena'),
      teachingSkills: [{ id: 't1', user_id: 'elena', skill_id: 's-design', proficiency_level: 'advanced' as const, years_experience: 3, is_free_exchange: true, availability_hours_per_week: 2, skill: skillsById['s-design'] }],
      learningGoals: [{ id: 'l1', user_id: 'elena', skill_id: 's-video', current_proficiency: 'beginner' as const, desired_proficiency: 'intermediate' as const, preferred_format: 'small_group' as const, skill: skillsById['s-video'] }],
    };

    // Marcus: teaches Video, wants Story
    const marcus = {
      profile: makeProfile('marcus', 'Marcus'),
      teachingSkills: [{ id: 't2', user_id: 'marcus', skill_id: 's-video', proficiency_level: 'advanced' as const, years_experience: 3, is_free_exchange: true, availability_hours_per_week: 2, skill: skillsById['s-video'] }],
      learningGoals: [{ id: 'l2', user_id: 'marcus', skill_id: 's-story', current_proficiency: 'beginner' as const, desired_proficiency: 'intermediate' as const, preferred_format: 'small_group' as const, skill: skillsById['s-story'] }],
    };

    // Priya: teaches Story, wants Design
    const priya = {
      profile: makeProfile('priya', 'Priya'),
      teachingSkills: [{ id: 't3', user_id: 'priya', skill_id: 's-story', proficiency_level: 'advanced' as const, years_experience: 3, is_free_exchange: true, availability_hours_per_week: 2, skill: skillsById['s-story'] }],
      learningGoals: [{ id: 'l3', user_id: 'priya', skill_id: 's-design', current_proficiency: 'beginner' as const, desired_proficiency: 'intermediate' as const, preferred_format: 'small_group' as const, skill: skillsById['s-design'] }],
    };

    const circles = discoverSkillCircles(elena, [elena, marcus, priya], skillsById);
    expect(circles.length).toBeGreaterThan(0);
    expect(circles[0].loopSize).toBe(3);
    expect(circles[0].isFallbackTwoPerson).toBe(false);
    expect(circles[0].members).toHaveLength(3);
    expect(circles[0].edgeExplanations).toHaveLength(3);
  });
});
