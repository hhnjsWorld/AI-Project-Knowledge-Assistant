import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database';

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

export const projectService = {
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
      .insert({
        name,
        description,
        user_id: user.id,
      })
      .select()
      .single();
  },

  // PATCH: Update a project (Rename / Description)
  async update(id: string, updates: { name?: string; description?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return await (supabase
      .from('projects') as any)
      .update({
        ...updates,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
  },

  // DELETE: Delete a project
  async delete(id: string) {
    // Note: If you have Cascade Delete set up in DB, this will auto-delete documents.
    // If not, we might need to delete documents manually first.
    // Assuming standard Supabase Cascade for now.
    return await supabase
      .from('projects')
      .delete()
      .eq('id', id);
  }
};
