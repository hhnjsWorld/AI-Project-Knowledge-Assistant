"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Plus,
  MoreVertical,
  Search,
  FolderOpen,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateProjectDialog from "../../_components/projects/CreateProjectDialog";
import EditProjectDialog from "../../_components/projects/EditProjectDialog";
import { useProjectList } from "@/hooks/useProjectList";
import { useProjectToken } from "@/hooks/useProjectToken";

const safeDate = (date: any): Date => {
  if (!date) return new Date();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date() : d;
};

export default function ProjectListView() {
  const router = useRouter();
  const { getToken, loadingId } = useProjectToken();
  const {
    projects,
    filteredProjects,
    loading,
    searchQuery,
    setSearchQuery,
    executeSearch,
    editingProject,
    setEditingProject,
    newProjectId,
    handleProjectCreated,
    deleteDialogOpen,
    setDeleteDialogOpen,
    setProjectToDelete,
    deleteLoading,
    startEdit,
    startDelete,
    confirmDelete,
    refresh,
    isSearching,

    // Pagination
    page,
    setPage,
    limit,
    total,
    totalPages,
  } = useProjectList();

  const handleOpenProject = async (projectId: string) => {
    if (loadingId === projectId) {
      return;
    }
    const token = await getToken(projectId);
    if (!token) {
      return;
    }
    router.push(`/projects/${token}`);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    projectId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenProject(projectId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索项目..."
              className="pl-9 bg-white/80 border-white/60 focus:bg-white transition-all shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeSearch();
                }
              }}
            />
          </div>
          <Button onClick={executeSearch} variant="secondary">
            搜索
          </Button>
        </div>
        <div className="flex-1" />
      </div>

      <div className="relative min-h-[200px]">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          isSearching ? (
            <div className="text-center py-12 text-slate-500">
              没有找到匹配的项目
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 bg-white/30 p-12 text-center backdrop-blur">
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                暂无项目
              </h3>
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
          )
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenProject(project.id)}
                onKeyDown={(event) => handleCardKeyDown(event, project.id)}
                aria-disabled={loadingId === project.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.2)] backdrop-blur cursor-pointer ${
                  newProjectId === project.id
                    ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50"
                    : "border-white/60"
                }`}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 shadow-inner ring-1 ring-inset ring-teal-500/10 transition-colors group-hover:from-teal-100 group-hover:to-cyan-100">
                      <FolderOpen size={24} />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startEdit(project);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startDelete(project);
                          }}
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
                    {project.description || "暂无描述"}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span>
                    更新于{" "}
                    {formatDistanceToNow(
                      safeDate(project.updated_at || project.created_at),
                      {
                        addSuffix: true,
                        locale: zhCN,
                      }
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一页
          </Button>

          <span className="text-sm text-slate-500 mx-2">
            第 {page} / {totalPages} 页
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            下一页
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
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

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setProjectToDelete(null);
          }
        }}
      >
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
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {deleteLoading ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
