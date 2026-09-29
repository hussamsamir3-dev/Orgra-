"use strict";
/* =====================================================================
   OGRAAA v13 — true-scale wheels + original window frames kept
   ===================================================================== */
/* wheel images keep the whole tyre and are centred on the hub; scale so the tyre edge meets the arch */
Object.assign(DRV, {fiat128:.5, minivan:.68});
function WQ(i){ const m = META['wh' + i]; return m && m.tyre ? (m.w / 2) / m.tyre * 1.03 : 1.04; }
function centreWheels(){}  /* images are pre-centred on the hub at build time */
/* window mask: glass only — the artwork's own frames, seals and pillars stay visible */
function cabinMask(V){ if (CABM[V.id]) return CABM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, drv = (DRV[V.id] || .8) * w, lim = Math.round(h * .64), L = new Float32Array(w * h), R = new Uint8Array(w * h);
 for (let p = 0; p < w * h; p++){ const q = p * 4; L[p] = M.src[q] * .3 + M.src[q + 1] * .59 + M.src[q + 2] * .11; }
 const Y0 = new Int16Array(w).fill(-1), Y1 = new Int16Array(w).fill(-1); const isWin = p => { if (M.win[p]) return true; const q = p * 4, r = M.src[q], g = M.src[q + 1], b = M.src[q + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); return M.src[q + 3] > 200 && L[p] < M.dL * .56 && (mx - mn) / (mx + 1) < .22; };
 for (let px = Math.ceil(w * .03); px < w * .97; px++) for (let py = 0; py < lim; py++) if (isWin(py * w + px)){ if (Y0[px] < 0) Y0[px] = py; Y1[px] = py; }
 const ys = Array.from(Y1).filter(v => v > 0).sort((a, b) => a - b), base = ys.length ? ys[ys.length >> 1] : lim;
 const ok = new Uint8Array(w), top1 = new Int16Array(w), bot1 = new Int16Array(w);
 for (let px = Math.ceil(w * .03); px < w * .97; px++){ const y0 = Y0[px]; if (y0 < 0) continue; const y1 = Math.min(Y1[px], base + Math.round(h * .02)); if (y1 - y0 < h * .06) continue; let dk = 0; for (let py = y0; py <= y1; py++) if (L[py * w + px] < 34) dk++; ok[px] = dk / (y1 - y0 + 1) > .8 ? 2 : 1; top1[px] = y0; bot1[px] = y1; }
 // dark columns are pillars only when they form a narrow strip; wide dark runs are tinted glass
 for (let px = 0; px < w; px++){ if (ok[px] !== 2) continue; const r0 = px; while (px < w && ok[px] === 2) px++; const narrow = px - r0 < w * .03; for (let q = r0; q < px; q++) ok[q] = narrow ? 0 : 1; }
 // group columns into window cells; keep only whole cells behind the driver (never cut through the driver's window)
 const cells = []; for (let px = 0; px < w; px++){ if (ok[px]){ const c0 = px; while (px < w && ok[px]) px++; if (px - c0 > w * .025) cells.push([c0, px - 1]); } }
 for (const [c0, c1] of cells){ if (c1 > drv || c1 < w * .09) continue; const ppmS = w / V.len; for (let px = c0; px <= c1; px++) for (let py = Math.max(top1[px], bot1[px] - Math.round(1.05 * ppmS)); py <= bot1[px]; py++) if (M.src[(py * w + px) * 4 + 3] > 150) R[py * w + px] = 1; }
 // erode: keep a frame band (rubber seal + black surround) from the artwork around every window cell
 const e = Math.max(2, Math.round(h * .03)); let A = R, B = new Uint8Array(w * h);
 for (let it = 0; it < e; it++){ B.fill(0); for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const p = y * w + x; if (A[p] && A[p - 1] && A[p + 1] && A[p - w] && A[p + w]) B[p] = 1; } const T = A; A = B; B = T; }
 const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h); let minX = w, maxX = 0, top = h; const bots = [];
 for (let px = 0; px < w; px++){ let lastY = -1; for (let py = 0; py < h; py++) if (A[py * w + px]){ d.data[(py * w + px) * 4 + 3] = 255; minX = Math.min(minX, px); maxX = Math.max(maxX, px); top = Math.min(top, py); lastY = py; } if (lastY > 0) bots.push(lastY); }
 x.putImageData(d, 0, 0); bots.sort((a, b) => a - b);
 return CABM[V.id] = {c, minX, maxX, sill:bots.length ? bots[bots.length >> 1] + e : h * .5, top:top - e, w, h}; }
for (const k in CABM) delete CABM[k]; for (const k in CABB) delete CABB[k];
