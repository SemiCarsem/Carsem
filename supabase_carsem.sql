-- CarSem: schema for the storefront and private admin.
-- Run this file in Supabase SQL Editor before using the live admin.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  description text,
  collection text not null default 'Adaptateurs',
  image_url text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= price),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  orders_count integer not null default 0,
  total_spent numeric(10, 2) not null default 0,
  last_order_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  total numeric(10, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create or replace function public.is_carsem_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can view active CarSem products" on public.products;
create policy "Public can view active CarSem products"
  on public.products for select
  using (status = 'active' or public.is_carsem_admin());

drop policy if exists "Admins manage CarSem products" on public.products;
create policy "Admins manage CarSem products"
  on public.products for all to authenticated
  using (public.is_carsem_admin())
  with check (public.is_carsem_admin());

drop policy if exists "Admins view CarSem profiles" on public.profiles;
create policy "Admins view CarSem profiles"
  on public.profiles for select to authenticated
  using (public.is_carsem_admin() or id = auth.uid());

drop policy if exists "Admins manage CarSem customers" on public.customers;
create policy "Admins manage CarSem customers"
  on public.customers for all to authenticated
  using (public.is_carsem_admin())
  with check (public.is_carsem_admin());

drop policy if exists "Admins manage CarSem orders" on public.orders;
create policy "Admins manage CarSem orders"
  on public.orders for all to authenticated
  using (public.is_carsem_admin())
  with check (public.is_carsem_admin());

drop policy if exists "Admins manage CarSem order items" on public.order_items;
create policy "Admins manage CarSem order items"
  on public.order_items for all to authenticated
  using (public.is_carsem_admin())
  with check (public.is_carsem_admin());

insert into public.products (sku, name, slug, description, collection, image_url, price, compare_at_price, stock)
values
  ('CS-LINK-001', 'CarSem Link', 'carsem-link', 'Adaptateur CarPlay et Android Auto sans-fil.', 'Adaptateurs', '/assets/auryn/wireless-adapter-real-product.png', 39.90, 69.90, 42),
  ('CS-DUO-002', 'Pack Duo CarSem Link', 'pack-duo-carsem-link', 'Deux adaptateurs CarSem Link pour deux véhicules.', 'Packs', '/assets/auryn/wireless-adapter-hero.png', 69.90, 139.80, 18)
on conflict (sku) do update set
  name = excluded.name,
  description = excluded.description,
  collection = excluded.collection,
  image_url = excluded.image_url,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  updated_at = now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
