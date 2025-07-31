// PUBLIC_INTERFACE
/**
 * API response and data structure types for the Notes application
 */

export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface NotesResponse {
  status: string;
  data: {
    notes: Note[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface NoteResponse {
  status: string;
  message: string;
  data: {
    note: Note;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}
