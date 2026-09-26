-- Lets buyers flag a bad/fake/scam listing. You review these manually in the
-- Supabase table editor -- there's no admin UI in the app on purpose.
create table if not exists public.reports (
    id bigserial primary key,
    created_at timestamp with time zone default now(),
    listing_id bigint references public.listings(id) on delete cascade,
    reason text not null,
    details text
);

alter table public.reports enable row level security;

drop policy if exists "Allow public insert reports" on public.reports;
create policy "Allow public insert reports"
  on public.reports for insert
  with check (true);

-- Deliberately no public select policy: reports are write-only from the app,
-- readable only by you via the Supabase dashboard (service role / dashboard bypasses RLS).
