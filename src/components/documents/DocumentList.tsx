'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, AlertCircle, FileIcon, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

import { Document } from '@/types'; 
import { documentService } from '@/services/documentService';
import { useDataList } from '@/hooks/useDataList';

interface DocumentListProps {
  projectId: string;
  refreshTrigger: number;
}

export default function DocumentList({ projectId, refreshTrigger }: DocumentListProps) {
  // We useCallback to create a stable fetcher function that depends on projectId
  const fetchDocs = useCallback(() => {
    return documentService.getProjectDocuments(projectId).then(data => ({ data, error: null })).catch(error => ({ data: null, error }));
  }, [projectId]);

  const {
    data: documents,
    loading,
    error,
    refresh,
    optimisticDelete
  } = useDataList<Document>({
    fetcher: fetchDocs,
    // When refreshTrigger changes, we want to re-fetch. 
    // The hook itself doesn't watch external triggers automatically unless we put them in fetcher dependency 
    // and rely on the fetcher reference changing to trigger effect? 
    // Actually my hook listens to `fetcher` change to update ref, but not to Trigger refresh!
    // The hook only runs on mount. 
    // Let's handle refreshTrigger manually or update the hook?
    // For now, simple useEffect here is fine.
  });

  // Watch for external refresh trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      refresh(true);
    }
  }, [refreshTrigger, refresh]);

  // Clean deletion state
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteDoc) return;
    
    setDeleteLoading(true);
    try {
      await documentService.deleteDocument(deleteDoc.id, ''); 
      toast.success('文档已删除');
      optimisticDelete('id', deleteDoc.id);
    } catch (err: any) {
      toast.error('删除失败');
      console.error(err);
      refresh(true);
    } finally {
      setDeleteLoading(false);
      setDeleteDoc(null);
    }
  };

  // ... error / loading / empty states ...
  if (loading && documents.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <AlertCircle className="mb-2 h-6 w-6" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <FileIcon className="mb-3 h-10 w-10 text-slate-200" />
        <p className="text-sm">暂无文档</p>
        <p className="text-xs text-slate-400">上传文档以构建知识库</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-slate-400" />
                    <span className="truncate max-w-[200px]" title={doc.name}>
                      {doc.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.upload_date ? formatDistanceToNow(new Date(doc.upload_date), {
                    addSuffix: true,
                    locale: zhCN,
                  }) : '-'}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    doc.status === 'indexed' 
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                      : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                  }`}>
                    {doc.status === 'indexed' ? '已索引' : doc.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    disabled={deleteLoading && deleteDoc?.id === doc.id}
                    onClick={() => setDeleteDoc(doc)}
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteDoc} onOpenChange={(open) => !open && setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个文档吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除文档 "{deleteDoc?.name}" 且无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {deleteLoading ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
