'use client';

// PUBLIC_INTERFACE
/**
 * Note editor component for creating and editing notes
 */

import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/types/api';
import { apiClient, ApiError } from '@/lib/api';
import { Save, Clock, AlertCircle } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  onNoteUpdate: (note: Note) => void;
  onNoteCreate: (note: Note) => void;
  className?: string;
}

export default function NoteEditor({
  note,
  onNoteUpdate,
  onNoteCreate,
  className = '',
}: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNewNote, setIsNewNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setIsNewNote(false);
      setHasUnsavedChanges(false);
      setError(null);
    } else {
      // New note
      setTitle('');
      setContent('');
      setIsNewNote(true);
      setHasUnsavedChanges(false);
      setError(null);
    }
  }, [note]);

  const handleSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      return; // Don't save empty notes
    }

    if (!title.trim()) {
      setError('Note title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isNewNote) {
        // Create new note
        const response = await apiClient.createNote({
          title: title.trim(),
          content: content.trim(),
        });
        const createdNote = response.data.note;
        onNoteCreate(createdNote);
        setIsNewNote(false);
      } else if (note) {
        // Update existing note
        const response = await apiClient.updateNote(note.id, {
          title: title.trim(),
          content: content.trim(),
        });
        const updatedNote = response.data.note;
        onNoteUpdate(updatedNote);
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to save note');
      }
    } finally {
      setIsSaving(false);
    }
  }, [title, content, isNewNote, note, onNoteCreate, onNoteUpdate]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, hasUnsavedChanges, handleSave]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Saved just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `Saved at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }
  };

  if (!note && !isNewNote) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a note to edit
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a note from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`} onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
            {hasUnsavedChanges && !isSaving && (
              <div className="h-2 w-2 bg-orange-500 rounded-full" title="Unsaved changes"></div>
            )}
          </div>
          
          {lastSaved && !hasUnsavedChanges && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {formatLastSaved(lastSaved)}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || (!hasUnsavedChanges && !isNewNote)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Title input */}
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={handleTitleChange}
          className="w-full px-4 py-3 text-2xl font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
        />

        {/* Content textarea */}
        <textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={handleContentChange}
          className="flex-1 w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-transparent border-none resize-none focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Footer with keyboard shortcut hint */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl+S to save manually
        </p>
      </div>
    </div>
  );
}

// Add missing import
import { FileText } from 'lucide-react';
