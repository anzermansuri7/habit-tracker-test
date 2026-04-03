create extension if not exists pgcrypto;

-- Core user profile table (app-level users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  age int check (age > 0),
  gender text,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  role text not null default 'regular' check (role in ('admin', 'regular')),
  selected_modules text[] not null default array['Habit Tracker','Diet and Fitness Tracker','Finance','Pregnancy','Learning & Career'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  target_value numeric(8,2),
  unit text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default false,
  value_numeric numeric(8,2),
  notes text,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  meal_type text not null check (meal_type in ('Breakfast', 'Lunch', 'Dinner', 'Snacks')),
  description text not null,
  calories int,
  log_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  workout_type text not null,
  duration_mins int,
  notes text,
  log_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  log_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source text not null,
  outstanding_amount numeric(12,2) not null,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.emis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  monthly_amount numeric(10,2) not null,
  debit_day int not null check (debit_day between 1 and 31),
  next_debit_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  skill_name text not null,
  hours numeric(4,2) not null,
  log_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.pregnancy_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_no int,
  weight_kg numeric(5,2),
  diet_notes text,
  medication text,
  reminder_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.meals enable row level security;
alter table public.workouts enable row level security;
alter table public.weight_logs enable row level security;
alter table public.categories enable row level security;
alter table public.expenses enable row level security;
alter table public.debts enable row level security;
alter table public.emis enable row level security;
alter table public.learning_logs enable row level security;
alter table public.pregnancy_logs enable row level security;

drop policy if exists "users own select" on public.users;
drop policy if exists "users own insert" on public.users;
drop policy if exists "users own update" on public.users;

create policy "users own select" on public.users for select using (auth.uid() = id or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "users own insert" on public.users for insert with check (auth.uid() = id);
create policy "users own update" on public.users for update using (auth.uid() = id or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Shared owner policies
create or replace function public.ensure_owner(_uid uuid)
returns boolean language sql stable as $$
  select auth.uid() = _uid or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin');
$$;

drop policy if exists "habits owner all" on public.habits;
drop policy if exists "habit_logs owner all" on public.habit_logs;
drop policy if exists "meals owner all" on public.meals;
drop policy if exists "workouts owner all" on public.workouts;
drop policy if exists "weight_logs owner all" on public.weight_logs;
drop policy if exists "categories owner all" on public.categories;
drop policy if exists "expenses owner all" on public.expenses;
drop policy if exists "debts owner all" on public.debts;
drop policy if exists "emis owner all" on public.emis;
drop policy if exists "learning owner all" on public.learning_logs;
drop policy if exists "pregnancy owner all" on public.pregnancy_logs;

create policy "habits owner all" on public.habits for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "habit_logs owner all" on public.habit_logs for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "meals owner all" on public.meals for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "workouts owner all" on public.workouts for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "weight_logs owner all" on public.weight_logs for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "categories owner all" on public.categories for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "expenses owner all" on public.expenses for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "debts owner all" on public.debts for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "emis owner all" on public.emis for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "learning owner all" on public.learning_logs for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
create policy "pregnancy owner all" on public.pregnancy_logs for all using (public.ensure_owner(user_id)) with check (public.ensure_owner(user_id));
-- Life Planning Tool schema
create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target text,
  created_at timestamptz default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  learning_hours numeric(5,2) default 0,
  namaz_count int default 0,
  workout_done boolean default false,
  workout_type text,
  diet_followed boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_type text not null,
  description text not null,
  calories int,
  created_at timestamptz default now()
);

create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  type text not null,
  duration_min int not null,
  intensity text,
  created_at timestamptz default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric(5,2) not null,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  amount numeric(12,2) not null,
  category text not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.debts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  total_amount numeric(12,2) not null,
  remaining_amount numeric(12,2) not null,
  interest_rate numeric(5,2),
  created_at timestamptz default now()
);

create table if not exists public.emis (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  due_day int not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.learning_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  skill text not null,
  hours numeric(5,2) default 0,
  created_at timestamptz default now()
);

create table if not exists public.pregnancy_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric(5,2),
  diet_note text,
  medication text,
  reminder text,
  created_at timestamptz default now()
);

alter publication supabase_realtime add table habit_logs, meals, workouts, weight_logs, expenses, debts, emis, learning_logs, pregnancy_logs;

-- Enable RLS and owner-only access policies
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(array['users','habits','habit_logs','meals','workouts','weight_logs','expenses','categories','debts','emis','learning_logs','pregnancy_logs'])
  LOOP
    EXECUTE format('alter table public.%I enable row level security', t);
    EXECUTE format('drop policy if exists "Users can manage own rows" on public.%I', t);
    EXECUTE format('create policy "Users can manage own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  END LOOP;
END $$;
