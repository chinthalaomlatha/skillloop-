import React from 'react';
import {
  X,
  BookOpen,
  Compass,
  Clock,
  Languages,
  CheckCircle2,
  Mail,
  ShieldAlert,
  UserX,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  Profile,
  UserTeachingSkill,
  UserLearningGoal,
  ProficiencyLevel,
} from '../../types';
import { Button } from '../ui/Button';

export interface ProfileDetailModalProps {
  profile: Profile | null;
  teaches: UserTeachingSkill[];
  learns: UserLearningGoal[];
  currentUser: Profile | null;
  currentUserTeaches: UserTeachingSkill[];
  currentUserLearns: UserLearningGoal[];
  isOpen: boolean;
  onClose: () => void;
  onRequestExchange: (profile: Profile) => void;
  onReport: (profile: Profile) => void;
  onBlock: (profile: Profile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  teaches,
  learns,
  currentUser,
  currentUserTeaches,
  currentUserLearns,
  isOpen,
  onClose,
  onRequestExchange,
  onReport,
  onBlock,
}) => {
  if (!isOpen || !profile) return null;

  // Compatibility explanation (§6 item 7)
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
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden transform transition-all z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar with Back button (§6.1) */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Browse
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                    {initials || 'U'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {profile.full_name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {profile.headline || 'Active SkillLoop Peer Member'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
                    {profile.timezone}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onClose();
                  onRequestExchange(profile);
                }}
                className="font-bold shadow-sm"
              >
                <Mail className="w-4 h-4 mr-1.5" /> Request Skill Exchange
              </Button>
            </div>

            {/* Potential Skill Compatibility Explanation (§6 item 7) */}
            <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Potential Skill Compatibility Analysis</span>
              </div>
              {reciprocalOffer && reciprocalWanted ? (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Excellent reciprocal match! You can learn <strong>{reciprocalWanted.skill?.name}</strong> from {profile.full_name}, and in return teach them <strong>{reciprocalOffer.skill?.name}</strong>.
                </p>
              ) : reciprocalWanted ? (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Partial match: {profile.full_name} can teach you <strong>{reciprocalWanted.skill?.name}</strong>, but has not listed any skills you currently teach.
                </p>
              ) : reciprocalOffer ? (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Partial match: You teach <strong>{reciprocalOffer.skill?.name}</strong> which {profile.full_name} wants to learn, but they do not teach any skills on your current learning wishlist.
                </p>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  No mutual skill goals overlap currently. You can still reach out with a custom proposal or browse other compatible members.
                </p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  About {profile.full_name.split(' ')[0]}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Teaching Skills (§6 item 1) */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Skills {profile.full_name.split(' ')[0]} Can Teach ({teaches.length})
              </h4>
              <div className="space-y-2">
                {teaches.map((ts) => (
                  <div
                    key={ts.id}
                    className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {ts.skill?.name || 'Skill'}
                      </span>
                      {ts.teaching_style && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Style: {ts.teaching_style}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${profColors[ts.proficiency_level]}`}>
                        {ts.proficiency_level}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ts.years_experience} yrs exp
                      </span>
                    </div>
                  </div>
                ))}
                {teaches.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No teaching skills listed.</p>
                )}
              </div>
            </div>

            {/* Learning Goals (§6 item 2) */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Skills {profile.full_name.split(' ')[0]} Wants to Learn ({learns.length})
              </h4>
              <div className="space-y-2">
                {learns.map((lg) => (
                  <div
                    key={lg.id}
                    className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {lg.skill?.name || 'Goal'}
                      </span>
                      {lg.learning_objective && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Goal: {lg.learning_objective}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Current: <strong className="capitalize">{lg.current_proficiency}</strong>
                      </span>
                      <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                        Target: <strong className="capitalize">{lg.desired_proficiency}</strong>
                      </span>
                    </div>
                  </div>
                ))}
                {learns.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No learning goals listed.</p>
                )}
              </div>
            </div>

            {/* Preferences & Availability Summary (§6 item 4, 5, 6) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Learning Format</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block capitalize">
                  {profile.preferred_format?.replace('_', ' ') || '1:1'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Language</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {profile.language || 'English'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Exchange Policy</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  {profile.free_exchange_only ? 'Free Peer Exchange' : 'Open to Tutoring'}
                </span>
              </div>
            </div>

            {/* Safety & Moderation Controls (§4.4) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Community Safety Tools:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReport(profile);
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Report Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBlock(profile);
                  }}
                  className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" /> Block Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
