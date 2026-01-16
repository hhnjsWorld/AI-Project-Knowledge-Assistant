import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">项目空间</h1>
          <p className="mt-1 text-sm text-slate-500">
            管理您的所有知识库项目，查看 AI 处理进度。
          </p>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand)]/50 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          新建项目
        </button>
      </div>

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
    </div>
  );
}
