import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import {
  Profile,
  Skill,
  SkillCategory,
  ProficiencyLevel,
  PreferredFormat,
  MatchRequest,
  ReportItem,
} from '../types';
import { calculateCompatibility } from '../lib/matchingEngine';
import { PersonCard } from '../components/explore/PersonCard';
import { RequestExchangeModal } from '../components/explore/RequestExchangeModal';
import { ProfileDetailModal } from '../components/explore/ProfileDetailModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

export const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // App store state
  const [appState, setAppState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((s) => setAppState({ ...s }));
    return () => unsubscribe();
  }, []);

  // Hydrate filters from URL on load (§3.4)
  const searchQuery = searchParams.get('q') || '';
  const teachSkillFilter = searchParams.get('teach') || '';
  const learnSkillFilter = searchParams.get('learn') || '';
  const categoryFilter = searchParams.get('category') || '';
  const proficiencyFilter = (searchParams.get('level') as ProficiencyLevel) || '';
  const freeOnlyFilter = searchParams.get('free') !== 'false'; // default true (§5.2)
  const formatFilter = (searchParams.get('format') as PreferredFormat) || '';
  const languageFilter = searchParams.get('lang') || '';
  const sortBy = searchParams.get('sort') || 'recent'; // default recently active (§3.5)
  const pageNum = parseInt(searchParams.get('page') || '1', 10);
  const activeProfileId = searchParams.get('profile') || '';

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [requestTargetProfile, setRequestTargetProfile] = useState<Profile | null>(null);
  const [reportingProfile, setReportingProfile] = useState<Profile | null>(null);
  const [reportReason, setReportReason] = useState<ReportItem['reason']>('inappropriate_behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to update URL search parameters while preserving state (§3.4)
  const updateUrlParam = (key: string, value: string, pushHistory = false) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || (key === 'page' && value === '1') || (key === 'free' && value === 'true') || (key === 'sort' && value === 'recent')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    // Reset page to 1 when changing filters
    if (key !== 'page' && key !== 'profile') {
      newParams.delete('page');
    }

    if (pushHistory) {
      setSearchParams(newParams);
    } else {
      setSearchParams(newParams, { replace: true });
    }
  };

  // Clear all filters (§5.1)
  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    // Keep sort and free preference if preferred
    newParams.set('free', 'true');
    setSearchParams(newParams);
  };

  // Demo mode vs Production Mode isolation (§9.3)
  const isDemo = appState.isDemoMode !== false;

  // Filter eligible profiles
  const eligibleProfiles = useMemo(() => {
    let pool = appState.profiles.filter((p) => {
      // Exclude blocked users (§4.4)
      if (appState.blockedUserIds.includes(p.id)) return false;
      // Exclude current logged in user
      if (user && p.id === user.id) return false;
      return true;
    });

    // 1. Mandatory Free-first filtering (§5.2 & §6)
    if (freeOnlyFilter) {
      pool = pool.filter((p) => p.free_exchange_only);
    }

    // 2. Search query matches name, bio, teaching skills, or learning goals (§5.2)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter((p) => {
        const matchesName = p.full_name.toLowerCase().includes(q);
        const matchesBio = p.bio?.toLowerCase().includes(q) || false;
        const matchesHeadline = p.headline?.toLowerCase().includes(q) || false;

        const userTeaches = appState.teachingSkills.filter((ts) => ts.user_id === p.id);
        const matchesTeaches = userTeaches.some(
          (ts) => ts.skill?.name.toLowerCase().includes(q) || ts.skill?.tags?.some((t) => t.toLowerCase().includes(q))
        );

        const userLearns = appState.learningGoals.filter((lg) => lg.user_id === p.id);
        const matchesLearns = userLearns.some(
          (lg) => lg.skill?.name.toLowerCase().includes(q) || lg.skill?.tags?.some((t) => t.toLowerCase().includes(q))
        );

        return matchesName || matchesBio || matchesHeadline || matchesTeaches || matchesLearns;
      });
    }

    // 3. Category filter (§5.1)
    if (categoryFilter) {
      pool = pool.filter((p) => {
        const userTeaches = appState.teachingSkills.filter((ts) => ts.user_id === p.id);
        const userLearns = appState.learningGoals.filter((lg) => lg.user_id === p.id);
        return (
          userTeaches.some((ts) => ts.skill?.category_id === categoryFilter) ||
          userLearns.some((lg) => lg.skill?.category_id === categoryFilter)
        );
      });
    }

    // 4. Skill they can teach filter
    if (teachSkillFilter) {
      pool = pool.filter((p) => {
        const userTeaches = appState.teachingSkills.filter((ts) => ts.user_id === p.id);
        return userTeaches.some((ts) => ts.skill_id === teachSkillFilter || ts.skill?.slug === teachSkillFilter);
      });
    }

    // 5. Skill they want to learn filter
    if (learnSkillFilter) {
      pool = pool.filter((p) => {
        const userLearns = appState.learningGoals.filter((lg) => lg.user_id === p.id);
        return userLearns.some((lg) => lg.skill_id === learnSkillFilter || lg.skill?.slug === learnSkillFilter);
      });
    }

    // 6. Proficiency filter
    if (proficiencyFilter) {
      pool = pool.filter((p) => {
        const userTeaches = appState.teachingSkills.filter((ts) => ts.user_id === p.id);
        return userTeaches.some((ts) => ts.proficiency_level === proficiencyFilter);
      });
    }

    // 7. Preferred format filter
    if (formatFilter) {
      pool = pool.filter((p) => p.preferred_format === formatFilter);
    }

    // 8. Language filter
    if (languageFilter) {
      pool = pool.filter((p) => p.language.toLowerCase().includes(languageFilter.toLowerCase()));
    }

    // 9. Sorting (§3.5)
    const sorted = [...pool];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'alpha') {
      sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sortBy === 'ai_match' && user) {
      const myTeaches = appState.teachingSkills.filter((ts) => ts.user_id === user.id);
      const myLearns = appState.learningGoals.filter((lg) => lg.user_id === user.id);
      sorted.sort((a, b) => {
        const aCand = {
          profile: a,
          teachingSkills: appState.teachingSkills.filter((ts) => ts.user_id === a.id),
          learningGoals: appState.learningGoals.filter((lg) => lg.user_id === a.id),
        };
        const bCand = {
          profile: b,
          teachingSkills: appState.teachingSkills.filter((ts) => ts.user_id === b.id),
          learningGoals: appState.learningGoals.filter((lg) => lg.user_id === b.id),
        };
        const scoreA = calculateCompatibility({ profile: user, teachingSkills: myTeaches, learningGoals: myLearns }, aCand).score;
        const scoreB = calculateCompatibility({ profile: user, teachingSkills: myTeaches, learningGoals: myLearns }, bCand).score;
        return scoreB - scoreA;
      });
    } else {
      // Default: Recently active (§3.5)
      sorted.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
    }

    return sorted;
  }, [
    appState.profiles,
    appState.blockedUserIds,
    appState.teachingSkills,
    appState.learningGoals,
    user,
    isDemo,
    freeOnlyFilter,
    searchQuery,
    categoryFilter,
    teachSkillFilter,
    learnSkillFilter,
    proficiencyFilter,
    formatFilter,
    languageFilter,
    sortBy,
  ]);

  // Pagination (6 items per page)
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(eligibleProfiles.length / pageSize));
  const currentPage = Math.min(Math.max(1, pageNum), totalPages);
  const paginatedProfiles = eligibleProfiles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Active filter count
  const activeFilterCount = [
    Boolean(searchQuery),
    Boolean(teachSkillFilter),
    Boolean(learnSkillFilter),
    Boolean(categoryFilter),
    Boolean(proficiencyFilter),
    freeOnlyFilter === false, // count if user changed default free-only
    Boolean(formatFilter),
    Boolean(languageFilter),
  ].filter(Boolean).length;

  // Currently viewed profile for modal
  const selectedProfile = useMemo(() => {
    if (!activeProfileId) return null;
    return appState.profiles.find((p) => p.id === activeProfileId) || null;
  }, [activeProfileId, appState.profiles]);

  // Open profile detail view with native Back support (§6.1)
  const handleOpenProfile = (profile: Profile) => {
    updateUrlParam('profile', profile.id, true);
  };

  const handleCloseProfile = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('profile');
    setSearchParams(newParams);
  };

  // Block user handler
  const handleBlockUser = (p: Profile) => {
    store.blockUser(p.id);
    setToastMessage(`Blocked ${p.full_name}. Their profile will no longer appear.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit report handler
  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingProfile) return;
    store.submitReport(reportingProfile.id, reportReason, reportDetails);
    setReportingProfile(null);
    setReportDetails('');
    setToastMessage(`Report regarding ${reportingProfile.full_name} submitted to moderators.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Current user's skills for reciprocity checks
  const myTeaches = user ? appState.teachingSkills.filter((ts) => ts.user_id === user.id) : [];
  const myLearns = user ? appState.learningGoals.filter((lg) => lg.user_id === user.id) : [];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Search and Mode Badge */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Discover Exchange Peers
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Browse real, eligible members. See what they teach, what they want to learn, and honest reciprocity indicators.
          </p>
        </div>

        {/* Quick Links & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Selector (§3.5) */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => updateUrlParam('sort', e.target.value)}
              className="p-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Sort members by"
            >
              <option value="recent">Recently active (Default)</option>
              <option value="newest">Newest members</option>
              <option value="alpha">Alphabetical (A–Z)</option>
              <option value="ai_match">AI Match Score (Optional)</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Search Bar & Quick Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateUrlParam('q', e.target.value)}
              placeholder="Search skills or people…"
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => updateUrlParam('q', '')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toggle: Free Exchange Only (§5.1 & §5.2) */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none shrink-0 px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={freeOnlyFilter}
              onChange={(e) => updateUrlParam('free', e.target.checked ? 'true' : 'false')}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span>Free exchange only</span>
          </label>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {/* Expandable Filter Grid (§5.1) */}
        {filtersOpen && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => updateUrlParam('category', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Categories (16)</option>
                {appState.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teaches Skill Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Skill They Teach
              </label>
              <select
                value={teachSkillFilter}
                onChange={(e) => updateUrlParam('teach', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Teaching Skill</option>
                {appState.skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wants to Learn Skill Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Skill They Want
              </label>
              <select
                value={learnSkillFilter}
                onChange={(e) => updateUrlParam('learn', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Learning Goal</option>
                {appState.skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Proficiency Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Proficiency Level
              </label>
              <select
                value={proficiencyFilter}
                onChange={(e) => updateUrlParam('level', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Format Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Learning Format
              </label>
              <select
                value={formatFilter}
                onChange={(e) => updateUrlParam('format', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Format</option>
                <option value="1:1">1:1 Sessions</option>
                <option value="small_group">Small Group</option>
                <option value="self_paced_ai">Self-Paced</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Language
              </label>
              <select
                value={languageFilter}
                onChange={(e) => updateUrlParam('lang', e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong>{paginatedProfiles.length}</strong> of <strong>{eligibleProfiles.length}</strong> eligible member{eligibleProfiles.length !== 1 ? 's' : ''}
        </span>
        {activeFilterCount > 0 && (
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''} applied
          </span>
        )}
      </div>

      {/* Person Cards Grid (§4) */}
      {paginatedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProfiles.map((p) => {
            const teaches = appState.teachingSkills.filter((ts) => ts.user_id === p.id);
            const learns = appState.learningGoals.filter((lg) => lg.user_id === p.id);

            // Compute AI recommendation indicator (§8)
            let isAiRec = false;
            let aiReason = '';
            if (user) {
              const comp = calculateCompatibility(
                { profile: user, teachingSkills: myTeaches, learningGoals: myLearns },
                { profile: p, teachingSkills: teaches, learningGoals: learns }
              );
              if (comp.score >= 80) {
                isAiRec = true;
                aiReason = comp.explanation;
              }
            }

            return (
              <PersonCard
                key={p.id}
                profile={p}
                teaches={teaches}
                learns={learns}
                currentUser={user}
                currentUserTeaches={myTeaches}
                currentUserLearns={myLearns}
                onViewProfile={handleOpenProfile}
                onRequestExchange={(target) => setRequestTargetProfile(target)}
                onReport={(target) => setReportingProfile(target)}
                onBlock={handleBlockUser}
                isAiRecommended={isAiRec}
                aiRecommendationReason={aiReason}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State (§5.3) */
        <Card className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              No matching profiles found
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              No registered members match your current filter combination. Try clearing some filters or broadening your skill criteria.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Button variant="primary" size="sm" onClick={handleClearFilters}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset & Clear Filters
            </Button>
            <Link to="/mentor">
              <Button variant="outline" size="sm">
                <Bot className="w-3.5 h-3.5 mr-1" /> Ask AI Mentor Instead
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" size="sm">
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Explore Resource Library
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Pagination Controls (§3.4) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateUrlParam('page', String(currentPage - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => updateUrlParam('page', String(num))}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  num === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label={`Go to page ${num}`}
                aria-current={num === currentPage ? 'page' : undefined}
              >
                {num}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateUrlParam('page', String(currentPage + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Profile Detail View Modal (§6) */}
      <ProfileDetailModal
        isOpen={Boolean(selectedProfile)}
        onClose={handleCloseProfile}
        profile={selectedProfile}
        teaches={selectedProfile ? appState.teachingSkills.filter((ts) => ts.user_id === selectedProfile.id) : []}
        learns={selectedProfile ? appState.learningGoals.filter((lg) => lg.user_id === selectedProfile.id) : []}
        currentUser={user}
        currentUserTeaches={myTeaches}
        currentUserLearns={myLearns}
        onRequestExchange={(target) => {
          handleCloseProfile();
          setRequestTargetProfile(target);
        }}
        onReport={(target) => {
          handleCloseProfile();
          setReportingProfile(target);
        }}
        onBlock={handleBlockUser}
      />

      {/* Skill Exchange Request Dialog (§7) */}
      <RequestExchangeModal
        isOpen={Boolean(requestTargetProfile)}
        onClose={() => setRequestTargetProfile(null)}
        targetProfile={requestTargetProfile}
        targetTeaches={
          requestTargetProfile
            ? appState.teachingSkills.filter((ts) => ts.user_id === requestTargetProfile.id)
            : []
        }
        targetLearns={
          requestTargetProfile
            ? appState.learningGoals.filter((lg) => lg.user_id === requestTargetProfile.id)
            : []
        }
        currentUser={user}
        currentUserTeaches={myTeaches}
        currentUserLearns={myLearns}
        onSuccess={() => {
          setToastMessage(`Exchange proposal dispatched to ${requestTargetProfile?.full_name}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Safety Report Dialog (§4.4) */}
      {reportingProfile && (
        <Modal
          isOpen={Boolean(reportingProfile)}
          onClose={() => setReportingProfile(null)}
          title={`Report ${reportingProfile.full_name}`}
          description="Reports are confidential and reviewed by community moderators. Safety is our top priority."
        >
          <form onSubmit={handleConfirmReport} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Reason for report
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value as ReportItem['reason'])}
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="inappropriate_behavior">Inappropriate behavior</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="spam">Spam or unwanted advertising</option>
                <option value="commercial_solicitation">Paid tutoring solicitation (violating free exchange)</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Details & Context
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                required
                rows={3}
                placeholder="Please describe what happened..."
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setReportingProfile(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="submit">
                Submit Report
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
