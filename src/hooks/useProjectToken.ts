import { useState } from 'react';
import { toast } from 'sonner';

export function useProjectToken() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getToken = async (projectId: string) => {
    setLoadingId(projectId);
    try {
      const response = await fetch('/api/project-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: projectId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || '生成项目链接失败');
      }

      const payload = await response.json();
      if (!payload?.token) {
        throw new Error('生成项目链接失败');
      }

      return payload.token as string;
    } catch (error) {
      console.error('Failed to get project token:', error);
      toast.error('生成项目链接失败');
      return projectId;
    } finally {
      setLoadingId(null);
    }
  };

  return { getToken, loadingId };
}
