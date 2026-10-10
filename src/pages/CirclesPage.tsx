import React, { useState, useEffect } from 'react';
import { Repeat, Sparkles, CheckCircle2, Info, ArrowRight, Users, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { discoverSkillCircles, discoverAllCommunityCircles, ProposedCircleLoop } from '../lib/circleEngine';
import { CircleCard } from '../components/circles/CircleCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const CirclesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my_circles' | 'community'>('my_circles');
  const [myCircles, setMyCircles] = useState<ProposedCircleLoop[]>([]);
  const [communityCircles, setCommunityCircles] = useState<ProposedCircleLoop[]>([]);
  const [joinedCircleIds, setJoinedCircleIds] = useState<Set<string>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadCircles = () => {
    if (!user) return;
    const state = store.getState();

    const myTeaches = state.teachingSkills.filter((ts) => ts.user_id === user.id);
    const myLearns = state.learningGoals.filter((lg) => lg.user_id === user.id);

    const allUsers = state.profiles.map((p) => ({
      profile: p,
      teachingSkills: state.teachingSkills.filter((ts) => ts.user_id === p.id),
      learningGoals: state.learningGoals.filter((lg) => lg.user_id === p.id),
    }));

    const skillsById = Object.fromEntries(state.skills.map((s) => [s.id, s]));

    // 1. Circles for current user
    const userLoops = discoverSkillCircles(
      { profile: user, teachingSkills: myTeaches, learningGoals: myLearns },
      allUsers,
      skillsById
    );
    setMyCircles(userLoops);

    // 2. All 3-person community circles
    const allCommunityLoops = discoverAllCommunityCircles(allUsers, skillsById);
    setCommunityCircles(allCommunityLoops);

    // Check which circles were already formed in state
    const alreadyJoined = new Set<string>();
    state.circles.forEach((c) => alreadyJoined.add(c.id));
    setJoinedCircleIds(alreadyJoined);
  };

  useEffect(() => {
    loadCircles();
    const unsubscribe = store.subscribe(() => loadCircles());
    return () => unsubscribe();
  }, [user]);

  const handleJoinCircle = (circle: ProposedCircleLoop) => {
    store.joinOrFormCircle(circle);
    setJoinedCircleIds((prev) => new Set([...prev, circle.circleId]));
    setSuccessMsg(`Congratulations! You have successfully formed the "${circle.name}"! Peer invitations sent and roadmap activated.`);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const displayedCircles = activeTab === 'my_circles' ? myCircles : communityCircles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Repeat className="w-3.5 h-3.5" /> 3-Person Reciprocal Exchange Loops
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Skill Circles & Reciprocal Knowledge Loops
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Connect 3 members whose teaching contributions and learning goals form a continuous closed loop (A teaches B, B teaches C, C teaches A).
              Knowledge circulates freely without requiring an outside instructor or paid classes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => loadCircles()}>
              Re-scan Community
            </Button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('my_circles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_circles'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Loops Matching My Skills ({myCircles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All 3-Person Community Circles ({communityCircles.length})</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Info Notice regarding 3-Person Circulation */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong>How 3-Person Loops Work:</strong> In a Skill Circle, Member A teaches Member B, Member B teaches Member C, and Member C teaches Member A. Every member teaches what they know best and learns what they want, achieving 100% reciprocal value without monetary exchange.
        </div>
      </div>

      {/* Discovered Circles List */}
      {displayedCircles.length > 0 ? (
        <div className="space-y-6">
          {displayedCircles.map((circle) => (
            <CircleCard
              key={circle.circleId}
              circle={circle}
              onJoinCircle={handleJoinCircle}
              isJoined={joinedCircleIds.has(circle.circleId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Repeat}
          title="No Closed Exchange Loops Available Yet"
          description="A Skill Circle requires a closed reciprocal chain between registered users (e.g., A teaches B, B teaches C, C teaches A). Try adding more teaching skills or learning goals to open up loop possibilities!"
          actionLabel="Add Skills to My Profile"
          onAction={() => navigate('/profile')}
          secondaryActionLabel="Explore 1:1 Matches"
          onSecondaryAction={() => navigate('/matches')}
        />
      )}
    </div>
  );
};
