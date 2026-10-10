import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, AlertTriangle, ArrowRight, Clock, Info } from 'lucide-react';
import {
  Profile,
  UserTeachingSkill,
  UserLearningGoal,
  MatchRequest,
} from '../../types';
import { store } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface RequestExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile | null;
  targetTeaches: UserTeachingSkill[];
  targetLearns: UserLearningGoal[];
  currentUser: Profile | null;
  currentUserTeaches: UserTeachingSkill[];
  currentUserLearns: UserLearningGoal[];
  onSuccess?: (request: MatchRequest) => void;
}

export const RequestExchangeModal: React.FC<RequestExchangeModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  targetTeaches,
  targetLearns,
  currentUser,
  currentUserTeaches,
  currentUserLearns,
  onSuccess,
}) => {
  const navigate = useNavigate();

  const [wantedSkillId, setWantedSkillId] = useState('');
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<MatchRequest | null>(null);

  // Initialize selected skills when modal opens
  useEffect(() => {
    if (isOpen && targetProfile) {
      setError(null);
      setSubmittedRequest(null);
      setMessage('');

      // Auto-select first available skill target teaches
      if (targetTeaches.length > 0) {
        setWantedSkillId(targetTeaches[0].skill_id);
      } else {
        setWantedSkillId('');
      }

      // Auto-select reciprocal skill if available
      const reciprocalSkill = currentUserTeaches.find((ts) =>
        targetLearns.some((lg) => lg.skill_id === ts.skill_id)
      );

      if (reciprocalSkill) {
        setOfferedSkillId(reciprocalSkill.skill_id);
      } else if (currentUserTeaches.length > 0) {
        setOfferedSkillId(currentUserTeaches[0].skill_id);
      } else {
        setOfferedSkillId('');
      }
    }
  }, [isOpen, targetProfile, targetTeaches, targetLearns, currentUserTeaches]);

  if (!targetProfile) return null;

  // Check if chosen offer is reciprocal
  const isSelectedOfferReciprocal = targetLearns.some(
    (lg) => lg.skill_id === offeredSkillId
  );

  // Check existing pending request
  const state = store.getState();
  const existingPending = state.matchRequests.find(
    (r) =>
      r.status === 'pending' &&
      currentUser &&
      ((r.sender_id === currentUser.id && r.receiver_id === targetProfile.id) ||
       (r.sender_id === targetProfile.id && r.receiver_id === currentUser.id))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to send an exchange proposal.');
      return;
    }
    if (!wantedSkillId) {
      setError(`Please select a skill you want to learn from ${targetProfile.full_name}.`);
      return;
    }
    if (!offeredSkillId) {
      setError('Please select a skill you can offer in return.');
      return;
    }
    if (existingPending) {
      setError('A pending request between you and this member already exists.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // senderTeachesId is offered skill, senderLearnsId is wanted skill
      const createdReq = store.sendMatchRequest(
        targetProfile.id,
        offeredSkillId,
        wantedSkillId,
        message
      );
      setIsSubmitting(false);
      setSubmittedRequest(createdReq);
      if (onSuccess) onSuccess(createdReq);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to submit exchange proposal.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={submittedRequest ? 'Exchange Proposal Sent!' : `Propose Skill Exchange with ${targetProfile.full_name}`}
      description={
        submittedRequest
          ? 'Your peer has received your request and can review it in their requests inbox.'
          : 'Exchange what you know for what they know. Leaving or declining an exchange is instant and never requires justification.'
      }
      maxWidth="md"
    >
      {submittedRequest ? (
        <div className="space-y-5 py-2">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Proposal Recorded Successfully
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Status is currently <strong className="text-emerald-700 dark:text-emerald-300 uppercase">Pending</strong>. You will receive an alert once {targetProfile.full_name} responds.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Recipient:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{targetProfile.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">You learn:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {submittedRequest.receiver_skill?.name || 'Selected Skill'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">You teach:</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                {submittedRequest.sender_skill?.name || 'Offered Skill'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                navigate('/requests');
              }}
              className="w-full sm:flex-1"
            >
              View in Sent Proposals <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {existingPending && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Pending Request Exists:</strong> You already have an active exchange proposal with {targetProfile.full_name}.
              </div>
            </div>
          )}

          {/* Wanted Skill (what target teaches) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              1. Skill you want to learn from {targetProfile.full_name.split(' ')[0]}
            </label>
            {targetTeaches.length > 0 ? (
              <select
                value={wantedSkillId}
                onChange={(e) => setWantedSkillId(e.target.value)}
                required
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {targetTeaches.map((ts) => (
                  <option key={ts.id} value={ts.skill_id}>
                    {ts.skill?.name || 'Skill'} ({ts.proficiency_level} level)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-500 italic">This member has not listed any teaching skills yet.</p>
            )}
          </div>

          {/* Offered Skill (what requester teaches) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              2. Skill you can offer in return
            </label>
            {currentUserTeaches.length > 0 ? (
              <select
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                required
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {currentUserTeaches.map((ts) => {
                  const matchesGoal = targetLearns.some((lg) => lg.skill_id === ts.skill_id);
                  return (
                    <option key={ts.id} value={ts.skill_id}>
                      {ts.skill?.name || 'Skill'} ({ts.proficiency_level} level)
                      {matchesGoal ? ' — Reciprocal Match!' : ''}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                You haven't listed any teaching skills in your profile yet.
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/profile');
                  }}
                  className="font-bold underline ml-1.5"
                >
                  Add skills in Profile &rarr;
                </button>
              </div>
            )}

            {/* Reciprocity Banner (§7.2) */}
            <div className="mt-2">
              {isSelectedOfferReciprocal ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <span>
                    <strong>Genuine Reciprocal Exchange:</strong> {targetProfile.full_name} explicitly listed this skill in their learning goals!
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <span className="text-base shrink-0">⚠</span>
                  <span>
                    <strong>One-Way Proposal:</strong> {targetProfile.full_name} hasn't listed this skill in their learning goals. They may still accept if interested, but mutual acceptance is less likely.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                3. Optional Message to {targetProfile.full_name.split(' ')[0]}
              </label>
              <span className={`text-[11px] ${message.length > 500 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                {message.length}/500
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={`Hi ${targetProfile.full_name.split(' ')[0]}, I'd love to exchange knowledge with you! Here is what I can share...`}
              className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Legal / Non-Binding Agreement Statement (§7.1) */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              This request is <strong>not yet an accepted match</strong>. The partner will review your proposal and can accept or decline without justification.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting || Boolean(existingPending) || currentUserTeaches.length === 0}
              isLoading={isSubmitting}
            >
              <Mail className="w-3.5 h-3.5 mr-1" /> Send Exchange Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
