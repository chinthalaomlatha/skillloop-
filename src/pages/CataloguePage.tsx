import React, { useState, useEffect } from 'react';
import { Compass, Plus, Search, Tag, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { store } from '../lib/store';
import { Skill, SkillCategory } from '../types';
import { moderateContent } from '../lib/moderationService';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export const CataloguePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Custom Skill Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategoryId, setCustomCategoryId] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customTags, setCustomTags] = useState('');
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadSkills = () => {
    const state = store.getState();
    setCategories(state.categories);
    setSkills(state.skills);
    if (!customCategoryId && state.categories.length > 0) {
      setCustomCategoryId(state.categories[0].id);
    }
  };

  useEffect(() => {
    loadSkills();
    const unsubscribe = store.subscribe(() => loadSkills());
    return () => unsubscribe();
  }, []);

  const handleCreateCustomSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);

    // 1. Mandatory Content Moderation (§5)
    const checkName = await moderateContent(customName, 'skill_name');
    if (checkName.flagged) {
      setModerationError(checkName.reason || 'Skill name did not pass safety moderation.');
      return;
    }

    const checkDesc = await moderateContent(customDescription, 'skill_description');
    if (checkDesc.flagged) {
      setModerationError(checkDesc.reason || 'Skill description did not pass safety moderation.');
      return;
    }

    const tagsArray = customTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // 2. Add skill into database/store without code change!
    const created = store.addCustomSkill(
      customName.trim(),
      customCategoryId,
      customDescription.trim(),
      tagsArray
    );

    setCustomName('');
    setCustomDescription('');
    setCustomTags('');
    setShowAddModal(false);
    setSuccessBanner(`Custom skill "${created.name}" created and added to the universal catalogue!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategoryId === 'all' || s.category_id === selectedCategoryId;
    const matchesQuery =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" /> Universal Skill Catalogue
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Browse 16 core categories or add new custom skills. Adding skills never requires a code change.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Custom Skill
        </Button>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successBanner}
        </div>
      )}

      {/* Search and Category Pill Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, tags, or domains (e.g. Sourdough, Python, Spanish, Guitar)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const category = categories.find((c) => c.id === skill.category_id);
          return (
            <Card key={skill.id} className="p-4 flex flex-col justify-between hoverable">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="indigo" size="sm">
                    {category?.name || 'General'}
                  </Badge>
                  {skill.is_custom && (
                    <Badge variant="amber" size="sm">Custom Skill</Badge>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {skill.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {skill.description || 'No description provided.'}
                </p>

                {skill.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/profile?addTeach=${skill.id}`)}
                  className="text-xs text-emerald-700 hover:text-emerald-800"
                >
                  I Can Teach This
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/profile?addLearn=${skill.id}`)}
                  className="text-xs text-indigo-700 hover:text-indigo-800"
                >
                  I Want to Learn
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Custom Skill Modal (§5 & §16 Moderation enforced) */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Skill to Universal Catalogue"
        description="Expand the SkillLoop network with any domain. All additions pass through content moderation."
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomSkill} className="space-y-4">
          {moderationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{moderationError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Japanese Kanji Mnemonics, Pottery Throwing, Unreal Engine C++"
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Category
            </label>
            <select
              value={customCategoryId}
              onChange={(e) => setCustomCategoryId(e.target.value)}
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Explain the scope and typical learning curve of this skill..."
              rows={3}
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder="e.g. language, kanji, memory"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Moderation Active
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Skill
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
