import { supabase } from '@/lib/supabaseClient';

export interface UserSettings {
  user_id: string;
  ai_model: string;
  vector_db: string;
  similarity_threshold: number;
  updated_at?: string;
}

export const settingsService = {
  // GET: Fetch user settings or defaults
  async getSettings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found, return defaults (or allow UI to show defaults)
      return null;
    }
    
    if (error) throw error;
    return data as UserSettings;
  },

  // POST/PUT: Upsert user settings
  async saveSettings(settings: Partial<UserSettings>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = {
      ...settings,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  }
};
