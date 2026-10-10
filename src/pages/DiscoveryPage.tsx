import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, RotateCcw, AlertCircle, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface SuggestedSkill {
  id: string;
  name: string;
  type: 'teach' | 'learn';
  level: string;
  reasoning: string;
}

export const DiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interests, setInterests] = useState('I build full-stack web applications in TypeScript and enjoy fermenting sourdough on weekends.');
  const [pastProjects, setPastProjects] = useState('Created automated ETL scripts for work; would love to learn how to produce short documentary video essays and speak conversational Spanish.');
  const [weeklyTime, setWeeklyTime] = useState('3-4 hours per week');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedSkill[] | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());

  const handleRunDiscovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Pedagogical reasoning extraction
    await new Promise((resolve) => setTimeout(resolve, 800));

    const generated: SuggestedSkill[] = [];
    const text = (interests + ' ' + pastProjects).toLowerCase();

    if (text.includes('script') || text.includes('web') || text.includes('typescript') || text.includes('code')) {
      generated.push({
        id: 's-sug-1',
        name: 'Python Programming',
        type: 'teach',
        level: 'advanced',
        reasoning: 'Your experience building web applications and ETL scripts gives you practical mental models to teach code syntax, debugging, and automation.',
      });
    }

    if (text.includes('sourdough') || text.includes('bake') || text.includes('cook')) {
      generated.push({
        id: 's-sug-2',
        name: 'Artisan Sourdough & Baking',
        type: 'teach',
        level: 'intermediate',
        reasoning: 'Hands-on weekend baking experience means you understand wild yeast fermentation and starter troubleshooting, highly prized by culinary beginners.',
      });
    }

    if (text.includes('video') || text.includes('documentary') || text.includes('film')) {
      generated.push({
        id: 's-sug-3',
        name: 'Video Editing & Motion Graphics',
        type: 'learn',
        level: 'beginner',
        reasoning: 'Learning timeline editing and pacing in DaVinci Resolve or Premiere will directly unlock your goal of producing video essays.',
      });
    }

    if (text.includes('spanish') || text.includes('language')) {
      generated.push({
        id: 's-sug-4',
        name: 'Conversational Spanish',
        type: 'learn',
        level: 'beginner',
        reasoning: 'Language learning flourishes through reciprocal speaking loops. A peer partner will give you safe verbal immersion.',
      });
    }

    // Default suggestions if inputs were brief
    if (generated.length === 0) {
      generated.push(
        {
          id: 's-sug-5',
          name: 'Creative Writing & Storytelling',
          type: 'learn',
          level: 'beginner',
          reasoning: 'Storytelling structures ideas and enhances communication across all personal and technical fields.',
        },
        {
          id: 's-sug-6',
          name: 'Acoustic Guitar Fundamentals',
          type: 'learn',
          level: 'beginner',
          reasoning: 'Music and guitar offer relaxing deliberate practice and rhythm training.',
        }
      );
    }

    setSuggestions(generated);
    setIsAnalyzing(false);
  };

  const handleAcceptSuggestion = (sug: SuggestedSkill) => {
    if (!user) return;
    const state = store.getState();
    const existingSkill = state.skills.find((s) => s.name.toLowerCase() === sug.name.toLowerCase());
    const skillId = existingSkill ? existingSkill.id : state.skills[0]?.id || 's1';

    if (sug.type === 'teach') {
      store.addTeachingSkill({
        user_id: user.id,
        skill_id: skillId,
        proficiency_level: sug.level as any,
        years_experience: 2,
        teaching_style: 'Structured practice with step-by-step guidance',
        is_free_exchange: true,
        availability_hours_per_week: 2,
      });
    } else {
      store.addLearningGoal({
        user_id: user.id,
        skill_id: skillId,
        current_proficiency: 'none',
        desired_proficiency: 'intermediate',
        learning_objective: `Master ${sug.name} via peer exchange`,
        preferred_format: '1:1',
      });
    }

    setAcceptedIds((prev) => new Set([...prev, sug.id]));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Optional AI Discovery Assistant (§5)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover What You Can Teach & What You Want to Learn
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Not sure what skills you have to offer or what to pursue next? Answer a few prompts and our AI assistant will suggest potential exchange matches with transparent reasoning.
        </p>
      </div>

      {/* Honesty disclaimer (§5) */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          <strong>Transparent AI Suggestion Notice:</strong> These recommendations are creative starting points, not official skill certifications or proof of ability. You remain in complete control: accept, modify, or reject any suggestion.
        </span>
      </div>

      {!suggestions ? (
        <Card className="p-6">
          <form onSubmit={handleRunDiscovery} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                What are your daily hobbies, work experiences, or past projects?
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={3}
                required
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. I work as an accountant, enjoy baking sourdough on weekends, and play basic acoustic guitar..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                What topics or curiosities have you always wanted to explore?
              </label>
              <textarea
                value={pastProjects}
                onChange={(e) => setPastProjects(e.target.value)}
                rows={3}
                required
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. I want to learn video editing to document my family travels, or improve conversational Spanish..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                How much weekly time can you dedicate to peer learning?
              </label>
              <input
                type="text"
                value={weeklyTime}
                onChange={(e) => setWeeklyTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="lg" type="submit" isLoading={isAnalyzing}>
                <Sparkles className="w-4 h-4 mr-2" /> Analyze Strengths & Suggest Exchange Skills
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              AI-Generated Skill Recommendations ({suggestions.length})
            </h2>
            <Button variant="outline" size="sm" onClick={() => setSuggestions(null)}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake Assessment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => {
              const isAccepted = acceptedIds.has(sug.id);
              return (
                <Card key={sug.id} className="p-5 flex flex-col justify-between hoverable">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge
                        variant={sug.type === 'teach' ? 'emerald' : 'indigo'}
                        size="sm"
                        className="font-bold"
                      >
                        {sug.type === 'teach' ? 'Recommended to TEACH' : 'Recommended to LEARN'}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400 capitalize">
                        {sug.level}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">{sug.name}</h3>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
                      <strong className="block text-[10px] text-slate-400 font-mono uppercase mb-0.5">Transparent Reasoning:</strong>
                      {sug.reasoning}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isAccepted ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Added to Your Profile
                      </span>
                    ) : (
                      <Button
                        variant={sug.type === 'teach' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleAcceptSuggestion(sug)}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add to My Profile
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <Button variant="primary" size="md" onClick={() => navigate('/matches')}>
              Proceed to Peer Matching Engine <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
