import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ShieldCheck, Heart, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Ideology */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                SkillLoop <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-xs leading-relaxed max-w-md">
              Learn one skill. Teach another. Grow together.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-md">
              A peer-to-peer skill exchange platform enhanced by AI. We believe true learning happens through reciprocal human exchange; AI is the amplifier, never the replacement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/matches" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Peer Matching Engine</Link></li>
              <li><Link to="/circles" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Skill Circles</Link></li>
              <li><Link to="/mentor" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Learning Mentor</Link></li>
              <li><Link to="/catalogue" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Skill Catalogue (16 Categories)</Link></li>
              <li><Link to="/resources" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Curated Educational Library</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/safety" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Community Safety & Blocking</Link></li>
              <li><Link to="/safety" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Free Exchange Guarantee</Link></li>
              <li><Link to="/discovery" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Skill Discovery Flow</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Admin & Moderation Log</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} SkillLoop AI. Built for peer knowledge exchange. Free peer learning accessible to all.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Row Level Security Enforced
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};
