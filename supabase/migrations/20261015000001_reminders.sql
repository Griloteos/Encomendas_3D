-- Create reminders table
create table if not exists public.reminders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  description text,
  category    text not null default 'Geral' check (category in ('Geral', 'Financeiro', 'Cliente', 'Manutenção')),
  due_date    date,
  completed   boolean not null default false,
  order_id    uuid references public.orders(id) on delete set null,
  notify_at   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reminders_user_completed_date_idx
  on public.reminders (user_id, completed, due_date);

create trigger reminders_set_updated_at
  before update on public.reminders
  for each row execute function public.set_updated_at();

alter table public.reminders enable row level security;

drop policy if exists "owner full access" on public.reminders;
create policy "owner full access" on public.reminders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
