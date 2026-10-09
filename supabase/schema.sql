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


-- =====================================================================
-- v2: Avtomatik xəbər çəkmə (mənbələr + AI yenidən yazma)
-- Bu hissə təkrar işə salınsa da təhlükəsizdir (if not exists).
-- =====================================================================

alter table public.articles add column if not exists source_url  text;
alter table public.articles add column if not exists source_name text;
alter table public.articles add column if not exists imported    boolean not null default false;

create unique index if not exists articles_source_url_idx on public.articles (source_url) where source_url is not null;
create index if not exists articles_imported_idx on public.articles (imported);

-- Xəbərlərin çəkiləcəyi saytlar
create table if not exists public.sources (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  url           text not null,                    -- RSS linki və ya saytın ana/bölmə səhifəsi
  kind          text not null default 'rss',      -- 'rss' | 'html'
  category      text,                             -- boşdursa AI özü seçir
  active        boolean not null default true,    -- avtomatik çəkməyə daxildir
  auto_publish  boolean not null default false,   -- false = qaralama kimi saxla (tövsiyə)
  max_per_run   integer not null default 5,       -- bir çəkilişdə maksimum xəbər sayı
  last_run_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- Artıq işlənmiş linklər (silinmiş xəbər təkrar çəkilməsin deyə ayrıca saxlanılır)
create table if not exists public.import_log (
  url         text primary key,
  source_id   uuid references public.sources(id) on delete set null,
  status      text not null,                      -- 'done' | 'skipped' | 'failed'
  article_id  uuid,
  error       text,
  created_at  timestamptz not null default now()
);
create index if not exists import_log_created_idx on public.import_log (created_at desc);

alter table public.sources enable row level security;
alter table public.import_log enable row level security;


-- =====================================================================
-- v3: əlaqə mesajlarının e-poçt statusu
-- =====================================================================
alter table public.messages add column if not exists mail_status text;  -- 'sent' və ya xəta mətni
