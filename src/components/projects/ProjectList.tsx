import { Plus, Users, Clock } from 'lucide-react';
import { Project } from '../../types';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
}

const projects: Project[] = [
  {
    id: '1',
    name: '电商平台重构',
    description: '前端架构升级与性能优化项目，涉及 React 18 迁移、状态管理重构等',
    lastUpdated: '2 小时前',
    memberCount: 8,
  },
  {
    id: '2',
    name: '移动端设计系统',
    description: '统一组件库与设计规范，建立完整的 Design Token 体系',
    lastUpdated: '昨天',
    memberCount: 5,
  },
  {
    id: '3',
    name: 'AI 对话功能',
    description: 'RAG 集成与上下文管理，实现智能问答与文档检索',
    lastUpdated: '3 天前',
    memberCount: 6,
  },
  {
    id: '4',
    name: '数据分析平台',
    description: '实时数据可视化与报表系统',
    lastUpdated: '1 周前',
    memberCount: 4,
  },
  {
    id: '5',
    name: '用户增长实验',
    description: 'A/B 测试平台与增长指标追踪',
    lastUpdated: '2 周前',
    memberCount: 7,
  },
];

export default function ProjectList({ onSelectProject }: ProjectListProps) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">项目空间</h1>
          <p className="text-gray-500">管理团队的所有项目与知识库</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-gray-900 group-hover:text-gray-700">
                {project.name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {project.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {project.memberCount}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
