"use strict";
/* =====================================================================
   OGRAAA v8 — dynamic cabin, coloured service bays, calm soundscape,
   LCD alignment
   ===================================================================== */
/* ---------------- cabin mask covers the whole window (hides painted-in passengers) ---------------- */
function cabinMask(V){ if (CABM[V.id]) return CABM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h), drv = (DRV[V.id] || .8) * w, lim = Math.round(h * .64);
 let minX = w, maxX = 0, top = h; const bots = [];
 for (let px = Math.ceil(w * .03); px < drv; px++){ let y0 = -1, y1 = -1; for (let py = 0; py < lim; py++) if (M.win[py * w + px]){ if (y0 < 0) y0 = py; y1 = py; }
  if (y0 >= 0 && y1 - y0 > h * .06){ for (let py = y0; py <= y1; py++){ const p = (py * w + px) * 4; d.data[p + 3] = M.src[p + 3] > 150 ? 255 : 0; } minX = Math.min(minX, px); maxX = Math.max(maxX, px); top = Math.min(top, y0); bots.push(y1); } }
 x.putImageData(d, 0, 0); x.filter = 'blur(0.6px)'; x.drawImage(c, 0, 0); x.filter = 'none'; bots.sort((a, b) => a - b);
 return CABM[V.id] = {c, minX, maxX, sill:bots.length ? bots[bots.length >> 1] : h * .5, top, w, h}; }
for (const k in CABM) delete CABM[k]; for (const k in CAB) delete CAB[k];
/* passengers shown = passengers on board, in their own clothes, seated first then standing */
function paxView(){ const V = G.V, cap = V.seats; return G.onboard.map((p, i) => ({t:p.t, h:p.h, st:i >= cap})); }
/* ---------------- no crossing pedestrians anywhere (no messages either) ---------------- */
randomEvent = function(){ G.pedX = {x:-1e9, k:1}; _re5(); G.pedX = null; };
/* ---------------- calm, pleasant soundscape ---------------- */
AU.horn = function(kind, big, vol){ if (!this.ctx) return; const v = vol == null ? 1 : vol, H = (f, d, k) => this.hornVoice(f, d, k, v);
 const seq = (notes, step, len) => notes.forEach((f, i) => setTimeout(() => H([f, f * 1.21], len, 'car'), i * step));
 if (kind === 'melody') return seq([659,784,988,784,659,988], 135, .13); if (kind === 'cuca') return seq([392,392,392,523,659,392,392,392,523,659], 125, .11); if (kind === 'mahr') return seq([440,440,523,440,587,523,440], 100, .09);
 if (kind === 'air' || big) H([185, 233, 277], .8, 'air'); else H([410, 510], .42, 'car'); };
const _hv8 = AU.hornVoice.bind(AU);
AU.hornVoice = function(freqs, dur, kind, vol){ const g = this.sfxG.gain.value; if (vol != null && vol < 1){ const c = this.ctx, tmp = c.createGain(); tmp.gain.value = vol * .7; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ _hv8(freqs, dur, kind); } finally { this.sfxG = real; } return; } const c = this.ctx, tmp = c.createGain(); tmp.gain.value = .72; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ _hv8(freqs, dur, kind); } finally { this.sfxG = real; } };
SIREN.update = (function(orig){ return function(){ orig.call(this); this.v.forEach(s => { try{ s.g.gain.value = Math.min(s.g.gain.value, .045); }catch(e){} }); }; })(SIREN.update);
{ const soft = (fn, k) => { const o = AU[fn].bind(AU); AU[fn] = function(...a){ const c = this.ctx; if (!c) return; const tmp = c.createGain(); tmp.gain.value = k; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ o(...a); } finally { this.sfxG = real; } }; };
  soft('thud', .55); soft('crash', .5); soft('whistle', .45); soft('beep', .5); soft('chime', .6); soft('door', .7); soft('crank', .7); soft('tick', .6); soft('staticBurst', .5); }
/* ---------------- coloured service bays on the road, like stop markers ---------------- */
function drawServiceBays(){ if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), car = G.car, t = G.time, pulse = .5 + .5 * Math.sin(t * 3.5);
 for (const p of W.poi || []){ if (p.x < x0 - 25 || p.x > x1 + 25) continue; const T = POI_T[p.type], col = T.col, rgbc = [1, 3, 5].map(i => parseInt(col.slice(i, i + 2), 16)).join(','), near = Math.abs(car.x - p.x) < 13;
  roadQuad(p.x - 11, p.x + 11, .5, -.16); ctx.fillStyle = `rgba(${rgbc},${near ? .32 : .14 + .08 * pulse})`; ctx.fill(); ctx.setLineDash([PPM * .45, PPM * .3]); ctx.lineWidth = Math.max(2, PPM * .07); ctx.strokeStyle = `rgba(${rgbc},.95)`; ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.font = `800 ${Math.max(12, PPM * .42)}px Lalezar, "Readex Pro", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = `rgba(${rgbc},.95)`; ctx.fillText(T.ic + '  ' + nm(T.n).toUpperCase(), sx(p.x), sy(terrH(p.x) + .17)); ctx.restore();
  // glowing post in the service colour
  const X = sx(p.x - 8), Y = sy(terrH(p.x - 8) + 1.9); const g = ctx.createLinearGradient(0, Y - PPM * 2.6, 0, Y); g.addColorStop(0, `rgba(${rgbc},0)`); g.addColorStop(1, `rgba(${rgbc},${.5 + .3 * pulse})`); ctx.fillStyle = g; ctx.fillRect(X - PPM * .1, Y - PPM * 2.6, PPM * .2, PPM * 2.6);
  if (!near && p.x > car.x) for (let k = 0; k < 4; k++){ const xk = p.x - 13 - ((t * 3.5 + k * 2.6) % 10.4); if (xk < x0) continue; const Xk = sx(xk), Yk = sy(terrH(xk) + .17), s = PPM * .28, al = clamp(1 - (p.x - 13 - xk) / 11, 0, 1); ctx.strokeStyle = `rgba(${rgbc},${al})`; ctx.lineWidth = Math.max(2, PPM * .08); ctx.beginPath(); ctx.moveTo(Xk - s, Yk - s); ctx.lineTo(Xk, Yk); ctx.lineTo(Xk - s, Yk + s); ctx.stroke(); } }
 for (const q of W.rests){ if (q.used || q.x < x0 - 25 || q.x > x1 + 25) continue; ctx.save(); ctx.font = `800 ${Math.max(12, PPM * .42)}px Lalezar, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(80,200,140,.95)'; ctx.fillText('🍽  ' + L2('استراحة', 'REST HOUSE'), sx(q.x), sy(terrH(q.x) + .17)); ctx.restore(); }
}
const _dw8 = drawWorld;
drawWorld = function(){ _dw8(); drawServiceBays(); };
/* make sure every service really has its building right at its bay */
const _v6w8 = v6world;
v6world = function(){ _v6w8(); for (const p of W.poi || []){ const w = (BH5[p.k] || 8) * META[p.k].w / META[p.k].h; W.deco = W.deco.filter(d => d === p.deco || d.x + d.w / 2 < p.x - w / 2 - .4 || d.x - d.w / 2 > p.x + w / 2 + .4); if (!W.deco.some(d => d.k === p.k && Math.abs(d.x - p.x) < 1)){ const d = {k:p.k, x:p.x, h:BH5[p.k] || 8, w}; W.deco.push(d); p.deco = d; } } if (G.mode === 'play') try{ buildTrack(); }catch(e){} };
/* progress-bar pins: services coloured like their bays */
POI_T.cafe.col = '#ffa53b'; POI_T.fuel.col = '#ff4d5e'; POI_T.shop.col = '#4aa8ff'; POI_T.store.col = '#3ddc84';
/* ---------------- LCDs: exact screen placement + auto-scaled text ---------------- */
(function fixLCD(){ const r = document.getElementById('radioLCD'); if (r) r.style.cssText = 'left:22.8%;right:30.4%;top:25.5%;bottom:39.5%'; })();
const _uh8 = updateHUD;
updateHUD = function(dt){ _uh8(dt); const rp = $('#radioP'), rl = $('#radioLCD'); if (rp && rl && rp.clientWidth){ rl.style.fontSize = Math.round(rp.clientWidth * .038) + 'px'; } const ap = $('#acP'), al = $('#acLCD'); if (ap && al && ap.clientWidth) al.style.fontSize = Math.round(ap.clientWidth * .036) + 'px'; };
