import React, { useState, useEffect } from 'react';
import { Mail, Check, X, ArrowRightLeft, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { MatchRequest } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [receivedRequests, setReceivedRequests] = useState<MatchRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<MatchRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const loadRequests = () => {
    if (!user) return;
    const s = store.getState();
    setReceivedRequests(s.matchRequests.filter((r) => r.receiver_id === user.id));
    setSentRequests(s.matchRequests.filter((r) => r.sender_id === user.id));
  };

  useEffect(() => {
    loadRequests();
    const unsubscribe = store.subscribe(() => loadRequests());
    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = (reqId: string, status: MatchRequest['status']) => {
    store.updateMatchRequestStatus(reqId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-600" /> Exchange Requests & Invitations
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review proposed peer matches. Leaving or declining an exchange is instant and never requires justification.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'received'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Received Invitations ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sent'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sent Proposals ({sentRequests.length})
        </button>
      </div>

      {/* Received Requests Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => (
              <Card key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.sender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={req.sender?.full_name || 'Sender'}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{req.sender?.full_name}</h3>
                      <Badge variant="emerald" size="sm">{req.compatibility_score}% Match</Badge>
                      <Badge variant={req.status === 'accepted' ? 'emerald' : req.status === 'declined' ? 'rose' : 'amber'} size="sm" className="capitalize">
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.sender?.headline}</p>

                    <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <span className="font-semibold">Offers to teach you:</span>
                        <span>{req.sender_skill?.name || 'Their Skill'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-800">
                        <span className="font-semibold">Wants to learn from you:</span>
                        <span>{req.receiver_skill?.name || 'Your Skill'}</span>
                      </div>
                      {req.message && (
                        <p className="text-slate-600 italic pt-1 border-t border-slate-200/60">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, 'accepted')}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Accept Exchange
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, 'declined')}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/sessions')}
                    >
                      Schedule Session
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Mail}
              title="No Received Invitations"
              description="When other learners discover your listed skills and want to exchange knowledge, their proposals will appear here."
              actionLabel="Browse Available Matches"
              onAction={() => navigate('/matches')}
            />
          )}
        </div>
      )}

      {/* Sent Proposals Tab */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <Card key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.receiver?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={req.receiver?.full_name || 'Receiver'}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{req.receiver?.full_name}</h3>
                      <Badge variant="indigo" size="sm">{req.compatibility_score}% Compatibility</Badge>
                      <Badge variant={req.status === 'accepted' ? 'emerald' : req.status === 'declined' ? 'rose' : 'amber'} size="sm" className="capitalize">
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.receiver?.headline}</p>

                    {req.message && (
                      <p className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                      className="text-slate-500"
                    >
                      Withdraw Proposal
                    </Button>
                  )}
                  {req.status === 'accepted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/sessions')}
                    >
                      Schedule Session
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Mail}
              title="No Sent Proposals"
              description="You haven't proposed any skill exchanges yet. Search through compatible peer matches to get started!"
              actionLabel="Discover Matches"
              onAction={() => navigate('/matches')}
            />
          )}
        </div>
      )}
    </div>
  );
};
