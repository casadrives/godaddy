-- Create users table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('admin', 'company', 'driver')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  email_verified boolean not null default false,
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create trigger to update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function public.update_updated_at_column();

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Users can view and update their own profile"
  on public.users
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins have full access to all users"
  on public.users
  for all
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Companies can view and manage their drivers"
  on public.users
  for all
  using (
    auth.jwt() ->> 'role' = 'company' 
    and company_id = (
      select id from public.companies 
      where id = auth.jwt() ->> 'company_id'
    )
  )
  with check (
    auth.jwt() ->> 'role' = 'company' 
    and company_id = (
      select id from public.companies 
      where id = auth.jwt() ->> 'company_id'
    )
  );

-- Allow public access for initial admin creation
create policy "Allow public access for initial admin creation"
  on public.users
  for insert
  to public
  with check (
    role = 'admin' 
    and not exists (
      select 1 from public.users where role = 'admin'
    )
  );
