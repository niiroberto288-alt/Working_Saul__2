-- =============================================================================
-- ATTACHTRACK RWANDA - DATABASE SCHEMA
-- =============================================================================
-- Run this once, in the Supabase SQL editor (or `supabase db push`), on a new
-- project. It is ordered top to bottom and safe to re-run: every object is
-- created with IF NOT EXISTS or CREATE OR REPLACE.
--
-- What this file contains
--   01  Extensions and helper functions
--   02  Tables (with check constraints and foreign keys)
--   03  Indexes
--   04  Trigger functions (profile creation, lifecycle, audit, revisions,
--       notifications)
--   05  Row Level Security: every table, every policy, explained
--   06  Storage bucket and per-user folder policies
--   07  First administrator
--   08  Recommended Supabase Auth settings
--
-- Order matters: helper functions are created before the policies that call
-- them, and tables before the triggers that write to them.
--
-- After running this file the database is empty apart from the six reference
-- competencies. Demo rows come from supabase/seed.sql, which must never be run
-- against a database holding real student records.
-- =============================================================================


-- =============================================================================
-- 01  EXTENSIONS AND HELPER FUNCTIONS
-- =============================================================================

create extension if not exists pgcrypto;

-- The role of the caller, read from their own profile.
-- SECURITY DEFINER so that a policy on `profiles` can call it without
-- recursing into the `profiles` policies themselves. search_path is pinned.
create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid();
$$;

-- True when the caller is an administrator.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- Does the caller supervise this student?
-- SECURITY DEFINER keeps policy evaluation off the supervisor_students policies.
create or replace function public.current_supervises(p_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.supervisor_students ss
    where ss.supervisor_id = auth.uid()
      and ss.student_id = p_student
  );
$$;

-- The supervisor who owns a student's caseload, used when notifying.
create or replace function public.primary_supervisor(p_student uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ss.supervisor_id
  from public.supervisor_students ss
  where ss.student_id = p_student
  order by ss.created_at
  limit 1;
$$;

-- Is this published template assigned to the caller?
create or replace function public.current_has_template(p_template uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.logbook_assignments a
    where a.template_id = p_template
      and a.student_id = auth.uid()
      and a.status = 'active'
  );
$$;

-- Can the caller read this log? Answers "student, their supervisor, or admin".
create or replace function public.current_can_read_log(p_log uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.logs l
    where l.id = p_log
      and (
        l.student_id = auth.uid()
        or public.current_supervises(l.student_id)
        or public.is_admin()
      )
  );
$$;

-- Cast helper for storage paths, so a malformed folder name cannot raise.
create or replace function public.safe_uuid(p_value text)
returns uuid
language plpgsql
immutable
as $$
begin
  return p_value::uuid;
exception
  when others then
    return null;
end;
$$;

-- Keep updated_at honest. Defined once, attached to every table that has it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- =============================================================================
-- 02  TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user. Created by trigger, never by the client.
-- Role is 'student' or 'supervisor' at signup; 'admin' only by hand (section 07).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text not null default '' check (char_length(full_name) <= 120),
  role         text not null default 'student' check (role in ('student', 'supervisor', 'admin')),
  institution  text not null default '' check (char_length(institution) <= 160),
  company      text not null default '' check (char_length(company) <= 160),
  department   text not null default '' check (char_length(department) <= 120),
  phone        text not null default '' check (char_length(phone) <= 32),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is
  'Public face of an auth user. Never contains a password. Role changes are blocked by trigger guard_profile_update().';

-- ---------------------------------------------------------------------------
-- supervisor_students: the caseload. One row per supervision relationship.
-- ---------------------------------------------------------------------------
create table if not exists public.supervisor_students (
  id            uuid primary key default gen_random_uuid(),
  supervisor_id uuid not null references public.profiles (id) on delete cascade,
  student_id    uuid not null references public.profiles (id) on delete cascade,
  created_at    timestamptz not null default now(),
  constraint supervisor_students_unique unique (supervisor_id, student_id),
  constraint supervisor_students_not_self check (supervisor_id <> student_id)
);

-- ---------------------------------------------------------------------------
-- logbook_templates: supervisor-built forms. `fields` holds the field list.
-- Editing a published template bumps `version`; entries keep the version they
-- were written against (spec section 10).
-- ---------------------------------------------------------------------------
create table if not exists public.logbook_templates (
  id             uuid primary key default gen_random_uuid(),
  supervisor_id  uuid not null references public.profiles (id) on delete cascade,
  title          text not null check (char_length(title) between 1 and 140),
  description    text not null default '' check (char_length(description) <= 1000),
  frequency      text not null default 'weekly' check (frequency in ('daily', 'weekly')),
  start_date     date not null default current_date,
  end_date       date,
  required_hours numeric(6, 1) check (required_hours is null or (required_hours > 0 and required_hours <= 2000)),
  fields         jsonb not null default '[]'::jsonb check (jsonb_typeof(fields) = 'array'),
  version        integer not null default 1 check (version >= 1),
  status         text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint logbook_templates_dates check (end_date is null or end_date >= start_date)
);

-- ---------------------------------------------------------------------------
-- logbook_assignments: which student writes into which template.
-- ---------------------------------------------------------------------------
create table if not exists public.logbook_assignments (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.logbook_templates (id) on delete cascade,
  student_id    uuid not null references public.profiles (id) on delete cascade,
  supervisor_id uuid references public.profiles (id) on delete set null,
  status        text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  assigned_at   timestamptz not null default now(),
  constraint logbook_assignments_unique unique (template_id, student_id)
);

-- ---------------------------------------------------------------------------
-- logs: the entries themselves.
-- Lifecycle: Draft -> Pending -> Approved | Rejected -> (edit) Pending.
-- Approved rows are frozen by trigger, not merely hidden in the interface.
-- ---------------------------------------------------------------------------
create table if not exists public.logs (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid not null references public.profiles (id) on delete cascade,
  template_id           uuid references public.logbook_templates (id) on delete set null,
  template_version      integer not null default 1 check (template_version >= 1),
  entry_date            date not null default current_date check (entry_date <= current_date),
  hours_worked          numeric(4, 1) not null check (hours_worked > 0 and hours_worked <= 24),
  activity_description  text not null check (char_length(activity_description) between 1 and 4000),
  skills                text[] not null default '{}',
  answers               jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
  status                text not null default 'Draft' check (status in ('Draft', 'Pending', 'Approved', 'Rejected')),
  supervisor_comment    text check (supervisor_comment is null or char_length(supervisor_comment) <= 2000),
  reviewed_at           timestamptz,
  reviewed_by           uuid references public.profiles (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- A rejection without a comment is not a rejection, it is a shrug.
  constraint logs_rejection_needs_comment check (status <> 'Rejected' or (supervisor_comment is not null and char_length(btrim(supervisor_comment)) > 0))
);

comment on table public.logs is
  'Student entries. One row per (student, template, entry date) - see logs_unique_entry_per_day.';

-- ---------------------------------------------------------------------------
-- evidence: metadata for files in the private `evidence` bucket (F5).
-- The file itself lives in Storage; this row is what lets policies find it.
-- ---------------------------------------------------------------------------
create table if not exists public.evidence (
  id           uuid primary key default gen_random_uuid(),
  log_id       uuid not null references public.logs (id) on delete cascade,
  student_id   uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null unique,
  file_name    text not null check (char_length(file_name) <= 255),
  mime_type    text not null check (mime_type in ('application/pdf', 'image/png', 'image/jpeg')),
  size_bytes   bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  uploaded_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- comments: supervisor notes on an entry.
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  log_id     uuid not null references public.logs (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- notifications: written by triggers only (F6).
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  message    text not null check (char_length(message) <= 400),
  link       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- log_revisions: the previous version of an entry on every update (F8).
-- No foreign key on purpose: the history must outlive a deleted entry.
-- ---------------------------------------------------------------------------
create table if not exists public.log_revisions (
  id            bigserial primary key,
  log_id        uuid not null,
  changed_by    uuid,
  changed_at    timestamptz not null default now(),
  previous_row  jsonb not null
);

-- ---------------------------------------------------------------------------
-- audit_log: append-only record of changes (F8).
-- No update or delete policy exists; write access is revoked as well.
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id          bigserial primary key,
  actor_id    uuid,
  actor_role  text,
  action      text not null,
  table_name  text not null,
  record_id   text,
  previous    jsonb,
  current     jsonb,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Competencies and sign-offs (F9).
-- ---------------------------------------------------------------------------
create table if not exists public.competencies (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (char_length(code) <= 12),
  title       text not null check (char_length(title) <= 140),
  description text not null default '' check (char_length(description) <= 500),
  sort_order  integer not null default 0
);

create table if not exists public.competency_signoffs (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.profiles (id) on delete cascade,
  competency_id  uuid not null references public.competencies (id) on delete cascade,
  status         text not null default 'outstanding'
                 check (status in ('outstanding', 'developing', 'witnessed')),
  supervisor_id  uuid references public.profiles (id) on delete set null,
  note           text check (note is null or char_length(note) <= 600),
  signed_at      timestamptz not null default now(),
  constraint competency_signoffs_unique unique (student_id, competency_id)
);

create table if not exists public.term_signoffs (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null unique references public.profiles (id) on delete cascade,
  supervisor_id uuid references public.profiles (id) on delete set null,
  term_label   text not null default '' check (char_length(term_label) <= 120),
  final_hours  numeric(7, 1) check (final_hours is null or final_hours >= 0),
  note         text check (note is null or char_length(note) <= 1000),
  signed_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- review_requests: the free-first-review form on the landing page.
-- Insert-only for anonymous visitors; readable by administrators.
-- ---------------------------------------------------------------------------
create table if not exists public.review_requests (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null check (char_length(full_name) between 1 and 120),
  email        text not null check (char_length(email) <= 160 and position('@' in email) > 1),
  role         text not null default 'student' check (role in ('student', 'supervisor')),
  institution  text not null default '' check (char_length(institution) <= 160),
  note         text not null default '' check (char_length(note) <= 600),
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

-- The six competencies every Rwandan attachment is judged against.
insert into public.competencies (code, title, description, sort_order)
values
  ('C01', 'Professional conduct and punctuality', 'Arrives prepared, keeps agreed hours and communicates absences early.', 1),
  ('C02', 'Technical quality of work', 'Produces work that meets the standard of the host organisation.', 2),
  ('C03', 'Written communication', 'Writes notes, reports and reflections that another person can act on.', 3),
  ('C04', 'Collaboration', 'Works with the team, asks for help and offers it.', 4),
  ('C05', 'Reflection and learning', 'Can name what was learned and what to do differently next time.', 5),
  ('C06', 'Evidence and record keeping', 'Keeps artefacts, hours and approvals traceable.', 6)
on conflict (code) do nothing;


-- =============================================================================
-- 03  INDEXES  (FURPS+ P4)
-- =============================================================================

-- Lists are always filtered by student and ordered by date.
create index if not exists logs_student_date_idx on public.logs (student_id, entry_date desc);
-- The supervisor queue filters by status.
create index if not exists logs_status_idx on public.logs (status, entry_date desc);
-- Reports group by template.
create index if not exists logs_template_idx on public.logs (template_id);

create index if not exists supervisor_students_supervisor_idx on public.supervisor_students (supervisor_id);
create index if not exists supervisor_students_student_idx on public.supervisor_students (student_id);

create index if not exists notifications_user_read_idx on public.notifications (user_id, read, created_at desc);

create index if not exists logbook_assignments_student_idx on public.logbook_assignments (student_id);
create index if not exists logbook_assignments_template_idx on public.logbook_assignments (template_id);

create index if not exists comments_log_idx on public.comments (log_id);
create index if not exists evidence_log_idx on public.evidence (log_id);
create index if not exists log_revisions_log_idx on public.log_revisions (log_id, changed_at desc);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);
create index if not exists competency_signoffs_student_idx on public.competency_signoffs (student_id);

-- One entry per student, template and date (FURPS+ R3).
-- template_id is nullable (the default form), so coalesce gives the index a
-- stable value instead of letting NULLs slip past uniqueness.
create unique index if not exists logs_unique_entry_per_day
  on public.logs (
    student_id,
    coalesce(template_id, '00000000-0000-0000-0000-000000000000'::uuid),
    entry_date
  );


-- =============================================================================
-- 04  TRIGGER FUNCTIONS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 4.1  A profile for every new auth user.
-- Role is read from signup metadata but clamped to student/supervisor, so a
-- crafted request can never create an administrator (FURPS+ C4).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  if v_role not in ('student', 'supervisor') then
    v_role := 'student';
  end if;

  insert into public.profiles (id, full_name, role, institution, company, department, phone)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    v_role,
    left(coalesce(new.raw_user_meta_data ->> 'institution', ''), 160),
    left(coalesce(new.raw_user_meta_data ->> 'company', ''), 160),
    left(coalesce(new.raw_user_meta_data ->> 'department', ''), 120),
    left(coalesce(new.raw_user_meta_data ->> 'phone', ''), 32)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4.2  updated_at
-- ---------------------------------------------------------------------------
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists logbook_templates_set_updated_at on public.logbook_templates;
create trigger logbook_templates_set_updated_at
  before update on public.logbook_templates
  for each row execute function public.set_updated_at();

drop trigger if exists logs_set_updated_at on public.logs;
create trigger logs_set_updated_at
  before update on public.logs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4.3  A user cannot change their own role or id (FURPS+ C4).
-- Administrators may change anyone's role; that change is audited by 4.8.
-- ---------------------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id <> old.id then
    raise exception 'The profile id cannot be changed.' using errcode = '42501';
  end if;

  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only an administrator can change a role.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- 4.4  Entry lifecycle rules, enforced in the database (FURPS+ F4).
--   * Approved entries are frozen for everyone except an administrator.
--   * A student may only write Draft or Pending, only for themselves.
--   * A student may only edit Draft or Rejected rows.
--   * A supervisor may only move Pending to Approved or Rejected.
--   * A rejection must carry a comment (also a table constraint).
-- ---------------------------------------------------------------------------
create or replace function public.logs_guard_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text := public.current_role_name();
begin
  if tg_op = 'INSERT' then
    if new.student_id <> auth.uid() and not public.is_admin() then
      raise exception 'An entry can only be written for yourself.' using errcode = '42501';
    end if;

    -- Nobody except an administrator can create a row that is already
    -- approved: every entry must pass through review.
    if new.status not in ('Draft', 'Pending') and not public.is_admin() then
      raise exception 'An entry must start as a draft or be submitted for review.' using errcode = '42501';
    end if;

    -- A student never writes review metadata.
    if not public.is_admin() then
      new.supervisor_comment := null;
      new.reviewed_at := null;
      new.reviewed_by := null;
    end if;

    if new.entry_date > current_date then
      raise exception 'An entry cannot be dated in the future.' using errcode = '23514';
    end if;

    return new;
  end if;

  -- UPDATE -----------------------------------------------------------------
  if old.status = 'Approved' and not public.is_admin() then
    raise exception 'Approved entries are locked.' using errcode = '42501';
  end if;

  if v_role = 'student' then
    if old.student_id <> auth.uid() then
      raise exception 'You can only edit your own entries.' using errcode = '42501';
    end if;

    if old.status not in ('Draft', 'Rejected') then
      raise exception 'Only drafts and returned entries can be edited.' using errcode = '42501';
    end if;

    -- The owner of an entry cannot move it to another student.
    new.student_id := old.student_id;

    if new.status not in ('Draft', 'Pending') then
      raise exception 'A student may only save a draft or resubmit for review.' using errcode = '42501';
    end if;

    -- A student never sets the review outcome.
    new.supervisor_comment := old.supervisor_comment;
    new.reviewed_at := old.reviewed_at;
    new.reviewed_by := old.reviewed_by;
  elsif v_role = 'supervisor' then
    if not public.current_supervises(old.student_id) then
      raise exception 'That student is not on your caseload.' using errcode = '42501';
    end if;

    if new.status in ('Approved', 'Rejected') and old.status <> 'Pending' then
      raise exception 'Only a submitted entry can be approved or returned.' using errcode = '23514';
    end if;

    -- A supervisor judges the entry; they do not rewrite the student's account
    -- of the week. Only the review fields may change.
    new.student_id := old.student_id;
    new.template_id := old.template_id;
    new.template_version := old.template_version;
    new.entry_date := old.entry_date;
    new.hours_worked := old.hours_worked;
    new.activity_description := old.activity_description;
    new.skills := old.skills;
    new.answers := old.answers;

    if new.status = 'Rejected' and length(btrim(coalesce(new.supervisor_comment, ''))) = 0 then
      raise exception 'A rejection needs a comment for the student.' using errcode = '23514';
    end if;

    if new.status in ('Approved', 'Rejected') then
      new.reviewed_at := now();
      new.reviewed_by := auth.uid();
    end if;
  elsif not public.is_admin() then
    raise exception 'You are not allowed to edit this entry.' using errcode = '42501';
  end if;

  if new.entry_date > current_date then
    raise exception 'An entry cannot be dated in the future.' using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists logs_guard_write on public.logs;
create trigger logs_guard_write
  before insert or update on public.logs
  for each row execute function public.logs_guard_write();

-- ---------------------------------------------------------------------------
-- 4.5  Every update keeps the previous row (FURPS+ F8).
-- ---------------------------------------------------------------------------
create or replace function public.logs_capture_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.log_revisions (log_id, changed_by, previous_row)
  values (old.id, auth.uid(), to_jsonb(old));
  return new;
end;
$$;

drop trigger if exists logs_capture_revision on public.logs;
create trigger logs_capture_revision
  before update on public.logs
  for each row execute function public.logs_capture_revision();

-- ---------------------------------------------------------------------------
-- 4.6  Audit triggers (FURPS+ F8). Append-only by construction.
-- ---------------------------------------------------------------------------
create or replace function public.write_audit(
  p_action text,
  p_table text,
  p_record text,
  p_previous jsonb,
  p_current jsonb
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_log (actor_id, actor_role, action, table_name, record_id, previous, current)
  values (auth.uid(), public.current_role_name(), p_action, p_table, p_record, p_previous, p_current);
$$;

create or replace function public.logs_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit('insert', 'logs', new.id::text, null, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    perform public.write_audit('update', 'logs', new.id::text, to_jsonb(old), to_jsonb(new));
    return new;
  else
    perform public.write_audit('delete', 'logs', old.id::text, to_jsonb(old), null);
    return old;
  end if;
end;
$$;

drop trigger if exists logs_audit on public.logs;
create trigger logs_audit
  after insert or update or delete on public.logs
  for each row execute function public.logs_audit();

create or replace function public.profiles_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.role <> old.role then
    perform public.write_audit('role_change', 'profiles', new.id::text, to_jsonb(old), to_jsonb(new));
  else
    perform public.write_audit(
      lower(tg_op), 'profiles', new.id::text,
      case when tg_op = 'INSERT' then null else to_jsonb(old) end,
      to_jsonb(new)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_audit on public.profiles;
create trigger profiles_audit
  after insert or update on public.profiles
  for each row execute function public.profiles_audit();

create or replace function public.caseload_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit('assign_student', 'supervisor_students', new.id::text, null, to_jsonb(new));
    return new;
  else
    perform public.write_audit('remove_student', 'supervisor_students', old.id::text, to_jsonb(old), null);
    return old;
  end if;
end;
$$;

drop trigger if exists caseload_audit on public.supervisor_students;
create trigger caseload_audit
  after insert or delete on public.supervisor_students
  for each row execute function public.caseload_audit();

create or replace function public.assignments_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.write_audit('assign_logbook', 'logbook_assignments', new.id::text, null, to_jsonb(new));
  return new;
end;
$$;

drop trigger if exists assignments_audit on public.logbook_assignments;
create trigger assignments_audit
  after insert on public.logbook_assignments
  for each row execute function public.assignments_audit();

-- Refuse any attempt to rewrite or erase the audit trail, even from SQL.
create or replace function public.audit_is_append_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'The audit log is append-only.' using errcode = '42501';
end;
$$;

drop trigger if exists audit_log_no_update on public.audit_log;
create trigger audit_log_no_update
  before update or delete on public.audit_log
  for each row execute function public.audit_is_append_only();

-- ---------------------------------------------------------------------------
-- 4.7  Notifications (FURPS+ F6).
-- ---------------------------------------------------------------------------
create or replace function public.notify_user(p_user uuid, p_message text, p_link text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, message, link)
  select p_user, left(p_message, 400), p_link
  where p_user is not null;
$$;

create or replace function public.logs_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student_name text;
  v_supervisor uuid;
begin
  if tg_op = 'INSERT' then
    if new.status = 'Pending' then
      select full_name into v_student_name from public.profiles where id = new.student_id;
      perform public.notify_user(
        public.primary_supervisor(new.student_id),
        coalesce(v_student_name, 'A student') || ' submitted an entry for review.',
        '/supervisor/logs'
      );
    end if;
    return new;
  end if;

  if new.status = old.status then
    return new;
  end if;

  if new.status = 'Pending' then
    select full_name into v_student_name from public.profiles where id = new.student_id;
    perform public.notify_user(
      public.primary_supervisor(new.student_id),
      coalesce(v_student_name, 'A student') || ' resubmitted an entry for review.',
      '/supervisor/logs'
    );
  elsif new.status = 'Approved' then
    perform public.notify_user(
      new.student_id,
      'Your entry for ' || to_char(new.entry_date, 'DD Mon') || ' was approved.',
      '/student/logs'
    );
  elsif new.status = 'Rejected' then
    perform public.notify_user(
      new.student_id,
      'Your entry for ' || to_char(new.entry_date, 'DD Mon') || ' needs a revision before it can be signed.',
      '/student/logs'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists logs_notify on public.logs;
create trigger logs_notify
  after insert or update on public.logs
  for each row execute function public.logs_notify();

create or replace function public.comments_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student uuid;
  v_author text;
begin
  select l.student_id, p.full_name
    into v_student, v_author
  from public.logs l
  join public.profiles p on p.id = new.author_id
  where l.id = new.log_id;

  if v_student is not null and v_student <> new.author_id then
    perform public.notify_user(
      v_student,
      coalesce(v_author, 'Your supervisor') || ' left a comment on your entry.',
      '/student/logs'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists comments_notify on public.comments;
create trigger comments_notify
  after insert on public.comments
  for each row execute function public.comments_notify();

create or replace function public.assignments_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_title text;
begin
  select title into v_title from public.logbook_templates where id = new.template_id;

  perform public.notify_user(
    new.student_id,
    'A logbook was assigned to you: ' || coalesce(v_title, 'a new logbook') || '.',
    '/student/logbook'
  );

  return new;
end;
$$;

drop trigger if exists assignments_notify on public.logbook_assignments;
create trigger assignments_notify
  after insert on public.logbook_assignments
  for each row execute function public.assignments_notify();

-- ---------------------------------------------------------------------------
-- 4.8  Versioning: editing a published template bumps the version (section 10).
-- ---------------------------------------------------------------------------
create or replace function public.templates_bump_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'published' and new.status = 'published' then
    new.version := old.version + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists templates_bump_version on public.logbook_templates;
create trigger templates_bump_version
  before update on public.logbook_templates
  for each row execute function public.templates_bump_version();


-- =============================================================================
-- 05  ROW LEVEL SECURITY
-- =============================================================================
-- Every table is locked down, then opened deliberately. Each policy below has a
-- one-line explanation. `anon` can only insert a review request and read the
-- competency list.

alter table public.profiles              enable row level security;
alter table public.supervisor_students   enable row level security;
alter table public.logbook_templates     enable row level security;
alter table public.logbook_assignments   enable row level security;
alter table public.logs                  enable row level security;
alter table public.evidence              enable row level security;
alter table public.comments              enable row level security;
alter table public.notifications         enable row level security;
alter table public.log_revisions         enable row level security;
alter table public.audit_log             enable row level security;
alter table public.competencies          enable row level security;
alter table public.competency_signoffs   enable row level security;
alter table public.term_signoffs         enable row level security;
alter table public.review_requests       enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
drop policy if exists "profiles: read own, supervised or all for admins" on public.profiles;
create policy "profiles: read own, supervised or all for admins"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()                       -- your own profile
    or public.is_admin()                  -- the programme office reads everything
    or public.current_supervises(id)      -- a supervisor reads their caseload
  );

drop policy if exists "profiles: update own or any as admin" on public.profiles;
create policy "profiles: update own or any as admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- The role/id guard is the trigger in 4.3; this policy only decides the row.

drop policy if exists "profiles: admins delete" on public.profiles;
create policy "profiles: admins delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- supervisor_students (the caseload)
-- ---------------------------------------------------------------------------
drop policy if exists "caseload: read own rows, own students, or all as admin" on public.supervisor_students;
create policy "caseload: read own rows, own students, or all as admin"
  on public.supervisor_students for select
  to authenticated
  using (
    supervisor_id = auth.uid()
    or student_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "caseload: supervisor adds own students, admin adds anyone" on public.supervisor_students;
create policy "caseload: supervisor adds own students, admin adds anyone"
  on public.supervisor_students for insert
  to authenticated
  with check (
    public.is_admin()
    or (supervisor_id = auth.uid() and public.current_role_name() = 'supervisor')
  );

drop policy if exists "caseload: supervisor removes own students, admin removes anyone" on public.supervisor_students;
create policy "caseload: supervisor removes own students, admin removes anyone"
  on public.supervisor_students for delete
  to authenticated
  using (public.is_admin() or supervisor_id = auth.uid());

-- ---------------------------------------------------------------------------
-- logbook_templates
-- ---------------------------------------------------------------------------
drop policy if exists "templates: owners, assigned students and admins read" on public.logbook_templates;
create policy "templates: owners, assigned students and admins read"
  on public.logbook_templates for select
  to authenticated
  using (
    supervisor_id = auth.uid()
    or public.is_admin()
    or (status = 'published' and public.current_has_template(id))
  );

drop policy if exists "templates: supervisors write their own" on public.logbook_templates;
create policy "templates: supervisors write their own"
  on public.logbook_templates for insert
  to authenticated
  with check (public.is_admin() or (supervisor_id = auth.uid() and public.current_role_name() = 'supervisor'));

drop policy if exists "templates: supervisors update their own" on public.logbook_templates;
create policy "templates: supervisors update their own"
  on public.logbook_templates for update
  to authenticated
  using (public.is_admin() or supervisor_id = auth.uid())
  with check (public.is_admin() or supervisor_id = auth.uid());

drop policy if exists "templates: supervisors delete their own drafts" on public.logbook_templates;
create policy "templates: supervisors delete their own drafts"
  on public.logbook_templates for delete
  to authenticated
  using (public.is_admin() or (supervisor_id = auth.uid() and status = 'draft'));

-- ---------------------------------------------------------------------------
-- logbook_assignments
-- ---------------------------------------------------------------------------
drop policy if exists "assignments: student, supervisor and admin read" on public.logbook_assignments;
create policy "assignments: student, supervisor and admin read"
  on public.logbook_assignments for select
  to authenticated
  using (
    student_id = auth.uid()
    or supervisor_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "assignments: supervisor assigns own templates, admin any" on public.logbook_assignments;
create policy "assignments: supervisor assigns own templates, admin any"
  on public.logbook_assignments for insert
  to authenticated
  with check (
    public.is_admin()
    or (
      supervisor_id = auth.uid()
      and exists (
        select 1 from public.logbook_templates t
        where t.id = template_id and t.supervisor_id = auth.uid()
      )
    )
  );

drop policy if exists "assignments: supervisor or admin removes" on public.logbook_assignments;
create policy "assignments: supervisor or admin removes"
  on public.logbook_assignments for delete
  to authenticated
  using (public.is_admin() or supervisor_id = auth.uid());

-- ---------------------------------------------------------------------------
-- logs
-- ---------------------------------------------------------------------------
drop policy if exists "logs: student reads own, supervisor reads caseload, admin all" on public.logs;
create policy "logs: student reads own, supervisor reads caseload, admin all"
  on public.logs for select
  to authenticated
  using (
    student_id = auth.uid()
    or public.current_supervises(student_id)
    or public.is_admin()
  );

drop policy if exists "logs: student writes own drafts" on public.logs;
create policy "logs: student writes own drafts"
  on public.logs for insert
  to authenticated
  with check (public.is_admin() or student_id = auth.uid());

drop policy if exists "logs: owner or supervisor updates" on public.logs;
create policy "logs: owner or supervisor updates"
  on public.logs for update
  to authenticated
  using (
    student_id = auth.uid()
    or public.current_supervises(student_id)
    or public.is_admin()
  )
  with check (
    student_id = auth.uid()
    or public.current_supervises(student_id)
    or public.is_admin()
  );
-- The lifecycle itself (draft/rejected only, approved frozen) is the trigger in
-- 4.4. Keeping the two layers separate means a policy fix can never silently
-- unlock an approved entry.

drop policy if exists "logs: student deletes drafts and returned entries" on public.logs;
create policy "logs: student deletes drafts and returned entries"
  on public.logs for delete
  to authenticated
  using (
    public.is_admin()
    or (student_id = auth.uid() and status in ('Draft', 'Rejected'))
  );

-- ---------------------------------------------------------------------------
-- evidence
-- ---------------------------------------------------------------------------
drop policy if exists "evidence: reader of the log sees its files" on public.evidence;
create policy "evidence: reader of the log sees its files"
  on public.evidence for select
  to authenticated
  using (student_id = auth.uid() or public.current_can_read_log(log_id));

drop policy if exists "evidence: owner uploads to own entries" on public.evidence;
create policy "evidence: owner uploads to own entries"
  on public.evidence for insert
  to authenticated
  with check (student_id = auth.uid() and public.current_can_read_log(log_id));

drop policy if exists "evidence: owner deletes" on public.evidence;
create policy "evidence: owner deletes"
  on public.evidence for delete
  to authenticated
  using (student_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
drop policy if exists "comments: readers of the log" on public.comments;
create policy "comments: readers of the log"
  on public.comments for select
  to authenticated
  using (public.current_can_read_log(log_id));

drop policy if exists "comments: supervisor of the student writes" on public.comments;
create policy "comments: supervisor of the student writes"
  on public.comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.current_can_read_log(log_id)
    and (public.current_role_name() in ('supervisor', 'admin'))
  );

drop policy if exists "comments: author or admin deletes" on public.comments;
create policy "comments: author or admin deletes"
  on public.comments for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
drop policy if exists "notifications: read own" on public.notifications;
create policy "notifications: read own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "notifications: mark own read" on public.notifications;
create policy "notifications: mark own read"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notifications: delete own" on public.notifications;
create policy "notifications: delete own"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());
-- No insert policy: rows are written by the SECURITY DEFINER triggers in 4.7.

-- ---------------------------------------------------------------------------
-- log_revisions (append-only history)
-- ---------------------------------------------------------------------------
drop policy if exists "revisions: readers of the log" on public.log_revisions;
create policy "revisions: readers of the log"
  on public.log_revisions for select
  to authenticated
  using (public.current_can_read_log(log_id));
-- No insert/update/delete policies: only the trigger in 4.5 writes here.

-- ---------------------------------------------------------------------------
-- audit_log (append-only)
-- ---------------------------------------------------------------------------
drop policy if exists "audit: admins read all, supervisors read their students" on public.audit_log;
create policy "audit: admins read all, supervisors read their students"
  on public.audit_log for select
  to authenticated
  using (
    public.is_admin()
    or (
      public.current_role_name() = 'supervisor'
      and table_name = 'logs'
      and exists (
        select 1 from public.logs l
        where l.id::text = record_id
          and public.current_supervises(l.student_id)
      )
    )
  );
-- Deliberately no update or delete policy, plus a belt-and-braces trigger in 4.6.

revoke update, delete on public.audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- competencies and sign-offs
-- ---------------------------------------------------------------------------
drop policy if exists "competencies: any signed-in user reads" on public.competencies;
create policy "competencies: any signed-in user reads"
  on public.competencies for select
  to authenticated, anon
  using (true);

drop policy if exists "competencies: admins maintain" on public.competencies;
create policy "competencies: admins maintain"
  on public.competencies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "competency_signoffs: student, supervisor, admin read" on public.competency_signoffs;
create policy "competency_signoffs: student, supervisor, admin read"
  on public.competency_signoffs for select
  to authenticated
  using (
    student_id = auth.uid()
    or public.current_supervises(student_id)
    or public.is_admin()
  );

drop policy if exists "competency_signoffs: supervisor signs own students" on public.competency_signoffs;
create policy "competency_signoffs: supervisor signs own students"
  on public.competency_signoffs for insert
  to authenticated
  with check (
    public.is_admin()
    or (public.current_supervises(student_id) and supervisor_id = auth.uid())
  );

drop policy if exists "competency_signoffs: supervisor updates own students" on public.competency_signoffs;
create policy "competency_signoffs: supervisor updates own students"
  on public.competency_signoffs for update
  to authenticated
  using (public.is_admin() or public.current_supervises(student_id))
  with check (public.is_admin() or public.current_supervises(student_id));

drop policy if exists "term_signoffs: student, supervisor, admin read" on public.term_signoffs;
create policy "term_signoffs: student, supervisor, admin read"
  on public.term_signoffs for select
  to authenticated
  using (
    student_id = auth.uid()
    or public.current_supervises(student_id)
    or public.is_admin()
  );

drop policy if exists "term_signoffs: supervisor signs own students" on public.term_signoffs;
create policy "term_signoffs: supervisor signs own students"
  on public.term_signoffs for insert
  to authenticated
  with check (public.is_admin() or (public.current_supervises(student_id) and supervisor_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- review_requests
-- ---------------------------------------------------------------------------
drop policy if exists "review_requests: anyone may ask for a review" on public.review_requests;
create policy "review_requests: anyone may ask for a review"
  on public.review_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "review_requests: admins read" on public.review_requests;
create policy "review_requests: admins read"
  on public.review_requests for select
  to authenticated
  using (public.is_admin());
-- Note on abuse: a public form is a public form. Rate limiting belongs at the
-- edge (Netlify or a Supabase Edge Function), not in the browser. This policy
-- grants insert only; nothing can be read back by the visitor.


-- =============================================================================
-- 06  STORAGE (evidence files, FURPS+ F5)
-- =============================================================================
-- Private bucket, 5 MB cap, PDF/PNG/JPG only, one folder per user.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence',
  'evidence',
  false,
  5242880,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['application/pdf', 'image/png', 'image/jpeg'];

-- Path convention: <student_id>/<log_id>/<timestamp>-<filename>
drop policy if exists "evidence files: owner uploads into own folder" on storage.objects;
create policy "evidence files: owner uploads into own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "evidence files: owner, their supervisor, or admin reads" on storage.objects;
create policy "evidence files: owner, their supervisor, or admin reads"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'evidence'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
      or public.current_supervises(public.safe_uuid((storage.foldername(name))[1]))
    )
  );

drop policy if exists "evidence files: owner deletes" on storage.objects;
create policy "evidence files: owner deletes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- =============================================================================
-- 07  FIRST ADMINISTRATOR
-- =============================================================================
-- Registration can never create an admin. Promote one by hand, once, in the
-- SQL editor of the project:
--
--   update public.profiles
--      set role = 'admin'
--    where id = (select id from auth.users where email = 'office@university.ac.rw');
--
-- Then sign in as that user. The change is written to audit_log by trigger
-- profiles_audit(). After this, further role changes can be made from the
-- Admin -> Users screen by an existing administrator.


-- =============================================================================
-- 08  RECOMMENDED SUPABASE AUTH SETTINGS
-- =============================================================================
-- Authentication -> Providers -> Email
--   * Enable email confirmations.
--   * Minimum password length: 8 (the interface enforces the same).
--   * Secure email change: on.
--
-- Authentication -> URL configuration
--   * Site URL:            https://your-site.netlify.app
--   * Redirect allow list: https://your-site.netlify.app/reset-password
--                          https://your-site.netlify.app/login
--                          http://localhost:5173/reset-password
--
-- Authentication -> Rate limits
--   * Leave the built-in limits on. Do not attempt to rate limit in the client;
--     it is trivially bypassed and creates a false sense of safety.


-- =============================================================================
-- 09  VERIFYING ISOLATION (do this after seeding)
-- =============================================================================
-- 1. Sign in as student A in one browser profile and student B in another.
--    A's entry list must not contain B's rows. In the SQL editor, running
--    `select * from logs` (as the service role) shows both, which is expected.
-- 2. Sign in as a supervisor who does not supervise student C. C's entries must
--    return zero rows, and C's profile must be unreadable.
-- 3. Sign in as a supervisor and try /student/logbook: the guard sends a 404.
-- 4. As a student, update an Approved entry through the API:
--      update logs set hours_worked = 1 where id = '<an approved id>';
--    It must fail with "Approved entries are locked."
-- 5. As a student, try `update profiles set role = 'admin' where id = auth.uid();`
--    It must fail with "Only an administrator can change a role."
-- =============================================================================
