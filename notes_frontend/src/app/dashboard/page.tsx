'use client';

// PUBLIC_INTERFACE
/**
 * Dashboard page component with sidebar navigation and note editor
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Note } from '@/types/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import { Menu } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreatingNote(false);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting note
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreatingNote(true);
    setIsSidebarOpen(false); // Close sidebar on mobile after creating note
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    setSelectedNote(updatedNote);
  };

  const handleNoteCreate = (newNote: Note) => {
    setSelectedNote(newNote);
    setIsCreatingNote(false);
  };

  const handleDeleteNote = (noteId: number) => {
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
      setIsCreatingNote(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <Sidebar
            selectedNoteId={selectedNote?.id || null}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            className="h-full"
          />
        </div>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="relative w-80 h-full bg-white dark:bg-gray-800">
              <Sidebar
                selectedNoteId={selectedNote?.id || null}
                onSelectNote={handleSelectNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDeleteNote}
                className="h-full"
              />
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedNote ? selectedNote.title || 'Untitled' : isCreatingNote ? 'New Note' : 'Notes'}
            </h2>
            <div className="w-9 h-9" /> {/* Spacer */}
          </div>

          {/* Note Editor */}
          <div className="flex-1">
            <NoteEditor
              note={isCreatingNote ? null : selectedNote}
              onNoteUpdate={handleNoteUpdate}
              onNoteCreate={handleNoteCreate}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
