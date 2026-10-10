import React from 'react';
import { ArrowRight, Repeat } from 'lucide-react';
import { SkillCircleMember } from '../../types';

export interface LoopDiagramProps {
  members: SkillCircleMember[];
  isFallbackTwoPerson?: boolean;
}

export const LoopDiagram: React.FC<LoopDiagramProps> = ({ members, isFallbackTwoPerson }) => {
  if (members.length < 2) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 my-3 shadow-inner border border-indigo-900/40">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Repeat className="w-4 h-4 animate-spin-slow" />
          {isFallbackTwoPerson ? 'Reciprocal 2-Person Exchange Loop' : 'Closed 3-Person Knowledge Loop'}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          {members.length} Connected Nodes
        </span>
      </div>

      {/* Nodes visual circulation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
        {members.map((member, index) => {
          const nextMember = members[(index + 1) % members.length];
          const teachSkillName = member.teaches_skill?.name || 'Skill';

          return (
            <div
              key={member.user_id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={member.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt={member.profile?.full_name || 'Member'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {member.profile?.full_name}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-medium">
                      Teaches &rarr; {teachSkillName}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-black/20 rounded p-2 border border-white/5 space-y-1">
                  <div>
                    <span className="text-slate-400 text-[10px]">Offers:</span>{' '}
                    <span className="text-white font-medium">{teachSkillName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Wants:</span>{' '}
                    <span className="text-indigo-300 font-medium">{member.learns_skill?.name || 'Learning Goal'}</span>
                  </div>
                </div>
              </div>

              {/* Edge Connection Arrow */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-400">
                <span className="font-mono text-[10px]">
                  Passes knowledge to: <strong>{nextMember.profile?.full_name?.split(' ')[0]}</strong>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
