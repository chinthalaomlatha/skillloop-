import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { LearningPath } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { generateLearningPath } from '../lib/aiMentorService';

export const LearningPathsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paths, setPaths] = useState<LearningPath[]>([]);

  const loadPaths = () => {
    if (!user) return;
    const s = store.getState();
    const myPaths = s.learningPaths.filter((p) => p.user_id === user.id);

    // If none exists yet, automatically create an initial path for the user's first learning goal
    if (myPaths.length === 0) {
      const myGoal = s.learningGoals.find((lg) => lg.user_id === user.id);
      const skill = myGoal?.skill || s.skills[0];
      if (skill) {
        const initialPath = generateLearningPath(user.id, skill.id, skill.name, 'beginner', 'intermediate');
        store.saveLearningPath(initialPath);
        setPaths([initialPath]);
        return;
      }
    }
    setPaths(myPaths);
  };

  useEffect(() => {
    loadPaths();
    const unsubscribe = store.subscribe(() => loadPaths());
    return () => unsubscribe();
  }, [user]);

  const handleToggleStep = (pathId: string, stepId: string) => {
    store.toggleLearningPathStep(pathId, stepId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" /> Personalized Learning Roadmaps
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Break large learning targets into deliberate study missions, practice tasks, quizzes, and peer exchange milestones.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate('/mentor')}>
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate New Roadmap
        </Button>
      </div>

      {paths.length > 0 ? (
        <div className="space-y-8">
          {paths.map((path) => (
            <Card key={path.id} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="indigo" size="sm">{path.domain_type}</Badge>
                    <span className="text-xs font-mono text-slate-400">
                      Estimated {path.estimated_weeks} weeks
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{path.title}</h2>
                </div>

                {/* Progress bar */}
                <div className="sm:text-right min-w-[160px]">
                  <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-700 mb-1">
                    <span>Mastery Progress:</span>
                    <span className="text-emerald-700 font-extrabold">{path.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${path.progress_percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-3">
                {path.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => handleToggleStep(path.id, step.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      step.is_completed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <button className="mt-0.5 text-emerald-600">
                      {step.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${step.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          Step {idx + 1}: {step.title}
                        </h4>
                        <Badge variant="slate" size="sm" className="capitalize text-[10px]">
                          {step.action_type.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      {step.notes && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          Note: {step.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Learning Paths Generated"
          description="Create a step-by-step learning roadmap tailored to your specific goals with our AI Mentor."
          actionLabel="Generate Roadmap with AI Mentor"
          onAction={() => navigate('/mentor')}
        />
      )}
    </div>
  );
};
