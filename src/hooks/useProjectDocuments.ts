import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Document } from '@/types';
import { documentService } from '@/services/documentService';
import { useDataList } from '@/hooks/useDataList';

export function useProjectDocuments(projectId: string, refreshTrigger = 0) {
  const fetchDocs = useCallback(() => {
    return documentService
      .getProjectDocuments(projectId)
      .then((data) => ({ data, error: null }))
      .catch((error) => ({ data: null, error }));
  }, [projectId]);

  const { data, loading, error, refresh, optimisticDelete } =
    useDataList<Document>({
      fetcher: fetchDocs,
    });

  useEffect(() => {
    if (refreshTrigger > 0) {
      refresh(true);
    }
  }, [refreshTrigger, refresh]);

  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteDoc) {
      return;
    }

    setDeleteLoading(true);
    try {
      await documentService.deleteDocument(deleteDoc.id, deleteDoc.storage_path || '');
      toast.success('文档已删除');
      optimisticDelete('id', deleteDoc.id);
    } catch (err) {
      console.error(err);
      toast.error('删除失败');
      refresh(true);
    } finally {
      setDeleteLoading(false);
      setDeleteDoc(null);
    }
  };

  return {
    documents: data,
    loading,
    error,
    refresh,
    deleteDoc,
    setDeleteDoc,
    deleteLoading,
    confirmDelete,
  };
}
