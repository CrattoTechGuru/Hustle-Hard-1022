-- "Mark as sold" + manually-boosted featured listings.
-- owner_token lets a seller prove they created a listing (no login system needed):
-- it's a random UUID generated client-side and stored in localStorage at post time.
create extension if not exists pgcrypto;

alter table public.listings
  add column if not exists is_sold boolean default false,
  add column if not exists is_featured boolean default false,
  add column if not exists owner_token uuid default gen_random_uuid();

create index if not exists listings_featured_idx on public.listings (is_featured);

-- Only the original poster (matching owner_token) can mark their own listing sold.
drop policy if exists "Allow owner to mark sold" on public.listings;
create policy "Allow owner to mark sold"
  on public.listings for update
  using (true)
  with check (true);
-- Note: Supabase's anon key can't compare against a client-supplied secret at the
-- RLS layer without a custom claim, so this stays "any anon can update" like the
-- rest of the table. Tighten this with Supabase Auth if you ever add real accounts.
