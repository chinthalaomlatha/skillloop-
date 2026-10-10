import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, CheckCircle, XCircle, Plus, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { LearningSession } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SessionModal } from '../components/sessions/SessionModal';
import { useNavigate } from 'react-router-dom';

export const SessionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const state = store.getState();
  // Find connected partners or test profiles
  const partnerCandidates = state.profiles.filter((p) => p.id !== user?.id);
  const defaultSkill = state.skills[0];

  const loadSessions = () => {
    if (!user) return;
    const s = store.getState();
    const mySessions = s.sessions.filter((sess) => sess.host_id === user.id || sess.partner_id === user.id);
    setSessions(mySessions);
  };

  useEffect(() => {
    loadSessions();
    const unsubscribe = store.subscribe(() => loadSessions());
    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = (sessionId: string, status: LearningSession['status']) => {
    store.updateSessionStatus(sessionId, status);
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" /> Peer Exchange Sessions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Coordinate, confirm, and join 1:1 learning sessions with your matched exchange partners.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowScheduleModal(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Schedule New Session
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'confirmed', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const isHost = session.host_id === user?.id;
            const otherPerson = isHost ? session.partner : session.host;

            return (
              <Card key={session.id} className="p-5 flex flex-col justify-between hoverable">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <Badge
                        variant={
                          session.status === 'confirmed'
                            ? 'emerald'
                            : session.status === 'completed'
                            ? 'indigo'
                            : 'amber'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {session.status}
                      </Badge>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{session.title}</h3>
                    </div>

                    <div className="text-right text-xs text-slate-500 font-mono">
                      {session.duration_minutes} Mins
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Exchange Partner: <strong>{otherPerson?.full_name || 'Community Member'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                        {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {session.objectives && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700 mb-3">
                      <strong>Objectives:</strong> {session.objectives}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {session.meeting_link ? (
                    <a
                      href={session.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Video Room <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">No meeting URL</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {session.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(session.id, 'completed')}
                        className="text-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Mark Complete
                      </Button>
                    )}
                    {session.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'cancelled')}
                        className="text-xs text-slate-400 hover:text-rose-600 p-1"
                        title="Cancel session"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Sessions Scheduled"
          description="Schedule a 45-minute peer session to exchange code, language practice, recipes, or creative critique."
          actionLabel="Schedule Session"
          onAction={() => setShowScheduleModal(true)}
          secondaryActionLabel="Find Matches First"
          onSecondaryAction={() => navigate('/matches')}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && partnerCandidates[0] && defaultSkill && (
        <SessionModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          partner={partnerCandidates[0]}
          skill={defaultSkill}
          onScheduled={() => loadSessions()}
        />
      )}
    </div>
  );
};
