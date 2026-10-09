-- Cənub Xəbər — Supabase sxemi.
-- Supabase → SQL Editor → New query → bütün faylı yapışdırın → Run.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',
  category     text not null,
  image        text not null default '',
  author       text,
  featured     boolean not null default false,
  published    boolean not null default true,
  views        integer not null default 0,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles (published, published_at desc);
create index if not exists articles_category_idx  on public.articles (category);

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Baxış sayğacı (xəbər səhifəsi açılanda çağırılır)
create or replace function public.increment_views(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.articles set views = views + 1 where slug = p_slug and published = true;
$$;

-- Təhlükəsizlik: cədvəllərə birbaşa açıq giriş YOXDUR.
-- Sayt və admin panel yalnız serverdən, service_role açarı ilə oxuyur/yazır.
alter table public.articles enable row level security;
alter table public.messages enable row level security;
revoke all on function public.increment_views(text) from public, anon, authenticated;
