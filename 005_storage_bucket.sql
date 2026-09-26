-- Public image bucket for listing photos, uploaded straight from the browser.
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read listing images" on storage.objects;
create policy "Public read listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

drop policy if exists "Public upload listing images" on storage.objects;
create policy "Public upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images');
