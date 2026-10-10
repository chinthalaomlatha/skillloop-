import { describe, it, expect, beforeEach } from 'vitest';
import { searchEducationalResources, PRE_CACHED_RESOURCES } from '../lib/resourceService';
import { store } from '../lib/store';

describe('Resource Discovery & Persistence Tests (§9 & §18)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('serves pre-cached educational resources with verified links', async () => {
    const result = await searchEducationalResources('python');
    expect(result.resources.length).toBeGreaterThan(0);
    expect(result.isCached).toBe(true);
    expect(result.resources[0].pricing_status).toBe('free');
    expect(result.resources[0].url).toContain('https://');
  });

  it('persists saved resources and attached notes across sessions', () => {
    const sampleResource = PRE_CACHED_RESOURCES[0];
    const initialNote = 'Study loops and list comprehensions before Tuesday session.';

    const saved = store.saveResource(sampleResource, initialNote);
    expect(saved.notes).toBe(initialNote);
    expect(saved.status).toBe('not_started');

    // Update status to in_progress
    store.updateSavedResourceStatus(saved.id, 'in_progress', 'Completed unit 1.');
    const state = store.getState();
    const found = state.savedResources.find((sr) => sr.id === saved.id);

    expect(found?.status).toBe('in_progress');
    expect(found?.notes).toBe('Completed unit 1.');
  });

  it('persists user custom skills dynamically without code modification', () => {
    const custom = store.addCustomSkill(
      'Advanced Woodworking Joinery',
      'c14',
      'Mortise and tenon joints, dovetails, hand plane tuning',
      ['crafts', 'woodworking', 'diy']
    );

    const state = store.getState();
    const match = state.skills.find((s) => s.id === custom.id);
    expect(match).toBeDefined();
    expect(match?.name).toBe('Advanced Woodworking Joinery');
    expect(match?.is_custom).toBe(true);
  });
});
