'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Plus, MoreVertical, Search, FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import CreateProjectDialog from './CreateProjectDialog';
import EditProjectDialog from './EditProjectDialog';
import { toast } from 'sonner';

import { useDataList } from '@/hooks/useDataList';

export default function ProjectList() {
  const { 
    data: projects, 
    loading, 
    refresh, 
    optimisticDelete,
    optimisticAdd 
  } = useDataList<Project>({
    fetcher: projectService.getAll,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  
  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleProjectCreated = (newProject: Project) => {
    optimisticAdd(newProject);
    setNewProjectId(newProject.id);
    refresh(true);
    
    // Optional: Clear highlight after 3 seconds
    setTimeout(() => {
        setNewProjectId(null);
    }, 3000);
  };
  
  // ... existing delete logic ...

  // Filter projects based on search query
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // ... existing loading check ...

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* ... search input ... */}
        <div className="relative flex-1 max-w-sm">
           {/* ... */} 
           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
           <Input 
             placeholder="搜索项目..." 
             className="pl-9 bg-white/80 border-white/60 focus:bg-white transition-all shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        <div className="flex-1" />
        <CreateProjectDialog onProjectCreated={handleProjectCreated}>
          <Button className="rounded-full px-6 shadow-lg shadow-teal-500/20">
             <Plus className="mr-2 h-4 w-4" />
             新建项目
          </Button>
        </CreateProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 bg-white/30 p-12 text-center backdrop-blur">
             {/* ... empty state ... */}
            <h3 className="mt-4 text-lg font-semibold text-slate-900">暂无项目</h3>
            <p className="mb-8 mt-2 text-sm text-slate-500">
            创建一个新项目开始管理您的知识库
            </p>
            <CreateProjectDialog onProjectCreated={handleProjectCreated}>
            <Button>
                 <Plus className="mr-2 h-4 w-4" />
                 创建第一个项目
            </Button>
            </CreateProjectDialog>
        </div>
      ) : filteredProjects.length === 0 ? (
        // ...
        <div className="text-center py-12 text-slate-500">
            没有找到匹配的项目
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.2)] backdrop-blur ${
                newProjectId === project.id 
                  ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50' 
                  : 'border-white/60'
              }`}
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 shadow-inner ring-1 ring-inset ring-teal-500/10 transition-colors group-hover:from-teal-100 group-hover:to-cyan-100">
                    <FolderOpen size={24} />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditClick(project, e)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={(e) => onDeleteClick(project, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {project.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {project.description || '暂无描述'}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span>
                  更新于{' '}
                  {formatDistanceToNow(new Date(project.last_updated), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                  {project.member_count} 成员
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {editingProject && (
        <EditProjectDialog 
            project={editingProject} 
            open={!!editingProject} 
            onOpenChange={(open) => !open && setEditingProject(null)}
            onProjectUpdated={() => refresh(true)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个项目吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除该项目以及所有相关上传的文档数据。
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
              {deleteLoading ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
