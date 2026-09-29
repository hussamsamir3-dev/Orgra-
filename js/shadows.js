"use strict";
/* =====================================================================
   OGRAAA v19 — directional vehicle shadows (sun by day, street lamps
   and headlights by night) + tight contact shadows under the tyres
   ===================================================================== */
/* soft, projected silhouette: direction dx (−1…1 shear), length ly, opacity a */
function projShadow(src, X, baseY, sw, shh, mk, k, dx, ly, a, blur){ if (a <= .01) return; const w = sw * mk, h = shh * k; ctx.save(); ctx.globalAlpha = a; 
 ctx.setTransform(DPR * w / src.width, 0, -DPR * dx * h / src.height, DPR * ly * h / src.height, DPR * (X - w / 2 + dx * h), DPR * (baseY - ly * h)); ctx.drawImage(sil(src), 0, 0); ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
function dirShadow(car, src, X, gy, sw, shh, mk, k){ const lift = car.lift || 0, night = G.tod === 'night';
 if (!night){ const s = SUN(), sunset = G.tod === 'sunset'; projShadow(src, X, gy + 1, sw, shh, mk, k * .95, -s.x * (sunset ? 1.5 : .8), sunset ? .5 : .42, (sunset ? .5 : .55) * (G.weather === 'rain' ? .45 : 1), 1.2); return; }
 // night: every nearby street lamp throws its own shadow away from the lamp; strength falls with distance
 const [x0, x1] = viewX(); let n = 0;
 for (const p of W.props){ if (n > 2) break; if (!(p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') || p.x < x0 - 10 || p.x > x1 + 10) continue; const lx = p.x + (p.k === 'lamp' ? .9 : 0), d = car.x - lx, ad = Math.abs(d); if (ad > 14) continue; n++;
  const dir = clamp(d / 5, -1.8, 1.8), a = .55 * (1 - ad / 14); projShadow(src, X, gy + 1, sw, shh, mk, k * .95, dir, .4 + ad * .02, a, 1.5); }
 // headlights of the vehicle behind cast a long forward shadow
 for (const o of G.ai.concat(G.car ? [G.car] : [])){ if (o === car || !o.headOn || (o.lift || 0) !== lift) continue; const d = car.x - o.x, dirO = o.mirror ? -1 : 1; if (d * dirO <= 0 || Math.abs(d) > 22) continue; projShadow(src, X, gy + 1, sw, shh, mk, k * .95, Math.sign(d) * 1.6, .35, .25 * (1 - Math.abs(d) / 22), 2.5); break; }
}
/* contact shadows: dark, tight patches where each tyre meets the road + a soft band under the body */
function contactShadow(car, lift, sc){ const ws = car.wh; if (!ws || !ws.length) return; const xs = ws.map(w => w.x), x0 = Math.min(...xs), x1 = Math.max(...xs), r = ws[0].r;
 ctx.save(); const y0 = sy(terrH((x0 + x1) / 2) + lift) + 1; const band = ctx.createLinearGradient(0, y0 - PPM * .06, 0, y0 + PPM * .1); band.addColorStop(0, 'rgba(0,0,0,0)'); band.addColorStop(.5, `rgba(0,0,0,${G.tod === 'night' ? .22 : .28})`); band.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = band; ctx.fillRect(sx(x0 - r * .6), y0 - PPM * .06, (x1 - x0 + r * 1.2) * PPM * sc, PPM * .16);
 for (const w of ws){ const X = sx(w.x), Y = sy(terrH(w.x) + lift) + 1, R = w.r * PPM * sc; const g = ctx.createRadialGradient(X, Y, 0, X, Y, R * 1.1); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.45, 'rgba(0,0,0,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.save(); ctx.translate(X, Y); ctx.scale(1, .16); ctx.beginPath(); ctx.arc(0, 0, R * 1.1, 0, 7); ctx.fill(); ctx.restore(); }
 ctx.restore(); }
