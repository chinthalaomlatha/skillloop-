import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../lib/store';

describe('Exchange Request Validation & Rate Limiting (§7.3 & §7.5)', () => {
  beforeEach(() => {
    store.resetToSeed();
  });

  it('prevents a user from requesting an exchange with themselves', () => {
    const currentUser = store.getCurrentUser();
    expect(currentUser).toBeDefined();

    expect(() => {
      store.sendMatchRequest(currentUser!.id, 's1', 's3', 'Testing self-request');
    }).toThrow('You cannot propose a skill exchange with yourself.');
  });

  it('prevents duplicate pending requests between the same exchange pair', () => {
    // Current user is Maya (u-maya)
    // Send a request to David (u-david) who doesn't have a pending request with Maya initially
    store.sendMatchRequest('u-david', 's1', 's7', 'Hey David, let us exchange!');

    // Trying to send another pending request to David must fail
    expect(() => {
      store.sendMatchRequest('u-david', 's1', 's7', 'Another request to David');
    }).toThrow('A pending exchange request between you and this member already exists.');
  });

  it('enforces hourly rate limit of maximum 10 requests per user', () => {
    const state = store.getState();
    const currentUser = store.getCurrentUser()!;

    // Clear existing requests to have a clean slate
    state.matchRequests = [];

    // Successfully send 10 requests to different dummy user IDs
    for (let i = 1; i <= 10; i++) {
      const dummyUserId = `u-target-${i}`;
      // Add a dummy target profile so receiver lookup works
      state.profiles.push({
        id: dummyUserId,
        email: `dummy${i}@example.com`,
        full_name: `Dummy Target ${i}`,
        timezone: 'UTC',
        language: 'English',
        preferred_format: '1:1',
        free_exchange_only: true,
        paid_tutoring_offered: false,
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const req = store.sendMatchRequest(dummyUserId, 's1', 's3', `Request number ${i}`);
      expect(req).toBeDefined();
      expect(req.status).toBe('pending');
    }

    // The 11th request within the hour must be rejected
    const dummyUserId11 = 'u-target-11';
    state.profiles.push({
      id: dummyUserId11,
      email: 'dummy11@example.com',
      full_name: 'Dummy Target 11',
      timezone: 'UTC',
      language: 'English',
      preferred_format: '1:1',
      free_exchange_only: true,
      paid_tutoring_offered: false,
      currency: 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    expect(() => {
      store.sendMatchRequest(dummyUserId11, 's1', 's3', '11th request attempt');
    }).toThrow(/Hourly exchange request limit reached/);
  });
});
