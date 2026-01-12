export interface Project {
  id: string;
  name: string;
  description: string;
  last_updated: string; // Mapped from DB
  member_count: number; // Mapped from DB
  user_id: string;
}

export interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'searchable';
  source: string;
  upload_date: string; // Mapped from DB 
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
