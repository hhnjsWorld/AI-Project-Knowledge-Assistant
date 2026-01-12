import ProjectList from '@/components/projects/ProjectList';
import { Plus } from 'lucide-react';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">项目空间</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理您的所有知识库项目，查看 AI 处理进度。
          </p>
        </div>
        <CreateProjectDialog 
          trigger={
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[color:var(--brand-dark)]"
            >
              <Plus className="h-4 w-4" />
              新建项目
            </button>
          }
        />
      </div>

      <ProjectList />
    </div>
  );
}
