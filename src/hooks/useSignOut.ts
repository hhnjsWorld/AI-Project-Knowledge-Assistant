import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSignOut() {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
}
