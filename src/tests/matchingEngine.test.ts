import { describe, it, expect } from 'vitest';
import { calculateCompatibility, findPeerMatches } from '../lib/matchingEngine';
import { Profile, UserTeachingSkill, UserLearningGoal } from '../types';

describe('Matching Engine Tests (§6)', () => {
  const userAProfile: Profile = {
    id: 'user-a',
    email: 'a@example.com',
    full_name: 'Alice',
    timezone: 'UTC',
    language: 'English',
    preferred_format: '1:1',
    free_exchange_only: true,
    paid_tutoring_offered: false,
    currency: 'USD',
    created_at: '',
    updated_at: '',
  };

  const userBProfile: Profile = {
    id: 'user-b',
    email: 'b@example.com',
    full_name: 'Bob',
    timezone: 'UTC',
    language: 'English',
    preferred_format: '1:1',
    free_exchange_only: true,
    paid_tutoring_offered: false,
    currency: 'USD',
    created_at: '',
    updated_at: '',
  };

  const pythonTeach: UserTeachingSkill = {
    id: 'ts-1',
    user_id: 'user-a',
    skill_id: 's-python',
    proficiency_level: 'expert',
    years_experience: 5,
    is_free_exchange: true,
    availability_hours_per_week: 3,
    skill: { id: 's-python', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] },
  };

  const spanishLearn: UserLearningGoal = {
    id: 'lg-1',
    user_id: 'user-a',
    skill_id: 's-spanish',
    current_proficiency: 'none',
    desired_proficiency: 'intermediate',
    preferred_format: '1:1',
    skill: { id: 's-spanish', name: 'Conversational Spanish', slug: 'spanish', is_custom: false, tags: [] },
  };

  const spanishTeach: UserTeachingSkill = {
    id: 'ts-2',
    user_id: 'user-b',
    skill_id: 's-spanish',
    proficiency_level: 'expert',
    years_experience: 6,
    is_free_exchange: true,
    availability_hours_per_week: 3,
    skill: { id: 's-spanish', name: 'Conversational Spanish', slug: 'spanish', is_custom: false, tags: [] },
  };

  const pythonLearn: UserLearningGoal = {
    id: 'lg-2',
    user_id: 'user-b',
    skill_id: 's-python',
    current_proficiency: 'beginner',
    desired_proficiency: 'intermediate',
    preferred_format: '1:1',
    skill: { id: 's-python', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] },
  };

  it('calculates reciprocal two-way compatibility score correctly', () => {
    const userA = {
      profile: userAProfile,
      teachingSkills: [pythonTeach],
      learningGoals: [spanishLearn],
    };

    const userB = {
      profile: userBProfile,
      teachingSkills: [spanishTeach],
      learningGoals: [pythonLearn],
    };

    const result = calculateCompatibility(userA, userB);

    // Mutual reciprocal exchange: 50 pts skill complement + 20 pts proficiency + 15 availability + 15 language/format = 100 pts
    expect(result.score).toBe(100);
    expect(result.breakdown.skillComplementScore).toBe(50);
    expect(result.breakdown.proficiencyBalanceScore).toBe(20);
    expect(result.breakdown.availabilityOverlapScore).toBe(15);
    expect(result.breakdown.languageFormatScore).toBe(15);
    expect(result.explanation).toContain('Bob can teach you Conversational Spanish');
    expect(result.exchangeOpportunity).toContain('Two-way reciprocal loop');
  });

  it('enforces mandatory free-first filtering before ranking', () => {
    const paidUserBProfile: Profile = {
      ...userBProfile,
      free_exchange_only: false,
      paid_tutoring_offered: true,
    };

    const userA = {
      profile: userAProfile,
      teachingSkills: [pythonTeach],
      learningGoals: [spanishLearn],
    };

    const candidates = [
      {
        profile: paidUserBProfile,
        teachingSkills: [spanishTeach],
        learningGoals: [pythonLearn],
      },
    ];

    // User A has freeExchangeOnly: true
    const matchesFreeOnly = findPeerMatches(userA, candidates, [], { freeExchangeOnly: true });
    expect(matchesFreeOnly).toHaveLength(0);

    // If freeExchangeOnly is false, paid user is included
    const matchesAll = findPeerMatches(userA, candidates, [], { freeExchangeOnly: false });
    expect(matchesAll).toHaveLength(1);
    expect(matchesAll[0].partnerId).toBe('user-b');
  });

  it('prevents matching user with themselves', () => {
    const userA = {
      profile: userAProfile,
      teachingSkills: [pythonTeach],
      learningGoals: [spanishLearn],
    };

    const candidates = [
      {
        profile: userAProfile,
        teachingSkills: [pythonTeach],
        learningGoals: [spanishLearn],
      },
    ];

    const matches = findPeerMatches(userA, candidates);
    expect(matches).toHaveLength(0);
  });
});
