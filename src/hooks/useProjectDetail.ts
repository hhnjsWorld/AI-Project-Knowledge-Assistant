import { useEffect, useState } from 'react';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';

export function useProjectDetail(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      try {
        const { data, error } = await projectService.getById(projectId);
        if (error) {
          throw error;
        }
        setProject(data);
        // Touch the project to mark it as recently viewed
        // Fire and forget, don't block UI
        projectService.touchProject(projectId).catch(err => console.error('Failed to touch project', err));
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading };
}
