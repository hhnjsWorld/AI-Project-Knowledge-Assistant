"use client";

import { Clock, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProjectToken } from "@/hooks/useProjectToken";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

const safeDate = (date: any): Date => {
  if (!date) return new Date();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date() : d;
};

export default function DashboardPage() {
  const router = useRouter();
  const { recentProjects, recentConversations, loading } = useDashboardData();
  const { getToken } = useProjectToken();

  const handleOpenProject = async (projectId: string) => {
    const token = await getToken(projectId);
    if (!token) {
      return;
    }
    router.push(`/projects/${token}`);
  };

  return (
    <div className="flex flex-col gap-8 px-8 py-8 w-full max-w-[1200px]">
      <div className="w-full">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#667085]" />
          </div>
          <input
            type="text"
            placeholder="快速提问：输入任何关于项目的问题..."
            className="block w-full rounded-lg border border-[#d0d5dd] bg-white py-2.5 pl-10 pr-10 text-slate-900 placeholder:text-[#667085] focus:ring-2 focus:ring-[#0f766e] focus:border-transparent shadow-sm sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="border border-[#eaecf0] rounded px-1.5 py-0.5 text-xs text-[#667085] bg-gray-50">
              /
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#101828]">
              最近访问的项目33
            </h2>
            <Link
              href="/projects"
              className="text-sm font-semibold text-[#6941c6] hover:text-[#53389e]"
            >
              查看全部
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-4 p-5 bg-white border border-[#eaecf0] rounded-xl shadow-sm animate-pulse">
                    <div className="flex flex-col gap-1">
                      <div className="h-6 w-3/4 bg-slate-200 rounded" />
                      <div className="h-4 w-full bg-slate-100 rounded mt-2" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded mt-1" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#eaecf0] w-full">
                      <div className="h-6 w-6 rounded-full bg-slate-200" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </>
            ) : recentProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-xl border border-dashed border-[#eaecf0] bg-gray-50 text-[#667085]">
                暂无项目，去{" "}
                <Link
                  href="/projects"
                  className="text-[#0f766e] font-medium hover:underline"
                >
                  创建
                </Link>{" "}
                一个吧
              </div>
            ) : (
              recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className="flex flex-col gap-4 p-5 bg-white border border-[#eaecf0] rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-[#101828] line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[#475467] line-clamp-2 min-h-[40px]">
                      {project.description || "新创建的项目"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#eaecf0] w-full">
                    <div className="flex -space-x-2 overflow-hidden">
                      <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        {project.member_count || 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#475467]">
                      <Clock className="w-3.5 h-3.5" />
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
                </button>
              ))
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#101828]">最近对话</h2>

          <div className="flex flex-col gap-3">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex flex-col gap-2 p-4 bg-white border border-[#eaecf0] rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#344054] line-clamp-1">
                    {conv.title}
                  </h4>
                  <span className="text-xs text-[#475467] whitespace-nowrap">
                    {conv.timestamp}
                  </span>
                </div>
                <p className="text-sm text-[#475467] line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>
            ))}
            <div className="text-center py-4 text-xs text-[#98a2b3]">
              对话记录功能开发中...
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
