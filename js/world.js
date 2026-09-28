"use strict";
/* ---------------- textured bands along the terrain ---------------- */
function band(img, top, bot, tile, x0, x1, alpha){
 if (!img || !img.width) return; const step = tile / 4; let xa = Math.floor(x0 / step) * step;
 ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
 for (; xa < x1; xa += step){ const xb = xa + step, Xa = sx(xa), Xb = sx(xb), Ya = sy(terrH(xa) + top), Yb = sy(terrH(xb) + top), hgt = (top - bot) * PPM;
  const k = (Yb - Ya) / (Xb - Xa || 1); ctx.setTransform(DPR, DPR * k, 0, DPR, 0, DPR * (Ya - k * Xa));
  const u = (((xa % tile) + tile) % tile) / tile * img.width, uw = step / tile * img.width; ctx.drawImage(img, u, 0, Math.min(uw, img.width - u), img.height, Xa, 0, Xb - Xa + .8, hgt); }
 ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
function viewX(){ return [cam.x - SX0() / PPM - 12, cam.x + (VW - SX0()) / PPM + 12]; }
const PROP_H = {tlight:4.4, plight:2.9, lamp:7.5, lamp2:4.6, lamp3:8.2, shelter:2.8, stopsign:2.7, pole:9.5, cone:.72, cone2:.72, barrier:.55, jersey:.85, fence:1.05, dirsign:3.2, meter:1.4, bin:1.05, hydrant:.95, planter:1.7, bench:.95, bollard:1};
const PROP_W = {barrier:2.6, jersey:2, fence:2.4, bench:1.9, shelter:4.2};
function drawSprite(k, x, baseY, hM, opt){ const im = IMG[k]; if (!im) return; const h = hM * PPM, w = PROP_W[k] && !opt?.keepAR ? PROP_W[k] * PPM : im.width / im.height * h; const X = sx(x) - w / 2, Y = sy(baseY) - h; if (X > VW + 50 || X + w < -50) return null; if (opt && opt.flip){ ctx.save(); ctx.translate(X + w / 2, 0); ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, Y, w, h); ctx.restore(); } else ctx.drawImage(im, X, Y, w, h); return {X, Y, w, h}; }
function lightState(l){ const cyc = 19, p = (G.time + l.off) % cyc; return p < 9 ? 'g' : p < 11.5 ? 'y' : 'r'; }
/* ---------------- people (uploaded walk cycles) ---------------- */
function drawPed(type, x, baseY, dist, face, alpha, hM){
 const fr = META.peds[type]; if (!fr) return; const n = fr.length, f = dist == null ? 0 : Math.floor((dist / 1.45) * n) % n; const im = IMG[fr[(f + n) % n]]; if (!im) return;
 const h = (hM || 1.7) * PPM * im.height / 150, w = im.width / im.height * h, X = sx(x), Y = sy(baseY);
 if (X < -60 || X > VW + 60) return; ctx.save(); if (alpha != null) ctx.globalAlpha = clamp(alpha, 0, 1); ctx.translate(X, Y); if (face < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
}
function drawOfficer(c){
 const f = c.oFrame ?? 0; const im = IMG['off' + f]; if (!im) return; const h = 1.8 * PPM, w = im.width / im.height * h; const X = sx(c.ox), Y = sy(terrH(c.ox) + .95);
 ctx.save(); ctx.translate(X, Y); if (c.oFace < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
}
/* ---------------- world ---------------- */
function drawWorld(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3, night = G.tod === 'night', coachy = W.route.type === 'coach' || B.urban < .1;
 // buildings (base on the sidewalk)
 for (const d of W.deco){ if (d.x + d.w / 2 < x0 - 5 || d.x - d.w / 2 > x1 + 5) continue;
  let hi = -1e9, lo = 1e9; for (let s = -d.w / 2; s <= d.w / 2; s += 1){ const h = terrH(d.x + s); hi = Math.max(hi, h); lo = Math.min(lo, h); }
  const base = hi + 2.2, X = sx(d.x - d.w / 2), wpx = d.w * PPM;
  ctx.fillStyle = night ? '#2a2620' : '#8a7a62'; ctx.fillRect(X + wpx * .03, sy(base), wpx * .94, (hi - lo + .3) * PPM);
  const im = IMG[d.k]; const hp = d.h * PPM; ctx.drawImage(im, X, sy(base) - hp, wpx, hp);
  if (night){ ctx.fillStyle = 'rgba(8,14,34,.55)'; ctx.fillRect(X, sy(base) - hp, wpx, hp); d.lit = true; } }
 // far sidewalk / shoulder
 if (urban || !coachy){ band(IMG.walk2, 2.25, 1.55, 9, x0, x1); band(IMG.curbY, 1.62, 1.42, 18, x0, x1); }
 else { band(IMG.dirt, 2.3, 1.5, 12, x0, x1); band(IMG.guard, 2.35, 1.45, 10, x0, x1); }
 // props on the sidewalk
 for (const p of W.props){ if (p.x < x0 - 6 || p.x > x1 + 6) continue; if (p.front) continue;
  const base = terrH(p.x) + (p.k === 'barrier' ? 1.5 : 1.95);
  if (p.k === 'fuel'){ drawFuel(p.x); continue; }
  const r = drawSprite(p.k, p.x, base, PROP_H[p.k] || 2);
  if (p.tl && r){ const st = lightState(p.tl); const lamps = [['r',.098,'#ff2a2a'],['y',.239,'#ffb300'],['g',.376,'#2bff6a']]; for (const [k, fy, col] of lamps){ const cx = r.X + r.w * .5, cy = r.Y + r.h * fy, rr = r.w * .21; ctx.fillStyle = k === st ? col : 'rgba(10,10,10,.78)'; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fill(); if (k === st){ const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 4); g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr * 4, 0, 7); ctx.fill(); } } }
 }
 for (const r of W.radars) drawRadar(r);
 // pedestrians on the sidewalk & passengers waiting
 for (const p of G.amb) drawPed(p.t, p.x, terrH(p.x) + 1.85, p.d, p.face, 1, p.h);
 for (const st of W.stops){ if (st.x < x0 - 10 || st.x > x1 + 10) continue; st.waiting.forEach((p, i) => { if (i > 9) return; const px = st.x - 3 + (i % 5) * .75 + (i > 4 ? .35 : 0); drawPed(p.t, px, terrH(px) + 1.8 + (i > 4 ? .15 : 0), null, i % 3 === 0 ? -1 : 1, 1, p.h); }); }
 // road
 const asp = W.route.biome === 'mokattam' || W.route.biome === 'upper' ? IMG.asphalt2 : IMG.asphalt;
 band(asp, 1.45, -.28, 22, x0, x1);
 if (G.rainT > 0) band(IMG.asphalt, 1.45, -.28, 22, x0, x1, .0);
 // lane divider (painted line)
 ctx.strokeStyle = 'rgba(245,245,240,.8)'; ctx.lineWidth = Math.max(1.5, PPM * .07); ctx.setLineDash([PPM * 3, PPM * 3.5]); ctx.lineDashOffset = -((cam.x * PPM) % (PPM * 6.5)); ctx.beginPath();
 for (let x = x0; x <= x1; x += 1){ const X = sx(x), Y = sy(terrH(x) + .62); x === x0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); } ctx.stroke(); ctx.setLineDash([]);
 // decals
 for (const d of W.decals){ if (d.x < x0 - 10 || d.x > x1 + 10) continue;
  if (d.k === 'zebra') band(IMG.zebra, 1.45, -.2, 4.2, d.x - d.w / 2, d.x + d.w / 2, .95);
  else if (d.k === 'patch') band(IMG.asphaltC, 1.45, -.28, 22, d.x, d.x + d.w, .9);
  else { const im = IMG[d.k]; const w = d.w * PPM, h = w * .35; ctx.globalAlpha = .9; ctx.drawImage(im, sx(d.x) - w / 2, sy(terrH(d.x) + .35) - h / 2, w, h); ctx.globalAlpha = 1; } }
 if (G.rainT > 0) for (let k = 0; k < 6; k++){ const x = Math.floor((x0 + k * 17) / 17) * 17 + hash(Math.floor((x0 + k * 17) / 17)) * 8; const w = 3.5 * PPM; ctx.globalAlpha = .6; ctx.drawImage(IMG.puddle, sx(x) - w / 2, sy(terrH(x) + .5) - w * .06, w, w * .12); ctx.globalAlpha = 1; }
 for (const b of W.bumps){ if (b < x0 || b > x1) continue; const w = 3.2 * PPM, h = .22 * PPM; ctx.drawImage(IMG.bump, sx(b) - w / 2, sy(terrH(b) + .55) - h / 2, w, h * 1.3); }
 for (const hx of W.holes){ if (hx < x0 || hx > x1) continue; const w = 1.1 * PPM; ctx.drawImage(IMG.hole, sx(hx) - w / 2, sy(terrH(hx) + .25) - w * .22, w, w * .45); }
}
function drawFront(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3;
 for (const p of W.props){ if (!p.front || p.x < x0 - 6 || p.x > x1 + 6) continue; drawSprite(p.k, p.x, terrH(p.x) + 1.25, PROP_H[p.k] || 1); }
 band(urban ? IMG.curbR : IMG.curbY, -.26, -.55, 18, x0, x1);
 if (urban) band(IMG.walk, -.55, -1.25, 9, x0, x1); else band(IMG.dirt, -.55, -1.2, 12, x0, x1);
 // earth below
 ctx.fillStyle = mix(B.ground, '#1a1410', G.tod === 'night' ? .6 : .25); ctx.beginPath(); ctx.moveTo(sx(x0), VH);
 for (let x = x0; x <= x1; x += 2) ctx.lineTo(sx(x), sy(terrH(x) - 1.22)); ctx.lineTo(sx(x1), VH); ctx.fill();
 if (urban) band(IMG.hedge, -1.05, -1.9, 14, x0, x1);
}
function drawFuel(x){ // fuel station: canopy with the uploaded fuel icon as its sign
 const b = terrH(x) + 1.9, X = sx(x), Y = sy(b), w = 9 * PPM, h = 4.6 * PPM;
 ctx.fillStyle = '#e9e4da'; ctx.fillRect(X - w / 2, Y - h, w, PPM * .6); ctx.fillStyle = '#c8102e'; ctx.fillRect(X - w / 2, Y - h + PPM * .6, w, PPM * .18);
 ctx.fillStyle = '#9aa0a8'; ctx.fillRect(X - w * .35, Y - h + PPM * .6, PPM * .25, h - PPM * .6); ctx.fillRect(X + w * .35 - PPM * .25, Y - h + PPM * .6, PPM * .25, h - PPM * .6);
 const s = 2 * PPM; ctx.fillStyle = '#6b7078'; ctx.fillRect(X + w * .55, Y - PPM * 5.5, PPM * .2, PPM * 5.5); ctx.drawImage(IMG.i_fuel, X + w * .55 - s / 2 + PPM * .1, Y - PPM * 5.5 - s, s, s);
}
function drawRadar(r){ const X = sx(r.x), Y = sy(terrH(r.x) + 1.9); if (X < -80 || X > VW + 80) return; ctx.fillStyle = '#7a828c'; ctx.fillRect(X - PPM * .1, Y - PPM * 4.2, PPM * .2, PPM * 4.2); ctx.fillStyle = '#2a2f36'; ctx.fillRect(X - PPM * .55, Y - PPM * 4.8, PPM * 1.1, PPM * .75); ctx.fillStyle = r.flash > 0 ? '#fff' : '#101418'; ctx.beginPath(); ctx.arc(X - PPM * .2, Y - PPM * 4.42, PPM * .2, 0, 7); ctx.fill(); if (r.flash > 0){ ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(0, 0, VW, VH); } }
/* ---------------- lighting & weather ---------------- */
let LCV = null;
function drawNight(){
 if (G.tod !== 'night' && G.tod !== 'sunset') return; const dark = G.tod === 'night' ? .62 : .22;
 if (!LCV) LCV = document.createElement('canvas'); if (LCV.width !== cv.width || LCV.height !== cv.height){ LCV.width = cv.width; LCV.height = cv.height; }
 const l = LCV.getContext('2d'); l.setTransform(DPR, 0, 0, DPR, 0, 0); l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, VW, VH); l.fillStyle = `rgba(4,8,22,${dark})`; l.fillRect(0, 0, VW, VH); l.globalCompositeOperation = 'destination-out';
 const hole = (x, y, r, a) => { const g = l.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.arc(x, y, r, 0, 7); l.fill(); };
 const [x0, x1] = viewX();
 for (const p of W.props) if ((p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') && p.x > x0 && p.x < x1){ const hgt = PROP_H[p.k]; hole(sx(p.x + (p.k === 'lamp' ? 1 : 0)), sy(terrH(p.x) + 1.95 + hgt * .9), PPM * 6, .85); }
 const cars = [G.car, ...G.ai].filter(Boolean);
 for (const c of cars){ if (!c.headOn && !c.player) c.headOn = true; if (!c.headOn) continue; const dir = c.mirror ? -1 : 1, lift = c.lane ? .8 : 0; const hx = sx(c.x + dir * c.L / 2), hy = sy(c.y + lift + (c.yb + c.yt) * .3);
  l.save(); l.translate(hx, hy); l.rotate(-c.a); const g = l.createLinearGradient(0, 0, dir * PPM * 22, 0); g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.moveTo(0, -PPM * .3); l.lineTo(dir * PPM * 22, -PPM * 3); l.lineTo(dir * PPM * 22, PPM * 3.2); l.lineTo(0, PPM * .4); l.fill(); l.restore(); hole(hx, hy, PPM * 1.2, .9); }
 ctx.drawImage(LCV, 0, 0, VW, VH);
 if (G.car && G.car.headOn){ const c = G.car; const hx = sx(c.x + c.L / 2), hy = sy(c.y + (c.yb + c.yt) * .3); const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, PPM * 10); g.addColorStop(0, `rgba(${c.lightCol},.22)`); g.addColorStop(1, `rgba(${c.lightCol},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, PPM * 10, 0, 7); ctx.fill(); }
}
const DROPS = Array.from({length:70}, (_, i) => ({x:hash(i), y:hash(i + 50), r:hash(i + 99)}));
function drawWeather(dt){
 if (G.weather === 'rain'){ ctx.strokeStyle = 'rgba(200,215,240,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < (S.set.gfx === 'low' ? 60 : 160); i++){ const x = (hash(i) * VW * 1.2 + G.time * 90 * (1 + hash(i + 3))) % (VW * 1.2) - VW * .1, y = (hash(i + 7) * VH + G.time * 900 * (1 + hash(i + 5) * .4)) % VH; ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); } ctx.stroke();
  const wet = G.wiper ? .15 : 1; ctx.fillStyle = `rgba(200,220,255,${.22 * wet})`; for (const d of DROPS){ ctx.beginPath(); ctx.arc(d.x * VW, ((d.y * VH + G.time * 12 * d.r) % VH), 3 + d.r * 7, 0, 7); ctx.fill(); }
  if (!G.wiper){ ctx.fillStyle = 'rgba(180,195,215,.18)'; ctx.fillRect(0, 0, VW, VH); } }
 if (G.weather === 'sand'){ const g = ctx.createLinearGradient(0, 0, VW, 0); g.addColorStop(0, 'rgba(214,160,90,.45)'); g.addColorStop(1, 'rgba(190,130,70,.25)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.fillStyle = 'rgba(230,190,130,.5)'; for (let i = 0; i < 90; i++){ const x = (VW - (hash(i) * VW + G.time * 420 * (1 + hash(i + 2))) % VW), y = hash(i + 4) * VH; ctx.fillRect(x, y, 6 + hash(i) * 10, 1.5); } }
}
/* ---------------- particles & floating text ---------------- */
const PARTS = [], FLOATS = [];
function puff(x, y, vx, vy, life, size, col, kind){ if (PARTS.length > (S.set.gfx === 'low' ? 120 : 420)) return; PARTS.push({x, y, vx, vy, life, max:life, size, col, kind}); }
function floatTxt(x, y, txt, col){ FLOATS.push({x, y, txt, col, life:1.7}); }
function updParts(dt){
 for (let i = PARTS.length - 1; i >= 0; i--){ const p = PARTS[i]; p.life -= dt; if (p.life <= 0){ PARTS.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.kind === 'spark' || p.kind === 'glass'){ p.vy -= 9.8 * dt; } else { p.vx *= (1 - dt); p.vy *= (1 - dt * .5); p.size += dt * .8; } }
 for (let i = FLOATS.length - 1; i >= 0; i--){ const f = FLOATS[i]; f.life -= dt; f.y += dt * 1.2; if (f.life <= 0) FLOATS.splice(i, 1); }
}
function drawParts(){
 for (const p of PARTS){ const a = p.life / p.max; ctx.globalAlpha = p.kind === 'spark' ? a : a * .6; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), Math.max(1, p.size * PPM), 0, 7); ctx.fill(); }
 ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (const f of FLOATS){ ctx.globalAlpha = clamp(f.life, 0, 1); ctx.font = `${Math.max(16, PPM * .55)}px Lalezar, sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(f.txt, sx(f.x), sy(f.y)); ctx.fillStyle = f.col; ctx.fillText(f.txt, sx(f.x), sy(f.y)); }
 ctx.globalAlpha = 1;
}
/* ---------------- dashboard gauges (uploaded cluster with live needles) ---------------- */
function needle(x, cx, cy, len, ang, col, w){ x.save(); x.translate(cx, cy); x.rotate(ang * Math.PI / 180); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.shadowColor = col; x.shadowBlur = w * 2; x.beginPath(); x.moveTo(0, len * .12); x.lineTo(0, -len); x.stroke(); x.restore(); }
function drawCluster(){
 const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight; if (!W2) return; const d = Math.min(2, window.devicePixelRatio || 1); if (c.width !== Math.round(W2 * d)){ c.width = Math.round(W2 * d); c.height = Math.round(H2 * d); }
 const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W2, H2); x.drawImage(IMG.cluster, 0, 0, W2, H2);
 const car = G.car; if (!car) return; const kmh = speedOf(car) * 3.6 * (car.rev ? 1 : 1), rpm = G.engOn ? car.rpm * 6 : 0;
 needle(x, W2 * .234, H2 * .645, W2 * .125, -113 + clamp(kmh / 160, 0, 1) * 228, '#ff5a1f', W2 * .007);
 needle(x, W2 * .782, H2 * .645, W2 * .125, -113 + clamp(rpm / 6, 0, 1) * 230, '#ff5a1f', W2 * .007);
 // centre LCD
 x.fillStyle = '#9fe8ff'; x.textAlign = 'center'; x.font = `600 ${H2 * .09}px "Readex Pro", sans-serif`;
 x.fillText(car.rev ? 'R' : G.engOn ? 'D' + car.gear : 'P', W2 * .48, H2 * .44); x.font = `600 ${H2 * .07}px "Readex Pro", sans-serif`;
 x.fillText(Math.round(kmh) + ' km/h', W2 * .48, H2 * .55); x.fillStyle = G.cruise ? '#7CFC9A' : '#5c7a86'; x.fillText(G.cruise ? 'CC ' + Math.round(G.cruise * 3.6) : 'CC --', W2 * .48, H2 * .65);
 x.fillStyle = '#9fe8ff'; x.fillText((G.odo || 0).toFixed(1) + ' km', W2 * .48, H2 * .75);
 // indicator arrows & warning lamps overlay (dim the unused ones)
 const blink = Math.floor(G.time * 2.2) % 2 === 0; x.fillStyle = 'rgba(8,10,14,.82)';
 if (!(blink && (car.ind === -1 || car.haz))) x.fillRect(W2 * .355, H2 * .07, W2 * .06, H2 * .12);
 if (!(blink && (car.ind === 1 || car.haz))) x.fillRect(W2 * .585, H2 * .07, W2 * .06, H2 * .12);
 if (!G.doorOpen) x.fillRect(W2 * .47, H2 * .06, W2 * .055, H2 * .13);
 if (G.belt) x.fillRect(W2 * .405, H2 * .82, W2 * .04, H2 * .11);
 if (!(G.hbrake || (!G.engOn))) x.fillRect(W2 * .452, H2 * .82, W2 * .045, H2 * .11);
 if (!(G.cond && G.cond.engine < 45) && G.engOn) x.fillRect(W2 * .5, H2 * .82, W2 * .05, H2 * .11);
 if (!car.headOn) x.fillRect(W2 * .555, H2 * .82, W2 * .045, H2 * .11);
 // fuel & temperature
 const f = $('#fuelG'), tg = $('#tempG');
 for (const [el, img, val] of [[f, IMG.fuelG, G.fuel / G.fuelMax], [tg, IMG.tempG, clamp((G.temp - 50) / 70, 0, 1)]]){ const w = el.clientWidth, h = el.clientHeight; if (!w) continue; if (el.width !== Math.round(w * d)){ el.width = Math.round(w * d); el.height = Math.round(h * d); } const y = el.getContext('2d'); y.setTransform(d, 0, 0, d, 0, 0); y.clearRect(0, 0, w, h); y.drawImage(img, 0, 0, w, h); needle(y, w * .505, h * .665, w * .3, -56 + clamp(val, 0, 1) * 112, '#ff5a1f', w * .025); }
}
