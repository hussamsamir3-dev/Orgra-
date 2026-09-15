/* ============================================================
   POST /api/trip
   The client reports WHAT HAPPENED. This decides what it was worth.
   No money value is ever accepted from the device.
   ============================================================ */
const { sql, getPlayer, flag, ban } = require('./_lib/db');
const { requireUser, json, unauthorized, bannedResponse } = require('./_lib/auth');
const { ROUTES, VEHICLES, FUEL, FINES, PAY, SANITY } = require('./_lib/economy');
const { levelFor } = require('./_lib/level');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  const user = requireUser(context);
  if (!user) return unauthorized();

  const p = await getPlayer(user);
  if (p.banned_until && new Date(p.banned_until) > new Date()) return bannedResponse(p);

  let r;
  try { r = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad body' }); }

  /* ---- what the client is allowed to tell us ---- */
  const routeId   = String(r.routeId || '');
  const vehicleId = String(r.vehicleId || '');
  const durationS = Math.max(0, Math.round(+r.durationS || 0));
  const passengers= Math.max(0, Math.round(+r.passengers || 0));
  const onTime    = !!r.onTime;
  const rating    = Math.max(0, Math.min(5, +r.rating || 0));
  const fineKeys  = Array.isArray(r.fines) ? r.fines.slice(0, 20) : [];
  const overBy    = Math.max(0, Math.round(+r.overBy || 0));   // km/h over the limit
  const litres    = Math.max(0, +r.litresUsed || 0);
  /* note: r.cash, r.xp, r.level are ignored entirely if sent */

  const route = ROUTES.find(x => x.id === routeId);
  if (!route) return json(400, { error: 'unknown route' });

  const veh = VEHICLES.find(v => v.id === vehicleId);
  const owned = await sql`select * from player_vehicles
                          where player_id = ${p.id} and vehicle_id = ${vehicleId}`;
  if (!veh || !owned.length) {
    await flag(p.id, 'trip_with_unowned_vehicle', { routeId, vehicleId }, 2);
    return json(400, { error: 'vehicle not owned' });
  }

  /* ---- sanity: could this trip physically have happened? ---- */
  const km = route.km || 1;
  const secPerKm = durationS / km;
  const reject = [];
  if (secPerKm < SANITY.minSecPerKm) reject.push('impossible_speed');
  if (durationS <= 0)                reject.push('zero_duration');
  if (passengers > Math.min(SANITY.maxPassengers, veh.seats * (route.stops || 1)))
                                     reject.push('too_many_passengers');
  if (route.lvl > p.level)           reject.push('route_locked');
  if (route.coachOnly && veh.cat !== 'bus') reject.push('wrong_vehicle_class');

  if (reject.length) {
    await sql`insert into trips (player_id, route_id, vehicle_id, started_at, duration_s,
                                 passengers, distance_km, accepted, reject_note)
              values (${p.id}, ${routeId}, ${vehicleId}, now() - (${durationS} || ' seconds')::interval,
                      ${durationS}, ${passengers}, ${km}, false, ${reject.join(',')})`;
    await flag(p.id, reject[0], { routeId, durationS, passengers, secPerKm }, 3);
    if (reject.includes('impossible_speed')) {
      await ban(p.id, 'impossible trip time', 1);
      return json(403, { error: 'banned', reason: 'impossible trip time' });
    }
    return json(422, { error: 'trip rejected', why: reject });
  }

  /* ---- the payout, computed here and nowhere else ---- */
  const base   = Math.round(route.fare * passengers * PAY.perPassenger);
  const bonus  = Math.round(base * ((onTime ? PAY.onTimeBonus : 0) +
                                    (rating >= 4.8 ? PAY.fiveStarBonus : 0)));
  const tips   = Math.round(Math.min(passengers * PAY.maxTipPerPax,
                                     base * 0.12 * (rating / 5)));
  let fines = 0;
  for (const k of fineKeys) {
    if (!FINES[k]) continue;
    let f = FINES[k];
    if (k === 'at_fault_crash') f += overBy * 22;
    if (k === 'speed_camera')   f += overBy * 14;
    fines += f;
  }
  const fuelType  = (FUEL[veh.fuel] ? veh.fuel : 'b92');
  const fuelCost  = Math.round(litres * (FUEL[fuelType] ? FUEL[fuelType].price : 11.15));
  const net       = base + bonus + tips - fines - fuelCost;

  if (base + bonus + tips > SANITY.maxTripPayout) {
    await flag(p.id, 'payout_too_high', { base, bonus, tips, routeId }, 3);
    return json(422, { error: 'payout out of range' });
  }

  const xpGain = Math.round(km * 1.5 + passengers * 4 + (onTime ? 25 : 0));
  const newXp  = Number(p.xp) + xpGain;
  const newLvl = levelFor(newXp);
  const newCash = Math.max(0, Number(p.cash) + net);

  await sql`insert into trips (player_id, route_id, vehicle_id,
              started_at, duration_s, passengers, distance_km,
              fare_earned, tips, fines, fuel_cost, net, xp_gained)
            values (${p.id}, ${routeId}, ${vehicleId},
              now() - (${durationS} || ' seconds')::interval,
              ${durationS}, ${passengers}, ${km},
              ${base + bonus}, ${tips}, ${fines}, ${fuelCost}, ${net}, ${xpGain})`;

  await sql`update players set
              cash = ${newCash}, xp = ${newXp}, level = ${newLvl},
              total_trips = total_trips + 1,
              total_pax   = total_pax + ${passengers},
              total_km    = total_km + ${km},
              total_fines = total_fines + ${fines},
              reputation  = greatest(1, least(5, reputation * 0.9 + ${rating || 4.5} * 0.1)),
              last_seen   = now()
            where id = ${p.id}`;

  if (litres > 0) {
    await sql`update player_vehicles set fuel = greatest(0, fuel - ${litres})
              where player_id = ${p.id} and vehicle_id = ${vehicleId}`;
  }

  return json(200, {
    ok: true,
    breakdown: { base, bonus, tips, fines, fuelCost, net, xpGain },
    player: { cash: newCash, xp: newXp, level: newLvl }
  });
};
