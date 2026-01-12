'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Document } from '@/types';
import { Upload, FileText, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const statusConfig = {
  uploading: {
    icon: Loader,
    label: '上传中',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  processing: {
    icon: Loader,
    label: '向量化中',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  searchable: {
    icon: CheckCircle,
    label: '可检索',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
};

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    const name = prompt('模拟上传：请输入文档名称');
    if (!name) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('documents').insert([
      {
        name,
        source: '本地上传',
        status: 'searchable', // Direct to searchable for demo
        user_id: user.id
      }
    ]);

    if (error) {
      alert('上传失败: ' + error.message);
    } else {
      fetchDocuments();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between fade-up">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">知识库</h1>
          <p className="text-sm text-slate-500">管理所有项目文档与知识资源</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs text-[color:var(--brand-strong)]">
          共 {documents.length} 份文档
        </div>
      </div>

      <div 
        onClick={handleUpload}
        className="group rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-white/90 via-white/80 to-slate-50/80 p-8 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] transition hover:border-slate-300/80 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.5)] cursor-pointer fade-up fade-up-delay-1"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--brand-soft)] text-[color:var(--brand)]">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-slate-700 mb-1">拖拽文件到此处上传</p>
        <p className="text-sm text-slate-500">
          (演示模式：点击此处添加测试数据)
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_24px_-16px_rgba(15,118,110,0.8)] transition group-hover:bg-[color:var(--brand-strong)]"
        >
          选择文件
        </button>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur overflow-hidden fade-up fade-up-delay-2">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-200/70">
            <tr>
              <th className="text-left px-6 py-3 text-xs text-slate-500 uppercase">文档名称</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500 uppercase">来源</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500 uppercase">上传日期</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">暂无文档</td>
              </tr>
            ) : documents.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.uploading;
              const StatusIcon = status.icon;
              
              return (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bgColor} ${status.color}`}
                    >
                      <StatusIcon
                        className={`w-3 h-3 ${
                          doc.status === 'uploading' || doc.status === 'processing'
                            ? 'animate-spin'
                            : ''
                        }`}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {doc.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[color:var(--brand)]/20 bg-[color:var(--brand-soft)]/70 p-5 flex gap-3 fade-up fade-up-delay-3">
        <AlertCircle className="w-5 h-5 text-[color:var(--brand)] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">
          <p className="mb-1 text-slate-900">文档处理说明</p>
          <ul className="text-slate-600 space-y-1 list-disc list-inside">
            <li>文档上传后会自动进行文本提取和向量化处理</li>
            <li>处理完成后即可在对话中被检索和引用</li>
            <li>支持多种格式，最大单文件 50MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
