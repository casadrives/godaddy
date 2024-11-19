-- Reset everything first
drop policy if exists "Users can view their own profile" on users;
drop policy if exists "Admins can view all users" on users;
drop policy if exists "Companies can view their drivers" on users;
drop policy if exists "Users can view and update their own profile" on users;
drop policy if exists "Companies can view and manage their drivers" on users;
drop policy if exists "Allow public access for initial admin creation" on users;
drop policy if exists "Companies can view and update their own profile" on companies;
drop policy if exists "Admins have full access to all companies" on companies;
drop policy if exists "Public can view approved companies" on companies;

drop trigger if exists update_users_updated_at on users;
drop trigger if exists update_companies_updated_at on companies;
drop function if exists update_updated_at_column();

drop table if exists public.users cascade;
drop table if exists public.companies cascade;

-- Create companies table
create table public.companies (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    phone text,
    address text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create users table
create table public.users (
    id uuid primary key references auth.users on delete cascade,
    email text unique not null,
    name text not null,
    role text not null check (role in ('admin', 'company', 'driver')),
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    email_verified boolean not null default false,
    company_id uuid references public.companies(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
    before update on public.users
    for each row
    execute function update_updated_at_column();

create trigger update_companies_updated_at
    before update on public.companies
    for each row
    execute function update_updated_at_column();

-- Temporarily disable RLS
alter table public.users disable row level security;
alter table public.companies disable row level security;

-- Insert admin user into users table
insert into public.users (id, email, name, role, status, email_verified)
values (
    '1ee3f0b9-55e5-4756-bdb2-67a432019146',  -- This is the admin user ID from auth
    'admin@casadrives.com',
    'System Admin',
    'admin',
    'approved',
    true
);

-- Create basic policies (we'll enable these later)
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
        and company_id = (auth.jwt() ->> 'company_id')::uuid
    )
    with check (
        auth.jwt() ->> 'role' = 'company' 
        and company_id = (auth.jwt() ->> 'company_id')::uuid
    );

create policy "Companies can view and update their own profile"
    on public.companies
    for all
    using (id::text = auth.jwt() ->> 'company_id')
    with check (id::text = auth.jwt() ->> 'company_id');

create policy "Admins have full access to all companies"
    on public.companies
    for all
    using (auth.jwt() ->> 'role' = 'admin')
    with check (auth.jwt() ->> 'role' = 'admin');

create policy "Public can view approved companies"
    on public.companies
    for select
    using (status = 'approved');
