import { useState } from 'react';
import { projectService } from '@/services/projectService';

export function useCreateProject() {
  const [loading, setLoading] = useState(false);

  const createProject = async (name: string, description?: string) => {
    setLoading(true);
    try {
      const { data, error } = await projectService.create(name, description);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error('No data returned');
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
}

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);

  const updateProject = async (
    projectId: string,
    updates: { name?: string; description?: string }
  ) => {
    setLoading(true);
    try {
      const { error } = await projectService.update(projectId, updates);
      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading };
}
