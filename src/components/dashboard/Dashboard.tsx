import { Clock, FolderOpen, MessageSquare, Search } from 'lucide-react';
import { Project, Conversation } from '../../types';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
}

const recentProjects: Project[] = [
  {
    id: '1',
    name: '电商平台重构',
    description: '前端架构升级与性能优化',
    lastUpdated: '2 小时前',
    memberCount: 8,
  },
  {
    id: '2',
    name: '移动端设计系统',
    description: '统一组件库与设计规范',
    lastUpdated: '昨天',
    memberCount: 5,
  },
  {
    id: '3',
    name: 'AI 对话功能',
    description: 'RAG 集成与上下文管理',
    lastUpdated: '3 天前',
    memberCount: 6,
  },
];

const recentConversations: Conversation[] = [
  {
    id: '1',
    projectId: '1',
    title: '关于性能优化的技术方案',
    lastMessage: '建议采用虚拟滚动和代码分割...',
    timestamp: '1 小时前',
  },
  {
    id: '2',
    projectId: '2',
    title: '设计 Token 配置说明',
    lastMessage: '颜色系统已更新到最新规范...',
    timestamp: '3 小时前',
  },
  {
    id: '3',
    projectId: '3',
    title: '向量数据库选型对比',
    lastMessage: '推荐使用 Pinecone 或 Weaviate...',
    timestamp: '昨天',
  },
];

export default function Dashboard({ onSelectProject }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Quick Question Box */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="快速提问：输入任何关于项目的问题..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-gray-900">
              <FolderOpen className="w-5 h-5" />
              最近访问的项目
            </h2>
          </div>
          
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.lastUpdated}
                      </span>
                      <span>{project.memberCount} 位成员</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-900" />
            <h2 className="text-gray-900">最近对话</h2>
          </div>
          
          <div className="space-y-3">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
              >
                <h4 className="text-sm text-gray-900 mb-1 line-clamp-1">
                  {conv.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {conv.lastMessage}
                </p>
                <span className="text-xs text-gray-400">{conv.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
