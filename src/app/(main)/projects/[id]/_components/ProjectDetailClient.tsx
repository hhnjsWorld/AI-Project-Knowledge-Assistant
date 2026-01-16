'use client';

import { useState } from 'react';
import { MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import ChatInterface from './ChatInterface';
import FileUpload from './FileUpload';
import DocumentList from './DocumentList';

type TabType = 'chat' | 'documents' | 'summary';

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({
  projectId,
}: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [refreshDocs, setRefreshDocs] = useState(0);
  const { project, loading } = useProjectDetail(projectId);

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
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
        <p className="text-slate-500 max-w-2xl text-sm">
          {project.description || '暂无描述'}
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-white/60 bg-white/50 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/60 p-2 bg-white/40">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              对话
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              知识库
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'summary'
                  ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              项目摘要
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && <ChatInterface projectId={project.id} />}
          {activeTab === 'documents' && (
            <div className="absolute inset-0 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto space-y-6">
                <FileUpload
                  projectId={project.id}
                  onUploadComplete={() => setRefreshDocs((prev) => prev + 1)}
                />
                <DocumentList
                  projectId={project.id}
                  refreshTrigger={refreshDocs}
                />
              </div>
            </div>
          )}
          {activeTab === 'summary' && (
            <div className="absolute inset-0 overflow-y-auto p-6">
              <div className="max-w-4xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  项目概览
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">核心目标</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      完成前端架构升级，提升应用性能与开发效率，建立统一的组件规范。
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">关键进展</h3>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        React 18 迁移已完成 80%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        状态管理方案确定为 Zustand
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        组件库重构进行中
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">下一步行动</h3>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        完成剩余页面迁移
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        性能测试与优化
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        文档更新
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
