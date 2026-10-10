import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App Smoke Test', () => {
  it('renders App root without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(screen.getAllByText(/SkillLoop/i).length).toBeGreaterThan(0);
  });
});
