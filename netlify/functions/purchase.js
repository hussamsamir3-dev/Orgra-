/* POST /api/purchase — the server debits, or refuses. */
const { sql, getPlayer, flag } = require('./_lib/db');
const { requireUser, json, unauthorized, bannedResponse } = require('./_lib/auth');
const { VEHICLES, FUEL, LICENCES } = require('./_lib/economy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  const user = requireUser(context);
  if (!user) return unauthorized();

  const p = await getPlayer(user);
  if (p.banned_until && new Date(p.banned_until) > new Date()) return bannedResponse(p);

  let r; try { r = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad body' }); }
  const kind = String(r.kind || '');
  let cost = 0, effect = null;

  if (kind === 'vehicle') {
    const v = VEHICLES.find(x => x.id === r.id);
    if (!v) return json(400, { error: 'unknown vehicle' });
    if (v.lvl > p.level) return json(403, { error: 'level too low' });
    const have = await sql`select 1 from player_vehicles
                           where player_id = ${p.id} and vehicle_id = ${v.id}`;
    if (have.length) return json(409, { error: 'already owned' });
    cost = v.price;
    effect = async () => {
      await sql`insert into player_vehicles (player_id, vehicle_id, fuel)
                values (${p.id}, ${v.id}, 15)`;
    };

  } else if (kind === 'fuel') {
    const litres = Math.max(0, Math.min(400, +r.litres || 0));
    const veh = VEHICLES.find(x => x.id === r.vehicleId);
    if (!veh) return json(400, { error: 'unknown vehicle' });
    const owned = await sql`select * from player_vehicles
                            where player_id = ${p.id} and vehicle_id = ${veh.id}`;
    if (!owned.length) return json(403, { error: 'not owned' });
    const f = FUEL[veh.fuel] || FUEL.b92;
    cost = Math.round(litres * f.price);
    effect = async () => {
      await sql`update player_vehicles set fuel = fuel + ${litres}
                where player_id = ${p.id} and vehicle_id = ${veh.id}`;
    };

  } else if (kind === 'licence') {
    const l = LICENCES.find(x => x.id === r.id);
    if (!l) return json(400, { error: 'unknown licence' });
    cost = l.price;
    effect = async () => {
      await sql`update players set licence_class = ${l.id},
                  licence_exp = current_date + ${l.days},
                  licence_pts = 0
                where id = ${p.id}`;
    };

  } else if (kind === 'repair') {
    /* priced by how worn the part is, server-side */
    const wear = Math.max(0, Math.min(100, +r.wear || 0));
    cost = Math.round(80 + wear * 26);
    effect = async () => {
      await sql`update player_vehicles
                  set condition = condition || ${JSON.stringify({ [String(r.part || 'body')]: 100 })}::jsonb
                where player_id = ${p.id} and vehicle_id = ${String(r.vehicleId || '')}`;
    };

  } else {
    return json(400, { error: 'unknown purchase kind' });
  }

  if (Number(p.cash) < cost) return json(402, { error: 'insufficient funds', cost, cash: Number(p.cash) });

  await effect();
  const after = Number(p.cash) - cost;
  await sql`update players set cash = ${after}, last_seen = now() where id = ${p.id}`;
  return json(200, { ok: true, spent: cost, cash: after });
};
