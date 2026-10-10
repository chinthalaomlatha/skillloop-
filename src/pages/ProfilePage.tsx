import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Plus, Trash2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { UserTeachingSkill, UserLearningGoal, ProficiencyLevel, LearningProficiencyLevel, PreferredFormat } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();

  const [teachingSkills, setTeachingSkills] = useState<UserTeachingSkill[]>([]);
  const [learningGoals, setLearningGoals] = useState<UserLearningGoal[]>([]);

  // Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [language, setLanguage] = useState(user?.language || 'English');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat>(user?.preferred_format || '1:1');
  const [freeExchangeOnly, setFreeExchangeOnly] = useState(user?.free_exchange_only ?? true);
  const [profileSaved, setProfileSaved] = useState(false);

  // Modals for Adding Skills
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [teachSkillId, setTeachSkillId] = useState('');
  const [teachLevel, setTeachLevel] = useState<ProficiencyLevel>('intermediate');
  const [teachYears, setTeachYears] = useState(2);
  const [teachHours, setTeachHours] = useState(3);
  const [teachStyle, setTeachStyle] = useState('Hands-on practice and code reviews');

  const [showLearnModal, setShowLearnModal] = useState(false);
  const [learnSkillId, setLearnSkillId] = useState('');
  const [learnCurrentLevel, setLearnCurrentLevel] = useState<LearningProficiencyLevel>('beginner');
  const [learnDesiredLevel, setLearnDesiredLevel] = useState<ProficiencyLevel>('intermediate');
  const [learnObjective, setLearnObjective] = useState('');

  const state = store.getState();
  const allSkills = state.skills;

  const loadData = () => {
    if (!user) return;
    const s = store.getState();
    setTeachingSkills(s.teachingSkills.filter((ts) => ts.user_id === user.id));
    setLearningGoals(s.learningGoals.filter((lg) => lg.user_id === user.id));
    setFullName(user.full_name);
    setHeadline(user.headline || '');
    setBio(user.bio || '');
    setLanguage(user.language);
    setTimezone(user.timezone);
    setPreferredFormat(user.preferred_format);
    setFreeExchangeOnly(user.free_exchange_only);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = store.subscribe(() => loadData());
    return () => unsubscribe();
  }, [user]);

  // Handle URL query parameters from catalogue
  useEffect(() => {
    const addTeach = searchParams.get('addTeach');
    const addLearn = searchParams.get('addLearn');
    if (addTeach) {
      setTeachSkillId(addTeach);
      setShowTeachModal(true);
    }
    if (addLearn) {
      setLearnSkillId(addLearn);
      setShowLearnModal(true);
    }
  }, [searchParams]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      headline,
      bio,
      language,
      timezone,
      preferred_format: preferredFormat,
      free_exchange_only: freeExchangeOnly,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAddTeachingSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !teachSkillId) return;

    store.addTeachingSkill({
      user_id: user.id,
      skill_id: teachSkillId,
      proficiency_level: teachLevel,
      years_experience: teachYears,
      teaching_style: teachStyle,
      is_free_exchange: true,
      availability_hours_per_week: teachHours,
    });

    setShowTeachModal(false);
  };

  const handleAddLearningGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !learnSkillId) return;

    store.addLearningGoal({
      user_id: user.id,
      skill_id: learnSkillId,
      current_proficiency: learnCurrentLevel,
      desired_proficiency: learnDesiredLevel,
      learning_objective: learnObjective,
      preferred_format: preferredFormat,
    });

    setShowLearnModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" /> My Profile & Skill Exchange Management
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Every member is both a teacher and a learner. Keep your listed skills up to date for accurate peer matching.
        </p>
      </div>

      {profileSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Preferences Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Profile & Preferences
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Python Developer & Data Enthusiast"
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
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Preferred Format
                </label>
                <select
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="1:1">1:1 Focused Sessions</option>
                  <option value="small_group">Small Group Circles</option>
                  <option value="self_paced_ai">Self-Paced with AI</option>
                </select>
              </div>

              {/* Free-first toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeExchangeOnly}
                    onChange={(e) => setFreeExchangeOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Free Peer Exchange Only (Default)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-1 pl-6">
                  Guarantees you only receive free reciprocal exchange requests.
                </p>
              </div>

              <div className="pt-3">
                <Button variant="primary" size="sm" type="submit" className="w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Columns: Skills I Teach & Skills I Want to Learn */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills I Can Teach */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Skills I Can Teach ({teachingSkills.length})
                </h3>
                <p className="text-xs text-slate-500">
                  What you know and are ready to share with peers
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (allSkills.length > 0 && !teachSkillId) setTeachSkillId(allSkills[0].id);
                  setShowTeachModal(true);
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Teaching Skill
              </Button>
            </div>

            <div className="space-y-3">
              {teachingSkills.map((ts) => (
                <div
                  key={ts.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {ts.skill?.name || 'Skill'}
                      </span>
                      <Badge variant="emerald" size="sm">
                        {ts.proficiency_level}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {ts.years_experience} yrs exp &bull; {ts.availability_hours_per_week} hrs/wk
                      </span>
                    </div>
                    {ts.teaching_style && (
                      <p className="text-[11px] text-slate-600 mt-1">
                        Style: {ts.teaching_style}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => store.removeTeachingSkill(ts.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {teachingSkills.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  You haven't listed any skills to teach yet. Add at least one to start matching!
                </div>
              )}
            </div>
          </Card>

          {/* Skills I Want to Learn */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Skills I Want to Learn ({learningGoals.length})
                </h3>
                <p className="text-xs text-slate-500">
                  What you want to learn from community exchange partners
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (allSkills.length > 0 && !learnSkillId) setLearnSkillId(allSkills[0].id);
                  setShowLearnModal(true);
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Learning Goal
              </Button>
            </div>

            <div className="space-y-3">
              {learningGoals.map((lg) => (
                <div
                  key={lg.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {lg.skill?.name || 'Skill'}
                      </span>
                      <Badge variant="indigo" size="sm">
                        Target: {lg.desired_proficiency}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Current: {lg.current_proficiency}
                      </span>
                    </div>
                    {lg.learning_objective && (
                      <p className="text-[11px] text-slate-600 mt-1">
                        Objective: {lg.learning_objective}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => store.removeLearningGoal(lg.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {learningGoals.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  No learning goals listed yet. Add what you are interested in exploring!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Teaching Skill Modal */}
      <Modal
        isOpen={showTeachModal}
        onClose={() => setShowTeachModal(false)}
        title="Add Skill You Can Teach"
        description="Share what you know with the community"
      >
        <form onSubmit={handleAddTeachingSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Skill
            </label>
            <select
              value={teachSkillId}
              onChange={(e) => setTeachSkillId(e.target.value)}
              required
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
                Your Proficiency
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
                Years Experience
              </label>
              <input
                type="number"
                min={0.1}
                max={50}
                step={0.5}
                value={teachYears}
                onChange={(e) => setTeachYears(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Availability (Hours / Week)
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Teaching Style / Notes
            </label>
            <textarea
              value={teachStyle}
              onChange={(e) => setTeachStyle(e.target.value)}
              rows={2}
              placeholder="e.g. Live coding, conversational exercises, step-by-step reviews..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowTeachModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Teaching Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Learning Goal Modal */}
      <Modal
        isOpen={showLearnModal}
        onClose={() => setShowLearnModal(false)}
        title="Add Skill You Want to Learn"
        description="Specify what you're excited to learn from peers"
      >
        <form onSubmit={handleAddLearningGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Skill
            </label>
            <select
              value={learnSkillId}
              onChange={(e) => setLearnSkillId(e.target.value)}
              required
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
                <option value="advanced">Advanced</option>
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
                <option value="expert">Expert</option>
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
              placeholder="e.g. Build an interactive web portfolio, bake consistent sourdough, hold a 15-minute conversation..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowLearnModal(false)}>
              Cancel
            </Button>
            <Button variant="secondary" size="sm" type="submit">
              Save Learning Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
