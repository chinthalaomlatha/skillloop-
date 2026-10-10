import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Repeat,
  Bot,
  Calendar,
  Bookmark,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const state = store.getState();

  const myTeaches = state.teachingSkills.filter((ts) => ts.user_id === user?.id);
  const myLearns = state.learningGoals.filter((lg) => lg.user_id === user?.id);
  const mySaved = state.savedResources.filter((sr) => sr.user_id === user?.id);
  const mySessions = state.sessions.filter((s) => s.host_id === user?.id || s.partner_id === user?.id);
  const myRequests = state.matchRequests.filter((r) => r.receiver_id === user?.id || r.sender_id === user?.id);
  const pendingReceivedRequests = state.matchRequests.filter((r) => r.receiver_id === user?.id && r.status === 'pending');
  const myQuizAttempts = state.quizAttempts.filter((qa) => qa.user_id === user?.id);

  // Compute actual completed items
  const completedResources = mySaved.filter((sr) => sr.status === 'completed').length;
  const completedSessions = mySessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="purple" size="sm" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
            Member Exchange Dashboard
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            "{user?.headline || 'Active SkillLoop Learner and Mentor'}" &bull; {user?.timezone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/requests">
            <Button variant="secondary" size="sm" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-xs">
              <Mail className="w-4 h-4 mr-1.5" /> Exchange Requests {pendingReceivedRequests.length > 0 ? `(${pendingReceivedRequests.length})` : ''}
            </Button>
          </Link>
          <Link to="/matches">
            <Button variant="outline" size="sm" className="bg-transparent text-white border-white/40 hover:bg-white/10">
              <Users className="w-4 h-4 mr-1.5" /> Peer Matches
            </Button>
          </Link>
          <Link to="/mentor">
            <Button variant="outline" size="sm" className="bg-transparent text-white border-white/40 hover:bg-white/10">
              <Bot className="w-4 h-4 mr-1.5" /> AI Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Exchange Requests Alert Banner */}
      {pendingReceivedRequests.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>{pendingReceivedRequests.length} Pending Skill Exchange Proposal{pendingReceivedRequests.length > 1 ? 's' : ''}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">Action Needed</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong className="text-slate-800">{pendingReceivedRequests[0].sender?.full_name}</strong> offers to teach you{' '}
                <span className="text-emerald-700 font-semibold">{pendingReceivedRequests[0].sender_skill?.name || 'Skill'}</span> in exchange for{' '}
                <span className="text-indigo-700 font-semibold">{pendingReceivedRequests[0].receiver_skill?.name || 'Your Skill'}</span>.
              </p>
            </div>
          </div>
          <Link to="/requests" className="shrink-0">
            <Button variant="primary" size="sm" className="shadow-xs font-bold">
              Review Proposal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Verified Stats Grid (§11: Computed from actual saved events) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Teaching Skills</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myTeaches.length}</div>
          <p className="text-[11px] text-slate-500">Skills you are ready to share</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Learning Goals</span>
            <Repeat className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myLearns.length}</div>
          <p className="text-[11px] text-slate-500">Active skills being studied</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Sessions</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{mySessions.length}</div>
          <p className="text-[11px] text-slate-500">{completedSessions} completed exchange sessions</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved Resources</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{mySaved.length}</div>
          <p className="text-[11px] text-slate-500">{completedResources} marked finished</p>
        </Card>
      </div>

      {/* Next Recommended Actions & Quick Jumps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Skills Overview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                My Active Skill Exchange Loops
              </h3>
              <Link to="/profile" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                Manage in Profile &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Skills I am Teaching:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {myTeaches.map((ts) => (
                    <div key={ts.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{ts.skill?.name || 'Skill'}</div>
                        <div className="text-[11px] text-emerald-800 font-medium capitalize">{ts.proficiency_level} level</div>
                      </div>
                      <Badge variant="emerald" size="sm">{ts.availability_hours_per_week}h/wk</Badge>
                    </div>
                  ))}
                  {myTeaches.length === 0 && (
                    <div className="p-3 text-xs text-slate-500 bg-slate-50 rounded-xl">No teaching skills listed.</div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Skills I am Learning:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {myLearns.map((lg) => (
                    <div key={lg.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{lg.skill?.name || 'Skill'}</div>
                        <div className="text-[11px] text-indigo-800 font-medium">Target: {lg.desired_proficiency}</div>
                      </div>
                      <Badge variant="indigo" size="sm">Active</Badge>
                    </div>
                  ))}
                  {myLearns.length === 0 && (
                    <div className="p-3 text-xs text-slate-500 bg-slate-50 rounded-xl">No learning goals listed.</div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Sessions List */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Peer Exchange Sessions
              </h3>
              <Link to="/sessions" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                View All &rarr;
              </Link>
            </div>

            {mySessions.length > 0 ? (
              <div className="space-y-3">
                {mySessions.slice(0, 3).map((sess) => (
                  <div key={sess.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{sess.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(sess.scheduled_at).toLocaleDateString()} at{' '}
                        {new Date(sess.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        ({sess.duration_minutes} mins)
                      </div>
                    </div>
                    <Badge variant={sess.status === 'confirmed' ? 'emerald' : 'amber'} size="sm" className="capitalize">
                      {sess.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">No sessions scheduled yet. Propose an exchange to your matches!</p>
            )}
          </Card>
        </div>

        {/* Right Column: AI Assistant Actions & Milestones */}
        <div className="space-y-6">
          <Card className="p-5 bg-gradient-to-b from-indigo-50/60 to-white border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Recommended Next Action
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              You have mutual exchange opportunities available! Review your compatibility breakdown or check out 3-person AI Skill Circles.
            </p>
            <div className="space-y-2">
              <Link to="/matches" className="block">
                <Button variant="primary" size="sm" className="w-full justify-between">
                  Explore Peer Recommendations <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link to="/circles" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  Check 3-Person Circles <Repeat className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Quiz & Assessment Activity
            </h3>
            {myQuizAttempts.length > 0 ? (
              <div className="space-y-2 text-xs">
                {myQuizAttempts.slice(0, 3).map((qa) => (
                  <div key={qa.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">Conceptual Practice</div>
                      <div className="text-[10px] text-slate-400">{new Date(qa.created_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="emerald" size="sm">Score: {qa.score}/{qa.total_questions}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-4">
                No quiz attempts yet. Test your knowledge in the AI Mentor!
              </div>
            )}
            <Link to="/mentor" className="block mt-3 text-center text-xs font-semibold text-emerald-700">
              Open AI Mentor Quiz &rarr;
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
