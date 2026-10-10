import React, { useState } from 'react';
import { Calendar, Clock, Link as LinkIcon, User, Sparkles } from 'lucide-react';
import { Profile, Skill } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { store } from '../../lib/store';

export interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Profile;
  skill: Skill;
  onScheduled?: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  partner,
  skill,
  onScheduled,
}) => {
  const currentUser = store.getState().currentUser;

  const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16);

  const [title, setTitle] = useState(`Exchange Session: ${skill.name}`);
  const [objectives, setObjectives] = useState('Review core fundamentals, walk through practice tasks, and exchange feedback.');
  const [scheduledAt, setScheduledAt] = useState(defaultDate);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLink, setMeetingLink] = useState(`https://meet.jit.si/skillloop-${Math.random().toString(36).substring(2, 8)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    store.createSession({
      host_id: currentUser.id,
      partner_id: partner.id,
      skill_id: skill.id,
      title,
      objectives,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: durationMinutes,
      status: 'confirmed',
      meeting_link: meetingLink,
    });

    if (onScheduled) onScheduled();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose Peer Exchange Session"
      description={`Schedule a focused 1:1 learning session with ${partner.full_name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Partner & Skill summary */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Partner:</span>{' '}
            <strong className="text-slate-900">{partner.full_name}</strong> ({partner.timezone})
          </div>
          <div>
            <span className="text-slate-500">Skill:</span>{' '}
            <strong className="text-emerald-700">{skill.name}</strong>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Session Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Python Scripting Setup & Practice"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Learning Objectives & Agenda
          </label>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            rows={2}
            className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="What will you teach and practice during this session?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date & Time ({currentUser?.timezone || 'Your Timezone'})
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Recommended)</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Video Room Link
          </label>
          <Input
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://meet.jit.si/... or Google Meet URL"
            helperText="SkillLoop provides an instant private Jitsi video room, or you may paste your own meeting link."
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Confirm & Schedule Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
