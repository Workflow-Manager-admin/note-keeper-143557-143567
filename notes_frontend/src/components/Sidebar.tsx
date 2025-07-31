'use client';

// PUBLIC_INTERFACE
/**
 * Sidebar component for note navigation and management
 */

import { useState, useEffect } from 'react';
import { Note } from '@/types/api';
import { apiClient, ApiError } from '@/lib/api';
import { Search, Plus, FileText, Trash2 } from 'lucide-react';

interface SidebarProps {
  selectedNoteId: number | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: number) => void;
  className?: string;
}

export default function Sidebar({
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  className = '',
}: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadNotes(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const loadNotes = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getNotes(search);
      setNotes(response.data.notes);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await apiClient.deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
        onDeleteNote(noteId);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to delete note');
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notes</h1>
          <button
            onClick={onCreateNote}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Create new note"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading notes...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 dark:text-red-400">
            {error}
            <button
              onClick={() => loadNotes(searchTerm)}
              className="block mx-auto mt-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No notes found' : 'No notes yet'}
            {!searchTerm && (
              <button
                onClick={onCreateNote}
                className="block mx-auto mt-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                    : ''
                }`}
                onClick={() => onSelectNote(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {note.title || 'Untitled'}
                      </h3>
                    </div>
                    {note.content && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {truncateContent(note.content)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(note.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete note"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
