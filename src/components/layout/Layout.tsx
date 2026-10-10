import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ConfigBanner } from './ConfigBanner';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      <ConfigBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <Footer />

      {/* Persistent Floating 1-Click Theme Switcher (Always visible in bottom-right corner) */}
      <aside
        aria-label="Quick theme switcher"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl border border-slate-300 dark:border-slate-700 text-xs transition-transform hover:scale-105"
      >
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-0.5 hidden sm:inline">Theme:</span>
        <button
          type="button"
          onClick={() => setTheme('light')}
          title="Switch to Lighting / Light Mode (1-Click)"
          aria-label="Switch to Light mode"
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            resolvedTheme === 'light'
              ? 'bg-amber-500 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          title="Switch to Dark Mode (1-Click)"
          aria-label="Switch to Dark mode"
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            resolvedTheme === 'dark'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-300" />
          <span>Dark</span>
        </button>
      </aside>
    </div>
  );
};
