import React, { useState } from 'react';
import { ExternalLink, Bookmark, Check, Video, FileText, BookOpen, Dumbbell, Sparkles } from 'lucide-react';
import { LearningResource } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ResourceCardProps {
  resource: LearningResource;
  onSaveToLibrary: (resource: LearningResource, notes?: string) => void;
  isSaved?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSaveToLibrary,
  isSaved = false,
}) => {
  const [notes, setNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'docs': return BookOpen;
      case 'exercise': return Dumbbell;
      default: return BookOpen;
    }
  };

  const Icon = getIcon(resource.resource_type);

  const handleSave = () => {
    onSaveToLibrary(resource, notes);
    setShowNoteInput(false);
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden hoverable h-full">
      <div>
        {/* Resource Thumbnail / Header */}
        <div className="relative h-40 bg-slate-900 overflow-hidden group">
          <img
            src={resource.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
            alt={resource.title}
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge variant="emerald" size="sm" className="font-bold">
              {resource.pricing_status.toUpperCase()}
            </Badge>
            <Badge variant="slate" size="sm" className="bg-black/60 text-white border-none backdrop-blur-xs capitalize">
              <Icon className="w-3 h-3 mr-1 inline" />
              {resource.resource_type}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>By {resource.provider}</span>
            <span className="capitalize text-slate-400">{resource.source}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            {resource.title}
          </h4>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {resource.relevance_reason && (
            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Why relevant:</strong> {resource.relevance_reason}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-2 border-t border-slate-100 space-y-2">
        {showNoteInput && (
          <div className="space-y-2 pb-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your study notes or learning goal for this resource..."
              rows={2}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save to Library
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Open Source <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {isSaved ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <Check className="w-3.5 h-3.5" /> In Library
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoteInput(true)}
              className="text-xs"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1 text-slate-500" /> Save
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
