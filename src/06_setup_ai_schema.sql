-- 1. Enable pgvector Extension
create extension if not exists vector
with schema public;

-- 2. Create Embeddings Table
-- Stores vector representations of document chunks for RAG
create table if not exists public.document_embeddings (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  content text, -- The actual text chunk
  embedding vector(1536), -- Standard dimensionality (OpenAI ada-002, etc. - adjust if using different model)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for performance (IVFFlat or HNSW - HNSW is better for varied workloads but slower build)
-- We'll start with no index or a basic one. For small datasets, exact search is fine. 
-- CREATE INDEX ON public.document_embeddings USING hnsw (embedding vector_cosine_ops);

-- RLS for Embeddings
-- Users can only access embeddings linked to documents they own
alter table public.document_embeddings enable row level security;

create policy "Users can view their own embeddings"
  on public.document_embeddings for select
  using (
    exists (
      select 1 from public.documents
      where documents.id = document_embeddings.document_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can insert their own embeddings"
  on public.document_embeddings for insert
  with check (
    exists (
      select 1 from public.documents
      where documents.id = document_embeddings.document_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can delete their own embeddings"
  on public.document_embeddings for delete
  using (
    exists (
      select 1 from public.documents
      where documents.id = document_embeddings.document_id
      and documents.user_id = auth.uid()
    )
  );


-- 3. Create User/Global Settings Table
-- Stores the configuration from /settings page (AI Model, Vector DB choice, Threshold)
create table if not exists public.user_settings (
  user_id uuid references auth.users(id) primary key,
  ai_model text default 'GPT-3.5 Turbo',
  vector_db text default 'pgvector',
  similarity_threshold float default 70, -- Store as 0-100 to match slider, or normalize to 0-1
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

-- 4. Initial Trigger for User Settings (Optional - creates default on user creation)
-- Skip for now, frontend can handle "upsert" logic.
