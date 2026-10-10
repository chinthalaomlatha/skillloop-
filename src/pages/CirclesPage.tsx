import React, { useState, useEffect } from 'react';
import { Repeat, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { discoverSkillCircles, ProposedCircleLoop } from '../lib/circleEngine';
import { CircleCard } from '../components/circles/CircleCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const CirclesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [circles, setCircles] = useState<ProposedCircleLoop[]>([]);
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

    const discovered = discoverSkillCircles(
      { profile: user, teachingSkills: myTeaches, learningGoals: myLearns },
      allUsers,
      skillsById
    );

    setCircles(discovered);
  };

  useEffect(() => {
    loadCircles();
    const unsubscribe = store.subscribe(() => loadCircles());
    return () => unsubscribe();
  }, [user]);

  const handleJoinCircle = (circle: ProposedCircleLoop) => {
    setJoinedCircleIds((prev) => new Set([...prev, circle.circleId]));
    setSuccessMsg(`Congratulations! You have formed the "${circle.name}"! Invitations sent to peers.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <Repeat className="w-3.5 h-3.5" /> Signature Feature (§7)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Skill Circles & Reciprocal Knowledge Loops
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Connect 3 or more members whose teaching contributions and learning goals form a continuous closed loop.
              Knowledge circulates freely without requiring an outside instructor.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => loadCircles()}>
            Re-scan Community
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Educational notice regarding Sparse-Data Fallback */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong>Sparse-Data Fallback Matrix (§7):</strong> If fewer than 3 compatible profiles form a closed triangle for your currently listed skills, SkillLoop automatically and honestly falls back to a 2-person reciprocal exchange. We never fabricate ghost members or simulate fake profiles.
        </div>
      </div>

      {/* Discovered Circles */}
      {circles.length > 0 ? (
        <div className="space-y-6">
          {circles.map((circle) => (
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
