import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRightLeft,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { PeerMatch } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface MatchCardProps {
  match: PeerMatch;
  onRequestConnect: (match: PeerMatch, message: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onRequestConnect }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const { partnerProfile, matchedTeachingSkill, matchedLearningGoal, compatibilityScore, scoreBreakdown } = match;

  const handleSend = () => {
    onRequestConnect(match, customMessage);
    setIsConnecting(false);
    setCustomMessage('');
  };

  const isPending = match.existingRequest?.status === 'pending';
  const isAccepted = match.existingRequest?.status === 'accepted';

  return (
    <Card className="p-5 flex flex-col justify-between hoverable">
      <div>
        {/* Header: Partner Info & Explainable Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={partnerProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={partnerProfile.full_name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{partnerProfile.full_name}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{partnerProfile.headline}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {partnerProfile.language}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {partnerProfile.preferred_format}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-extrabold text-sm shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {compatibilityScore}%
            </div>
            <p className="text-[10px] text-slate-600 font-medium mt-0.5">Matched Score</p>
          </div>
        </div>

        {/* Exchange Loop Visual Summary */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              They Teach:
            </div>
            <span className="font-bold text-slate-800">
              {matchedTeachingSkill.skill?.name || 'Their Skill'}
              <span className="ml-1 text-[11px] text-slate-600 font-normal">
                ({matchedTeachingSkill.proficiency_level})
              </span>
            </span>
          </div>

          <div className="flex items-center justify-center my-0.5 text-slate-400">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-800">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              You Teach:
            </div>
            <span className="font-bold text-slate-800">
              {matchedLearningGoal.skill?.name || 'Your Skill'}
              <span className="ml-1 text-[11px] text-slate-600 font-normal">
                (target: {matchedLearningGoal.desired_proficiency})
              </span>
            </span>
          </div>
        </div>

        {/* Plain Language Transparent Explanation (§6) */}
        <div className="mb-4">
          <div className="text-xs text-slate-700 leading-relaxed bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100/60">
            <strong className="text-emerald-950 font-semibold block mb-0.5">Why this match was recommended:</strong>
            {match.explanation}
          </div>
        </div>

        {/* Transparent Score Breakdown Toggle (§6: Never invent scores) */}
        <div className="mb-4">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
          >
            <span>View Transparent Score Calculation</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBreakdown && (
            <div className="mt-2 p-2.5 bg-slate-100/70 rounded-lg text-xs space-y-1.5 border border-slate-200/60 font-mono">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Skill Complement (Max 50):</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.skillComplementScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Proficiency Compatibility (Max 20):</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.proficiencyBalanceScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Availability Overlap (Max 15):</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.availabilityOverlapScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Language & Format (Max 15):</span>
                <span className="font-bold text-slate-800">{scoreBreakdown.languageFormatScore} pts</span>
              </div>
              <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-900 text-[11px]">
                <span>Total Explainable Score:</span>
                <span>{compatibilityScore}/100</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-slate-100">
        {isPending ? (
          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg">
            <Clock className="w-3.5 h-3.5" /> Request Sent (Waiting for reply)
          </div>
        ) : isAccepted ? (
          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5" /> Connected Exchange Partner
          </div>
        ) : isConnecting ? (
          <div className="space-y-2">
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Hi! I'd love to exchange skills. I can help with my skill if we can practice yours..."
              rows={2}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsConnecting(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSend}>
                <Send className="w-3 h-3 mr-1" /> Send Invitation
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-medium">
              {match.mutualAvailabilityOverlap}
            </span>
            <Button variant="primary" size="sm" onClick={() => setIsConnecting(true)}>
              Propose Exchange
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
