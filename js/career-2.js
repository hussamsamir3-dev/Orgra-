"use strict";
/* =====================================================================
   OGRAAA v16 — realistic short spray · per-vehicle engine voices ·
   sedan/minivan passengers · live traffic-light pins · Career 2.0
   (shift board, objectives, team rankings, journey) · menu overhaul
   ===================================================================== */
/* ---------------- rain spray: fine, spread, fades within ~1 m ---------------- */
function rainSpray(c, k){ const sp = Math.abs(c.vx); if (sp < 2.5) return; const dir = Math.sign(c.vx) || 1, lift = c.lift || 0;
 for (const w of c.wh){ if (!w.ground) continue; if (Math.random() > .5 * k * clamp(sp / 14, .35, 1)) continue;
  const bx = w.x - dir * w.r * (.3 + Math.random() * .6), by = terrH(w.x) + lift + .02 + Math.random() * .05;
  puff(bx, by, -dir * sp * (.08 + Math.random() * .1), .9 + Math.random() * 1.1, .18 + Math.random() * .14, .012, '#e2eefb', 'drop');
  if (Math.random() < .25 * k) puff(w.x - dir * w.r * .9, terrH(w.x) + lift + .15, -dir * sp * .07, .15, .45 + Math.random() * .25, .05 + sp * .002, '#eef3f8', 'dust'); } }
/* ---------------- engine voices by vehicle type, size and upgrades ---------------- */
const ENGP = {fiat128:{b:44, m:118, lp:950, n:.05, t:0, g:.85}, minivan:{b:38, m:102, lp:820, n:.06, t:0, g:.9}, hiace:{b:30, m:86, lp:660, n:.12, t:0, g:1}, coaster:{b:26, m:74, lp:560, n:.13, t:.01, g:1.05},
 redbus:{b:21, m:58, lp:480, n:.14, t:.03, g:1.1}, mcv:{b:21, m:57, lp:470, n:.14, t:.03, g:1.1}, coachB:{b:19, m:54, lp:520, n:.1, t:.035, g:1.05}, coachO:{b:18.5, m:53, lp:540, n:.09, t:.04, g:1.05}};
const _eng16 = AU.engine.bind(AU);
AU.engine = function(on, rpm, load, speed, big){ _eng16(on, rpm, load, speed, big); const e = this.eng, c = this.ctx; if (!e || !c || !G.V) return; const P = ENGP[G.V.id] || ENGP.hiace, up = G.test ? 0 : upl(G.vid, 'engine'), tt = c.currentTime + .05;
 const f = (P.b + rpm * P.m) * (1 + up * .04); e.o1.frequency.setTargetAtTime(f, tt, .05); e.o2.frequency.setTargetAtTime(f * .5, tt, .05); e.o3.frequency.setTargetAtTime(f * .25, tt, .05); e.lfo.frequency.setTargetAtTime(f / 4, tt, .05);
 e.lp.frequency.setTargetAtTime((P.lp + load * 1200 + rpm * 420) * (1 + up * .1), tt, .08); e.out.gain.setTargetAtTime(on ? (.13 + load * .18) * P.g : 0, tt, .1); e.ng.gain.setTargetAtTime(on ? P.n * (.6 + load) : 0, tt, .1);
 if (!e.tb){ e.tb = c.createOscillator(); e.tb.type = 'sine'; e.tbg = c.createGain(); e.tbg.gain.value = 0; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 2; e.tb.connect(bp).connect(e.tbg).connect(this.engG); e.tb.start(); }
 e.tb.frequency.setTargetAtTime(1600 + rpm * 2800, tt, .1); e.tbg.gain.setTargetAtTime(on ? P.t * load * clamp(rpm, 0, 1) : 0, tt, .15); };
/* ---------------- sedan & minivan: passengers seen through the real rear windows ---------------- */
const BAKEDWIN = {fiat128:[[.305, .135, .46, .335]], minivan:[[.295, .1, .455, .37], [.11, .11, .28, .36]]};
const BCAB = {};
const _cc16 = cabinCanvas;
cabinCanvas = function(V, cos, pax, forPreview){ if (!V.baked) return _cc16(V, cos, pax, forPreview); const M = META[V.spr], w = M.w, h = M.h; let c = BCAB[V.id]; if (!c){ c = BCAB[V.id] = document.createElement('canvas'); c.width = w; c.height = h; }
 const x = c.getContext('2d'); x.clearRect(0, 0, w, h); const ppm = w / V.len, rects = BAKEDWIN[V.id] || [], list = pax.slice(0, rects.length * 2); let k = 0;
 rects.forEach(([x0, y0, x1, y1]) => { const X0 = x0 * w, Y0 = y0 * h, X1 = x1 * w, Y1 = y1 * h, ww = X1 - X0; x.save(); x.beginPath(); x.rect(X0, Y0, ww, Y1 - Y0); x.clip();
  for (let s = 0; s < 2 && k < list.length; s++, k++){ const p = list[k], fr = META.peds[p.t]; if (!fr) continue; const im = IMG[fr[0]]; if (!im) continue; const H = (p.h || 1.7) * ppm * pedRel(p.t, im), W2 = im.width / im.height * H, show = Math.min(.55 * ppm, (Y1 - Y0) * .85), px = X0 + ww * (s ? .7 : .35) + (p._sx || 0) * ppm;
   x.save(); if (s) x.filter = 'brightness(.8)'; const fl = !forPreview && typeof wantsOff === 'function' && wantsOff(p) && Math.floor(G.time * 4) % 2 === 0; if (fl){ const f0 = x.filter; x.filter = 'none'; goldOutline(x, im, px - W2 / 2, Y1 - show, W2, H); x.filter = f0; } x.drawImage(im, px - W2 / 2, Y1 - show, W2, H); x.restore(); }
  const g = x.createLinearGradient(X0, Y0, X1, Y1); g.addColorStop(0, 'rgba(20,28,38,.22)'); g.addColorStop(.5, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(20,28,38,.18)'); x.fillStyle = g; x.fillRect(X0, Y0, ww, Y1 - Y0); x.restore(); });
 return c; };
/* ---------------- progress bar: traffic-light pins show the live colour ---------------- */
const _uh16 = updateHUD;
updateHUD = function(dt){ _uh16(dt); if (!W.lights) return; const dots = document.querySelectorAll('#track .dot.tl'); W.lights.forEach((l, i) => { const d = dots[i]; if (!d) return; const s = lightState(l), col = s === 'g' ? '#2bff6a' : s === 'y' ? '#ffb300' : '#ff3b3b'; if (d._c !== col){ d._c = col; d.style.background = col; d.style.borderColor = col; d.style.boxShadow = `0 0 6px ${col}`; } }); };
/* ===================================================================
   CAREER 2.0 — shift board, live objectives, team rankings, journey
   =================================================================== */
let CTAB = 'tree';
const OBJ_POOL = [
 {k:'nofine', ic:'🚨', t:['من غير ولا مخالفة','No fines'], b:120, chk:(R, K) => K.cf === 0},
 {k:'comfort', ic:'😊', t:['راحة الركاب ٧٥٪+','Comfort 75%+'], b:150, chk:R => R.comfort >= 75},
 {k:'pax', ic:'🧍', t:['وصّل ١٢ راكب+','Deliver 12+ passengers'], b:140, chk:R => R.delivered >= 12},
 {k:'stars', ic:'⭐', t:['٣ نجوم','3 stars'], b:180, chk:R => R.stars >= 3},
 {k:'perfect', ic:'🎯', t:['وقفتين مظبوطين','2 perfect stops'], b:130, chk:(R, K) => (S.stats.perfect || 0) - (K.pf0 || 0) >= 2},
 {k:'nohit', ic:'🛡', t:['من غير خبطات','No collisions'], b:110, chk:() => !G.T.hits}];
function jobsToday(){ const c = CR(), day = dayKey(); if (c.board && c.board.day === day) return c.board.jobs; const r = mulberry(h32(day + (S.name || '')) >>> 0), fl = fleet(); if (!fl.length) return [];
 const shifts = [['🌅', ['وردية الصبح','Morning shift'], 'day', 1], ['🚦', ['ساعة الذروة','Rush hour'], 'day', 1.3], ['🌇', ['وردية المغرب','Sunset shift'], 'sunset', 1.15], ['🌙', ['وردية الليل','Night shift'], 'night', 1.25]];
 const jobs = []; for (let i = 0; i < 4; i++){ const vid = fl[(r() * fl.length) | 0], routes = ROUTES.filter(q => CLS_OK[q.type].includes(vid)); if (!routes.length) continue; const route = routes[(r() * routes.length) | 0], sh = shifts[i % 4];
  if (sh[2] === 'night' && !hasPerk('night') && i === 3) continue; const objs = []; const pool = OBJ_POOL.slice(); for (let q = 0; q < 1 + (r() < .6 ? 1 : 0); q++){ objs.push(pool.splice((r() * pool.length) | 0, 1)[0].k); }
  const urgent = r() < .22; jobs.push({id:day + i, vid, route:route.id, tod:sh[2], ic:sh[0], name:sh[1], mult:+(sh[3] * (urgent ? 1.6 : 1)).toFixed(2), urgent, objs, done:false}); }
 c.board = {day, jobs}; save(); return jobs; }
const TEAM = [['كريم السيد','Karim El-Sayed',4],['محمود عبده','Mahmoud Abdo',9],['هاني فوزي','Hany Fawzy',2],['سعيد رمضان','Said Ramadan',15],['أحمد نبيل','Ahmed Nabil',7],['عم صلاح','Uncle Salah',20],['يوسف جمال','Youssef Gamal',11],['شريف منير','Sherif Mounir',17],['مصطفى خليل','Mostafa Khalil',5]];
function weekKey(){ const d = new Date(); const on = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + '-W' + Math.ceil(((d - on) / DAY + on.getDay() + 1) / 7); }
function teamBoard(){ const c = CR(), wk = weekKey(); if (!c.week || c.week.k !== wk) c.week = {k:wk, pts:0, claimed:false}; const day = new Date().getDay() + 1, r = mulberry(h32(wk) >>> 0);
 const rows = TEAM.map(([ar, en, t]) => ({n:L2(ar, en), t, pts:Math.round((60 + r() * 120) * day * (.6 + r() * .6)), me:false})); rows.push({n:playerName() + ' ⭐', t:(S.avatar && S.avatar.i) || 0, pts:c.week.pts, me:true}); rows.sort((a, b) => b.pts - a.pts); return rows; }
function objText(k){ const o = OBJ_POOL.find(q => q.k === k); return o ? `${o.ic} ${nm(o.t)} <em>+${fmt(o.b)}</em>` : k; }
/* start a job from the board */
function startJob(j){ const V = VBY(j.vid); if (!hasLic(V.cls)){ toastUI('🪪 ' + L2('محتاج رخصة ', 'Licence needed for ') + nm(V.name), 'bad'); DMVTAB = 'lic'; show('traffic'); return; }
 CVEH = j.vid; const route = ROUTES.find(q => q.id === j.route); play(route, {vid:j.vid, test:true, career:{job:j.id, objs:j.objs, mult:j.mult, night:j.tod === 'night', pf0:S.stats.perfect || 0}, tod:j.tod}); }
/* live objective tracker during career shifts */
function objPanel(){ let el = $('#objP'); if (!G.career || !G.career.objs || G.mode !== 'play'){ if (el) el.style.display = 'none'; return; } if (!el){ $('#hud').insertAdjacentHTML('beforeend', '<div id="objP"></div>'); el = $('#objP'); } el.style.display = '';
 const K = G.career, live = {nofine:K.cf === 0, comfort:G.comfort >= 75, pax:G.T.delivered >= 12, stars:G.T.missed === 0 && K.cf === 0, perfect:(S.stats.perfect || 0) - (K.pf0 || 0) >= 2, nohit:!G.T.hits};
 const html = `<b>📋 ${L2('أهداف الوردية', 'Shift objectives')}${K.mult > 1 ? ` · ×${K.mult}` : ''}</b>` + K.objs.map(k => { const o = OBJ_POOL.find(q => q.k === k); const prog = k === 'pax' ? ` ${fmt(G.T.delivered)}/12` : k === 'comfort' ? ` ${fmt(Math.round(G.comfort))}%` : k === 'perfect' ? ` ${fmt((S.stats.perfect || 0) - (K.pf0 || 0))}/2` : ''; return `<span class="${live[k] ? 'ok' : ''}">${live[k] ? '✅' : '⬜'} ${o.ic} ${nm(o.t)}${prog}</span>`; }).join(''); if (el._h !== html){ el._h = html; el.innerHTML = html; } }
const _uh16b = updateHUD;
updateHUD = function(dt){ _uh16b(dt); try{ objPanel(); }catch(e){} };
/* pay slip: objectives, multiplier, team points, journey dates */
const _sr16 = showReceipt;
showReceipt = function(R){ const K = G.career; if (!K){ return _sr16(R); } const c = CR(); let bonus = 0, lines = '';
 if (K.objs){ for (const k of K.objs){ const o = OBJ_POOL.find(q => q.k === k), ok = R.reason === 'ok' && o.chk(R, K); if (ok) bonus += o.b; lines += `<div class="rec"><span>${o.ic} ${nm(o.t)}</span><b class="${ok ? 'good' : 'badc'}">${ok ? '+' + money(o.b) : '✗'}</b></div>`; } }
 const pay = careerPay(), multExtra = K.mult && K.mult > 1 && R.reason === 'ok' ? Math.round(pay.sal * (K.mult - 1)) : 0;
 _sr16(R); if (bonus + multExtra > 0) ledger(bonus + multExtra, L2('حوافز الوردية', 'Shift incentives'), 'trophy');
 if (K.job && c.board){ const j = c.board.jobs.find(q => q.id === K.job); if (j && R.reason === 'ok') j.done = true; }
 c.week = c.week && c.week.k === weekKey() ? c.week : {k:weekKey(), pts:0, claimed:false}; const pts = Math.round((R.reason === 'ok' ? 60 : 10) + R.stars * 30 + (K.cf ? 0 : 25) + bonus / 10); c.week.pts += pts; save(true);
 const tot = $('#recBox .rec.tot'); if (tot) tot.insertAdjacentHTML('beforebegin', (multExtra ? `<div class="rec"><span>⚡ ${L2('مضاعف الوردية', 'Shift multiplier')} ×${K.mult}</span><b class="good">+${money(multExtra)}</b></div>` : '') + lines + `<div class="rec"><span>🏆 ${L2('نقاط الفريق', 'Team points')}</span><b class="gold">+${fmt(pts)}</b></div>`); };
/* promotions remember their date (journey tab) */
const _rc16 = renderCareer;
renderCareer = function(){ const c = CR(); c.dates = c.dates || {}; for (const id in c.done) if (!c.dates[id]) c.dates[id] = Date.now(); _rc16();
 const car = $('#s-career .career'); if (!car) return; const tabs = [['tree', '🌳', ['شجرة الترقيات','Promotions']], ['board', '📋', ['لوحة الورديات','Shift board']], ['team', '🏆', ['الفريق والترتيب','Team & ranks']], ['journey', '📜', ['رحلتك','Journey']]];
 car.querySelector('.chead').insertAdjacentHTML('afterend', `<div class="ctabs">${tabs.map(([k, ic, n]) => `<button class="${CTAB === k ? 'on' : ''}" data-ct="${k}"><i>${ic}</i>${nm(n)}${k === 'board' && c.joined ? `<em>${jobsToday().filter(j => !j.done).length}</em>` : ''}</button>`).join('')}</div>`);
 $$('[data-ct]').forEach(b => b.onclick = () => { CTAB = b.dataset.ct; AU.click(); renderCareer(); });
 // career progress to next promotion
 const next = CAREER_N.find(n => nodeState(n) === 'ready') || CAREER_N.filter(n => nodeState(n) === 'open').sort((a, b) => b.req.filter(reqMet).length / b.req.length - a.req.filter(reqMet).length / a.req.length)[0];
 if (next){ const p = Math.round(next.req.filter(reqMet).length / next.req.length * 100); car.querySelector('.ccard > div').insertAdjacentHTML('beforeend', `<div class="cnext"><small>${L2('الترقية الجاية', 'Next promotion')}: <b>${nm(next.t)}</b></small><div class="bar gold"><i style="width:${p}%"></i></div></div>`); }
 if (CTAB === 'tree') return;
 ['.cstage', '.cpanel', '.cbar'].forEach(s => { const e = car.querySelector(s); if (e) e.style.display = 'none'; });
 let html = '';
 if (!c.joined) html = `<div class="cempty">✍ ${L2('امضي العقد من شجرة الترقيات الأول', 'Sign the contract in the Promotions tab first')}</div>`;
 else if (CTAB === 'board'){ const jobs = jobsToday(); html = `<div class="cboard">${jobs.map(j => { const V = VBY(j.vid), r = ROUTES.find(q => q.id === j.route); return `<div class="job ${j.done ? 'done' : ''} ${j.urgent ? 'urgent' : ''}">${j.urgent ? `<span class="jtag">⚡ ${L2('وردية طوارئ', 'Urgent cover')}</span>` : ''}<div class="jveh ${j.tod}"><img src="${ASSETS[V.spr]}"></div><div class="jhead"><b>${j.ic} ${nm(j.name)}</b><span class="gold">×${j.mult}</span></div><div class="jroute">${nm(r.from)} ← ${nm(r.to)} <small>${fmt(r.km)} ${t('km')}</small></div><div class="jveh2">🚐 ${nm(V.name)}</div><div class="jobj">${j.objs.map(objText).join('')}</div>${j.done ? `<div class="jdone">✓ ${L2('خلصت', 'Completed')}</div>` : `<button class="btn" data-job="${j.id}">▶ ${L2('اقبل الوردية', 'Accept shift')}</button>`}</div>`; }).join('')}</div><p class="muted" style="text-align:center">${L2('لوحة الورديات بتتجدد كل يوم — الورديات الطارئة بتدفع أكتر', 'The board refreshes daily — urgent cover shifts pay more')}</p>`; }
 else if (CTAB === 'team'){ const rows = teamBoard(), me = rows.findIndex(r => r.me); html = `<div class="cteam"><div class="twk">${L2('ترتيب الأسبوع', 'This week')} · ${weekKey()}<span class="sp"></span>${me === 0 && !c.week.claimed ? `<button class="btn sm" id="wkClaim">🏆 ${L2('استلم مكافأة سواق الأسبوع', 'Claim Driver of the Week')} +${money(1500)}</button>` : me === 0 ? `<span class="good">✓ ${L2('سواق الأسبوع!', 'Driver of the Week!')}</span>` : `<span class="muted">${L2('وصل للمركز الأول عشان تكسب ١٥٠٠', 'Reach #1 to win 1,500')}</span>`}</div>
  ${rows.map((r, i) => `<div class="trow ${r.me ? 'me' : ''}"><span class="tpos">${['🥇','🥈','🥉'][i] || fmt(i + 1)}</span><div class="tav" style="background-image:url(${ASSETS[(META.peds[r.t % META.peds.length] || META.peds[0])[0]]})"></div><b>${r.n}</b><span class="sp"></span><div class="tbar"><i style="width:${Math.round(r.pts / Math.max(1, rows[0].pts) * 100)}%"></i></div><em>${fmt(r.pts)}</em></div>`).join('')}</div>`; }
 else { const done = CAREER_N.filter(n => c.done[n.id]).sort((a, b) => (c.dates[a.id] || 0) - (c.dates[b.id] || 0)); html = `<div class="cjour">${done.map((n, i) => `<div class="jitem" style="animation-delay:${i * .08}s"><div class="jdot"></div><div class="jcard"><img src="${ASSETS[VBY(n.v).spr]}"><div><b>${nm(n.t)}</b><small>${new Date(c.dates[n.id]).toLocaleDateString(LANG === 'ar' ? 'ar-EG' : 'en-GB')}</small><p class="muted">${nm(n.d)}</p></div></div></div>`).join('')}<div class="jstats"><div><b>${fmt(c.shifts)}</b><small>${L2('ورديات', 'shifts')}</small></div><div><b>${fmt(c.clean)}</b><small>${L2('نضيفة', 'clean')}</small></div><div><b>${fmt(c.night)}</b><small>${L2('ليلي', 'night')}</small></div><div><b>${money(c.earned)}</b><small>${L2('مكسب', 'earned')}</small></div></div></div>`; }
 car.insertAdjacentHTML('beforeend', `<div class="cpane">${html}</div>`);
 $$('[data-job]').forEach(b => b.onclick = () => { const j = jobsToday().find(q => q.id === b.dataset.job); if (j) startJob(j); });
 const wc = $('#wkClaim'); if (wc) wc.onclick = () => { c.week.claimed = true; ledger(1500, L2('سواق الأسبوع', 'Driver of the Week'), 'trophy'); AU.levelUp(); toastUI('🏆 ' + L2('إنت سواق الأسبوع!', 'You are Driver of the Week!'), 'good'); save(); renderCareer(); }; };
/* ---------------- menus: clearer names, grouped, iconed ---------------- */
TX.rides = ['على الطريق','Hit the Road']; TX.me = ['ملفي','My Profile'];
HUB9.rides = ['routes','garage','showroom','market']; HUB9.me = ['profile','home','traffic'];
const SUBIC = {routes:'🗺', garage:'🔧', showroom:'🚐', market:'🛒', profile:'🪪', home:'💰', traffic:'🚦'};
const _show16 = show;
show = function(id){ _show16(id); $$('#subnav [data-sub]').forEach(b => { if (!b.dataset.ic){ b.dataset.ic = 1; b.innerHTML = `<i>${SUBIC[b.dataset.sub] || ''}</i> ${b.innerHTML}`; } }); };
{ const st = document.createElement('style'); st.textContent = `
.ctabs{display:flex;gap:.4rem;padding:.35rem;border-radius:.9rem;background:rgba(6,12,28,.85);border:1px solid var(--line);overflow-x:auto}.ctabs button{display:flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:.65rem;font-weight:700;white-space:nowrap;color:#c9d3ea}.ctabs button i{font-style:normal}.ctabs button em{font-style:normal;background:#ff4d5e;color:#fff;border-radius:1rem;padding:0 .45rem;font-size:.75rem}.ctabs button.on{background:linear-gradient(180deg,#ffd35a,#f5a90b);color:#2a1a00}
.career{grid-template-rows:auto auto 1fr auto}.cnext{margin-top:.3rem;min-width:14rem}.cnext .bar{height:.4rem}
.cpane{overflow:auto;border-radius:1.2rem;border:1px solid rgba(255,255,255,.08);background:radial-gradient(circle at 50% 0,#1d2c52,#0b1428 70%);padding:1rem;animation:fade .3s}
.cboard{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:.8rem}.job{position:relative;padding:.8rem;border-radius:1rem;background:linear-gradient(180deg,rgba(19,39,80,.95),rgba(10,22,46,.95));border:1px solid var(--line);display:flex;flex-direction:column;gap:.35rem;animation:cin .45s both}.job:hover{transform:translateY(-3px);box-shadow:0 .8rem 1.6rem rgba(0,0,0,.45);border-color:var(--gold)}.job.done{opacity:.55}.job.urgent{border-color:#ff9a3b;box-shadow:0 0 0 1px #ff9a3b inset,0 0 1.2rem rgba(255,154,59,.25)}
.jtag{position:absolute;top:.6rem;inset-inline-start:.6rem;z-index:2;padding:.15rem .5rem;border-radius:1rem;background:#ff9a3b;color:#2a1400;font-size:.72rem;font-weight:800;animation:pulse 1.4s infinite}
.jveh{height:6rem;border-radius:.7rem;display:grid;place-items:center;background:linear-gradient(180deg,#8fc3ee,#e9d8b8)}.jveh.sunset{background:linear-gradient(180deg,#f0a36b,#f6d7a8)}.jveh.night{background:linear-gradient(180deg,#0b1633,#22335e)}.jveh img{max-width:85%;max-height:80%}
.jhead{display:flex;justify-content:space-between;font-size:1rem}.jroute{font-weight:600}.jroute small,.jveh2{color:var(--mut);font-size:.8rem}.jobj{display:flex;flex-direction:column;gap:.2rem;font-size:.8rem}.jobj em{font-style:normal;color:#7CFC9A}.jdone{text-align:center;color:#7CFC9A;font-weight:800}
.cteam{display:flex;flex-direction:column;gap:.4rem}.twk{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;padding:.4rem .2rem;font-weight:700}.trow{display:flex;align-items:center;gap:.6rem;padding:.45rem .7rem;border-radius:.8rem;background:rgba(6,14,32,.6);border:1px solid rgba(255,255,255,.05);animation:cin .4s both}.trow.me{border-color:var(--gold);background:rgba(245,178,27,.12)}.tpos{width:2rem;text-align:center;font-weight:800}.tav{width:2.3rem;height:2.3rem;border-radius:50%;background:#1a2c55 center 12%/230% auto no-repeat;border:2px solid var(--line)}.tbar{width:32%;height:.45rem;border-radius:1rem;background:#0a1630;overflow:hidden}.tbar i{display:block;height:100%;background:linear-gradient(90deg,#f5a90b,#ffe08a)}.trow em{font-style:normal;width:4.5rem;text-align:end;color:var(--gold2);font-weight:700}
.cjour{position:relative;padding-inline-start:1.6rem}.cjour::before{content:"";position:absolute;inset-inline-start:.55rem;top:0;bottom:4rem;width:2px;background:linear-gradient(#1fe08a,#ffd35a)}.jitem{position:relative;margin-bottom:.8rem;animation:cin .45s both}.jdot{position:absolute;inset-inline-start:-1.35rem;top:1rem;width:.9rem;height:.9rem;border-radius:50%;background:#1fe08a;box-shadow:0 0 .8rem #1fe08a}.jcard{display:flex;gap:.8rem;align-items:center;padding:.6rem .8rem;border-radius:.9rem;background:rgba(6,14,32,.65);border:1px solid var(--line)}.jcard img{height:3rem}.jcard small{display:block;color:var(--gold2)}.jcard p{margin:.2rem 0 0}
.jstats{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin-top:1rem}.jstats div{text-align:center;padding:.6rem;border-radius:.8rem;background:rgba(6,14,32,.7);border:1px solid var(--line)}.jstats b{display:block;color:var(--gold2);font-size:1.15rem}
.cempty{text-align:center;padding:3rem;font-size:1.1rem;color:var(--mut)}
#objP{position:absolute;top:5.2rem;inset-inline-start:.6rem;display:flex;flex-direction:column;gap:.2rem;padding:.5rem .7rem;border-radius:.8rem;background:rgba(6,12,28,.82);border:1px solid var(--gold);font-size:.78rem;pointer-events:none;max-width:16rem}#objP b{color:var(--gold2)}#objP span.ok{color:#7CFC9A}
#subnav button i{font-style:normal}`; document.head.appendChild(st); }
