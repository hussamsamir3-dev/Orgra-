"use strict";
/* =====================================================================
   OGRAAA v22 — physical damage model: sheet metal really deforms
   (crushed edges, folded creases, pushed-in panels), scraped paint
   down to primer and bare metal, spider-web glass, smashed lamps,
   sagging bumpers — all persistent and replayed from the saved dents
   ===================================================================== */
function dRand(u, v, k){ const s = Math.sin(u * 127.1 + v * 311.7 + k * 74.7) * 43758.5453; return s - Math.floor(s); }
function drawDents(x, dents, w, h){
 for (const dt of dents){ const [u, v, r, ty] = dt, cx = u * w, cy = v * h, sev = clamp((r - .025) / .045, 0, 1);
  if (ty === 2){ glassCrack(x, cx, cy, r * w * 1.4, u, v); continue; }
  if (ty === 4){ smashLamp(x, cx, cy, r * w, u, v); continue; }
  const R = r * w * (1.5 + sev * .8), edge = u > .8 || u < .2, dirX = u > .5 ? 1 : -1, depth = R * (.28 + sev * .3);
  const x0 = Math.max(0, Math.floor(cx - R - depth)), y0 = Math.max(0, Math.floor(cy - R - depth)), x1 = Math.min(w, Math.ceil(cx + R + depth)), y1 = Math.min(h, Math.ceil(cy + R + depth)), bw = x1 - x0, bh = y1 - y0; if (bw < 2 || bh < 2) continue;
  const src = x.getImageData(x0, y0, bw, bh), dst = x.createImageData(bw, bh), s = src.data, o = dst.data; o.set(s);
  const ph = dRand(u, v, 1) * 6.28, folds = 3 + Math.floor(dRand(u, v, 2) * 3);
  for (let py = 0; py < bh; py++) for (let px = 0; px < bw; px++){ const X = x0 + px, Y = y0 + py, dx = X - cx, dy = Y - cy, dist = Math.hypot(dx, dy); if (dist >= R) continue;
   const fall = Math.pow(1 - dist / R, 1.6), an = Math.atan2(dy, dx), crease = .75 + .25 * Math.sin(an * folds + ph) + .12 * Math.sin(dist * .6 + ph);
   // sample outward → surface is pushed in (edge impacts crush the outline inward)
   let sx2, sy2; if (edge){ sx2 = px + dirX * depth * fall * crease; sy2 = py + Math.sin(dist * .35 + ph) * depth * .12 * fall; } else { sx2 = px + dx / (dist + 1) * depth * .45 * fall * crease; sy2 = py + dy / (dist + 1) * depth * .45 * fall * crease; }
   const ix = Math.round(sx2), iy = Math.round(sy2), q = (py * bw + px) * 4; if (ix < 0 || iy < 0 || ix >= bw || iy >= bh){ o[q + 3] = edge ? 0 : o[q + 3]; continue; } const p2 = (iy * bw + ix) * 4;
   // folded metal shading: dark valleys, bright ridges along the crease pattern
   // lighting from the dent's surface normal (light from upper-left) + crumple wrinkles on crushed edges
   const gx = -dx / (dist + .001) * 1.6 * Math.pow(1 - dist / R, .6) / R, gy = -dy / (dist + .001) * 1.6 * Math.pow(1 - dist / R, .6) / R; let lit = (gx * -.6 + gy * -.8) * R * .9 * (.6 + sev);
   if (edge){ const wr = Math.sin(dx * (.55 - sev * .15) + Math.sin(dy * .13 + ph) * 3.2 + Math.sin(dy * .41 + ph * 2) * .9 + ph); lit += wr * fall * fall * (.35 + sev * .3); }
   const shade = clamp(1 - Math.max(0, lit) * .45 - fall * .06, .35, 1.2), hi = Math.max(0, -lit) * .18 * fall;
   o[q] = clamp(s[p2] * shade + 255 * hi, 0, 255); o[q + 1] = clamp(s[p2 + 1] * shade + 255 * hi, 0, 255); o[q + 2] = clamp(s[p2 + 2] * shade + 255 * hi, 0, 255); o[q + 3] = s[p2 + 3]; }
  x.putImageData(dst, x0, y0);
  x.save(); x.globalCompositeOperation = 'source-atop';
  // scraped paint: primer grey and bare metal streaks with dark gouges
  // fine scuffs: many short, broken hairline scratches following the impact direction, some down to primer
  const nS = ty === 1 ? 26 : 8 + Math.floor(sev * 14); x.lineCap = 'round';
  for (let i = 0; i < nS; i++){ const r1 = dRand(u, v, 10 + i), r2 = dRand(u, v, 30 + i), r3 = dRand(u, v, 50 + i), sy3 = cy + (r1 - .5) * R * 1.2, sx3 = cx + (r2 - .5) * R * 1.3, len = R * (.12 + r3 * .45), deep = r3 > .78;
   x.strokeStyle = deep ? 'rgba(120,124,128,.55)' : `rgba(235,238,240,${.22 + r1 * .25})`; x.lineWidth = deep ? Math.max(.8, R * .03) : .7; x.beginPath(); x.moveTo(sx3, sy3); x.lineTo(sx3 - dirX * len * .5, sy3 + (r2 - .5) * 1.5); x.moveTo(sx3 - dirX * len * .6, sy3 + (r2 - .5) * 2); x.lineTo(sx3 - dirX * len, sy3 + (r1 - .5) * 3); x.stroke();
   if (deep){ x.strokeStyle = 'rgba(40,36,32,.3)'; x.lineWidth = .6; x.stroke(); } }
  // grime & soot pooled in the dent
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(25,20,15,${.18 + sev * .15})`); g.addColorStop(1, 'rgba(25,20,15,0)'); x.fillStyle = g; x.fillRect(cx - R, cy - R, R * 2, R * 2);
  x.restore();
  // sagging bumper on hard front/rear corner hits
  if (edge && sev > .45 && v > .55){ const bwid = w * .14, bh2 = h * .2, bx = dirX > 0 ? w - bwid : 0, by = Math.min(h - bh2, cy - bh2 * .3); const chunk = document.createElement('canvas'); chunk.width = Math.ceil(bwid); chunk.height = Math.ceil(bh2); chunk.getContext('2d').drawImage(x.canvas, bx, by, bwid, bh2, 0, 0, bwid, bh2);
   x.save(); x.globalCompositeOperation = 'destination-out'; x.fillRect(bx, by, bwid, bh2); x.restore(); x.save(); const pivX = dirX > 0 ? bx : bx + bwid; x.translate(pivX, by); x.rotate(dirX * (.06 + sev * .08)); x.drawImage(chunk, dirX > 0 ? 0 : -bwid, h * .01); x.restore(); }
 } }
function glassCrack(x, cx, cy, R, u, v){ x.save(); x.globalCompositeOperation = 'source-atop'; x.lineCap = 'round';
 const n = 9 + Math.floor(dRand(u, v, 3) * 5); for (let i = 0; i < n; i++){ const a = i / n * 6.28 + dRand(u, v, i) * .5; let px = cx, py = cy; x.strokeStyle = 'rgba(235,245,255,.75)'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); const L = R * (.5 + dRand(u, v, i + 9) * .8); for (let k = 1; k <= 4; k++){ px = cx + Math.cos(a + (dRand(u, v, i * 7 + k) - .5) * .3) * L * k / 4; py = cy + Math.sin(a + (dRand(u, v, i * 5 + k) - .5) * .3) * L * k / 4; x.lineTo(px, py); } x.stroke(); }
 for (let ring = 1; ring <= 3; ring++){ const rr = R * ring * .22; x.strokeStyle = `rgba(235,245,255,${.55 - ring * .12})`; x.beginPath(); for (let i = 0; i <= n; i++){ const a = i / n * 6.28; const jr = rr * (.85 + dRand(u, v, ring * 20 + i) * .3); i ? x.lineTo(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr) : x.moveTo(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr); } x.stroke(); }
 const g = x.createRadialGradient(cx, cy, 0, cx, cy, R * .25); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - R, cy - R, R * 2, R * 2); x.restore(); }
function smashLamp(x, cx, cy, R, u, v){ x.save(); x.globalCompositeOperation = 'source-atop'; const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(12,12,14,.95)'); g.addColorStop(.7, 'rgba(30,30,34,.8)'); g.addColorStop(1, 'rgba(30,30,34,0)'); x.fillStyle = g; x.beginPath(); for (let i = 0; i < 10; i++){ const a = i / 10 * 6.28, rr = R * (.55 + dRand(u, v, i) * .45); i ? x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill();
 x.fillStyle = 'rgba(230,240,255,.8)'; for (let i = 0; i < 6; i++){ const a = dRand(u, v, 40 + i) * 6.28, rr = R * (.5 + dRand(u, v, 50 + i) * .4); x.beginPath(); x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); x.lineTo(cx + Math.cos(a + .25) * rr * 1.1, cy + Math.sin(a + .25) * rr * 1.1); x.lineTo(cx + Math.cos(a + .1) * rr * .6, cy + Math.sin(a + .1) * rr * .6); x.fill(); } x.restore(); }
/* dent records: heavier hits → heavy type; front/rear lamps smash when hit near them */
addDent = function(car, lx, ly, sev, glass){ if (!car.cv) return; const g = car.g, w = car.cv.width, h = car.cv.height, u = clamp((car.mirror ? -lx : lx) / g.len + .5, .03, .97), v = clamp(.5 - ly / g.h, .08, .9);
 const ty = glass ? 2 : sev > 11 ? 3 : Math.random() < .35 ? 1 : 0, dd = [u, v, clamp(.025 + sev * .004, .025, .07), ty]; const list = [dd];
 const M = META[car.spr]; if (!glass && sev > 6 && M){ const near = (p, n) => p && Math.abs(p[0] / M.w - u) < .12 && Math.abs(p[1] / M.h - v) < .25; if (near(M.hl) && !car.brokenHL){ list.push([M.hl[0] / M.w, M.hl[1] / M.h, .03, 4]); car.brokenHL = true; } if (near(M.tl) && !car.brokenTL){ list.push([M.tl[0] / M.w, M.tl[1] / M.h, .025, 4]); car.brokenTL = true; } }
 drawDents(car.cv.getContext('2d'), list, w, h); if (car.dents){ car.dents.push(...list); if (car.dents.length > 45) car.dents.splice(0, car.dents.length - 45); } SILC.delete(car.cv); };
