import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Document } from '@/types';
import { documentService } from '@/services/documentService';
import { useDataList } from '@/hooks/useDataList';

export function useKnowledgeDocuments() {
  const { user } = useAuth();

  const fetchDocuments = useCallback(() => {
    return documentService
      .getAllDocuments()
      .then((data) => ({ data, error: null }))
      .catch((error) => ({ data: null, error }));
  }, []);

  const { data, loading, refresh } = useDataList<Document>({
    fetcher: fetchDocuments,
  });

  const addDocument = async (name: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    await documentService.createDocument({
      name,
      source: '本地上传',
      status: 'searchable',
      user_id: user.id,
    });

    refresh(true);
  };

  return { documents: data, loading, addDocument };
}
