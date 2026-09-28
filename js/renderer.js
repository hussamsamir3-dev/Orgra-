"use strict";
function hash(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
/* ---------------- Images ---------------- */
const IMG = {};
function loadImages(cb){ const keys = Object.keys(ASSETS); let n = 0; keys.forEach(k => { const im = new Image(); im.onload = im.onerror = () => { n++; const b = $('#ldBar'); if (b) b.style.width = (n / keys.length * 100) + '%'; if (n === keys.length) cb(); }; im.src = ASSETS[k]; IMG[k] = im; }); }
const icon = k => `<img class="ic" src="${ASSETS['i_' + k]}" alt="">`;
/* ---------------- Canvas & camera ---------------- */
const cv = $('#game'), ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1, PPM = 40;
const cam = {x:0, y:0, y0:0, shake:0, zoom:1};
function resize(){
 VW = window.innerWidth; VH = window.innerHeight; DPR = Math.min(window.devicePixelRatio || 1, S.set.gfx === 'low' ? 1 : 2);
 cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
 const s = Math.min(VW / 1280, VH / 720); document.documentElement.style.fontSize = (16 * clamp(Math.pow(s, .55), .6, 1.9)) + 'px';
 document.body.classList.toggle('portrait', VH > VW * 1.05); calcPPM();
}
function calcPPM(){ const L = G.car ? G.car.L : 5.4; const vw = L * 3.1 + 17, vh = 13 + L * .45; PPM = Math.min(VW / vw, VH / vh) * cam.zoom; if (VH > VW) PPM = VW / (L * 1.9 + 7) * cam.zoom; }
window.addEventListener('resize', resize);
const SX0 = () => VW * (G.mode === 'attract' ? .5 : .33), SY0 = () => VH * (VH > VW ? .56 : VH < 560 ? .55 : .66);
const sx = x => (x - cam.x) * PPM + SX0(), sy = y => SY0() - (y - cam.y) * PPM;
/* ---------------- vehicle canvases: cosmetics + persistent damage ---------------- */
const MASKS = {};
function paintMask(spr){
 if (MASKS[spr]) return MASKS[spr];
 const im = IMG[spr], w = im.width, h = im.height, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
 const d = x.getImageData(0, 0, w, h).data; const hist = {};
 for (let i = 0; i < d.length; i += 16){ if (d[i + 3] < 220) continue; const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11; if (L < 70) continue; const k = (d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5); hist[k] = (hist[k] || 0) + 1; }
 let best = null, bn = 0; for (const k in hist) if (hist[k] > bn){ bn = hist[k]; best = k; }
 const q = best.split(',').map(v => +v * 32 + 16); let sr = 0, sg = 0, sb = 0, sn = 0;
 for (let i = 0; i < d.length; i += 8){ if (d[i + 3] < 220) continue; if (Math.abs(d[i] - q[0]) < 36 && Math.abs(d[i + 1] - q[1]) < 36 && Math.abs(d[i + 2] - q[2]) < 36){ sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; sn++; } }
 const dom = [sr / sn, sg / sn, sb / sn], dL = dom[0] * .3 + dom[1] * .59 + dom[2] * .11, dS = dom[0] + dom[1] + dom[2] + 1;
 const m = new Float32Array(w * h), win = new Uint8Array(w * h);
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ if (d[i + 3] < 30) continue; const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, s = d[i] + d[i + 1] + d[i + 2] + 1;
  const cd = Math.abs(d[i] / s - dom[0] / dS) + Math.abs(d[i + 1] / s - dom[1] / dS) + Math.abs(d[i + 2] / s - dom[2] / dS);
  const lr = L / dL; let wgt = clamp(1 - cd * 9, 0, 1) * clamp((lr - .45) * 3, 0, 1); m[p] = wgt;
  if (L < dL * .42 && (p / w | 0) < h * .62) win[p] = 1; }
 return MASKS[spr] = {w, h, m, win, dom, dL, src:d};
}
function drawDents(x, dents, w, h){
 x.save(); x.globalCompositeOperation = 'source-atop';
 for (const dt of dents){ const [u, v, r, ty] = dt; const R = r * w;
  if (ty === 2){ x.strokeStyle = 'rgba(235,245,255,.85)'; x.lineWidth = Math.max(1, w / 400); const rg = mulberry((u * 999 + v * 77) | 0); for (let k = 0; k < 7; k++){ x.beginPath(); x.moveTo(u * w, v * h); let px = u * w, py = v * h; const a = rg() * 6.28; for (let s = 0; s < 4; s++){ px += Math.cos(a + (rg() - .5)) * R * .35; py += Math.sin(a + (rg() - .5)) * R * .35; x.lineTo(px, py); } x.stroke(); } continue; }
  const g = x.createRadialGradient(u * w + R * .15, v * h + R * .15, R * .1, u * w, v * h, R); g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(.6, 'rgba(0,0,0,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(u * w, v * h, R, R * .75, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = Math.max(1, R * .08); x.beginPath(); x.ellipse(u * w - R * .2, v * h - R * .2, R * .6, R * .45, 0, 3.4, 5.2); x.stroke();
  if (ty === 1){ x.strokeStyle = 'rgba(60,50,45,.6)'; x.lineWidth = Math.max(1, w / 500); for (let k = 0; k < 5; k++){ x.beginPath(); x.moveTo(u * w - R * 1.4, v * h + (k - 2) * R * .15); x.lineTo(u * w + R * 1.4, v * h + (k - 2) * R * .12 + R * .1); x.stroke(); } } }
 x.restore();
}
/* build the player's canvas with paint, stripes, tint, sticker, dirt and dents */
function buildPlayerCanvas(vid, cos, cond, dents){
 const V = VBY(vid), M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
 const id = x.createImageData(w, h), o = id.data, d = M.src; o.set(d);
 const P = COS.paint.find(p => p.id === cos.paint), T = COS.tint.find(p => p.id === cos.tint);
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ const mw = M.m[p];
  if (P && P.c && mw > 0){ const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, f = Math.pow(L / M.dL, 1.05); const pl = (P.c[0] * .3 + P.c[1] * .59 + P.c[2] * .11) / 255; const lift = pl < .3 ? 1.25 : 1;
   for (let k = 0; k < 3; k++) o[i + k] = lerp(d[i + k], clamp(P.c[k] * f * lift + (L > M.dL * 1.02 ? (L - M.dL) * .8 : 0), 0, 255), mw); }
  if (T && T.a && M.win[p]){ for (let k = 0; k < 3; k++) o[i + k] = o[i + k] * (1 - T.a) + 12 * T.a; } }
 x.putImageData(id, 0, 0);
 // mask canvas to clip decorations to the painted body
 const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++){ md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; } mx.putImageData(md, 0, 0);
 const deco = document.createElement('canvas'); deco.width = w; deco.height = h; const dx = deco.getContext('2d');
 const ST = COS.stripe.find(p => p.id === cos.stripe);
 if (ST && ST.s) for (const [yf, hf, col] of ST.s){ dx.fillStyle = col; dx.fillRect(0, yf * h, w, hf * h); }
 if (ST && ST.check){ const sz = h * .045; for (let i = 0; i < w / sz; i++) for (let j = 0; j < 2; j++){ dx.fillStyle = (i + j) % 2 ? '#111' : '#f5c518'; dx.fillRect(i * sz, h * .58 + j * sz, sz, sz); } }
 const SK = COS.sticker.find(p => p.id === cos.sticker);
 if (SK && SK.s){ dx.font = `bold ${h * .075}px Lalezar, "Readex Pro", sans-serif`; dx.textAlign = 'center'; dx.fillStyle = cos.paint === 'black' ? '#f5b21b' : '#1a1a1a'; dx.strokeStyle = 'rgba(255,255,255,.7)'; dx.lineWidth = h * .01; dx.strokeText(SK.s, w * .3, h * .5); dx.fillText(SK.s, w * .3, h * .5); }
 dx.globalCompositeOperation = 'destination-in'; dx.drawImage(mk, 0, 0); x.drawImage(deco, 0, 0);
 // dirt
 const dirt = 1 - (cond.clean ?? 100) / 100; if (dirt > .05){ x.save(); x.globalCompositeOperation = 'source-atop'; const g = x.createLinearGradient(0, h * .35, 0, h); g.addColorStop(0, 'rgba(120,95,60,0)'); g.addColorStop(1, `rgba(110,85,55,${dirt * .75})`); x.fillStyle = g; x.fillRect(0, 0, w, h); const r = mulberry(7); x.fillStyle = `rgba(95,75,50,${dirt * .5})`; for (let k = 0; k < 160 * dirt; k++){ x.beginPath(); x.arc(r() * w, h * (.55 + r() * .45), r() * h * .02 + 1, 0, 7); x.fill(); } x.restore(); }
 drawDents(x, dents || [], w, h);
 return c;
}
function spriteCanvas(spr){ const im = IMG[spr], c = document.createElement('canvas'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0); return c; }
const AIWHEELS = {};
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr]; return AIWHEELS[spr] = META[spr].wheels.map(([cx, cy, r]) => { const R = Math.ceil(r * .97), c = document.createElement('canvas'); c.width = c.height = R * 2; const x = c.getContext('2d'); x.beginPath(); x.arc(R, R, R, 0, 7); x.clip(); x.drawImage(im, -(cx - R), -(cy - R)); return c; }); }
/* add a dent in local metres to a car's damage canvas */
function addDent(car, lx, ly, sev, glass){
 if (!car.cv) return; const g = car.g, w = car.cv.width, h = car.cv.height;
 const u = clamp((car.mirror ? -lx : lx) / g.len + .5, .03, .97), v = clamp(.5 - ly / g.h, .08, .9);
 const dd = [u, v, clamp(.025 + sev * .012, .025, .07), glass ? 2 : Math.random() < .5 ? 1 : 0];
 drawDents(car.cv.getContext('2d'), [dd], w, h); if (car.dents) { car.dents.push(dd); if (car.dents.length > 45) car.dents.shift(); }
}
/* ---------------- draw vehicles ---------------- */
function drawVehicle(car, opt){
 opt = opt || {}; const g = car.g, lift = opt.lift || 0, sc = opt.scale || 1;
 const X = x => sx(x), Y = y => sy(y + lift);
 const k = PPM * g.s * sc;
 if (opt.shadow !== false){ ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(X(car.x), Y(terrH(car.x)) + 2, car.L * .5 * PPM * sc, PPM * .18 * sc, -Math.atan(terrS(car.x)), 0, 7); ctx.fill(); }
 if (car.glow){ const gx = X(car.x), gy = Y(terrH(car.x)); const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, car.L * .55 * PPM); gr.addColorStop(0, car.glow + 'cc'); gr.addColorStop(1, car.glow + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(gx, gy, car.L * .6 * PPM, PPM * .5, 0, 0, 7); ctx.fill(); }
 const drawWheels = () => { const crops = car.player ? null : aiWheelCrops(car.spr);
  car.wh.forEach((w, i) => { const r = w.r * PPM * sc, wx = X(car.x) + (w.x - car.x) * PPM * sc, wy = Y(car.y) - (w.y - car.y) * PPM * sc; ctx.save(); ctx.translate(wx, wy); if (w.flat) ctx.scale(1, .86); ctx.rotate(w.rot);
   if (crops){ const c = crops[i]; if (car.mirror) ctx.scale(-1, 1); ctx.drawImage(c, -r * 1.0, -r * 1.0, r * 2, r * 2); }
   else { const im = IMG['wh' + car.rim]; ctx.drawImage(im, -r * 1.04, -r * 1.04, r * 2.08, r * 2.08); }
   ctx.restore(); }); };
 if (car.player) drawWheels();
 ctx.save(); ctx.translate(X(car.x), Y(car.y)); ctx.rotate(-car.a); ctx.scale(car.mirror ? -k : k, k);
 const src = car.cv || IMG[car.spr]; ctx.drawImage(src, -src.width / 2, -src.height / 2);
 if (opt.dim){ ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = opt.dim; ctx.fillRect(-src.width / 2, -src.height / 2, src.width, src.height); ctx.globalCompositeOperation = 'source-over'; }
 ctx.restore();
 if (!car.player) drawWheels();
 // roof rack & luggage
 if (car.rack){ const ca = Math.cos(car.a), sa = Math.sin(car.a); const L = car.L * .62; ctx.save(); ctx.translate(X(car.x), Y(car.y)); ctx.rotate(-car.a); const top = -g.yt * PPM; ctx.fillStyle = '#2b2b2b'; ctx.fillRect(-L / 2 * PPM, top - PPM * .12, L * PPM, PPM * .06); for (let i = 0; i < 6; i++) ctx.fillRect((-L / 2 + i * L / 5) * PPM - 1, top - PPM * .12, PPM * .04, PPM * .12);
  const n = Math.min(4, Math.ceil((car.cargoKg || 0) / 40)); const cols = ['#8b5a2b','#3f6e8c','#b98d4e','#6b3f2a']; for (let i = 0; i < n; i++){ ctx.fillStyle = cols[i]; ctx.fillRect((-L / 2 + .15 + i * L / 4.3) * PPM, top - PPM * (.12 + .35 + (i % 2) * .08), L / 4.8 * PPM, PPM * (.35 + (i % 2) * .08)); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeRect((-L / 2 + .15 + i * L / 4.3) * PPM, top - PPM * (.12 + .35 + (i % 2) * .08), L / 4.8 * PPM, PPM * (.35 + (i % 2) * .08)); }
  ctx.restore(); }
 // lights: brake/indicators/hazard/beacon
 const ca = Math.cos(car.a), sa = Math.sin(car.a), P2 = (lx, ly) => [X(car.x + lx * ca - ly * sa), Y(car.y + lx * sa + ly * ca)], dir = car.mirror ? -1 : 1;
 const lamp = (lx, ly, col, r) => { const [px, py] = P2(lx * dir, ly); const gr = ctx.createRadialGradient(px, py, 0, px, py, r * PPM); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, r * PPM, 0, 7); ctx.fill(); };
 const ly = (g.yb + g.yt) * .45 - g.h * .12;
 if (car.braking) lamp(-car.L / 2 + .05, ly, 'rgba(255,30,30,.95)', .55);
 const blink = Math.floor(G.time * 2.2) % 2 === 0;
 if (blink && (car.ind === 1 || car.haz)) { lamp(car.L / 2 - .1, ly, 'rgba(255,170,0,.95)', .45); lamp(-car.L / 2 + .1, ly + .15, 'rgba(255,170,0,.95)', .45); }
 if (blink && (car.ind === -1 || car.haz)) { lamp(-car.L / 2 + .12, ly - .1, 'rgba(255,170,0,.9)', .4); }
 if (car.siren){ const on = Math.floor(G.time * 6) % 2; lamp(car.L * .12 * (on ? 1 : -1), g.yt + .05, on ? 'rgba(40,120,255,1)' : 'rgba(255,40,40,1)', .9); }
 if (car.headOn) lamp(car.L / 2 - .05, ly + .1, `rgba(${car.lightCol || '255,230,170'},.95)`, .5);
}
/* ---------------- sky & parallax (procedural background) ---------------- */
