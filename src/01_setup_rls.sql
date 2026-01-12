-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "Users can only see their own projects"
ON projects
FOR ALL
USING (auth.uid() = user_id);

-- Policy: Users can only see their own documents
CREATE POLICY "Users can only see their own documents"
ON documents
FOR ALL
USING (auth.uid() = user_id);
