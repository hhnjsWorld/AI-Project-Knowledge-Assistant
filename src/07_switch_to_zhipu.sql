-- Fix Vector Dimension for Zhipu AI (GLM-4 / Embedding-2)
-- Zhipu's 'embedding-2' model produces 1024-dimensional vectors.
-- The previous script created a 1536-dimensional column (OpenAI standard).

-- 1. Drop the old table if it exists (Data loss acceptable as we are in dev phase)
DROP TABLE IF EXISTS public.document_embeddings;

-- 2. Recreate with correct dimension (1024)
create table if not exists public.document_embeddings (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  content text, 
  embedding vector(1024), -- CHANGED: 1536 -> 1024 for Zhipu embedding-2
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Re-apply RLS
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
