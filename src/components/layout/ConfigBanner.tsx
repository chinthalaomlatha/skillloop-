import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Key, X } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const ConfigBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasOpenAi = Boolean(
    (import.meta as any).env?.VITE_OPENAI_API_KEY &&
    (import.meta as any).env?.VITE_OPENAI_API_KEY.startsWith('sk-')
  );

  const hasYouTube = Boolean((import.meta as any).env?.VITE_YOUTUBE_API_KEY);

  // If all are configured and user dismissed, hide
  if (dismissed && isSupabaseConfigured && hasOpenAi && hasYouTube) return null;

  const isFullyConfigured = isSupabaseConfigured && hasOpenAi && hasYouTube;

  if (dismissed && !expanded) return null;

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono text-[11px] font-semibold">
            <Key className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Platform Status
          </span>

          <span className="flex items-center gap-1">
            {isSupabaseConfigured ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" /> Supabase Live
              </span>
            ) : (
              <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1 font-medium">
                <Info className="w-3 h-3" /> Local Persistence Mode (Active)
              </span>
            )}
          </span>

          <span className="text-slate-400 dark:text-slate-600 hidden md:inline">•</span>

          <span className="flex items-center gap-1">
            {hasOpenAi ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" /> OpenAI Connected
              </span>
            ) : (
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium">
                <Info className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> AI Domain Mentor (Offline Mode)
              </span>
            )}
          </span>

          <span className="text-slate-400 dark:text-slate-600 hidden md:inline">•</span>

          <span className="flex items-center gap-1">
            {hasYouTube ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" /> YouTube API Live
              </span>
            ) : (
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium">
                <Info className="w-3 h-3 text-sky-600 dark:text-sky-400" /> Curated Educational Resources
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] cursor-pointer font-semibold"
          >
            {expanded ? 'Hide Details' : 'View Setup Guide'}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 rounded cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 max-w-7xl mx-auto">
          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed mb-2">
            SkillLoop AI strictly follows the <strong>Graceful Fallback Matrix</strong>. All 6 Demo-Critical features (auth, real peer matching, 3-person AI Skill Circles, AI domain mentoring, YouTube resource discovery, and personal library persistence) are 100% interactive and testable out-of-the-box.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-2">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <div className="text-slate-900 dark:text-white font-bold mb-1">1. Supabase PostgreSQL & Auth</div>
              <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                Copy <code>.env.example</code> to <code>.env</code> and set <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code>. Schema and migrations reside in <code>supabase/migrations/</code>.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-slate-900 dark:text-white font-bold mb-1">2. OpenAI API</div>
              <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                Set <code>VITE_OPENAI_API_KEY</code>. Without a key, the built-in domain-adaptive pedagogic mentor provides answers and quizzes for all skills.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-slate-900 dark:text-white font-bold mb-1">3. YouTube Data API v3</div>
              <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                Set <code>VITE_YOUTUBE_API_KEY</code>. If quota (100 units/day) is exhausted, the verified educational catalogue automatically serves results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
