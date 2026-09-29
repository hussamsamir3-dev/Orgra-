"use strict";
/* =====================================================================
   OGRAAA v15 — logical cabin seating, premium rain spray,
   single continuous skyline panorama
   ===================================================================== */
/* ---------------- cabin: passengers only sit inside real window cells, scaled to the window ---------------- */
const _cm15 = cabinMask;
cabinMask = function(V){ if (CABM[V.id] && CABM[V.id].cells) return CABM[V.id]; const K = _cm15(V); const w = K.w, h = K.h, d = K.c.getContext('2d').getImageData(0, 0, w, h).data, cells = [];
 let run = null; for (let x = 0; x < w; x++){ let top = -1, bot = -1; for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 100){ if (top < 0) top = y; bot = y; }
  if (top >= 0){ if (!run) run = {x0:x, x1:x, top, bot}; else { run.x1 = x; run.top = Math.min(run.top, top); run.bot = Math.max(run.bot, bot); } } else if (run){ cells.push(run); run = null; } }
 if (run) cells.push(run); K.cells = cells.filter(c => c.x1 - c.x0 > w * .04 && c.bot - c.top > h * .08); if (V.baked && K.cells.length > 1){ K.cells.sort((p, q) => q.x1 - p.x1); K.cells = [K.cells[0]]; }
 if (V.baked){ const c = K.cells[0], m = K.c.getContext('2d'); if (c){ m.save(); m.globalCompositeOperation = 'destination-in'; m.fillStyle = '#000'; m.fillRect(c.x0, 0, c.x1 - c.x0 + 1, h); m.restore(); } else m.clearRect(0, 0, w, h); } return K; };
for (const k in CABM) delete CABM[k]; for (const k in CABB) delete CABB[k];
const _cc15 = cabinCanvas;
const EMPTYCAB = document.createElement('canvas'); EMPTYCAB.width = EMPTYCAB.height = 1;
cabinCanvas = function(V, cos, pax, forPreview){ if (V.baked) return EMPTYCAB; const K = cabinMask(V); if (!K.cells || !K.cells.length) return _cc15(V, cos, pax, forPreview);
 const ppm = K.w / V.len, slotW = .6 * ppm, slots = []; for (const c of K.cells){ const cw = c.x1 - c.x0, n = Math.max(cw > slotW * .7 ? 1 : 0, Math.floor(cw / slotW)); for (let i = 0; i < n; i++) slots.push({x:c.x0 + (i + .5) * cw / n, c}); }
 // reuse the base/over layers from the original builder, then place people only in valid slots
 const base = _cc15(V, cos, [], forPreview), B = CABB[V.id]; const x = B.dyn.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, K.w, K.h); x.drawImage(B.base, 0, 0);
 const order = slots.map((s, i) => i).sort((a, b) => ((a * 5) % slots.length) - ((b * 5) % slots.length)), seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st);
 const drawP = (p, s, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const winH = s.c.bot - s.c.top, H = (p.h || 1.7) * ppm * pedRel(p.t, im), W2 = im.width / im.height * H;
  const show = stand ? Math.min(1.05 * ppm, winH * .95) : Math.min(.55 * ppm, winH * .82), headTop = s.c.bot - show, ox = (p._sx || 0) * ppm, oy = (p._sy || 0) * ppm;
  x.save(); x.translate(s.x + ox, headTop + oy + H); x.rotate(clamp((p._sx || 0) * .9, -.2, .2)); const fl = !forPreview && typeof wantsOff === 'function' && wantsOff(p) && Math.floor(G.time * 4) % 2 === 0; if (fl) goldOutline(x, im, -W2 / 2, -H, W2, H); x.drawImage(im, -W2 / 2, -H, W2, H); x.restore(); };
 seated.slice(0, slots.length).forEach((p, i) => drawP(p, slots[order[i]], false));
 if (V.cls !== 'micro') standing.slice(0, Math.max(1, slots.length >> 1)).forEach((p, i) => drawP(p, slots[(i * 3 + 1) % slots.length], true));
 x.drawImage(B.over, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0); x.globalCompositeOperation = 'source-over'; return B.dyn; };
/* ---------------- premium wet-road spray behind every rolling wheel ---------------- */
function rainSpray(c, k){ const sp = Math.abs(c.vx); if (sp < 2.5) return; const dir = Math.sign(c.vx) || 1, lift = c.lift || 0;
 for (const w of c.wh){ if (!w.ground) continue; const n = sp > 15 ? 4 : sp > 7 ? 3 : 2; for (let i = 0; i < n; i++){ if (Math.random() > .7 * k) continue; const bx = w.x - dir * w.r * .9, by = terrH(w.x) + lift + .05;
   puff(bx, by, -dir * (sp * (.3 + Math.random() * .4)), 1.5 + Math.random() * 2.6 + sp * .06, .5 + Math.random() * .35, .03, '#e6f1ff', 'drop'); }
  if (Math.random() < .55 * k * clamp(sp / 10, .4, 1.5)) puff(w.x - dir * w.r * 1.3, terrH(w.x) + lift + .3, -dir * sp * .22, .5, 1.3 + Math.random() * .7, .18 + sp * .01, '#f2f6fb', 'dust'); } }
const _upd15 = update;
update = function(dt){ _upd15(dt); if (G.mode !== 'play' || G.weather !== 'rain' || G.paused) return; rainSpray(G.car, 1); for (const a of G.ai) if (Math.abs(a.x - G.car.x) < 60) rainSpray(a, .45); };
/* ---------------- one continuous skyline: alternating compatible panoramas, never stacked ---------------- */
const SKY15 = {city:['pCairo','pResid'], mokattam:['pCitadel','pIslamic'], nile:['pCorniche','pNileHigh'], ring:['pBusiness','pNewCairo'], alex:['pCoast','pResid'], desert:['pDesert','pDesertFuel'], redsea:['pCoast','pDesert'], sinai:['pDesert','pDesertFuel'], upper:['pFarm','pDesert']};
function drawLayers(){
 const hz = horizon(), P = skyPal(), night = G.tod === 'night', keys = SKY15[W.route.biome] || SKY15.city, H = VH * .23, base = hz + VH * .12, f = .02;
 const ims = keys.map((k, i) => panoTint(k, 0)).filter(Boolean); if (!ims.length) return; const widths = ims.map(im => im.width / im.height * H), total = widths.reduce((a, b) => a + b, 0);
 let x0 = -((cam.x * PPM * f) % total); if (x0 > 0) x0 -= total; let x = x0, i = 0;
 while (x < VW){ const im = ims[i % ims.length], w = widths[i % ims.length]; ctx.drawImage(im, x, base - H, w + 1, H); x += w; i++; }
 // atmospheric depth: haze at the skyline base fading into the street
 const g = ctx.createLinearGradient(0, base - H * .35, 0, base + VH * .08); g.addColorStop(0, rgb(P.haze, 0)); g.addColorStop(.55, rgb(P.haze, night ? .18 : .38)); g.addColorStop(1, night ? '#12151c' : mix(W.biome.ground, '#8a8070', .55)); ctx.fillStyle = g; ctx.fillRect(0, base - H * .35, VW, VH);
 const sky = ctx.createLinearGradient(0, hz - VH * .05, 0, base); sky.addColorStop(0, rgb(P.haze, 0)); sky.addColorStop(1, rgb(P.haze, night ? .04 : .1)); ctx.fillStyle = sky; ctx.fillRect(0, hz - VH * .05, VW, base - hz + VH * .05);
}
