'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface FileUploadProps {
  projectId: string;
  onUploadComplete: () => void;
}

export default function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFiles, isUploading } = useDocumentUpload(
    projectId,
    onUploadComplete
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    await uploadFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-8 transition-colors ${
        isDragging
          ? 'border-slate-400 bg-slate-50'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        title="Upload file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        // accept=".pdf,.txt,.md" 
      />

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          ) : (
            <Upload className="h-6 w-6 text-slate-500" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-900">
            {isUploading ? '正在上传...' : '点击或拖拽上传文档'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            支持 PDF, TXT, Markdown (最大 10MB)
          </p>
        </div>
        {!isUploading && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            选择文件
          </Button>
        )}
      </div>
    </div>
  );
}
