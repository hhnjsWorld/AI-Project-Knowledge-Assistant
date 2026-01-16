import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database';

export type Document = Database['public']['Tables']['documents']['Row'];

export const documentService = {
  /**
   * Upload a file to Supabase Storage and create a record in the 'documents' table.
   */
  async uploadFile(file: File, projectId: string, userId: string) {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${projectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Insert record into 'documents' table
    const insertPayload: Database['public']['Tables']['documents']['Insert'] = {
        name: file.name,
        storage_path: filePath,
        status: 'indexed', // For now, we assume it's indexed or 'ready' immediately
        user_id: userId,
        project_id: projectId,
    };

    const { data, error: dbError } = await (supabase
      .from('documents') as any)
      .insert(insertPayload)
      .select()
      .single();

    if (dbError) {
      // Cleanup: delete the uploaded file if DB insert fails
      await supabase.storage.from('documents').remove([filePath]);
      throw dbError;
    }

    return data;
  },

  /**
   * Fetch all documents for a specific project.
   */
  async getProjectDocuments(projectId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Fetch all documents (Knowledge page).
   */
  async getAllDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Create a document record without file upload (demo).
   */
  async createDocument(
    payload: Database['public']['Tables']['documents']['Insert']
  ) {
    const { data, error } = await (supabase
      .from('documents') as any)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Delete a document from both DB and Storage.
   */
  async deleteDocument(documentId: string, filePath?: string) {
    // Only delete from storage if filePath is provided
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

        if (storageError) {
          console.error('Error removing file from storage:', storageError);
          // We continue to delete the DB record even if storage delete fails
        }
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      throw error;
    }
  }
};
