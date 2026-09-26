-- View counter per listing, incremented via RPC so concurrent updates are safe.
alter table public.listings
  add column if not exists views integer default 0;

create or replace function public.increment_listing_views(listing_id bigint)
returns void
language sql
as $$
  update public.listings set views = views + 1 where id = listing_id;
$$;

grant execute on function public.increment_listing_views(bigint) to anon;
