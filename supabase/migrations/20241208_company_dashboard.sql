-- Create driver_locations table if it doesn't exist
create table if not exists public.driver_locations (
    id uuid primary key default uuid_generate_v4(),
    driver_id uuid references public.drivers(id) on delete cascade,
    latitude double precision not null,
    longitude double precision not null,
    heading double precision,
    speed double precision,
    accuracy double precision,
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint driver_locations_unique_driver unique (driver_id)
);

-- Create driver_shifts table if it doesn't exist
create table if not exists public.driver_shifts (
    id uuid primary key default uuid_generate_v4(),
    driver_id uuid references public.drivers(id) on delete cascade,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    total_earnings decimal(10,2),
    total_rides integer default 0,
    total_distance decimal(10,2) default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_analytics table if it doesn't exist
create table if not exists public.company_analytics (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid references public.companies(id) on delete cascade,
    date date not null,
    total_rides integer default 0,
    total_revenue decimal(10,2) default 0,
    total_distance decimal(10,2) default 0,
    active_drivers integer default 0,
    avg_rating decimal(3,2),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint company_analytics_unique_date unique (company_id, date)
);

-- Create indexes for better query performance
create index if not exists idx_driver_locations_last_updated on public.driver_locations(last_updated);
create index if not exists idx_driver_shifts_start_time on public.driver_shifts(start_time);
create index if not exists idx_driver_shifts_end_time on public.driver_shifts(end_time);
create index if not exists idx_company_analytics_date on public.company_analytics(date);

-- Create RLS policies
alter table public.driver_locations enable row level security;
alter table public.driver_shifts enable row level security;
alter table public.company_analytics enable row level security;

-- Policies for driver_locations
create policy "Drivers can update their own location"
    on public.driver_locations
    for all
    using (auth.uid() in (
        select user_id from public.drivers where id = driver_id
    ))
    with check (auth.uid() in (
        select user_id from public.drivers where id = driver_id
    ));

create policy "Companies can view their drivers' locations"
    on public.driver_locations
    for select
    using (exists (
        select 1 from public.drivers d
        join public.users u on u.id = d.user_id
        where d.id = driver_locations.driver_id
        and u.company_id = auth.uid()
    ));

-- Policies for driver_shifts
create policy "Drivers can view and update their own shifts"
    on public.driver_shifts
    for all
    using (auth.uid() in (
        select user_id from public.drivers where id = driver_id
    ))
    with check (auth.uid() in (
        select user_id from public.drivers where id = driver_id
    ));

create policy "Companies can view their drivers' shifts"
    on public.driver_shifts
    for select
    using (exists (
        select 1 from public.drivers d
        join public.users u on u.id = d.user_id
        where d.id = driver_shifts.driver_id
        and u.company_id = auth.uid()
    ));

-- Policies for company_analytics
create policy "Companies can view their own analytics"
    on public.company_analytics
    for select
    using (auth.uid()::uuid = company_id);

-- Function to update company analytics
create or replace function update_company_analytics()
returns trigger as $$
begin
    insert into public.company_analytics (
        company_id,
        date,
        total_rides,
        total_revenue,
        total_distance,
        active_drivers,
        avg_rating
    )
    select
        r.company_id,
        date_trunc('day', r.created_at)::date as date,
        count(distinct r.id) as total_rides,
        sum(r.fare_amount) as total_revenue,
        sum(r.distance) as total_distance,
        count(distinct r.driver_id) as active_drivers,
        avg(r.rating) as avg_rating
    from public.rides r
    where r.company_id = NEW.company_id
    and date_trunc('day', r.created_at) = date_trunc('day', NEW.created_at)
    group by r.company_id, date_trunc('day', r.created_at)::date
    on conflict (company_id, date)
    do update set
        total_rides = EXCLUDED.total_rides,
        total_revenue = EXCLUDED.total_revenue,
        total_distance = EXCLUDED.total_distance,
        active_drivers = EXCLUDED.active_drivers,
        avg_rating = EXCLUDED.avg_rating;
    
    return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to update analytics when a ride is completed
create trigger update_company_analytics_trigger
    after insert or update of status
    on public.rides
    for each row
    when (NEW.status = 'completed')
    execute function update_company_analytics();
