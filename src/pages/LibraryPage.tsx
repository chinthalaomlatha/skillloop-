import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, Edit3, CheckCircle2, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { SavedResource, PersonalNote } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);
  const [activeTab, setActiveTab] = useState<'resources' | 'notes'>('resources');

  // New Note state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const loadData = () => {
    if (!user) return;
    const state = store.getState();
    setSavedResources(state.savedResources.filter((sr) => sr.user_id === user.id));
    setPersonalNotes(state.personalNotes.filter((pn) => pn.user_id === user.id));
  };

  useEffect(() => {
    loadData();
    const unsubscribe = store.subscribe(() => loadData());
    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = (id: string, status: SavedResource['status']) => {
    store.updateSavedResourceStatus(id, status);
  };

  const handleRemoveResource = (id: string) => {
    store.removeSavedResource(id);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    store.savePersonalNote(noteTitle, noteContent);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    store.deletePersonalNote(noteId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-emerald-600" /> Personal Learning Library & Notes
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Organize your saved tutorials, curriculum notes, and track your study progress across sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'notes' && (
            <Button variant="primary" size="sm" onClick={() => setShowNoteModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> New Study Note
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saved Resources ({savedResources.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'notes'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Personal Study Notes ({personalNotes.length})
        </button>
      </div>

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div>
          {savedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map((sr) => (
                <Card key={sr.id} className="p-4 flex flex-col justify-between hoverable">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="emerald" size="sm">
                        {sr.resource.resource_type.toUpperCase()}
                      </Badge>
                      <button
                        onClick={() => handleRemoveResource(sr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Remove from library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">
                      {sr.resource.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Provider: {sr.resource.provider}
                    </p>

                    {sr.notes && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 mb-3">
                        <strong className="block text-[10px] text-slate-400 uppercase font-mono">My Notes:</strong>
                        {sr.notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Status:</span>
                      <select
                        value={sr.status}
                        onChange={(e) => handleUpdateStatus(sr.id, e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <a
                      href={sr.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-1"
                    >
                      Open Resource <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="Your Personal Library is Empty"
              description="Save educational videos, documentation, and exercises from our Discovery portal to keep them easily accessible."
              actionLabel="Explore Free Resources"
              onAction={() => navigate('/resources')}
            />
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          {personalNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalNotes.map((note) => (
                <Card key={note.id} className="p-5 flex flex-col justify-between hoverable">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    Last updated {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Edit3}
              title="No Study Notes Yet"
              description="Capture key insights, reflection prompts, and practice goals for your peer skill exchange sessions."
              actionLabel="Create First Study Note"
              onAction={() => setShowNoteModal(true)}
            />
          )}
        </div>
      )}

      {/* Create Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Study Note</h3>
            <p className="text-xs text-slate-500 mb-4">Record your insights from your learning journey</p>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Sourdough Hydration Ratios"
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Note Content
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  placeholder="Key concepts, takeaways, links or exercises to review..."
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
