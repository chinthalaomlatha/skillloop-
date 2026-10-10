import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

// Test consumer component
const ThemeTester: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="resolved-val">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')} data-testid="btn-light">Set Light</button>
      <button onClick={() => setTheme('dark')} data-testid="btn-dark">Set Dark</button>
      <button onClick={() => setTheme('system')} data-testid="btn-system">Set System</button>
    </div>
  );
};

describe('Theme System & Persistence Tests (§2.1)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('defaults to system theme and persists theme changes to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeTester />
      </ThemeProvider>
    );

    // Initial state
    expect(screen.getByTestId('theme-val').textContent).toBe('system');

    // Switch to dark
    fireEvent.click(screen.getByTestId('btn-dark'));
    expect(screen.getByTestId('theme-val').textContent).toBe('dark');
    expect(screen.getByTestId('resolved-val').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('skillloop_theme_mode')).toBe('dark');

    // Switch to light
    fireEvent.click(screen.getByTestId('btn-light'));
    expect(screen.getByTestId('theme-val').textContent).toBe('light');
    expect(screen.getByTestId('resolved-val').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('skillloop_theme_mode')).toBe('light');
  });

  it('renders ThemeToggle dropdown with Light, Dark, and System options', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /click to switch theme/i });
    expect(toggleBtn).toBeDefined();

    // Open dropdown
    fireEvent.click(toggleBtn);

    // Check menu options
    expect(screen.getAllByText('Light').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Dark').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('System')).toBeDefined();

    // Select Dark
    fireEvent.click(screen.getAllByText('Dark')[0]);
    expect(localStorage.getItem('skillloop_theme_mode')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
