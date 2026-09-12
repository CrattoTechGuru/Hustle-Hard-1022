-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists public.listings (
    id bigserial primary key,
    created_at timestamp with time zone default now(),
    title text not null,
    description text not null,
    price numeric not null,
    category text not null, -- Electronics, Fashion, Food, Services, Jobs, Property, Vehicles, Beauty
    seller_name text not null,
    seller_whatsapp text not null, -- international digits only, e.g. 27720708648
    image_url text,
    is_dark_market boolean default false -- false = White Market, true = Dark Node
);

-- Row Level Security: public marketplace, so anyone can read and post listings.
alter table public.listings enable row level security;

create policy "Allow public read access"
  on public.listings for select
  using (true);

create policy "Allow public insert access"
  on public.listings for insert
  with check (true);

-- Optional: speeds up category + layer filtering used by the app
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_layer_idx on public.listings (is_dark_market);
