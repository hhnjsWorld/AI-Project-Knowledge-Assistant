import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database';

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

export const projectService = {
  // GET: Fetch projects with pagination
  async getProjects(page: number = 1, limit: number = 30, query?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let request = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (query) {
      request = request.ilike('name', `%${query}%`);
    }

    return await request;
  },

  // GET: Fetch recent projects (limit) sorted by last accessed
  async getRecent(limit: number) {
    return await supabase
      .from('projects')
      .select('*')
      .order('last_accessed_at', { ascending: false, nullsFirst: false })
      .limit(limit);
  },

  // PATCH: Update last_accessed_at
  async touchProject(id: string) {
    const res = await supabase
      .from('projects')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', id);
      
    if (!res.error) {
       // Notify listeners to refresh recent lists
       if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('project-updated'));
       }
    }
    return res;
  },

  // GET: Fetch a single project by ID with Request Deduplication (and auto-touch)
  async getById(id: string) {
    if (this._getByIdCache.has(id)) {
      return this._getByIdCache.get(id);
    }

    const fetcher = async () => {
      try {
        const res = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        // Auto-clear cache after short delay
        setTimeout(() => {
          this._getByIdCache.delete(id);
        }, 1000);

        return res;
      } catch (error) {
        this._getByIdCache.delete(id);
        throw error;
      }
    };

    const promise = fetcher();
    this._getByIdCache.set(id, promise);
    return promise;
  },

  // Internal cache for deduplication
  _getByIdCache: new Map(),

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
        last_accessed_at: null, // Don't mark as recent until visited
      } as any)
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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
