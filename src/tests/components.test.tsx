import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCard } from '../components/matches/MatchCard';
import { LoopDiagram } from '../components/circles/LoopDiagram';
import { ResourceCard } from '../components/resources/ResourceCard';
import { PeerMatch, SkillCircleMember, LearningResource } from '../types';

describe('Frontend Component Tests (§20.B)', () => {
  it('renders MatchCard with explainable score and handles connect proposal', () => {
    const mockMatch: PeerMatch = {
      partnerId: 'u-carlos',
      partnerProfile: {
        id: 'u-carlos',
        email: 'carlos@example.com',
        full_name: 'Carlos Morales',
        headline: 'Spanish Teacher',
        timezone: 'UTC',
        language: 'English',
        preferred_format: '1:1',
        free_exchange_only: true,
        paid_tutoring_offered: false,
        currency: 'USD',
        created_at: '',
        updated_at: '',
      },
      partnerTeaches: [],
      partnerLearns: [],
      matchedTeachingSkill: {
        id: 'ts-c',
        user_id: 'u-carlos',
        skill_id: 's-span',
        proficiency_level: 'expert',
        years_experience: 5,
        is_free_exchange: true,
        availability_hours_per_week: 3,
        skill: { id: 's-span', name: 'Conversational Spanish', slug: 'spanish', is_custom: false, tags: [] },
      },
      matchedLearningGoal: {
        id: 'lg-c',
        user_id: 'u-carlos',
        skill_id: 's-py',
        current_proficiency: 'none',
        desired_proficiency: 'beginner',
        preferred_format: '1:1',
        skill: { id: 's-py', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] },
      },
      compatibilityScore: 95,
      scoreBreakdown: {
        skillComplementScore: 50,
        proficiencyBalanceScore: 20,
        availabilityOverlapScore: 15,
        languageFormatScore: 10,
      },
      explanation: 'Carlos can teach you Conversational Spanish, while you teach Python.',
      exchangeOpportunity: 'Two-way reciprocal loop',
      mutualAvailabilityOverlap: '3 hrs/wk matched availability',
      isFreeExchange: true,
    };

    const handleConnect = vi.fn();

    render(<MatchCard match={mockMatch} onRequestConnect={handleConnect} />);

    expect(screen.getByText('Carlos Morales')).toBeDefined();
    expect(screen.getByText('95%')).toBeDefined();
    expect(screen.getByText(/Why this match was recommended/i)).toBeDefined();

    // Click Propose Exchange button
    const proposeBtn = screen.getByText('Propose Exchange');
    fireEvent.click(proposeBtn);

    // Should reveal message textarea and Send Invitation button
    const sendBtn = screen.getByText(/Send Invitation/i);
    expect(sendBtn).toBeDefined();
    fireEvent.click(sendBtn);

    expect(handleConnect).toHaveBeenCalledTimes(1);
  });

  it('renders LoopDiagram with all connected node members', () => {
    const mockMembers: SkillCircleMember[] = [
      {
        id: 'm1',
        circle_id: 'c1',
        user_id: 'u1',
        teaches_skill_id: 's1',
        learns_skill_id: 's3',
        status: 'accepted',
        role: 'initiator',
        profile: { id: 'u1', email: '', full_name: 'Elena Rostova', timezone: 'UTC', language: 'English', preferred_format: '1:1', free_exchange_only: true, paid_tutoring_offered: false, currency: 'USD', created_at: '', updated_at: '' },
        teaches_skill: { id: 's1', name: 'Graphic Design', slug: 'design', is_custom: false, tags: [] },
        learns_skill: { id: 's3', name: 'Storytelling', slug: 'story', is_custom: false, tags: [] },
      },
      {
        id: 'm2',
        circle_id: 'c1',
        user_id: 'u2',
        teaches_skill_id: 's2',
        learns_skill_id: 's1',
        status: 'accepted',
        role: 'member',
        profile: { id: 'u2', email: '', full_name: 'Marcus Chen', timezone: 'UTC', language: 'English', preferred_format: '1:1', free_exchange_only: true, paid_tutoring_offered: false, currency: 'USD', created_at: '', updated_at: '' },
        teaches_skill: { id: 's2', name: 'Video Editing', slug: 'video', is_custom: false, tags: [] },
        learns_skill: { id: 's1', name: 'Graphic Design', slug: 'design', is_custom: false, tags: [] },
      },
    ];

    render(<LoopDiagram members={mockMembers} isFallbackTwoPerson={true} />);

    expect(screen.getByText('Elena Rostova')).toBeDefined();
    expect(screen.getByText('Marcus Chen')).toBeDefined();
    expect(screen.getByText(/Reciprocal 2-Person Exchange Loop/i)).toBeDefined();
  });

  it('renders ResourceCard with verified pricing badge and link', () => {
    const mockResource: LearningResource = {
      id: 'res-1',
      title: 'Python for Beginners Full Course',
      provider: 'freeCodeCamp',
      resource_type: 'video',
      url: 'https://youtube.com/watch?v=rfscVS0vtbw',
      pricing_status: 'free',
      source: 'youtube',
      description: 'Zero cost 4 hour Python course.',
      relevance_reason: 'Top rated beginner course.',
    };

    const handleSave = vi.fn();

    render(<ResourceCard resource={mockResource} onSaveToLibrary={handleSave} />);

    expect(screen.getByText('Python for Beginners Full Course')).toBeDefined();
    expect(screen.getByText('FREE')).toBeDefined();
    expect(screen.getByText(/By freeCodeCamp/i)).toBeDefined();
  });
});
