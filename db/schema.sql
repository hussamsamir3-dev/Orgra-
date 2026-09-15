-- ============================================================
--  Ogra player database
--  Run once against your Netlify DB (Neon) instance.
-- ============================================================

-- ---------- players ----------
-- One row per account. Identity owns the password; we never see it.
create table if not exists players (
  id            text primary key,              -- Netlify Identity user id (sub)
  email         text unique not null,
  name          text,
  created_at    timestamptz not null default now(),
  last_seen     timestamptz not null default now(),

  -- everything below is server-owned. The client may READ it, never write it.
  cash          bigint  not null default 7000,
  xp            bigint  not null default 0,
  level         int     not null default 1,
  reputation    numeric(3,2) not null default 5.00,

  licence_class text    not null default 'none',   -- none | private | pro
  licence_exp   date,
  licence_pts   int     not null default 0,

  banned_until  timestamptz,
  ban_reason    text,

  total_trips   int     not null default 0,
  total_pax     int     not null default 0,
  total_km      numeric not null default 0,
  total_fines   bigint  not null default 0
);

-- ---------- owned vehicles ----------
create table if not exists player_vehicles (
  player_id   text not null references players(id) on delete cascade,
  vehicle_id  text not null,
  bought_at   timestamptz not null default now(),
  fuel        numeric not null default 20,
  condition   jsonb   not null default '{}'::jsonb,   -- per-part wear
  cosmetics   jsonb   not null default '{}'::jsonb,   -- paint, rims, stickers
  upgrades    jsonb   not null default '{}'::jsonb,
  is_current  boolean not null default false,
  primary key (player_id, vehicle_id)
);

-- ---------- cosmetic / local-only save ----------
-- Settings, avatar, language, tutorial flags. Nothing here affects money,
-- so it is safe to accept straight from the client.
create table if not exists saves (
  player_id  text primary key references players(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- trip log ----------
-- The audit trail. Every payout traces back to one of these rows.
create table if not exists trips (
  id           bigserial primary key,
  player_id    text not null references players(id) on delete cascade,
  route_id     text not null,
  vehicle_id   text,
  started_at   timestamptz not null,
  ended_at     timestamptz not null default now(),
  duration_s   int  not null,
  passengers   int  not null default 0,
  distance_km  numeric not null default 0,
  fare_earned  bigint not null default 0,
  tips         bigint not null default 0,
  fines        bigint not null default 0,
  fuel_cost    bigint not null default 0,
  net          bigint not null default 0,
  xp_gained    int    not null default 0,
  accepted     boolean not null default true,     -- false = rejected as impossible
  reject_note  text
);
create index if not exists trips_player_time on trips (player_id, ended_at desc);

-- ---------- cheat flags ----------
create table if not exists flags (
  id         bigserial primary key,
  player_id  text not null references players(id) on delete cascade,
  kind       text not null,        -- impossible_speed | payout_too_high | balance_jump | ...
  detail     jsonb,
  severity   int  not null default 1,   -- 1 note, 2 suspicious, 3 auto-ban
  created_at timestamptz not null default now(),
  reviewed   boolean not null default false
);
create index if not exists flags_open on flags (reviewed, created_at desc);

-- ---------- a convenient view for monitoring ----------
create or replace view player_overview as
select p.id, p.email, p.name, p.level, p.cash, p.total_trips, p.total_fines,
       p.licence_class, p.banned_until,
       (select count(*) from flags f where f.player_id = p.id and not f.reviewed) as open_flags,
       p.last_seen
from players p
order by p.last_seen desc;
