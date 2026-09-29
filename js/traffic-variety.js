"use strict";
/* =====================================================================
   OGRAAA v20 — minivan window fit · varied AI colours & mods ·
   Alexandria corniche skyline
   ===================================================================== */
/* measured rear-window openings (sprite fractions) — passengers sit above the sill bar */
BAKEDWIN.minivan = [[.296, .095, .455, .3], [.112, .13, .268, .305]];
BAKEDWIN.fiat128 = [[.305, .135, .46, .325]];
for (const k in BCAB) delete BCAB[k];
/* AI traffic: realistic paint variety, tinted windows, sport stripes */
const AIPAINTABLE = new Set(['ai1','ai2','ai3','ai7','ai12','ai13','ai14','ai15','ai16','ai17','ai18']);
const AICOLS = [[238,240,242],[176,182,190],[34,36,40],[118,24,40],[26,48,98],[214,200,170],[168,28,30],[96,102,110],[22,92,86],[120,96,70],[40,80,140]];
const AIVAR = new Map();
function aiVariant(spr, ci, tint, stripe){ const key = spr + '|' + ci + '|' + tint + '|' + stripe; let c = AIVAR.get(key); if (c) return c; const M = paintMask(spr), w = M.w, h = M.h; c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), id = x.createImageData(w, h), o = id.data, d = M.src; o.set(d); const P = AICOLS[ci];
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ const mw = M.m[p]; if (mw > 0){ const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, f = Math.pow(L / M.dL, 1.05), lift = (P[0] * .3 + P[1] * .59 + P[2] * .11) < 80 ? 1.25 : 1; for (let k = 0; k < 3; k++) o[i + k] = lerp(d[i + k], clamp(P[k] * f * lift + (L > M.dL * 1.02 ? (L - M.dL) * .8 : 0), 0, 255), mw); }
  if (tint && M.win[p]) for (let k = 0; k < 3; k++) o[i + k] = o[i + k] * .45 + 6; }
 x.putImageData(id, 0, 0);
 if (stripe){ const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++) md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; mx.putImageData(md, 0, 0); const s = document.createElement('canvas'); s.width = w; s.height = h; const sx2 = s.getContext('2d'); sx2.fillStyle = ci === 0 || ci === 5 ? '#1a1a1a' : '#f2f2f2'; sx2.fillRect(0, h * .62, w, h * .035); sx2.fillRect(0, h * .675, w, h * .015); sx2.globalCompositeOperation = 'destination-in'; sx2.drawImage(mk, 0, 0); x.drawImage(s, 0, 0); }
 if (AIVAR.size > 80) AIVAR.clear(); AIVAR.set(key, c); return c; }
const _spawn20 = spawnAI;
spawnAI = function(spec, lane, x, dir, opt){ const c = _spawn20(spec, lane, x, dir, opt); if (!c) return c; const spr = AIV[spec].spr;
 if (AIPAINTABLE.has(spr) && !c.siren && Math.random() < .65){ const ci = (Math.random() * AICOLS.length) | 0, tint = Math.random() < .35, stripe = Math.random() < .12; try{ c.cv = aiVariant(spr, ci, tint, stripe); const cv2 = document.createElement('canvas'); cv2.width = c.cv.width; cv2.height = c.cv.height; cv2.getContext('2d').drawImage(c.cv, 0, 0); c.cv = cv2; }catch(e){} }
 if (Math.random() < .15 && !c.siren) c.glow = null; return c; };
/* Alexandria roads: the corniche panorama (Qaitbay citadel, Stanley bridge, library, mosques) */
SKY15.alex = ['pAlex1', 'pAlex2', 'pAlex3', 'pAlex4'];
</script>
<script>
"use strict";
/* AI wheels: rotate only the rim (the tyre is uniform rubber and fenders often overlap it), so every
   wheel spins as a perfect circle about its measured hub */
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr], bike = spr === 'ai5' || spr === 'ai6' || spr === 'ai4', heavy = ['ai8','ai9','ai19','ai20','ai21','ai28','ai29','ai30','ai10','ai26','ai27'].includes(spr);
 return AIWHEELS[spr] = META[spr].wheels.map(([cx, cy, r]) => { const R = r * (bike ? .56 : heavy ? .56 : .64), S = Math.ceil(R) * 2 + 2, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.beginPath(); x.arc(S / 2, S / 2, R, 0, 7); x.clip(); x.drawImage(im, -(cx - S / 2), -(cy - S / 2)); return c; }); }
for (const k in AIWHEELS) delete AIWHEELS[k];
