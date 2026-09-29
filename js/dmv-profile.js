"use strict";
/* =====================================================================
   OGRAAA v4 — DMV & licences, profile, settings, cockpit rework,
   animated stop markers, realistic horns & traffic audio, fixes
   ===================================================================== */
const L2 = (ar, en) => LANG === 'ar' ? ar : en;
Object.assign(TX, {
 traffic:['المرور (الرخص)','DMV & Traffic'], amb:['إسعاف ورا منك — هدّي وقف لحد ما يعدي','Ambulance behind you — slow down and stop until it passes'],
 fVlic:['رخصة المركبة منتهية','Vehicle licence expired'], fLic:['القيادة بدون رخصة سارية','Driving without a valid licence']
});
FINE.vlic = 500; PTS.vlic = 0; FINE.lic = 1500;
/* ---------------- licences model ---------------- */
const LIC_GRADES = [{k:'micro', lvl:1, price:500, n:['درجة ثالثة — ميكروباص وسرفيس','Grade 3 — microbus & service'], cls:['خاصة / أجرة','Private / taxi']},
 {k:'bus', lvl:4, price:2500, n:['درجة ثانية — أتوبيس','Grade 2 — city bus'], cls:['نقل عام','Public transport']},
 {k:'coach', lvl:6, price:6000, n:['درجة أولى — سفر','Grade 1 — intercity coach'], cls:['سياحي / سفر','Coach / intercity']}];
const LIC_DAYS = 90, VLIC_DAYS = 60;
const hasLic = cls => !!(S.lic.have && S.lic.have[cls]);
const licExpired = () => !S.lic.exp || S.lic.exp < Date.now();
const vlicFee = V => ({micro:200, bus:450, coach:900})[V.cls];
const vlicExpired = id => { const g = GV(id); return !g.vlic || g.vlic.exp < Date.now(); };
function plateFor(id){ const L = 'أبجدهوزحطيكلمنسعفصقرشتثخذضظغ'; const h = n => Math.floor(hash(n + id.length * 7 + id.charCodeAt(0)) * 1e6); const a = h(1), b = h(2);
 return {ar:[L[a % 28], L[(a >> 5) % 28], L[(a >> 10) % 28]].join(' ') + '  ' + fmt(1000 + b % 8999).replace(/[٬,]/g, ''), en:String(1000 + b % 8999) + ' ' + ['QRN','BTS','MNL','GHD','SDF','KLM'][a % 6]}; }
function ensureLicences(){
 S.lic.have = S.lic.have || {}; if (S.stats.trips > 0 && !Object.keys(S.lic.have).length){ S.lic.have.micro = true; S.lic.exp = S.lic.exp || Date.now() + LIC_DAYS * DAY; S.lic.no = S.lic.no || 'EG-DR-' + (100000 + ((Math.random() * 899999) | 0)); }
 VEHS.forEach(v => { const g = GV(v.id); if (g.owned && !g.vlic) g.vlic = {exp:Date.now() + VLIC_DAYS * DAY, iss:Date.now()}; });
 if (!S.avatar) S.avatar = {t:'ped', i:0}; S.cat = S.cat || {}; S.rs = S.rs || {}; S.stats.time = S.stats.time || 0; save();
}
function avatarHTML(cls){ const a = S.avatar || {t:'ped', i:0}; if (a.t === 'img') return `<div class="av ${cls || ''}" style="background-image:url(${a.d});background-size:cover;background-position:center"></div>`;
 const fr = META.peds[a.i] ? META.peds[a.i][0] : META.peds[0][0]; return `<div class="av ${cls || ''}" style="background-image:url(${ASSETS[fr]})"></div>`; }
/* ---------------- stats & economy tracking ---------------- */
const _ledger = ledger;
ledger = function(amount, label, icon){ _ledger(amount, label, icon); const k = icon || 'misc'; S.cat = S.cat || {}; const c = S.cat[k] || (S.cat[k] = {e:0, s:0}); if (amount >= 0) c.e += amount; else c.s += -amount; save(); };
const _endRun = endRun;
endRun = function(reason){ if (G.ended) return; const r = G.route, T = G.T, test = G.test; _endRun(reason);
 if (!test && r){ S.rs = S.rs || {}; const q = S.rs[r.id] || (S.rs[r.id] = {n:0, net:0, pax:0, km:0}); q.n += reason === 'ok' ? 1 : 0; q.net += T.fares + T.tips + T.cargo - T.fines - T.fee; q.pax += T.delivered; q.km += G.odo;
  S.stats.fuelL = (S.stats.fuelL || 0) + T.fuelL; S.stats.fares = (S.stats.fares || 0) + T.fares; S.stats.tips = (S.stats.tips || 0) + T.tips; S.stats.cargo = (S.stats.cargo || 0) + T.cargo; S.stats.best = Math.max(S.stats.best || 0, T.fares + T.tips + T.cargo - T.fines - T.fee); save(true); } };
/* ---------------- licence gating + automatic seatbelt ---------------- */
const _play = play;
play = function(route, opt){ opt = opt || {}; const V = VBY(opt.vid || S.sel);
 if (!opt.test){ if (!hasLic(V.cls)){ toastUI(L2('محتاج رخصة ' + nm(LIC_GRADES.find(g => g.k === V.cls).n) + ' — روح المرور', 'You need a ' + nm(LIC_GRADES.find(g => g.k === V.cls).n) + ' licence — visit the DMV'), 'bad', null, 5); DMVTAB = 'lic'; show('traffic'); return; }
  if (licExpired()) toastUI(L2('رخصتك منتهية — الكماين هتغرّمك', 'Your licence has expired — checkpoints will fine you'), 'bad', null, 4);
  if (vlicExpired(V.id)) toastUI(L2('رخصة المركبة منتهية — جددها من المرور', 'Vehicle licence expired — renew it at the DMV'), 'bad', null, 4); }
 _play(route, opt); };
const _startRoute = startRoute;
startRoute = function(route, opt){ _startRoute(route, opt); G.belt = true; if (G.car){ G.car.ind = 0; if (S.set.autoLights === false && G.mode === 'play') G.car.headOn = false; } G._wasMoving = false; };
/* ---------------- settings helpers ---------------- */
const SETD = {hud:'m', zoom:'n', traffic:'n', bubbles:true, autoLights:true, shake:true, swap:false, vib:true, hints:true, amb:.7, strict:false, units:'kmh'};
const setv = k => S.set[k] ?? SETD[k];
function applySettings(){ document.documentElement.style.setProperty('--hs', {s:.85, m:1, l:1.18, xl:1.35}[setv('hud')]); document.body.classList.toggle('swap', !!setv('swap')); document.body.classList.toggle('nohints', !setv('hints')); if (AMBI.n && AMBI.n.bus) AMBI.n.bus.gain.value = setv('amb'); calcPPM(); }
const _calcPPM = calcPPM;
calcPPM = function(){ _calcPPM(); PPM *= {c:1.2, n:1, f:.82}[setv('zoom')] || 1; };
const TRAFFIC_K = () => ({l:.55, n:1, h:1.45})[setv('traffic')] || 1;
const _say = say;
say = function(a, b, c, d, e){ if (!setv('bubbles')) return; _say(a, b, c, d, e); };
const _thud = AU.thud.bind(AU);
AU.thud = function(v){ _thud(v); if (setv('vib') && v > 5 && navigator.vibrate) try{ navigator.vibrate(Math.min(200, v * 12)); }catch(e){} };
/* ---------------- realistic horns ---------------- */
AU.hornVoice = function(freqs, dur, kind){ const c = this.ctx; if (!c) return; const t0 = c.currentTime;
 const ws = c.createWaveShaper(), curve = new Float32Array(1024); for (let i = 0; i < 1024; i++){ const x = i / 512 - 1; curve[i] = Math.tanh(x * 3.2); } ws.curve = curve;
 const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = kind === 'air' ? 900 : 1900; bp.Q.value = .7;
 const pk = c.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = kind === 'air' ? 450 : 3100; pk.gain.value = 7; pk.Q.value = 1.2;
 const g = c.createGain(); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(kind === 'air' ? .2 : .16, t0 + (kind === 'air' ? .06 : .015)); g.gain.setValueAtTime(kind === 'air' ? .2 : .16, t0 + dur - .06); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
 ws.connect(bp).connect(pk).connect(g).connect(this.sfxG);
 freqs.forEach((f, i) => { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * (kind === 'air' ? .9 : 1.03), t0); o.frequency.exponentialRampToValueAtTime(f, t0 + .05); const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5.5 + i; vg.gain.value = f * .006; vib.connect(vg).connect(o.frequency); const og = c.createGain(); og.gain.value = .5; o.connect(og).connect(ws); o.start(t0); vib.start(t0); o.stop(t0 + dur + .05); vib.stop(t0 + dur + .05); });
 if (kind === 'air') this.noiseHit(dur, 2500, .06, 0, 'bandpass', .6);
};
AU.horn = function(kind, big){
 if (!this.ctx) return;
 if (kind === 'melody'){ [659,784,988,784,659,988].forEach((f, i) => setTimeout(() => this.hornVoice([f, f * 1.26], .14, 'car'), i * 130)); return; }
 if (kind === 'cuca'){ [392,392,392,523,659,392,392,392,523,659].forEach((f, i) => setTimeout(() => this.hornVoice([f, f * 1.25], .11, 'car'), i * 120 + (i > 4 ? 200 : 0))); return; }
 if (kind === 'mahr'){ [440,440,523,440,587,523,440].forEach((f, i) => setTimeout(() => this.hornVoice([f, f * 1.19], .09, 'car'), i * 95)); return; }
 if (kind === 'air' || big) this.hornVoice([164, 208, 247], .75, 'air'); else this.hornVoice([415, 498], .42, 'car');
};
/* ---------------- calm AI traffic audio: nearest vehicles get engine + tyre voices ---------------- */
const AISND = { v:null,
 init(){ const c = AU.ctx; if (!c || this.v) return; this.v = [];
  for (let i = 0; i < 4; i++){ const o = c.createOscillator(), o2 = c.createOscillator(); o.type = 'sawtooth'; o2.type = 'triangle'; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; const g = c.createGain(); g.gain.value = 0;
   const n = c.createBufferSource(); n.buffer = AU.noise; n.loop = true; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = .5; const g2 = c.createGain(); g2.gain.value = 0;
   const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
   o.connect(lp); o2.connect(lp); lp.connect(g).connect(pan); n.connect(bp).connect(g2).connect(pan); pan.connect(AU.sfxG); o.start(); o2.start(); n.start(0, Math.random());
   this.v.push({o, o2, g, g2, pan, lp}); } },
 update(){ if (!AU.ctx) return; this.init(); const c = AU.ctx, tt = c.currentTime + .05, on = G.mode === 'play' && !G.paused && G.car; const car = G.car;
  const list = on ? G.ai.slice().sort((a, b) => Math.abs(a.x - car.x) - Math.abs(b.x - car.x)).slice(0, 4) : [];
  this.v.forEach((v, i) => { const a = list[i]; if (!a){ v.g.gain.setTargetAtTime(0, tt, .3); v.g2.gain.setTargetAtTime(0, tt, .3); return; }
   const d = Math.abs(a.x - car.x), k = clamp(1 - d / 70, 0, 1) * (a.lift > .4 ? .75 : 1) * setv('amb'), sp = Math.abs(a.vx), heavy = a.m > 5000;
   const f = (heavy ? 22 : 34) + sp * (heavy ? 1.6 : 2.4); v.o.frequency.setTargetAtTime(f, tt, .2); v.o2.frequency.setTargetAtTime(f * .5, tt, .2); v.lp.frequency.setTargetAtTime(180 + sp * 14, tt, .2);
   v.g.gain.setTargetAtTime(k * k * (heavy ? .05 : .03), tt, .25); v.g2.gain.setTargetAtTime(k * k * clamp(sp / 18, 0, 1) * .035, tt, .25); if (v.pan.pan) v.pan.pan.setTargetAtTime(clamp((a.x - car.x) / 40, -1, 1), tt, .2); }); }
};
/* ---------------- props: checkpoint & roadworks equipment sits on the far kerb (never over vehicles) ---------------- */
function drawFront(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3;
 band(urban ? IMG.curbR : IMG.curbY, -.26, -.55, 18, x0, x1);
 if (urban) band(IMG.walk, -.55, -1.25, 9, x0, x1); else band(IMG.dirt, -.55, -1.2, 12, x0, x1);
 ctx.fillStyle = mix(B.ground, '#1a1410', G.tod === 'night' ? .6 : .25); ctx.beginPath(); ctx.moveTo(sx(x0), VH); for (let x = x0; x <= x1; x += 2) ctx.lineTo(sx(x), sy(terrH(x) - 1.22)); ctx.lineTo(sx(x1), VH); ctx.fill();
 if (urban) band(IMG.hedge, -1.05, -1.9, 14, x0, x1);
}
function drawKerbProps(){
 const [x0, x1] = viewX();
 for (const p of W.props){ if (!p.front || p.x < x0 - 6 || p.x > x1 + 6) continue; const base = terrH(p.x) + 1.52, hM = (PROP_H[p.k] || 1) * .9, im = IMG[p.k]; if (G.tod !== 'night') castShadow(im, sx(p.x) - im.width / im.height * hM * PPM / 2, sy(base), im.width / im.height * hM * PPM, hM * PPM, .3); drawSprite(p.k, p.x, base, hM); }
 // parked police car at each checkpoint (on the pavement, behind the kerb)
 for (const c of W.cps){ if (c.x < x0 - 20 || c.x > x1 + 20) continue; const im = IMG.ai22, L = 4.5, h = L * im.height / im.width * PPM, w = L * PPM, X = sx(c.x + 11), Y = sy(terrH(c.x + 11) + 1.95);
  ctx.drawImage(im, X - w / 2, Y - h, w, h); const on = Math.floor(G.time * 6) % 2; const g = ctx.createRadialGradient(X, Y - h * .96, 0, X, Y - h * .96, PPM * 1.3); g.addColorStop(0, on ? 'rgba(60,130,255,.9)' : 'rgba(255,50,50,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y - h * .96, PPM * 1.3, 0, 7); ctx.fill();
  // painted STOP line on the road before the officer
  const lx = c.x - 4; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.moveTo(sx(lx), sy(terrH(lx) + 1.4)); ctx.lineTo(sx(lx + .35), sy(terrH(lx + .35) + 1.4)); ctx.lineTo(sx(lx + .35), sy(terrH(lx + .35) - .2)); ctx.lineTo(sx(lx), sy(terrH(lx) - .2)); ctx.fill(); }
}
/* ---------------- animated, dynamic stop markers on the road ---------------- */
function roadQuad(a, b, y0, y1){ ctx.beginPath(); for (let x = a; x <= b + .01; x += .5) ctx.lineTo(sx(x), sy(terrH(x) + y0)); for (let x = b; x >= a - .01; x -= .5) ctx.lineTo(sx(x), sy(terrH(x) + y1)); ctx.closePath(); }
function drawStopMarkers(){
 if (G.mode !== 'play' || !G.car) return; const car = G.car, [x0, x1] = viewX(), t = G.time;
 const st = W.stops[G.nextIdx]; if (st && st.x > x0 - 25 && st.x < x1 + 25){
  const tol = STOP_TOL(), a = st.x - tol, b = st.x + tol, dxp = doorX(), inZone = Math.abs(dxp - st.x) < tol, stopped = speedOf(car) < .7, busy = G.doorOpen && inZone;
  const col = busy ? '46,230,120' : inZone ? '120,230,255' : '255,196,40', pulse = .5 + .5 * Math.sin(t * 4);
  roadQuad(a - 1.2, b + 1.2, .5, -.16); ctx.fillStyle = `rgba(${col},${.12 + .1 * pulse})`; ctx.fill(); ctx.setLineDash([PPM * .5, PPM * .35]); ctx.lineWidth = Math.max(2, PPM * .07); ctx.strokeStyle = `rgba(${col},.95)`; ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.font = `800 ${Math.max(12, PPM * .42)}px Lalezar, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = `rgba(${col},.9)`; ctx.fillText(W.stops.length - 1 === st.i ? L2('آخر الخط', 'LAST STOP') : 'BUS STOP  ' + L2('موقف', ''), sx(st.x), sy(terrH(st.x) + .1)); ctx.restore();
  // door target: glowing post + gap arrow between door and target
  const tx = sx(st.x), ty = sy(terrH(st.x) + .55); const gr = ctx.createLinearGradient(0, ty - PPM * 3.2, 0, ty); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(1, `rgba(${col},${.55 + .3 * pulse})`); ctx.fillStyle = gr; ctx.fillRect(tx - PPM * .12, ty - PPM * 3.2, PPM * .24, PPM * 3.2);
  if (!busy){ // chevrons flowing toward the stop
   for (let k = 0; k < 5; k++){ const xk = a - 3 - ((t * 4 + k * 2.4) % 12); if (xk < x0) continue; const X = sx(xk), Y = sy(terrH(xk) + .17), s = PPM * .32, al = clamp(1 - (a - xk) / 14, 0, 1); ctx.strokeStyle = `rgba(${col},${al})`; ctx.lineWidth = Math.max(2, PPM * .09); ctx.beginPath(); ctx.moveTo(X - s, Y - s); ctx.lineTo(X, Y); ctx.lineTo(X - s, Y + s); ctx.stroke(); }
   const gap = st.x - dxp; if (Math.abs(gap) < 25){ ctx.save(); ctx.font = `700 ${Math.max(12, PPM * .38)}px "Readex Pro", sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3; const txt = inZone ? (stopped ? '✓' : L2('قف هنا', 'STOP HERE')) : (gap > 0 ? '→ ' : '← ') + Math.abs(gap).toFixed(1) + ' m'; const Y = sy(car.y + car.yt + 1.6); ctx.strokeText(txt, sx(dxp), Y); ctx.fillText(txt, sx(dxp), Y); ctx.restore(); } }
  // floating stop label with passengers waiting / alighting
  const wait = st.waiting ? st.waiting.length : 0, off = G.onboard.filter(p => p.dest <= st.i).length; const lx = sx(st.x), ly = sy(terrH(st.x) + 5.2 + Math.sin(t * 2) * .12);
  ctx.save(); ctx.font = `700 ${clamp(PPM * .36, 12, 17)}px "Readex Pro", sans-serif`; const lab = nm(st.name), sub = `⬆ ${wait}   ⬇ ${off}` + (G.parcels.some(p => p.on && p.dest === st.i) ? '   📦' : ''); const w = Math.max(ctx.measureText(lab).width, ctx.measureText(sub).width) + 24, h = clamp(PPM * .95, 36, 48);
  ctx.fillStyle = 'rgba(10,20,44,.88)'; ctx.strokeStyle = `rgba(${col},.95)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(lx - w / 2, ly - h, w, h, 9) : ctx.rect(lx - w / 2, ly - h, w, h); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText(lab, lx, ly - h * .58); ctx.fillStyle = `rgb(${col})`; ctx.fillText(sub, lx, ly - h * .18); ctx.restore(); }
 // rest house bay (coach)
 for (const r of W.rests){ if (r.used || r.x < x0 - 20 || r.x > x1 + 20) continue; roadQuad(r.x - 14, r.x + 14, .5, -.16); ctx.fillStyle = `rgba(80,160,255,${.12 + .08 * Math.sin(t * 3)})`; ctx.fill(); ctx.strokeStyle = 'rgba(80,160,255,.9)'; ctx.lineWidth = 2; ctx.stroke(); }
}
const _drawWorld = drawWorld;
drawWorld = function(){ _drawWorld(); drawKerbProps(); drawStopMarkers(); };
/* officer stands on the kerb line, clear of traffic */
function drawOfficer(c){ const f = c.oFrame ?? 0; const im = IMG['off' + f]; if (!im) return; const h = 1.8 * PPM, w = im.width / im.height * h; const X = sx(c.ox), Y = sy(terrH(c.ox) + 1.2);
 if (G.tod !== 'night') castShadow(im, X - w / 2, Y, w, h, .3); ctx.save(); ctx.translate(X, Y); if (c.oFace < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore(); }
/* ---------------- wheels spin about their true centre ---------------- */
function centreWheels(){
 for (let i = 0; i < 12; i++){ const im = IMG['wh' + i]; if (!im || !im.width) continue; const c0 = document.createElement('canvas'); c0.width = im.width; c0.height = im.height; const x0 = c0.getContext('2d'); x0.drawImage(im, 0, 0);
  const d = x0.getImageData(0, 0, im.width, im.height).data; let sx2 = 0, sy2 = 0, n = 0; for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (d[(y * im.width + x) * 4 + 3] > 200){ sx2 += x; sy2 += y; n++; }
  const cx = sx2 / n, cy = sy2 / n; let R = 0; for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (d[(y * im.width + x) * 4 + 3] > 200) R = Math.max(R, Math.hypot(x - cx, y - cy));
  R = Math.ceil(R); const c = document.createElement('canvas'); c.width = c.height = R * 2; const x = c.getContext('2d'); x.beginPath(); x.arc(R, R, R, 0, 7); x.clip(); x.drawImage(c0, R - cx, R - cy); IMG['wh' + i] = c; }
}
/* ---------------- dashboard: centred LCD, lamps off unless active, tell-tale strip ---------------- */
const LAMP = {arL:[.366,.165,.056,.14], arR:[.592,.165,.056,.14], bus:[.476,.155,.062,.16], belt:[.398,.8,.044,.12], park:[.452,.8,.05,.12], eng:[.508,.8,.052,.12], head:[.566,.8,.048,.12]};
function drawCluster(){
 const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight; if (!W2) return; const d = Math.min(2, window.devicePixelRatio || 1); if (c.width !== Math.round(W2 * d)){ c.width = Math.round(W2 * d); c.height = Math.round(H2 * d); }
 const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W2, H2); x.drawImage(IMG.cluster, 0, 0, W2, H2);
 const car = G.car; if (!car) return; const kmh = Math.abs(car.vx) * 3.6, rpm = G.engOn ? car.rpm * 6 : 0; G.nd = G.nd || {s:0, r:0}; G.nd.s += (kmh - G.nd.s) * .25; G.nd.r += (rpm - G.nd.r) * .2;
 needle(x, W2 * .234, H2 * .635, W2 * .128, -113 + clamp(G.nd.s / 160, 0, 1) * 228, '#ff5a1f', W2 * .007);
 needle(x, W2 * .782, H2 * .635, W2 * .128, -113 + clamp(G.nd.r / 6, 0, 1) * 230, '#ff5a1f', W2 * .007);
 const blink = Math.floor(G.time * 2.2) % 2 === 0, off = k => { const [a, b, w, h] = LAMP[k]; x.fillStyle = 'rgba(9,11,15,.93)'; x.beginPath(); x.roundRect ? x.roundRect(W2 * a, H2 * b, W2 * w, H2 * h, 3) : x.rect(W2 * a, H2 * b, W2 * w, H2 * h); x.fill(); };
 if (!(blink && car.haz)){ off('arL'); off('arR'); } if (!G.doorOpen) off('bus'); off('belt'); if (!(!G.engOn || G.hbrake || (G.doorOpen && speedOf(car) < .5))) off('park'); if (!(G.cond && G.cond.engine < 45)) off('eng'); if (!car.headOn) off('head');
 const cx = W2 * .507; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#9fe8ff';
 x.font = `700 ${H2 * .11}px "Readex Pro", sans-serif`; x.fillText(gearState(), cx, H2 * .43);
 x.font = `700 ${H2 * .075}px "Readex Pro", sans-serif`; x.fillText(Math.round(kmh) + ' km/h', cx, H2 * .525);
 x.fillStyle = '#7cc7d8'; x.font = `500 ${H2 * .055}px "Readex Pro", sans-serif`; x.fillText((G.odo || 0).toFixed(1) + ' km', cx, H2 * .61);
 x.fillStyle = G.cruise ? '#3dff8a' : '#3b5560'; x.fillText(G.cruise ? 'CC ' + Math.round(G.cruise * 3.6) : 'CC ‒', cx, H2 * .69);
 if (car.absT > 0) car.absT -= .016; if (car.tcT > 0) car.tcT -= .016;
 const f = $('#fuelG'), tg = $('#tempG');
 for (const [el, img, val] of [[f, IMG.fuelG, G.fuel / G.fuelMax], [tg, IMG.tempG, clamp((G.temp - 50) / 70, 0, 1)]]){ const w = el.clientWidth, h = el.clientHeight; if (!w) continue; if (el.width !== Math.round(w * d)){ el.width = Math.round(w * d); el.height = Math.round(h * d); } const y = el.getContext('2d'); y.setTransform(d, 0, 0, d, 0, 0); y.clearRect(0, 0, w, h); y.drawImage(img, 0, 0, w, h); needle(y, w * .505, h * .665, w * .3, -56 + clamp(val, 0, 1) * 112, '#ff5a1f', w * .025); }
 // tell-tale strip (big, readable)
 const TT = [['⚠', car.haz && blink, '#ffb300'], ['💡', !!car.headOn, '#3d8bff'], ['CC', !!G.cruise, '#3dff8a'], ['❄', !!G.ac, '#46c8ff'], ['ABS', car.absT > 0, '#ffb300'], ['TC', car.tcT > 0, '#ffb300'], ['🚪', G.doorOpen, '#ff3b3b'], ['⛽', G.fuel < G.fuelMax * .12, '#ffb300'], ['🌡', G.temp > 108, '#ff3b3b'], ['🛢', G.cond && G.cond.oil < 15, '#ff3b3b'], ['🛞', car.wh.some(w => w.flat), '#ffb300']];
 const el = $('#tt'); if (el){ const html = TT.map(([s, on, col]) => `<i class="${on ? 'on' : ''}" style="${on ? '--c:' + col : ''}">${s}</i>`).join(''); if (el._h !== html){ el._h = html; el.innerHTML = html; } }
}
function gearState(){ const car = G.car; if (!G.engOn) return 'P'; if (car.rev) return 'R'; if (G.doorOpen && speedOf(car) < .5) return 'N'; return 'D'; }
/* ---------------- cockpit controls: fewer, bigger, labelled ---------------- */
function buildControls(){
 const lab = (ar, en) => `<em>${L2(ar, en)}</em>`;
 const b = (id, img, act, k, labAr, labEn, cls) => `<button class="cb ${cls || ''}" id="${id}" data-act="${act}"><img src="${ASSETS[img]}">${k ? `<span class="k">${k}</span>` : ''}${lab(labAr, labEn)}</button>`;
 $('#ctrlsL').innerHTML = b('bHaz', 'hazard', 'haz', 'Z', 'الانتظار', 'Hazard') + b('bLight', 'lightSw', 'light', 'L', 'النور', 'Lights') + b('bHorn', 'hornBtn', 'horn', 'H', 'كلاكس', 'Horn') + `<span id="doorBtn" hidden></span><span id="bWipe" hidden></span><span id="bBelt" hidden></span><span id="bIndL" hidden></span><span id="bIndR" hidden></span>`;
 $('#ctrls').innerHTML = `<button class="cb gearb" id="bGear" data-act="gear"><img id="gearImg" src="${ASSETS.gearP}"><span class="k">G</span>${lab('الفتيس', 'Gear')}</button>` + b('bRadio', 'i_radio', 'radio', 'R', 'راديو', 'Radio') + b('bAC', 'i_weather', 'ac', 'A', 'تكييف', 'A/C') + b('bCC', 'cruise', 'cc', 'C', 'مثبت', 'Cruise');
 $$('[data-act]').forEach(e => e.addEventListener('pointerdown', ev => { ev.preventDefault(); AU.init(); if (G.mode === 'play') ACT[e.dataset.act](); }));
 $('#startBtn').innerHTML = `<img src="${ASSETS.start}">`; $('#startBtn').onpointerdown = e => { e.preventDefault(); startEngine(); };
 $('#pedB').innerHTML = `<img src="${ASSETS.pedalB}">`; $('#pedG').innerHTML = `<img src="${ASSETS.pedalG}">`;
 $('#radioP').insertAdjacentHTML('afterbegin', `<div class="rname" id="rName"></div><img src="${ASSETS.radio}"><div class="rpres" id="rPres"></div>`); $('#acP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.acPanel}">`); $('#cruiseP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.cruise}">`);
 $('#hud').insertAdjacentHTML('beforeend', '<div id="tt"></div>');
 const tap = (id, fn) => { const e = $('#' + id); if (e) e.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); AU.click(); fn(ev); }); };
 tap('rPow', toggleRadio); tap('rNext', () => tune(1)); tap('rPrev', () => tune(-1)); tap('rVolD', () => { S.set.radio = clamp(Math.round((S.set.radio - .1) * 10) / 10, 0, 1); RADIO.vol(); save(); }); tap('rVolU', () => { S.set.radio = clamp(Math.round((S.set.radio + .1) * 10) / 10, 0, 1); RADIO.vol(); save(); });
 S.radio.pre = S.radio.pre || [0, 2, 5, 4];
 $$('.rpre').forEach((e, i) => { let tm = 0; e.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); tm = setTimeout(() => { S.radio.pre[i] = S.radio.st; save(); toastUI(L2('اتحفظت في زرار ', 'Saved to preset ') + (i + 1), 'good'); tm = -1; }, 700); }); e.addEventListener('pointerup', () => { if (tm !== -1){ clearTimeout(tm); S.radio.st = S.radio.pre[i]; save(); G.radioOn = true; S.radio.on = true; RADIO.play(S.radio.st); AU.click(); } }); });
 tap('acCool', () => { G.acSet = Math.max(16, G.acSet - 1); }); tap('acWarm', () => { G.acSet = Math.min(30, G.acSet + 1); });
 tap('fanDn', () => { G.fan = Math.max(0, (G.fan || 0) - 1); }); tap('fanUp', () => { G.fan = Math.min(4, (G.fan || 0) + 1); });
 tap('acOn', () => { G.ac = !G.ac; if (G.ac && !G.fan) G.fan = 2; }); tap('acRec', () => { G.recirc = !G.recirc; }); tap('acVent', () => { G.vent = G.vent === 'face' ? 'feet' : 'face'; }); tap('acDef', () => { G.defrost = !G.defrost; if (G.defrost){ G.ac = true; G.fan = Math.max(G.fan || 0, 3); } });
 tap('ccOn', () => { if (G.cruise){ G.lastCruise = G.cruise; G.cruise = 0; toastUI(t('cruiseOff')); } else cruiseSet(); });
 tap('ccRes', () => { if (G.cruise) G.cruise = Math.min(G.car.vmax, G.cruise + 5 / 3.6); else if (G.lastCruise){ G.cruise = G.lastCruise; toastUI(t('cruiseSet') + ' ' + fmt(Math.round(G.cruise * 3.6))); } });
 tap('ccSet', () => { if (G.cruise) G.cruise = Math.max(20 / 3.6, G.cruise - 5 / 3.6); else cruiseSet(); }); tap('ccCan', () => { if (G.cruise){ G.lastCruise = G.cruise; G.cruise = 0; toastUI(t('cruiseOff')); } });
 const ped = (el, k) => { const on = e => { e.preventDefault(); AU.init(); G[k] = true; el.classList.add('down'); try{ el.setPointerCapture(e.pointerId); }catch(_){} if (k === 'gasT' && !G.engOn) startEngine(); }, offp = () => { G[k] = false; el.classList.remove('down'); }; el.addEventListener('pointerdown', on); el.addEventListener('pointerup', offp); el.addEventListener('pointercancel', offp); el.addEventListener('lostpointercapture', offp); };
 ped($('#pedG'), 'gasT'); ped($('#pedB'), 'brakeT');
 $('#pauseBtn').onclick = () => pause(true); $('#pResume').onclick = () => pause(false); $('#pRestart').onclick = () => { $('#pauseM').classList.remove('on'); play(G.route, {vid:G.vid, test:G.test, parcels:G.parcels.map(p => Object.assign(p, {on:true, broken:false}))}); };
 $('#pQuit').onclick = () => { $('#pauseM').classList.remove('on'); if (!G.test && G.mode === 'play'){ GV(G.vid).fuel = G.fuel; save(); } toMenu('routes'); };
 $('#pHelp').onclick = () => $('#helpM').classList.add('on'); $('#helpOk').onclick = () => $('#helpM').classList.remove('on');
 $('#rCall').onclick = () => { if (G.rest) G.rest.called = true; }; $('#rLeave').onclick = closeRest;
 $('#langBtn').onclick = () => { LANG = S.lang = LANG === 'ar' ? 'en' : 'ar'; save(); applyLang(); };
 document.addEventListener('pointerdown', e => { if (!e.target.closest('.pan') && !e.target.closest('#ctrls')) $$('.pan').forEach(p => p.classList.remove('on')); });
 applySettings();
}
ACT.gear = () => { if (!G.engOn){ startEngine(); return; } if (Math.abs(G.car.vx) > 1.5){ toastUI(L2('وقف الأول عشان تغير الفتيس', 'Stop first to change gear')); return; } G.car.rev = !G.car.rev; G.car.gear = 1; AU.tone(140, .06, 'square', .1); AU.noiseHit(.05, 900, .15); };
['KeyQ','KeyE','KeyB','KeyD','KeyV'].forEach(k => delete KEYMAP[k]);
const _updateHUD = updateHUD;
updateHUD = function(dt){ const due = hudT - dt <= 0; _updateHUD(dt); if (!due || !G.car) return;
 const gs = gearState(), gi = $('#gearImg'); if (gi && gi.dataset.g !== gs){ gi.dataset.g = gs; gi.src = ASSETS['gear' + gs]; }
 const st = STATIONS[S.radio.st], rs = RADIO.status; $('#rName').innerHTML = `<b>${LANG === 'ar' ? st.ar : st.en}</b>${st.fm ? `<span>FM ${st.fm}</span>` : ''}`;
 $('#radioLCD').innerHTML = G.radioOn ? `<b>${rs === 'live' ? '● LIVE' : rs === 'tune' ? L2('جاري الاتصال…', 'Connecting…') : L2('مفيش إشارة', 'NO SIGNAL')}</b><span>VOL ${Math.round(S.set.radio * 100)}%</span>` : '<b>OFF</b>';
 const pr = $('#rPres'); const ph = S.radio.pre.map(i => `<span>${LANG === 'ar' ? STATIONS[i].ar : STATIONS[i].en}</span>`).join(''); if (pr._h !== ph){ pr._h = ph; pr.innerHTML = ph; } };
/* radio: real streams only (no synthetic substitute) with automatic reconnect */
RADIO.fallback = function(){ if (this.status === 'off') return; this.status = 'nosig'; clearTimeout(this.rt); this.rt = setTimeout(() => { if (G.radioOn && this.status === 'nosig') this.play(this.idx); }, 12000); };
RADIO.play = function(i){ this.idx = i; this.stop(true); const st = STATIONS[i]; this.status = 'tune'; AU.staticBurst();
 try{ if (!this.el){ this.el = new Audio(); this.el.preload = 'none'; this.el.onplaying = () => { this.status = 'live'; }; this.el.onerror = () => this.fallback(); this.el.onstalled = () => { if (this.status !== 'live') this.fallback(); }; }
  this.el.src = st.url; this.el.volume = clamp(S.set.radio, 0, 1); const p = this.el.play(); if (p) p.catch(() => this.fallback()); clearTimeout(this.to); this.to = setTimeout(() => { if (this.status !== 'live') this.fallback(); }, 15000); }catch(e){ this.fallback(); } };
/* ---------------- per-frame extras: traffic audio, air-brake hiss, playtime, shake off ---------------- */
const _v2tick = v2tick;
v2tick = function(dt, spd, full){ _v2tick(dt, spd, full); AISND.update(); if (!full) return; const car = G.car; S.stats.time = (S.stats.time || 0) + dt; if (!setv('shake')) cam.shake = 0;
 if (G.V.cls !== 'micro'){ if (spd > 2.5) G._wasMoving = true; if (G._wasMoving && spd < .3){ G._wasMoving = false; AU.noiseHit(.9, 3500, .12, .1, 'highpass', .4); AU.tone(2900, .25, 'sine', .015); } }
 if (Math.floor(S.stats.time) % 20 === 0 && Math.floor(S.stats.time - dt) % 20 !== 0) save(); };
/* ================= DMV screen (licences, vehicle licences, fines, inspection) ================= */
let DMVTAB = 'lic';
function licCard(){ const L = S.lic, have = LIC_GRADES.filter(g => hasLic(g.k)), dt = d => d ? new Date(d).toLocaleDateString(LANG === 'ar' ? 'ar-EG' : 'en-GB') : '—';
 return `<div class="lic2"><div class="flag"></div><div class="lhead"><b>جمهورية مصر العربية</b><span>رخصة قيادة · DRIVING LICENCE</span></div>
 <div class="lbody">${avatarHTML('lph')}<div class="chip2"></div><dl><dt>${L2('الاسم', 'Name')}</dt><dd>${playerName()}</dd><dt>${L2('رقم الرخصة', 'Licence no.')}</dt><dd>${L.no || '—'}</dd><dt>${L2('تاريخ الإصدار', 'Issued')}</dt><dd>${dt(L.issued2)}</dd><dt>${L2('تاريخ الانتهاء', 'Expires')}</dt><dd>${dt(L.exp)}</dd><dt>${L2('الفئة', 'Class')}</dt><dd>${have.length ? have.map(g => nm(g.n).split('—')[0]).join(' · ') : L2('لا توجد', 'None')}</dd></dl></div>
 <div class="lfoot"><span class="brand">OGRAAA</span><small>DRIVING LICENSE</small><em>${L2('مصر دائماً على الطريق', 'Egypt, always on the road')}</em></div><div class="pyr"></div></div>`; }
function plateHTML(id){ const p = plateFor(id); return `<div class="plate"><div class="pt"><span>مصر</span><span>EGYPT</span></div><div class="pn"><span>${p.ar}</span><span>${p.en}</span></div></div>`; }
function renderTraffic(){
 decayPoints(); ensureLicences(); const L = S.lic, susp = L.suspUntil > Date.now(), total = S.fines.reduce((a, f) => a + f.amt, 0), lv = lvlOf(S.xp).l;
 const anyLic = LIC_GRADES.some(g => hasLic(g.k)), exp = licExpired(), left = anyLic && !exp ? Math.ceil((L.exp - Date.now()) / DAY) : 0;
 const status = !anyLic ? ['none', L2('لا توجد رخصة', 'No licence'), L2('اشتري رخصة عشان تسوق', 'Buy a licence to drive')] : susp ? ['no', t('suspended'), L2('الرخصة مسحوبة مؤقتاً', 'Temporarily suspended')] : exp ? ['no', t('expired'), L2('جدد الرخصة', 'Renew your licence')] : ['ok', t('valid'), L2('يمكنك القيادة بشكل قانوني', 'You may drive legally')];
 const tabs = [['lic', 'ticket', t('license')], ['veh', 'garage', t('vlicense')], ['fines', 'police', t('fines')], ['insp', 'repair', t('inspection')]];
 let body = '';
 if (DMVTAB === 'lic') body = `<div class="grid g2"><div class="card"><h3>${icon('ticket')} ${t('license')}</h3>${licCard()}</div>
  <div class="card"><h3>${icon('police')} ${L2('حالة الرخصة', 'Licence status')}</h3><div class="row"><div class="status ${status[0] === 'ok' ? 'ok' : 'no'}" style="flex:1"><span style="font-size:2rem">${status[0] === 'ok' ? '✅' : '⛔'}</span><div><b style="font-size:1.3rem">${status[1]}</b><div class="muted">${status[2]}</div></div></div>
   <div class="ring2" style="--p:${anyLic ? clamp(left / LIC_DAYS * 100, 0, 100) : 0}"><div><small>${L2('متبقي', 'Left')}</small><b>${fmt(left)}</b><small>${L2('يوم', 'days')}</small></div></div></div>
   <div class="grid g2" style="margin-top:.8rem"><div class="fact">⭐<span class="muted">${t('points')}</span><b>${fmt(L.points)} / ١٢</b></div><div class="fact">💰<span class="muted">${t('fines')}</span><b class="badc">${fmt(S.fines.length)} · ${money(total)}</b></div></div>
   ${susp ? `<div class="mbtns"><button class="btn" id="rehab">${L2('دورة تأهيل', 'Rehab course')} · ${money(1500)}</button></div>` : ''}
   ${anyLic ? `<div class="mbtns"><button class="btn ${exp || left < 15 ? '' : 'sec'}" id="renew">${icon('calendar')} ${t('renew')} · ${money(300)}</button></div>` : ''}</div></div>
  <h3 style="margin:1rem 0 .5rem">${icon('upgrade')} ${L2('درجات الرخصة', 'Licence grades')}</h3><div class="grid g3">${LIC_GRADES.map(g => { const own = hasLic(g.k), lock = lv < g.lvl; return `<div class="card grade ${own ? 'own' : ''}"><b>${nm(g.n)}</b><div class="muted">${nm(g.cls)} · ${L2('مستوى', 'Level')} ${fmt(g.lvl)}</div><div class="vpick" style="margin:.5rem 0">${VEHS.filter(v => v.cls === g.k).map(v => `<img src="${ASSETS[v.spr]}" style="height:1.6rem">`).join('')}</div>${own ? `<span class="good">✓ ${t('owned')}</span>` : `<button class="btn sm" data-grade="${g.k}" ${lock ? 'disabled' : ''}>${lock ? '🔒 ' + fmt(g.lvl) : t('buy') + ' · ' + money(g.price)}</button>`}</div>`; }).join('')}</div>`;
 else if (DMVTAB === 'veh') body = `<div class="grid g2">${VEHS.filter(v => GV(v.id).owned).map(v => { const g = GV(v.id), ex = vlicExpired(v.id), dl = g.vlic ? Math.ceil((g.vlic.exp - Date.now()) / DAY) : 0; return `<div class="card vlic"><div class="row"><img src="${ASSETS[v.spr]}" style="height:3.2rem"><div><b>${nm(v.name)}</b><div class="muted">${L2('رخصة تسيير', 'Registration')} · ${nm(LIC_GRADES.find(q => q.k === v.cls).cls)}</div></div></div>${plateHTML(v.id)}<div class="row"><span class="${ex ? 'badc' : 'good'}">${ex ? t('expired') : L2('سارية — باقي ', 'Valid — ') + fmt(dl) + L2(' يوم', ' days left')}</span><span class="sp"></span><button class="btn sm ${ex || dl < 10 ? '' : 'sec'}" data-vren="${v.id}">${t('renew')} · ${money(vlicFee(v))}</button></div></div>`; }).join('')}</div>`;
 else if (DMVTAB === 'fines') body = `<div class="card">${S.fines.length ? S.fines.slice().reverse().map(f => `<div class="fine">🚨 <span>${t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', vlic:'fVlic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed'}[f.k] || 'fCrash')}<div class="muted" style="font-size:.72rem">${f.where} · ${new Date(f.t).toLocaleDateString(LANG === 'ar' ? 'ar-EG' : 'en-GB')}</div></span><span class="sp"></span><b>${money(f.amt)}</b></div>`).join('') + `<div class="mbtns"><button class="btn" id="payAll">${t('payAll')} · ${money(total)}</button></div>` : `<div class="muted">${t('noFines')}</div>`}</div>`;
 else body = `<div class="grid g2">${VEHS.filter(v => GV(v.id).owned).map(v => { const g = GV(v.id), leftI = Math.ceil((g.inspT + 14 * DAY - Date.now()) / DAY), fee = ({micro:150, bus:250, coach:400})[v.cls]; return `<div class="card"><div class="row"><img src="${ASSETS[v.spr]}" style="height:2.8rem"><b>${nm(v.name)}</b><span class="sp"></span><span class="${leftI > 0 ? 'good' : 'badc'}">${leftI > 0 ? fmt(leftI) + L2(' يوم', ' days') : t('expired')}</span></div>${['body','engine','susp','tyres','brakes'].map(k => `<div class="set"><label>${t('c_' + k)}</label><div class="sp">${bar(g.cond[k])}</div><b>${fmt(pct(g.cond[k]))}%</b></div>`).join('')}<div class="mbtns"><button class="btn sm" data-insp="${v.id}">${t('doInsp')} · ${money(fee)}</button></div></div>`; }).join('')}</div>`;
 $('#s-traffic').innerHTML = `<div class="head"><h1>${L2('المرور', 'DMV')}</h1><p>${L2('خدمة المواطن .. من أجل طريق آمن', 'Serving citizens for safer roads')}</p></div><div class="tabs">${tabs.map(([k, ic, n]) => `<button class="tab ${DMVTAB === k ? 'on' : ''}" data-dt="${k}">${icon(ic)} ${n}</button>`).join('')}</div>${body}`;
 $$('[data-dt]').forEach(b => b.onclick = () => { DMVTAB = b.dataset.dt; renderTraffic(); });
 $$('[data-grade]').forEach(b => b.onclick = () => { const g = LIC_GRADES.find(q => q.k === b.dataset.grade); if (!spend(g.price, t('license') + ' · ' + nm(g.n), 'ticket')) return; S.lic.have[g.k] = true; S.lic.no = S.lic.no || 'EG-DR-' + (100000 + ((Math.random() * 899999) | 0)); S.lic.issued2 = S.lic.issued2 || Date.now(); S.lic.exp = Date.now() + LIC_DAYS * DAY; AU.levelUp(); toastUI('🪪 ' + t('bought'), 'good'); save(); renderTraffic(); });
 const rn = $('#renew'); if (rn) rn.onclick = () => { if (spend(300, t('renew') + ' · ' + t('license'), 'calendar')){ S.lic.exp = Math.max(Date.now(), S.lic.exp || 0) + LIC_DAYS * DAY; save(); renderTraffic(); } };
 const rh = $('#rehab'); if (rh) rh.onclick = () => { if (spend(1500, 'Rehab course', 'police')){ S.lic.suspUntil = 0; S.lic.points = 6; save(); renderTraffic(); } };
 const pa = $('#payAll'); if (pa) pa.onclick = () => { if (spend(total, t('fines'), 'police')){ S.fines = []; save(); renderTraffic(); } };
 $$('[data-vren]').forEach(b => b.onclick = () => { const v = VBY(b.dataset.vren), g = GV(v.id); if (spend(vlicFee(v), t('vlicense') + ' · ' + nm(v.name), 'traffic')){ g.vlic = {exp:Math.max(Date.now(), g.vlic ? g.vlic.exp : 0) + VLIC_DAYS * DAY, iss:Date.now()}; save(); renderTraffic(); } });
 $$('[data-insp]').forEach(b => b.onclick = () => { const v = VBY(b.dataset.insp), g = GV(v.id), fee = ({micro:150, bus:250, coach:400})[v.cls]; if (!spend(fee, t('inspection'), 'traffic')) return; if (['body','engine','susp','tyres','brakes'].some(k => g.cond[k] < 40)) toastUI(t('inspFail'), 'bad'); else { g.inspT = Date.now(); toastUI(t('inspOk'), 'good'); } save(); renderTraffic(); });
}
/* ================= detailed driver profile ================= */
function renderProfile(){
 ensureLicences(); const L = lvlOf(S.xp), st = S.stats, h = Math.floor((st.time || 0) / 3600), m = Math.floor(((st.time || 0) % 3600) / 60);
 const cats = [['ticket', L2('أجرة الركاب', 'Fares')], ['terminal', L2('طرود / كارتة', 'Parcels / fees')], ['calendar', L2('هدايا ومهام', 'Gifts & tasks')], ['fuel', L2('سولار', 'Diesel')], ['repair', L2('صيانة', 'Repairs')], ['police', L2('مخالفات', 'Fines')], ['showroom', L2('شراء مركبات', 'Vehicles')], ['upgrade', L2('تطوير', 'Upgrades')], ['paint', L2('مظهر', 'Cosmetics')]];
 const mx = Math.max(1, ...cats.map(([k]) => Math.max((S.cat[k] || {}).e || 0, (S.cat[k] || {}).s || 0)));
 const F = (ic, n, v) => `<div class="fact">${icon(ic)}<span class="muted">${n}</span><b>${v}</b></div>`;
 $('#s-profile').innerHTML = `<div class="head"><h1>${t('profile')}</h1><p>${L2('رحلتك .. عربيتك .. إنجازاتك', 'Your trips, your ride, your achievements')}</p></div>
 <div class="grid g3"><div class="card" style="text-align:center">${avatarHTML('big')}<input type="text" id="nmIn" maxlength="18" value="${S.name}" placeholder="${t('name')}" style="margin-top:.6rem;text-align:center">
  <div class="row" style="justify-content:center;margin-top:.5rem"><label class="btn sm sec" style="cursor:pointer">📷 ${L2('صورة', 'Photo')}<input type="file" id="avUp" accept="image/*" hidden></label><button class="btn sm sec" id="avPick">🧑 ${L2('شخصية', 'Character')}</button></div>
  <div id="avGrid" class="avgrid" hidden>${META.peds.map((p, i) => `<button data-av="${i}" style="background-image:url(${ASSETS[p[0]]})"></button>`).join('')}</div>
  <div class="pill gold" style="justify-content:center;margin-top:.7rem">${titleOf(L.l)}</div><div class="muted" style="margin-top:.4rem">${t('lvl')} ${fmt(L.l)} · XP ${fmt(L.into)}/${fmt(L.need)}</div>${bar(L.into / L.need * 100, 'gold')}<div style="margin-top:.6rem">${t('rating')}: <b class="gold">${fmt(st.rating, 1)} / ٥ ★</b></div></div>
 <div class="card" style="grid-column:span 2"><h3>${icon('stats')} ${t('stats')}</h3><div class="facts" style="grid-template-columns:repeat(4,1fr)">${F('map', t('totalKm'), fmt(st.km, 1) + ' ' + t('km'))}${F('ticket', t('trips'), fmt(st.trips))}${F('seat', t('pax'), fmt(st.pax))}${F('cash', t('earned'), money(st.earned))}
  ${F('coins', L2('المصاريف', 'Spent'), money(st.spent))}${F('trophy', L2('أعلى مكسب رحلة', 'Best trip profit'), money(st.best || 0))}${F('fuel', L2('سولار مستهلك', 'Diesel used'), fmt(st.fuelL || 0, 1) + ' L')}${F('daynight', L2('وقت اللعب', 'Play time'), fmt(h) + L2('س ', 'h ') + fmt(m) + L2('د', 'm'))}
  ${F('cash', L2('إجمالي البقشيش', 'Total tips'), money(st.tips || 0))}${F('police', t('fines'), money(st.fines))}${F('crash', L2('حوادث', 'Collisions'), fmt(st.crashes))}${F('stats', L2('مكسب/كم', 'Profit per km'), money(st.km > 0 ? (st.earned - st.spent) / st.km : 0))}</div></div></div>
 <div class="grid g2" style="margin-top:1rem"><div class="card"><h3>${icon('coins')} ${L2('تحليل الفلوس', 'Money breakdown')}</h3>${cats.map(([k, n]) => { const c = S.cat[k] || {e:0, s:0}; return `<div class="set"><label>${icon(k)} ${n}</label><div class="sp"><div class="bar good"><i style="width:${c.e / mx * 100}%"></i></div><div class="bar bad" style="margin-top:2px"><i style="width:${c.s / mx * 100}%"></i></div></div><b style="width:6rem;font-size:.8rem"><span class="good">+${fmt(Math.round(c.e))}</span><br><span class="badc">−${fmt(Math.round(c.s))}</span></b></div>`; }).join('')}</div>
 <div class="card"><h3>${icon('map')} ${L2('أداء الخطوط', 'Routes')}</h3>${ROUTES.filter(r => S.rs[r.id]).map(r => { const q = S.rs[r.id]; return `<div class="set"><label style="width:auto;flex:1">${nm(r.from)} ← ${nm(r.to)}</label><span class="stars">${'★'.repeat(S.best[r.id] || 0)}</span><span class="muted">${fmt(q.n)}×</span><b class="gold">${money(q.net)}</b></div>`; }).join('') || `<div class="muted">—</div>`}</div></div>
 <div class="grid g2" style="margin-top:1rem"><div class="card"><h3>${icon('garage')} ${L2('أسطولك', 'Your fleet')}</h3>${VEHS.filter(v => GV(v.id).owned).map(v => { const g = GV(v.id), avg = (g.cond.body + g.cond.engine + g.cond.susp + g.cond.tyres + g.cond.brakes) / 5; return `<div class="set"><img src="${ASSETS[v.spr]}" style="height:1.8rem"><label style="width:auto;flex:1">${nm(v.name)}</label><span class="muted">${fmt(g.odo, 1)} ${t('km')}</span><div style="width:5rem">${bar(avg)}</div></div>`; }).join('')}</div>
 <div class="card"><h3>${icon('trophy')} ${t('badges')}</h3><div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b.k] ? '' : 'lock'}">${icon(b.ic)}<div>${nm(b.n)}</div></div>`).join('')}</div></div></div>`;
 $('#nmIn').onchange = e => { S.name = e.target.value.trim().slice(0, 18); save(); renderTop(); };
 $('#avPick').onclick = () => { $('#avGrid').hidden = !$('#avGrid').hidden; };
 $$('[data-av]').forEach(b => b.onclick = () => { S.avatar = {t:'ped', i:+b.dataset.av}; save(); renderProfile(); renderTop(); });
 $('#avUp').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'), s = 180 / Math.max(im.width, im.height); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); S.avatar = {t:'img', d:c.toDataURL('image/jpeg', .82)}; save(); renderProfile(); renderTop(); }; im.src = r.result; }; r.readAsDataURL(f); };
}
const _renderTop = renderTop;
renderTop = function(){ _renderTop(); const pr = $('#prof'); if (pr && !pr.querySelector('.av')) pr.insertAdjacentHTML('afterbegin', avatarHTML('tiny')); else if (pr) pr.querySelector('.av').outerHTML = avatarHTML('tiny'); };
/* ================= settings (expanded) ================= */
function renderSettings(){
 const sl = (k, ic, n) => `<div class="set"><label>${icon(ic)} ${n}</label><input type="range" min="0" max="1" step=".05" value="${S.set[k] ?? SETD[k]}" data-sl="${k}"><b style="width:3rem">${fmt(Math.round((S.set[k] ?? SETD[k]) * 100))}%</b></div>`;
 const opt = (k, ic, n, vals) => `<div class="set"><label>${icon(ic)} ${n}</label><span class="sp"></span>${vals.map(([v, l]) => `<button class="btn sm ${setv(k) === v ? '' : 'sec'}" data-opt="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
 const tog = (k, ic, n) => `<div class="set"><label>${icon(ic)} ${n}</label><span class="sp"></span><button class="tog ${setv(k) ? 'on' : ''}" data-tog="${k}"></button></div>`;
 $('#s-settings').innerHTML = `<div class="head"><h1>${t('settings')}</h1><p>${L2('خصص تجربتك على الطريق', 'Tune your experience on the road')}</p></div><div class="grid g2">
 <div class="card"><h3>${icon('music')} ${L2('الصوت', 'Audio')}</h3>${sl('music', 'music', t('music'))}${sl('sfx', 'horn', t('sfx'))}${sl('eng', 'engine', t('engVol'))}${sl('radio', 'radio', t('radioVol'))}${sl('amb', 'weather', L2('أصوات الشارع', 'Street ambience'))}</div>
 <div class="card"><h3>${icon('camera')} ${L2('الشاشة والرسومات', 'Display & graphics')}</h3>${opt('gfx', 'camera', t('gfx'), [['high', t('high')], ['low', t('lowq')]])}${opt('hud', 'settings', L2('حجم الأزرار', 'Button size'), [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']])}${opt('zoom', 'map', L2('الكاميرا', 'Camera'), [['c', L2('قريبة', 'Close')], ['n', L2('عادية', 'Normal')], ['f', L2('بعيدة', 'Far')]])}${tog('shake', 'crash', L2('اهتزاز الكاميرا', 'Camera shake'))}${tog('bubbles', 'seat', L2('كلام الركاب', 'Passenger speech'))}${tog('hints', 'save', L2('اختصارات الكيبورد', 'Keyboard hints'))}</div>
 <div class="card"><h3>${icon('traffic')} ${L2('اللعب', 'Gameplay')}</h3>${opt('traffic', 'traffic', L2('كثافة المرور', 'Traffic density'), [['l', t('low')], ['n', t('med')], ['h', t('high')]])}${tog('autoLights', 'lights', L2('نور أوتوماتيك بالليل', 'Automatic headlights'))}${tog('swap', 'repair', L2('بدّل البنزين والفرامل', 'Swap pedals (left-hand)'))}${tog('vib', 'battery', L2('اهتزاز الموبايل', 'Vibration'))}</div>
 <div class="card"><h3>${icon('globe')} ${t('lang')}</h3><div class="set"><span class="sp"></span><button class="btn sm ${LANG === 'ar' ? '' : 'sec'}" data-lang="ar">العربية</button><button class="btn sm ${LANG === 'en' ? '' : 'sec'}" data-lang="en">English</button></div>
  <div class="set"><label>${icon('save')} ${t('help')}</label><span class="sp"></span><button class="btn sm sec" id="stHelp">?</button></div><div class="mbtns"><button class="btn red" id="stReset">${t('reset')}</button></div><p class="muted" style="text-align:center">OGRAAA · ${t('credit')}</p></div></div>`;
 $$('[data-sl]').forEach(r => r.oninput = () => { S.set[r.dataset.sl] = +r.value; r.nextElementSibling.textContent = fmt(Math.round(r.value * 100)) + '%'; AU.apply(); MUSIC.vol(); RADIO.vol(); applySettings(); save(); });
 $$('[data-opt]').forEach(b => b.onclick = () => { S.set[b.dataset.opt] = b.dataset.v; save(); if (b.dataset.opt === 'gfx') resize(); applySettings(); renderSettings(); });
 $$('[data-tog]').forEach(b => b.onclick = () => { S.set[b.dataset.tog] = !setv(b.dataset.tog); save(); applySettings(); renderSettings(); });
 $$('[data-lang]').forEach(b => b.onclick = () => { LANG = S.lang = b.dataset.lang; save(); applyLang(); });
 $('#stHelp').onclick = () => $('#helpM').classList.add('on'); $('#stReset').onclick = () => confirmUI(t('resetQ'), () => { localStorage.removeItem(SAVE_KEY); S = DEF(); ensureLicences(); save(true); applyLang(); show('home'); });
}
/* ---------------- boot hooks ---------------- */
const _cleanImages = cleanImages;
cleanImages = function(){ _cleanImages(); centreWheels(); ensureLicences(); for (const k in AIWHEELS) delete AIWHEELS[k]; };
const _ensureDaily = ensureDaily;
