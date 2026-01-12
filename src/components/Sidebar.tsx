"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { projectService, ProjectRow } from "@/services/projectService";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";

const navigation = [
  { name: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { name: "项目空间", href: "/projects", icon: FolderKanban },
  { name: "知识库", href: "/knowledge", icon: BookOpen },
  { name: "设置", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await projectService.getAll();
        if (data) {
          setProjects(data.slice(0, 5)); // Limit to 5 recent projects
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="relative w-64 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col flex-shrink-0 h-full z-20">
      <div className="flex flex-col gap-1 items-start px-6 pt-6 pb-0 w-full">
        <div className="h-6 w-full relative">
          <h1 className="font-bold text-[#101828] text-base leading-6">
            KnowledgeHub
          </h1>
        </div>
        <div className="flex items-start w-full relative">
          <p className="text-[#6a7282] text-xs leading-4">
            AI Knowledge Assistant
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-[color:var(--brand)]"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-200">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between group">
            <span>最近项目</span>
            <CreateProjectDialog 
              trigger={
                <button 
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 outline-none"
                  title="新建项目"
                >
                  <Plus className="w-3 h-3" />
                </button>
              }
              onSuccess={() => {
                // Refresh list logic is handled by router.refresh, but we might want to reload sidebar list manually
                // For simplicity, we can reload window or rely on parent re-render.
                // Or better, we expose a refresh method. 
                // Since router.push changes page, sidebar might not re-mount.
                // We'll leave it as is, the navigation will happen.
              }}
            />
          </div>
          
          <div className="space-y-1">
            {loading ? (
              <div className="px-3 py-2 flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400 italic">
                暂无项目
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[color:var(--brand)] transition-colors" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-[#e5e7eb]">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
