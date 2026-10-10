import React, { useState } from 'react';
import { Bot, BookOpen, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Skill, Quiz } from '../types';
import { MentorChat } from '../components/mentor/MentorChat';
import { QuizModal } from '../components/mentor/QuizModal';
import { generateSkillQuiz, generateLearningPath } from '../lib/aiMentorService';
import { Button } from '../components/ui/Button';

export const MentorPage: React.FC = () => {
  const { user } = useAuth();
  const state = store.getState();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // User's learning skills or all skills
  const myLearningGoals = state.learningGoals.filter((lg) => lg.user_id === user?.id);
  const relevantSkills = myLearningGoals.length > 0
    ? myLearningGoals.map((lg) => lg.skill || state.skills.find((s) => s.id === lg.skill_id)!).filter(Boolean)
    : state.skills;

  const handleOpenQuiz = (skill: Skill) => {
    const quiz = generateSkillQuiz(skill.id, skill.name);
    setActiveQuiz(quiz);
  };

  const handleGenerateRoadmap = (skill: Skill) => {
    if (!user) return;
    const path = generateLearningPath(user.id, skill.id, skill.name, 'beginner', 'intermediate');
    store.saveLearningPath(path);
    setSuccessBanner(`Personalized Learning Roadmap for "${skill.name}" has been created and saved to your Learning Paths!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-600" /> AI Learning Assistant & Mentor
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Personalized guidance scoped to your selected skill domain. Explains concepts simply, evaluates quizzes, and structures your peer exchange agenda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {relevantSkills[0] && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenQuiz(relevantSkills[0])}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Practice Quiz
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateRoadmap(relevantSkills[0])}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate Roadmap
              </Button>
            </>
          )}
        </div>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successBanner}
        </div>
      )}

      {/* Main Mentor Chat Box */}
      <MentorChat
        skills={relevantSkills}
        onOpenQuiz={handleOpenQuiz}
        onGenerateRoadmap={handleGenerateRoadmap}
      />

      {/* Active Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          isOpen={Boolean(activeQuiz)}
          onClose={() => setActiveQuiz(null)}
          quiz={activeQuiz}
          onPassed={() => {
            setSuccessBanner('Superb! You passed this AI self-assessment with 100%!');
            setTimeout(() => setSuccessBanner(null), 5000);
          }}
        />
      )}
    </div>
  );
};
