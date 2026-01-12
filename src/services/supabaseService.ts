import { supabase } from '@/lib/supabaseClient';
import { Project, Document } from '@/types';

/**
 * Project Service
 * Encapsulates all interactions with the 'projects' table.
 */
export const ProjectService = {
  // GET: Fetch all projects for the current user
  async getAll() {
    return await supabase
      .from('projects')
      .select('*')
      .order('last_updated', { ascending: false });
  },

  // GET: Fetch a single project by ID
  async getById(id: string) {
    return await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
  },

  // POST: Create a new project
  async create(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return await supabase
      .from('projects')
      .insert([
        {
          name,
          description,
          user_id: user.id,
          // last_updated and member_count have defaults in DB
        }
      ])
      .select()
      .single();
  },

  // DELETE: Delete a project
  async delete(id: string) {
    return await supabase
      .from('projects')
      .delete()
      .eq('id', id);
  }
};

/**
 * Document Service
 * Encapsulates all interactions with the 'documents' table.
 */
export const DocumentService = {
  async getAll() {
    return await supabase
      .from('documents')
      .select('*')
      .order('upload_date', { ascending: false });
  },

  async create(name: string, source: string = '本地上传') {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('User not authenticated');

     return await supabase.from('documents').insert([
       {
         name,
         source,
         status: 'uploading', // Default status
         user_id: user.id
       }
     ]).select().single();
  }
};
