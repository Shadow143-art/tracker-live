-- ============================================================
-- TRACKER APP — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  full_name text,
  role text check (role in ('student', 'staff')) default 'student',
  photo_url text,
  bio text,
  skills text[] default '{}',
  education text,
  department text,
  year text,
  is_profile_completed boolean default false
);

-- 2. CONNECTIONS TABLE
create table public.connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(requester_id, receiver_id)
);

-- 3. MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.messages enable row level security;

-- PROFILES
create policy "Public profiles are viewable by authenticated users."
  on profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile."
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update
  using (auth.uid() = id);

-- CONNECTIONS
create policy "Authenticated users can view connections."
  on connections for select
  to authenticated
  using (true);

create policy "Authenticated users can insert connection requests."
  on connections for insert
  to authenticated
  with check (auth.uid() = requester_id);

create policy "Receiver can update connection status."
  on connections for update
  using (auth.uid() = receiver_id);

-- MESSAGES
create policy "Users can view their own messages."
  on messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Authenticated users can send messages."
  on messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- ============================================================
-- TRIGGER: Auto-create profile row on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
