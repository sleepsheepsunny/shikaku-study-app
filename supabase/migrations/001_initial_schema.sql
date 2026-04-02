-- ===========================
-- EXTENSIONS
-- ===========================
create extension if not exists "uuid-ossp";

-- ===========================
-- ENUM TYPES
-- ===========================
create type question_ui_type as enum (
  'multiple_choice',
  'fill_blank',
  'calculation',
  'true_false',
  'multi_select'
);

create type qualification_genre as enum (
  'it',
  'business',
  'language',
  'medical',
  'legal'
);

-- ===========================
-- QUALIFICATIONS (master data)
-- ===========================
create table qualifications (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  name_short   text,
  genre        qualification_genre not null,
  ui_types     question_ui_type[] not null,
  categories   text[] not null,
  system_prompt text not null,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

-- ===========================
-- QUESTIONS (AI-generated cache)
-- ===========================
create table questions (
  id               uuid primary key default gen_random_uuid(),
  qualification_id uuid not null references qualifications(id),
  category         text not null,
  difficulty       smallint not null check (difficulty between 1 and 5),
  ui_type          question_ui_type not null,
  question_text    text not null,
  question_data    jsonb not null,
  report_count     integer default 0,
  is_hidden        boolean default false,
  generated_at     timestamptz default now(),
  created_at       timestamptz default now()
);

create index idx_questions_lookup
  on questions(qualification_id, category, difficulty, ui_type)
  where is_hidden = false;

-- ===========================
-- PROFILES
-- ===========================
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  is_pro          boolean default false,
  pro_expires_at  timestamptz,
  daily_q_count   integer default 0,
  daily_q_reset   date default current_date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Increment daily quota (atomic upsert)
create or replace function increment_daily_quota(p_user_id uuid, p_count int, p_today date)
returns void language plpgsql security definer as $$
begin
  update profiles
  set
    daily_q_count = case when daily_q_reset = p_today then daily_q_count + p_count else p_count end,
    daily_q_reset = p_today,
    updated_at = now()
  where id = p_user_id;
end;
$$;

-- ===========================
-- STUDY SESSIONS
-- ===========================
create table study_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  qualification_id uuid not null references qualifications(id),
  category         text,
  difficulty       smallint,
  total_questions  integer not null,
  started_at       timestamptz default now(),
  ended_at         timestamptz,
  is_completed     boolean default false
);

create index idx_sessions_user on study_sessions(user_id, started_at desc);

-- ===========================
-- ANSWERS
-- ===========================
create table answers (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references study_sessions(id) on delete cascade,
  question_id  uuid not null references questions(id),
  user_answer  jsonb not null,
  is_correct   boolean not null,
  time_taken   integer,
  answered_at  timestamptz default now()
);

create index idx_answers_session on answers(session_id);

-- ===========================
-- QUESTION REPORTS
-- ===========================
create table question_reports (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id),
  user_id     uuid not null references profiles(id),
  reason      text,
  created_at  timestamptz default now(),
  unique(question_id, user_id)
);

-- Trigger: auto-hide at 5 reports
create or replace function handle_question_report()
returns trigger language plpgsql as $$
begin
  update questions
  set
    report_count = report_count + 1,
    is_hidden = (report_count + 1 >= 5)
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_question_reported
  after insert on question_reports
  for each row execute procedure handle_question_report();

-- ===========================
-- ROW LEVEL SECURITY
-- ===========================
alter table profiles enable row level security;
alter table study_sessions enable row level security;
alter table answers enable row level security;
alter table question_reports enable row level security;
alter table questions enable row level security;
alter table qualifications enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id);

create policy "own sessions" on study_sessions
  for all using (auth.uid() = user_id);

create policy "own answers" on answers
  for all using (
    session_id in (
      select id from study_sessions where user_id = auth.uid()
    )
  );

create policy "read questions" on questions
  for select using (auth.role() = 'authenticated' and is_hidden = false);

create policy "read qualifications" on qualifications
  for select using (is_active = true);

create policy "insert report" on question_reports
  for insert with check (auth.uid() = user_id);
