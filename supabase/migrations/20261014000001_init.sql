-- Create orders table idempotently
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null default auth.uid()
                        references auth.users(id) on delete cascade,
  title                 text not null check (char_length(title) between 1 and 120),
  cost_price            numeric(10,2) not null default 0 check (cost_price >= 0),
  sale_price            numeric(10,2) not null default 0 check (sale_price >= 0),
  filament_grams_total  numeric(8,1) check (filament_grams_total is null or filament_grams_total >= 0),
  -- [{ "hex": "#E53935", "name": "Vermelho", "grams": 12.5 }]  (name e grams opcionais)
  colors                jsonb not null default '[]'::jsonb
                        check (jsonb_typeof(colors) = 'array'),
  delivery_date         date not null,
  status                text not null default 'pendente'
                        check (status in ('pendente','imprimindo','pronto','entregue')),
  customer_name         text,
  customer_whatsapp     text check (customer_whatsapp is null or customer_whatsapp ~ '^[0-9]{10,15}$'),
  photo_paths           text[] not null default '{}' check (cardinality(photo_paths) <= 2),
  model_3mf_path        text,
  model_3mf_name        text,
  model_3mf_size        bigint,
  delivered_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists orders_user_status_delivery_idx
  on public.orders (user_id, status, delivery_date);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

drop policy if exists "owner full access" on public.orders;
create policy "owner full access" on public.orders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create push subscriptions table idempotently
create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "owner full access" on public.push_subscriptions;
create policy "owner full access" on public.push_subscriptions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
