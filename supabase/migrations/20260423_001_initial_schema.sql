create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'manager', 'employee');
create type public.plan_status as enum ('draft', 'published', 'archived');
create type public.assignment_source as enum ('manual', 'auto');
create type public.day_part as enum ('morning', 'midday', 'evening');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Europe/Berlin',
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.user_role not null default 'employee',
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  full_name text not null,
  weekly_hours integer not null default 40 check (weekly_hours between 1 and 60),
  is_core_team boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  day_part public.day_part not null,
  starts_at time not null,
  ends_at time not null,
  required_headcount integer not null default 1 check (required_headcount > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  week_start date not null,
  status public.plan_status not null default 'draft',
  notes text,
  created_by uuid not null references public.users (id),
  created_at timestamptz not null default now(),
  unique (organization_id, week_start)
);

create table if not exists public.plan_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  weekly_plan_id uuid not null references public.weekly_plans (id) on delete cascade,
  staff_id uuid not null references public.staff (id) on delete cascade,
  shift_id uuid not null references public.shifts (id) on delete cascade,
  assignment_date date not null,
  source public.assignment_source not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.vacation_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  staff_id uuid not null references public.staff (id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  note text,
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create table if not exists public.sick_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  staff_id uuid not null references public.staff (id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  note text,
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create table if not exists public.holidays (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  holiday_date date not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, holiday_date, name)
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid not null references public.users (id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_org on public.users (organization_id);
create index if not exists idx_staff_org on public.staff (organization_id, is_active);
create index if not exists idx_shifts_org on public.shifts (organization_id);
create index if not exists idx_weekly_plans_org_week on public.weekly_plans (organization_id, week_start);
create index if not exists idx_assignments_org_date on public.plan_assignments (organization_id, assignment_date);
create index if not exists idx_vacation_org_range on public.vacation_blocks (organization_id, starts_on, ends_on);
create index if not exists idx_sick_org_range on public.sick_blocks (organization_id, starts_on, ends_on);
create index if not exists idx_holidays_org_date on public.holidays (organization_id, holiday_date);
create index if not exists idx_settings_org_key on public.settings (organization_id, key);
create index if not exists idx_audit_org_created on public.audit_logs (organization_id, created_at desc);

create or replace function public.get_my_role()
returns public.user_role
language sql
stable
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.get_my_organization_id()
returns uuid
language sql
stable
as $$
  select organization_id from public.users where id = auth.uid();
$$;

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.staff enable row level security;
alter table public.shifts enable row level security;
alter table public.weekly_plans enable row level security;
alter table public.plan_assignments enable row level security;
alter table public.vacation_blocks enable row level security;
alter table public.sick_blocks enable row level security;
alter table public.holidays enable row level security;
alter table public.settings enable row level security;
alter table public.audit_logs enable row level security;

create policy "users can read own org users"
  on public.users for select
  using (organization_id = public.get_my_organization_id());

create policy "users can update own row"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "staff read own org"
  on public.staff for select
  using (organization_id = public.get_my_organization_id());

create policy "staff modify admin manager"
  on public.staff for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "shifts read own org"
  on public.shifts for select
  using (organization_id = public.get_my_organization_id());

create policy "shifts modify admin manager"
  on public.shifts for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "plans read own org"
  on public.weekly_plans for select
  using (organization_id = public.get_my_organization_id());

create policy "plans modify admin manager"
  on public.weekly_plans for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "assignments read own org"
  on public.plan_assignments for select
  using (organization_id = public.get_my_organization_id());

create policy "assignments modify admin manager"
  on public.plan_assignments for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "vacation read own org"
  on public.vacation_blocks for select
  using (organization_id = public.get_my_organization_id());

create policy "vacation modify admin manager"
  on public.vacation_blocks for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "sick read own org"
  on public.sick_blocks for select
  using (organization_id = public.get_my_organization_id());

create policy "sick modify admin manager"
  on public.sick_blocks for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "holidays read own org"
  on public.holidays for select
  using (organization_id = public.get_my_organization_id());

create policy "holidays modify admin manager"
  on public.holidays for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "settings read own org"
  on public.settings for select
  using (organization_id = public.get_my_organization_id());

create policy "settings modify admin manager"
  on public.settings for all
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  )
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "audit read admin manager"
  on public.audit_logs for select
  using (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );

create policy "audit insert app"
  on public.audit_logs for insert
  with check (
    organization_id = public.get_my_organization_id()
    and public.get_my_role() in ('admin', 'manager')
  );
