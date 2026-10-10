import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';
import { askAiMentor, getDomainProfile, MentorMessage } from '../../lib/aiMentorService';
import { Skill } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface MentorChatProps {
  skills: Skill[];
  initialSkillId?: string;
  onOpenQuiz?: (skill: Skill) => void;
  onGenerateRoadmap?: (skill: Skill) => void;
}

export const MentorChat: React.FC<MentorChatProps> = ({
  skills,
  initialSkillId,
  onOpenQuiz,
  onGenerateRoadmap,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(
    skills.find((s) => s.id === initialSkillId) || skills[0] || { id: 's1', name: 'Python Programming', slug: 'python', is_custom: false, tags: [] }
  );

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am your SkillLoop Learning Mentor for **${selectedSkill.name}**.\n\nI can explain difficult concepts simply, suggest domain practice exercises, and help you prepare for live peer exchange sessions. What are you working on today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const domainInfo = getDomainProfile(selectedSkill.name);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputQuestion;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const reply = await askAiMentor(selectedSkill.name, 'intermediate', textToSend, messages);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error('Mentor error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillChange = (skillId: string) => {
    const found = skills.find((s) => s.id === skillId);
    if (found) {
      setSelectedSkill(found);
      setMessages([
        {
          id: `welcome-${found.id}`,
          sender: 'assistant',
          content: `Switched focus to **${found.name}**.\n\nDomain: *${getDomainProfile(found.name).domain}*.\nHow can I help you master this skill today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const quickPrompts = [
    `Explain the foundational mental model of ${selectedSkill.name}`,
    `Give me a 15-minute deliberate practice exercise`,
    `What should I discuss with my SkillLoop exchange partner?`,
  ];

  return (
    <Card className="flex flex-col h-[650px] shadow-sm border-slate-200">
      {/* Mentor Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">SkillLoop AI Mentor</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {domainInfo.domain}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Personalized pedagogical assistant scoped to your chosen skill
            </p>
          </div>
        </div>

        {/* Skill Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="skill-selector" className="text-xs font-semibold text-slate-700">Skill:</label>
          <select
            id="skill-selector"
            value={selectedSkill.id}
            onChange={(e) => handleSkillChange(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Notice if Physical / Medical Domain (§8 & §17) */}
      {domainInfo.safetyDisclaimer && (
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 flex items-center gap-2 text-xs text-amber-900 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{domainInfo.safetyDisclaimer}</span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <div
                className={`mt-2 text-[10px] font-mono text-right ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>AI Mentor is thinking domain guidance...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
        {onOpenQuiz && (
          <button
            onClick={() => onOpenQuiz(selectedSkill)}
            className="whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" /> Take Quiz
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about ${selectedSkill.name}...`}
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleSend()}
          disabled={!inputQuestion.trim() || isLoading}
          className="h-9 px-3.5"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
