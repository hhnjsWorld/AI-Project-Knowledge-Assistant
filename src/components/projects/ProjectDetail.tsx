import { useState } from 'react';
import { MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { Project } from '../../types';
import ChatInterface from '../chat/ChatInterface';

interface ProjectDetailProps {
  project: Project;
}

type TabType = 'chat' | 'documents' | 'summary';

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl text-gray-900 mb-1">{project.name}</h1>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            对话
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            知识库
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            项目摘要
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatInterface projectId={project.id} />}
        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              文档管理功能开发中...
            </div>
          </div>
        )}
        {activeTab === 'summary' && (
          <div className="p-6">
            <div className="max-w-3xl">
              <h2 className="text-lg text-gray-900 mb-4">项目概览</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm text-gray-900 mb-2">核心目标</h3>
                  <p className="text-sm text-gray-600">
                    完成前端架构升级，提升应用性能与开发效率
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm text-gray-900 mb-2">关键进展</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>React 18 迁移已完成 80%</li>
                    <li>状态管理方案确定为 Zustand</li>
                    <li>组件库重构进行中</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm text-gray-900 mb-2">下一步行动</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
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
