export interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  memberCount: number;
}

export interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'searchable';
  source: string;
  uploadDate: string;
  projectId?: string;
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
