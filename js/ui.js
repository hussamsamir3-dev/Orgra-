"use strict";
/* ================= toasts & helpers ================= */
function toastUI(msg, cls, acts, life){
 const box = $('#toasts'); if (box.children.length > 3) box.firstChild.remove();
 const d = document.createElement('div'); d.className = 'toast ' + (cls || ''); d.textContent = msg;
 (acts || []).forEach(([l, fn]) => { const b = document.createElement('button'); b.textContent = l; b.onclick = () => { fn(); d.remove(); }; d.appendChild(b); });
 box.appendChild(d); setTimeout(() => d.remove(), (life || 3.2) * 1000);
}
function confirmUI(msg, yes){ $('#cfT').textContent = msg; $('#confirmM').classList.add('on'); $('#cfYes').onclick = () => { $('#confirmM').classList.remove('on'); yes(); }; $('#cfNo').onclick = () => $('#confirmM').classList.remove('on'); }
const pct = v => Math.round(clamp(v, 0, 100));
const barCls = v => v > 66 ? 'good' : v > 33 ? 'warn' : 'bad';
const bar = (v, cls) => `<div class="bar ${cls || barCls(v)}"><i style="width:${pct(v)}%"></i></div>`;
const playerName = () => S.name || (LANG === 'ar' ? 'أسطى' : 'Driver');
const TITLES = [[1,['سائق مبتدئ','Rookie driver']],[3,['أسطى','Driver']],[5,['أسطى قديم','Veteran driver']],[8,['ملك الخطوط','King of the lines']],[12,['أسطورة الطريق','Road legend']]];
const titleOf = l => nm(TITLES.filter(x => l >= x[0]).pop()[1]);
/* ================= top bar & navigation ================= */
const NAV = [['home','i_play'],['routes','i_map'],['garage','i_garage'],['showroom','i_showroom'],['traffic','i_police'],['profile','i_trophy'],['settings','i_settings']];
let SCR = 'home';
function renderTop(){
 const L = lvlOf(S.xp); $('#coins').innerHTML = icon('coins') + ' ' + fmt(Math.floor(S.money)); $('#pName').textContent = playerName(); $('#pXp').textContent = `${t('lvl')} ${fmt(L.l)} · XP ${fmt(L.into)}/${fmt(L.need)}`;
 $('#pLvl').textContent = fmt(L.l); $('#pRing').style.setProperty('--p', Math.round(L.into / L.need * 100)); $('#langBtn').textContent = LANG === 'ar' ? 'English 🌐' : 'العربية 🌐';
}
function show(id){ SCR = id; $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-' + id)); $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.go === id)); ({home:renderHome, routes:renderRoutes, garage:renderGarage, showroom:renderShowroom, traffic:renderTraffic, profile:renderProfile, settings:renderSettings})[id](); $('#main').scrollTop = 0; }
function applyLang(){
 document.documentElement.lang = LANG; document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
 $$('[data-t]').forEach(e => e.textContent = t(e.dataset.t));
 $('#side').innerHTML = NAV.map(([k, ic]) => `<button class="nav" data-go="${k}"><img class="ic" src="${ASSETS[ic]}">${t(k)}</button>`).join('');
 $$('[data-go]').forEach(b => b.onclick = () => { AU.click(); show(b.dataset.go); });
 $('#setBtn').innerHTML = icon('settings'); renderTop(); if (!$('#menu').classList.contains('off')) show(SCR);
}
/* ================= vehicle preview (garage / showroom / home) ================= */
const PREV = {};
function drawPreview(canvas, vid, cosOver){
 const c = canvas, w = c.clientWidth, h = c.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); c.width = w * d; c.height = h * d; const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
 const V = VBY(vid), gv = GV(vid), cos = cosOver || gv.cos, own = gv.owned; const key = vid + JSON.stringify(cos) + JSON.stringify(own ? gv.cond : 0) + (own ? gv.dents.length : 0);
 if (!PREV[vid] || PREV[vid].key !== key) PREV[vid] = {key, cv:buildPlayerCanvas(vid, cos, own ? gv.cond : {clean:100}, own ? gv.dents : [])};
 const b = PREV[vid].cv, M = META[V.spr]; const s = Math.min(w * .86 / b.width, h * .7 / b.height) * (.55 + .45 * V.len / 11.8) / (.55 + .45 * 11.8 / 11.8) ; const k = Math.min(w * .86 / b.width, h * .72 / b.height) * clamp(.62 + V.len / 30, .75, 1);
 const bw = b.width * k, bh = b.height * k, ox = (w - bw) / 2, oy = h * .86 - bh;
 const gl = COS.glow.find(g => g.id === cos.glow); if (gl && gl.c){ const g = x.createRadialGradient(w / 2, h * .86, 0, w / 2, h * .86, bw * .6); g.addColorStop(0, gl.c + 'dd'); g.addColorStop(1, gl.c + '00'); x.fillStyle = g; x.fillRect(0, h * .6, w, h * .4); }
 x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.ellipse(w / 2, h * .86 + 2, bw * .48, bh * .06, 0, 0, 7); x.fill();
 const rim = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh, t0 = performance.now() / 1000;
 if (!V.baked) for (const [cx, cy, r] of M.wheels){ x.save(); x.translate(ox + cx * k, oy + cy * k); x.rotate(t0 * 1.5); const R = r * k * 1.04; x.drawImage(IMG['wh' + rim], -R, -R, R * 2, R * 2); x.restore(); }
 x.drawImage(b, ox, oy, bw, bh);
 if (cos.rack && V.rack){ x.fillStyle = '#2b2b2b'; x.fillRect(ox + bw * .2, oy - bh * .04, bw * .6, bh * .025); }
}
let prevLoop = null;
function animPreview(canvas, vid, cosOver){ cancelAnimationFrame(prevLoop); const f = () => { if (!document.body.contains(canvas) || $('#menu').classList.contains('off')) return; drawPreview(canvas, vid, cosOver); prevLoop = requestAnimationFrame(f); }; f(); }
/* ================= missions, streak, badges ================= */
const MISSION_POOL = [ {k:'pax', n:[20,40,70], r:[300,550,900], ic:'seat', l:['وصّل {n} راكب','Deliver {n} passengers']}, {k:'trips', n:[2,3,5], r:[250,450,800], ic:'map', l:['كمّل {n} مشاوير','Complete {n} trips']}, {k:'earn', n:[500,1500,4000], r:[200,400,800], ic:'cash', l:['اكسب {n} ج.م','Earn {n} EGP']}, {k:'stars3', n:[1,2,3], r:[300,500,800], ic:'trophy', l:['خد ٣ نجوم في {n} مشوار','Get 3 stars on {n} trips']}, {k:'clean', n:[1,2,3], r:[250,450,700], ic:'police', l:['{n} رحلة من غير مخالفات','{n} trips with no fines']}, {k:'km', n:[15,40,100], r:[250,500,900], ic:'stats', l:['اقطع {n} كم','Drive {n} km']} ];
function ensureDaily(){ const dk = dayKey(); if (S.daily && S.daily.day === dk) return; const lv = Math.min(2, Math.floor((lvlOf(S.xp).l - 1) / 3)); const pool = [...MISSION_POOL].sort(() => Math.random() - .5).slice(0, 3); S.daily = {day:dk, missions:pool.map(m => ({k:m.k, n:m.n[lv], r:m.r[lv], prog:0, claimed:false}))}; save(); }
function missionProgress(d){ ensureDaily(); S.daily.missions.forEach(m => { m.prog = Math.min(m.n, m.prog + (d[m.k] || 0)); }); }
const giftAmt = s => 150 * Math.min(s, 7) + (s % 7 === 0 ? 1000 : 0);
function giftReady(){ return S.streak.last !== dayKey(); }
function claimGift(){ if (!giftReady()) return; const y = dayKey(new Date(Date.now() - DAY)); S.streak.n = S.streak.last === y ? S.streak.n + 1 : 1; S.streak.last = dayKey(); ledger(giftAmt(S.streak.n), t('dailyGift'), 'calendar'); AU.levelUp(); toastUI('🎁 +' + money(giftAmt(S.streak.n)), 'good'); renderHome(); }
const BADGES = [
 {k:'first', ic:'play', n:['أول مشوار','First trip'], ok:() => S.stats.trips >= 1}, {k:'pax100', ic:'seat', n:['١٠٠ راكب','100 passengers'], ok:() => S.stats.pax >= 100}, {k:'pax1k', ic:'seat', n:['١٠٠٠ راكب','1,000 passengers'], ok:() => S.stats.pax >= 1000},
 {k:'km100', ic:'map', n:['١٠٠ كم','100 km'], ok:() => S.stats.km >= 100}, {k:'km1k', ic:'map', n:['١٠٠٠ كم','1,000 km'], ok:() => S.stats.km >= 1000}, {k:'bus', ic:'terminal', n:['صاحب أتوبيس','Bus owner'], ok:() => ['redbus','mcv'].some(v => GV(v).owned)},
 {k:'coach', ic:'terminal', n:['صاحب سفر','Coach owner'], ok:() => ['coachB','coachO'].some(v => GV(v).owned)}, {k:'rich', ic:'coins', n:['مليونير الخطوط','Line tycoon (100k)'], ok:() => S.money >= 100000}, {k:'style', ic:'paint', n:['أسطى شيك','Stylish (10 cosmetics)'], ok:() => Object.keys(S.inv).length >= 10},
 {k:'stars', ic:'trophy', n:['نجوم الخطوط','3★ on 5 lines'], ok:() => Object.values(S.best).filter(v => v >= 3).length >= 5}, {k:'lvl10', ic:'upgrade', n:['مستوى ١٠','Level 10'], ok:() => lvlOf(S.xp).l >= 10}, {k:'clean', ic:'police', n:['رخصة نضيفة','Clean licence'], ok:() => S.stats.trips >= 10 && S.lic.points === 0}
];
function checkBadges(){ for (const b of BADGES) if (!S.badges[b.k] && b.ok()){ S.badges[b.k] = Date.now(); setTimeout(() => toastUI('🏅 ' + nm(b.n), 'gold'), 1600); } }
/* ================= HOME ================= */
function renderHome(){
 ensureDaily(); const el = $('#s-home'), keys = Array.from({length:7}, (_, i) => dayKey(new Date(Date.now() - (6 - i) * DAY)));
 const mx = Math.max(100, ...keys.map(k => Math.max((S.days[k] || {}).e || 0, (S.days[k] || {}).s || 0)));
 const dn = LANG === 'ar' ? ['ح','ن','ث','ر','خ','ج','س'] : ['Su','Mo','Tu','We','Th','Fr','Sa'];
 const m = S.daily.missions.map(q => { const P = MISSION_POOL.find(p => p.k === q.k); return `<div class="task"><div class="row">${icon(P.ic)}<span>${nm(P.l).replace('{n}', fmt(q.n))}</span><span class="sp"></span>${q.claimed ? `<span class="good">✓ ${t('claimed')}</span>` : q.prog >= q.n ? `<button class="btn sm" data-claim="${q.k}">${t('claim')} +${fmt(q.r)}</button>` : `<span class="muted">${fmt(Math.floor(q.prog))}/${fmt(q.n)}</span>`}</div>${bar(q.prog / q.n * 100, 'gold')}</div>`; }).join('');
 el.innerHTML = `<div class="hero"><div style="position:relative;z-index:1;max-width:55%"><p class="gold" style="margin:0">${t('welcome')} ${playerName()}</p><h2 class="disp">${t('tag')}</h2><button class="btn big" id="hGo">${icon('play')} ${t('play')}</button></div><canvas id="hCv"></canvas></div>
 ${!S.gift ? `<div class="card" style="margin-top:1rem;border-color:var(--gold)"><div class="row">${icon('cash')}<b>${t('tut')}</b><span class="sp"></span><button class="btn" id="hGift">+${money(1000)}</button></div></div>` : ''}
 <div class="grid g2" style="margin-top:1rem">
  <div class="card wallet"><img src="${ASSETS.i_coins}"><div><div class="muted">${t('balance')}</div><div class="amt">${fmt(Math.floor(S.money))}</div><div>${t('egp')}</div></div><span class="sp"></span><div style="text-align:center"><div class="muted">${t('dailyGift')} · ${fmt(S.streak.n)} ${t('streak')}</div><button class="btn sm" id="hDaily" ${giftReady() ? '' : 'disabled'}>🎁 ${giftReady() ? '+' + fmt(giftAmt(S.streak.last === dayKey(new Date(Date.now() - DAY)) ? S.streak.n + 1 : 1)) : t('claimed')}</button></div></div>
  <div class="card"><h3>${icon('stats')} ${t('week')}</h3><div class="chart">${keys.map(k => { const d = S.days[k] || {e:0, s:0}; return `<div><i style="height:${d.e / mx * 100}%;background:var(--gold)"></i><i style="height:${d.s / mx * 100}%;background:#29c6e8"></i><span>${dn[new Date(Date.now() - (6 - keys.indexOf(k)) * DAY).getDay()]}</span></div>`; }).join('')}</div><div class="row muted" style="margin-top:1.4rem;font-size:.75rem"><i style="width:.7rem;height:.7rem;background:var(--gold);border-radius:50%"></i>${t('earn')} <i style="width:.7rem;height:.7rem;background:#29c6e8;border-radius:50%"></i>${t('spend')}</div></div>
 </div>
 <div class="grid g2" style="margin-top:1rem"><div class="card"><h3>${icon('calendar')} ${t('daily')}</h3>${m}</div>
 <div class="card"><h3>${icon('cash')} ${t('tx')}</h3><div class="txl">${S.tx.length ? S.tx.slice(0, 14).map(x => `<div class="txi">${icon(x.i)}<div><div>${x.l}</div><div class="muted" style="font-size:.7rem">${new Date(x.t).toLocaleString(LANG === 'ar' ? 'ar-EG' : 'en-GB', {hour:'2-digit', minute:'2-digit', day:'numeric', month:'short'})}</div></div><b class="${x.a >= 0 ? 'good' : 'badc'}">${x.a >= 0 ? '+' : '−'}${fmt(Math.abs(Math.round(x.a)))}</b></div>`).join('') : `<div class="muted">—</div>`}</div></div></div>`;
 $('#hGo').onclick = () => show('routes'); const hg = $('#hGift'); if (hg) hg.onclick = () => { S.gift = true; ledger(1000, t('welcome'), 'cash'); AU.levelUp(); renderHome(); };
 $('#hDaily').onclick = claimGift; $$('[data-claim]').forEach(b => b.onclick = () => { const q = S.daily.missions.find(x => x.k === b.dataset.claim); q.claimed = true; ledger(q.r, t('daily'), 'calendar'); AU.levelUp(); renderHome(); });
 animPreview($('#hCv'), S.sel);
}
/* ================= ROUTES ================= */
let RT = 'micro', RSEL = 'm1', RVEH = null, PARCELS = {};
function genParcels(r){ const out = [], n = r.stops.length, coach = r.type === 'coach'; for (let i = 0; i < 4; i++){ const dest = coach ? n - 1 : 1 + ((Math.random() * (n - 1)) | 0); const kg = Math.round(coach ? rnd(20, 220) : rnd(4, 45)); const fr = Math.random() < .3; out.push({id:i, dest, kg, fragile:fr, pay:Math.round((coach ? kg * 2.2 + 80 : kg * 1.3 + 15 + dest * 6) * (fr ? 1.4 : 1)), on:false}); } return out; }
function renderRoutes(){
 const L = lvlOf(S.xp).l, list = ROUTES.filter(r => r.type === RT); if (!list.find(r => r.id === RSEL)) RSEL = list[0].id; const r = ROUTES.find(x => x.id === RSEL);
 const owned = CLS_OK[r.type].filter(v => GV(v).owned); if (!owned.includes(RVEH)) RVEH = owned.includes(S.sel) ? S.sel : owned[0];
 if (!PARCELS[r.id]) PARCELS[r.id] = genParcels(r); const P = PARCELS[r.id]; const V = RVEH && VBY(RVEH); const cap = V ? V.store * (1 + .2 * upl(RVEH, 'store')) + (GV(RVEH).cos.rack && V.rack ? 150 : 0) : 0; const used = P.filter(p => p.on).reduce((a, p) => a + p.kg, 0);
 const pts = [...r.stops.map((s, i) => ({n:s, f:i / (r.stops.length - 1)})), ...(r.rests || []).map((s, i, a) => ({n:s, f:(i + 1) / (a.length + 1), rest:1}))].sort((a, b) => a.f - b.f);
 const lock = L < r.lvl, bs = S.best[r.id] || 0, mins = Math.round(r.km / (r.type === 'coach' ? 85 : 22) * 60);
 const bio = BIOME[r.biome];
 $('#s-routes').innerHTML = `<div class="head"><h1>${t('routes')}</h1><p>${LANG === 'ar' ? 'اختار وجهتك في مصر' : 'Choose your destination in Egypt'}</p></div>
 <div class="tabs">${['micro','bus','coach'].map(k => `<button class="tab ${RT === k ? 'on' : ''}" data-rt="${k}">${icon(k === 'micro' ? 'seat' : k === 'bus' ? 'stop' : 'terminal')} ${t(k)}</button>`).join('')}</div>
 <div class="grid g2" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.3fr)"><div class="card"><div class="rlist">${list.map(x => `<button class="ritem ${x.id === RSEL ? 'on' : ''} ${L < x.lvl ? 'lock' : ''}" data-r="${x.id}">${icon(L < x.lvl ? 'barrier' : 'map')}<div><b>${nm(x.from)} ← ${nm(x.to)}</b><span class="muted">${fmt(x.km)} ${t('km')} · ${fmt(x.fare, x.fare % 1 ? 1 : 0)} ${t('egp')}${x.est ? ' (' + t('est') + ')' : ''}</span></div><span class="sp"></span>${L < x.lvl ? `<span class="muted">🔒 ${fmt(x.lvl)}</span>` : `<span class="stars">${'★'.repeat(S.best[x.id] || 0)}${'☆'.repeat(3 - (S.best[x.id] || 0))}</span>`}</button>`).join('')}</div></div>
 <div class="card"><div class="row"><h3 style="margin:0">${nm(r.from)} ← ${nm(r.to)}</h3><span class="sp"></span><span class="pill gold">${fmt(r.km)} ${t('km')}</span></div>
  <div class="schem"><div class="ln"></div>${pts.map(p => `<div class="pt" style="left:${4 + p.f * 92}%"><i style="${p.rest ? 'border-color:#2fd07a' : ''}"></i>${nm(p.n)}</div>`).join('')}</div>
  <div class="facts"><div class="fact">${icon('ticket')}<span class="muted">${t('fare')}</span><b>${fmt(r.fare, r.fare % 1 ? 1 : 0)}</b></div><div class="fact">${icon('stop')}<span class="muted">${t('stops')}</span><b>${fmt(r.stops.length)}</b></div><div class="fact">${icon('daynight')}<span class="muted">${t('estTime')}</span><b>${fmt(mins)} ${t('min')}</b></div><div class="fact">${icon('traffic')}<span class="muted">${t('trafficLvl')}</span><b>${t(bio.urban > .6 ? 'high' : bio.urban > .2 ? 'med' : 'low')}</b></div></div>
  <div class="muted" style="margin:.4rem 0 .3rem">${t('vehicle')} · ${t('r_fee')}: ${money(TERMINAL_FEE[r.type])}</div>
  ${owned.length ? `<div class="vpick">${owned.map(v => { const g = GV(v); return `<button class="vchip ${v === RVEH ? 'on' : ''}" data-v="${v}"><img src="${ASSETS[VBY(v).spr]}">${nm(VBY(v).name)} <span class="muted">⛽${Math.round(g.fuel / VBY(v).tank * 100)}%</span></button>`; }).join('')}</div>` : `<div class="status no">${icon('showroom')} ${t('noVeh')}</div>`}
  ${V ? `<h3 style="margin-top:.8rem">${icon('terminal')} ${t('cargo')} <span class="muted">(${fmt(used)}/${fmt(Math.round(cap))} ${t('kg')})</span></h3>${P.map(p => `<div class="parcel">📦 <span>${fmt(p.kg)} ${t('kg')} ${p.fragile ? '· <span class="badc">' + t('fragile') + '</span>' : ''} · ${t('to')} ${nm(r.stops[p.dest])}</span><span class="sp"></span><b class="gold">+${fmt(p.pay)}</b><button class="btn sm ${p.on ? 'sec' : ''}" data-p="${p.id}">${p.on ? '✓ ' + t('taken') : t('accept')}</button></div>`).join('')}` : ''}
  <div class="mbtns"><button class="btn big" id="rGo" ${lock || !owned.length ? 'disabled' : ''}>${lock ? '🔒 ' + t('locked') + ' ' + fmt(r.lvl) : icon('play') + ' ' + t('choose')}</button>${!owned.length ? `<button class="btn sec" data-go2="showroom">${t('showroom')}</button>` : ''}</div>
 </div></div>`;
 $$('[data-rt]').forEach(b => b.onclick = () => { RT = b.dataset.rt; renderRoutes(); }); $$('[data-r]').forEach(b => b.onclick = () => { RSEL = b.dataset.r; renderRoutes(); }); $$('[data-v]').forEach(b => b.onclick = () => { RVEH = b.dataset.v; renderRoutes(); });
 $$('[data-p]').forEach(b => b.onclick = () => { const p = P.find(q => q.id == b.dataset.p); if (!p.on && used + p.kg > cap){ toastUI(t('cap') + ' ' + fmt(Math.round(cap)) + ' ' + t('kg'), 'bad'); return; } p.on = !p.on; renderRoutes(); });
 $$('[data-go2]').forEach(b => b.onclick = () => show(b.dataset.go2));
 const go = $('#rGo'); if (go) go.onclick = () => { if (GV(RVEH).fuel < 1){ toastUI(t('fuelEnd') + ' — ' + t('garage'), 'bad'); return; } S.sel = RVEH; save(); play(r, {vid:RVEH, parcels:P.filter(p => p.on)}); delete PARCELS[r.id]; };
}
/* ================= GARAGE ================= */
let GT = 'appearance', GCAT = 'paint', GV_ID = null, GPREV = null;
function repairCost(V, k, g){ const c = g.cond[k], miss = 100 - c; const u = 8 + V.mass * .004;
 return k === 'fuel' ? Math.ceil((V.tank * (1 + .2 * (g.up.tank || 0)) - g.fuel) * DIESEL * 1.05) : k === 'oil' ? (c >= 99 ? 0 : Math.round(250 + V.mass * .03)) : k === 'clean' ? (c >= 99 ? 0 : Math.round(40 + V.mass * .005)) : Math.round(miss * u * ({body:1, engine:1.6, susp:.8, tyres:.7, brakes:.35})[k]); }
function renderGarage(){
 const owned = VEHS.filter(v => GV(v.id).owned); if (!GV_ID || !GV(GV_ID).owned) GV_ID = GV(S.sel).owned ? S.sel : owned[0].id; const V = VBY(GV_ID), g = GV(GV_ID);
 const cats = Object.keys(COS).filter(c => c !== 'rim' || !V.baked); if (GCAT === 'rim' && V.baked) GCAT = 'paint'; if (GPREV && (GPREV.v !== GV_ID || GPREV.cat !== GCAT)) GPREV = null;
 let body = '';
 if (GT === 'appearance'){
  const L = COS[GCAT]; body = `<div class="cat">${cats.map(c => `<button class="${c === GCAT ? 'on' : ''}" data-cat="${c}">${t(c === 'rim' ? 'rims' : c)}</button>`).join('')}</div><div class="items">${L.map(it => { const id = GV_ID + ':' + GCAT + ':' + it.id, have = !it.p || S.inv[id], on = g.cos[GCAT] === it.id, pr = Math.round(it.p * (V.cls === 'coach' ? 2.2 : V.cls === 'bus' ? 1.6 : 1));
   const vis = GCAT === 'paint' ? `<div class="sw" style="background:${it.c ? `rgb(${it.c})` : 'conic-gradient(#fff,#ccc,#fff)'}"></div>` : GCAT === 'rim' ? `<img class="wh" src="${ASSETS['wh' + it.wh]}">` : GCAT === 'glow' ? `<div class="sw" style="background:${it.c || '#222'};box-shadow:0 0 1rem ${it.c || 'transparent'}"></div>` : GCAT === 'lights' ? `<div class="sw" style="background:rgb(${it.c});box-shadow:0 0 1rem rgb(${it.c})"></div>` : icon(COS_ICON[GCAT]);
   const pv = GPREV && GPREV.id === it.id; return `<button class="item ${on ? 'on' : ''} ${pv ? 'prev' : ''}" data-it="${it.id}" data-pr="${have ? 0 : pr}">${vis}<span>${nm(it.n)}</span><small>${on ? t('equipped') : have ? t('equip') : pv ? '👁 ' + money(pr) : money(pr)}</small></button>`; }).join('')}</div>${GPREV ? `<div class="pbar"><span>👁 ${LANG === 'ar' ? 'معاينة' : 'Previewing'}: <b>${nm(COS[GCAT].find(q => q.id === GPREV.id).n)}</b></span><span class="sp"></span><button class="btn" id="pBuy">${icon('cash')} ${t('buy')} · ${money(GPREV.pr)}</button><button class="btn sec" id="pCancel">✕</button></div>` : ''}`;
 } else if (GT === 'performance'){
  body = `<div class="items">${UPS.map(k => { const l = g.up[k] || 0, c = upCost(V, k, l); return `<div class="item">${icon(UP_ICON[k])}<b>${t('up_' + k)}</b><div class="bar gold" style="width:100%"><i style="width:${l * 20}%"></i></div><span class="muted">${fmt(l)}/٥</span>${l < 5 ? `<button class="btn sm" data-up="${k}">${money(c)}</button>` : `<small>MAX</small>`}</div>`; }).join('')}</div>`;
 } else if (GT === 'maintenance'){
  const ks = ['body','engine','susp','tyres','brakes','oil','clean','fuel'];
  body = ks.map(k => { const v = k === 'fuel' ? g.fuel / (V.tank * (1 + .2 * (g.up.tank || 0))) * 100 : g.cond[k], c = repairCost(V, k, g); return `<div class="set"><label>${icon({body:'crash', engine:'engine', susp:'repair', tyres:'tyre', brakes:'crash', oil:'battery', clean:'wash', fuel:'fuel'}[k])}${t('c_' + k)}</label><div class="sp">${bar(v)}</div><span style="width:3rem">${fmt(pct(v))}%</span><button class="btn sm" data-fix="${k}" ${c <= 0 ? 'disabled' : ''}>${t('fix_' + k)} · ${money(c)}</button></div>`; }).join('') + `<div class="mbtns"><button class="btn" id="fixAll">${icon('repair')} ${t('repair')} ✱</button></div>`;
 } else {
  const cap = V.store * (1 + .2 * (g.up.store || 0)) + (g.cos.rack && V.rack ? 150 : 0);
  body = `<div class="set"><label>${icon('terminal')} ${t('cap')}</label><b class="gold">${fmt(Math.round(cap))} ${t('kg')}</b></div>${V.rack ? `<div class="set"><label>${icon('garage')} ${LANG === 'ar' ? 'شبكة سقف (+١٥٠ كجم)' : 'Roof rack (+150 kg)'}</label><span class="sp"></span>${S.inv[GV_ID + ':rack'] ? `<button class="btn sm ${g.cos.rack ? '' : 'sec'}" id="rackT">${g.cos.rack ? t('equipped') : t('equip')}</button>` : `<button class="btn sm" id="rackB">${money(900)}</button>`}</div>` : ''}<p class="muted">${LANG === 'ar' ? 'الطرود بتزود وزن المركبة وبتأثر على الفيزياء. الحاجات القابلة للكسر بتتكسر من المطبات والنطات.' : 'Parcels add real weight that changes the handling. Fragile items can break on hard landings and bumps.'}</p>`;
 }
 const st = [[t('speed'), V.vmax * (1 + .045 * (g.up.gear || 0)) / 36], [t('accel'), V.acc * (1 + .1 * (g.up.engine || 0)) / 4.5], [t('grip'), (1 + .07 * (g.up.tires || 0)) / 1.4], [t('brakesS'), V.brk * (1 + .1 * (g.up.brakes || 0)) / 11]];
 $('#s-garage').innerHTML = `<div class="head"><h1>${t('garage')}</h1><p>${LANG === 'ar' ? 'طوّر مركبتك .. لطريق أطول' : 'Upgrade your ride for the long road'}</p></div>
 <div class="vpick" style="margin-bottom:.7rem">${owned.map(v => `<button class="vchip ${v.id === GV_ID ? 'on' : ''}" data-gv="${v.id}"><img src="${ASSETS[v.spr]}">${nm(v.name)}${S.sel === v.id ? ' ★' : ''}</button>`).join('')}</div>
 <div class="grid g2" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)"><div class="stage"><canvas id="gCv"></canvas><div class="lbl">${nm(V.name)}</div></div>
 <div class="card"><h3>${icon('stats')} ${LANG === 'ar' ? 'مواصفات المركبة' : 'Vehicle specs'}</h3><div class="spec">${st.map(([n, v]) => `<div><span>${n}<b>${fmt(Math.round(v * 100))}</b></span>${bar(v * 100, 'gold')}</div>`).join('')}</div>
 <div class="spec" style="margin-top:.8rem"><div>${t('seats')}: <b>${fmt(V.seats)}${V.stand ? ' + ' + fmt(V.stand) + ' ' + t('stand') : ''}</b></div><div>${t('cons')}: <b>${fmt(V.lp100)} ${t('L100')}</b></div><div>${t('tank')}: <b>${fmt(Math.round(V.tank * (1 + .2 * (g.up.tank || 0))))} L</b></div><div>ODO: <b>${fmt(g.odo, 1)} ${t('km')}</b></div></div>
 <div class="mbtns"><button class="btn ${S.sel === GV_ID ? 'sec' : ''}" id="gSel">${S.sel === GV_ID ? t('selected') : t('sel')}</button></div></div></div>
 <div class="tabs" style="margin-top:1rem">${[['appearance','paint'],['performance','upgrade'],['maintenance','repair'],['storage','terminal']].map(([k, ic]) => `<button class="tab ${GT === k ? 'on' : ''}" data-gt="${k}">${icon(ic)} ${t(k)}</button>`).join('')}</div><div class="card">${body}</div>`;
 animPreview($('#gCv'), GV_ID, GPREV ? Object.assign({}, g.cos, {[GPREV.cat]:GPREV.id}) : null);
 $$('[data-gv]').forEach(b => b.onclick = () => { GV_ID = b.dataset.gv; renderGarage(); }); $$('[data-gt]').forEach(b => b.onclick = () => { GT = b.dataset.gt; GPREV = null; renderGarage(); }); $$('[data-cat]').forEach(b => b.onclick = () => { GCAT = b.dataset.cat; GPREV = null; renderGarage(); });
 $('#gSel').onclick = () => { S.sel = GV_ID; save(); renderGarage(); };
 $$('[data-it]').forEach(b => b.onclick = () => { const id = b.dataset.it, pr = +b.dataset.pr; if (GCAT === 'horn'){ AU.init(); AU.horn(id, V.cls !== 'micro'); } if (pr > 0){ GPREV = {v:GV_ID, cat:GCAT, id, pr}; renderGarage(); return; } GPREV = null; g.cos[GCAT] = id; save(); renderGarage(); });
 const pb = $('#pBuy'); if (pb) pb.onclick = () => { const it = COS[GCAT].find(x => x.id === GPREV.id); if (!spend(GPREV.pr, nm(V.name) + ' · ' + nm(it.n), COS_ICON[GCAT])) return; S.inv[GV_ID + ':' + GCAT + ':' + GPREV.id] = 1; g.cos[GCAT] = GPREV.id; GPREV = null; toastUI(t('bought'), 'good'); checkBadges(); save(); renderGarage(); }; const pc = $('#pCancel'); if (pc) pc.onclick = () => { GPREV = null; renderGarage(); };
 $$('[data-up]').forEach(b => b.onclick = () => { const k = b.dataset.up, l = g.up[k] || 0; if (!spend(upCost(V, k, l), t('up_' + k) + ' ' + (l + 1), UP_ICON[k])) return; g.up[k] = l + 1; AU.levelUp(); save(); renderGarage(); });
 const fix = k => { const c = repairCost(V, k, g); if (c <= 0) return true; if (!spend(c, t('fix_' + k), 'repair')) return false; if (k === 'fuel') g.fuel = V.tank * (1 + .2 * (g.up.tank || 0)); else g.cond[k] = 100; if (k === 'body') g.dents = []; return true; };
 $$('[data-fix]').forEach(b => b.onclick = () => { if (fix(b.dataset.fix)){ save(); renderGarage(); } });
 const fa = $('#fixAll'); if (fa) fa.onclick = () => { for (const k of ['fuel','oil','brakes','tyres','clean','susp','engine','body']) if (!fix(k)) break; save(); renderGarage(); };
 const rb = $('#rackB'); if (rb) rb.onclick = () => { if (spend(900, 'Roof rack', 'garage')){ S.inv[GV_ID + ':rack'] = 1; g.cos.rack = true; save(); renderGarage(); } };
 const rt = $('#rackT'); if (rt) rt.onclick = () => { g.cos.rack = !g.cos.rack; save(); renderGarage(); };
}
/* ================= SHOWROOM ================= */
let SR = 0;
function renderShowroom(){
 const V = VEHS[SR], g = GV(V.id), L = lvlOf(S.xp).l; const st = [[t('speed'), V.vmax / 36], [t('accel'), V.acc / 4.5], [t('seats'), (V.seats + V.stand) / 80], [t('cons'), 1 - V.lp100 / 40]];
 $('#s-showroom').innerHTML = `<div class="head"><h1>${t('showroom')}</h1><p>${LANG === 'ar' ? 'مركبتك القادمة بتستناك' : 'Your next ride is waiting'}</p></div>
 <div class="tabs">${['micro','bus','coach'].map(k => `<button class="tab ${V.cls === k ? 'on' : ''}" data-sc="${k}">${t(k)}</button>`).join('')}</div>
 <div class="carou"><button class="arr" id="srP">‹</button><div class="stage"><canvas id="sCv"></canvas><div class="lbl">${nm(V.name)}</div></div><button class="arr" id="srN">›</button></div>
 <div class="dots">${VEHS.map((_, i) => `<i class="${i === SR ? 'on' : ''}"></i>`).join('')}</div>
 <div class="card"><div class="row"><img src="${ASSETS[V.spr]}" style="height:3.4rem"><div><h3 style="margin:0">${nm(V.name)}</h3><span class="muted">${t('lvl')} ${fmt(V.lvl)} · ${fmt(V.len, 1)} m · ${fmt(V.mass)} ${t('kg')}</span></div><span class="sp"></span><span class="pill gold">${icon('coins')} ${V.price ? fmt(V.price) : '—'}</span></div>
 <div class="spec" style="margin-top:.8rem">${st.map(([n, v]) => `<div><span>${n}</span>${bar(v * 100, 'gold')}</div>`).join('')}</div>
 <div class="mbtns"><button class="btn sec" id="srTest">${icon('play')} ${t('test')}</button>${g.owned ? `<button class="btn" disabled>✓ ${t('owned')}</button>` : `<button class="btn" id="srBuy" ${L < V.lvl ? 'disabled' : ''}>${L < V.lvl ? '🔒 ' + t('locked') + ' ' + fmt(V.lvl) : icon('cash') + ' ' + t('buy') + ' · ' + money(V.price)}</button>`}</div></div>`;
 animPreview($('#sCv'), V.id, g.owned ? null : Object.assign({}, vdef(V).cos));
 $('#srP').onclick = () => { SR = (SR + VEHS.length - 1) % VEHS.length; renderShowroom(); }; $('#srN').onclick = () => { SR = (SR + 1) % VEHS.length; renderShowroom(); };
 $$('[data-sc]').forEach(b => b.onclick = () => { SR = VEHS.findIndex(v => v.cls === b.dataset.sc); renderShowroom(); });
 $('#srTest').onclick = () => play(V.cls === 'coach' ? ROUTES.find(r => r.id === 'c1') : V.cls === 'bus' ? ROUTES.find(r => r.id === 'b1') : ROUTES[2], {vid:V.id, test:true});
 const b = $('#srBuy'); if (b) b.onclick = () => confirmUI(t('buy') + ' ' + nm(V.name) + ' — ' + money(V.price) + '؟', () => { if (!spend(V.price, t('buy') + ' · ' + nm(V.name), 'showroom')) return; g.owned = true; g.fuel = V.tank * .8; S.sel = V.id; AU.levelUp(); toastUI(t('bought'), 'good'); checkBadges(); save(); renderShowroom(); });
}
/* ================= TRAFFIC DEPT ================= */
function decayPoints(){ const days = Math.floor((Date.now() - (S.lic.decay || S.lic.issued)) / DAY); if (days > 0){ S.lic.points = Math.max(0, S.lic.points - days); S.lic.decay = Date.now(); save(); } }
function renderTraffic(){
 decayPoints(); const susp = S.lic.suspUntil > Date.now(), total = S.fines.reduce((a, f) => a + f.amt, 0), V = VBY(S.sel), g = GV(S.sel);
 const idn = 'EG-DR-' + String(Math.floor(hash(S.lic.issued % 9999) * 900000 + 100000)), dt = d => new Date(d).toLocaleDateString(LANG === 'ar' ? 'ar-EG' : 'en-GB');
 const inspLeft = Math.ceil((g.inspT + 14 * DAY - Date.now()) / DAY), inspFee = V.cls === 'micro' ? 150 : V.cls === 'bus' ? 250 : 400;
 const plate = (LANG === 'ar' ? 'ق ر ن ' : 'QRN ') + fmt(1000 + Math.floor(hash(VEHS.indexOf(V) + 3) * 8999));
 $('#s-traffic').innerHTML = `<div class="head"><h1>${t('traffic')}</h1><p>${LANG === 'ar' ? 'خدمة المواطن .. من أجل طريق آمن' : 'Serving citizens for safer roads'}</p></div>
 <div class="grid g2"><div class="card"><h3>${icon('ticket')} ${t('license')}</h3><div class="lic"><div class="flag"></div><h4>جمهورية مصر العربية · رخصة قيادة</h4><div class="row" style="margin-top:.8rem;align-items:flex-start"><div class="ph" style="background-image:url(${ASSETS[META.peds[0][0]]})"></div><dl><dt>${t('name')}</dt><dd>${playerName()}</dd><dt>No.</dt><dd>${idn}</dd><dt>${LANG === 'ar' ? 'الإصدار' : 'Issued'}</dt><dd>${dt(S.lic.issued)}</dd><dt>${LANG === 'ar' ? 'الانتهاء' : 'Expires'}</dt><dd>${dt(S.lic.issued + 3 * 365 * DAY)}</dd><dt>${LANG === 'ar' ? 'الفئة' : 'Class'}</dt><dd>${LANG === 'ar' ? 'مهنية (أجرة / نقل ركاب)' : 'Professional (passenger transport)'}</dd></dl></div><div class="brand">OGRAAA</div></div></div>
 <div class="card"><h3>${icon('police')} ${LANG === 'ar' ? 'حالة الرخصة' : 'Licence status'}</h3><div class="status ${susp ? 'no' : 'ok'}"><span style="font-size:2rem">${susp ? '⛔' : '✅'}</span><div><b style="font-size:1.3rem">${t(susp ? 'suspended' : 'valid')}</b><div class="muted">${susp ? (LANG === 'ar' ? 'الكماين هتغرّمك — ادفع دورة التأهيل' : 'Checkpoints will fine you — pay the rehab course') : (LANG === 'ar' ? 'يمكنك القيادة بشكل قانوني' : 'You may drive legally')}</div></div>${susp ? `<span class="sp"></span><button class="btn sm" id="rehab">${money(1500)}</button>` : ''}</div>
  <div class="set"><label>⭐ ${t('points')}</label><div class="sp">${bar(S.lic.points / 12 * 100, S.lic.points > 8 ? 'bad' : S.lic.points > 4 ? 'warn' : 'good')}</div><b>${fmt(S.lic.points)}/١٢</b></div>
  <h3 style="margin-top:1rem">${icon('crash')} ${t('fines')} <span class="sp"></span><b class="badc">${money(total)}</b></h3>${S.fines.length ? S.fines.slice(-6).reverse().map(f => `<div class="fine">🚨 <span>${t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed'}[f.k])}<div class="muted" style="font-size:.7rem">${f.where} · ${dt(f.t)}</div></span><span class="sp"></span><b>${money(f.amt)}</b></div>`).join('') + `<div class="mbtns"><button class="btn" id="payAll">${t('payAll')} · ${money(total)}</button></div>` : `<div class="muted">${t('noFines')}</div>`}</div></div>
 <div class="card" style="margin-top:1rem"><h3>${icon('traffic')} ${t('vlicense')} · ${t('inspection')}</h3><div class="row" style="flex-wrap:wrap"><img src="${ASSETS[V.spr]}" style="height:3.5rem"><div><b>${nm(V.name)}</b><div class="muted">${plate}</div></div><span class="sp"></span><div class="status ${inspLeft > 0 ? 'ok' : 'no'}" style="padding:.5rem .8rem">${inspLeft > 0 ? (LANG === 'ar' ? 'الفحص ساري: باقي ' + fmt(inspLeft) + ' يوم' : 'Inspection valid: ' + inspLeft + ' days left') : t('expired')}</div><button class="btn" id="insp">${t('doInsp')} · ${money(inspFee)}</button></div></div>`;
 const pa = $('#payAll'); if (pa) pa.onclick = () => { if (spend(total, t('fines'), 'police')){ S.fines = []; save(); renderTraffic(); } };
 const rh = $('#rehab'); if (rh) rh.onclick = () => { if (spend(1500, 'Rehab course', 'police')){ S.lic.suspUntil = 0; S.lic.points = 6; save(); renderTraffic(); } };
 $('#insp').onclick = () => { if (!spend(inspFee, t('inspection'), 'traffic')) return; const bad = ['body','engine','susp','tyres','brakes'].some(k => g.cond[k] < 40); if (bad) toastUI(t('inspFail'), 'bad'); else { g.inspT = Date.now(); toastUI(t('inspOk'), 'good'); } save(); renderTraffic(); };
}
/* ================= PROFILE ================= */
function renderProfile(){
 const L = lvlOf(S.xp), fav = VBY(S.sel);
 $('#s-profile').innerHTML = `<div class="head"><h1>${t('profile')}</h1><p>${LANG === 'ar' ? 'رحلتك .. عربيتك .. إنجازاتك' : 'Your trips, your ride, your achievements'}</p></div>
 <div class="grid g3"><div class="card" style="text-align:center"><div class="ph" style="width:6rem;height:6rem;margin:0 auto;border-radius:50%;border:3px solid var(--gold);background:#1a2c55 url(${ASSETS[META.peds[0][0]]}) center 20%/70% no-repeat"></div><input type="text" id="nmIn" maxlength="18" value="${S.name}" placeholder="${t('name')}" style="margin-top:.6rem;text-align:center"><div class="muted" style="margin-top:.4rem">${t('lvl')} ${fmt(L.l)}</div>${bar(L.into / L.need * 100, 'gold')}<div class="pill gold" style="justify-content:center;margin-top:.7rem">${titleOf(L.l)}</div><div style="margin-top:.6rem">${t('rating')}: <b class="gold">${fmt(S.stats.rating, 1)} / ٥ ★</b></div></div>
 <div class="card"><h3>${icon('stats')} ${t('stats')}</h3>${[['map', t('totalKm'), fmt(S.stats.km, 1) + ' ' + t('km')], ['ticket', t('trips'), fmt(S.stats.trips)], ['seat', t('pax'), fmt(S.stats.pax)], ['cash', t('earned'), money(S.stats.earned)], ['police', t('fines'), money(S.stats.fines)], ['crash', LANG === 'ar' ? 'حوادث' : 'Collisions', fmt(S.stats.crashes)]].map(([i, n, v]) => `<div class="set">${icon(i)}<span>${n}</span><span class="sp"></span><b>${v}</b></div>`).join('')}</div>
 <div class="card"><h3>${icon('garage')} ${LANG === 'ar' ? 'المركبة المفضلة' : 'Favourite vehicle'}</h3><img src="${ASSETS[fav.spr]}" style="width:100%"><b>${nm(fav.name)}</b><div class="muted">${fmt(GV(fav.id).odo, 1)} ${t('km')}</div></div></div>
 <div class="card" style="margin-top:1rem"><h3>${icon('trophy')} ${t('badges')}</h3><div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b.k] ? '' : 'lock'}">${icon(b.ic)}<div>${nm(b.n)}</div></div>`).join('')}</div></div>`;
 $('#nmIn').onchange = e => { S.name = e.target.value.trim().slice(0, 18); save(); renderTop(); };
}
/* ================= SETTINGS ================= */
function renderSettings(){
 const sl = (k, ic) => `<div class="set"><label>${icon(ic)} ${t(k === 'eng' ? 'engVol' : k === 'radio' ? 'radioVol' : k)}</label><input type="range" min="0" max="1" step=".05" value="${S.set[k]}" data-sl="${k}"><b style="width:3rem">${fmt(Math.round(S.set[k] * 100))}%</b></div>`;
 $('#s-settings').innerHTML = `<div class="head"><h1>${t('settings')}</h1><p>${LANG === 'ar' ? 'خصص تجربتك على الطريق' : 'Tune your experience on the road'}</p></div><div class="grid g2"><div class="card"><h3>${icon('music')} ${LANG === 'ar' ? 'الصوت' : 'Audio'}</h3>${sl('music', 'music')}${sl('sfx', 'horn')}${sl('eng', 'engine')}${sl('radio', 'radio')}</div>
 <div class="card"><h3>${icon('settings')} ${LANG === 'ar' ? 'عام' : 'General'}</h3><div class="set"><label>${icon('camera')} ${t('gfx')}</label><span class="sp"></span><button class="btn sm ${S.set.gfx === 'high' ? '' : 'sec'}" data-gfx="high">${t('high')}</button><button class="btn sm ${S.set.gfx === 'low' ? '' : 'sec'}" data-gfx="low">${t('lowq')}</button></div>
 
 <div class="set"><label>${icon('globe')} ${t('lang')}</label><span class="sp"></span><button class="btn sm ${LANG === 'ar' ? '' : 'sec'}" data-lang="ar">العربية</button><button class="btn sm ${LANG === 'en' ? '' : 'sec'}" data-lang="en">English</button></div>
 <div class="set"><label>${icon('save')} ${t('help')}</label><span class="sp"></span><button class="btn sm sec" id="stHelp">?</button></div>
 <div class="mbtns"><button class="btn red" id="stReset">${t('reset')}</button></div><p class="muted" style="text-align:center">OGRAAA · ${t('credit')}</p></div></div>`;
 $$('[data-sl]').forEach(r => r.oninput = () => { S.set[r.dataset.sl] = +r.value; r.nextElementSibling.textContent = fmt(Math.round(r.value * 100)) + '%'; AU.apply(); MUSIC.vol(); RADIO.vol(); save(); });
 $$('[data-gfx]').forEach(b => b.onclick = () => { S.set.gfx = b.dataset.gfx; save(); resize(); renderSettings(); });
 
 $$('[data-lang]').forEach(b => b.onclick = () => { LANG = S.lang = b.dataset.lang; save(); applyLang(); });
 $('#stHelp').onclick = () => $('#helpM').classList.add('on');
 $('#stReset').onclick = () => confirmUI(t('resetQ'), () => { localStorage.removeItem(SAVE_KEY); S = DEF(); save(true); applyLang(); show('home'); });
}
/* ================= HUD ================= */
function buildTrack(){
 const tr = $('#track'), L = W.len, pos = x => clamp(x / L * 100, 0, 100);
 tr.innerHTML = `<div class="ln"></div><div class="pr" id="trPr"></div>` + W.lights.map(l => `<div class="dot tl" style="left:${pos(l.x)}%"></div>`).join('') + W.cps.map(c => `<div class="dot cp" style="left:${pos(c.x)}%"></div>`).join('') + W.rests.map((r, i) => `<div class="dot rest" data-r="${i}" style="left:${pos(r.x)}%"></div>`).join('') + W.stops.map((s, i) => `<div class="dot" data-s="${i}" style="left:${pos(s.x)}%"></div>`).join('') + `<div class="me" id="trMe"><img src="${ASSETS.i_seat}"></div>`;
 $('#trMe img').src = ASSETS.i_terminal; refreshTrack(); $('#limitV').textContent = W.biome.urban > .3 ? '60' : G.V.cls === 'coach' ? '100' : '80';
}
function refreshTrack(){ $$('#track .dot[data-s]').forEach(d => d.classList.toggle('done', +d.dataset.s < G.nextIdx)); $$('#track .dot[data-r]').forEach(d => d.classList.toggle('done', W.rests[+d.dataset.r].used)); }
let hudT = 0;
function updateHUD(dt){
 hudT -= dt; if (hudT > 0) return; hudT = .12; const car = G.car, V = G.V, p = clamp(car.x / W.len * 100, 0, 100);
 $('#trPr').style.width = p + '%'; $('#trMe').style.left = p + '%';
 const st = W.stops[G.nextIdx]; $('#nextName').textContent = st ? (G.nextIdx === W.stops.length - 1 ? t('lastStop') : t('next')) + ': ' + nm(st.name) : '✓'; $('#nextDist').textContent = st ? fmt(Math.max(0, Math.round(st.x - doorX()))) + ' m' : '';
 $('#cMoney').innerHTML = icon('coins') + fmt(Math.round(G.T.fares + G.T.tips + G.T.cargo)); $('#cPax').innerHTML = icon('seat') + fmt(G.onboard.length) + '/' + fmt(seatsOf(V));
 const ck = G.parcels.filter(q => q.on).reduce((a, q) => a + q.kg, 0); $('#cCargo').style.display = G.parcels.length ? '' : 'none'; $('#cCargo').innerHTML = '📦 ' + fmt(ck) + ' ' + t('kg');
 $('#cTemp').innerHTML = (G.ac ? '❄️ ' : '🌡 ') + fmt(Math.round(G.cabin)) + '°'; const hr = {day:10, sunset:17, night:21}[G.tod] + G.time / 120; $('#cClock').innerHTML = '🕒 ' + fmt(Math.floor(hr % 24)) + ':' + String(Math.floor((hr % 1) * 60)).padStart(2, '0').replace(/\d/g, d => LANG === 'ar' ? AR_DIG[d] : d);
 const lim = +$('#limitV').textContent; $('#limitChip').style.background = speedOf(car) * 3.6 > lim + 3 ? '#d91c2c' : 'transparent';
 $('#startBtn').classList.toggle('show', !G.engOn && G.mode === 'play');
 $('#bBelt').classList.toggle('act', G.belt); $('#bLight').classList.toggle('act', !!car.headOn); $('#bHaz').classList.toggle('act', !!car.haz); $('#bGear').classList.toggle('act', !!car.rev); $('#bWipe').classList.toggle('act', !!G.wiper); $('#bWipe').style.display = G.weather === 'rain' ? '' : 'none'; $('#bRadio').classList.toggle('act', G.radioOn); $('#bAC').classList.toggle('act', G.ac); $('#bCC').classList.toggle('act', !!G.cruise);
 $('#radioLCD').innerHTML = G.radioOn ? `<b>${nm(STATIONS[S.radio.st])}</b><span>♪ VOL ${Math.round(S.set.radio * 100)}</span>` : 'OFF';
 $('#acLCD').innerHTML = `<b>${G.ac ? '❄ ' + G.acSet + '°C' : 'A/C OFF'}</b><span>IN ${Math.round(G.cabin)}°</span>`;
}
/* ================= receipt ================= */
function showReceipt(R){
 const box = $('#recBox'); const row = (l, v, c) => `<div class="rec"><span>${l}</span><b class="${c || ''}">${v}</b></div>`;
 const stars = `<div class="bigstars">${[0,1,2].map(i => i < R.stars ? '<i>★</i>' : '☆').join('')}</div>`;
 box.innerHTML = `<h2>${t('receipt')}</h2>${R.test ? `<p class="muted">${t('testDrive')}</p>` : stars}
 ${row(t('pax'), fmt(R.delivered))}${row(t('r_fares'), '+' + money(R.fares), 'good')}${row(t('r_tips'), '+' + money(R.tips), 'good')}${R.cargo ? row(t('r_cargo'), '+' + money(R.cargo), 'good') : ''}${R.fee ? row(t('r_fee'), '−' + money(R.fee), 'badc') : ''}${R.fines ? row(t('r_fines') + ' (' + R.fineList.join('، ') + ')', '−' + money(R.fines), 'badc') : ''}${R.tow ? row(t('towing'), '−' + money(R.tow), 'badc') : ''}
 ${row(t('r_fuel') + ' (' + fmt(R.fuelL, 1) + ' L)', '≈ ' + money(R.fuel), 'muted')}${row(LANG === 'ar' ? 'راحة الركاب' : 'Passenger comfort', fmt(R.comfort) + '%')}
 <div class="rec tot"><span>${t('net')}</span><b class="${R.net >= 0 ? 'gold' : 'badc'}">${R.test ? '—' : money(R.net)}</b></div>${R.test ? '' : `<div class="gold">+${fmt(R.xp)} XP</div>`}${R.lvUp ? `<h2>🎉 ${t('lvUp')}</h2>` : ''}
 <div class="mbtns"><button class="btn" id="recAgain">${t('again')}</button><button class="btn sec" id="recMore">${t('more')}</button><button class="btn sec" id="recMenu">${t('menu')}</button></div>`;
 $('#recM').classList.add('on'); if (R.lvUp) AU.levelUp();
 const r = G.route, o = {vid:G.vid, test:G.test}; $('#recAgain').onclick = () => { $('#recM').classList.remove('on'); play(r, o); }; $('#recMore').onclick = () => { $('#recM').classList.remove('on'); toMenu('routes'); }; $('#recMenu').onclick = () => { $('#recM').classList.remove('on'); toMenu('home'); };
}
/* ================= flow ================= */
function play(route, opt){
 AU.init(); AU.stop(); MUSIC.stop(); RADIO.stop(); $('#menu').classList.add('off'); $('#hud').classList.add('on'); document.body.classList.add('playing'); $('#rotate').classList.add('req');
 startRoute(route, opt); if (G.radioOn) RADIO.play(S.radio.st); resize(); if (!S.tut){ S.tut = true; save(); $('#helpM').classList.add('on'); }
 if (G.test) toastUI(t('testDrive'), 'gold'); else toastUI(t('startEng'), 'gold');
 if (G.weather === 'rain') setTimeout(() => toastUI(t('wipers'), 'gold'), 3000); if (!G.belt) setTimeout(() => { if (!G.belt && G.mode === 'play'){ toastUI(t('belt'), 'bad'); AU.chime(); } }, 5000);
}
function toMenu(scr){ G.mode = 'menu'; G.paused = false; AU.engine(false, 0, 0, 0); RADIO.stop(); $('#hud').classList.remove('on'); $('#menu').classList.remove('off'); document.body.classList.remove('playing'); $$('.pan').forEach(p => p.classList.remove('on')); $('#restM').classList.remove('on'); $('#pauseM').classList.remove('on'); $('#prompt').style.display = 'none'; $('#fatigue').style.opacity = 0; MUSIC.play(); AMBI.update(0); renderTop(); show(scr || 'home'); }
function pause(on){ if (G.mode !== 'play' || G.ended) return; G.paused = on; $('#pauseM').classList.toggle('on', on); AU.engine(false, 0, 0, 0); }
/* ================= controls ================= */
function horn(){ if (G.mode !== 'play') return; AU.horn(G.car.horn, G.V.cls !== 'micro'); G.honked = true; }
function startEngine(){ if (G.engOn || G.crank > 0 || G.mode !== 'play') return; G.crank = .85; AU.crank(); $('#startBtn').classList.add('on'); }
function toggleRadio(){ G.radioOn = !G.radioOn; S.radio.on = G.radioOn; save(); if (G.radioOn){ AU.staticBurst(); AU.play(S.radio.st, 'radio'); } else AU.stop(); }
function cruiseSet(){ const v = G.car.vx; if (v > 5){ G.cruise = v; toastUI(t('cruiseSet') + ' ' + fmt(Math.round(v * 3.6)) + ' ' + t('kmh'), 'good'); } }
const ACT = {
 door:() => { if (speedOf(G.car) > 2 && !G.doorOpen) return; setDoor(!G.doorOpen); }, horn, indL:() => { G.car.ind = G.car.ind === -1 ? 0 : -1; AU.tick(); }, indR:() => { G.car.ind = G.car.ind === 1 ? 0 : 1; AU.tick(); },
 haz:() => { G.car.haz = !G.car.haz; AU.tick(); }, light:() => { G.car.headOn = !G.car.headOn; AU.click(); }, belt:() => { G.belt = !G.belt; AU.click(); if (G.belt) toastUI(t('beltOn'), 'good'); },
 gear:() => { if (Math.abs(G.car.vx) > 1.5) return; G.car.rev = !G.car.rev; G.car.gear = 1; AU.click(); }, wipe:() => { G.wiper = !G.wiper; AU.click(); },
 radio:() => { $('#radioP').classList.toggle('on'); $('#acP').classList.remove('on'); $('#cruiseP').classList.remove('on'); }, ac:() => { $('#acP').classList.toggle('on'); $('#radioP').classList.remove('on'); $('#cruiseP').classList.remove('on'); },
 cc:() => { $('#cruiseP').classList.toggle('on'); $('#radioP').classList.remove('on'); $('#acP').classList.remove('on'); }, start:startEngine
};
function buildControls(){
 const b = (id, img, act, k, cls) => `<button class="cb ${cls || ''}" id="${id}" data-act="${act}"><img src="${ASSETS[img]}">${k ? `<span class="k">${k}</span>` : ''}</button>`;
 $('#ctrlsL').innerHTML = b('bIndL', 'indic', 'indL', 'Q', 'half') + b('bHaz', 'hazard', 'haz', 'Z') + b('bIndR', 'indic', 'indR', 'E', 'half') + b('bLight', 'lightSw', 'light', 'L') + b('bBelt', 'seatbelt', 'belt', 'B') + b('bWipe', 'wiper', 'wipe', 'V');
 $('#ctrls').innerHTML = b('doorBtn', 'doorBtn', 'door', 'D') + b('bHorn', 'hornBtn', 'horn', 'H') + b('bGear', 'gear', 'gear', 'G') + b('bRadio', 'i_radio', 'radio', 'R') + b('bAC', 'i_weather', 'ac', 'A') + b('bCC', 'cruise', 'cc', 'C');
 $('#bIndL').style.cssText = 'overflow:hidden'; $('#bIndL img').style.cssText = 'width:200%;object-position:left;object-fit:cover'; $('#bIndR').style.cssText = 'overflow:hidden'; $('#bIndR img').style.cssText = 'width:200%;margin-left:-100%;object-fit:cover';
 $$('[data-act]').forEach(e => e.addEventListener('pointerdown', ev => { ev.preventDefault(); AU.init(); if (G.mode === 'play') ACT[e.dataset.act](); }));
 $('#startBtn').innerHTML = `<img src="${ASSETS.start}">`; $('#startBtn').onpointerdown = e => { e.preventDefault(); startEngine(); };
 $('#pedB').innerHTML = `<img src="${ASSETS.pedalB}">`; $('#pedG').innerHTML = `<img src="${ASSETS.pedalG}">`;
 $('#radioP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.radio}">`); $('#acP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.acPanel}">`); $('#cruiseP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.cruise}">`);
 $('#rPow').onclick = toggleRadio; $('#rNext').onclick = () => { S.radio.st = (S.radio.st + 1) % STATIONS.length; save(); if (G.radioOn){ AU.staticBurst(); AU.play(S.radio.st, 'radio'); } };
 $('#rPrev').onclick = () => { S.radio.st = (S.radio.st + STATIONS.length - 1) % STATIONS.length; save(); if (G.radioOn){ AU.staticBurst(); AU.play(S.radio.st, 'radio'); } };
 $('#rVol').onclick = () => { S.set.radio = S.set.radio >= 1 ? .2 : Math.round((S.set.radio + .2) * 10) / 10; AU.apply(); save(); };
 $('#acOn').onclick = () => { G.ac = !G.ac; AU.click(); }; $('#acMinus').onclick = () => { G.acSet = Math.max(16, G.acSet - 1); G.ac = true; }; $('#acPlus').onclick = () => { G.acSet = Math.min(28, G.acSet + 1); };
 $('#ccOn').onclick = () => { G.cruise ? (G.cruise = 0) : cruiseSet(); }; $('#ccSet').onclick = () => { if (G.cruise) G.cruise = Math.max(3, G.cruise - 5 / 3.6); else cruiseSet(); }; $('#ccRes').onclick = () => { if (G.cruise) G.cruise = Math.min(G.car.vmax, G.cruise + 5 / 3.6); else if (G.lastCruise) G.cruise = G.lastCruise; }; $('#ccCan').onclick = () => { G.lastCruise = G.cruise; G.cruise = 0; toastUI(t('cruiseOff')); };
 const ped = (el, k) => { const on = e => { e.preventDefault(); AU.init(); G[k] = true; el.classList.add('down'); if (k === 'gasT' && !G.engOn) startEngine(); }, off = e => { G[k] = false; el.classList.remove('down'); }; el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('pointerleave', off); };
 ped($('#pedG'), 'gasT'); ped($('#pedB'), 'brakeT');
 $('#pauseBtn').onclick = () => pause(true); $('#pResume').onclick = () => pause(false); $('#pRestart').onclick = () => { $('#pauseM').classList.remove('on'); play(G.route, {vid:G.vid, test:G.test, parcels:G.parcels.map(p => Object.assign(p, {on:true, broken:false}))}); };
 $('#pQuit').onclick = () => { $('#pauseM').classList.remove('on'); if (!G.test && G.mode === 'play'){ GV(G.vid).fuel = G.fuel; save(); } toMenu('routes'); };
 $('#pHelp').onclick = () => $('#helpM').classList.add('on'); $('#helpOk').onclick = () => $('#helpM').classList.remove('on');
 $('#rCall').onclick = () => { if (G.rest) G.rest.called = true; }; $('#rLeave').onclick = closeRest;
 $('#langBtn').onclick = () => { LANG = S.lang = LANG === 'ar' ? 'en' : 'ar'; save(); applyLang(); };
}
const KEYMAP = {KeyD:'door', KeyH:'horn', KeyQ:'indL', KeyE:'indR', KeyZ:'haz', KeyL:'light', KeyB:'belt', KeyG:'gear', KeyV:'wipe'};
addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; AU.init();
 if (['ArrowRight','KeyW','ArrowUp'].includes(e.code)){ key.gas = true; if (G.mode === 'play' && !G.engOn) startEngine(); }
 if (['ArrowLeft','KeyS','ArrowDown'].includes(e.code)) key.brake = true;
 if (G.mode !== 'play' || e.repeat) return;
 if (KEYMAP[e.code]) ACT[KEYMAP[e.code]](); if (e.code === 'KeyR') toggleRadio(); if (e.code === 'KeyA'){ G.ac = !G.ac; AU.click(); } if (e.code === 'KeyC') cruiseSet(); if (e.code === 'KeyX'){ G.cruise = 0; }
 if (e.code === 'Space'){ G.hbrake = true; e.preventDefault(); } if (e.code === 'KeyP' || e.code === 'Escape') pause(!G.paused); if (e.code === 'Enter') startEngine(); });
addEventListener('keyup', e => { if (['ArrowRight','KeyW','ArrowUp'].includes(e.code)) key.gas = false; if (['ArrowLeft','KeyS','ArrowDown'].includes(e.code)) key.brake = false; if (e.code === 'Space') G.hbrake = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden){ pause(true); save(true); } });
/* ================= main loop ================= */
let last = performance.now();
function frame(now){
 const dt = Math.min(.05, (now - last) / 1000); last = now;
 if (G.mode === 'play' && G.car){ G._dt = G.paused ? 0 : dt; if (!G.paused){ update(dt); tickRest(dt); updateHUD(dt); } render(); drawCluster(); }
 requestAnimationFrame(frame);
}
function render(){
 ctx.setTransform(DPR, 0, 0, DPR, 0, 0); const sh = cam.shake * 6; ctx.save(); if (sh) ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
 drawSky(); drawLayers(); drawWorld();
 const car = G.car, farA = G.ai.filter(a => a.lift > .4).sort((a, b) => b.lift - a.lift), nearA = G.ai.filter(a => a.lift <= .4);
 for (const a of farA) drawVehicle(a, {lift:a.lift, scale:1 - .1 * a.lift / .82, dim:true, shadow:false});
 for (const c of W.cps) if (Math.abs(c.x - car.x) < 80) drawOfficer(c);
 const px = G.pedX; const pedY = px ? 1.85 - px.k * 2.3 : 0; if (px && pedY > .3) drawPed(px.t, px.x, terrH(px.x) + pedY, px.d, 1, 1, px.h);
 for (const w of G.walkers) drawPed(w.t, w.x, terrH(w.x) + (w.y || 0), w.d, w.face, w.a ?? 1, w.h);
 for (const a of nearA) drawVehicle(a, {lift:a.lift});
 drawVehicle(car);
 if (px && pedY <= .3) drawPed(px.t, px.x, terrH(px.x) + pedY, px.d, 1, 1, px.h);
 drawFront(); drawParts(); drawNight(); drawBubbles(G._dt || 0); drawWeather(); ctx.restore();
}
/* ================= boot ================= */
function boot(){
 load(); $('#ldLogo').src = ASSETS.logo; $$('[data-t]').forEach(e => e.textContent = t(e.dataset.t)); document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
 document.documentElement.style.setProperty('--bgimg', `url(${ASSETS.bg})`);
 loadImages(() => { $('#brandLogo').src = ASSETS.logo; cleanImages(); buildControls(); applyLang(); resize(); ensureDaily(); decayPoints(); $('#tapGo').style.opacity = 1;
  const go = () => { AU.init(); MUSIC.play(); $('#loading').style.opacity = 0; setTimeout(() => $('#loading').remove(), 500); $('#menu').classList.remove('off'); show('home'); removeEventListener('pointerdown', go); removeEventListener('keydown', go); };
  addEventListener('pointerdown', go); addEventListener('keydown', go); requestAnimationFrame(frame); });
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
