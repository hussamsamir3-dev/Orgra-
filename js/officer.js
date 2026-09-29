"use strict";
/* =====================================================================
   OGRAAA v21 — traffic officer with a full motion set (stop, slow down,
   direct, walk, request papers, inspect, flashlight, crouch, search,
   radio, citation, wave through, salute) · boarding matches free seats
   ===================================================================== */
const OFA = n => { const a = []; for (let i = 0; i < 8; i++) a.push('of_' + n + i); return a; };
const OFH = META.of_idle0 ? META.of_idle0.h : 150;
/* plan the inspection the moment the vehicle stops in the bay */
function cpPlan(c){ const car = G.car, fs = []; if (G.tod === 'night' && !car.headOn) fs.push('lights'); if (!G.test && Date.now() - GV(G.vid).inspT > 14 * DAY) fs.push('insp'); if (!G.test && (S.lic.suspUntil > Date.now() || !hasLic(G.V.cls) || licExpired())) fs.push('lic'); if (!G.test && vlicExpired(G.vid)) fs.push('vlic');
 const big = G.V.cls !== 'micro', steps = [['walk', 1.1], ['request', 1.3], [G.tod === 'night' ? 'flash' : 'inspect', 1.7]];
 if (big && Math.random() < .35) steps.splice(1, 0, ['direct', 1.1]);
 const r = Math.random(); if (r < .18) steps.push(['crouch', 1.6]); else if (r < .33) steps.push(['reach', 1.4]);
 if (fs.length) steps.push(['radio', 1.3], ['cite', 1.9]); else steps.push(['pass', 1.3]);
 let t = 0; const seq = steps.map(([a, d]) => { const o = {a, t0:t, d}; t += d; return o; }); return {seq, dur:t, fines:fs.length > 0}; }
/* officer brain: picks the right animation for what is happening */
function officerAnim(c){ const car = G.car, front = car.x + car.L / 2, d = c.x - front, sp = speedOf(car), t = G.time;
 if (c.state === 'signal'){ const a = sp > 8.5 ? 'slow' : 'stop'; const k = c.t * 5; return {a, f:k < 5 ? Math.floor(k) : 3 + Math.floor(Math.abs(Math.sin(t * 2.2)) * 2.99), face:-1}; }
 if (c.state === 'check' && c.plan){ const s = c.plan.seq.find(q => c.t >= q.t0 && c.t < q.t0 + q.d) || c.plan.seq[c.plan.seq.length - 1], p = clamp((c.t - s.t0) / s.d, 0, .999);
  if (s.a === 'walk'){ const tx = clamp(front - .9, c.x - 16, c.x - 1); c.ox = lerp(c.ox0 ?? (c.ox0 = c.ox), tx, p); return {a:'walk', f:Math.floor(t * 9) % 8, face:c.ox0 > tx ? -1 : 1}; }
  return {a:s.a, f:Math.floor(p * 8), face:-1}; }
 if (c.state === 'done'){ c.doneT = (c.doneT || 0) + (G._dt || 0); if (c.ran && c.doneT < 3) return {a:'radio', f:Math.min(7, Math.floor(c.doneT * 3)) , face:-1};
  if (!c.plan || c.plan.fines) return {a:'idleHands', f:Math.floor(t * 3) % 8, face:-1};
  if (c.doneT < 1.4) return {a:'salute', f:Math.floor(c.doneT / 1.4 * 8), face:-1}; }
 // idle: breathing, sometimes hands on belt
 const cyc = (t + c.x * .13) % 12; return cyc < 8.5 ? {a:'idle', f:Math.floor(t * 2.2) % 8, face:-1} : {a:'idleHands', f:Math.floor((cyc - 8.5) / 3.5 * 8), face:-1}; }
function drawOfficer(c){ if (!META.of_idle0){ return; } if (c.ox == null) c.ox = c.x - 1; const A = officerAnim(c), key = 'of_' + A.a + clamp(A.f, 0, 7), im = IMG[key], m = META[key]; if (!im) return;
 const s = 1.8 * PPM / OFH, h = m.h * s, w = m.w * s, X = sx(c.ox), Y = sy(terrH(c.ox) + 1.2);
 if (X < -80 || X > VW + 80) return; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(X, Y, PPM * .35, PPM * .07, 0, 0, 7); ctx.fill(); ctx.translate(X, Y); if (A.face < 0) ctx.scale(-1, 1); ctx.drawImage(im, -m.ax * s, -h, w, h); ctx.restore(); }
/* remember when a driver runs the checkpoint (the officer radios it in) */
const _af21 = addFine;
addFine = function(k, cam){ if (k === 'run'){ const c = W.cps.find(q => q.state === 'done' && Math.abs(q.x - G.car.x) < 40); if (c){ c.ran = true; c.doneT = 0; } } _af21(k, cam); };
/* ---------------- boarding: only as many people step up as there are free places ---------------- */
const _upd21 = update;
update = function(dt){ _upd21(dt); if (G.mode !== 'play') return; const car = G.car, st = W.stops[G.nextIdx]; if (!st || st.trimmed || !st.waiting || st.x - car.x > 70 || st.i === W.stops.length - 1) return; st.trimmed = true;
 const room = Math.max(0, seatsOf(G.V) - G.onboard.length + G.onboard.filter(p => p.dest <= st.i).length);
 if (st.waiting.length > room){ const extra = st.waiting.splice(room); extra.forEach((p, i) => G.walkers.push({t:p.t, h:p.h, x:st.x - 3 + (i % 5) * .75, y:1.8, ty:1.8, tx:st.x - 3 + (i % 5) * .75 + (Math.random() < .5 ? -1 : 1) * (10 + Math.random() * 8), spd:1 + Math.random() * .4, d:0, fade:true}));
  if (!room) toast('🚐 ' + L2('العربية مليانة — الناس هتستنى اللي بعدك', 'Vehicle full — people will wait for the next one'), 'gold'); } };
</script>
<script>
"use strict";
/* AI wheels: each rim was measured individually (hub centre + rim radius); only that exact disc rotates */
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr], M = META[spr], bike = spr === 'ai5' || spr === 'ai6' || spr === 'ai4';
 return AIWHEELS[spr] = M.wheels.map(([cx, cy, r], i) => { const R = !bike && M.rim && M.rim[i] ? M.rim[i] : r * .56, S = Math.ceil(R) * 2 + 4, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.beginPath(); x.arc(S / 2, S / 2, R, 0, 7); x.clip(); x.drawImage(im, -(cx - S / 2), -(cy - S / 2)); return c; }); }
for (const k in AIWHEELS) delete AIWHEELS[k];
