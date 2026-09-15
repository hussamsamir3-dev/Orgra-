/* POST /api/sync — cosmetic state only.
   Settings, language, avatar, tutorial flags. Nothing here touches money,
   so it is safe to take from the device. Anything money-shaped is stripped. */
const { sql, getPlayer, flag } = require('./_lib/db');
const { requireUser, json, unauthorized, bannedResponse } = require('./_lib/auth');

const BANNED_KEYS = ['cash','xp','lvl','level','owned','licence','lic','stats','missions'];

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  const user = requireUser(context);
  if (!user) return unauthorized();

  const p = await getPlayer(user);
  if (p.banned_until && new Date(p.banned_until) > new Date()) return bannedResponse(p);

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad body' }); }
  const incoming = body.local || {};

  const clean = {};
  let stripped = 0;
  for (const k of Object.keys(incoming)) {
    if (BANNED_KEYS.includes(k)) { stripped++; continue; }
    clean[k] = incoming[k];
  }
  if (stripped) await flag(p.id, 'sync_contained_economy_keys', { stripped }, 1);

  await sql`update saves set data = ${JSON.stringify(clean)}::jsonb, updated_at = now()
            where player_id = ${p.id}`;

  /* always answer with the authoritative figures so the client corrects itself */
  return json(200, {
    ok: true,
    player: { cash: Number(p.cash), xp: Number(p.xp), level: p.level,
              licence: { cls: p.licence_class, exp: p.licence_exp, pts: p.licence_pts } }
  });
};
