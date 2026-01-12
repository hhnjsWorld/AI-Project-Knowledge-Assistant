'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Project } from '@/types';
import ChatInterface from '@/components/chat/ChatInterface'; // We'll keep this component for now
import FileUpload from '@/components/documents/FileUpload';
import DocumentList from '@/components/documents/DocumentList';
import { useParams } from 'next/navigation';

type TabType = 'chat' | 'documents' | 'summary';

export default function ProjectDetailPage() {
  const { id } = useParams(); // Get ID from URL
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [loading, setLoading] = useState(true);
  const [refreshDocs, setRefreshDocs] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error('Error fetching project:', error);
        } else {
            setProject(data);
        }
        setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/70 bg-white/80 p-12 text-center text-slate-400 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur fade-up">
        加载中...
      </div>
    );
  }
  if (!project) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/70 p-12 text-center text-slate-500 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur fade-up">
        项目不存在
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 fade-up">
      <div className="rounded-2xl border border-white/70 bg-white/80 px-6 py-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
        <h1 className="text-2xl text-slate-900 mb-2">{project.name}</h1>
        <p className="text-sm text-slate-500">{project.description}</p>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur fade-up fade-up-delay-1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            对话
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              activeTab === 'documents'
                ? 'bg-white text-slate-900 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            知识库
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              activeTab === 'summary'
                ? 'bg-white text-slate-900 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            项目摘要
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur fade-up fade-up-delay-2">
        {activeTab === 'chat' && <ChatInterface projectId={project.id} />}
        {activeTab === 'documents' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <FileUpload 
                projectId={project.id} 
                onUploadComplete={() => setRefreshDocs(prev => prev + 1)} 
              />
              <DocumentList 
                projectId={project.id} 
                refreshTrigger={refreshDocs} 
              />
            </div>
          </div>
        )}
        {activeTab === 'summary' && (
          <div className="p-6">
            <div className="max-w-3xl">
              <h2 className="text-lg text-slate-900 mb-4">项目概览</h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <h3 className="text-sm text-slate-900 mb-2">核心目标</h3>
                  <p className="text-sm text-slate-600">
                    完成前端架构升级，提升应用性能与开发效率
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <h3 className="text-sm text-slate-900 mb-2">关键进展</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>React 18 迁移已完成 80%</li>
                    <li>状态管理方案确定为 Zustand</li>
                    <li>组件库重构进行中</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <h3 className="text-sm text-slate-900 mb-2">下一步行动</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>完成剩余页面迁移</li>
                    <li>性能测试与优化</li>
                    <li>文档更新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
