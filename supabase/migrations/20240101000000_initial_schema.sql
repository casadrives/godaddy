-- Enable the necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create custom types
DO $$ BEGIN
    create type user_role as enum ('user', 'driver', 'admin', 'company');
    create type user_status as enum ('pending', 'approved', 'rejected', 'suspended');
    create type driver_status as enum ('active', 'inactive', 'suspended');
    create type vehicle_status as enum ('active', 'maintenance', 'retired');
    create type ride_status as enum ('pending', 'accepted', 'in_progress', 'completed', 'canceled');
    create type payment_status as enum ('pending', 'paid', 'failed');
    create type subscription_status as enum ('active', 'past_due', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text unique not null,
    name text not null,
    role user_role default 'user'::user_role not null,
    avatar_url text,
    company_id uuid,
    status user_status default 'pending'::user_status not null,
    payment_due timestamp with time zone,
    last_payment_date timestamp with time zone,
    stripe_customer_id text,
    email_verified boolean default false not null,

    constraint users_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create companies table
create table if not exists public.companies (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text unique not null,
    phone text not null,
    registration_number text unique not null,
    taxi_license text unique not null,
    fleet_size integer not null check (fleet_size > 0),
    status user_status default 'pending'::user_status not null,
    stripe_subscription_id text,
    subscription_status subscription_status,

    constraint companies_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    constraint companies_phone_check check (phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Create vehicles table
create table if not exists public.vehicles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    company_id uuid not null references public.companies(id) on delete cascade,
    make text not null,
    model text not null,
    year integer not null check (year between 1900 and extract(year from current_date) + 1),
    color text not null,
    license_plate text unique not null,
    status vehicle_status default 'active'::vehicle_status not null,
    last_inspection timestamp with time zone not null,
    next_inspection timestamp with time zone not null,

    constraint vehicles_next_inspection_check check (next_inspection > last_inspection)
);

-- Create drivers table
create table if not exists public.drivers (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid not null references public.users(id) on delete cascade,
    company_id uuid not null references public.companies(id) on delete cascade,
    license_number text unique not null,
    license_expiry timestamp with time zone not null,
    vehicle_id uuid references public.vehicles(id),
    status driver_status default 'inactive'::driver_status not null,
    rating numeric(3,2) check (rating >= 0 and rating <= 5),
    total_rides integer default 0 not null check (total_rides >= 0),

    constraint drivers_license_expiry_check check (license_expiry > timezone('utc'::text, now()))
);

-- Create rides table
create table if not exists public.rides (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid not null references public.users(id) on delete restrict,
    driver_id uuid not null references public.drivers(id) on delete restrict,
    vehicle_id uuid not null references public.vehicles(id) on delete restrict,
    pickup_location jsonb not null,
    dropoff_location jsonb not null,
    status ride_status default 'pending'::ride_status not null,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    fare numeric(10,2),
    payment_status payment_status default 'pending'::payment_status not null,
    rating numeric(3,2) check (rating >= 0 and rating <= 5),
    review text,

    constraint rides_end_time_check check (end_time is null or end_time >= start_time),
    constraint rides_fare_check check (fare is null or fare >= 0)
);

-- Add foreign key constraint to users table after all tables are created
alter table public.users
    add constraint users_company_id_fkey
    foreign key (company_id) references public.companies(id) on delete set null;

-- Create indexes for better query performance
create index if not exists users_email_idx on public.users (email);
create index if not exists users_role_idx on public.users (role);
create index if not exists users_status_idx on public.users (status);
create index if not exists users_company_id_idx on public.users (company_id);

create index if not exists companies_email_idx on public.companies (email);
create index if not exists companies_status_idx on public.companies (status);

create index if not exists vehicles_company_id_idx on public.vehicles (company_id);
create index if not exists vehicles_status_idx on public.vehicles (status);

create index if not exists drivers_user_id_idx on public.drivers (user_id);
create index if not exists drivers_company_id_idx on public.drivers (company_id);
create index if not exists drivers_vehicle_id_idx on public.drivers (vehicle_id);
create index if not exists drivers_status_idx on public.drivers (status);

create index if not exists rides_user_id_idx on public.rides (user_id);
create index if not exists rides_driver_id_idx on public.rides (driver_id);
create index if not exists rides_vehicle_id_idx on public.rides (vehicle_id);
create index if not exists rides_status_idx on public.rides (status);
create index if not exists rides_payment_status_idx on public.rides (payment_status);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.rides enable row level security;

-- Create policies for Row Level Security

-- Users policies
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Admins can view all users"
    on public.users for select
    using (auth.jwt() ->> 'role' = 'admin');

create policy "Companies can view their drivers"
    on public.users for select
    using (
        auth.jwt() ->> 'role' = 'company' 
        and company_id = (
            select id from public.companies 
            where id = auth.jwt() ->> 'company_id'
        )
    );

-- Companies policies
create policy "Companies can view their own profile"
    on public.companies for select
    using (
        auth.jwt() ->> 'role' = 'company' 
        and id = auth.jwt() ->> 'company_id'
    );

create policy "Admins can view all companies"
    on public.companies for select
    using (auth.jwt() ->> 'role' = 'admin');

-- Vehicles policies
create policy "Companies can view their own vehicles"
    on public.vehicles for select
    using (
        auth.jwt() ->> 'role' = 'company' 
        and company_id = auth.jwt() ->> 'company_id'
    );

create policy "Drivers can view their assigned vehicle"
    on public.vehicles for select
    using (
        auth.jwt() ->> 'role' = 'driver' 
        and id in (
            select vehicle_id from public.drivers 
            where user_id = auth.uid()
        )
    );

create policy "Admins can view all vehicles"
    on public.vehicles for select
    using (auth.jwt() ->> 'role' = 'admin');

-- Drivers policies
create policy "Companies can view their own drivers"
    on public.drivers for select
    using (
        auth.jwt() ->> 'role' = 'company' 
        and company_id = auth.jwt() ->> 'company_id'
    );

create policy "Drivers can view their own profile"
    on public.drivers for select
    using (
        auth.jwt() ->> 'role' = 'driver' 
        and user_id = auth.uid()
    );

create policy "Admins can view all drivers"
    on public.drivers for select
    using (auth.jwt() ->> 'role' = 'admin');

-- Rides policies
create policy "Users can view their own rides"
    on public.rides for select
    using (
        auth.uid() = user_id
    );

create policy "Drivers can view their assigned rides"
    on public.rides for select
    using (
        auth.jwt() ->> 'role' = 'driver' 
        and driver_id in (
            select id from public.drivers 
            where user_id = auth.uid()
        )
    );

create policy "Companies can view their drivers' rides"
    on public.rides for select
    using (
        auth.jwt() ->> 'role' = 'company' 
        and driver_id in (
            select id from public.drivers 
            where company_id = auth.jwt() ->> 'company_id'
        )
    );

create policy "Admins can view all rides"
    on public.rides for select
    using (auth.jwt() ->> 'role' = 'admin');

-- Insert default admin user
insert into public.users (email, name, role, status, email_verified)
values ('admin@casadrives.lu', 'Super Admin', 'admin', 'approved', true)
on conflict (email) do nothing;
