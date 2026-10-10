import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Repeat, User, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProficiencyLevel, LearningProficiencyLevel, PreferredFormat } from '../types';

export const OnboardingPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const state = store.getState();
  const allSkills = state.skills;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Profile
  const [headline, setHeadline] = useState('Enthusiastic Learner & Mentor');
  const [bio, setBio] = useState('Excited to exchange knowledge and build peer connections.');
  const [timezone, setTimezone] = useState('UTC');
  const [format, setFormat] = useState<PreferredFormat>('1:1');

  // Step 2: Teaching Skill
  const [teachSkillId, setTeachSkillId] = useState(allSkills[0]?.id || 's1');
  const [teachLevel, setTeachLevel] = useState<ProficiencyLevel>('intermediate');
  const [teachHours, setTeachHours] = useState(2);

  // Step 3: Learning Goal
  const [learnSkillId, setLearnSkillId] = useState(allSkills[1]?.id || 's2');
  const [learnCurrentLevel, setLearnCurrentLevel] = useState<LearningProficiencyLevel>('beginner');
  const [learnDesiredLevel, setLearnDesiredLevel] = useState<ProficiencyLevel>('intermediate');
  const [learnObjective, setLearnObjective] = useState('Build strong practical fundamentals through weekly peer practice.');

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ headline, bio, timezone, preferred_format: format });
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && teachSkillId) {
      store.addTeachingSkill({
        user_id: user.id,
        skill_id: teachSkillId,
        proficiency_level: teachLevel,
        years_experience: 2,
        is_free_exchange: true,
        availability_hours_per_week: teachHours,
      });
    }
    setStep(3);
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && learnSkillId) {
      store.addLearningGoal({
        user_id: user.id,
        skill_id: learnSkillId,
        current_proficiency: learnCurrentLevel,
        desired_proficiency: learnDesiredLevel,
        learning_objective: learnObjective,
        preferred_format: format,
      });
    }
    navigate('/matches');
  };

  return (
    <div className="max-w-xl mx-auto pt-6 pb-16 space-y-6">
      {/* Progress Indicator */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Onboarding & Profile Setup (Step {step} of 3)
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome to the SkillLoop Network
        </h1>
        <p className="text-xs text-slate-600">
          Set up what you can teach and what you want to learn to unlock instant peer matches.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              step === s ? 'w-12 bg-emerald-600' : step > s ? 'w-6 bg-emerald-300' : 'w-6 bg-slate-200'
            }`}
          />
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Step 1: Complete Your Learning Profile
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Software Engineer & Music Lover"
                required
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Bio & Background
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                required
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Preferred Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="1:1">1:1 Focused Sessions</option>
                  <option value="small_group">Small Group Circles</option>
                  <option value="self_paced_ai">Self-Paced with AI</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="md" type="submit" className="w-full">
                Continue to Teaching Skill <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600" /> Step 2: What Skill Can You Teach?
            </h2>
            <p className="text-xs text-slate-500">
              Every member shares knowledge. You don't need to be a world-class master; teaching beginner concepts cements your own mastery.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Select Teaching Skill
              </label>
              <select
                value={teachSkillId}
                onChange={(e) => setTeachSkillId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {allSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Your Proficiency Level
                </label>
                <select
                  value={teachLevel}
                  onChange={(e) => setTeachLevel(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Availability (Hours/Week)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={teachHours}
                  onChange={(e) => setTeachHours(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button variant="ghost" size="md" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" size="md" type="submit" className="flex-1">
                Continue to Learning Goal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinishOnboarding} className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Step 3: What Do You Want to Learn?
            </h2>
            <p className="text-xs text-slate-500">
              Select what skill you want to exchange for. Our matching algorithm will immediately connect you with compatible partners.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Select Learning Goal
              </label>
              <select
                value={learnSkillId}
                onChange={(e) => setLearnSkillId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {allSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Current Level
                </label>
                <select
                  value={learnCurrentLevel}
                  onChange={(e) => setLearnCurrentLevel(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="none">None (Total Beginner)</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target Level
                </label>
                <select
                  value={learnDesiredLevel}
                  onChange={(e) => setLearnDesiredLevel(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Specific Learning Objective
              </label>
              <textarea
                value={learnObjective}
                onChange={(e) => setLearnObjective(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button variant="ghost" size="md" type="button" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="primary" size="md" type="submit" className="flex-1">
                Complete Setup & Find Matches <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
