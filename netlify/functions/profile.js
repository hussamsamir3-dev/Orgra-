/* GET /api/profile — everything the client needs, all of it server-owned. */
const { sql, getPlayer } = require('./_lib/db');
const { requireUser, json, unauthorized, bannedResponse } = require('./_lib/auth');
const { ROUTES, VEHICLES, FUEL, LICENCES, FINES } = require('./_lib/economy');

exports.handler = async (event, context) => {
  const user = requireUser(context);
  if (!user) return unauthorized();

  const p = await getPlayer(user);
  if (p.banned_until && new Date(p.banned_until) > new Date()) return bannedResponse(p);

  const vehicles = await sql`select * from player_vehicles where player_id = ${p.id}`;
  const save     = await sql`select data from saves where player_id = ${p.id}`;

  return json(200, {
    player: {
      email: p.email, name: p.name,
      cash: Number(p.cash), xp: Number(p.xp), level: p.level,
      reputation: Number(p.reputation),
      licence: { cls: p.licence_class, exp: p.licence_exp, pts: p.licence_pts },
      stats: { trips: p.total_trips, pax: p.total_pax,
               km: Number(p.total_km), fines: Number(p.total_fines) }
    },
    vehicles: vehicles.map(v => ({
      id: v.vehicle_id, fuel: Number(v.fuel), cond: v.condition,
      cosmetics: v.cosmetics, upgrades: v.upgrades, current: v.is_current
    })),
    local: (save[0] && save[0].data) || {},
    /* the price lists, sent down so the client shows the same numbers the
       server will charge. Changing them on the device changes nothing. */
    economy: { routes: ROUTES, vehicles: VEHICLES, fuel: FUEL, licences: LICENCES, fines: FINES }
  });
};
