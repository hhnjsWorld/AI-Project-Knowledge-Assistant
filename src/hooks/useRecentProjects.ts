import { useCallback, useEffect, useState } from 'react';
import { ProjectRow, projectService } from '@/services/projectService';

export function useRecentProjects(limit = 5) {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    // Silent refresh: Don't set loading=true here to avoid skeleton flash on updates
    try {
      const { data, error } = await projectService.getRecent(limit);
      if (error) {
        throw error;
      }
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  // Listen for global updates (like touching a project)
  useEffect(() => {
    const handleUpdate = () => {
      fetchRecent();
    };

    // Only listen for updates, NOT creation
    window.addEventListener('project-updated', handleUpdate); 
    
    return () => {
      window.removeEventListener('project-updated', handleUpdate);
    };
  }, [fetchRecent]);

  return { projects, loading, fetchRecent };
}
