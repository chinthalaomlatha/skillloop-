import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PersonCard } from '../components/explore/PersonCard';
import { ExplorePage } from '../pages/ExplorePage';
import { store } from '../lib/store';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Profile, UserTeachingSkill, UserLearningGoal } from '../types';

describe('Explore & Person Card Component Tests (§4 & §5)', () => {
  beforeEach(() => {
    store.resetToSeed();
    localStorage.clear();
  });

  const currentUser: Profile = {
    id: 'u-maya',
    email: 'maya@example.com',
    full_name: 'Maya Lin',
    headline: 'Python Developer',
    timezone: 'UTC-5',
    language: 'English',
    preferred_format: '1:1',
    free_exchange_only: true,
    paid_tutoring_offered: false,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mayaTeaches: UserTeachingSkill[] = [
    {
      id: 'ts-m1',
      user_id: 'u-maya',
      skill_id: 's1',
      proficiency_level: 'expert',
      years_experience: 5,
      is_free_exchange: true,
      availability_hours_per_week: 3,
      skill: { id: 's1', category_id: 'c1', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] },
    },
  ];

  const mayaLearns: UserLearningGoal[] = [
    {
      id: 'lg-m1',
      user_id: 'u-maya',
      skill_id: 's3',
      current_proficiency: 'beginner',
      desired_proficiency: 'intermediate',
      preferred_format: '1:1',
      skill: { id: 's3', category_id: 'c7', name: 'Conversational Spanish', slug: 'spanish', is_custom: false, tags: [] },
    },
  ];

  const carlosProfile: Profile = {
    id: 'u-carlos',
    email: 'carlos@example.com',
    full_name: 'Carlos Morales',
    headline: 'Native Spanish Speaker',
    bio: 'Bilingual educator based in Bogota.',
    timezone: 'UTC-5',
    language: 'English',
    preferred_format: '1:1',
    free_exchange_only: true,
    paid_tutoring_offered: false,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const carlosTeaches: UserTeachingSkill[] = [
    {
      id: 'ts-c1',
      user_id: 'u-carlos',
      skill_id: 's3',
      proficiency_level: 'expert',
      years_experience: 6,
      is_free_exchange: true,
      availability_hours_per_week: 3,
      skill: { id: 's3', category_id: 'c7', name: 'Conversational Spanish', slug: 'spanish', is_custom: false, tags: [] },
    },
  ];

  const carlosLearns: UserLearningGoal[] = [
    {
      id: 'lg-c1',
      user_id: 'u-carlos',
      skill_id: 's1',
      current_proficiency: 'none',
      desired_proficiency: 'beginner',
      preferred_format: '1:1',
      skill: { id: 's1', category_id: 'c1', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] },
    },
  ];

  const davidProfile: Profile = {
    id: 'u-david',
    email: 'david@example.com',
    full_name: 'David Miller',
    headline: 'Artisan Sourdough Baker',
    bio: '10 years sourdough baking enthusiast.',
    timezone: 'UTC-6',
    language: 'English',
    preferred_format: '1:1',
    free_exchange_only: true,
    paid_tutoring_offered: false,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const davidTeaches: UserTeachingSkill[] = [
    {
      id: 'ts-d1',
      user_id: 'u-david',
      skill_id: 's7',
      proficiency_level: 'expert',
      years_experience: 7,
      is_free_exchange: true,
      availability_hours_per_week: 2,
      skill: { id: 's7', category_id: 'c10', name: 'Artisan Sourdough & Baking', slug: 'sourdough', is_custom: false, tags: [] },
    },
  ];

  const davidLearns: UserLearningGoal[] = [
    {
      id: 'lg-d1',
      user_id: 'u-david',
      skill_id: 's8',
      current_proficiency: 'none',
      desired_proficiency: 'beginner',
      preferred_format: '1:1',
      skill: { id: 's8', category_id: 'c11', name: 'Calisthenics & Fitness', slug: 'calisthenics', is_custom: false, tags: [] },
    },
  ];

  it('renders PersonCard with Reciprocal hint when mutual match exists (§4.3)', () => {
    const onViewProfile = vi.fn();
    const onRequestExchange = vi.fn();

    render(
      <PersonCard
        profile={carlosProfile}
        teaches={carlosTeaches}
        learns={carlosLearns}
        currentUser={currentUser}
        currentUserTeaches={mayaTeaches}
        currentUserLearns={mayaLearns}
        onViewProfile={onViewProfile}
        onRequestExchange={onRequestExchange}
        onReport={vi.fn()}
        onBlock={vi.fn()}
      />
    );

    // Profile info
    expect(screen.getByText('Carlos Morales')).toBeDefined();
    expect(screen.getByText('Native Spanish Speaker')).toBeDefined();

    // Teaching & learning skill chips
    expect(screen.getByText('Conversational Spanish')).toBeDefined();
    expect(screen.getAllByText('Python Programming').length).toBeGreaterThanOrEqual(1);

    // Reciprocal reciprocity indicator (§4.3)
    const reciprocityText = screen.getByText(/You can offer:/i);
    expect(reciprocityText).toBeDefined();
    expect(screen.getByText(/they want to learn this/i)).toBeDefined();

    // Trigger actions
    fireEvent.click(screen.getByRole('button', { name: /request skill exchange/i }));
    expect(onRequestExchange).toHaveBeenCalledWith(carlosProfile);
  });

  it('renders honest warning indicator when no reciprocal match exists (§4.3)', () => {
    render(
      <PersonCard
        profile={davidProfile}
        teaches={davidTeaches}
        learns={davidLearns}
        currentUser={currentUser}
        currentUserTeaches={mayaTeaches}
        currentUserLearns={mayaLearns}
        onViewProfile={vi.fn()}
        onRequestExchange={vi.fn()}
        onReport={vi.fn()}
        onBlock={vi.fn()}
      />
    );

    // David teaches Sourdough, Maya teaches Python and wants Spanish. No reciprocal match!
    const warningText = screen.getByText(/No reciprocal skill match — you can still send a one-way request/i);
    expect(warningText).toBeDefined();
  });

  it('renders overflow menu with View Profile, Report, and Block actions (§4.4)', () => {
    const onBlock = vi.fn();
    const onReport = vi.fn();

    render(
      <PersonCard
        profile={carlosProfile}
        teaches={carlosTeaches}
        learns={carlosLearns}
        currentUser={currentUser}
        currentUserTeaches={mayaTeaches}
        currentUserLearns={mayaLearns}
        onViewProfile={vi.fn()}
        onRequestExchange={vi.fn()}
        onReport={onReport}
        onBlock={onBlock}
      />
    );

    // Open overflow menu
    const menuBtn = screen.getByLabelText(/options for carlos morales/i);
    fireEvent.click(menuBtn);

    // Check menu options
    expect(screen.getByText(/report member/i)).toBeDefined();
    expect(screen.getByText(/block member/i)).toBeDefined();

    // Trigger block
    fireEvent.click(screen.getByText(/block member/i));
    expect(onBlock).toHaveBeenCalledWith(carlosProfile);
  });

  it('renders ExplorePage with real profiles, search, and URL parameter hydration (§3 & §5)', () => {
    render(
      <MemoryRouter initialEntries={['/explore?q=Spanish']}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/explore" element={<ExplorePage />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Header title and search bar
    expect(screen.getByText(/Discover Exchange Peers/i)).toBeDefined();
    const searchInput = screen.getByPlaceholderText(/Search skills or people…/i) as HTMLInputElement;
    expect(searchInput.value).toBe('Spanish');

    // Carlos Morales teaches Spanish, so his card should appear in the results
    expect(screen.getByText('Carlos Morales')).toBeDefined();
  });
});
