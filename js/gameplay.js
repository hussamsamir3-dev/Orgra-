"use strict";
const G = {mode:'menu', car:null, ai:[], amb:[], walkers:[], onboard:[], time:0, tod:'day', weather:'clear'};
const key = {gas:false, brake:false};
const PAX_KG = 75;
const doorX = () => G.car.x + G.V.door * G.car.L * Math.cos(G.car.a);
const STOP_TOL = () => ({micro:2.8, bus:4, coach:6})[G.V.cls];
const seatsOf = V => V.seats + V.stand;
function kmPerM(){ return W.route.km / W.len; }
/* ---------- build a player car from the saved garage state ---------- */
function playerCar(vid, x, test){
 const V = VBY(vid), gv = GV(vid), u = k => test ? 0 : (gv.up[k] || 0), cond = test ? {body:100, engine:100, susp:100, tyres:100, brakes:100, oil:100, clean:100} : gv.cond;
 const geom = vehGeom(V.spr, V.len);
 const car = makeCar({geom, mass:V.mass, acc:V.acc * (1 + .1 * u('engine') + .04 * u('gear')) * (.55 + .45 * cond.engine / 100), vmax:V.vmax * (1 + .045 * u('gear')), mu:1.05 * (1 + .07 * u('tires')) * (.7 + .3 * cond.tyres / 100),
  brk:V.brk * (1 + .1 * u('brakes')) * (.45 + .55 * cond.brakes / 100), f:V.f, travel:V.travel + .02 * u('susp'), zeta:(.4 + .04 * u('susp')) * (.6 + .4 * cond.susp / 100), armor:1 - .1 * u('armor'), x});
 car.player = true; const cos = gv.cos; car.rim = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh;
 car.cv = buildPlayerCanvas(vid, cos, test ? {clean:100} : cond, test ? [] : gv.dents); car.dents = test ? [] : gv.dents; car.baked = !!V.baked; lightFlags(car);
 const gl = COS.glow.find(g => g.id === cos.glow); car.glow = gl && gl.c; car.rack = !!(cos.rack && V.rack); car.lightCol = COS.lights.find(l => l.id === cos.lights).c; car.horn = cos.horn;
 return car;
}
/* ---------- start a trip ---------- */
function startRoute(route, opt){
 opt = opt || {}; const attract = !!opt.attract, test = !!opt.test;
 const vid = opt.vid || S.sel; const V = VBY(vid); G.V = V; G.vid = vid; G.test = test;
 genWorld(route, (Math.random() * 1e9) | 0);
 G.route = route; G.mode = attract ? 'attract' : 'play'; G.time = 0; G.onboard = []; G.walkers = []; G.ai = []; G.amb = []; G.peds = [];
 const car = playerCar(vid, W.stops[0].x - V.door * V.len, test); G.car = car;
 G.tod = opt.tod || (attract ? 'sunset' : pickTod()); G.weather = opt.weather || (attract ? 'clear' : pickWeather(route));
 G.rainT = G.weather === 'rain' ? 1 : 0; cam.x = car.x + 6; cam.y = car.y; cam.y0 = car.y; cam.zoom = 1; calcPPM();
 G.nextIdx = 0; G.dwell = 0; G.queueT = 0; G.finished = false; G.ended = false; G.paused = false; G.doorOpen = false; G.engOn = attract; G.crank = 0;
 G.belt = attract; G.wiper = false; G.cruise = 0; G.cond = test ? {engine:100} : GV(vid).cond;
 car.headOn = G.tod === 'night' && attract; car.ind = 0; car.haz = false;
 G.T = {fares:0, tips:0, cargo:0, fines:0, fineList:[], rest:0, fuelL:0, delivered:0, missed:0, comfortSum:0, comfortN:0, fee:0, meters:0, hits:0, pro:0};
 G.comfort = 100; G.alert = 100; G.evT = 16 + Math.random() * 10; G.side = null; G.overT = 0; G.upsideT = 0; G.fuelOutT = 0; G.rest = null; G.warned = {}; G.holesHit = new Set(); G.cp = null; G.pedX = null; G.ambEv = null; G.hbrake = false;
 G.cabin = BIOME[route.biome].temp - (G.tod === 'night' ? 7 : 0); G.ac = false; G.acSet = 22; G.temp = attract ? 88 : 62; G.odo = 0; G.lastX = car.x;
 G.fuelMax = V.tank * (1 + .2 * (test ? 0 : upl(vid, 'tank'))); G.fuel = test || attract ? G.fuelMax : Math.min(G.fuelMax, GV(vid).fuel);
 G.parcels = (opt.parcels || []).map(p => Object.assign({}, p)); G.store = V.store * (1 + .2 * (test ? 0 : upl(vid, 'store'))) + (car.rack ? 150 : 0);
 G.radioOn = attract ? false : S.radio.on;
 PARTS.length = 0; FLOATS.length = 0;
 // passengers waiting (uploaded walking characters)
 const n = W.stops.length, cap = seatsOf(V), npeds = META.peds.length;
 W.stops.forEach((st, i) => { st.waiting = []; st.served = false; st.missed = false; if (i === n - 1) return; let cnt;
  if (V.cls === 'coach') cnt = Math.round(V.seats * (.75 + Math.random() * .25)); else if (i === 0) cnt = Math.round(Math.min(cap, V.seats * 1.1) * (.55 + Math.random() * .4)); else cnt = V.cls === 'micro' ? 1 + ((Math.random() * 5) | 0) : 4 + ((Math.random() * 12) | 0);
  for (let k = 0; k < cnt; k++){ const j = route.type === 'coach' ? n - 1 : Math.min(n - 1, i + 1 + Math.floor(Math.pow(Math.random(), 1.4) * (n - 1 - i))); st.waiting.push({t:(Math.random() * npeds) | 0, h:1.62 + Math.random() * .2, dest:j, music:Math.random()}); } });
 // ambient pedestrians on the sidewalk
 if (BIOME[route.biome].urban > .3) for (let k = 0; k < W.len / 28; k++) G.amb.push({t:(Math.random() * npeds) | 0, x:Math.random() * W.len, face:Math.random() < .5 ? 1 : -1, spd:1 + Math.random() * .6, d:Math.random() * 3, h:1.6 + Math.random() * .22});
 W.cps.forEach(c => { c.ox = c.x - 1; c.oFrame = 0; c.oFace = -1; c.state = 'idle'; c.hold = 0; });
 W.lights.forEach(l => { l.ran = false; }); W.radars.forEach(r => { r.done = false; r.flash = 0; });
 if (!attract){ buildTrack(); if (!test){ const fee = TERMINAL_FEE[route.type]; G.T.fee = fee; } }
 setLoad(car, 0); v2world(); G.fan = 0; G.recirc = false; G.vent = 'face'; G.defrost = false; G.fog = 0; G.talkT = 5; BUB.length = 0; if (G.tod === 'night') car.headOn = true;
}
function pickTod(){ const h = new Date().getHours(); const r = Math.random(); if (r < .5) return h >= 19 || h < 5 ? 'night' : h >= 17 ? 'sunset' : 'day'; return r < .72 ? 'day' : r < .86 ? 'sunset' : 'night'; }
function pickWeather(route){ const r = Math.random(), b = route.biome; if (['desert','redsea','sinai','upper'].includes(b)) return r < .18 ? 'sand' : 'clear'; if (['city','nile','alex','mokattam','ring'].includes(b)) return r < (b === 'alex' ? .3 : .15) ? 'rain' : 'clear'; return 'clear'; }
function toast(msg, cls, acts, life){ toastUI(msg, cls, acts, life); }
/* ---------- the frame update ---------- */
function update(dt){
 const car = G.car, full = G.mode === 'play'; G.time += dt;
 let gas = 0, brake = 0;
 if (full){ gas = (key.gas || G.gasT) ? 1 : 0; brake = (key.brake || G.brakeT) ? 1 : 0; if (G.blink > 0){ G.blink -= dt; gas = 0; } }
 else { gas = car.a > .42 ? 0 : 1; if (car.a > .42 && car.grounded === 0) brake = 1; if (car.x > W.len - 90) startRoute(G.route, {attract:true, vid:G.vid}); }
 // cruise control
 if (full && G.cruise){ if (brake){ G.cruise = 0; toast(t('cruiseOff')); } else if (!gas){ const v = car.vx; gas = v < G.cruise - .15 ? clamp((G.cruise - v) * .6, .15, 1) : 0; if (v > G.cruise + 1.2) brake = .3; } }
 if (full && !G.engOn){ gas = 0; }
 let hold = false;
 if (G.rest || G.finished || G.ended || (G.cp && G.cp.state === 'check')) { gas = 0; brake = 0; hold = !G.ended || speedOf(car) < 3; }
 if (full && G.nextIdx === 0 && W.stops[0] && !W.stops[0].served && !G.doorOpen) { /* boarding lock until first stop served */ if (G.T.delivered === 0 && W.stops[0].waiting.length) { gas = 0; hold = true; } }
 if (full && G.doorOpen && speedOf(car) < 1) hold = true;
 if (G.hbrake) hold = true;
 if (G.fuel <= 0) gas = 0;
 G.gas = gas; G.brake = brake; car.braking = brake > 0 || (hold && G.mode === 'play');
 let pm = 1; if (G.temp > 112){ pm *= .6; } if (G.cond.engine < 40) pm *= .8;
 // load (passengers + parcels + luggage)
 const cargoKg = (typeof invKg === 'function' ? invKg(G.vid) : 0) + G.parcels.filter(p => p.on).reduce((a, p) => a + p.kg, 0) + (G.V.cls === 'coach' ? G.onboard.length * 14 : 0); car.cargoKg = cargoKg; setLoad(car, G.onboard.length * PAX_KG + cargoKg);
 const grip = G.weather === 'rain' ? .78 : G.weather === 'sand' ? .88 : 1;
 const n = Math.min(40, Math.ceil(dt * 600)), h = dt / n; const pvx = car.vx, pvy = car.vy;
 for (let i = 0; i < n; i++) physStep(car, h, {gas, brake, power:pm, hold, grip});
 const spd = speedOf(car);
 // AI traffic
 updateAI(dt);
 // impacts → mechanical & visual damage
 let worst = 0; const test = G.test || !full;
 for (const im of car.impacts){
  const tf = ({micro:1, bus:.75, coach:.65})[G.V.cls] * car.armor;
  if (im.kind === 'body'){ const d = (im.v - 2) * 2.6 * tf; worst = Math.max(worst, im.v); if (!test){ G.cond.body = clamp(G.cond.body - d, 0, 100); if (im.roof || im.v > 7) G.cond.engine = clamp(G.cond.engine - d * .25, 0, 100); } addDent(car, im.lx + (Math.random() - .5) * .5, im.ly + (im.ly > 0 ? -.3 : .3), im.v, im.roof && im.v > 5);
   const ca = Math.cos(car.a), sa = Math.sin(car.a), px = car.x + im.lx * ca - im.ly * sa, py = car.y + im.lx * sa + im.ly * ca; for (let k = 0; k < 8; k++) puff(px, py, (Math.random() - .5) * 6, Math.random() * 5, .5, .04, '#FFD24A', 'spark'); if (im.v > 6) for (let k = 0; k < 6; k++) puff(px, py, (Math.random() - .5) * 4, Math.random() * 4, .8, .03, '#cfe6ff', 'glass'); }
  else if (im.kind === 'land'){ worst = Math.max(worst, im.v * .7); if (!test) G.cond.susp = clamp(G.cond.susp - Math.max(0, im.v - 5) * 1.2 * tf, 0, 100); breakParcels(im.v); }
  else { worst = Math.max(worst, im.v * .6); if (!test) G.cond.susp = clamp(G.cond.susp - Math.max(0, im.v - 3.5) * .8 * tf, 0, 100); breakParcels(im.v * .8); }
 }
 car.impacts.length = 0; if (worst > 4 && full && G.onboard.length && Math.random() < .5 && (G.talkT || 0) < 3){ G.talkT = 8; say(pick(DLG.bump), car.x, car.y + car.yt + .9); }
 if (worst > 2.5 && G.time - (G.lastThud || 0) > .15){ AU.thud(worst); G.lastThud = G.time; cam.shake = Math.min(1, worst / 12); if (full && G.onboard.length) G.comfort -= worst * 1.6; }
 if (full){
  const acc = Math.hypot(car.vx - pvx, car.vy - pvy) / dt;
  if (car.grounded === 0) G.comfort -= 6 * dt; if (Math.abs(car.a) > .38) G.comfort -= 5 * dt; if (acc > 10) G.comfort -= (acc - 10) * .06;
  if (car.grounded && acc < 6 && Math.abs(car.a) < .25) G.comfort += 1.2 * dt;
  // cabin climate (A/C)
  acStep(dt);
  
  if (radioAudible() && G.onboard.length){ const vol = S.set.radio; if (vol > .85) G.comfort -= .5 * dt; else G.comfort += (.25 + .08 * upl(G.vid, 'audio')) * dt; }
  if (G.doorOpen && spd > 2){ G.comfort -= 4 * dt; if (!G.warned.door){ G.warned.door = 1; toast(t('doorDrive'), 'bad'); } } else G.warned.door = 0;
  G.comfort = clamp(G.comfort, 0, 100); if (G.onboard.length){ G.T.comfortSum += G.comfort * dt; G.T.comfortN += dt; }
  // engine temperature
  const amb = BIOME[W.route.biome].temp; const heat = 82 + gas * car.rpm * 26 + (100 - G.cond.engine) * .25 + (G.cond.oil < 20 ? 12 : 0) + (amb - 30) * .35 + (G.ac ? 4 : 0) - Math.min(spd, 20) * .35; G.temp += ((G.engOn ? heat : amb) - G.temp) * dt * .06;
  if (G.temp > 112 && !G.warned.hot){ G.warned.hot = 1; toast(t('overheat'), 'bad'); } if (G.temp < 100) G.warned.hot = 0;
  if (G.temp > 112){ if (!G.test) G.cond.engine = clamp(G.cond.engine - dt * .4, 0, 100); if (Math.random() < .5) puff(car.x + car.L * .42, car.y + car.yt * .6, rnd(-.3, .3), 1.2, 1.2, .1, '#e8eef4', 'smoke'); }
  if (car.type === 'coach' || G.V.cls === 'coach'){ if (!G.rest){ G.alert = Math.max(0, G.alert - dt * 100 / 260); if (G.alert < 30 && Math.random() < dt * (30 - G.alert) / 60) G.blink = .45; } }
  $('#fatigue').style.opacity = G.V.cls === 'coach' ? (G.blink > 0 ? .95 : clamp((40 - G.alert) / 50, 0, .7)) : 0;
  // fuel (realistic litres, driven by real kilometres covered)
  const dxm = Math.max(0, car.x - G.lastX); G.lastX = Math.max(G.lastX, car.x); const km = dxm * kmPerM(); G.odo += km; G.T.meters += dxm;
  const load = 1 + (car.m - car.base) / car.base * .35; let burn = G.V.lp100 / 100 * km * (.55 + .8 * gas * car.rpm) * load * acFuel();
  if (G.engOn) burn += .00035 * dt * (G.V.lp100 / 12) * acFuel() * 1.2;
  G.fuel = Math.max(0, G.fuel - burn); G.T.fuelL += burn;
  if (G.fuel < G.fuelMax * .12 && !G.warned.fuel){ G.warned.fuel = 1; toast(t('fuelLow'), 'bad'); }
  if (G.fuel <= 0 && spd < .4 && !G.walkFuel && !G.fuelAsk){ G.fuelOutT += dt; if (G.fuelOutT > 1.2) fuelOutPrompt(); }
  if (car.roof && Math.cos(car.a) < .3) endRun('crash');
  if (Math.cos(car.a) < -.1){ G.upsideT += dt; if (G.upsideT > 1.2) endRun('crash'); } else G.upsideT = 0;
  if (!G.test && G.cond.body <= 0 && G.cond.engine <= 5) endRun('broke');
  gameplay(dt, spd);
  if (G.crank > 0){ G.crank -= dt; if (G.crank <= 0){ G.engOn = true; $('#startBtn').classList.remove('on'); } }
 }
 // exhaust, dust, smoke
 const ca = Math.cos(car.a), sa = Math.sin(car.a), ex = car.x - car.L / 2 * ca - (car.yb + .1) * sa, ey = car.y - car.L / 2 * sa + (car.yb + .1) * ca;
 if (G.engOn && Math.random() < (gas ? .9 : .25)) puff(ex, ey, -1 - Math.random(), .4 + Math.random() * .5, gas ? 1.1 : .7, gas ? .09 : .05, G.V.cls === 'micro' && gas ? '#2a2a2a' : '#8a8f96', 'smoke');
 for (const w of car.wh) if (w.ground && (w.slip > 1.6 || (spd > 6 && BIOME[W.route.biome].urban < .2 && Math.random() < .5))) puff(w.x - w.r * .5, w.y - w.r, -Math.random() * 2, Math.random() * 1.5, .9, .12, W.biome.ground, 'dust');

 if (full && G.cond.engine < 45 && Math.random() < (45 - G.cond.engine) / 60){ puff(car.x + car.L * .38 * ca - (car.yt - .4) * sa, car.y + car.L * .38 * sa + (car.yt - .4) * ca, rnd(-.5, .5), 1 + Math.random(), 1.4, .12, G.cond.engine < 20 ? '#1a1a1a' : '#9aa0a8', 'smoke'); }
 updParts(dt);
 // ambient pedestrians
 for (const p of G.amb){ p.x += p.face * p.spd * dt; p.d += p.spd * dt; if (p.x < car.x - 90) p.x += 180; if (p.x > car.x + 90 && p.face > 0 && Math.random() < .01) p.face = -1; }
 // walkers (boarding / alighting passengers)
 for (let i = G.walkers.length - 1; i >= 0; i--){ const w = G.walkers[i]; const dxw = w.tx - w.x, step = w.spd * dt; w.d += step; w.face = dxw > 0 ? 1 : -1; if (w.ty != null) w.y += (w.ty - w.y) * Math.min(1, dt * 2.5);
  if (Math.abs(dxw) <= step){ w.x = w.tx; if (w.done){ w.done(); w.done = null; } if (w.fade){ w.a = (w.a ?? 1) - dt * 2.5; if (w.a <= 0) G.walkers.splice(i, 1); } else if (!w.stay) G.walkers.splice(i, 1); } else w.x += Math.sign(dxw) * step; }
 // camera
 const look = clamp(car.vx * .5, -6, 14); cam.x += (car.x + look + car.L * .3 - cam.x) * Math.min(1, dt * 2.6); cam.y += (car.y + 1.4 - cam.y) * Math.min(1, dt * 3.2);
 const zt = 1 - clamp(spd / 40, 0, .14); if (Math.abs(zt - cam.zoom) > .002){ cam.zoom += (zt - cam.zoom) * dt; calcPPM(); }
 cam.shake = Math.max(0, cam.shake - dt * 2.5);
 v2tick(dt, spd, full);
 AU.engine(G.engOn && !G.ended && G.fuel > 0 && G.mode !== 'menu', car.rpm, gas, spd, G.V.cls !== 'micro', G.weather === 'rain');
 if (car.rev && G.V.cls !== 'micro' && Math.abs(car.vx) > .2 && Math.floor(G.time * 2) !== G._bp){ G._bp = Math.floor(G.time * 2); if (G._bp % 2) AU.beep(); }
}
function breakParcels(v){ if (v < 6) return; for (const p of G.parcels) if (p.on && p.fragile && !p.broken && Math.random() < (v - 6) * .15){ p.broken = true; toast(t('parcelBroken'), 'bad'); } }
/* ---------- gameplay systems ---------- */
function gameplay(dt, spd){
 const car = G.car, dxp = doorX(), tol = STOP_TOL(), V = G.V, stopped = spd < .7 && car.grounded > 0, front = car.x + car.L / 2;
 // ----- stops -----
 const st = W.stops[G.nextIdx];
 if (st && !G.rest){
  const inZone = Math.abs(dxp - st.x) < tol;
  const lastS = st.i === W.stops.length - 1, alight = G.onboard.some(p => p.dest <= st.i) || lastS;
  if (!G.warned['rq' + st.i] && st.x - dxp < 70 && st.x - dxp > 15 && alight && G.onboard.length){ G.warned['rq' + st.i] = 1; say([['على جنب هنا يا أسطى','Drop me here, driver'],['هنا لو سمحت','Here please']][Math.random() < .5 ? 0 : 1], car.x, car.y + car.yt + .9); }
  if (inZone && stopped){ G.dwell += dt; const need = st.waiting.length || alight || G.parcels.some(p => p.on && p.dest <= st.i); if (G.dwell > .5 && !G.doorOpen && !st.served){ if (need) setDoor(true); else { st.served = true; G.nextIdx++; G.dwell = 0; refreshTrack(); toast(LANG === 'ar' ? 'مفيش حد نازل ولا طالع — كمّل' : 'Nobody getting on or off — carry on', 'gold'); } } }
  else G.dwell = 0;
  if (G.doorOpen && inZone && stopped){ G.queueT -= dt; if (G.queueT <= 0) serveStop(st); }
  if (inZone && stopped && G.dwell > .3 && speedOf(car) < .2 && !G.warned['pro' + st.i] && Math.abs(dxp - st.x) < tol * .5){ G.warned['pro' + st.i] = 1; G.T.pro++; floatTxt(car.x, car.y + 3, '👍', '#7CFC9A'); }
  if (dxp > st.x + tol + 2.5 && !st.served){
   if (st.i === W.stops.length - 1){ if (!G.warned['back' + st.i]){ G.warned['back' + st.i] = 1; toast(t('backUp'), 'bad'); } if (dxp > st.x + 40) finishLine(true); }
   else { const riders = G.onboard.filter(p => p.dest === st.i); if (riders.length || st.waiting.length){ toast(t('missed'), 'bad'); } riders.forEach(p => { p.dest = st.i + 1; p.angry = true; }); G.comfort -= 6 * riders.length; G.T.missed++; st.missed = true; st.served = true; st.waiting = []; G.nextIdx++; refreshTrack(); }
  }
 }
 // ----- rest houses -----
 for (const r of W.rests){ if (r.used) continue;
  if (Math.abs(car.x - r.x) < 14 && stopped && !G.rest) openRest(r);
  if (car.x > r.x + 22){ r.used = true; G.comfort -= 10; refreshTrack(); }
  if (!G.warned['r' + r.x] && r.x - car.x < 260 && r.x > car.x){ G.warned['r' + r.x] = 1; toast(t('restAhead') + ': ' + nm(r.name), 'gold'); } }
 // ----- police checkpoint (كمين) with the animated traffic officer -----
 for (const c of W.cps){
  const d = c.x - front;
  if (c.state === 'idle' && d < 60 && d > 0){ c.state = 'signal'; c.t = 0; toast(t('cpAhead'), 'bad'); AU.whistle(); }
  if (c.state === 'signal'){ c.t += dt; c.oFrame = Math.min(4, 2 + Math.floor(c.t * 3)); c.oFace = -1;
   if (d < 18 && d > 4 && stopped){ c.state = 'check'; c.t = 0; G.cp = c; c.plan = typeof cpPlan === 'function' ? cpPlan(c) : null; say(pick(DLG.officer.slice(0, G.belt ? 1 : 2)), c.ox, terrH(c.ox) + 3.1, '#ffd35a'); }
   else if (d < 3){ c.state = 'done'; addFine('run', true); c.oFrame = 6; } }
  else if (c.state === 'check'){ c.t += dt; c.oFrame = c.t < .5 ? 1 : 7; c.oFace = 1; 
   if (c.t > (c.plan ? c.plan.dur : 1.8)){ c.state = 'done'; c.doneT = 0; G.cp = null; const fs = [];  if (G.tod === 'night' && !car.headOn) fs.push('lights'); if (G.doorOpen) fs.push('door'); if (!G.test && Date.now() - GV(G.vid).inspT > 14 * DAY) fs.push('insp'); if (!G.test && (S.lic.suspUntil > Date.now() || !hasLic(G.V.cls) || licExpired())) fs.push('lic'); if (!G.test && vlicExpired(G.vid)) fs.push('vlic');
    if (fs.length){ fs.forEach(k => addFine(k, false)); AU.whistle(); } else { toast(t('cpOk'), 'good'); G.T.pro++; } c.oFrame = 5; } }
  else if (c.state === 'done'){ if (d < -20) c.oFrame = 0; }
 }
 // ----- traffic lights -----
 for (const l of W.lights){ const line = l.x - 3.2, s = lightState(l);
  if (!l.warned && line - front < 70 && line > front){ l.warned = 1; if (s !== 'g') toast(t('redAhead'), 'gold'); }
  if (!l.ran && front > line && front - car.vx * dt <= line){ if (s === 'r'){ l.ran = true; addFine('red', true); } } }
 // ----- fuel stations -----
 let nearGas = null; for (const g of W.gas) if (Math.abs(car.x - g.x) < 12 && stopped) nearGas = g;
 const pr = $('#prompt'); if (nearGas && !G.rest && !G.test){ const need = Math.max(0, G.fuelMax - G.fuel), cost = Math.ceil(need * DIESEL); pr.style.display = 'flex'; $('#promptTxt').textContent = t('refuel') + ' — ' + fmt(need, 1) + ' L · ' + money(cost); pr.onclick = () => { if (spend(cost, t('fix_fuel'), 'fuel')){ G.fuel = G.fuelMax; toast(t('refueled'), 'good'); pr.style.display = 'none'; } }; } else pr.style.display = 'none';
 // ----- speed cameras -----
 for (const r of W.radars){ r.flash = Math.max(0, (r.flash || 0) - dt);
  if (!r.warn && r.x - car.x < 220 && r.x > car.x){ r.warn = 1; toast(t('radar') + ' — ' + t('limit') + ' ' + fmt(r.limit) + ' ' + t('kmh'), 'gold'); }
  if (!r.done && car.x > r.x){ r.done = true; if (spd * 3.6 > r.limit + 3){ r.flash = .25; addFine('radar', true); AU.noiseHit(.1, 6000, .3); } } }
 // ----- potholes → flat tyres -----
 for (const hx of W.holes){ if (G.holesHit.has(hx)) continue; for (const w of car.wh) if (Math.abs(w.x - hx) < .5 && spd > 8){ G.holesHit.add(hx); const p = .08 + (100 - (G.test ? 100 : GV(G.vid).cond.tyres)) / 400; if (Math.random() < p && !w.flat){ w.flat = true; w.r = w.r0 * .9; toast(t('flat'), 'bad'); AU.noiseHit(.6, 2500, .4, 0, 'highpass'); } } }
 // ----- pedestrian crossing -----
 if (G.pedX){ const p = G.pedX; p.k += dt / 5.5; p.d += dt * 1.2; if (p.k >= 1){ if (!p.bad){ toast(t('pedOk'), 'good'); G.T.pro++; say(pick(DLG.ped), p.x, terrH(p.x) + 2.4); } G.pedX = null; }
  else if (p.k > .25 && p.k < .85 && front > p.x - .6 && car.x - car.L / 2 < p.x && !p.bad){ p.bad = true; addFine('ped', false); G.comfort -= 15; p.k = .9; } }
 // ----- side stop requests -----
 if (G.side){ G.side.t -= dt; if (stopped && G.doorOpen){ const p = G.side.p, idx = G.onboard.indexOf(p); if (idx >= 0){ G.onboard.splice(idx, 1); G.T.delivered++; const tip = Math.round(G.route.fare * .5 + 2); G.T.tips += tip; floatTxt(car.x, car.y + 2, '+' + fmt(tip), '#7CFC9A'); AU.coin(); G.walkers.push({t:p.t, h:p.h, x:doorX(), y:0, ty:1.85, tx:doorX() - 5, spd:1.3, d:0, fade:true}); toast(t('sideOk'), 'good'); } G.side = null; } else if (G.side.t <= 0){ G.comfort -= 8; G.side = null; } }
 // ----- random events -----
 G.evT -= dt; if (G.evT <= 0){ G.evT = 18 + Math.random() * 20; randomEvent(); }
 // ----- ambulance behind -----
 if (G.ambEv){ const a = G.ambEv.car; if (!a || a.gone){ G.ambEv = null; } else { const gap = car.x - car.L / 2 - (a.x + a.L / 2); if (gap < 18 && !G.ambEv.told){ G.ambEv.told = 1; toast(t('amb'), 'bad', null, 6); } if (G.ambEv.told){ G.ambEv.t += dt; if (spd < 1.2 && !G.ambEv.ok){ G.ambEv.ok = true; a.laneTo = 1; a.tgt = 19; toast(t('ambOk'), 'good'); G.T.pro += 2; S.xp += 20; } if (G.ambEv.t > 9 && !G.ambEv.ok && !G.ambEv.fined){ G.ambEv.fined = true; a.laneTo = 1; } } } }
}
function randomEvent(){
 const car = G.car, V = G.V, opts = [], nx = W.stops[G.nextIdx], far = nx && nx.x - car.x > 140;
 if (V.cls !== 'coach' && G.onboard.length > 2 && far) opts.push('side');
 if (V.cls !== 'coach' && G.onboard.length > 0) opts.push('change');
 if (W.biome.urban > .3 && !G.pedX) opts.push('ped', 'ped');
 if (!G.ambEv) opts.push('amb');
 if (G.onboard.length && !G.ac && G.cabin > 30) opts.push('hot');
 if (G.onboard.length && radioAudible()) opts.push(S.set.radio > .85 ? 'loud' : STATIONS[S.radio.st].g === 'calm' ? 'calmR' : 'like');
 if (!opts.length) return; const e = pick(opts);
 if (e === 'side'){ G.side = {p:pick(G.onboard), t:10}; toast(t('sideStop'), 'gold', null, 5); }
 else if (e === 'change') toast(t('change'), '', [[t('giveChange'), () => { G.comfort = Math.min(100, G.comfort + 4); }], [t('askPax'), () => { G.comfort -= 3; }]], 6);
 else if (e === 'ped'){ const x = car.x + car.L / 2 + 28 + Math.random() * 20; if (W.stops.some(s => Math.abs(s.x - x) < 15)) return; G.pedX = {x, k:0, d:0, t:(Math.random() * META.peds.length) | 0, h:1.65}; toast(t('ped'), 'bad'); }
 else if (e === 'amb'){ const spec = pick(AI_EMG); const a = spawnAI(spec, 0, car.x - car.L / 2 - 70, 1, {fast:true}); if (a){ a.siren = AIV[spec].siren; a.amb = true; a.special = 'amb'; G.ambEv = {car:a, t:0}; } }
 else if (e === 'hot') toast(t('hot'), 'gold');
 else if (e === 'loud') toast(t('loud'), 'gold');
 else if (e === 'calmR'){ say(pick(DLG.calm), G.car.x, G.car.y + G.car.yt + .9); G.comfort = Math.min(100, G.comfort + 4); }
 else if (e === 'like'){ toast(t('likeRadio'), 'good'); G.comfort = Math.min(100, G.comfort + 5); }
}
function addFine(k, camera){
 if (G.test) { toast(t('f' + k[0].toUpperCase() + k.slice(1)), 'bad'); return; }
 const amt = FINE[k], label = t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', vlic:'fVlic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed'}[k]);
 if (camera){ S.fines.push({k, amt, t:Date.now(), where:nm(W.route.from) + ' → ' + nm(W.route.to)}); S.lic.points += PTS[k] || 0; if (S.lic.points >= 12 && S.lic.suspUntil < Date.now()){ S.lic.suspUntil = Date.now() + DAY; } }
 else { G.T.fines += amt; G.T.fineList.push(label); S.lic.points += PTS[k] || 0; }
 S.stats.fines += amt; save(); toast('🚨 ' + label + ' — ' + money(amt), 'bad'); AU.whistle();
}
function setDoor(open){ if (G.doorOpen === open) return; G.doorOpen = open; AU.door(G.V.cls !== 'micro'); if (open) G.queueT = .35;  }
function serveStop(st){
 const car = G.car, V = G.V, last = st.i === W.stops.length - 1, fast = V.cls === 'coach' ? .07 : V.cls === 'bus' ? .2 : .32;
 // parcels for this stop
 const pc = G.parcels.find(p => p.on && (p.dest === st.i || (last && p.dest >= st.i))); if (pc){ pc.on = false; const pay = pc.broken ? Math.round(pc.pay * .4) : pc.pay; G.T.cargo += pay; floatTxt(doorX(), car.y + 2.6, '📦 +' + fmt(pay), '#FFD24A'); toast(t('parcelOk'), 'good'); AU.coin(); G.queueT = .5; return; }
 const off = G.onboard.findIndex(p => p.dest <= st.i || last);
 if (off >= 0){ const p = G.onboard.splice(off, 1)[0]; G.T.delivered++; if (Math.random() < .45) say(pick(p.angry || G.comfort < 45 ? DLG.alightBad : DLG.alightGood), doorX(), car.y + car.yt + .6);
  if (!p.angry && G.comfort > 55){ const bodyK = G.test ? 1 : .6 + .4 * GV(G.vid).cond.body / 100; const tip = V.cls === 'coach' ? Math.round((G.comfort - 55) / 45 * 20 * bodyK) : Math.round((G.comfort - 55) / 45 * 3 * 2 * bodyK) / 2; if (tip > 0){ G.T.tips += tip; floatTxt(doorX(), car.y + 2.2, '+' + fmt(tip, tip % 1 ? 1 : 0), '#7CFC9A'); } }
  G.walkers.push({t:p.t, h:p.h, x:doorX(), y:.1, ty:1.85, tx:doorX() + (Math.random() < .5 ? -1 : 1) * (4 + Math.random() * 4), spd:1.2 + Math.random() * .4, d:0, fade:true});
  G.queueT = fast; return; }
 if (!last && st.waiting.length && G.onboard.length < seatsOf(V)){
  const p = st.waiting.shift(); G.onboard.push(p); if (Math.random() < .3) say(pick(DLG.board), doorX(), car.y + car.yt + .6);
  if (V.cls === 'coach'){ G.T.fares += G.route.fare; if (G.onboard.length % 7 === 0){ floatTxt(doorX(), car.y + 2.4, '+' + fmt(G.route.fare * 7), '#FFD24A'); AU.coin(); } }
  else { G.T.fares += G.route.fare; floatTxt(doorX(), car.y + 2.4, '+' + fmt(G.route.fare, G.route.fare % 1 ? 1 : 0), '#FFD24A'); AU.coin(); }
  G.walkers.push({t:p.t, h:p.h, x:st.x - 2, y:1.8, ty:.2, tx:doorX(), spd:2, d:0, fade:true});
  G.queueT = fast; return; }
 st.served = true; setDoor(false); G.nextIdx++; G.dwell = 0; refreshTrack();
 if (last) finishLine(false); else { const nx = W.stops[G.nextIdx]; toast(t('next') + ': ' + nm(nx.name), 'gold'); }
}
/* ---------- AI traffic (uploaded vehicles, full physics) ---------- */
function spawnAI(spec, lane, x, dir){
 const A = AIV[spec]; const geom = vehGeom(A.spr, A.len, dir < 0);
 const c = makeCar({geom, mass:A.mass, acc:3, vmax:25, f:A.small ? 2.2 : 1.7, travel:.14, x, vx:0});
 c.tgt = rnd(A.v[0], A.v[1]) * dir; c.vx = c.tgt * .8; c.wh.forEach(w => { w.vx = c.vx; w.om = c.vx / w.r; });
 c.spec = spec; c.lane = lane; c.lift = lane ? .82 : 0; c.laneTo = lane; c.dir = dir; c.cv = spriteCanvas(A.spr); c.dents = []; c.stopT = 0; c.headOn = G.tod === 'night';
 G.ai.push(c); return c;
}
function updateAI(dt){
 const car = G.car, urban = W.biome.urban, dens = G.mode === 'attract' ? .6 : urban > .5 ? 1 : urban > .1 ? .7 : .45;
 const [x0, x1] = viewX();
 // spawn
 const near = G.ai.filter(a => a.lane === 0 && !a.amb && a.x > car.x), far = G.ai.filter(a => a.lane === 1);
 if (near.length < Math.round(2 * dens) && Math.random() < dt * .5 && G.mode !== 'attract'){ const x = x1 + rnd(10, 60); if (x < W.len - 60 && !W.stops.some(s => Math.abs(s.x - x) < 30)) spawnAI(pick([0,1,2,3,4,7,0,1,2,8,9,5,6]), 0, x, 1); }
 if (far.length < Math.round(4 * dens) && Math.random() < dt * 1.1){ if (Math.random() < .7) spawnAI(pick([0,1,2,3,4,5,6,7,8,9,0,1,2,3]), 1, x1 + rnd(5, 40), -1); else spawnAI(pick([1,3,5,6,7,0]), 1, x0 - rnd(5, 30), 1); }
 const n = Math.min(12, Math.ceil(dt * 240)), h = dt / n;
 for (let i = G.ai.length - 1; i >= 0; i--){ const a = G.ai[i];
  // driver model: target speed, gap keeping, lights, random pull-overs
  let v = a.tgt;
  if (a.lane === 0 && a.dir > 0){
   let lead = null, gap = 1e9; for (const b of [...G.ai, car]) if (b !== a && (b.lane || 0) === 0 && b.x > a.x){ const gg = b.x - b.L / 2 - (a.x + a.L / 2); if (gg < gap){ gap = gg; lead = b; } }
   if (lead){ v = Math.min(v, Math.max(0, (gap - 2.5) * .8 + (lead.vx || 0) * .5)); if (lead === car && gap < 12 && a.amb) v = Math.min(v, car.vx); }
   for (const l of W.lights){ const line = l.x - 3.2, d = line - (a.x + a.L / 2); if (d > -.5 && d < 30 && lightState(l) !== 'g') v = Math.min(v, Math.max(0, d * .5)); }
   if (!a.amb && AIV[a.spec].name === 'taxi' && a.stopT <= 0 && Math.random() < dt * .02 && a.x > car.x + 30) { a.stopT = 5; a.haz = true; }
   if (a.stopT > 0){ a.stopT -= dt; v = 0; if (a.stopT <= 0) a.haz = false; }
   if (G.honked && a.x > car.x && a.x - car.x < 35 && !a.amb){ a.laneTo = 1; a.tgt = Math.max(a.tgt, 15); a.stopT = 0; a.haz = false; }
  }
  if (a.laneTo !== a.lane){ a.lift += (a.laneTo ? 1 : -1) * dt * .7; if (a.lift >= .82){ a.lift = .82; a.lane = 1; } }
  a.braking = Math.abs(v) < Math.abs(a.vx) - .5;
  for (let k = 0; k < n; k++) physStep(a, h, {aiV:v});
  if (a.siren && Math.floor(G.time * 3) !== a._s){ a._s = Math.floor(G.time * 3); if (Math.abs(a.x - car.x) < 80) AU.siren(a.siren, G.time); }
  // collisions with the player (same lane)
  if (a.lane === 0 && a.lift < .3 && G.mode === 'play'){ const rv = collide(car, a); if (rv > 1.5 && G.time - (a.hitT || -9) > .6){ a.hitT = G.time; const front = car.x < a.x; addDent(car, (front ? 1 : -1) * car.L * .46, car.yb + .4, rv * 1.4); addDent(a, (front ? -1 : 1) * a.L * .46, a.yb + .35, rv * 1.4); AU.thud(rv * 2); cam.shake = Math.min(1, rv / 6); G.comfort -= rv * 5;
    if (!G.test) { GV(G.vid).cond.body = clamp(GV(G.vid).cond.body - rv * 2.5 * car.armor, 0, 100); if (front) GV(G.vid).cond.engine = clamp(GV(G.vid).cond.engine - rv * .6, 0, 100); }
    for (let k = 0; k < 10; k++) puff(front ? car.x + car.L / 2 : car.x - car.L / 2, car.y, rnd(-3, 3), rnd(0, 4), .5, .04, '#FFD24A', 'spark'); if (rv > 3 && front && !a.amb){ toast(t('crashAI'), 'bad'); addFine('crash', false); G.T.hits++; S.stats.crashes++; } } }
  if (a.x < car.x - 160 || a.x > car.x + 260 || Math.cos(a.a) < 0){ a.gone = true; G.ai.splice(i, 1); }
 }
 G.honked = false;
}
/* ---------- rest houses (coach) ---------- */
const REST_OPTS = [
 {k:'tea', i:'wash', n:['شاي ليك يا أسطى','Tea for you'], p:10, fx:() => { G.alert = Math.min(100, G.alert + 45); }},
 {k:'meal', i:'cash', n:['وجبة فول وطعمية','Foul & falafel meal'], p:60, fx:() => { G.alert = 100; }},
 {k:'round', i:'seat', n:['شاي للركاب على حسابك','Tea round for passengers'], p:() => G.onboard.length * 8, fx:() => { G.comfort = Math.min(100, G.comfort + 25); }},
 {k:'fix', i:'tyre', n:['تصليح الكاوتش','Fix flat tyres'], p:150, fx:() => { G.car.wh.forEach(w => { w.flat = false; w.r = w.r0; }); }},
 {k:'fuel', i:'fuel', n:['فوّل التانك','Refuel'], p:() => Math.ceil((G.fuelMax - G.fuel) * DIESEL), fx:() => { G.fuel = G.fuelMax; }},
 {k:'wash', i:'wash', n:['غسيل سريع','Quick wash'], p:60, fx:() => { if (!G.test){ GV(G.vid).cond.clean = 100; G.car.cv = buildPlayerCanvas(G.vid, GV(G.vid).cos, GV(G.vid).cond, GV(G.vid).dents); } }}
];
function openRest(r){ r.used = true; setDoor(true); G.rest = {r, t:60, out:[], called:false, bought:{}};
 const n = Math.min(10, G.onboard.length); for (let k = 0; k < n; k++){ const p = G.onboard[k]; const w = {t:p.t, h:p.h, x:doorX(), y:.1, ty:1.85, tx:r.x + 2 + k * .9, spd:1.5, d:0, stay:true}; G.walkers.push(w); G.rest.out.push(w); }
 renderRest(); $('#restM').classList.add('on'); refreshTrack(); }
function renderRest(){ const R = G.rest; if (!R) return; $('#restName').textContent = nm(R.r.name);
 $('#restOpts').innerHTML = REST_OPTS.map(o => { const p = typeof o.p === 'function' ? o.p() : o.p; return `<button class="ropt ${R.bought[o.k] ? 'done' : ''}" data-k="${o.k}">${icon(o.i)}<b>${nm(o.n)}</b><span>${R.bought[o.k] ? '✓' : money(p)}</span></button>`; }).join('');
 $$('#restOpts .ropt').forEach(b => b.onclick = () => { const o = REST_OPTS.find(q => q.k === b.dataset.k); if (R.bought[o.k]) return; const p = typeof o.p === 'function' ? o.p() : o.p; if (p <= 0 || G.test || spend(p, nm(o.n), o.i)){ R.bought[o.k] = 1; G.T.rest += 0; o.fx(); AU.coin(); renderRest(); } }); }
function tickRest(dt){ const R = G.rest; if (!R) return; R.t -= dt; $('#restT').textContent = fmt(Math.max(0, Math.ceil(R.t)));
 if ((R.t < 12 || R.called) && !R.back){ R.back = true; R.out.forEach(w => { w.tx = doorX(); w.ty = .1; w.stay = false; w.fade = true; }); }
 const allBack = R.back && R.out.every(w => !G.walkers.includes(w)); $('#rLeave').disabled = !allBack; if (R.t <= -8 && allBack) closeRest(); }
function closeRest(){ G.rest = null; setDoor(false); $('#restM').classList.remove('on'); G.alert = Math.max(G.alert, 60); }
/* ---------- trip end ---------- */
function finishLine(forced){ if (G.finished) return; G.finished = true; if (forced){ const left = G.onboard.length; if (left){ G.comfort -= 20; } G.onboard = []; } setTimeout(() => endRun('ok'), 900); }
function endRun(reason){
 if (G.ended) return; G.ended = true; AU.engine(false, 0, 0, 0); const T = G.T, V = G.V, route = G.route, test = G.test;
 const comfortAvg = T.comfortN ? T.comfortSum / T.comfortN : G.comfort; const ok = reason === 'ok';
 const stars = !ok ? 0 : 1 + (comfortAvg > 70 ? 1 : 0) + (T.missed === 0 && T.fines === 0 && T.hits === 0 ? 1 : 0);
 const cargo = T.cargo, tow = !ok && reason !== 'fuel' ? 500 : reason === 'fuel' ? 200 : 0;
 const net = T.fares + T.tips + cargo - T.fines - T.fee - tow;
 const xp = Math.round((T.delivered * 3 + T.meters / 40 + stars * 25 + T.pro * 6) * (ok ? 1 : .4));
 const R = {reason, fares:T.fares, tips:T.tips, cargo, fuelL:T.fuelL, fuel:Math.round(T.fuelL * DIESEL), fee:T.fee, fines:T.fines, fineList:T.fineList, tow, net, stars, xp, comfort:Math.round(comfortAvg), delivered:T.delivered, test};
 if (!test){
  const lv0 = lvlOf(S.xp).l; S.xp += xp; R.lvUp = lvlOf(S.xp).l > lv0;
  if (T.fee) ledger(-T.fee, t('r_fee') + ' · ' + nm(route.from), 'terminal');
  if (T.fares + T.tips > 0) ledger(T.fares + T.tips, t('r_fares') + ' · ' + nm(route.from) + ' → ' + nm(route.to), 'ticket');
  if (cargo) ledger(cargo, t('r_cargo'), 'terminal'); if (T.fines) ledger(-T.fines, t('r_fines'), 'police'); if (tow) ledger(-tow, t('towing'), 'crash');
  const gv = GV(G.vid); gv.fuel = G.fuel; gv.odo += G.odo; const km1 = T.meters / 1000;
  gv.cond.oil = clamp(gv.cond.oil - km1 * 1.6, 0, 100); gv.cond.tyres = clamp(gv.cond.tyres - km1 * 1.1, 0, 100); gv.cond.brakes = clamp(gv.cond.brakes - km1 * 1.3, 0, 100); gv.cond.clean = clamp(gv.cond.clean - km1 * (G.weather === 'clear' ? 4 : 9), 0, 100);
  if (G.cond.oil < 15) gv.cond.engine = clamp(gv.cond.engine - 4, 0, 100);
  S.stats.km += G.odo; S.stats.trips += ok ? 1 : 0; S.stats.pax += T.delivered; if (T.comfortN){ const r5 = 1 + comfortAvg / 25; S.stats.rating = (S.stats.rating * S.stats.ratingN + r5) / (S.stats.ratingN + 1); S.stats.ratingN++; }
  if (ok) S.best[route.id] = Math.max(S.best[route.id] || 0, stars);
  missionProgress({pax:T.delivered, trips:ok ? 1 : 0, earn:Math.max(0, net), stars3:stars === 3 ? 1 : 0, clean:ok && T.fines === 0 && T.hits === 0 ? 1 : 0, km:G.odo});
  checkBadges(); save(true);
 }
 setTimeout(() => showReceipt(R), reason === 'ok' ? 200 : 1200);
 if (reason !== 'ok'){ AU.crash(); const m = $('#crashM'); $('#crashT').textContent = t(reason === 'crash' ? 'crashEnd' : reason === 'fuel' ? 'fuelEnd' : 'brokeEnd'); m.classList.add('on'); setTimeout(() => m.classList.remove('on'), 1150); }
}
