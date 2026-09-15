/* Postgres access. Netlify DB sets NETLIFY_DATABASE_URL automatically. */
const { neon } = require('@neondatabase/serverless');

const url = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
if (!url) console.warn('[ogra] no database URL set');

const sql = neon(url);

/* fetch the player row, creating it on first login */
async function getPlayer(user) {
  const rows = await sql`select * from players where id = ${user.sub}`;
  if (rows.length) {
    await sql`update players set last_seen = now() where id = ${user.sub}`;
    return rows[0];
  }
  const made = await sql`
    insert into players (id, email, name)
    values (${user.sub}, ${user.email}, ${user.name || null})
    returning *`;
  await sql`insert into saves (player_id) values (${user.sub})
            on conflict (player_id) do nothing`;
  /* everyone starts with the free van, exactly as the game does */
  await sql`insert into player_vehicles (player_id, vehicle_id, fuel, is_current)
            values (${user.sub}, 'v_n300', 20, true)
            on conflict do nothing`;
  return made[0];
}

async function flag(playerId, kind, detail, severity = 1) {
  await sql`insert into flags (player_id, kind, detail, severity)
            values (${playerId}, ${kind}, ${JSON.stringify(detail)}, ${severity})`;
}

async function ban(playerId, reason, hours = 1) {
  await sql`update players
              set banned_until = now() + (${hours} || ' hours')::interval,
                  ban_reason = ${reason},
                  cash = 0, xp = 0, level = 1
            where id = ${playerId}`;
}

module.exports = { sql, getPlayer, flag, ban };
