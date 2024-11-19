-- Create companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  address text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create trigger to update updated_at
create trigger update_companies_updated_at
  before update on public.companies
  for each row
  execute function public.update_updated_at_column();

-- Enable RLS
alter table public.companies enable row level security;

-- Create policies
create policy "Companies can view and update their own profile"
  on public.companies
  for all
  using (auth.jwt() ->> 'company_id' = id::text)
  with check (auth.jwt() ->> 'company_id' = id::text);

create policy "Admins have full access to all companies"
  on public.companies
  for all
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Public can view approved companies"
  on public.companies
  for select
  using (status = 'approved');
