"use strict";
/* ---------------- Terrain ---------------- */
const DX = .25, OFF = 300;
const W = {H:null, len:0, route:null, biome:null, stops:[], rests:[], cps:[], gas:[], radars:[], bumps:[], holes:[], lights:[], deco:[], props:[], decals:[], seed:1};
function terrH(x){ const f = (x + OFF) / DX; let i = f | 0; const H = W.H; if (i < 0) return H[0]; if (i >= H.length - 1) return H[H.length - 1]; const r = f - i; return H[i] + (H[i + 1] - H[i]) * r; }
function terrS(x){ return (terrH(x + .4) - terrH(x - .4)) / .8; }

function genWorld(route, seed){
 const rnd = mulberry(seed); const B = BIOME[route.biome]; const type = route.type; const urban = B.urban;
 const len = type === 'coach' ? clamp(route.km * 22, 4800, 10000) : clamp(route.km * 185, 1900, 4200);
 W.len = len; W.route = route; W.biome = B; W.seed = seed;
 const N = Math.ceil((len + OFF + 500) / DX); const H = new Float32Array(N);
 const wl = type === 'micro' ? .8 : type === 'bus' ? 1.1 : 1.35, amp = B.amp, big = B.big;
 const p = Array.from({length:8}, () => rnd() * 6.28);
 const base = x => amp * (Math.sin(x / (37 * wl) + p[0]) * .6 + Math.sin(x / (19 * wl) + p[1]) * .28 + Math.sin(x / (9.5 * wl) + p[2]) * .12) + big * (Math.sin(x / (190 * wl) + p[3]) * .65 + Math.sin(x / (96 * wl) + p[4]) * .35) + big * .4 * Math.sin(x / (430 * wl) + p[5]);
 for (let i = 0; i < N; i++){ const x = i * DX - OFF; H[i] = base(Math.max(0, x)); }
 for (const k of ['stops','rests','cps','gas','radars','bumps','holes','lights','deco','props','decals']) W[k] = [];
 const zones = [];
 if (type === 'coach'){
  W.stops.push({x:20, name:route.stops[0], i:0}); W.stops.push({x:len - 45, name:route.stops[1], i:1});
  const nr = route.rests.length; route.rests.forEach((r, k) => W.rests.push({x:Math.round(len * (k + 1) / (nr + 1)), name:r, used:false}));
  W.cps.push({x:Math.round(len * .1 + 150)}); if (nr > 1) W.cps.push({x:Math.round((W.rests[0].x + W.rests[1].x) / 2)});
  W.gas.push({x:Math.round(len * (nr > 1 ? .5 / (nr + 1) + .5 : .7))});
  W.radars.push({x:Math.round(len * .33 + rnd() * len * .08), limit:90}); W.radars.push({x:Math.round(len * .8), limit:100});
 } else {
  const n = route.stops.length;
  for (let i = 0; i < n; i++){ const x = i === 0 ? 20 : i === n - 1 ? len - 45 : Math.round(20 + (len - 65) * i / (n - 1) + (rnd() - .5) * 110); W.stops.push({x, name:route.stops[i], i}); }
  const mid = Math.floor(n / 2); W.gas.push({x:Math.round((W.stops[mid - 1].x + W.stops[mid].x) / 2)});
  const k = 1 + Math.floor(rnd() * (n - 3)); W.cps.push({x:Math.round(W.stops[k].x * .35 + W.stops[k + 1].x * .65)});
  if (urban > .3){ // traffic lights at intersections
   for (let i = 0; i < n - 1; i++){ if (rnd() < .75){ const a = W.stops[i].x, b = W.stops[i + 1].x; const x = Math.round(lerp(a, b, .22 + rnd() * .2)); W.lights.push({x, off:rnd() * 20}); } }
  } else W.radars.push({x:Math.round(len * .55), limit:80});
 }
 W.stops.forEach(s => zones.push({x:s.x, half:type === 'coach' ? 24 : 14}));
 W.rests.forEach(r => zones.push({x:r.x, half:32})); W.cps.forEach(c => zones.push({x:c.x, half:16})); W.gas.forEach(g => zones.push({x:g.x, half:18})); W.lights.forEach(l => zones.push({x:l.x, half:14}));
 zones.unshift({x:-OFF, half:OFF + 45});
 { const ls = W.stops[W.stops.length - 1]; zones.push({x:len + 220, half:280, lvl:H[clamp(Math.round((ls.x + OFF) / DX), 0, N - 1)]}); }
 for (const z of zones){
  const zi = clamp(Math.round((z.x + OFF) / DX), 0, N - 1); const lvl = z.lvl != null ? z.lvl : z.x < 0 ? base(0) : H[zi];
  const hAt = x => H[clamp(Math.round((x + OFF) / DX), 0, N - 1)];
  const dif = Math.max(Math.abs(hAt(z.x - z.half - 60) - lvl), Math.abs(hAt(z.x + z.half + 60) - lvl)); const blend = clamp(dif / .15, 45, 180);
  const i0 = Math.max(0, Math.floor((z.x - z.half - blend + OFF) / DX)), i1 = Math.min(N - 1, Math.ceil((z.x + z.half + blend + OFF) / DX));
  for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; const d = Math.abs(x - z.x) - z.half; const w = d <= 0 ? 1 : 1 - smooth(clamp(d / blend, 0, 1)); H[i] = lerp(H[i], lvl, w); }
 }
 const free = (x, m = 30) => zones.every(z => Math.abs(x - z.x) > z.half + m);
 const nb = Math.round(B.bumps * len / 280);
 for (let k = 0; k < nb * 3 && W.bumps.length < nb; k++){ const x = 60 + rnd() * (len - 120); if (free(x) && W.bumps.every(b => Math.abs(b - x) > 70)) W.bumps.push(x); }
 const nh = Math.round((1.2 - B.bumps * .5) * len / 420);
 for (let k = 0; k < nh * 3 && W.holes.length < nh; k++){ const x = 80 + rnd() * (len - 160); if (free(x) && W.bumps.every(b => Math.abs(b - x) > 30)) W.holes.push(x); }
 for (const b of W.bumps){ const i0 = Math.floor((b - 2.5 + OFF) / DX), i1 = Math.ceil((b + 2.5 + OFF) / DX); for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; H[i] += .13 * Math.exp(-Math.pow((x - b) / .6, 2)); } }
 for (const h of W.holes){ const i0 = Math.floor((h - 2 + OFF) / DX), i1 = Math.ceil((h + 2 + OFF) / DX); for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; H[i] -= .12 * Math.exp(-Math.pow((x - h) / .42, 2)); } }
 W.H = H;
 /* ---- scenery placement (uploaded artwork only) ---- */
 const busy = []; const place = (x, w) => { if (busy.some(b => x + w / 2 > b[0] - 1 && x - w / 2 < b[1] + 1)) return false; busy.push([x - w / 2, x + w / 2]); return true; };
 const B_H = {bOld:17, bNew:19, bPharm:15, bKosh:12.5, bMarket:12, bTrans:11, bSchool:9.5, bPolice:8, bHosp:8.5, bStation:7.5, bCafe:8, bWare:8.5};
 const bw = k => B_H[k] * META[k].w / META[k].h;
 const addB = (k, x) => { const w = bw(k); if (place(x, w)){ W.deco.push({k, x, h:B_H[k], w}); return true; } return false; };
 // terminals, stops, checkpoints, rest houses
 W.stops.forEach((s, i) => { if (i === 0 || i === W.stops.length - 1) addB('bStation', s.x + (type === 'coach' ? 2 : 4)); });
 W.cps.forEach(c => addB('bPolice', c.x + 6));
 W.rests.forEach(r => addB('bCafe', r.x + 2));
 const pool = urban > .5 ? ['bOld','bNew','bPharm','bKosh','bMarket','bOld','bNew','bTrans','bHosp','bSchool'] : ['bWare','bMarket','bKosh','bOld','bCafe','bTrans'];
 const density = urban > .5 ? .92 : urban > .15 ? .45 : .09;
 for (let x = -40; x < len + 120;){ const k = pool[(rnd() * pool.length) | 0]; const w = bw(k); if (rnd() < density) addB(k, x + w / 2); x += w + (urban > .5 ? .6 + rnd() * 2.5 : 6 + rnd() * 40); }
 // sidewalk props
 const P = (k, x, extra) => W.props.push(Object.assign({k, x}, extra || {}));
 const lampK = urban > .5 ? (route.biome === 'alex' || route.biome === 'nile' ? 'lamp2' : 'lamp') : 'lamp3';
 for (let x = 8; x < len + 80; x += urban > .5 ? 26 : 45) P(urban > .2 || type !== 'coach' ? lampK : 'pole', x + rnd() * 3);
 if (urban < .5) for (let x = 20; x < len + 80; x += 60) P('pole', x + rnd() * 10);
 W.stops.forEach((s, i) => { const term = i === 0 || i === W.stops.length - 1; if (!term || type !== 'coach'){ P('shelter', s.x - 1.5); P('stopsign', s.x + 3.2); } P('dirsign', s.x - 22); if (urban > .4){ P('bench', s.x - 6); P('bin', s.x + 5); } });
 W.cps.forEach(c => { P('jersey', c.x - 7, {front:1}); P('cone', c.x - 3.4, {front:1}); P('cone2', c.x + 12, {front:1}); P('barrier', c.x + 7); P('fence', c.x - 12); });
 W.lights.forEach(l => { P('tlight', l.x + 1, {tl:l}); P('plight', l.x - 7); W.decals.push({k:'zebra', x:l.x - 4, w:4.2}); });
 W.rests.forEach(r => { P('planter', r.x - 9); P('bench', r.x + 11); P('planter', r.x + 16); P('bin', r.x - 12); });
 W.gas.forEach(g => P('fuel', g.x));
 if (urban > .4) for (let k = 0; k < len / 60; k++){ const x = 30 + rnd() * (len - 60); const kk = ['bin','hydrant','planter','meter','bollard','bench','hydrant','planter'][(rnd() * 8) | 0]; if (W.props.every(q => Math.abs(q.x - x) > 3)) P(kk, x); }
 for (let k = 0; k < len / 90; k++){ const x = 30 + rnd() * (len - 60); W.decals.push({k:rnd() < .5 ? 'manhole' : 'drain', x, w:rnd() < .5 ? 1.1 : 1.6}); }
 if (route.biome === 'mokattam' || route.biome === 'upper') for (let k = 0; k < len / 150; k++) W.decals.push({k:'patch', x:30 + rnd() * (len - 60), w:6 + rnd() * 8});
 W.props.sort((a, b) => a.x - b.x);
}

/* ---------------- Vehicle physics ----------------
   Rigid chassis + sprung wheels built from the sprite's measured wheel
   centres, so every wheel sits exactly in its arch. Impulse tyre model,
   automatic gearbox with torque curve, aero drag, rolling resistance,
   load-dependent mass, brake wear, suspension damage & flat tyres. */
const GEARS = [3.6, 2.15, 1.45, 1.0, .78];
function vehGeom(spr, len, mirror){
 const m = META[spr], s = len / m.w, hw = m.w / 2, hh = m.h / 2;
 const X = px => (px - hw) * s * (mirror ? -1 : 1), Y = py => (hh - py) * s;
 const wheels = m.wheels.map(w => ({x:X(w[0]), y:Y(w[1]), r:w[2] * s, px:w[0], py:w[1], pr:w[2]}));
 const wy = Math.min(...wheels.map(w => w.y));
 return {s, len, h:m.h * s, yb:wy + wheels[0].r * .35, yt:hh * s, wheels, spr, mirror};
}
function makeCar(opt){
 const g = opt.geom, c = {opt, g, spr:g.spr, mirror:g.mirror};
 c.base = opt.mass; c.m = opt.mass; c.L = g.len; c.yt = g.yt; c.yb = g.yb;
 c.acc = opt.acc; c.vmax = opt.vmax; c.mu = opt.mu || 1; c.brk = opt.brk || 7; c.air = opt.air || 1.2; c.armor = opt.armor || 1;
 c.f = opt.f || 1.6; c.travel = opt.travel || .16; c.zeta = opt.zeta || .45; c.rest = .25;
 const n = g.wheels.length, mw = opt.mass * .05 / n * 2;
 c.k = (opt.mass / n) * Math.pow(2 * Math.PI * c.f, 2); c.cd = 2 * c.zeta * Math.sqrt(c.k * opt.mass / n); c.kl = c.k * 30; c.cl = 2 * .8 * Math.sqrt(c.kl * mw); c.kb = c.k * 12;
 const sag = 9.81 / Math.pow(2 * Math.PI * c.f, 2);
 const x = opt.x, gy = terrH(x);
 const low = Math.min(...g.wheels.map(w => w.y - w.r));
 c.x = x; c.y = gy - low + .02; c.a = 0; c.vx = opt.vx || 0; c.vy = 0; c.w = 0;
 c.wh = g.wheels.map(w => ({ax:w.x, ay:w.y + c.rest - sag, x:x + w.x, y:c.y + w.y, vx:c.vx, vy:0, r:w.r, r0:w.r, m:mw, I:.55 * mw * w.r * w.r, om:c.vx / w.r, rot:Math.random() * 6, ground:false, comp:0, flat:false, slip:0}));
 c.hull = [[-g.len / 2, c.yb, 0], [g.len / 2, c.yb, 0], [-g.len / 2, g.yt, 1], [g.len / 2, g.yt, 1], [0, g.yt, 1], [-g.len / 4, g.yt, 1], [g.len / 4, g.yt, 1], [-g.len / 2, (c.yb + g.yt) / 2, 0], [g.len / 2, (c.yb + g.yt) / 2, 0]];
 c.I0 = opt.mass * (g.len * g.len + g.h * g.h) / 12 * .8; c.I = c.I0;
 c.grounded = 0; c.roof = false; c.impacts = []; c.gear = 1; c.rpm = .1; c.shiftT = 0; c.rev = false; c.dmgFx = 0;
 return c;
}
function setLoad(c, kg){ c.m = c.base + kg; c.I = c.I0 * c.m / c.base; }
/* ctl: {gas, brake, hold, power, aiV (signed target speed for AI), grip} */
function physStep(c, h, ctl){
 const g = 9.81, ca = Math.cos(c.a), sa = Math.sin(c.a), dx = sa, dy = -ca, n = c.wh.length;
 const gas = ctl.gas || 0, brake = ctl.brake || 0, power = ctl.power == null ? 1 : ctl.power;
 c.vy -= g * h;
 // gearbox
 const vlin0 = c.wh[0].om * c.wh[0].r, sp = Math.abs(vlin0);
 const gr = GEARS[c.gear - 1], top = c.vmax;
 c.rpm = clamp(sp / top * gr / GEARS[4] * .75 + .12, .12, 1.05);
 if (c.shiftT > 0) c.shiftT -= h;
 else if (ctl.aiV == null){ if (c.rpm > .9 && c.gear < 5 && !c.rev){ c.gear++; c.shiftT = .22; } else if (c.rpm < .42 && c.gear > 1){ c.gear--; c.shiftT = .12; } }
 const torqueCurve = clamp(.72 + .55 * c.rpm - .45 * c.rpm * c.rpm, .35, 1);
 const gearMul = clamp(gr / GEARS[2], .75, 1.6);
 for (const w of c.wh){
  w.vy -= g * h;
  const Ax = c.x + w.ax * ca - w.ay * sa, Ay = c.y + w.ax * sa + w.ay * ca, Px = Ax + dx * c.rest, Py = Ay + dy * c.rest;
  const ex = w.x - Px, ey = w.y - Py, s = ex * dx + ey * dy, lx = ex - dx * s, ly = ey - dy * s;
  const rx = Px - c.x, ry = Py - c.y, vcx = c.vx - c.w * ry, vcy = c.vy + c.w * rx;
  const rvx = w.vx - vcx, rvy = w.vy - vcy, rvd = rvx * dx + rvy * dy, rlx = rvx - dx * rvd, rly = rvy - dy * rvd;
  let fs = -(c.k * s + c.cd * rvd);
  if (s < -c.travel){ fs += c.kb * (-c.travel - s); if (rvd < -3.2) c.impacts.push({kind:'bottom', v:-rvd}); }
  if (s > c.travel * .9) fs -= c.kb * (s - c.travel * .9);
  const fx = dx * fs - c.kl * lx - c.cl * rlx, fy = dy * fs - c.kl * ly - c.cl * rly;
  w.vx += fx / w.m * h; w.vy += fy / w.m * h; c.vx -= fx / c.m * h; c.vy -= fy / c.m * h; c.w -= (rx * fy - ry * fx) / c.I * h; w.comp = s;
  const vlin = w.om * w.r;
  if (ctl.aiV != null){ // AI: wheel speed servo
   const tgt = ctl.aiV / w.r, dmax = c.acc * 2.2 / w.r * h * (Math.abs(tgt) < Math.abs(w.om) ? 2.5 : 1); w.om += clamp(tgt - w.om, -dmax, dmax);
  } else {
   const T = c.m * c.acc * power * w.r / n * gearMul * torqueCurve * (c.shiftT > 0 ? .25 : 1);
   const dir = c.rev ? -1 : 1;
   if (gas > 0){ const lim = c.rev ? clamp(1 - Math.max(0, -vlin) / 5, 0, 1) : clamp(1 - Math.pow(Math.max(0, vlin) / c.vmax, 2.4), 0, 1); w.om += dir * gas * T / w.I * h * lim; }
   if (gas > 0 && w.ground && !c.rev){ const mx = (Math.max(0, w.vtl || 0) + 1.4) * 1.1 / w.r; if (w.om > mx){ w.om = mx; c.tcT = .4; } }
   if (brake > 0){ const bf = brake * (c.brk * c.m / n * w.r) / w.I * h; if (Math.abs(vlin) > .25){ w.om -= Math.sign(w.om) * Math.min(Math.abs(w.om), bf); const vt = w.vtl || 0; if (w.ground && Math.abs(vt) > 1.5){ const mn = vt * .8 / w.r; if ((vt > 0 && w.om < mn) || (vt < 0 && w.om > mn)){ w.om = mn; c.absT = .4; } } } else w.om *= .5; }
   if (!gas && !brake){ const eb = (.3 + .55 * c.rpm) / w.r * h; w.om -= Math.sign(w.om) * Math.min(Math.abs(w.om), eb); }
   if (ctl.hold) w.om = 0;
  }
  w.om *= (1 - .015 * h);
 }
 const air = c.grounded === 0;
 if (ctl.aiV == null){ c.w += (gas - brake) * (c.rev ? -1 : 1) * c.air * h * (air ? 1 : .1); }
 c.w *= (1 - (air ? .15 : .6) * h);
 // aerodynamic drag & rolling resistance
 const v = Math.hypot(c.vx, c.vy), A = c.g.h * 2.3, drag = .5 * 1.2 * .6 * A * v * v / c.m;
 if (v > .01){ c.vx -= c.vx / v * drag * h; c.vy -= c.vy / v * drag * h; }
 c.x += c.vx * h; c.y += c.vy * h; c.a += c.w * h;
 let ground = 0; const grip = ctl.grip || 1;
 for (const w of c.wh){
  w.x += w.vx * h; w.y += w.vy * h; w.rot += w.om * h;
  const gy = terrH(w.x), sl = terrS(w.x), inv = 1 / Math.sqrt(1 + sl * sl), nx = -sl * inv, ny = inv;
  const dist = (w.y - gy) * ny, pen = w.r - dist; w.ground = false;
  if (pen > 0){
   w.x += nx * pen; w.y += ny * pen; ground++; w.ground = true;
   const vn = w.vx * nx + w.vy * ny; let jn = 0;
   if (vn < 0){ jn = -vn * w.m; w.vx -= nx * vn * 1.05; w.vy -= ny * vn * 1.05; if (-vn > 4.5) c.impacts.push({kind:'land', v:-vn}); }
   const tx = ny, ty = -nx, vt = w.vx * tx + w.vy * ty, slip = vt - w.om * w.r; w.vtl = vt;
   let j = -slip / (1 / w.m + w.r * w.r / w.I); const mu = c.mu * grip * (w.flat ? .55 : 1), mj = mu * (jn + w.m * g * h * 2.6); j = clamp(j, -mj, mj);
   w.vx += tx * j / w.m; w.vy += ty * j / w.m; w.om -= j * w.r / w.I; w.slip = Math.abs(slip);
   // rolling resistance
   w.om *= (1 - .012 * h);
  } else w.slip = 0;
 }
 c.grounded = ground;
 c.roof = false; const ca2 = Math.cos(c.a), sa2 = Math.sin(c.a);
 for (const p of c.hull){
  const rx = p[0] * ca2 - p[1] * sa2, ry = p[0] * sa2 + p[1] * ca2, px = c.x + rx, py = c.y + ry;
  const gy = terrH(px), sl = terrS(px), inv = 1 / Math.sqrt(1 + sl * sl), nx = -sl * inv, ny = inv, pen = (gy - py) * ny;
  if (pen > 0){
   c.x += nx * pen * .9; c.y += ny * pen * .9; if (p[2]) c.roof = true;
   const vpx = c.vx - c.w * ry, vpy = c.vy + c.w * rx, vn = vpx * nx + vpy * ny;
   if (vn < 0){
    const rn = rx * ny - ry * nx, j = -1.15 * vn / (1 / c.m + rn * rn / c.I);
    c.vx += nx * j / c.m; c.vy += ny * j / c.m; c.w += rn * j / c.I;
    const tx = ny, ty = -nx, vtt = vpx * tx + vpy * ty, rt = rx * ty - ry * tx; let jt = -vtt / (1 / c.m + rt * rt / c.I); jt = clamp(jt, -.6 * j, .6 * j);
    c.vx += tx * jt / c.m; c.vy += ty * jt / c.m; c.w += rt * jt / c.I;
    if (-vn > 2) c.impacts.push({kind:'body', v:-vn, lx:p[0], ly:p[1], roof:p[2]});
   }
  }
 }
}
const speedOf = c => Math.hypot(c.vx, c.vy);
/* car-to-car collision along the lane (1D impulse with restitution) */
function collide(a, b){
 const ea = [a.x - a.L / 2, a.x + a.L / 2], eb = [b.x - b.L / 2, b.x + b.L / 2];
 if (ea[1] < eb[0] || eb[1] < ea[0]) return 0;
 if (Math.abs(a.y - b.y) > (a.yt - a.yb + b.yt - b.yb) * .6) return 0;
 const front = a.x < b.x; const ov = front ? ea[1] - eb[0] : eb[1] - ea[0]; if (ov <= 0) return 0;
 const rv = front ? a.vx - b.vx : b.vx - a.vx; const tm = a.m + b.m;
 const pa = ov * b.m / tm, pb = ov * a.m / tm; const s = front ? 1 : -1;
 a.x -= s * pa; b.x += s * pb; a.wh.forEach(w => w.x -= s * pa); b.wh.forEach(w => w.x += s * pb);
 if (rv > 0){ const e = .25, J = (1 + e) * rv / (1 / a.m + 1 / b.m); const da = s * J / a.m, db = s * J / b.m;
  a.vx -= da; b.vx += db; a.wh.forEach(w => { w.vx -= da; w.om = w.vx / w.r; }); b.wh.forEach(w => { w.vx += db; w.om = w.vx / w.r; }); a.w += (front ? -1 : 1) * rv * .02; }
 return rv;
}
