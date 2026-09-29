"use strict";
/* =====================================================================
   OGRAAA v18 — correct door sounds · outline flash for drop-off
   requests · speech bubbles that ride with the vehicle, no repeats
   ===================================================================== */
/* doors: vans/cars get a mechanical slide + latch; only buses & coaches hiss (air doors) */
AU.door = function(big){ if (!this.ctx) return; if (big){ this.noiseHit(.45, 4000, .12, 0, 'highpass', .5); this.tone(180, .15, 'triangle', .07, .35, -60); return; }
 const vid = G.V && G.V.id; if (vid === 'fiat128' || vid === 'minivan'){ this.tone(140, .08, 'square', .05); this.noiseHit(.06, 900, .12, 0, 'bandpass', 2); this.tone(90, .12, 'sine', .08, .02, -30); return; }
 this.noiseHit(.38, 520, .12, 0, 'lowpass', .8); this.noiseHit(.22, 1400, .05, .05, 'bandpass', 1.4); this.tone(110, .14, 'sine', .09, .34, -40); this.noiseHit(.05, 2200, .08, .34, 'bandpass', 3); };
/* gold outline around a passenger who wants to get off (the person keeps their normal colours) */
const GOLDSIL = new Map();
function goldOutline(x, im, dx, dy, w, h){ let s = GOLDSIL.get(im); if (!s){ s = document.createElement('canvas'); s.width = im.width; s.height = im.height; const c = s.getContext('2d'); c.drawImage(im, 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = '#ffd35a'; c.fillRect(0, 0, s.width, s.height); GOLDSIL.set(im, s); }
 const o = Math.max(1.2, w * .045); for (const [ox, oy] of [[-o, 0], [o, 0], [0, -o], [0, o], [-o * .7, -o * .7], [o * .7, -o * .7], [-o * .7, o * .7], [o * .7, o * .7]]) x.drawImage(s, dx + ox, dy + oy, w, h); }
/* bubbles: attach to the vehicle they come from, don't drift, don't repeat */
const SAID = new Map();
const _say18 = say;
say = function(pair, x, y, col, life){ const txt = Array.isArray(pair) ? nm(pair) : pair, now = performance.now();
 if (SAID.has(txt) && now - SAID.get(txt) < 45000) return; if (BUB.length >= 2) BUB.shift(); SAID.set(txt, now);
 const before = BUB.length; _say18(pair, x, y, col, life || 3.4); const b = BUB[BUB.length - 1]; if (!b || BUB.length === before && b.txt !== txt) return;
 const car = G.car; let host = null; if (car && Math.abs(x - car.x) < car.L * .8) host = car; else for (const a of G.ai || []) if (Math.abs(x - a.x) < a.L * .8){ host = a; break; }
 if (host){ b.host = host; b.rx = x - host.x; b.ry = y - host.y; } };
function drawBubbles(dt){
 ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (let i = BUB.length - 1; i >= 0; i--){ const b = BUB[i]; b.life -= dt; if (b.life <= 0 || (b.host && b.host.gone)){ BUB.splice(i, 1); continue; }
  const lift = b.host && b.host.lift || 0, wx = b.host ? b.host.x + b.rx : b.x, wy = b.host ? b.host.y + b.ry : b.y, X = sx(wx), Y = sy(wy + lift) - i * 6;
  const fs = clamp(PPM * .38, 12, 18); ctx.font = `600 ${fs}px "Readex Pro", sans-serif`; const w = ctx.measureText(b.txt).width + fs * 1.2, h = fs * 1.9;
  const a = Math.min(1, b.life / .45, (b.max - b.life) / .2 + .2); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(12,22,44,.92)'; ctx.strokeStyle = 'rgba(245,178,27,.75)'; ctx.lineWidth = 1.5;
  const x0 = clamp(X - w / 2, 6, VW - w - 6), y0 = Y - h - 10; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y0, w, h, h / 2) : ctx.rect(x0, y0, w, h); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(clamp(X, x0 + 12, x0 + w - 12) - 6, y0 + h - 1); ctx.lineTo(clamp(X, x0 + 12, x0 + w - 12), Y - 2); ctx.lineTo(clamp(X, x0 + 12, x0 + w - 12) + 6, y0 + h - 1); ctx.fill(); ctx.fillStyle = b.col; ctx.fillText(b.txt, x0 + w / 2, y0 + h / 2 + 1); }
 ctx.globalAlpha = 1; }
/* calmer chatter cadence */
{ const _v2t18 = v2tick; v2tick = function(dt, spd, full){ const t0 = G.talkT; _v2t18(dt, spd, full); if (full && G.talkT > t0 && G.talkT < 12) G.talkT = 12 + Math.random() * 10; }; }
