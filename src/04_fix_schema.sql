-- 1. Create Tables (IF NOT EXISTS)
-- We need to ensure the base tables exist before we can optimize them.

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  last_updated TIMESTAMPTZ DEFAULT now() NOT NULL,
  member_count INT DEFAULT 1,
  user_id UUID NOT NULL
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploading',
  source TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL
);

-- 2. Enable RLS (Idempotent)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (Drop first to avoid conflicts if updating)
DROP POLICY IF EXISTS "Users can only see their own projects" ON projects;
CREATE POLICY "Users can only see their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only see their own documents" ON documents;
CREATE POLICY "Users can only see their own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

-- 4. Create Performance Indices (From previous step)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_last_updated ON projects(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);
