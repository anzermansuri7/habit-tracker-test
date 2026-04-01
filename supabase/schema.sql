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
