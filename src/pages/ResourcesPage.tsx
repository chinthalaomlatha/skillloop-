import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Sparkles, CheckCircle2, Bookmark, Info } from 'lucide-react';
import { searchEducationalResources } from '../lib/resourceService';
import { LearningResource } from '../types';
import { ResourceCard } from '../components/resources/ResourceCard';
import { store } from '../lib/store';
import { Button } from '../components/ui/Button';

export const ResourcesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isCachedNotice, setIsCachedNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const state = store.getState();
  const savedIds = new Set(state.savedResources.map((sr) => sr.resource_id));

  const handleSearch = async () => {
    setIsLoading(true);
    const result = await searchEducationalResources(query, categoryFilter);
    setResources(result.resources);
    setIsCachedNotice(result.message || null);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [categoryFilter]);

  const handleSaveToLibrary = (res: LearningResource, notes?: string) => {
    store.saveResource(res, notes);
    setSaveSuccessMsg(`Saved "${res.title}" to your Personal Learning Library!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" /> Free Educational Resource Discovery
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Curated free tutorials, official documentation, and YouTube video guides with zero fake links or unverified ratings.
          </p>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {saveSuccessMsg}
        </div>
      )}

      {/* Quota / Cache Notice (§9: YouTube Quota Handling) */}
      {isCachedNotice && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>{isCachedNotice}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search resources by skill, topic, or keyword (e.g., Python, Spanish, Figma)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Formats</option>
            <option value="video">Videos Only</option>
            <option value="docs">Official Docs</option>
            <option value="article">Articles & Guides</option>
            <option value="course">Free Courses</option>
          </select>

          <Button variant="primary" size="sm" onClick={handleSearch} isLoading={isLoading}>
            Search
          </Button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onSaveToLibrary={handleSaveToLibrary}
            isSaved={savedIds.has(resource.id)}
          />
        ))}
      </div>
    </div>
  );
};
