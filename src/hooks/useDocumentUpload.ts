import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { documentService } from '@/services/documentService';
import { aiService } from '@/services/aiService';

export function useDocumentUpload(projectId: string, onUploadComplete: () => void) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: FileList) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    const file = files[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      // 1. Read file text (Simple extraction for Phase 3)
      const text = await file.text(); // Assuming text-based files for now

      // 2. Upload to Supabase Storage & DB
      const doc = await documentService.uploadFile(file, projectId, user.id);
      toast.success('文件上传成功，开始处理...');
      
      onUploadComplete(); // Refresh list immediately

       // 3. Trigger AI Indexing
       if (doc && doc.id) {
          aiService.indexDocument({
            documentId: doc.id,
            projectId,
            text,
            // Pass all other properties from the doc record
            name: doc.name || undefined,
            storage_path: doc.storage_path || undefined,
            user_id: doc.user_id || undefined,
            status: doc.status || undefined,
            created_at: doc.created_at || undefined,
            updated_at: doc.updated_at || undefined
          })
            .then(res => {
              if (res.success) {
                toast.success('AI 索引已触发');
              } else {
                toast.warning('文件已存，但AI索引触发失败');
                console.error('Indexing failed:', res.error);
              }
            })
            .catch(err => {
              console.error('Indexing network error:', err);
            });
       }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('上传失败: ' + (error.message || '未知错误'));
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, isUploading };
}
