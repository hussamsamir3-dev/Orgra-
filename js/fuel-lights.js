"use strict";
/* the service taxi & minivan run microbus lines (Rides and Career) */
["fiat128","minivan"].forEach(v => { if (!CLS_OK.micro.includes(v)) CLS_OK.micro.push(v); });
/* =====================================================================
   OGRAAA v14 — meaningful fuel use, walk-to-the-station rescue,
   drop-off requests that really stop, flashing requesters,
   traffic-light countdowns
   ===================================================================== */
/* ---------------- fuel: a full tank lasts roughly six trips ---------------- */
function fuelFactor(){ const V = G.V, r = G.route; if (!V || !r) return 1; const perTrip = V.lp100 / 100 * r.km; return clamp((V.tank / 6) / Math.max(.1, perTrip), 1, 14); }
/* ---------------- passengers who want out flash inside the cabin ---------------- */
function wantsOff(p){ if (G.mode !== 'play') return false; if (G.side && G.side.p === p) return true; const st = W.stops[G.nextIdx]; return !!(st && p.dest <= st.i && st.x - doorX() < 90 && st.x - doorX() > -5); }
/* ---------------- out of fuel: walk to the nearest station ---------------- */
function nearestGas(){ const car = G.car; let best = null; for (const p of W.poi || []) if (p.type === 'fuel'){ const d = Math.abs(p.x - car.x); if (!best || d < best.d) best = {p, d}; } return best; }
function fuelOutPrompt(){ G.fuelAsk = true; const car = G.car, bag = inv(G.vid), ng = nearestGas(), dist = ng ? Math.round(ng.d * kmPerM() * 1000) : 900, liters = G.fuelMax / 5, cost = G.test ? 0 : Math.ceil(liters * DIESEL);
 const acts = []; if (bag.jerry) acts.push([L2('⛽ استخدم الجركن', '⛽ Use jerrycan'), () => { useItem('jerry'); G.fuelAsk = false; }]);
 acts.push([L2('🚶 روح البنزينة', '🚶 Walk to the station') + ` (${money(cost)})`, () => startFuelWalk(liters, cost, dist)]);
 acts.push([L2('🚛 ونش (إنهاء)', '🚛 Tow truck (end trip)'), () => { G.fuelAsk = false; endRun('fuel'); }]);
 toastUI('⛽ ' + L2('البنزين خلص! أقرب بنزينة على بعد ', 'Out of fuel! Nearest station is ') + fmt(dist) + ' m', 'bad', acts, 30); }
function startFuelWalk(liters, cost, dist){ if (cost && !spend(cost, L2('سولار في جركن', 'Jerrycan diesel'), 'fuel')){ G.fuelAsk = false; return; }
 const car = G.car, V = G.V; G.walkFuel = {t:20, T:20, liters, drv:(G.vid.length * 7) % META.peds.length}; G.engOn = false; car.headOn = car.headOn; car.haz = true; setDoor(false);
 const dx = doorX() + V.len * .08; G.walkers.push(G.walkFuel.w = {t:G.walkFuel.drv, h:1.74, x:car.x + car.L * .3, y:.1, ty:1.85, tx:car.x + 60, spd:1.6, d:0, stay:true, driver:true});
 if (G.onboard.length) setTimeout(() => say(pick([['يا ساتر، البنزين خلص!','Oh no, out of fuel!'],['هنستنى كتير يا أسطى؟','Will we wait long, driver?']]), car.x, car.y + car.yt + .9), 1200);
 $('#walkM').classList.add('on'); AU.mallet(523, 0, .03); }
function tickFuelWalk(dt){ const W8 = G.walkFuel; if (!W8) return; W8.t -= dt; const k = 1 - W8.t / W8.T, car = G.car;
 if (W8.w){ if (k < .5){ W8.w.tx = car.x + 60; W8.w.face = 1; } else { W8.w.tx = car.x + car.L * .3; W8.w.jerry = true; } }
 if (G.onboard.length) G.comfort = Math.max(0, G.comfort - dt * .6);
 const c = $('#walkCv'); if (c) drawWalkPanel(c, k, W8);
 $('#walkT').textContent = fmt(Math.max(0, Math.ceil(W8.t)));
 if (W8.t <= 0){ G.fuel = Math.min(G.fuelMax, G.fuel + W8.liters); G.walkFuel = null; G.fuelAsk = false; G.fuelOutT = 0; car.haz = false; const i = G.walkers.indexOf(W8.w); if (i >= 0) G.walkers.splice(i, 1); $('#walkM').classList.remove('on'); toastUI('⛽ ' + L2('السواق رجع — اتضاف ', 'Driver is back — added ') + fmt(Math.round(W8.liters)) + ' L', 'good'); AU.noiseHit(1.2, 700, .12, 0, 'lowpass'); } }
function drawWalkPanel(c, k, W8){ const w = c.clientWidth, h = c.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); if (c.width !== Math.round(w * d)){ c.width = Math.round(w * d); c.height = Math.round(h * d); } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); const t = performance.now() / 1000;
 const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, G.tod === 'night' ? '#0b1633' : '#7fb6e6'); g.addColorStop(.7, G.tod === 'night' ? '#22335e' : '#e8dcc2'); g.addColorStop(1, '#4a4d52'); x.fillStyle = g; x.fillRect(0, 0, w, h);
 const pano = IMG.pDesertFuel || IMG.pCairo; if (pano && pano.width){ const ph = h * .45, pw = pano.width / pano.height * ph; x.globalAlpha = .5; x.drawImage(pano, -((t * 8) % pw), h * .72 - ph, pw, ph); x.drawImage(pano, pw - ((t * 8) % pw), h * .72 - ph, pw, ph); x.globalAlpha = 1; }
 x.fillStyle = '#3a3d42'; x.fillRect(0, h * .72, w, h * .28); x.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < w; i += 40) x.fillRect(i, h * .86, 20, 2);
 const V = G.V, im = IMG[V.spr], M = META[V.spr], vk = h * .42 / M.h, vw = M.w * vk; x.drawImage(im, w * .06, h * .78 - M.h * vk, vw, M.h * vk);
 const fu = IMG.sFuel; if (fu && fu.width){ const fh = h * .6, fw = fu.width / fu.height * fh; x.drawImage(fu, w - fw - w * .03, h * .78 - fh, fw, fh); }
 const walkX = w * .06 + vw * .6, endX = w * .8, px = k < .5 ? lerp(walkX, endX, k * 2) : lerp(endX, walkX, (k - .5) * 2), fr = META.peds[W8.drv], n = fr.length, pim = IMG[fr[Math.floor(t * 8) % n]], ph2 = h * .42 * pedRel(W8.drv, pim), pw2 = pim.width / pim.height * ph2;
 x.save(); x.translate(px, h * .8); if (k >= .5) x.scale(-1, 1); x.drawImage(pim, -pw2 / 2, -ph2, pw2, ph2); if (k >= .5){ x.fillStyle = '#c8102e'; x.fillRect(pw2 * .05, -ph2 * .42, ph2 * .16, ph2 * .2); x.fillStyle = '#222'; x.fillRect(pw2 * .09, -ph2 * .46, ph2 * .06, ph2 * .05); } x.restore();
 x.strokeStyle = '#ffd35a'; x.lineWidth = 4; x.beginPath(); x.arc(w - 34, 34, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k)); x.stroke(); }
/* ---------------- drop-off requests: the van really stops and opens for them ---------------- */
const _upd14 = update;
update = function(dt){ const car = G.car, full = G.mode === 'play', f0 = G.fuel;
 if (full && G.walkFuel){ G.hbrake = true; }
 _upd14(dt);
 if (!full) return; G.hbrake = false;
 // heavier, more meaningful fuel use (scaled so a full tank lasts ~6 trips)
 const used = f0 - G.fuel; if (used > 0 && !S.devFuel){ const extra = used * (fuelFactor() - 1); G.fuel = Math.max(0, G.fuel - extra); G.T.fuelL += extra; }
 tickFuelWalk(dt);
 const spd = speedOf(car), inStop = W.stops.some(s => Math.abs(doorX() - s.x) < STOP_TOL() + 1);
 if (G.side && spd < .5 && car.grounded){ G._sideT = (G._sideT || 0) + dt; if (G._sideT > .5 && !G.doorOpen) setDoor(true); } else G._sideT = 0;
 if (!G.side && G.doorOpen && !inStop && !G.svc && !G.rest && !(G.fire > 0)){ G._closeT = (G._closeT || 0) + dt; if (G._closeT > 1.4){ setDoor(false); G._closeT = 0; } } else G._closeT = 0;
};
/* ---------------- traffic-light countdown displays ---------------- */
function lightRemain(l){ const p = (G.time + l.off) % 19; return p < 9 ? 9 - p : p < 11.5 ? 11.5 - p : 19 - p; }
function drawLightTimers(){ if (!W.lights) return; const [x0, x1] = viewX(), im = IMG.tlight; if (!im || !im.width) return;
 for (const l of W.lights){ const px = l.x + 1; if (px < x0 - 5 || px > x1 + 5) continue; const hM = PROP_H.tlight, h = hM * PPM, w = im.width / im.height * h, X = sx(px) - w / 2, Y = sy(terrH(px) + 1.95) - h;
  const st = lightState(l), col = st === 'g' ? '#2bff6a' : st === 'y' ? '#ffb300' : '#ff3b3b', n = Math.ceil(lightRemain(l)), bw = Math.max(20, w * 1.05), bh = Math.max(15, h * .1), bx = X + w * 1.02, by = Y + h * .12;
  ctx.save(); ctx.fillStyle = '#6b727b'; ctx.fillRect(X + w * .82, by + bh * .4, bx - (X + w * .82), Math.max(2, bh * .12)); ctx.fillStyle = '#0a0b0d'; ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 3) : ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
  ctx.font = `700 ${bh * .78}px "Courier New", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillText('88', bx + bw / 2, by + bh / 2 + 1); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.fillText(String(n).padStart(2, '0'), bx + bw / 2, by + bh / 2 + 1); ctx.restore(); } }
const _dw14 = drawWorld;
drawWorld = function(){ _dw14(); drawLightTimers(); };
const _uh14 = updateHUD;
updateHUD = function(dt){ _uh14(dt); if (G.walkFuel) $('#startBtn').classList.remove('show'); };
/* walk panel DOM */
document.body.insertAdjacentHTML('beforeend', `<div id="walkM"><div class="wbox"><canvas id="walkCv"></canvas><div class="wtxt"><b>🚶 ${L2('السواق راح يجيب بنزين', 'The driver went to fetch fuel')}</b><span>${L2('راجع خلال', 'Back in')} <em id="walkT">20</em> ${L2('ثانية', 's')}</span></div></div></div>`);
{ const st = document.createElement('style'); st.textContent = `#walkM{position:fixed;left:50%;top:5.2rem;transform:translateX(-50%);z-index:45;display:none;pointer-events:none;animation:tin .35s}#walkM.on{display:block}#walkM .wbox{width:min(92vw,26rem);border-radius:1rem;overflow:hidden;border:1px solid var(--gold);background:#0a1630;box-shadow:0 1rem 2.5rem #000a}#walkCv{display:block;width:100%;height:8.5rem}.wtxt{display:flex;justify-content:space-between;align-items:center;padding:.55rem .9rem;font-size:.9rem}.wtxt em{font-style:normal;font-family:Lalezar;font-size:1.4rem;color:var(--gold2)}`; document.head.appendChild(st); }
const _toMenu14 = toMenu;
toMenu = function(scr){ G.walkFuel = null; G.fuelAsk = false; const m = document.getElementById('walkM'); if (m) m.classList.remove('on'); _toMenu14(scr); };
const _sr14 = startRoute;
startRoute = function(r, o){ _sr14(r, o); G.walkFuel = null; G.fuelAsk = false; const m = document.getElementById('walkM'); if (m) m.classList.remove('on'); };
