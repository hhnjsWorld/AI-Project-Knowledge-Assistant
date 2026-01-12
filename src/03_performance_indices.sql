-- 1. RLS Optimization Indices
-- Since RLS policies almost always check `user_id`, these are critical for performance.
-- Without these, every query allows a Sequential Scan instead of an Index Scan.
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- 2. Foreign Key Optimization
-- We frequently query "ALL documents WHERE project_id = X".
-- This index makes opening a project detail page instant.
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- 3. Sorting Optimization
-- Dashboard lists projects by `last_updated DESC`.
CREATE INDEX IF NOT EXISTS idx_projects_last_updated ON projects(last_updated DESC);

-- Document lists usually sort by `upload_date DESC`.
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);

-- 4. (Optional but recommended) Search Optimization
-- If you plan to move search to the backend (Supabase) later:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);
