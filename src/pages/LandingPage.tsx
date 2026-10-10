import React from 'react';
import { Link } from 'react-router-dom';
import {
  Repeat,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Users,
  Bot,
  BookOpen,
  Calendar,
  Compass,
  ArrowRightLeft,
} from 'lucide-react';
import { SEED_CATEGORIES } from '../lib/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          The Peer-to-Peer Knowledge Exchange Network
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Learn one skill.{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
            Teach another.
          </span>{' '}
          Grow together.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Exchange what you know with real peers. Use AI to make the exchange more effective.
          Free reciprocal learning without expensive tutor paywalls or endless video consumption.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-md">
              Start Exchanging Free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="bg-slate-100 hover:bg-slate-200 text-slate-800">
              Sign In to Account
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button variant="outline" size="lg">
              Explore 16 Categories
            </Button>
          </Link>
        </div>

        {/* Core Value Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Free Peer Exchange Default
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Transparent Explainable Matching
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> 3-Person Closed Skill Circles
          </span>
        </div>
      </section>

      {/* Illustrative Skill Circle Demo Card (§19: Clearly labeled as illustrative) */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/50">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <Badge variant="purple" size="sm" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
            Signature Feature &middot; Clearly Labeled Illustrative Model
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How 3-Person AI Skill Circles Circulate Knowledge
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            When three people have complementary goals, AI connects them into a closed loop where everyone teaches and everyone learns—without hiring outside teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">Node A &middot; Maya (Tech)</div>
            <div className="text-sm font-bold text-white">Teaches: Python Programming</div>
            <div className="text-xs text-slate-300">Wants: Conversational Spanish</div>
            <div className="pt-2 text-[11px] text-emerald-300 border-t border-white/10 flex items-center justify-between">
              <span>Passes code knowledge to &rarr;</span>
              <strong>Carlos</strong>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">Node B &middot; Carlos (Language)</div>
            <div className="text-sm font-bold text-white">Teaches: Conversational Spanish</div>
            <div className="text-xs text-slate-300">Wants: Video Editing</div>
            <div className="pt-2 text-[11px] text-emerald-300 border-t border-white/10 flex items-center justify-between">
              <span>Passes language fluency to &rarr;</span>
              <strong>Elena</strong>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">Node C &middot; Elena (Design)</div>
            <div className="text-sm font-bold text-white">Teaches: Graphic Design</div>
            <div className="text-xs text-slate-300">Wants: Python Programming</div>
            <div className="pt-2 text-[11px] text-emerald-300 border-t border-white/10 flex items-center justify-between">
              <span>Completes the closed loop to &rarr;</span>
              <strong>Maya</strong>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/circles">
            <Button variant="secondary" size="md">
              <Repeat className="w-4 h-4 mr-2" /> Find Your AI Skill Circle
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works: 4 Real Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How SkillLoop Works in 4 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            No mock simulations. Every step connects to real matching algorithms and database persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-2 hoverable">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">List Teaching & Goals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add skills you can share and skills you want to learn across 16 categories or add custom domains.
            </p>
          </Card>

          <Card className="p-5 space-y-2 hoverable">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Transparent AI Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our deterministic engine calculates 0-100 compatibility with visible, plain-language explanations.
            </p>
          </Card>

          <Card className="p-5 space-y-2 hoverable">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Form AI Skill Circles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock 3-person closed loops where knowledge circulates among all members with joint milestones.
            </p>
          </Card>

          <Card className="p-5 space-y-2 hoverable">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mentor & Practice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask skill-specific questions, generate personalized roadmaps, and save verified educational resources.
            </p>
          </Card>
        </div>
      </section>

      {/* Explore Categories Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Universal Skill Spectrum
            </h2>
            <p className="text-xs text-slate-600">
              Supporting all crafts, languages, sciences, arts, fitness, and emerging skills.
            </p>
          </div>
          <Link to="/catalogue">
            <Button variant="ghost" size="sm" className="text-emerald-700">
              View All 16 Categories &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEED_CATEGORIES.slice(0, 8).map((cat) => (
            <Link key={cat.id} to={`/catalogue?category=${cat.id}`}>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all group">
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                  {cat.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {cat.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-12 px-6 bg-emerald-50/70 border border-emerald-200/60 rounded-3xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Ready to trade what you know for what you want to learn?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
          Join SkillLoop AI today. List your first skill, discover verified peer matches, and start your exchange loop.
        </p>
        <div className="pt-2">
          <Link to="/register">
            <Button variant="primary" size="lg">
              Get Started Now — It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
