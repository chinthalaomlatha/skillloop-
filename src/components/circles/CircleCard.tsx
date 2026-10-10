import React, { useState } from 'react';
import { Users, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { ProposedCircleLoop } from '../../lib/circleEngine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LoopDiagram } from './LoopDiagram';

export interface CircleCardProps {
  circle: ProposedCircleLoop;
  onJoinCircle: (circle: ProposedCircleLoop) => void;
  isJoined?: boolean;
}

export const CircleCard: React.FC<CircleCardProps> = ({ circle, onJoinCircle, isJoined = false }) => {
  const [showMilestones, setShowMilestones] = useState(false);

  return (
    <Card className="p-6 mb-6 hoverable border-indigo-100 dark:border-indigo-950 shadow-sm bg-white dark:bg-slate-900 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{circle.name}</h3>
            {circle.isFallbackTwoPerson ? (
              <Badge variant="amber" size="sm">2-Person Sparse Fallback</Badge>
            ) : (
              <Badge variant="emerald" size="sm">Verified 3-Person Loop</Badge>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{circle.description}</p>
        </div>

        <div>
          {isJoined ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Circle Active
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => onJoinCircle(circle)}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Confirm & Form Circle
            </Button>
          )}
        </div>
      </div>

      {/* Visual Knowledge Circulation Diagram */}
      <LoopDiagram members={circle.members} isFallbackTwoPerson={circle.isFallbackTwoPerson} />

      {/* Transparent Edge Explanations */}
      <div className="mt-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">
          Why This Circle Works (Edge Justifications):
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          {circle.edgeExplanations.map((edge, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                {idx + 1}
              </span>
              <span>{edge}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Milestones Accordion */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {showMilestones ? 'Hide Group Milestones' : `View Group Roadmap (${circle.milestones.length} Milestones)`}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showMilestones ? 'rotate-90' : ''}`} />
        </button>

        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Shared Goal: <em className="text-slate-700 dark:text-slate-300">{circle.sharedGoal}</em>
        </span>
      </div>

      {showMilestones && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {circle.milestones.map((m, idx) => (
            <div key={m.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Milestone {idx + 1}: {m.title}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{m.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
