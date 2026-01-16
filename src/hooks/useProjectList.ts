import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Project } from "@/types";
import { projectService } from "@/services/projectService";

export function useProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [total, setTotal] = useState(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState(""); // Input value
  const [activeQuery, setActiveQuery] = useState(""); // Committed query for fetching

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Core Fetcher
  const fetchProjects = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      setError(null);
      try {
        const { data, error, count } = await projectService.getProjects(
          page,
          limit,
          activeQuery
        );
        if (error) throw error;

        setProjects((data as Project[]) || []);
        if (count !== null) setTotal(count);
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error("加载项目失败");
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [page, limit, activeQuery]
  );

  // Initial Load & Page Change & Active Query Change
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Listen for 'project-created' global event
  useEffect(() => {
    const handleProjectCreatedEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newProject = customEvent.detail as Project;

      if (page === 1 && !activeQuery) {
        // Optimistic Update: Prepend new project immediately
        if (newProject) {
            setProjects(prev => [newProject, ...prev]);
            setTotal(prev => prev + 1);
            setNewProjectId(newProject.id); // Highlight logic
            
            // Remove highlight after 3s
            setTimeout(() => {
                setNewProjectId(null);
            }, 3000);
        }
        
        // Silent refresh to ensure data consistency without Skeletons
        fetchProjects(true); 
      } else {
        // If searching or deep paging, just reset to first page
        setSearchQuery("");
        setActiveQuery("");
        setPage(1);
        // This will trigger fetchProjects via useEffect, which does setLoading(true)
        // We might want to optimize this too, but for now focus on the main "empty/page1" case.
      }
    };

    window.addEventListener("project-created", handleProjectCreatedEvent);
    return () => {
      window.removeEventListener("project-created", handleProjectCreatedEvent);
    };
  }, [page, activeQuery, fetchProjects]);

  // Manual Search Trigger
  const executeSearch = () => {
    setActiveQuery(searchQuery);
    setPage(1);
  };

  const handleProjectCreated = (newProject: Project) => {
    setNewProjectId(newProject.id);
    setSearchQuery("");
    setActiveQuery("");
    setPage(1);

    setTimeout(() => {
      setNewProjectId(null);
    }, 3000);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
  };

  const startDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setDeleteLoading(true);
    setDeleteDialogOpen(false);

    // Optimistic Delete
    setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));

    try {
      const { error } = await projectService.delete(projectToDelete.id);
      if (error) throw error;
      toast.success("项目已删除");
      fetchProjects(true);
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("删除失败，请重试");
      fetchProjects(true); // Revert optimistic update
    } finally {
      setDeleteLoading(false);
      setProjectToDelete(null);
    }
  };

  return {
    projects,
    filteredProjects: projects,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    executeSearch, // Export manual trigger
    editingProject,
    setEditingProject,
    newProjectId,
    handleProjectCreated,
    deleteDialogOpen,
    setDeleteDialogOpen,
    projectToDelete,
    setProjectToDelete,
    deleteLoading,
    startEdit,
    startDelete,
    confirmDelete,
    isSearching: !!activeQuery,
    refresh: () => fetchProjects(true),

    page,
    setPage,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
