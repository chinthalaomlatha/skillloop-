import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  ShieldAlert,
  UserX,
  Eye,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Compass,
  Languages,
  Globe,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  Profile,
  UserTeachingSkill,
  UserLearningGoal,
  ProficiencyLevel,
} from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface PersonCardProps {
  profile: Profile;
  teaches: UserTeachingSkill[];
  learns: UserLearningGoal[];
  currentUser: Profile | null;
  currentUserTeaches: UserTeachingSkill[];
  currentUserLearns: UserLearningGoal[];
  onViewProfile: (profile: Profile) => void;
  onRequestExchange: (profile: Profile) => void;
  onReport: (profile: Profile) => void;
  onBlock: (profile: Profile) => void;
  isAiRecommended?: boolean;
  aiRecommendationReason?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  profile,
  teaches,
  learns,
  currentUser,
  currentUserTeaches,
  currentUserLearns,
  onViewProfile,
  onRequestExchange,
  onReport,
  onBlock,
  isAiRecommended = false,
  aiRecommendationReason,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dismissAiChip, setDismissAiChip] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine Reciprocal Match (§4.3)
  const reciprocalOffer = currentUserTeaches.find((ts) =>
    learns.some(
      (lg) =>
        lg.skill_id === ts.skill_id ||
        (lg.skill?.name && ts.skill?.name && lg.skill.name.toLowerCase() === ts.skill.name.toLowerCase())
    )
  );

  const reciprocalWanted = teaches.find((ts) =>
    currentUserLearns.some(
      (lg) =>
        lg.skill_id === ts.skill_id ||
        (lg.skill?.name && ts.skill?.name && lg.skill.name.toLowerCase() === ts.skill.name.toLowerCase())
    )
  );

  const isReciprocal = Boolean(reciprocalOffer && reciprocalWanted);

  // Proficiency label styling token mapping (§4.2)
  const primaryTeachingSkill = teaches[0];
  const proficiency = primaryTeachingSkill?.proficiency_level || 'intermediate';

  const profColors: Record<ProficiencyLevel, string> = {
    beginner: 'bg-[var(--prof-beginner-bg)] text-[var(--prof-beginner-text)] border-[var(--prof-beginner-border)]',
    intermediate: 'bg-[var(--prof-intermediate-bg)] text-[var(--prof-intermediate-text)] border-[var(--prof-intermediate-border)]',
    advanced: 'bg-[var(--prof-advanced-bg)] text-[var(--prof-advanced-text)] border-[var(--prof-advanced-border)]',
    expert: 'bg-[var(--prof-expert-bg)] text-[var(--prof-expert-text)] border-[var(--prof-expert-border)]',
  };

  const initials = profile.full_name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                {initials || 'U'}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 truncate">
                {profile.full_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {profile.headline || profile.timezone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Optional AI Recommendation Chip (§8.2) */}
            {isAiRecommended && !dismissAiChip && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 cursor-help"
                title={aiRecommendationReason || 'AI suggests this peer based on complementary skills'}
              >
                <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                <span>AI suggests</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissAiChip(true);
                  }}
                  className="hover:text-indigo-900 dark:hover:text-white ml-0.5"
                  aria-label="Dismiss AI suggestion"
                >
                  &times;
                </button>
              </span>
            )}

            {/* Overflow "..." Menu (§4.4) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Options for ${profile.full_name}`}
                aria-expanded={menuOpen}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1 z-40">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onViewProfile(profile);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onReport(profile);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Report Member
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onBlock(profile);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <UserX className="w-3.5 h-3.5 text-rose-500" /> Block Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Short Bio (truncated to 2 lines per §4.1) */}
        {profile.bio && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {profile.bio}
          </p>
        )}

        {/* Two Skill Columns (§4.1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Teaches column */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Teaches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {teaches.slice(0, 3).map((ts) => (
                <span
                  key={ts.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                  style={{
                    backgroundColor: 'var(--chip-teach-bg)',
                    color: 'var(--chip-teach-text)',
                    borderColor: 'var(--chip-teach-border)',
                  }}
                >
                  {ts.skill?.name || 'Skill'}
                </span>
              ))}
              {teaches.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  +{teaches.length - 3} more
                </span>
              )}
              {teaches.length === 0 && (
                <span className="text-[11px] text-slate-400 italic">None listed</span>
              )}
            </div>
          </div>

          {/* Wants to Learn column */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Compass className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Wants to learn
            </span>
            <div className="flex flex-wrap gap-1.5">
              {learns.slice(0, 3).map((lg) => (
                <span
                  key={lg.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                  style={{
                    backgroundColor: 'var(--chip-learn-bg)',
                    color: 'var(--chip-learn-text)',
                    borderColor: 'var(--chip-learn-border)',
                  }}
                >
                  {lg.skill?.name || 'Goal'}
                </span>
              ))}
              {learns.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  +{learns.length - 3} more
                </span>
              )}
              {learns.length === 0 && (
                <span className="text-[11px] text-slate-400 italic">None listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta Row (§4.1 item 5) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-3 text-[11px] border-t border-slate-100 dark:border-slate-800">
          {primaryTeachingSkill && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium border capitalize ${profColors[proficiency]}`}
              title="Self-reported proficiency"
            >
              {proficiency} level
            </span>
          )}

          {profile.preferred_format && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3" />
              {profile.preferred_format === '1:1'
                ? '1:1 Sessions'
                : profile.preferred_format === 'small_group'
                ? 'Small Groups'
                : 'Self-paced with AI'}
            </span>
          )}

          {profile.language && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Languages className="w-3 h-3" />
              {profile.language}
            </span>
          )}

          {profile.free_exchange_only && (
            <span
              className="px-2 py-0.5 rounded-full font-bold border text-[10px] uppercase tracking-wide"
              style={{
                backgroundColor: 'var(--badge-free-bg)',
                color: 'var(--badge-free-text)',
                borderColor: 'var(--badge-free-border)',
              }}
            >
              Free Exchange
            </span>
          )}
        </div>

        {/* Reciprocity Hint (§4.3) */}
        <div className="mb-4">
          {isReciprocal && reciprocalOffer ? (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
              <span className="text-sm shrink-0">💡</span>
              <span className="leading-snug">
                You can offer: <strong>{reciprocalOffer.skill?.name || 'Your skill'}</strong> — they want to learn this.
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <span className="text-sm shrink-0">⚠</span>
              <span className="leading-snug">
                No reciprocal skill match — you can still send a one-way request, but acceptance may be unlikely.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons (§4.1 item 7) */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRequestExchange(profile)}
          className="flex-1 font-semibold"
        >
          Request Skill Exchange
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(profile)}
          className="shrink-0"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};
