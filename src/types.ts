export interface Project {
  id: string;
  created_at: string; // Mapped from DB
  name: string;
  description: string | null;
  updated_at: string; // Mapped from DB
  member_count?: number; // Mapped from DB (optional/virtual)
  user_id: string;
}

export interface Document {
  id: string;
  name: string;
  status: string; // Was union, but DB returns string. Ideally should be enum.
  source?: string; // Not in DB, making optional
  storage_path?: string; // Needed for file cleanup
  created_at: string; // Mapped from DB 
  project_id?: string;
  user_id: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Citation {
  documentId: string;
  documentName: string;
  snippet: string;
  page?: number;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}
