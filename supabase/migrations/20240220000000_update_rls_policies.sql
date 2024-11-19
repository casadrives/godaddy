-- Temporarily disable RLS for initial setup
alter table public.users disable row level security;

-- Drop existing policies to recreate them
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Admins can view all users" on public.users;
drop policy if exists "Companies can view their drivers" on public.users;
drop policy if exists "Allow public access for initial admin creation" on public.users;

-- Create comprehensive policies for users table
create policy "Users can view and update their own profile"
    on public.users
    for all
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Admins have full access to all users"
    on public.users
    for all
    using (
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
        or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    )
    with check (
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
        or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

create policy "Companies can view and manage their drivers"
    on public.users
    for all
    using (
        auth.jwt() -> 'user_metadata' ->> 'role' = 'company' 
        and company_id = (
            select id from public.companies 
            where id = auth.jwt() -> 'user_metadata' ->> 'company_id'
        )
    )
    with check (
        auth.jwt() -> 'user_metadata' ->> 'role' = 'company' 
        and company_id = (
            select id from public.companies 
            where id = auth.jwt() -> 'user_metadata' ->> 'company_id'
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

-- Re-enable RLS
alter table public.users enable row level security;
