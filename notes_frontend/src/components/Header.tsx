'use client';

// PUBLIC_INTERFACE
/**
 * Header component with theme toggle and user controls
 */

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notes App
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-32">{user.email}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
