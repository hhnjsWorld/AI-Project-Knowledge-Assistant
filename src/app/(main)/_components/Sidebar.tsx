import { useCallback, useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import CreateProjectDialog from "./projects/CreateProjectDialog";
import { useRecentProjects } from "@/hooks/useRecentProjects";
import { useSignOut } from "@/hooks/useSignOut";
import { useProjectToken } from "@/hooks/useProjectToken";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectRow, projectService } from "@/services/projectService";

const navigation = [
  { name: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { name: "项目空间", href: "/projects", icon: FolderKanban },
  { name: "知识库", href: "/knowledge", icon: BookOpen },
  { name: "设置", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { projects: recentProjects, loading: recentLoading, fetchRecent } = useRecentProjects(5);
  const { signOut } = useSignOut();
  const { getToken } = useProjectToken();

  // Extract ID from path
  const currentProjectId = pathname.startsWith('/projects/') ? pathname.split('/projects/')[1]?.split('/')[0] : null;
  
  // Logic to check if current project is in recent list, if not we might want to fetch it?
  // Actually, we can just use useProjectDetail(currentProjectId) to get it if needed.
  // But useProjectDetail needs to be imported relative or absolute.
  // Let's assume we can fetch it. 
  
  const [currentProject, setCurrentProject] = useState<ProjectRow | null>(null);

  useEffect(() => {
    if (currentProjectId && !recentProjects.find(p => p.id === currentProjectId)) {
       // Fetch it 
       projectService.getById(currentProjectId).then(({data}) => {
         if(data) setCurrentProject(data);
       });
    } else {
       setCurrentProject(null);
    }
  }, [currentProjectId, recentProjects]);

  const displayProjects = currentProject 
      ? [currentProject, ...recentProjects.filter(p => p.id !== currentProject.id)].slice(0, 5) 
      : recentProjects;

  const loading = recentLoading;
  const projects = displayProjects;

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const [isNavigating, setIsNavigating] = useState(false);

  // Prevent rapid-fire clicking
  const handleOpenProject = async (projectId: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Lock navigation for 2 seconds
    setTimeout(() => {
      setIsNavigating(false);
    }, 2000);

    const token = await getToken(projectId);
    if (!token) {
      // If token fails, unlock immediately (or let timeout handle it? Better unlock)
      // Actually standard timeout is fine for "user penalty" style throttling requested.
      return;
    }
    router.push(`/projects/${token}`);
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
              onSuccess={fetchRecent}
            />
          </div>
          
          <div className="space-y-1">
            {loading ? (
              <div className="px-3 space-y-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-3 px-3 py-2">
                     <Skeleton className="w-2 h-2 rounded-full" />
                     <Skeleton className="h-4 w-24" />
                   </div>
                 ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400 italic">
                暂无项目
              </div>
            ) : (
              projects.map((project) => {
                const isActive = pathname.includes(`/projects/${project.id}`) || pathname.includes(project.id);
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleOpenProject(project.id)}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                      isActive 
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive 
                          ? "bg-[color:var(--brand)]" 
                          : "bg-slate-300 group-hover:bg-[color:var(--brand)]"
                      }`} 
                    />
                    <span className="truncate">{project.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </nav>
      {/* Dynamic current project injection logic handled above return if complex, but here we can just use a separate effect or efficient check. 
          Actually, let's implement the logic inside the component body first.
      */}

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
