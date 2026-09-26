-- Adds neighbourhood/area tagging + auto-expiry so listings don't go stale forever.
alter table public.listings
  add column if not exists area text,
  add column if not exists expires_at timestamp with time zone default (now() + interval '14 days');

create index if not exists listings_area_idx on public.listings (area);
create index if not exists listings_expires_idx on public.listings (expires_at);
