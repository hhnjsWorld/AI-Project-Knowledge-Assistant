-- 1. Fix: Unindexed Foreign Keys
-- These improve join performance and filtering by these columns
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- 2. Fix: Auth RLS Initialization Plan
-- Wrap auth.uid() in (select auth.uid()) so it executes once per query instead of per row.

-- Drop existing policies to recreate them efficiently
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

-- Recreate Projects Policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING ((select auth.uid()) = user_id);

-- Recreate Documents Policies
CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  USING ((select auth.uid()) = user_id);
