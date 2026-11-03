-- CreatorFlow AI cloud project schema
-- Run in the Supabase SQL editor for a new project.
-- This schema uses authenticated ownership and PostgreSQL Row Level Security.

create extension if not exists pgcrypto;

create table if not exists public.creator_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled project' check (char_length(title) <= 200),
  format text not null default 'Shorts' check (format in ('Shorts', 'Long-form')),
  project_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_projects_owner_updated_idx
  on public.creator_projects (owner_id, updated_at desc);

alter table public.creator_projects enable row level security;

drop policy if exists "Users can read their own projects" on public.creator_projects;
create policy "Users can read their own projects"
  on public.creator_projects for select
  to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create their own projects" on public.creator_projects;
create policy "Users can create their own projects"
  on public.creator_projects for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their own projects" on public.creator_projects;
create policy "Users can update their own projects"
  on public.creator_projects for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete their own projects" on public.creator_projects;
create policy "Users can delete their own projects"
  on public.creator_projects for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

-- Keep updated_at current on every update.
create or replace function public.set_creator_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists creator_projects_updated_at on public.creator_projects;
create trigger creator_projects_updated_at
  before update on public.creator_projects
  for each row execute function public.set_creator_project_updated_at();

-- Do not add a public SELECT policy. Project contents are private to their owner.
