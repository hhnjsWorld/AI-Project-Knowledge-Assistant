import { useEffect, useState } from 'react';
import { projectService } from '@/services/projectService';
import { Project, Conversation } from '@/types';

const sampleConversations: Conversation[] = [
  {
    id: '1',
    projectId: '1',
    title: '关于性能优化的技术方案',
    lastMessage: '建议采用虚拟滚动和代码分割...',
    timestamp: '1 小时前',
  },
];

export function useDashboardData() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await projectService.getRecent(4);
        if (error) {
          throw error;
        }
        setRecentProjects(data || []);
        setRecentConversations(sampleConversations);
      } catch (error) {
        console.error('Error in dashboard data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    recentProjects,
    recentConversations,
    loading,
  };
}
