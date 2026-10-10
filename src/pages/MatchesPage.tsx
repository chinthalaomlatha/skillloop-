import React, { useState, useEffect } from 'react';
import { Users, Filter, CheckCircle, Search, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { findPeerMatches } from '../lib/matchingEngine';
import { PeerMatch } from '../types';
import { MatchCard } from '../components/matches/MatchCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const MatchesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [freeExchangeOnly, setFreeExchangeOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(30);
  const [matches, setMatches] = useState<PeerMatch[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const computeMatches = () => {
    if (!user) return;
    const state = store.getState();
    const myTeaches = state.teachingSkills.filter((ts) => ts.user_id === user.id);
    const myLearns = state.learningGoals.filter((lg) => lg.user_id === user.id);

    const candidates = state.profiles.map((p) => ({
      profile: p,
      teachingSkills: state.teachingSkills.filter((ts) => ts.user_id === p.id),
      learningGoals: state.learningGoals.filter((lg) => lg.user_id === p.id),
    }));

    const results = findPeerMatches(
      { profile: user, teachingSkills: myTeaches, learningGoals: myLearns },
      candidates,
      state.matchRequests,
      { freeExchangeOnly, minScore }
    );

    // Apply optional search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setMatches(
        results.filter(
          (m) =>
            m.partnerProfile.full_name.toLowerCase().includes(q) ||
            m.matchedTeachingSkill.skill?.name.toLowerCase().includes(q) ||
            m.matchedLearningGoal.skill?.name.toLowerCase().includes(q)
        )
      );
    } else {
      setMatches(results);
    }
  };

  useEffect(() => {
    computeMatches();
    const unsubscribe = store.subscribe(() => computeMatches());
    return () => unsubscribe();
  }, [user, freeExchangeOnly, searchQuery, minScore]);

  const handleRequestConnect = (match: PeerMatch, message: string) => {
    store.sendMatchRequest(
      match.partnerId,
      match.matchedLearningGoal.skill_id,
      match.matchedTeachingSkill.skill_id,
      message
    );
    setNotification(`Exchange proposal successfully sent to ${match.partnerProfile.full_name}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" /> Real Peer Matches
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Deterministic, explainable compatibility matching calculated from registered member profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => computeMatches()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" /> Recompute Matches
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/circles')}>
            <Sparkles className="w-3.5 h-3.5 mr-1" /> View AI Circles
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {notification}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by partner name or skill..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Free-First Ranking & Filter (§6: Mandatory) */}
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-end">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={freeExchangeOnly}
              onChange={(e) => setFreeExchangeOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Free Peer Exchange Only (No Paid Offers)</span>
          </label>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Min Score:</span>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700"
            >
              <option value={30}>30%</option>
              <option value={50}>50%</option>
              <option value={70}>70%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches Grid or Empty State (§6: Empty states must be useful) */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.partnerId}
              match={match}
              onRequestConnect={handleRequestConnect}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Direct 1:1 Matches Found"
          description="We couldn't find a direct two-way reciprocal match for your exact skills right now. Try adding more skills you can teach or learn, adjusting your proficiency target, or explore 3-person AI Skill Circles and our self-paced AI mentor!"
          actionLabel="Add More Skills to Profile"
          onAction={() => navigate('/profile')}
          secondaryActionLabel="Explore 3-Person Circles"
          onSecondaryAction={() => navigate('/circles')}
        />
      )}
    </div>
  );
};
