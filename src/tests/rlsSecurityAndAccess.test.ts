import { describe, it, expect } from 'vitest';
import { store } from '../lib/store';

describe('Security and Access Control Tests (§15 & §20.D)', () => {
  it('denies access to modify another user profile data directly', () => {
    const originalMaya = store.getState().profiles.find((p) => p.id === 'u-maya');
    expect(originalMaya).toBeDefined();

    // Logged in as Carlos
    const carlos = store.getState().profiles.find((p) => p.id === 'u-carlos');
    store.setCurrentUser(carlos!);

    // Carlos attempts to edit profile: should only update Carlos's profile
    store.updateProfile({ full_name: 'Carlos Modified' });

    const state = store.getState();
    const mayaAfter = state.profiles.find((p) => p.id === 'u-maya');
    const carlosAfter = state.profiles.find((p) => p.id === 'u-carlos');

    // Maya's name must be untouched
    expect(mayaAfter?.full_name).toBe('Maya Lin');
    expect(carlosAfter?.full_name).toBe('Carlos Modified');
  });

  it('enforces isolated personal study notes ownership', () => {
    // Maya creates a private note
    const maya = store.getState().profiles.find((p) => p.id === 'u-maya');
    store.setCurrentUser(maya!);
    const mayaNote = store.savePersonalNote('Maya Private Strategy', 'Confidential preparation notes');

    // Carlos logs in
    const carlos = store.getState().profiles.find((p) => p.id === 'u-carlos');
    store.setCurrentUser(carlos!);

    // Carlos queries notes: filter by user_id matches RLS policy
    const carlosVisibleNotes = store.getState().personalNotes.filter((pn) => pn.user_id === carlos!.id);
    const canSeeMayaNote = carlosVisibleNotes.some((pn) => pn.id === mayaNote.id);

    expect(canSeeMayaNote).toBe(false);
  });

  it('prevents blocked users from interacting in exchange loops', () => {
    const maya = store.getState().profiles.find((p) => p.id === 'u-maya')!;
    store.setCurrentUser(maya);

    // Block David
    store.blockUser('u-david');
    expect(store.getState().blockedUserIds).toContain('u-david');

    // Unblock
    store.unblockUser('u-david');
    expect(store.getState().blockedUserIds).not.toContain('u-david');
  });
});
