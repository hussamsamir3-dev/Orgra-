"use strict";
/* =====================================================================
   OGRAAA v9 — Career mode · recorded ambience/horns/sirens ·
   calm notification sounds · directional lighting & light rays ·
   air particles · soft smoke · motion blur · g-force passengers ·
   dashboard speed-limit pin & integrated tell-tales
   ===================================================================== */
/* ---------------- recorded audio samples ---------------- */
const SND = {buf:{}, loading:false,
 load(){ if (this.loading || !AU.ctx) return; this.loading = true; ['snd_street','snd_rain','snd_h1','snd_h2','snd_h3','snd_h4','snd_h5','snd_pol','snd_amb'].forEach(k => { if (!ASSETS[k]) return; fetch(ASSETS[k]).then(r => r.arrayBuffer()).then(b => AU.ctx.decodeAudioData(b)).then(d => { this.buf[k] = d; }).catch(e => console.warn('snd', k, e)); }); },
 play(k, vol, rate, loop){ const c = AU.ctx, b = this.buf[k]; if (!c || !b) return null; const s = c.createBufferSource(); s.buffer = b; s.loop = !!loop; s.playbackRate.value = rate || 1; const g = c.createGain(); g.gain.value = vol; s.connect(g).connect(AU.sfxG); s.start(); return {s, g}; }
};
const _auInit9 = AU.init.bind(AU);
AU.init = function(){ _auInit9(); SND.load(); };
/* horns: the recorded set, calm levels; class-appropriate stock horn */
COS.horn = [{id:'stock', p:0, n:['الأصلي (حسب العربية)','Stock (matches vehicle)']}, {id:'gentle', p:250, n:['كلاكس هادي','Gentle sedan honk']}, {id:'double', p:300, n:['بيب بيب','Compact double beep']}, {id:'taxi', p:300, n:['كلاكس تاكسي قصير','Short taxi honk']}, {id:'low', p:450, n:['كلاكس عميق مهذب','Low polite honk']}, {id:'taps', p:350, n:['نقرتين خفاف','Two light taps']}];
const HORNK = {gentle:'snd_h1', double:'snd_h2', taxi:'snd_h3', low:'snd_h4', taps:'snd_h5'};
const _hornOld9 = AU.horn.bind(AU);
AU.horn = function(kind, big, vol){ let k = HORNK[kind], rate = 1; const v = vol == null ? 1 : vol;
 if (!k){ if (vol != null && vol < 1){ k = ['snd_h1','snd_h2','snd_h4','snd_h5'][(Math.random() * 4) | 0]; rate = .92 + Math.random() * .16; } else { const V = G.V || VEHS[0]; k = V.cls === 'micro' ? (V.id === 'coaster' ? 'snd_h1' : 'snd_h3') : 'snd_h4'; rate = V.cls === 'coach' ? .8 : V.cls === 'bus' ? .86 : 1; } }
 if (!SND.play(k, .5 * v, rate)) _hornOld9(kind, big, v * .6); };
/* sirens: looping recordings with distance, stereo and doppler */
SIREN.update = function(){ const c = AU.ctx; if (!c || G.mode !== 'play' || G.paused) return; const car = G.car, live = new Set();
 for (const a of G.ai){ if (!a.siren) continue; const d = Math.abs(a.x - car.x); if (d > 240) continue; const k = a.siren === 'amb' ? 'snd_amb' : 'snd_pol'; if (!SND.buf[k]) continue; live.add(a); let s = this.v.get(a);
  if (!s){ const p = SND.play(k, 0, 1, true); if (!p) continue; const pan = c.createStereoPanner ? c.createStereoPanner() : null; if (pan){ p.g.disconnect(); p.g.connect(pan).connect(AU.sfxG); } s = {o:p.s, g:p.g, pan}; this.v.set(a, s); }
  const rel = (a.vx - car.vx) * Math.sign(car.x - a.x); s.o.playbackRate.setTargetAtTime(clamp(343 / (343 - clamp(rel, -30, 30)), .9, 1.1), c.currentTime, .1);
  s.g.gain.setTargetAtTime(.32 * Math.pow(clamp(1 - d / 240, 0, 1), 1.5), c.currentTime, .15); if (s.pan) s.pan.pan.setTargetAtTime(clamp((a.x - car.x) / 70, -1, 1), c.currentTime, .1); }
 this.v.forEach((s, a) => { if (!live.has(a)){ s.g.gain.setTargetAtTime(0, c.currentTime, .15); try{ s.o.stop(c.currentTime + .6); }catch(e){} this.v.delete(a); } }); };
/* ambience: recorded calm Egyptian street + rain on the roof; procedural beds reduced to wind/sea only */
const AMB9 = {street:null, rain:null};
const _ambU9 = AMBI.update.bind(AMBI);
AMBI.update = function(dt){ _ambU9(dt); const c = AU.ctx; if (!c) return; const n = this.n; if (n){ n.city.g.gain.value = 0; n.crowd.g.gain.value = 0; } this.bird = this.horn = 1e9;
 const on = G.mode === 'play' && !G.paused, urban = on ? W.biome.urban : 0, amb = setv('amb');
 if (SND.buf.snd_street && !AMB9.street) AMB9.street = SND.play('snd_street', 0, 1, true);
 if (SND.buf.snd_rain && !AMB9.rain) AMB9.rain = SND.play('snd_rain', 0, 1, true);
 if (AMB9.street) AMB9.street.g.gain.setTargetAtTime(on ? amb * (.12 + urban * .3) * (G.tod === 'night' ? .7 : 1) : 0, c.currentTime, .8);
 if (AMB9.rain) AMB9.rain.g.gain.setTargetAtTime(on && G.weather === 'rain' ? .42 * Math.max(.4, S.set.sfx) : 0, c.currentTime, .8); };
const _eng9 = AU.engine.bind(AU);
AU.engine = function(on, rpm, load, speed, big){ _eng9(on, rpm, load, speed, big, false); };
{ const _aiu = AISND.update.bind(AISND); AISND.update = function(){ _aiu(); if (this.v) this.v.forEach(v => { v.g.gain.value *= .6; v.g2.gain.value *= .6; }); }; }
/* ---------------- calm, topic-aware notification sounds ---------------- */
AU.mallet = function(f, t0, g, dur){ const c = this.ctx; if (!c) return; const t = c.currentTime + (t0 || 0); [1, 2.01, 3.98].forEach((m, i) => { const o = c.createOscillator(), gg = c.createGain(); o.type = 'sine'; o.frequency.value = f * m; gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime((g || .05) / (1 + i * 2.5), t + .008); gg.gain.exponentialRampToValueAtTime(.0001, t + (dur || .9) / (1 + i)); o.connect(gg).connect(this.sfxG); o.start(t); o.stop(t + (dur || .9) + .05); }); };
let lastNote9 = 0;
function notifySound(msg, cls){ if (!AU.ctx) return; const now = performance.now(); if (now - lastNote9 < 280) return; lastNote9 = now; const m = String(msg);
 if (/🚨|👮|🛑/.test(m)) { AU.mallet(523, 0, .04); AU.mallet(392, .16, .04); return; }
 if (/⛽|🛢/.test(m)) { AU.tone(420, .18, 'sine', .03, 0, 380); AU.tone(560, .14, 'sine', .02, .12, 300); return; }
 if (/☕|🫖|🥙/.test(m)) { AU.mallet(1568, 0, .025, .35); AU.mallet(2093, .09, .02, .3); return; }
 if (/🔥|😴/.test(m)) { AU.mallet(220, 0, .05, 1.2); AU.mallet(233, .02, .03, 1.2); return; }
 if (/⭐|🏅|🎉|🪪|🎖/.test(m)) { [784, 988, 1175, 1568].forEach((f, i) => AU.mallet(f, i * .07, .03, .6)); return; }
 if (/🛣|💰|\+/.test(m) && cls !== 'bad') { AU.mallet(1319, 0, .03, .4); AU.mallet(1760, .07, .025, .45); return; }
 if (cls === 'good') { AU.mallet(659, 0, .035); AU.mallet(784, .09, .035); AU.mallet(988, .18, .03); }
 else if (cls === 'bad') { AU.mallet(330, 0, .04, 1); AU.mallet(262, .14, .035, 1.1); }
 else { AU.mallet(880, 0, .03, .7); AU.mallet(1320, .05, .015, .6); } }
const _toast9 = toastUI;
toastUI = function(msg, cls, acts, life){ if (G.career && msg === t('testDrive')) return; _toast9(msg, cls, acts, life); try{ notifySound(msg, cls); }catch(e){} };
/* ---------------- pedestrians: clean walk cycles only (no split/partial frames) ---------------- */
(function cleanPeds(){ META.peds = META.peds.map(fr => { const ws = fr.map(f => META[f].w).sort((a, b) => a - b), mw = ws[ws.length >> 1]; const ok = fr.filter(f => META[f].h > 150 * .86 && META[f].w > mw * .55 && META[f].w < mw * 1.8); return ok.length >= 4 ? ok : fr; }); })();
/* ---------------- police checkpoint stop mark ---------------- */
function drawCheckpointMarks(){ if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), t = G.time, pulse = .5 + .5 * Math.sin(t * 5);
 for (const c of W.cps){ if (c.x < x0 - 30 || c.x > x1 + 30) continue; const a = c.x - 18, b = c.x - 4, act = c.state === 'signal' || c.state === 'check';
  roadQuad(a, b + .4, .5, -.16); ctx.fillStyle = `rgba(230,40,50,${act ? .22 + .15 * pulse : .14})`; ctx.fill(); ctx.setLineDash([PPM * .45, PPM * .3]); ctx.lineWidth = Math.max(2, PPM * .07); ctx.strokeStyle = 'rgba(255,70,80,.95)'; ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.font = `900 ${Math.max(13, PPM * .5)}px Lalezar, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fillText('قف  STOP', sx((a + b) / 2), sy(terrH((a + b) / 2) + .17)); ctx.restore();
  // octagon stop sign on the kerb
  const X = sx(c.x - 17), Y = sy(terrH(c.x - 17) + 1.95), pole = PPM * 2.3, r = clamp(PPM * .42, 12, 24); ctx.fillStyle = '#7a828c'; ctx.fillRect(X - PPM * .05, Y - pole, PPM * .1, pole);
  ctx.save(); ctx.translate(X, Y - pole - r * .6); ctx.beginPath(); for (let i = 0; i < 8; i++){ const an = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fillStyle = '#c8102e'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = `900 ${r * .62}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('قف', 0, 1); ctx.restore(); } }
/* ---------------- realistic under-glow: cast on the ground ---------------- */
function drawUnderglow(){ const car = G.car; if (!car || !car.glowCol) return; const w = car.wh, x0 = Math.min(...w.map(q => q.x)) - .4, x1 = Math.max(...w.map(q => q.x)) + .4, cx = (x0 + x1) / 2, X = sx(cx), Y = sy(terrH(cx)) + 1, rw = (x1 - x0) / 2 * PPM;
 ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(X, Y); ctx.scale(1, .1); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rw); g.addColorStop(0, car.glowCol + '88'); g.addColorStop(.6, car.glowCol + '33'); g.addColorStop(1, car.glowCol + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rw, 0, 7); ctx.fill(); ctx.restore(); }
/* ---------------- passengers react to g-forces ---------------- */
function paxView(){ const cap = G.V.seats; G.onboard.forEach((p, i) => { p.st = i >= cap; }); return G.onboard; }
function gforceStep(dt){ const car = G.car; if (!car || dt <= 0) return; const ax = (car.vx - (G._gvx || 0)) / dt, ay = (car.vy - (G._gvy || 0)) / dt; G._gvx = car.vx; G._gvy = car.vy;
 const axs = clamp(ax, -12, 12), ays = clamp(ay, -20, 20);
 G.onboard.forEach((p, i) => { const k = p.st ? 18 : 30, c = p.st ? 3.2 : 5.5, m = .8 + ((p.t * 37 + i) % 10) / 25; p._sx = p._sx || 0; p._vx = p._vx || 0; p._sy = p._sy || 0; p._vy = p._vy || 0;
  const tx = -axs * (p.st ? .022 : .012) * m, ty = -ays * .004; p._vx += (k * (tx - p._sx) - c * p._vx) * dt; p._sx = clamp(p._sx + p._vx * dt, -.25, .25); p._vy += (40 * (ty - p._sy) - 7 * p._vy) * dt; p._sy = clamp(p._sy + p._vy * dt, -.08, .08); }); }
const CABB = {};
function cabinCanvas(V, cos, pax, forPreview){ const K = cabinMask(V), bkey = V.id + '|' + cos.tint + '|' + (cos.curtain || 'none');
 let B = CABB[V.id]; if (!B || B.key !== bkey){ const base = document.createElement('canvas'); base.width = K.w; base.height = K.h; const x = base.getContext('2d'), ppm = K.w / V.len;
  const g = x.createLinearGradient(0, K.top, 0, K.sill); g.addColorStop(0, '#2b3138'); g.addColorStop(1, '#161a1f'); x.fillStyle = g; x.fillRect(0, 0, K.w, K.h);
  const zone = K.maxX - K.minX, slotW = .62 * ppm, slots = Math.max(2, Math.floor(zone / slotW)); x.fillStyle = V.cls === 'coach' ? '#28406e' : '#3b3f46'; for (let i = 0; i < slots; i++){ const sx2 = K.minX + (i + .5) * zone / slots; x.beginPath(); x.roundRect ? x.roundRect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm, 4) : x.rect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm); x.fill(); }
  const over = document.createElement('canvas'); over.width = K.w; over.height = K.h; const o = over.getContext('2d');
  const CU = {red:['#8e1b2c','#e0b04a'], blue:['#1d3f8a','#d9d9d9'], green:['#1f6b3a','#e0b04a'], gold:['#b8862e','#fff1b8']}[cos.curtain];
  if (CU){ for (let i = 0; i <= slots; i++){ const cx2 = K.minX + i * zone / slots; o.fillStyle = CU[0]; o.beginPath(); o.moveTo(cx2 - slotW * .22, K.top); o.quadraticCurveTo(cx2 - slotW * .05, (K.top + K.sill) / 2, cx2 - slotW * .14, K.sill); o.lineTo(cx2 + slotW * .14, K.sill); o.quadraticCurveTo(cx2 + slotW * .05, (K.top + K.sill) / 2, cx2 + slotW * .22, K.top); o.fill(); o.fillStyle = CU[1]; o.fillRect(cx2 - slotW * .22, K.top, slotW * .44, ppm * .05); } o.fillStyle = CU[0]; o.fillRect(K.minX, K.top, zone, ppm * .08); }
  const TA = (COS.tint.find(q => q.id === cos.tint) || {a:0}).a; o.fillStyle = `rgba(14,20,28,${.12 + TA * .85})`; o.fillRect(0, 0, K.w, K.h);
  const rg = o.createLinearGradient(0, K.top, K.w * .25, K.sill); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(.45, `rgba(255,255,255,${.16 - TA * .08})`); rg.addColorStop(.55, 'rgba(255,255,255,.02)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); o.fillStyle = rg; o.fillRect(0, 0, K.w, K.h);
  const dyn = document.createElement('canvas'); dyn.width = K.w; dyn.height = K.h; B = CABB[V.id] = {key:bkey, base, over, dyn, slots, zone, ppm}; }
 const x = B.dyn.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, K.w, K.h); x.drawImage(B.base, 0, 0);
 const seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st), order = []; for (let i = 0; i < B.slots; i++) order.push(i); order.sort((a, b) => ((a * 7) % B.slots) - ((b * 7) % B.slots));
 const drawP = (p, px, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const H = (p.h || 1.7) * B.ppm * pedRel(p.t, im), W2 = im.width / im.height * H, headTop = K.sill - (stand ? 1.05 : .55) * B.ppm; const ox = (p._sx || 0) * B.ppm, oy = (p._sy || 0) * B.ppm;
  x.save(); x.translate(px + ox, headTop + oy + H); x.rotate(clamp((p._sx || 0) * .9, -.2, .2)); const fl = !forPreview && wantsOff(p) && Math.floor(G.time * 4) % 2 === 0; if (fl) x.filter = 'brightness(1.6) sepia(.9) saturate(3.5) hue-rotate(-8deg) drop-shadow(0 0 3px #ffd35a)'; x.drawImage(im, -W2 / 2, -H, W2, H); x.filter = 'none'; x.restore(); };
 seated.slice(0, B.slots).forEach((p, i) => drawP(p, K.minX + (order[i] + .5) * B.zone / B.slots, false));
 standing.slice(0, Math.max(1, B.slots >> 1)).forEach((p, i) => drawP(p, K.minX + B.zone * (.3 + .4 * ((i * .37) % 1)), true));
 x.drawImage(B.over, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0); x.globalCompositeOperation = 'source-over';
 return B.dyn; }
for (const k in CAB) delete CAB[k];
/* ---------------- directional lighting, light rays, bloom ---------------- */
let LCV9 = null;
function drawNight(){
 const tod = G.tod, dark = tod === 'night' ? .6 : tod === 'sunset' ? .16 : 0, [x0, x1] = viewX(), car = G.car;
 if (dark > 0){ if (!LCV9) LCV9 = document.createElement('canvas'); if (LCV9.width !== cv.width || LCV9.height !== cv.height){ LCV9.width = cv.width; LCV9.height = cv.height; }
  const l = LCV9.getContext('2d'); l.setTransform(DPR, 0, 0, DPR, 0, 0); l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, VW, VH); l.fillStyle = `rgba(4,8,22,${dark})`; l.fillRect(0, 0, VW, VH); l.globalCompositeOperation = 'destination-out';
  const hole = (x, y, r, a) => { const g = l.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.arc(x, y, r, 0, 7); l.fill(); };
  const cone = (x, y, dx, len, w0, w1, a) => { const g = l.createLinearGradient(x, y, x + dx * len, y); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.moveTo(x, y - w0); l.lineTo(x + dx * len, y - w1 * .35); l.lineTo(x + dx * len, y + w1); l.lineTo(x, y + w0); l.fill(); };
  for (const p of W.props) if ((p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') && p.x > x0 && p.x < x1){ const hx = sx(p.x + (p.k === 'lamp' ? .9 : 0)), hy = sy(terrH(p.x) + 1.95 + PROP_H[p.k] * .95), gy = sy(terrH(p.x) + .3); l.fillStyle = 'rgba(0,0,0,.55)'; l.beginPath(); l.moveTo(hx - PPM * .3, hy); l.lineTo(hx - PPM * 3, gy); l.lineTo(hx + PPM * 3, gy); l.lineTo(hx + PPM * .3, hy); l.fill(); hole(hx, gy, PPM * 3.5, .7); hole(hx, hy, PPM * 1.2, .9); }
  for (const d of W.deco) if (d.x > x0 - 10 && d.x < x1 + 10) hole(sx(d.x), sy(terrH(d.x) + 2.6), d.w * PPM * .5, .35);
  for (const c of [car, ...G.ai]){ if (!c) continue; const M = META[c.spr], dir = c.mirror ? -1 : 1, lift = c.lift || 0; const k = PPM * c.g.s, hlx = (M.hl[0] - M.w / 2) * k * dir, hly = (M.hl[1] - M.h / 2) * k, ca = Math.cos(-c.a), sa = Math.sin(-c.a); const X = sx(c.x) + hlx * ca - hly * sa, Y = sy(c.y + lift) + hlx * sa + hly * ca;
   if (c.headOn !== false && !c.brokenHL){ cone(X, Y, dir, PPM * (c.player ? 24 : 16), PPM * .25, PPM * 3.2, .95); hole(X, Y, PPM * 1.1, .9); } }
  ctx.drawImage(LCV9, 0, 0, VW, VH);
 }
 // additive colour light: headlight rays & bloom, lamp spots, shop glows, brake reflections
 ctx.save(); ctx.globalCompositeOperation = 'lighter'; const nightK = tod === 'night' ? 1 : tod === 'sunset' ? .45 : .12;
 for (const c of [car, ...G.ai]){ if (!c || c.brokenHL) continue; if (!(c.headOn || tod !== 'day')) continue; const M = META[c.spr], dir = c.mirror ? -1 : 1, lift = c.lift || 0, k = PPM * c.g.s * (c.lift ? .92 : 1), hlx = (M.hl[0] - M.w / 2) * k * dir, hly = (M.hl[1] - M.h / 2) * k, ca = Math.cos(-c.a), sa = Math.sin(-c.a), X = sx(c.x) + hlx * ca - hly * sa, Y = sy(c.y + lift) + hlx * sa + hly * ca, col = c.lightCol || '255,236,190';
  if (nightK < .3) continue; const b = ctx.createRadialGradient(X, Y, 0, X, Y, PPM * .9); b.addColorStop(0, `rgba(${col},${.55 * nightK})`); b.addColorStop(.25, `rgba(${col},${.18 * nightK})`); b.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = b; ctx.beginPath(); ctx.arc(X, Y, PPM * .9, 0, 7); ctx.fill();
  if (nightK > .3){ ctx.save(); ctx.translate(X, Y); ctx.rotate(-c.a); for (let r = 0; r < 4; r++){ const ang = (r - 1.5) * .045, len = PPM * (c.player ? 20 : 13); const g = ctx.createLinearGradient(0, 0, dir * len, 0); g.addColorStop(0, `rgba(${col},${.07 * nightK})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -1.5); ctx.lineTo(dir * len * Math.cos(ang), len * Math.sin(ang) - PPM * .5); ctx.lineTo(dir * len * Math.cos(ang), len * Math.sin(ang) + PPM * .9); ctx.lineTo(0, 1.5); ctx.fill(); } ctx.restore(); }
  if (c.braking && nightK > .3){ const tl = M.tl, tx2 = (tl[0] - M.w / 2) * k * dir, ty2 = (tl[1] - M.h / 2) * k, TX = sx(c.x) + tx2 * ca - ty2 * sa, TY = sy(c.y + lift) + tx2 * sa + ty2 * ca, gy = sy(terrH(c.x - dir * c.L / 2) + lift); const g = ctx.createRadialGradient(TX, gy, 0, TX, gy, PPM * 2.2); g.addColorStop(0, `rgba(255,30,30,${.28 * nightK})`); g.addColorStop(1, 'rgba(255,30,30,0)'); ctx.fillStyle = g; ctx.fillRect(TX - PPM * 2.2, gy - PPM * .5, PPM * 4.4, PPM * 1); } }
 if (nightK > .3){ for (const p of W.props){ if (!(p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') || p.x < x0 || p.x > x1) continue; const hx = sx(p.x + (p.k === 'lamp' ? .9 : 0)), hy = sy(terrH(p.x) + 1.95 + PROP_H[p.k] * .95), gy = sy(terrH(p.x) + .3); const g = ctx.createLinearGradient(0, hy, 0, gy); g.addColorStop(0, `rgba(255,205,140,${.2 * nightK})`); g.addColorStop(1, `rgba(255,205,140,${.04 * nightK})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx - PPM * .25, hy); ctx.lineTo(hx - PPM * 2.8, gy); ctx.lineTo(hx + PPM * 2.8, gy); ctx.lineTo(hx + PPM * .25, hy); ctx.fill(); const pool = ctx.createRadialGradient(hx, gy, 0, hx, gy, PPM * 3.2); pool.addColorStop(0, `rgba(255,190,120,${.16 * nightK})`); pool.addColorStop(1, 'rgba(255,190,120,0)'); ctx.save(); ctx.translate(hx, gy); ctx.scale(1, .25); ctx.translate(-hx, -gy); ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(hx, gy, PPM * 3.2, 0, 7); ctx.fill(); ctx.restore(); }
  for (const d of W.deco){ if (d.x < x0 - 10 || d.x > x1 + 10) continue; const tint = /Pharm|Labs|Hosp|Metro/.test(d.k) ? '90,220,200' : /Kosh|Foul|Grill|Ahwa|Cafe|Rest|Sweets/.test(d.k) ? '255,170,90' : /Bank|Office|Mobiles/.test(d.k) ? '150,190,255' : '255,210,150'; const gx = sx(d.x), gy = sy(terrH(d.x) + 2.4), r = d.w * PPM * .55; const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); g.addColorStop(0, `rgba(${tint},${.16 * nightK})`); g.addColorStop(1, `rgba(${tint},0)`); ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, r * 2, r * 1.3); }
  for (const l of W.lights){ if (l.x < x0 || l.x > x1) continue; const st = lightState(l), col = st === 'g' ? '40,255,120' : st === 'y' ? '255,190,40' : '255,50,50', gx = sx(l.x + 1), gy = sy(terrH(l.x) + .4), g = ctx.createRadialGradient(gx, gy, 0, gx, gy, PPM * 2.6); g.addColorStop(0, `rgba(${col},${.18 * nightK})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(gx - PPM * 2.6, gy - PPM * .8, PPM * 5.2, PPM * 1.6); } }
 ctx.restore();
 // daytime / sunset god rays from the sun
 if (tod !== 'night' && S.set.gfx !== 'low'){ const sxp = VW * (tod === 'sunset' ? .8 : .74), syp = tod === 'sunset' ? horizon() - VH * .06 : VH * .14, a0 = tod === 'sunset' ? .06 : .035; ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 7; i++){ const an = Math.PI * (.55 + i * .07) + Math.sin(G.time * .05 + i) * .02, len = VH * 1.3, w = .03 + (i % 3) * .015; const g = ctx.createLinearGradient(sxp, syp, sxp + Math.cos(an) * len, syp + Math.sin(an) * len); g.addColorStop(0, tod === 'sunset' ? `rgba(255,170,90,${a0})` : `rgba(255,248,220,${a0})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sxp, syp); ctx.lineTo(sxp + Math.cos(an - w) * len, syp + Math.sin(an - w) * len); ctx.lineTo(sxp + Math.cos(an + w) * len, syp + Math.sin(an + w) * len); ctx.fill(); } ctx.restore(); }
}
/* ---------------- lightweight air particles ---------------- */
const MOTES = Array.from({length:70}, (_, i) => ({x:hash(i * 3), y:hash(i * 7 + 1), z:.3 + hash(i * 11) * .9, s:.6 + hash(i * 13) * 1.6, ph:hash(i * 17) * 6.28}));
function drawMotes(){ if (S.set.gfx === 'low') return; const night = G.tod === 'night', t = G.time, col = night ? '190,210,255' : G.weather === 'sand' ? '230,190,130' : '255,245,220';
 ctx.save(); for (const m of MOTES){ let x = (m.x * VW * 1.3 - cam.x * PPM * .05 * m.z + t * 8 * m.z) % (VW * 1.3); if (x < 0) x += VW * 1.3; x -= VW * .15; const y = (m.y * VH + Math.sin(t * .4 + m.ph) * 14 * m.z) % VH; const a = (.08 + .14 * m.z) * (.6 + .4 * Math.sin(t * .9 + m.ph)); ctx.fillStyle = `rgba(${col},${a})`; ctx.beginPath(); ctx.arc(x, y, m.s * m.z, 0, 7); ctx.fill(); } ctx.restore(); }
/* ---------------- soft, realistic smoke & particles ---------------- */
const SOFT = new Map();
function softTex(col){ let c = SOFT.get(col); if (c) return c; c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, col); g.addColorStop(.45, col.replace(/rgb\(([^)]+)\)/, 'rgba($1,.55)')); g.addColorStop(1, col.replace(/rgb\(([^)]+)\)/, 'rgba($1,0)')); x.fillStyle = g; x.fillRect(0, 0, 64, 64); if (SOFT.size > 60) SOFT.clear(); SOFT.set(col, c); return c; }
const hex2rgb = h => h[0] === '#' ? `rgb(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)})` : h;
const FIRECOL = /#ff7b00|#ffb300|#ff3b00|#FFD24A/i;
function puff(x, y, vx, vy, life, size, col, kind){ if (PARTS.length > (S.set.gfx === 'low' ? 140 : 480)) return; PARTS.push({x, y, vx, vy, life, max:life, size, s0:size, col, kind, rot:Math.random() * 6.28, spin:(Math.random() - .5) * 1.5, seed:Math.random() * 100, fire:FIRECOL.test(col)}); }
function updParts(dt){
 for (let i = PARTS.length - 1; i >= 0; i--){ const p = PARTS[i]; p.life -= dt; if (p.life <= 0){ PARTS.splice(i, 1); continue; } const age = 1 - p.life / p.max;
  if (p.kind === 'spark' || p.kind === 'glass' || p.kind === 'drop'){ p.vy -= 9.8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; const gy = terrH(p.x); if (p.y < gy){ p.y = gy; p.vy *= -.35; p.vx *= .6; } }
  else { const turb = Math.sin(G.time * 2.3 + p.seed) * .6 + Math.sin(G.time * 5.1 + p.seed * 2) * .25; p.vx = p.vx * (1 - dt * .9) + turb * dt; p.vy = p.vy * (1 - dt * .4) + (p.kind === 'smoke' ? (p.fire ? 1.6 : .45) : .05) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.size = p.s0 * (1 + age * (p.kind === 'dust' ? 3.2 : p.fire ? 1.2 : 4)); p.rot += p.spin * dt; } }
 for (let i = FLOATS.length - 1; i >= 0; i--){ const f = FLOATS[i]; f.life -= dt; f.y += dt * 1.2; if (f.life <= 0) FLOATS.splice(i, 1); }
}
function drawParts(){
 for (const p of PARTS){ const X = sx(p.x), Y = sy(p.y); if (X < -100 || X > VW + 100) continue; const age = 1 - p.life / p.max;
  if (p.kind === 'spark'){ ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,${180 - age * 120 | 0},60,${1 - age})`; ctx.lineWidth = Math.max(1, PPM * .035); ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - p.vx * PPM * .035, Y + p.vy * PPM * .035); ctx.stroke(); ctx.restore(); continue; }
  if (p.kind === 'drop'){ ctx.strokeStyle = `rgba(215,232,250,${(1 - age) * .75})`; ctx.lineWidth = Math.max(1.5, PPM * .04); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - p.vx * PPM * .035, Y + p.vy * PPM * .035); ctx.stroke(); continue; }
  if (p.kind === 'glass'){ ctx.fillStyle = `rgba(220,240,255,${1 - age})`; ctx.fillRect(X, Y, 2, 2); continue; }
  const a = p.fire ? (1 - age) * .9 : (age < .12 ? age / .12 : 1 - (age - .12) / .88) * (p.kind === 'dust' ? .35 : .55), r = Math.max(2, p.size * PPM * 1.3);
  ctx.save(); if (p.fire) ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(X, Y); ctx.rotate(p.rot); ctx.drawImage(softTex(hex2rgb(p.col)), -r, -r, r * 2, r * 2); ctx.restore(); }
 ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (const f of FLOATS){ ctx.globalAlpha = clamp(f.life, 0, 1); ctx.font = `${Math.max(16, PPM * .55)}px Lalezar, sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(f.txt, sx(f.x), sy(f.y)); ctx.fillStyle = f.col; ctx.fillText(f.txt, sx(f.x), sy(f.y)); }
 ctx.globalAlpha = 1;
}
/* ---------------- subtle motion blur (background streak at speed) ---------------- */
let MB9 = null, MBX = 0;
function motionBlur(){ if (S.set.gfx === 'low' || !G.car) return; const sp = speedOf(G.car); if (!MB9){ MB9 = document.createElement('canvas'); } const w = Math.round(cv.width / 2), h = Math.round(cv.height / 2); if (MB9.width !== w){ MB9.width = w; MB9.height = h; }
 const dx = (cam.x - MBX) * PPM; MBX = cam.x; if (sp > 7 && Math.abs(dx) < 60){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp((sp - 7) / 60, 0, .22); ctx.drawImage(MB9, dx * DPR * .6, 0, cv.width, cv.height); ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
 MB9.getContext('2d').drawImage(cv, 0, 0, w, h); }
/* ---------------- render pipeline additions ---------------- */
const _dw9 = drawWorld;
drawWorld = function(){ _dw9(); drawCheckpointMarks(); drawUnderglow(); };
const _render9 = render;
render = function(){ _render9(); try{ ctx.setTransform(DPR, 0, 0, DPR, 0, 0); drawMotes(); motionBlur(); }catch(e){ reportErr('fx9', e); } };
/* ---------------- per-frame (g-force, underglow colour) ---------------- */
const _upd9 = update;
update = function(dt){ _upd9(dt); if (G.mode !== 'play') return; gforceStep(dt); const car = G.car; if (car.glow){ car.glowCol = car.glow; car.glow = null; } };
/* ---------------- AI obeys every traffic light, in every lane ---------------- */
/* (patched in realism.js: the light check now applies to all AI regardless of lane) */
/* ---------------- dashboard: speed-limit pin + integrated tell-tales ---------------- */
const _dc9 = drawCluster;
drawCluster = function(){ _dc9(); const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight, car = G.car; if (!W2 || !car) return; const x = c.getContext('2d');
 const lim = curLimit(car.x), ang = (-113 + clamp(lim / 160, 0, 1) * 228) * Math.PI / 180, cx = W2 * .234, cy = H2 * .635, R = W2 * .145;
 x.save(); x.translate(cx, cy); x.rotate(ang); x.fillStyle = '#ff3b3b'; x.shadowColor = '#ff3b3b'; x.shadowBlur = 6; x.beginPath(); x.moveTo(0, -R - W2 * .004); x.lineTo(-W2 * .009, -R - W2 * .022); x.lineTo(W2 * .009, -R - W2 * .022); x.closePath(); x.fill(); x.restore();
 const sxl = W2 * .305, syl = H2 * .87, rr = H2 * .075; x.save(); x.fillStyle = '#fff'; x.strokeStyle = '#d91c2c'; x.lineWidth = rr * .28; x.beginPath(); x.arc(sxl, syl, rr, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#111'; x.font = `800 ${rr * .95}px "Readex Pro", sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lim, sxl, syl + 1); if (speedOf(car) * 3.6 > lim + 3){ x.strokeStyle = 'rgba(255,40,40,' + (.5 + .5 * Math.sin(G.time * 8)) + ')'; x.lineWidth = 2; x.beginPath(); x.arc(sxl, syl, rr * 1.35, 0, 7); x.stroke(); } x.restore();
 const blink = Math.floor(G.time * 2.2) % 2 === 0, TT = [['💡', !!car.headOn, '#3d8bff'], ['CC', !!G.cruise, '#3dff8a'], ['❄', !!G.ac, '#46c8ff'], ['ABS', car.absT > 0, '#ffb300'], ['TC', car.tcT > 0, '#ffb300'], ['⚠', car.haz && blink, '#ffb300'], ['⛽', G.fuel < G.fuelMax * .12, '#ffb300'], ['🌡', G.temp > 108, '#ff3b3b'], ['🛢', G.cond && G.cond.oil < 15, '#ff3b3b'], ['🛞', car.wh.some(w => w.flat), '#ffb300'], ['😴', (S.fatigue || 0) > 65, '#ff9a3b']];
 x.save(); x.textAlign = 'center'; x.textBaseline = 'middle'; const fs = H2 * .06; TT.forEach(([s, on, col], i) => { const left = i < 5, j = left ? i : i - 5, n = left ? 5 : 6, gx = left ? W2 * (.13 + j * .036) : W2 * (.69 + j * .03), gy = H2 * .955; x.globalAlpha = on ? 1 : .16; x.font = `800 ${fs * (s.length > 1 && !/\p{Emoji}/u.test(s) ? .75 : 1)}px "Readex Pro", sans-serif`; x.fillStyle = on ? col : '#9aa'; if (on){ x.shadowColor = col; x.shadowBlur = 6; } x.fillText(s, gx, gy); x.shadowBlur = 0; }); x.restore(); };
{ const tt = document.getElementById('tt'); if (tt) tt.style.display = 'none'; const st = document.createElement('style'); st.textContent = '#tt{display:none!important}'; document.head.appendChild(st); }
/* ===================================================================
   CAREER MODE — Ograaa Transport Co.
   =================================================================== */
const CAREER_N = [
 {id:'c0', x:800, y:500, big:true, v:'hiace', t:['سواق تحت التدريب','Trainee Driver'], d:['أول يوم في شركة أجرة للنقل. ميكروباص الشركة وتحت عين المشرف.','Day one at Ograaa Transport Co. — company microbus, supervisor watching.'], req:[['lic','micro']], pre:[], rw:{sal:180, com:.08, veh:['hiace']}},
 {id:'n1', x:1020, y:500, v:'hiace', t:['سواق خط ميكروباص','Microbus Line Driver'], d:['خطك الثابت ورقمك في الموقف.','Your own line and a number at the terminal.'], req:[['shifts',3],['stars2',2]], pre:['c0'], rw:{sal:260, com:.12}},
 {id:'n2', x:600, y:380, v:'fiat128', t:['رخصة تاكسي سرفيس','Service Taxi Endorsement'], d:['الفيات ١٢٨ بتاعت الشركة للمشاوير القصيرة.','The company Fiat 128 for short service runs.'], req:[['clean',2]], pre:['c0'], rw:{sal:200, com:.1, veh:['fiat128']}},
 {id:'n13', x:420, y:260, v:'minivan', t:['سرفيس الميني فان','Minivan Express'], d:['٧ ركاب وسرعة وتوفير.','Seven seats, speed and economy.'], req:[['perfect',10]], pre:['n2'], rw:{sal:240, com:.12, veh:['minivan']}},
 {id:'n3', x:960, y:320, v:'hiace', night:true, t:['شهادة الوردية الليلي','Night Shift Endorsement'], d:['ورديات بالليل بحافز ٢٥٪.','Night shifts with a 25% allowance.'], req:[['night',2]], pre:['n1'], rw:{perk:'night'}},
 {id:'n4', x:960, y:690, v:'hiace', t:['نجمة الأمان','Safety Star'], d:['٥ ورديات من غير ولا مخالفة.','Five shifts without a single fine.'], req:[['clean',5]], pre:['n1'], rw:{bonus:40}},
 {id:'n5', x:1240, y:410, v:'coaster', t:['كابتن ميني باص','Minibus Captain'], d:['الكوستر وخطوط أطول.','The Coaster and longer lines.'], req:[['level',3],['exam','m4']], pre:['n1'], rw:{sal:380, com:.12, veh:['coaster']}},
 {id:'n6', x:1430, y:560, v:'redbus', t:['سواق أتوبيس المدينة','City Bus Driver'], d:['درجة تانية وأول أتوبيس.','Grade 2 and your first bus.'], req:[['lic','bus'],['exam','b1']], pre:['n5'], rw:{sal:600, com:.1, veh:['redbus']}},
 {id:'n7', x:1380, y:790, v:'mcv', t:['سواق نقل عام أول','Senior Public Transport'], d:['الأتوبيس الأزرق وخطوط التحرير.','The blue bus and the Tahrir lines.'], req:[['bus',8]], pre:['n6'], rw:{sal:780, com:.1, veh:['mcv']}},
 {id:'n10', x:1120, y:880, v:'mcv', t:['مشرف خط','Line Supervisor'], d:['بتشرف على ٦ سواقين — مكافأة يومية.','You supervise six drivers — daily bonus.'], req:[['shifts',30]], pre:['n7'], rw:{bonus:300, perk:'daily'}},
 {id:'n8', x:1560, y:300, v:'coachB', t:['كابتن أتوبيس سفر','Intercity Coach Captain'], d:['درجة أولى وطرق السفر.','Grade 1 and the highways.'], req:[['lic','coach'],['exam','c1']], pre:['n7'], rw:{sal:1150, com:.08, veh:['coachB']}},
 {id:'n9', x:1480, y:110, v:'coachO', t:['كابتن السفر الفاخر','Luxury Coach Captain'], d:['رحلات الغردقة وشرم.','Hurghada and Sharm runs.'], req:[['rating',4.6],['exam','c3']], pre:['n8'], rw:{sal:1600, com:.08, veh:['coachO']}},
 {id:'n11', x:1180, y:170, v:'coachO', t:['مدير الأسطول','Fleet Manager'], d:['بتدير أسطول الشركة كله.','You run the whole company fleet.'], req:[['earned',150000]], pre:['n9','n10'], rw:{sal:2600, perk:'daily'}},
 {id:'n12', x:820, y:120, v:'coachB', t:['شريك في الشركة','Company Partner'], d:['نسبة ١٥٪ من كل مكسب بتعمله.','15% share on everything you earn.'], req:[['perfect',100]], pre:['n11'], rw:{perk:'partner'}}
];
const CN = id => CAREER_N.find(n => n.id === id);
const CR = () => S.career || (S.career = {joined:false, done:{}, exams:{}, shifts:0, stars2:0, clean:0, night:0, bus:0, coach:0, earned:0, perf:[], day:''});
function careerVal(k){ const c = CR(); return k === 'perfect' ? (S.stats.perfect || 0) : k === 'level' ? lvlOf(S.xp).l : k === 'rating' ? S.stats.rating : k === 'earned' ? c.earned : c[k] || 0; }
function reqMet(r){ const [k, v] = r; if (k === 'lic') return hasLic(v); if (k === 'exam') return !!CR().exams[v]; return careerVal(k) >= v; }
function reqText(r){ const [k, v] = r, L = {shifts:['ورديات','shifts'], stars2:['ورديات ٢★+','2★+ shifts'], clean:['ورديات نضيفة','clean shifts'], night:['ورديات ليلي','night shifts'], bus:['ورديات أتوبيس','bus shifts'], perfect:['وقفات مظبوطة','perfect stops'], level:['مستوى','level'], rating:['تقييم','rating'], earned:['دخل من الشركة','career earnings']};
 if (k === 'lic') return L2('رخصة ', 'Licence: ') + nm(LIC_GRADES.find(g => g.k === v).n); if (k === 'exam'){ const r2 = ROUTES.find(q => q.id === v); return L2('امتحان: ', 'Exam: ') + nm(r2.from) + ' → ' + nm(r2.to); }
 const cur = careerVal(k); return `${nm(L[k])}: ${k === 'rating' ? fmt(cur, 1) : fmt(Math.floor(cur))} / ${k === 'earned' ? money(v) : fmt(v, k === 'rating' ? 1 : 0)}`; }
const nodeState = n => CR().done[n.id] ? 'done' : n.pre.every(p => CR().done[p]) ? (n.req.every(reqMet) ? 'ready' : 'open') : 'locked';
function careerPay(){ let sal = 0, com = 0, bonus = 0; for (const n of CAREER_N) if (CR().done[n.id]){ sal = Math.max(sal, n.rw.sal || 0); com = Math.max(com, n.rw.com || 0); bonus += n.rw.bonus || 0; } return {sal:sal + bonus, com}; }
const hasPerk = p => CAREER_N.some(n => CR().done[n.id] && n.rw.perk === p);
function careerRank(){ let best = null; for (const n of CAREER_N) if (CR().done[n.id] && (n.rw.sal || 0) >= ((best && best.rw.sal) || 0)) best = n; return best; }
function fleet(){ const s = new Set(); for (const n of CAREER_N) if (CR().done[n.id] && n.rw.veh) n.rw.veh.forEach(v => s.add(v)); return [...s]; }
function perfScore(){ const p = CR().perf; if (!p.length) return 70; return Math.round(p.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, p.length)); }
/* ---------- career screen ---------- */
let CSEL = 'c0', CZOOM = .72, CPAN = null, CVEH = null;
function renderCareer(){
 const el = $('#s-career'), c = CR(), pay = careerPay(), rank = careerRank(), fl = fleet(), sel = CN(CSEL) || CAREER_N[0], st = nodeState(sel), perf = perfScore();
 if (!CPAN) CPAN = {x:0, y:0};
 const nodeHTML = n => { const s = nodeState(n), V = VBY(n.v); return `<button class="cn ${s} ${n.big ? 'big' : ''} ${n.id === CSEL ? 'sel' : ''}" data-cn="${n.id}" style="left:${n.x}px;top:${n.y}px"><span class="cimg ${n.night ? 'night' : ''}"><img src="${ASSETS[V.spr]}"></span>${s === 'done' ? '<i class="cck">✓</i>' : s === 'locked' ? '<i class="clk">🔒</i>' : s === 'ready' ? '<i class="crd">★</i>' : ''}<b>${nm(n.t)}</b></button>`; };
 const links = CAREER_N.flatMap(n => n.pre.map(p => { const a = CN(p), s = CR().done[n.id] ? 'done' : CR().done[p] ? 'open' : 'locked'; return `<line class="cl ${s}" x1="${a.x}" y1="${a.y}" x2="${n.x}" y2="${n.y}"/>`; })).join('');
 el.innerHTML = `<div class="career">
  <div class="chead"><div class="ccard"><img src="${ASSETS.logo}" class="clogo"><div><small>${L2('شركة أجرة للنقل', 'Ograaa Transport Co.')}</small><b>${rank ? nm(rank.t) : L2('لسه ما اتعينتش', 'Not hired yet')}</b><span>${L2('المرتب للوردية', 'Pay per shift')}: <em class="gold">${money(pay.sal)}</em> · ${L2('عمولة', 'Commission')}: <em class="gold">${Math.round(pay.com * 100)}%</em></span></div></div>
   <div class="cstats"><div><b>${fmt(c.shifts)}</b><small>${L2('ورديات', 'Shifts')}</small></div><div><b>${money(c.earned)}</b><small>${L2('دخل الشركة', 'Earned')}</small></div><div class="perf" style="--p:${perf}"><b>${fmt(perf)}</b><small>${L2('الأداء', 'Performance')}</small></div></div></div>
  <div class="cstage" id="cStage"><div class="crings"><i></i><i></i><i></i><i></i></div><div class="cworld" id="cWorld" style="transform:translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})"><svg class="clinks" width="1800" height="1000">${links}</svg>${CAREER_N.map(nodeHTML).join('')}</div></div>
  <div class="cpanel"><div class="cpimg ${sel.night ? 'night' : ''}"><img src="${ASSETS[VBY(sel.v).spr]}"></div><h3>${nm(sel.t)}</h3><p class="muted">${nm(sel.d)}</p>
   <div class="creq">${sel.req.map(r => `<div class="${reqMet(r) ? 'ok' : ''}">${reqMet(r) ? '✅' : '⬜'} ${reqText(r)}</div>`).join('')}${sel.pre.length ? `<div class="${sel.pre.every(p => c.done[p]) ? 'ok' : ''}">${sel.pre.every(p => c.done[p]) ? '✅' : '⬜'} ${L2('بعد', 'After')}: ${sel.pre.map(p => nm(CN(p).t)).join(' + ')}</div>` : ''}</div>
   <div class="crw">${sel.rw.sal ? `<span>💰 ${money(sel.rw.sal)} / ${L2('وردية', 'shift')}</span>` : ''}${sel.rw.com ? `<span>📈 ${Math.round(sel.rw.com * 100)}% ${L2('عمولة', 'commission')}</span>` : ''}${sel.rw.bonus ? `<span>➕ ${money(sel.rw.bonus)}</span>` : ''}${sel.rw.veh ? `<span>🚐 ${sel.rw.veh.map(v => nm(VBY(v).name)).join('، ')}</span>` : ''}${sel.rw.perk === 'night' ? `<span>🌙 +25% ${L2('ليلي', 'nights')}</span>` : ''}${sel.rw.perk === 'daily' ? `<span>📅 ${L2('مكافأة يومية', 'Daily bonus')}</span>` : ''}${sel.rw.perk === 'partner' ? `<span>🤝 15% ${L2('من كل مكسب', 'of all earnings')}</span>` : ''}</div>
   <div class="mbtns" style="flex-direction:column">${!c.joined ? `<button class="btn big" id="cJoin">✍ ${L2('امضي العقد', 'Sign the contract')}</button>` : st === 'ready' ? `<button class="btn big" id="cPromo">🎖 ${L2('استلم الترقية', 'Accept promotion')}</button>` : ''}
   ${c.joined && st !== 'done' && st !== 'locked' ? sel.req.filter(r => r[0] === 'exam' && !reqMet(r)).map(r => `<button class="btn sec" data-exam="${r[1]}">📝 ${L2('ادخل الامتحان', 'Take the exam')}</button>`).join('') : ''}</div></div>
  <div class="cbar">${c.joined ? `<div class="vpick">${fl.map(v => `<button class="vchip ${v === (CVEH || fl[fl.length - 1]) ? 'on' : ''}" data-cv="${v}"><img src="${ASSETS[VBY(v).spr]}">${nm(VBY(v).name)}</button>`).join('')}</div><span class="sp"></span>${hasPerk('daily') ? `<button class="btn sec" id="cDaily" ${c.day === dayKey() ? 'disabled' : ''}>📅 ${L2('المكافأة اليومية', 'Daily bonus')}</button>` : ''}<button class="btn big" id="cShift">▶ ${L2('ابدأ الوردية', 'Start shift')}</button>` : `<span class="muted">${L2('امضي العقد عشان تبدأ مسيرتك', 'Sign the contract to begin your career')}</span>`}<button class="btn sm sec" id="cZo">−</button><button class="btn sm sec" id="cZi">+</button></div></div>`;
 $$('[data-cn]').forEach(b => b.onclick = e => { e.stopPropagation(); CSEL = b.dataset.cn; { const nn = CN(CSEL); if (nn && fleet().includes(nn.v)) CVEH = nn.v; } AU.init(); AU.mallet(988, 0, .025, .35); renderCareer(); });
 $$('[data-cv]').forEach(b => b.onclick = () => { CVEH = b.dataset.cv; renderCareer(); });
 const j = $('#cJoin'); if (j) j.onclick = () => { if (!hasLic('micro')){ toastUI('🪪 ' + L2('محتاج رخصة درجة تالتة الأول', 'You need a Grade 3 licence first'), 'bad'); DMVTAB = 'lic'; show('traffic'); return; } c.joined = true; c.done.c0 = true; AU.levelUp(); toastUI('🎖 ' + L2('اتعينت في شركة أجرة للنقل!', 'Hired by Ograaa Transport Co.!'), 'good'); save(); renderCareer(); };
 const p = $('#cPromo'); if (p) p.onclick = () => { c.done[sel.id] = true; AU.levelUp(); toastUI('🎖 ' + L2('ترقية! ', 'Promoted! ') + nm(sel.t), 'good', null, 4); S.xp += 60; save(); renderCareer(); };
 $$('[data-exam]').forEach(b => b.onclick = () => startShift(b.dataset.exam));
 const sh = $('#cShift'); if (sh) sh.onclick = () => startShift(null);
 const dl = $('#cDaily'); if (dl) dl.onclick = () => { c.day = dayKey(); ledger(hasPerk('partner') ? 1500 : 500, L2('مكافأة الشركة اليومية', 'Company daily bonus'), 'calendar'); save(); renderCareer(); };
 $('#cZo').onclick = () => { CZOOM = Math.max(.35, CZOOM - .12); renderCareer(); }; $('#cZi').onclick = () => { CZOOM = Math.min(1.3, CZOOM + .12); renderCareer(); };
 const stg = $('#cStage'); let drag = null; stg.onpointerdown = e => { if (e.target.closest('.cn')) return; drag = {x:e.clientX - CPAN.x, y:e.clientY - CPAN.y}; stg.setPointerCapture(e.pointerId); };
 stg.onpointermove = e => { if (!drag) return; CPAN.x = e.clientX - drag.x; CPAN.y = e.clientY - drag.y; $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; }; stg.onpointerup = () => { drag = null; };
 stg.onwheel = e => { e.preventDefault(); CZOOM = clamp(CZOOM - Math.sign(e.deltaY) * .06, .35, 1.3); $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; };
 if (!renderCareer._centered){ renderCareer._centered = true; requestAnimationFrame(() => { const r = stg.getBoundingClientRect(); CPAN.x = r.width / 2 - 800 * CZOOM; CPAN.y = r.height / 2 - 500 * CZOOM; $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; }); }
}
function startShift(exam){ const c = CR(), fl = fleet(); let vid = CVEH && fl.includes(CVEH) ? CVEH : fl[fl.length - 1]; let route;
 if (exam){ route = ROUTES.find(r => r.id === exam); const need = CLS_OK[route.type]; if (!need.includes(vid)) vid = fl.filter(v => need.includes(v)).pop() || need[0]; }
 else { const V = VBY(vid); const list = ROUTES.filter(r => CLS_OK[r.type].includes(vid)); route = pick(list.filter(r => r.lvl <= lvlOf(S.xp).l + 1).length ? list.filter(r => r.lvl <= lvlOf(S.xp).l + 1) : list); }
 if (!route){ toastUI(L2('مفيش خط متاح للمركبة دي', 'No line available for this vehicle'), 'bad'); return; }
 const V = VBY(vid); if (!hasLic(V.cls)){ toastUI('🪪 ' + L2('محتاج رخصة ', 'You need a licence for ') + nm(V.name), 'bad'); DMVTAB = 'lic'; show('traffic'); return; }
 const night = hasPerk('night') && Math.random() < .5;
 play(route, {vid, test:true, career:{exam, night}, tod:night ? 'night' : undefined}); }
const _sr9 = startRoute;
startRoute = function(route, opt){ _sr9(route, opt); G.career = opt && opt.career ? Object.assign({cf:0}, opt.career) : null; if (G.career && G.mode === 'play') setTimeout(() => toastUI((G.career.exam ? '📝 ' + L2('امتحان ترقية — من غير مخالفات و ٢ نجوم على الأقل', 'Promotion exam — no fines and at least 2 stars') : '🏢 ' + L2('وردية لشركة أجرة للنقل', 'Ograaa Transport Co. shift')), 'gold', null, 4), 600); };
const _af9 = addFine;
addFine = function(k, cam){ if (G.career){ const amt = FINE[k] || 300, lbl = t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', vlic:'fVlic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed', kit:'fKit'}[k] || 'fCrash'); G.career.cf += amt; S.lic.points += PTS[k] || 0; toastUI('🚨 ' + lbl + ' — ' + money(amt), 'bad'); AU.whistle(); return; } _af9(k, cam); };
const _showRec9 = showReceipt;
showReceipt = function(R){ if (!G.career){ if (hasPerk('partner') && !R.test && R.net > 0){ const s = Math.round(R.net * .15); ledger(s, L2('نصيب الشريك', 'Partner share'), 'coins'); R.partner = s; } return _showRec9(R); }
 const c = CR(), pay = careerPay(), K = G.career, ok = R.reason === 'ok', nightB = K.night && hasPerk('night') ? .25 : 0, perfB = perfScore() >= 85 ? .1 : 0;
 const sal = ok ? Math.round(pay.sal * (1 + nightB + perfB)) : Math.round(pay.sal * .3), com = Math.round(R.fares * pay.com), dmg = G.T.hits * 150 + (R.reason === 'crash' ? 800 : 0), total = sal + com + Math.round(R.tips) - K.cf - dmg;
 if (total !== 0) ledger(total, L2('مرتب وردية — شركة أجرة', 'Shift pay — Ograaa Transport'), 'cash');
 c.shifts += ok ? 1 : 0; if (R.stars >= 2) c.stars2++; if (ok && K.cf === 0 && !G.T.hits) c.clean++; if (K.night) c.night++; if (G.V.cls === 'bus' && ok) c.bus++; if (G.V.cls === 'coach' && ok) c.coach++; c.earned += Math.max(0, total);
 const score = clamp(Math.round((ok ? 40 : 0) + R.stars * 15 + (K.cf ? 0 : 10) + R.comfort * .05), 0, 100); c.perf.push(score); if (c.perf.length > 30) c.perf.shift();
 let exam = ''; if (K.exam){ const pass = ok && R.stars >= 2 && K.cf === 0 && R.comfort >= 55; if (pass){ c.exams[K.exam] = true; exam = `<div class="rec tot"><span>📝 ${L2('الامتحان', 'Exam')}</span><b class="good">${L2('ناجح ✓', 'PASSED ✓')}</b></div>`; } else exam = `<div class="rec tot"><span>📝 ${L2('الامتحان', 'Exam')}</span><b class="badc">${L2('راسب — حاول تاني', 'Failed — try again')}</b></div>`; }
 const S2 = S.xp; S.xp += R.xp; save(true);
 const row = (l, v, cl) => `<div class="rec"><span>${l}</span><b class="${cl || ''}">${v}</b></div>`;
 $('#recBox').innerHTML = `<h2>🏢 ${L2('كشف الوردية', 'Shift pay slip')}</h2><div class="bigstars">${[0,1,2].map(i => i < R.stars ? '<i>★</i>' : '☆').join('')}</div>
  ${row(L2('المرتب', 'Base pay'), '+' + money(sal), 'good')}${nightB ? row('🌙 ' + L2('حافز ليلي', 'Night allowance'), '+25%', 'good') : ''}${perfB ? row('📈 ' + L2('حافز أداء', 'Performance bonus'), '+10%', 'good') : ''}${row(L2('عمولة الأجرة', 'Fare commission') + ` (${Math.round(pay.com * 100)}%)`, '+' + money(com), 'good')}${row(L2('البقشيش', 'Tips'), '+' + money(R.tips), 'good')}
  ${K.cf ? row(L2('مخالفات', 'Fines'), '−' + money(K.cf), 'badc') : ''}${dmg ? row(L2('خصم تلفيات', 'Damage deduction'), '−' + money(dmg), 'badc') : ''}${row(L2('راحة الركاب', 'Passenger comfort'), fmt(R.comfort) + '%')}${row(L2('تقييم الأداء', 'Performance score'), fmt(score) + '/100')}
  <div class="rec tot"><span>${L2('صافي', 'Net pay')}</span><b class="${total >= 0 ? 'gold' : 'badc'}">${money(total)}</b></div>${exam}<div class="gold">+${fmt(R.xp)} XP</div>
  <div class="mbtns"><button class="btn" id="recCar">🏢 ${L2('المسيرة المهنية', 'Career')}</button><button class="btn sec" id="recMenu2">${t('menu')}</button></div>`;
 $('#recM').classList.add('on'); $('#recCar').onclick = () => { $('#recM').classList.remove('on'); toMenu('career'); }; $('#recMenu2').onclick = () => { $('#recM').classList.remove('on'); toMenu('career'); };
 if (CAREER_N.some(n => nodeState(n) === 'ready')) setTimeout(() => toastUI('🎖 ' + L2('ترقية متاحة في المسيرة المهنية!', 'A promotion is available in Career!'), 'good', null, 4), 900);
};
/* ---------- main menu: Rides · Career · Profile · Settings ---------- */
TX.rides = ['المشاوير','Rides']; TX.career = ['المسيرة المهنية','Career']; TX.profileHub = ['ملفي','Profile'];
const HUB9 = {rides:['routes','garage','showroom','market','traffic'], career:['career'], me:['profile','home'], settings:['settings']}, LAST9 = {};
NAV.length = 0; NAV.push(['rides','i_map'], ['career','i_trophy'], ['me','i_stats'], ['settings','i_settings']); TX.me = ['ملفي','Profile'];
{ const m = document.getElementById('main'); if (m && !document.getElementById('s-career')) m.insertAdjacentHTML('beforeend', '<section class="screen" id="s-career"></section>'); if (m && !document.getElementById('subnav')) m.insertAdjacentHTML('afterbegin', '<div id="subnav"></div>'); }
const _show9 = show;
show = function(id){ if (id === 'home' && !LAST9._boot){ LAST9._boot = 1; id = 'career'; } if (HUB9[id]) id = LAST9[id] || HUB9[id][0]; const hub = Object.keys(HUB9).find(h => HUB9[h].includes(id)) || 'rides'; LAST9[hub] = id;
 if (id === 'career'){ SCR = id; $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-career')); renderCareer(); $('#main').scrollTop = 0; } else _show9(id);
 $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.go === hub));
 const sn = $('#subnav'); const pages = HUB9[hub]; sn.style.display = pages.length > 1 ? 'flex' : 'none'; sn.innerHTML = pages.map(p => `<button class="${p === id ? 'on' : ''}" data-sub="${p}">${t(p === 'home' ? 'wallet' : p === 'profile' ? 'profile' : p)}</button>`).join('');
 $$('[data-sub]').forEach(b => b.onclick = () => { AU.click(); show(b.dataset.sub); }); };
const _toMenu9 = toMenu;
toMenu = function(scr){ _toMenu9(scr === 'home' ? 'career' : scr); };
