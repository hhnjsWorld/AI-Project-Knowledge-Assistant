import { n8nService } from './n8n';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  projectId: string; // To load project context
  messages: ChatMessage[];
  streaming?: boolean; // n8n response handling difference
}

export interface IndexDocumentRequest {
  documentId: string;
  projectId: string; // Needed for verify project ownership inside n8n or logic
}

export const aiService = {
  /**
   * Trigger the "Indexing" workflow in n8n.
   * This logic instructs n8n to:
   * 1. Download the file from Supabase Storage (using documentId).
   * 2. Parse/Chunk the file.
   * 3. Generate embeddings.
   * 4. Upsert into `document_embeddings` table via Supabase Vector Node/SQL.
   * 5. Update document status to 'searchable'.
   * 
   * @param documentId - The UUID of the document in Supabase
   * @param projectId - The Project ID it belongs to
   * @returns Trigger result
   */
  /**
   * Trigger the "Indexing" workflow in n8n.
   * Now includes full document metadata as requested by user.
   */
  async indexDocument(request: { 
    documentId: string; 
    projectId: string; 
    // text: string; // REMOVED: Do not send full file content. n8n will fetch it via Edge Function.
    // Optional extra fields based on Supabase Document Row
    name?: string;
    storage_path?: string;
    user_id?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  }) {
    // Workflow ID should be stored in env or config
    const workflowId = process.env.NEXT_PUBLIC_N8N_WORKFLOW_INDEX || 'unknown-index-workflow';
    
    return await n8nService.invokeWorkflow(workflowId, {
      ...request, // Spread all properties (name, storage_path, etc.)
      document_id: request.documentId, // Explicit mapping if needed, though ...request covers it if keys match
      action: 'index_document'
    });
  },

  /**
   * Trigger the "RAG Chat" workflow in n8n.
   * This logic instructs n8n to:
   * 1. Receive user query + history.
   * 2. Generate embedding for query.
   * 3. Similarity Search in `document_embeddings` (filtered by projectId).
   * 4. Construct Prompt with context.
   * 5. Call LLM (Model set in User Settings or default).
   * 6. Return answer.
   * 
   * @param request - Chat Context
   * @returns LLM Response
   */
  async chatCompletion(request: ChatCompletionRequest) {
    const workflowId = process.env.NEXT_PUBLIC_N8N_WORKFLOW_CHAT || 'unknown-chat-workflow';

    return await n8nService.invokeWorkflow(workflowId, {
      ...request,
      action: 'chat_completion'
    });
  }
};
