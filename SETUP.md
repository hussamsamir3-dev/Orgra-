# Ogra — going online

Everything that decides money now lives on the server. The game on the phone
reports what happened; the server decides what it was worth and sends back the
true balance. Editing anything on the device changes nothing.

---

## What is in the box

```
index.html                     the game (now loads the online layer)
assets/                        artwork, audio, net.js
netlify.toml                   routing + cache rules
package.json                   one dependency (Neon driver)
db/schema.sql                  the database, run once
netlify/functions/
  _lib/economy.js              ← every price, fare, fine and XP threshold
  _lib/db.js                   database access
  _lib/auth.js                 reads the verified Identity user
  _lib/level.js                level is derived from XP, never sent
  profile.js     GET  /api/profile     load everything on sign-in
  trip.js        POST /api/trip        report a run, server pays out
  purchase.js    POST /api/purchase    server debits, or refuses
  sync.js        POST /api/sync        cosmetic state only
  admin-export.js GET /api/admin-export  your monitoring JSON
```

---

## Steps

### 1. Put it in a GitHub repo
Everything above at the repo root. Commit and push.

### 2. Create the Netlify site
Netlify → **Add new site → Import an existing project** → pick the repo.
- Build command: **leave empty**
- Publish directory: **`.`**
- Functions directory: `netlify/functions` (already in `netlify.toml`)

Deploy. You get `yourname.netlify.app`.

### 3. Turn on Identity
Site configuration → **Identity → Enable Identity**.
- Registration: **Invite only** while you test, **Open** when you launch.
- Emails → enable **confirmation**, so every account verifies its address.

### 4. Create the database
Site configuration → **Netlify DB** → create. It sets `NETLIFY_DATABASE_URL`
automatically. Open the Neon console it gives you, paste in `db/schema.sql`,
run it once.

### 5. Make yourself an admin
Identity → your user → **Edit roles** → add `admin`.
Then `https://yoursite.netlify.app/api/admin-export` downloads the full JSON:
every player, their balance and level, the last 1,000 trips, and all open
cheat flags.

### 6. Compress the music before launch
`assets/menu_music_2.mp3` is 4.13 MB of a 7.65 MB first load. At 96 kbps mono
it drops to about 1 MB:

```
ffmpeg -i menu_music_2.mp3 -b:a 96k -ac 1 menu_music_2.mp3
```

On the free plan that roughly doubles how many players you can serve.

---

## What the server owns

| Owned by the server | Still on the device |
|---|---|
| cash, XP, level, reputation | settings, language, avatar |
| licence class, expiry, points | camera and audio preferences |
| owned vehicles, fuel, condition | tutorial flags |
| every price, fare and fine | which screen you are on |
| trip payouts | |

`sync.js` strips `cash`, `xp`, `level`, `owned`, `licence` and `stats` out of
anything the client sends, and logs a flag if they were present.

---

## How cheating is caught

The client never states a balance. It says *"route maadi_tahrir, 13 minutes,
11 passengers, on time, rating 4.9, used 2.4 litres"*. The server recalculates
from its own tables.

Rejected outright:

| Check | Result |
|---|---|
| Faster than 18 s/km | flagged **and** one-hour ban, balance reset |
| Zero duration | rejected |
| More passengers than seats × stops | rejected |
| Route above the player's level | rejected |
| Coach route in a microbus | rejected |
| Payout above 120,000 | rejected and flagged |
| Trip with a vehicle they do not own | rejected and flagged |

Everything, accepted or not, lands in the `trips` table, so every pound traces
back to a row you can inspect.

Tune the thresholds in `_lib/economy.js` under `SANITY`. Ban length is the last
argument to `ban()` in `trip.js` — currently 1 hour.

---

## Monitoring

`player_overview` is a ready-made view:

```sql
select * from player_overview where open_flags > 0;

select p.email, count(*) as rejected
from trips t join players p on p.id = t.player_id
where not t.accepted and t.ended_at > now() - interval '24 hours'
group by p.email order by rejected desc;
```

---

## Offline behaviour

Opened from a `file://` path, or with the server unreachable, the game runs in
**practice mode**: fully playable, nothing banked. A small badge bottom-left
reads `● متصل` online or `○ تدريب` in practice. This is deliberate — it means a
bad connection never costs a player their progress, and it keeps the current
single-file build working exactly as it does today.

---

## Free plan ceiling

Netlify free is 300 credits/month, a hard cap. Bandwidth is 20 credits/GB
(~15 GB). At 7.65 MB per first load that is roughly **2,000 new players a
month**; compressed, about 4,000. API calls are cheap by comparison — saves sync
every 30 seconds, which is well inside the request budget.

If you outgrow it: Personal at $9/month (1,000 credits), or move `index.html`
and `assets/` to Cloudflare Pages (unmetered bandwidth) and leave the functions
on Netlify.
