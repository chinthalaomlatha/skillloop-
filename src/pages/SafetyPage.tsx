import React, { useState } from 'react';
import { ShieldCheck, UserX, AlertTriangle, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ReportItem } from '../types';

export const SafetyPage: React.FC = () => {
  const { user } = useAuth();
  const state = store.getState();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetId, setReportTargetId] = useState(state.profiles.find((p) => p.id !== user?.id)?.id || '');
  const [reportReason, setReportReason] = useState<ReportItem['reason']>('inappropriate_behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const blockedUsers = state.profiles.filter((p) => state.blockedUserIds.includes(p.id));

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim() || !reportTargetId) return;

    store.submitReport(reportTargetId, reportReason, reportDetails);
    // Automatically block reported user
    store.blockUser(reportTargetId);

    setReportSuccess('Thank you. Your report has been submitted to moderation and the user has been blocked.');
    setReportDetails('');
    setShowReportModal(false);
    setTimeout(() => setReportSuccess(null), 5000);
  };

  const handleUnblock = (userId: string) => {
    store.unblockUser(userId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" /> Trust, Safety & Partner Controls
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Peer learning must never feel like a trap. You can leave matches, block users, or switch to AI learning at any time.
        </p>
      </div>

      {reportSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {reportSuccess}
        </div>
      )}

      {/* Non-Negotiable Ideology Guarantees (§0 & §6) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2 border-emerald-100 bg-emerald-50/20">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No-Justification Exit
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can decline, withdraw from, or end any connection immediately. Leaving a peer match never requires approval or explanation.
          </p>
        </Card>

        <Card className="p-4 space-y-2 border-indigo-100 bg-indigo-50/20">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4 text-indigo-600" /> Row-Level Security
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Personal study notes, progress records, and private communications are protected by verified PostgreSQL RLS policies.
          </p>
        </Card>

        <Card className="p-4 space-y-2 border-amber-100 bg-amber-50/20">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Zero Silent Monetization
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free peer exchange is the permanent foundation. Paid tutoring offers are never disguised as free reciprocal loops.
          </p>
        </Card>
      </div>

      {/* Blocked Users Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600" /> Blocked Users List ({blockedUsers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Blocked members cannot propose exchanges, join your circles, or see your activity.
            </p>
          </div>

          <Button variant="danger" size="sm" onClick={() => setShowReportModal(true)}>
            Report an Issue
          </Button>
        </div>

        <div className="space-y-3">
          {blockedUsers.map((bu) => (
            <div
              key={bu.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{bu.full_name}</span> &bull; {bu.headline}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleUnblock(bu.id)}>
                Unblock
              </Button>
            </div>
          ))}

          {blockedUsers.length === 0 && (
            <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-xl">
              You haven't blocked any community members.
            </p>
          )}
        </div>
      </Card>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Submit Community Report"
        description="All reports are investigated by moderation. Harassment, commercial spam, and bad-faith tutoring solicitation are strictly prohibited."
      >
        <form onSubmit={handleReport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select User to Report
            </label>
            <select
              value={reportTargetId}
              onChange={(e) => setReportTargetId(e.target.value)}
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {state.profiles
                .filter((p) => p.id !== user?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Violation Reason
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="inappropriate_behavior">Inappropriate Behavior</option>
              <option value="harassment">Harassment or Abuse</option>
              <option value="commercial_solicitation">Unsolicited Paid Tutoring / Spam</option>
              <option value="spam">Bot or Phishing Attempt</option>
              <option value="other">Other Community Guideline Breach</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Details (Minimum 10 characters)
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={4}
              required
              placeholder="Describe what occurred with specific context..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Submit Report & Block User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
