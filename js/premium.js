"use strict";
/* =====================================================================
   OGRAAA v7 — premium pass
   pause-aware audio · realistic horns & sirens · roadside signs ·
   shops & market · passengers in the windows · real window tint ·
   fire / falling parts / smoke types · more cosmetics · fatigue ·
   combos, perfect stops, VIPs, rush hour · dev mode · anti-cheat
   ===================================================================== */
const h32 = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/* ---------------- pause silences everything ---------------- */
function audioPause(p){ try{ if (AU.ctx) p ? AU.ctx.suspend() : AU.ctx.resume(); }catch(e){} try{ if (RADIO.el && RADIO.el.src){ if (p) RADIO.el.pause(); else if (G.radioOn) RADIO.el.play().catch(() => {}); } }catch(e){} }
const _pause7 = pause;
pause = function(on){ _pause7(on); audioPause(!!G.paused); };
const _toMenu7 = toMenu;
toMenu = function(scr){ audioPause(false); _toMenu7(scr); SIREN.kill(); };
/* ---------------- realistic horns ---------------- */
AU.hornVoice = function(freqs, dur, kind){ const c = this.ctx; if (!c) return; const t0 = c.currentTime, air = kind === 'air';
 const out = c.createGain(); out.gain.setValueAtTime(.0001, t0); out.gain.exponentialRampToValueAtTime(air ? .26 : .2, t0 + (air ? .09 : .012)); out.gain.setValueAtTime(air ? .26 : .2, t0 + dur - (air ? .15 : .04)); out.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
 const ws = c.createWaveShaper(), cv2 = new Float32Array(2048); for (let i = 0; i < 2048; i++){ const x = i / 1024 - 1; cv2[i] = Math.tanh(x * (air ? 2.2 : 4.5)); } ws.curve = cv2;
 const f1 = c.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = air ? 780 : 2300; f1.Q.value = 1.4; f1.gain.value = 9;
 const f2 = c.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = air ? 1650 : 3400; f2.Q.value = 2; f2.gain.value = 6;
 const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = air ? 3200 : 6000;
 const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = air ? 90 : 250;
 // diaphragm buzz (car horns rattle at ~110 Hz)
 const am = c.createGain(); am.gain.value = 1; const lfo = c.createOscillator(); lfo.frequency.value = air ? 18 : 112; const lg = c.createGain(); lg.gain.value = air ? .08 : .22; lfo.connect(lg).connect(am.gain);
 ws.connect(am).connect(hp).connect(f1).connect(f2).connect(lp).connect(out).connect(this.sfxG);
 freqs.forEach((f, i) => { const o = c.createOscillator(); o.type = air ? 'sawtooth' : 'square'; o.frequency.setValueAtTime(f * (air ? .93 : 1.02), t0); o.frequency.exponentialRampToValueAtTime(f, t0 + (air ? .18 : .03)); const g = c.createGain(); g.gain.value = .38; o.connect(g).connect(ws); o.start(t0); o.stop(t0 + dur + .05); });
 lfo.start(t0); lfo.stop(t0 + dur + .05); if (air) this.noiseHit(dur * .9, 3200, .05, 0, 'bandpass', .7);
};
AU.horn = function(kind, big){ if (!this.ctx) return;
 const seq = (notes, step, len) => notes.forEach((f, i) => setTimeout(() => this.hornVoice([f, f * 1.21], len, 'car'), i * step));
 if (kind === 'melody') return seq([659,784,988,784,659,988], 135, .13);
 if (kind === 'cuca') return seq([392,392,392,523,659,0,392,392,392,523,659].filter(Boolean), 125, .11);
 if (kind === 'mahr') return seq([440,440,523,440,587,523,440], 100, .09);
 if (kind === 'air' || big) this.hornVoice([185, 233, 277], .85, 'air'); else this.hornVoice([410, 510], .45, 'car');
};
/* continuous, distance- and doppler-aware sirens (replaces beeps) */
const SIREN = { v:new Map(),
 kill(){ this.v.forEach(s => { try{ s.g.gain.setTargetAtTime(0, AU.ctx.currentTime, .05); s.o.stop(AU.ctx.currentTime + .3); }catch(e){} }); this.v.clear(); },
 update(){ const c = AU.ctx; if (!c || G.mode !== 'play' || G.paused){ return; } const car = G.car, live = new Set();
  for (const a of G.ai){ if (!a.siren) continue; const d = Math.abs(a.x - car.x); if (d > 220) continue; live.add(a); let s = this.v.get(a);
   if (!s){ const o = c.createOscillator(); o.type = 'sawtooth'; const ws = c.createWaveShaper(), cv2 = new Float32Array(1024); for (let i = 0; i < 1024; i++) cv2[i] = Math.tanh((i / 512 - 1) * 2.5); ws.curve = cv2; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = .8; const g = c.createGain(); g.gain.value = 0; const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain(); o.connect(ws).connect(bp).connect(g).connect(pan).connect(AU.sfxG); o.start(); s = {o, g, pan, ph:Math.random() * 6}; this.v.set(a, s); }
   const t = c.currentTime + s.ph; let f; if (a.siren === 'amb') f = (Math.floor(t * 1.3) % 2 ? 960 : 740); else { const w = (t % 4) / 4; f = 650 + 850 * (w < .5 ? w * 2 : 2 - w * 2); if (Math.floor(t / 8) % 2) f = 650 + 850 * Math.abs(Math.sin(t * 9)); }
   const rel = (a.vx - car.vx) * Math.sign(car.x - a.x); f *= 343 / (343 - clamp(rel, -40, 40));
   s.o.frequency.setTargetAtTime(f, c.currentTime, .02); s.g.gain.setTargetAtTime(.09 * Math.pow(clamp(1 - d / 220, 0, 1), 1.6), c.currentTime, .1); if (s.pan.pan) s.pan.pan.setTargetAtTime(clamp((a.x - car.x) / 60, -1, 1), c.currentTime, .1); }
  this.v.forEach((s, a) => { if (!live.has(a)){ s.g.gain.setTargetAtTime(0, c.currentTime, .1); try{ s.o.stop(c.currentTime + .4); }catch(e){} this.v.delete(a); } }); }
};
AU.siren = function(){};
/* ---------------- no more pedestrians crossing the street ---------------- */
randomEvent = function(){ _re5(); G.pedX = null; };
/* ---------------- shops as a service type + street & progress-bar signage ---------------- */
POI_T.store = {ic:'🛒', col:'#46e58f', n:['سوبر ماركت','Shop']};
const _v6w7 = v6world;
v6world = function(){ _v6w7(); const len = W.len, r = mulberry(W.seed + 3131), urban = W.biome.urban > .3;
 const clear = x => W.stops.every(s => Math.abs(s.x - x) > 45) && W.cps.every(c => Math.abs(c.x - x) > 45) && W.lights.every(l => Math.abs(l.x - x) > 35) && W.rests.every(q => Math.abs(q.x - x) > 60) && (!W.toll || Math.abs(W.toll.x - x) > 60) && !inWater(x) && W.poi.every(p => Math.abs(p.x - x) > 150);
 for (let t = 0; t < 40; t++){ const x = Math.round(len * (.25 + r() * .6)); if (clear(x)){ const k = urban ? 'sSuper' : 'sKiosk'; W.poi.push({type:'store', x, k}); const w = (BH5[k] || 8) * META[k].w / META[k].h; W.deco = W.deco.filter(d => d.x + d.w / 2 < x - w / 2 - .5 || d.x - d.w / 2 > x + w / 2 + .5); W.deco.push({k, x, h:BH5[k] || 8, w}); break; } }
 W.poi.sort((a, b) => a.x - b.x); };
const _svcOpt7 = svcOptions;
svcOptions = function(type){ if (type !== 'store') return _svcOpt7(type); return ITEMS.map(i => ({ic:i.ic, n:i.n, p:Math.round(i.p * 1.1), t:.4, item:i.id})); };
const _openSvc7 = openSvc;
openSvc = function(p){ if (p.type === 'store'){ G.svc = p; setDoor(false); say(L2('أهلاً يا أسطى، اتفضل', 'Welcome, driver — have a look'), p.x + 2, terrH(p.x) + 3.6, '#ffd35a'); renderSvc(); $('#svcM').classList.add('on'); return; } _openSvc7(p); };
function drawServiceSigns(){
 if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), car = G.car, t = G.time;
 const items = (W.poi || []).map(p => ({x:p.x, ic:POI_T[p.type].ic, n:nm(POI_T[p.type].n), col:POI_T[p.type].col})).concat(W.rests.filter(q => !q.used).map(q => ({x:q.x, ic:'🍽', n:nm(q.name), col:'#2fd07a'})));
 for (const it of items){
  // advance sign 120 m before
  const sx0 = it.x - 120; if (sx0 > x0 - 5 && sx0 < x1 + 5){ const X = sx(sx0), Y = sy(terrH(sx0) + 1.9), h = PPM * 3.2, bw = clamp(PPM * 1.9, 60, 110), bh = bw * .62;
   ctx.fillStyle = '#6f7882'; ctx.fillRect(X - PPM * .06, Y - h, PPM * .12, h); ctx.fillStyle = '#1554a8'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - bw / 2, Y - h - bh, bw, bh, 5) : ctx.rect(X - bw / 2, Y - h - bh, bw, bh); ctx.fill(); ctx.stroke();
   ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${bh * .42}px sans-serif`; ctx.fillStyle = '#fff'; ctx.fillText(it.ic, X - bw * .22, Y - h - bh * .52); ctx.font = `700 ${bh * .28}px "Readex Pro", sans-serif`; ctx.fillText('120m ↑', X + bw * .17, Y - h - bh * .5); }
  // floating label over the building itself
  if (it.x > x0 - 10 && it.x < x1 + 10){ const d = Math.round(it.x - car.x), X = sx(it.x), Y = sy(terrH(it.x) + 10.5 + Math.sin(t * 1.8 + it.x) * .12); ctx.save(); ctx.font = `700 ${clamp(PPM * .38, 12, 17)}px "Readex Pro", sans-serif`; const lab = `${it.ic} ${it.n}` + (Math.abs(d) > 12 ? `  ·  ${d > 0 ? d + ' m' : ''}` : ''), w = ctx.measureText(lab).width + 26, h = clamp(PPM * .7, 26, 34);
   ctx.fillStyle = 'rgba(10,20,44,.9)'; ctx.strokeStyle = it.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - w / 2, Y - h, w, h, h / 2) : ctx.rect(X - w / 2, Y - h, w, h); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(X - 7, Y); ctx.lineTo(X, Y + 8); ctx.lineTo(X + 7, Y); ctx.fillStyle = it.col; ctx.fill();
   ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, X, Y - h / 2); ctx.restore(); } }
}
const _dw7 = drawWorld;
drawWorld = function(){ _dw7(); drawServiceSigns(); drawDebris(); };
const _bt7 = buildTrack;
buildTrack = function(){ _bt7(); const tr = $('#track'), pos = x => clamp(x / W.len * 100, 0, 100); tr.querySelectorAll('.tic').forEach(e => e.remove()); let h = '';
 const add = (x, ic, col, n) => { h += `<i class="tic" style="left:${pos(x)}%;--c:${col}" title="${n}">${ic}</i>`; };
 for (const p of W.poi || []) add(p.x, POI_T[p.type].ic, POI_T[p.type].col, nm(POI_T[p.type].n)); for (const q of W.rests) add(q.x, '🍽', '#2fd07a', nm(q.name)); if (W.toll) add(W.toll.x, '🛣', '#9ad', 'Toll'); for (const c of W.cps) add(c.x, '👮', '#3d7bff', 'Police');
 tr.insertAdjacentHTML('beforeend', h); };
/* ---------------- falling parts, fire, smoke types ---------------- */
const DEBRIS = [];
const _ad7 = addDent;
addDent = function(car, lx, ly, sev, glass){ _ad7(car, lx, ly, sev, glass); if (G.mode === 'play' && sev > 7 && car.cv){ spawnDebris(car, lx, ly, sev); if (car === G.car && sev > 12 && Math.random() < .35) igniteFire(); } };
function spawnDebris(car, lx, ly, sev){ if (!car.cv || DEBRIS.length > 40) return; const cvw = car.cv.width, cvh = car.cv.height, u = clamp((car.mirror ? -lx : lx) / car.g.len + .5, .03, .97), v = clamp(.5 - ly / car.g.h, .1, .9);
 const n = sev > 11 ? 3 : sev > 8 ? 2 : 1; for (let i = 0; i < n; i++){ const pw = Math.round(cvw * (.05 + Math.random() * .05)), ph = Math.round(cvh * (.05 + Math.random() * .07)), px = clamp(Math.round(u * cvw + (Math.random() - .5) * cvw * .06 - pw / 2), 0, cvw - pw), py = clamp(Math.round(v * cvh + (Math.random() - .5) * cvh * .1 - ph / 2), 0, cvh - ph);
  const c = document.createElement('canvas'); c.width = pw; c.height = ph; const x = c.getContext('2d'); x.drawImage(car.cv, px, py, pw, ph, 0, 0, pw, ph);
  const cx = car.cv.getContext('2d'); cx.save(); cx.globalCompositeOperation = 'destination-out'; cx.beginPath(); cx.ellipse(px + pw / 2, py + ph / 2, pw * .45, ph * .45, Math.random(), 0, 7); cx.fill(); cx.restore(); SILC.delete(car.cv);
  const ca = Math.cos(car.a), sa = Math.sin(car.a), wx = car.x + lx * ca - ly * sa, wy = car.y + lx * sa + ly * ca;
  DEBRIS.push({c, x:wx, y:wy, vx:car.vx * .6 + (Math.random() - .5) * 4 + (lx > 0 ? 2 : -2), vy:2 + Math.random() * 3, a:0, w:(Math.random() - .5) * 12, s:car.g.s, life:30}); } }
function updDebris(dt){ for (let i = DEBRIS.length - 1; i >= 0; i--){ const d = DEBRIS[i]; d.life -= dt; if (d.life <= 0 || d.x < G.car.x - 200){ DEBRIS.splice(i, 1); continue; } d.vy -= 9.8 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.a += d.w * dt; const gy = terrH(d.x) + .15; if (d.y < gy){ d.y = gy; d.vy = -d.vy * .25; d.vx *= .6; d.w *= .5; if (Math.abs(d.vy) < .5) d.vy = 0; } } }
function drawDebris(){ for (const d of DEBRIS){ const X = sx(d.x), Y = sy(d.y); if (X < -80 || X > VW + 80) continue; const k = PPM * d.s; ctx.save(); ctx.translate(X, Y); ctx.rotate(-d.a); ctx.globalAlpha = clamp(d.life / 3, 0, 1); ctx.drawImage(d.c, -d.c.width * k / 2, -d.c.height * k / 2, d.c.width * k, d.c.height * k); ctx.restore(); } }
TX.fireEnd = ['المركبة ولعت!','The vehicle burned out!'];
function engineBay(){ const car = G.car, rear = G.V.cls !== 'micro'; const lx = (rear ? -1 : 1) * car.L * .4, ly = car.yb + (car.yt - car.yb) * .35, ca = Math.cos(car.a), sa = Math.sin(car.a); return [car.x + lx * ca - ly * sa, car.y + lx * sa + ly * ca]; }
function igniteFire(){ if (G.fire > 0 || G.test || S.devGod) return; G.fire = .3; G.fireT = 0; AU.crash(); toastUI('🔥 ' + L2('حريقة في الموتور! طفّيها بالطفاية', 'Engine fire! Use the extinguisher'), 'bad', inv().ext ? [[L2('🧯 طفّي', '🧯 Extinguish'), extinguish]] : null, 8); if (G.onboard.length) say(L2('حريقة!! افتح الباب!', 'FIRE!! Open the door!'), G.car.x, G.car.y + G.car.yt + 1, '#ff9aa4'); }
function extinguish(){ if (!(G.fire > 0)) return; const b = inv(); if (!b.ext){ toastUI(L2('مفيش طفاية!', 'No extinguisher!'), 'bad'); return; } b.ext--; save(); G.fire = 0; const [ex, ey] = engineBay(); for (let i = 0; i < 60; i++) puff(ex + rnd(-1, 1), ey + rnd(-.3, 1), rnd(-2, 2), rnd(0, 2), 1.6, .25, '#f4f7fb', 'smoke'); AU.noiseHit(1.6, 5000, .25, 0, 'highpass', .4); toastUI('🧯 ' + L2('الحريقة اتطفت', 'Fire is out'), 'good'); S.stats.fires = (S.stats.fires || 0) + 1; }
/* ---------------- window cabin layer: real passengers + real tint + curtains ---------------- */
const DRV = {hiace:.7, coaster:.8, redbus:.86, mcv:.9, coachB:.86, coachO:.87, fiat128:.58, minivan:.6};
const CABM = {};
function cabinMask(V){ if (CABM[V.id]) return CABM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h), drv = (DRV[V.id] || .8) * w; let minX = w, maxX = 0, bot = [];
 for (let p = 0; p < w * h; p++){ const px = p % w, py = p / w | 0; if (M.win[p] && px < drv && px > w * .03){ d.data[p * 4 + 3] = 255; minX = Math.min(minX, px); maxX = Math.max(maxX, px); } }
 x.putImageData(d, 0, 0); for (let px = Math.round(minX); px < maxX; px += 4){ let b = -1; for (let py = Math.round(h * .62); py > 0; py--) if (d.data[(py * w + px) * 4 + 3]){ b = py; break; } if (b > 0) bot.push(b); } bot.sort((a, b) => a - b);
 let top = h; for (let p = 0; p < w * h; p++) if (d.data[p * 4 + 3]){ top = Math.min(top, p / w | 0); }
 return CABM[V.id] = {c, minX, maxX, sill:bot.length ? bot[bot.length >> 1] : h * .5, top, w, h}; }
const CAB = {};
function cabinCanvas(V, cos, pax, forPreview){ const K = cabinMask(V), key = V.id + '|' + cos.tint + '|' + (cos.curtain || 'none') + '|' + pax.map(p => p.t + (p.st ? 's' : '')).join(','); if (CAB[V.id] && CAB[V.id].key === key) return CAB[V.id].c;
 const c = document.createElement('canvas'); c.width = K.w; c.height = K.h; const x = c.getContext('2d'), ppm = K.w / V.len;
 // dark interior hides the painted-in passengers
 const g = x.createLinearGradient(0, K.top, 0, K.sill); g.addColorStop(0, '#2b3138'); g.addColorStop(1, '#161a1f'); x.fillStyle = g; x.fillRect(0, 0, K.w, K.h);
 const zone = K.maxX - K.minX, slotW = .62 * ppm, slots = Math.max(2, Math.floor(zone / slotW)), seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st);
 // seat backs
 x.fillStyle = V.cls === 'coach' ? '#28406e' : '#3b3f46'; for (let i = 0; i < slots; i++){ const sx2 = K.minX + (i + .5) * zone / slots; x.beginPath(); x.roundRect ? x.roundRect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm, 4) : x.rect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm); x.fill(); }
 const drawP = (p, px, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const H = (p.h || 1.7) * ppm * (im.height / 150), W2 = im.width / im.height * H; const headTop = K.sill - (stand ? 1.05 : .55) * ppm; x.drawImage(im, px - W2 / 2, headTop, W2, H); };
 // spread seated passengers evenly (window seats first), standing ones near the doors
 const order = []; for (let i = 0; i < slots; i++) order.push(i); order.sort((a, b) => ((a * 7) % slots) - ((b * 7) % slots));
 seated.slice(0, slots).forEach((p, i) => drawP(p, K.minX + (order[i] + .5) * zone / slots, false));
 standing.slice(0, Math.max(1, slots >> 1)).forEach((p, i) => drawP(p, K.minX + zone * (.3 + .4 * ((i * .37) % 1)), true));
 // curtains
 const CU = {red:['#8e1b2c','#e0b04a'], blue:['#1d3f8a','#d9d9d9'], green:['#1f6b3a','#e0b04a'], gold:['#b8862e','#fff1b8']}[cos.curtain];
 if (CU){ for (let i = 0; i <= slots; i++){ const cx2 = K.minX + i * zone / slots; x.fillStyle = CU[0]; x.beginPath(); x.moveTo(cx2 - slotW * .22, K.top); x.quadraticCurveTo(cx2 - slotW * .05, (K.top + K.sill) / 2, cx2 - slotW * .14, K.sill); x.lineTo(cx2 + slotW * .14, K.sill); x.quadraticCurveTo(cx2 + slotW * .05, (K.top + K.sill) / 2, cx2 + slotW * .22, K.top); x.fill(); x.fillStyle = CU[1]; x.fillRect(cx2 - slotW * .22, K.top, slotW * .44, ppm * .05); }
  x.fillStyle = CU[0]; x.globalAlpha = .9; x.fillRect(K.minX, K.top, zone, ppm * .08); x.globalAlpha = 1; }
 // tint: real smoked glass (darkness + blue-grey cast), plus reflection streaks
 const TA = (COS.tint.find(q => q.id === cos.tint) || {a:0}).a; x.fillStyle = `rgba(14,20,28,${.12 + TA * .85})`; x.fillRect(0, 0, K.w, K.h);
 const rg = x.createLinearGradient(0, K.top, K.w * .25, K.sill); rg.addColorStop(0, 'rgba(255,255,255,.0)'); rg.addColorStop(.45, `rgba(255,255,255,${.16 - TA * .08})`); rg.addColorStop(.55, 'rgba(255,255,255,.02)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, K.w, K.h);
 x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0);
 CAB[V.id] = {key, c}; return c; }
function paxView(){ const V = G.V, cap = V.seats; return G.onboard.map((p, i) => ({t:p.t, h:p.h, st:i >= cap})); }
/* ---------------- accessories drawn in sprite space (roof, mud flaps) ---------------- */
Object.assign(COS, {
 roof:[{id:'none', p:0, n:['من غير','None']}, {id:'taxi', p:600, n:['لافتة أجرة مضيئة','Lit "Ograaa" roof sign']}, {id:'bar', p:900, n:['لمبات ليد','LED light bar']}, {id:'box', p:1100, n:['صندوق سقف','Roof box']}, {id:'ac', p:1500, n:['تكييف سقف','Roof A/C unit']}],
 curtain:[{id:'none', p:0, n:['من غير','None']}, {id:'red', p:400, n:['ستارة نبيتي بدهبي','Burgundy & gold curtains']}, {id:'blue', p:400, n:['ستارة زرقا','Blue curtains']}, {id:'green', p:400, n:['ستارة خضرا','Green curtains']}, {id:'gold', p:650, n:['ستارة دهبي ملكي','Royal gold curtains']}],
 mud:[{id:'none', p:0, n:['من غير','None']}, {id:'red', p:250, n:['رفرف أحمر','Red mud flaps']}, {id:'black', p:250, n:['رفرف أسود','Black mud flaps']}, {id:'chrome', p:500, n:['رفرف كروم','Chrome mud flaps']}],
 decal:[{id:'none', p:0, n:['من غير','None']}, {id:'flames', p:700, n:['لهب','Flames']}, {id:'stars', p:450, n:['نجوم','Stars']}, {id:'eye', p:500, n:['عين حورس','Eye of Horus']}, {id:'flag', p:450, n:['علم مصر جانبي','Egypt flag side decal']}, {id:'logo', p:350, n:['شعار أجرة','Ograaa logo']}],
 chrome:[{id:'none', p:0, n:['من غير','None']}, {id:'strip', p:550, n:['شريط كروم','Chrome side strip']}, {id:'gold', p:800, n:['شريط دهبي','Gold side strip']}]
});
Object.assign(COS_ICON, {roof:'lights', curtain:'seat', mud:'tyre', decal:'paint', chrome:'paint'});
Object.assign(TX, {roof:['السقف','Roof'], curtain:['ستائر','Curtains'], mud:['رفارف','Mud flaps'], decal:['رسومات','Decals'], chrome:['كروم','Chrome'], market:['السوق','Market']});
const _bpc7 = buildPlayerCanvas;
buildPlayerCanvas = function(vid, cos, cond, dents){ const c = _bpc7(vid, cos, cond, dents), V = VBY(vid), M = paintMask(V.spr), w = c.width, h = c.height;
 if ((cos.decal && cos.decal !== 'none') || (cos.chrome && cos.chrome !== 'none')){ const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++) md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; mx.putImageData(md, 0, 0);
  const d = document.createElement('canvas'); d.width = w; d.height = h; const x = d.getContext('2d');
  if (cos.chrome === 'strip' || cos.chrome === 'gold'){ const g = x.createLinearGradient(0, h * .7, 0, h * .73); g.addColorStop(0, cos.chrome === 'gold' ? '#fff0b0' : '#ffffff'); g.addColorStop(.5, cos.chrome === 'gold' ? '#c9962e' : '#8f99a3'); g.addColorStop(1, cos.chrome === 'gold' ? '#7a5a14' : '#e6ebef'); x.fillStyle = g; x.fillRect(0, h * .7, w, h * .03); }
  if (cos.decal === 'flames'){ for (let i = 0; i < 7; i++){ const y = h * (.6 + i * .03); const g = x.createLinearGradient(w, 0, w * .45, 0); g.addColorStop(0, '#ffdd33'); g.addColorStop(.5, '#ff6a00'); g.addColorStop(1, 'rgba(200,20,0,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(w, y - h * .02); for (let q = 0; q <= 8; q++){ const px = w - q * w * .07; x.quadraticCurveTo(px + w * .02, y + (q % 2 ? -1 : 1) * h * .05, px - w * .035, y); } x.lineTo(w, y + h * .02); x.fill(); } }
  if (cos.decal === 'stars'){ x.fillStyle = '#f5c518'; const r = mulberry(5); for (let i = 0; i < 14; i++){ const cx = w * (.1 + r() * .8), cy = h * (.55 + r() * .25), s = h * (.015 + r() * .02); x.beginPath(); for (let k = 0; k < 10; k++){ const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? s * .45 : s; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.fill(); } }
  if (cos.decal === 'eye'){ const cx = w * .42, cy = h * .64, s = h * .09; x.strokeStyle = '#1a3b8f'; x.lineWidth = s * .14; x.beginPath(); x.ellipse(cx, cy, s * 1.6, s * .7, 0, 0, 7); x.stroke(); x.fillStyle = '#1a3b8f'; x.beginPath(); x.arc(cx, cy, s * .45, 0, 7); x.fill(); x.beginPath(); x.moveTo(cx - s * .3, cy + s * .65); x.quadraticCurveTo(cx - s * .1, cy + s * 1.5, cx + s * .4, cy + s * 1.3); x.stroke(); x.beginPath(); x.moveTo(cx - s * 1.6, cy - s * .9); x.lineTo(cx + s * 1.3, cy - s * 1.05); x.stroke(); }
  if (cos.decal === 'flag'){ const y = h * .6; [['#ce1126'],['#ffffff'],['#111111']].forEach(([col], i) => { x.fillStyle = col; x.beginPath(); x.moveTo(w * .15, y + i * h * .04); x.lineTo(w * .75, y + i * h * .04 + h * .02); x.lineTo(w * .75, y + (i + 1) * h * .04 + h * .02); x.lineTo(w * .15, y + (i + 1) * h * .04); x.fill(); }); }
  if (cos.decal === 'logo'){ x.font = `900 ${h * .1}px Lalezar, sans-serif`; x.fillStyle = '#f5b21b'; x.strokeStyle = '#1a1a1a'; x.lineWidth = h * .012; x.textAlign = 'center'; x.strokeText('OGRAAA', w * .45, h * .7); x.fillText('OGRAAA', w * .45, h * .7); }
  x.globalCompositeOperation = 'destination-in'; x.drawImage(mk, 0, 0); c.getContext('2d').drawImage(d, 0, 0); }
 return c; };
function roofLine(V){ const M = paintMask(V.spr); if (M.roof) return M.roof; const w = M.w, h = M.h, d = M.src, r = new Float32Array(w); for (let x = 0; x < w; x++){ r[x] = h; for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 200){ r[x] = y; break; } } return M.roof = r; }
function drawAccessories(x, V, cos, wheelsPx){ const M = paintMask(V.spr), w = M.w, h = M.h, ppm = w / V.len, rl = roofLine(V);
 if (cos.roof && cos.roof !== 'none'){ const cx = w * (V.cls === 'micro' ? .45 : .5), top = Math.min(...[-.1, 0, .1].map(o => rl[Math.round(cx + o * w)])); x.save();
  if (cos.roof === 'taxi'){ const bw = .95 * ppm, bh = .3 * ppm; x.fillStyle = '#222'; x.fillRect(cx - bw * .4, top - bh * .15, bw * .8, bh * .15); const g = x.createLinearGradient(0, top - bh, 0, top); g.addColorStop(0, '#fff4b0'); g.addColorStop(1, '#f5b21b'); x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, top - bh * 1.15, bw, bh, 4) : x.rect(cx - bw / 2, top - bh * 1.15, bw, bh); x.fill(); x.fillStyle = '#1a1a1a'; x.font = `900 ${bh * .62}px Lalezar, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('أجرة', cx, top - bh * .65); }
  if (cos.roof === 'bar'){ const bw = 1.3 * ppm, bh = .13 * ppm; x.fillStyle = '#111'; x.fillRect(cx - bw / 2, top - bh * 1.4, bw, bh); for (let i = 0; i < 10; i++){ x.fillStyle = i % 2 ? '#dff4ff' : '#ffffff'; x.fillRect(cx - bw / 2 + bw * (i + .15) / 10, top - bh * 1.28, bw * .07, bh * .7); } }
  if (cos.roof === 'box'){ const bw = Math.min(2.2, V.len * .4) * ppm, bh = .38 * ppm, g = x.createLinearGradient(0, top - bh, 0, top); g.addColorStop(0, '#5c6570'); g.addColorStop(1, '#2d333a'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - bw / 2, top - bh * .1); x.quadraticCurveTo(cx - bw / 2, top - bh, cx - bw * .3, top - bh); x.lineTo(cx + bw * .38, top - bh); x.quadraticCurveTo(cx + bw / 2, top - bh * .9, cx + bw / 2, top - bh * .1); x.fill(); }
  if (cos.roof === 'ac'){ const bw = 1.6 * ppm, bh = .28 * ppm; x.fillStyle = '#d9dde2'; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, top - bh, bw, bh, bh / 2) : x.rect(cx - bw / 2, top - bh, bw, bh); x.fill(); x.fillStyle = '#9aa3ab'; for (let i = 0; i < 6; i++) x.fillRect(cx - bw * .4 + i * bw * .15, top - bh * .75, bw * .08, bh * .45); }
  x.restore(); }
 if (cos.mud && cos.mud !== 'none'){ const col = {red:'#b3141f', black:'#15171a', chrome:'#c9d1d8'}[cos.mud]; (wheelsPx || M.w && META[V.spr].wheels).forEach(([wx, wy, wr]) => { const mx = wx - wr * 1.12, my = wy - wr * .1, mw = wr * .16, mh = wr * 1.05; x.fillStyle = col; x.fillRect(mx, my, mw, mh); if (cos.mud !== 'chrome'){ x.fillStyle = 'rgba(255,255,255,.7)'; x.font = `700 ${mw * .9}px sans-serif`; x.save(); x.translate(mx + mw * .7, my + mh * .5); x.rotate(-Math.PI / 2); x.textAlign = 'center'; x.fillText('OGRA', 0, 0); x.restore(); } }); }
}
/* draw cabin + accessories on the player vehicle */
const _dv7 = drawVehicle;
drawVehicle = function(car, opt){ _dv7(car, opt); if (!car.player || !G.V) return; const V = G.V, cos = G.test ? vdef(V).cos : GV(G.vid).cos, g = car.g, k = PPM * g.s, X = sx(car.x), Y = sy(car.y);
 const src = car.cv; ctx.save(); ctx.translate(X, Y); ctx.rotate(-car.a); ctx.scale(k, k); ctx.translate(-src.width / 2, -src.height / 2);
 try{ ctx.drawImage(cabinCanvas(V, cos, paxView()), 0, 0); drawAccessories(ctx, V, cos); }catch(e){ reportErr('cabin', e); } ctx.restore();
 if (G.fire > 0){ const [ex, ey] = engineBay(), f = G.fire; for (let i = 0; i < 3; i++) puff(ex + rnd(-.5, .5), ey + rnd(-.2, .4), rnd(-.6, .6), 2 + f * 2, .5, .12 + f * .15, pick(['#ff7b00','#ffb300','#ff3b00']), 'smoke'); if (Math.random() < .8) puff(ex, ey + 1, rnd(-.8, .3), 1.5, 2.5, .25 + f * .3, '#1b1b1b', 'smoke'); const gx = sx(ex), gy = sy(ey), gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, PPM * (1.5 + f * 2)); gr.addColorStop(0, 'rgba(255,140,0,.55)'); gr.addColorStop(1, 'rgba(255,80,0,0)'); ctx.fillStyle = gr; ctx.fillRect(gx - PPM * 4, gy - PPM * 4, PPM * 8, PPM * 8); }
};
/* garage / showroom preview with cabin + accessories */
function drawPreview(canvas, vid, cosOver){
 const c = canvas, w = c.clientWidth, h = c.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); if (c.width !== Math.round(w * d)){ c.width = w * d; c.height = h * d; } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, w, h);
 const V = VBY(vid), gv = GV(vid), cos = cosOver || gv.cos, own = gv.owned; const key = vid + JSON.stringify(cos) + JSON.stringify(own ? gv.cond : 0) + (own ? gv.dents.length : 0);
 if (!PREV[vid] || PREV[vid].key !== key) PREV[vid] = {key, cv:buildPlayerCanvas(vid, cos, own ? gv.cond : {clean:100}, own ? gv.dents : [])};
 const b = PREV[vid].cv, M = META[V.spr], k = Math.min(w * .82 / b.width, h * .62 / b.height) * clamp(.62 + V.len / 30, .75, 1), bw = b.width * k, bh = b.height * k, ox = (w - bw) / 2, oy = h * .88 - bh;
 const gl = COS.glow.find(g => g.id === cos.glow); if (gl && gl.c){ const g = x.createRadialGradient(w / 2, h * .88, 0, w / 2, h * .88, bw * .6); g.addColorStop(0, gl.c + 'dd'); g.addColorStop(1, gl.c + '00'); x.fillStyle = g; x.fillRect(0, h * .6, w, h * .4); }
 x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.ellipse(w / 2, h * .88 + 2, bw * .48, bh * .06, 0, 0, 7); x.fill();
 const rim = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh, t0 = performance.now() / 1000;
 if (!V.baked) for (const [cx, cy, r] of M.wheels){ x.save(); x.translate(ox + cx * k, oy + cy * k); x.rotate(t0 * 1.5); const R = r * k * WQ(rim); x.drawImage(IMG['wh' + rim], -R, -R, R * 2, R * 2); x.restore(); }
 x.drawImage(b, ox, oy, bw, bh);
 const demo = Array.from({length:Math.ceil(V.seats * .55)}, (_, i) => ({t:(i * 5 + 3) % META.peds.length, h:1.62 + (i % 3) * .07}));
 x.save(); x.translate(ox, oy); x.scale(k, k); try{ x.drawImage(cabinCanvas(V, cos, demo, true), 0, 0); drawAccessories(x, V, cos); }catch(e){} x.restore();
 if (cos.rack && V.rack){ x.fillStyle = '#2b2b2b'; x.fillRect(ox + bw * .2, oy - bh * .04, bw * .6, bh * .025); }
}
/* ---------------- fatigue (persistent, all routes) ---------------- */
function fatigueNow(){ if (S.fatigue == null) S.fatigue = 0; if (S.fatT){ const hrs = (Date.now() - S.fatT) / 3.6e6; if (hrs > .02) S.fatigue = Math.max(0, S.fatigue - hrs * 30); } S.fatT = Date.now(); return S.fatigue; }
/* ---------------- main v7 tick (wraps update) ---------------- */
const _upd7 = update;
update = function(dt){ const car = G.car, full = G.mode === 'play', prevAlert = G.alert;
 if (full && S.devFuel) G.fuel = G.fuelMax;
 const body0 = full && !G.test ? GV(G.vid).cond.body : 0, eng0 = full && !G.test ? GV(G.vid).cond.engine : 0; G.pedX = null;
 const bump = full && G._la != null ? G.alert - G._la : 0;
 // fatigue: sluggish throttle when exhausted
 if (full && S.fatigue > 78 && Math.random() < dt * .6){ G.blink = .35; }
 _upd7(dt);
 if (!full) return;
 if (S.devGod && !G.test){ const g = GV(G.vid); g.cond.body = Math.max(g.cond.body, body0); g.cond.engine = Math.max(g.cond.engine, eng0); }
 updDebris(dt); SIREN.update();
 // fatigue model
 fatigueNow(); const rate = .045 * (G.tod === 'night' ? 1.5 : 1) * (G.cabin > 29 ? 1.25 : 1) * (G.radioOn ? .9 : 1) * (speedOf(car) > .5 ? 1 : .35);
 if (bump > .5) S.fatigue = Math.max(0, S.fatigue - bump * .9); else if (!S.devNoFat) S.fatigue = Math.min(100, S.fatigue + rate * dt); if (S.devNoFat) S.fatigue = 0;
 G.alert = 100 - S.fatigue; G._la = G.alert; const fo = $('#fatigue'); fo.style.opacity = G.blink > 0 ? .9 : clamp((S.fatigue - 55) / 60, 0, .55);
 if (S.fatigue > 70 && !G.fw){ G.fw = true; toastUI('😴 ' + L2('إنت تعبان — اشرب قهوة أو كُل حاجة', 'You\'re exhausted — drink a coffee or eat a snack'), 'bad', inv().coffee ? [[L2('☕ قهوة', '☕ Coffee'), () => useItem('coffee')]] : null, 6); AU.tone(180, .6, 'sine', .08, 0, -60); }
 if (S.fatigue < 50) G.fw = false;
 // fire progression
 if (!(G.fire > 0) && GV(G.vid).cond.engine < 8 && G.temp > 115 && Math.random() < dt * .1) igniteFire();
 if (G.fire > 0){ G.fire = Math.min(1, G.fire + dt * .02); G.fireT += dt; if (!G.test) GV(G.vid).cond.engine = Math.max(0, GV(G.vid).cond.engine - dt * 1.2); G.comfort -= dt * 6; if (G.onboard.length && !G.doorOpen && speedOf(car) < .5) setDoor(true); if (G.fireT > 28){ if (!G.test){ GV(G.vid).cond.engine = 0; GV(G.vid).cond.body = Math.max(0, GV(G.vid).cond.body - 40); } G.fire = 0; endRun('broke'); toastUI('🔥 ' + t('fireEnd'), 'bad', null, 5); } }
 // smoke types: steam when overheating, blue oil smoke when oil is low
 const ca = Math.cos(car.a), sa = Math.sin(car.a);
 if (G.temp > 106 && Math.random() < .5){ const [ex, ey] = engineBay(); puff(ex, ey + .6, rnd(-.4, .4), 1.6, 1.4, .14, '#f1f4f8', 'smoke'); }
 if (!G.test && GV(G.vid).cond.oil < 12 && G.engOn && Math.random() < .5) puff(car.x - car.L / 2 * ca, car.y - car.L / 2 * sa + car.yb, -1, .5, 1.6, .1, '#7c8aa6', 'smoke');
 if (!G.test && GV(G.vid).cond.engine < 25 && Math.random() < .08) puff(car.x + rnd(-car.L * .3, car.L * .3), terrH(car.x) + .1, 0, 0, 6, .06, '#2a2a2a', 'dust');
 v7fun(dt);
 const tc = $('#cFat'); if (tc) tc.innerHTML = `😴 ${fmt(Math.round(S.fatigue))}%`, tc.style.color = S.fatigue > 70 ? '#ff6b78' : S.fatigue > 45 ? '#ffd35a' : '';
};
/* ---------------- fun layer: smooth combo, perfect stops, VIPs, rush hour ---------------- */
function v7fun(dt){ const car = G.car, F = G.fun || (G.fun = {combo:1, calm:0, seen:new Set(), vip:new Set()});
 const acc = Math.abs(car.vx - (F.pv || 0)) / Math.max(dt, .001); F.pv = car.vx; const harsh = acc > 4.5 || speedOf(car) * 3.6 > curLimit(car.x) + 8 || car.grounded === 0;
 if (G.onboard.length && !harsh){ F.calm += dt; F.combo = Math.min(2, 1 + Math.floor(F.calm / 15) * .1); } else if (harsh){ if (F.combo > 1.15) toastUI(L2('ضاع الكومبو!', 'Combo lost!'), 'bad', null, 1.5); F.calm = 0; F.combo = 1; }
 const cc = $('#cCombo'); if (cc){ cc.style.display = F.combo > 1 ? '' : 'none'; cc.textContent = '🔥 ×' + F.combo.toFixed(1); }
 // VIPs board sometimes, pay triple if the ride is comfortable
 for (const p of G.onboard){ if (!F.seen.has(p)){ F.seen.add(p); if (Math.random() < .08){ p.vip = true; F.vip.add(p); toastUI('⭐ ' + L2('راكب VIP ركب — خليه مبسوط!', 'A VIP boarded — keep them comfortable!'), 'gold', null, 3); } } }
 for (const p of [...F.vip]){ if (!G.onboard.includes(p)){ F.vip.delete(p); if (G.comfort > 70){ const b = Math.round(G.route.fare * 2 * F.combo); G.T.tips += b; floatTxt(car.x, car.y + 3, '⭐ +' + fmt(b), '#FFD24A'); AU.levelUp(); } else toastUI(L2('الـVIP مكانش مبسوط', 'The VIP wasn\'t happy'), 'bad'); } }
}
const _serve7 = serveStop;
serveStop = function(st){ const tips0 = G.T.tips; _serve7(st); const F = G.fun; if (F && F.combo > 1 && G.T.tips > tips0){ const extra = Math.round((G.T.tips - tips0) * (F.combo - 1) * 10) / 10; G.T.tips += extra; } };
const _setDoor7 = setDoor;
setDoor = function(open){ if (open && G.mode === 'play' && !G.doorOpen){ const st = W.stops[G.nextIdx]; if (st && !st.served && !st.perfect){ const gap = Math.abs(doorX() - st.x); if (gap < .45){ st.perfect = true; const b = G.V.cls === 'coach' ? 40 : 8; G.T.tips += b; S.xp += 5; floatTxt(doorX(), G.car.y + 3.4, L2('وقفة مظبوطة! +', 'Perfect stop! +') + fmt(b), '#7CFC9A'); S.stats.perfect = (S.stats.perfect || 0) + 1; } } } _setDoor7(open); };
const _endRun7 = endRun;
endRun = function(reason){ if (G.ended) return; const h = new Date().getHours(); if ((h >= 7 && h <= 10) || (h >= 16 && h <= 19)){ const b = Math.round(G.T.fares * .2); if (b > 0){ G.T.tips += b; toastUI('🕗 ' + L2('بونص ساعة الذروة +', 'Rush-hour bonus +') + money(b), 'gold'); } } _endRun7(reason); };
/* ---------------- trunk icon (premium SVG) + HUD chips ---------------- */
const TRUNK_SVG = `<svg viewBox="0 0 64 64" class="trsvg"><defs><linearGradient id="tg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset="1" stop-color="#c98a12"/></linearGradient></defs><path d="M8 40 L14 26 Q16 22 21 22 L43 22 Q48 22 50 26 L56 40 Z" fill="#1b2433" stroke="url(#tg)" stroke-width="3" stroke-linejoin="round"/><path d="M12 14 L52 14 L56 24 L8 24 Z" fill="url(#tg)" opacity=".95" transform="rotate(-14 32 24)"/><rect x="6" y="40" width="52" height="12" rx="4" fill="url(#tg)"/><rect x="26" y="44" width="12" height="4" rx="1.5" fill="#1b2433"/><circle cx="14" cy="46" r="2.4" fill="#ff5a4a"/><circle cx="50" cy="46" r="2.4" fill="#ff5a4a"/><rect x="18" y="30" width="10" height="9" rx="1.5" fill="#6bb6ff"/><rect x="30" y="28" width="14" height="11" rx="1.5" fill="#ffb36b"/></svg>`;
const _bc7 = buildControls;
buildControls = function(){ _bc7(); const b = $('#bTrunk'); if (b){ b.querySelector('.pbi').outerHTML = TRUNK_SVG; b.querySelector('em').textContent = L2('الشنطة', 'Trunk'); }
 $('.chips').insertAdjacentHTML('afterbegin', '<div class="chip" id="cCombo" style="display:none"></div><div class="chip" id="cFat"></div>'); };
const _rt7 = renderTrunk;
renderTrunk = function(){ _rt7(); const h = $('#trunkP .trh b'); if (h) h.innerHTML = TRUNK_SVG + ' ' + L2('شنطة العربية', 'Vehicle trunk'); const bag = inv(G.vid); if (G.fire > 0 && bag.ext && !$('#trunkP .fireb')) $('#trunkP').insertAdjacentHTML('afterbegin', `<button class="btn red fireb" style="width:100%;margin-bottom:.5rem">🧯 ${L2('طفّي الحريقة', 'Put out the fire')}</button>`); const fb = $('#trunkP .fireb'); if (fb) fb.onpointerdown = e => { e.preventDefault(); extinguish(); renderTrunk(); }; };
const _useItem7 = useItem;
useItem = function(id){ if (id === 'snacks' || id === 'food') S.fatigue = Math.max(0, (S.fatigue || 0) - (id === 'food' ? 25 : 15)); _useItem7(id); };
/* ---------------- main-menu market: stock the trunk of any owned vehicle ---------------- */
NAV.splice(4, 0, ['market', 'i_coins']);
const main7 = document.getElementById('main'); if (main7 && !document.getElementById('s-market')) main7.insertAdjacentHTML('beforeend', '<section class="screen" id="s-market"></section>');
let MKT_V = null, MKT_C = 'all';
const MKT_CATS = [['all', ['الكل','All']], ['food', ['أكل ومشروبات','Food & drinks'], ['water','coffee','tea','food','snacks']], ['safety', ['أمان','Safety'], ['aid','ext','tri']], ['tools', ['عدة وقطع غيار','Tools & spares'], ['jerry','spare','tools','oil','cool']], ['comfort', ['راحة الركاب','Comfort'], ['tissue','fresh']]];
function renderMarket(){ const owned = VEHS.filter(v => GV(v.id).owned); if (!MKT_V || !GV(MKT_V).owned) MKT_V = owned[0].id; const vid = MKT_V, cap = storeCap(vid), used = invKg(vid), bag = inv(vid), cat = MKT_CATS.find(c => c[0] === MKT_C), list = ITEMS.filter(i => MKT_C === 'all' || cat[2].includes(i.id));
 $('#s-market').innerHTML = `<div class="head"><h1>${L2('السوق', 'Market')}</h1><p>${L2('جهّز شنطة عربيتك قبل المشوار', 'Stock your vehicle\'s trunk before the trip')}</p></div>
 <div class="vpick" style="margin-bottom:.7rem">${owned.map(v => `<button class="vchip ${v.id === vid ? 'on' : ''}" data-mv="${v.id}"><img src="${ASSETS[v.spr]}">${nm(v.name)} <span class="muted">${fmt(Math.round(invKg(v.id)))}/${fmt(Math.round(storeCap(v.id)))}</span></button>`).join('')}</div>
 <div class="card"><div class="row">${TRUNK_SVG}<b>${L2('شنطة', 'Trunk of')} ${nm(VBY(vid).name)}</b><span class="sp"></span><b class="gold">${fmt(Math.round(used))} / ${fmt(Math.round(cap))} ${t('kg')}</b></div>${bar(used / cap * 100, used / cap > .9 ? 'bad' : 'gold')}${missingKit(vid).length ? `<div class="warnk">⚠ ${L2('أدوات أمان ناقصة', 'Safety kit incomplete')}: ${missingKit(vid).map(k => IBY(k).ic).join(' ')}</div>` : ''}</div>
 <div class="tabs" style="margin-top:.8rem">${MKT_CATS.map(c => `<button class="tab ${MKT_C === c[0] ? 'on' : ''}" data-mc="${c[0]}">${nm(c[1])}</button>`).join('')}</div>
 <div class="items">${list.map(i => `<div class="item"><span style="font-size:2rem">${i.ic}</span><b>${nm(i.n)}</b><span class="muted" style="font-size:.7rem">${nm(i.d)} · ${fmt(i.kg)} ${t('kg')}</span><small>${L2('في الشنطة', 'In trunk')}: ${fmt(bag[i.id] || 0)}</small><div class="row"><button class="btn sm sec" data-ms="${i.id}" ${bag[i.id] ? '' : 'disabled'}>−</button><button class="btn sm" data-mb="${i.id}">+ ${money(i.p)}</button></div></div>`).join('')}</div>`;
 $$('[data-mv]').forEach(b => b.onclick = () => { MKT_V = b.dataset.mv; renderMarket(); }); $$('[data-mc]').forEach(b => b.onclick = () => { MKT_C = b.dataset.mc; renderMarket(); });
 $$('[data-mb]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.mb); if (invKg(vid) + I.kg > cap){ toastUI(L2('الشنطة مليانة', 'Trunk is full'), 'bad'); return; } if (!spend(I.p, nm(I.n), 'terminal')) return; addItem(vid, I.id, 1); renderMarket(); });
 $$('[data-ms]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.ms); if (!bag[I.id]) return; bag[I.id]--; ledger(Math.round(I.p * .5), L2('بيع ', 'Sold ') + nm(I.n), 'cash'); save(); renderMarket(); }); }
const _show7 = show;
show = function(id){ if (id === 'market'){ SCR = id; $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-market')); $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.go === id)); renderMarket(); $('#main').scrollTop = 0; return; } _show7(id); };
/* ---------------- encrypted, signed saves + anti-cheat ---------------- */
const SEC7 = 'Ograaa\u00b7EGYSeal\u00b7HossamHegazi\u00b7v7', KEY7 = 'ograaa_sv2', BAK7 = 'ograaa_bk2', BAN7 = 'ograaa_bn';
function xorc(str, decode){ const r = mulberry(h32(SEC7)); if (decode){ const bin = atob(str); let o = ''; for (let i = 0; i < bin.length; i++) o += String.fromCharCode(bin.charCodeAt(i) ^ (r() * 256 | 0)); return decodeURIComponent(escape(o)); } const u = unescape(encodeURIComponent(str)); let o = ''; for (let i = 0; i < u.length; i++) o += String.fromCharCode(u.charCodeAt(i) ^ (r() * 256 | 0)); return btoa(o); }
function pack(obj){ const j = JSON.stringify(obj); return xorc(j) + '.' + h32(j + SEC7).toString(36); }
function unpack(raw){ if (!raw) return null; const i = raw.lastIndexOf('.'); if (i < 0) return {bad:true}; try{ const j = xorc(raw.slice(0, i), true); if (h32(j + SEC7).toString(36) !== raw.slice(i + 1)) return {bad:true}; return {json:j}; }catch(e){ return {bad:true}; } }
const GUARD = {m:0, xp:0, owned:0, ref:null, snap:null, spendT:0, ok:true};
const isDev = () => !!(S.dev && S.devSig === h32(SEC7 + 'dev' + S.devT));
function guardRebase(){ GUARD.m = S.money; GUARD.xp = S.xp; GUARD.owned = VEHS.filter(v => GV(v.id).owned).length; GUARD.ref = S; GUARD.snap = JSON.stringify(S); }
function save(now){ if (!now){ clearTimeout(saveT); saveT = setTimeout(() => save(true), 250); return; } try{ if (!guardCheck()) return; const p = pack(S); localStorage.setItem(KEY7, p); localStorage.setItem(BAK7, p); localStorage.removeItem(SAVE_KEY); }catch(e){} }
const _load7 = load;
load = function(){ const raw = localStorage.getItem(KEY7); let tampered = false;
 if (raw){ const u = unpack(raw); if (u && !u.bad){ localStorage.setItem(SAVE_KEY, u.json); } else { tampered = true; const b = unpack(localStorage.getItem(BAK7)); if (b && !b.bad) localStorage.setItem(SAVE_KEY, b.json); } }
 _load7(); localStorage.removeItem(SAVE_KEY); if (tampered && !isDev()) banPlayer(L2('ملف الحفظ اتعدل', 'The save file was modified')); guardRebase(); };
function banPlayer(why){ const until = Date.now() + 3.6e6; S.banUntil = until; localStorage.setItem(BAN7, pack({until, why})); showBan(); }
function banLeft(){ const b = unpack(localStorage.getItem(BAN7)); const u = Math.max(S.banUntil || 0, b && !b.bad ? JSON.parse(b.json).until : 0); return u - Date.now(); }
function showBan(){ let el = $('#banM'); if (!el){ document.body.insertAdjacentHTML('beforeend', `<div class="modal on" id="banM" style="z-index:90"><div class="mbox" style="border-color:var(--bad)"><h2 style="color:var(--bad)">⛔ ${L2('تم إيقافك مؤقتاً', 'Temporarily banned')}</h2><p>${L2('اكتشفنا محاولة غش. رجعنا بياناتك لآخر نسخة سليمة.', 'A cheating attempt was detected. Your progress was restored to the last clean state.')}</p><div class="disp gold" style="font-size:2.4rem" id="banT"></div></div></div>`); el = $('#banM'); }
 el.classList.add('on'); const tick = () => { const l = banLeft(); if (l <= 0 || isDev()){ el.classList.remove('on'); return; } $('#banT').textContent = new Date(l).toISOString().slice(14, 19); setTimeout(tick, 500); }; tick(); if (G.mode === 'play') toMenu('home'); }
function cheatDetected(what){ if (isDev()) { guardRebase(); return; } console.warn('[Ograaa] integrity', what); try{ const snap = JSON.parse(GUARD.snap); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, snap); }catch(e){} GUARD.m = S.money; GUARD.xp = S.xp; banPlayer(what); const p = pack(S); localStorage.setItem(KEY7, p); localStorage.setItem(BAK7, p); renderTop(); }
function guardCheck(){ if (GUARD.ref !== S){ guardRebase(); return true; } if (isDev()){ guardRebase(); return true; }
 const own = VEHS.filter(v => GV(v.id).owned).length;
 if (S.money !== GUARD.m){ cheatDetected('money'); return false; }
 if (S.xp < GUARD.xp - 1 || S.xp - GUARD.xp > 4000){ cheatDetected('xp'); return false; }
 if (own > GUARD.owned && Date.now() - GUARD.spendT > 4000){ cheatDetected('vehicles'); return false; }
 GUARD.xp = S.xp; GUARD.owned = own; GUARD.snap = JSON.stringify(S); return true; }
const _ledger7 = ledger;
ledger = function(amount, label, icon){ if (GUARD.ref === S && S.money !== GUARD.m && !isDev()){ cheatDetected('money'); return; } _ledger7(amount, label, icon); GUARD.m = S.money; GUARD.spendT = Date.now(); };
setInterval(() => { try{ if (S && GUARD.ref) guardCheck(); }catch(e){} }, 2000);
const _play7 = play;
play = function(route, opt){ if (banLeft() > 0 && !isDev()){ showBan(); return; } _play7(route, opt); fatigueNow(); if (S.fatigue > 60) toastUI('😴 ' + L2('إنت تعبان من الأول — خد بالك', 'You start this trip tired — careful'), 'bad', null, 4); if (S.devTod || S.devWx){ G.tod = S.devTod || G.tod; G.weather = S.devWx || G.weather; G.rainT = G.weather === 'rain' ? 1 : 0; } };
/* ---------------- settings: dev section (password protected) ---------------- */
const DEVH = h32('Monalisa');
const _rs7 = renderSettings;
renderSettings = function(){ _rs7(); const grid = $('#s-settings .grid'); if (!grid) return; const dev = isDev();
 const tog = (k, n) => `<div class="set"><label>${n}</label><span class="sp"></span><button class="tog ${S[k] ? 'on' : ''}" data-dt7="${k}"></button></div>`;
 grid.insertAdjacentHTML('beforeend', `<div class="card devc"><h3>🛠 ${L2('وضع المطور', 'Developer')}</h3>${!dev ? `<div class="row"><input type="password" id="devPw" placeholder="${L2('كلمة السر', 'Password')}"><button class="btn sm" id="devGo">${L2('فتح', 'Unlock')}</button></div>` : `
 <div class="row" style="flex-wrap:wrap;gap:.4rem"><button class="btn sm" data-dv="m1">+10,000</button><button class="btn sm" data-dv="m2">+100,000</button><button class="btn sm" data-dv="lvl">${L2('أقصى مستوى', 'Max level')}</button><button class="btn sm" data-dv="veh">${L2('كل المركبات', 'All vehicles')}</button><button class="btn sm" data-dv="lic">${L2('كل الرخص', 'All licences')}</button><button class="btn sm" data-dv="cos">${L2('كل الإكسسوارات', 'All cosmetics')}</button><button class="btn sm" data-dv="fix">${L2('صلّح الكل', 'Repair all')}</button><button class="btn sm" data-dv="fuel">${L2('فوّل الكل', 'Refuel all')}</button><button class="btn sm" data-dv="kit">${L2('شنطة كاملة', 'Full trunk kit')}</button><button class="btn sm" data-dv="fines">${L2('امسح المخالفات', 'Clear fines')}</button><button class="btn sm" data-dv="fat">${L2('صفّر التعب', 'Reset fatigue')}</button><button class="btn sm" data-dv="ban">${L2('فك الحظر', 'Lift ban')}</button></div>
 ${tog('devGod', L2('بدون تلفيات', 'No damage (god mode)'))}${tog('devFuel', L2('بنزين لا نهائي', 'Infinite fuel'))}${tog('devNoFat', L2('بدون تعب', 'No fatigue'))}${tog('devFree', L2('شراء ببلاش', 'Free shopping'))}${tog('devFps', L2('عداد FPS', 'Show FPS'))}
 <div class="set"><label>${L2('وقت الرحلة', 'Trip time')}</label><span class="sp"></span>${['', 'day', 'sunset', 'night'].map(v => `<button class="btn sm ${(S.devTod || '') === v ? '' : 'sec'}" data-dtod="${v}">${v || 'auto'}</button>`).join('')}</div>
 <div class="set"><label>${L2('الطقس', 'Weather')}</label><span class="sp"></span>${['', 'clear', 'rain', 'sand'].map(v => `<button class="btn sm ${(S.devWx || '') === v ? '' : 'sec'}" data-dwx="${v}">${v || 'auto'}</button>`).join('')}</div>
 <div class="mbtns"><button class="btn sm red" id="devLock">${L2('اقفل وضع المطور', 'Lock developer mode')}</button></div>`}</div>`);
 const go = $('#devGo'); if (go) go.onclick = () => { if (h32($('#devPw').value) === DEVH){ S.dev = true; S.devT = Date.now(); S.devSig = h32(SEC7 + 'dev' + S.devT); guardRebase(); save(true); toastUI('🛠 ' + L2('وضع المطور اشتغل', 'Developer mode on'), 'good'); renderSettings(); } else { toastUI(L2('كلمة السر غلط', 'Wrong password'), 'bad'); AU.tone(160, .25, 'square', .1); } };
 $$('[data-dt7]').forEach(b => b.onclick = () => { S[b.dataset.dt7] = !S[b.dataset.dt7]; save(); renderSettings(); });
 $$('[data-dtod]').forEach(b => b.onclick = () => { S.devTod = b.dataset.dtod; save(); renderSettings(); }); $$('[data-dwx]').forEach(b => b.onclick = () => { S.devWx = b.dataset.dwx; save(); renderSettings(); });
 $$('[data-dv]').forEach(b => b.onclick = () => { const a = b.dataset.dv;
  if (a === 'm1') ledger(10000, 'DEV', 'coins'); if (a === 'm2') ledger(100000, 'DEV', 'coins'); if (a === 'lvl') S.xp = Math.max(S.xp, 400000);
  if (a === 'veh') VEHS.forEach(v => { GV(v.id).owned = true; }); if (a === 'lic'){ S.lic.have = {micro:true, bus:true, coach:true}; S.lic.exp = Date.now() + LIC_DAYS * DAY; S.lic.no = S.lic.no || 'EG-DR-000001'; }
  if (a === 'cos') VEHS.forEach(v => Object.keys(COS).forEach(c => COS[c].forEach(it => { S.inv[v.id + ':' + c + ':' + it.id] = 1; })));
  if (a === 'fix') VEHS.forEach(v => { const g = GV(v.id); Object.keys(g.cond).forEach(k => g.cond[k] = 100); g.dents = []; }); if (a === 'fuel') VEHS.forEach(v => { GV(v.id).fuel = v.tank * (1 + .2 * (GV(v.id).up.tank || 0)); });
  if (a === 'kit') VEHS.forEach(v => { if (GV(v.id).owned) Object.assign(inv(v.id), {ext:1, tri:1, aid:1, water:2, coffee:2, spare:1, tools:1, jerry:1}); }); if (a === 'fines'){ S.fines = []; S.lic.points = 0; S.lic.suspUntil = 0; } if (a === 'fat') S.fatigue = 0; if (a === 'ban'){ S.banUntil = 0; localStorage.removeItem(BAN7); }
  ensureLicences(); guardRebase(); save(true); renderTop(); toastUI('🛠 OK', 'good'); renderSettings(); });
 const lk = $('#devLock'); if (lk) lk.onclick = () => { S.dev = false; S.devSig = 0; ['devGod','devFuel','devNoFat','devFree','devFps'].forEach(k => S[k] = false); S.devTod = S.devWx = ''; guardRebase(); save(true); renderSettings(); };
};
const _spend7 = spend;
spend = function(amount, label, icon){ if (isDev() && S.devFree){ AU.cash(); return true; } return _spend7(amount, label, icon); };
/* FPS meter for devs */
let fpsN = 0, fpsT = 0; (function fpsLoop(t){ fpsN++; if (t - fpsT > 1000){ const el = document.getElementById('fps7'); if (isDev() && S.devFps){ if (!el) document.body.insertAdjacentHTML('beforeend', '<div id="fps7"></div>'); document.getElementById('fps7').textContent = fpsN + ' FPS'; } else if (el) el.remove(); fpsN = 0; fpsT = t; } requestAnimationFrame(fpsLoop); })(0);
/* boot: show an active ban */
setTimeout(() => { try{ if (banLeft() > 0 && !isDev()) showBan(); }catch(e){} }, 1500);
