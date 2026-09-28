"use strict";
/* ================= OGRAAA v3 — cockpit controls, panels & HUD ================= */
function toggleRadio(){ G.radioOn = !G.radioOn; S.radio.on = G.radioOn; save(); if (G.radioOn) RADIO.play(S.radio.st); else RADIO.stop(); }
function tune(d){ S.radio.st = (S.radio.st + d + STATIONS.length) % STATIONS.length; save(); if (G.radioOn) RADIO.play(S.radio.st); else { G.radioOn = true; S.radio.on = true; RADIO.play(S.radio.st); } }
function buildControls(){
 const b = (id, img, act, k, cls) => `<button class="cb ${cls || ''}" id="${id}" data-act="${act}"><img src="${ASSETS[img]}">${k ? `<span class="k">${k}</span>` : ''}</button>`;
 $('#ctrlsL').innerHTML = b('bIndL', 'indic', 'indL', 'Q', 'half') + b('bHaz', 'hazard', 'haz', 'Z') + b('bIndR', 'indic', 'indR', 'E', 'half') + b('bLight', 'lightSw', 'light', 'L') + b('bBelt', 'seatbelt', 'belt', 'B') + `<span id="doorBtn" hidden></span><span id="bWipe" hidden></span>`;
 $('#ctrls').innerHTML = b('bHorn', 'hornBtn', 'horn', 'H') + b('bGear', 'gear', 'gear', 'G') + b('bCC', 'cruise', 'cc', 'C') + b('bRadio', 'i_radio', 'radio', 'R') + b('bAC', 'acPanel', 'ac', 'A', 'acb');
 $('#bIndL').style.overflow = 'hidden'; $('#bIndL img').style.cssText = 'width:200%;max-width:none;object-fit:cover;object-position:left'; $('#bIndR').style.overflow = 'hidden'; $('#bIndR img').style.cssText = 'width:200%;max-width:none;margin-left:-100%;object-fit:cover';
 $$('[data-act]').forEach(e => e.addEventListener('pointerdown', ev => { ev.preventDefault(); AU.init(); if (G.mode === 'play') ACT[e.dataset.act](); }));
 $('#startBtn').innerHTML = `<img src="${ASSETS.start}">`; $('#startBtn').onpointerdown = e => { e.preventDefault(); startEngine(); };
 $('#pedB').innerHTML = `<img src="${ASSETS.pedalB}">`; $('#pedG').innerHTML = `<img src="${ASSETS.pedalG}">`;
 $('#radioP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.radio}">`); $('#acP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.acPanel}">`); $('#cruiseP').insertAdjacentHTML('afterbegin', `<img src="${ASSETS.cruise}">`);
 const tap = (id, fn) => { const e = $('#' + id); if (e) e.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); AU.click(); fn(ev); }); };
 // radio: power knob, tuning buttons, 4 presets (hold to store), volume knob
 tap('rPow', toggleRadio); tap('rNext', () => tune(1)); tap('rPrev', () => tune(-1)); tap('rVolD', () => { S.set.radio = clamp(Math.round((S.set.radio - .1) * 10) / 10, 0, 1); RADIO.vol(); save(); }); tap('rVolU', () => { S.set.radio = clamp(Math.round((S.set.radio + .1) * 10) / 10, 0, 1); RADIO.vol(); save(); });
 S.radio.pre = S.radio.pre || [0, 2, 5, 4];
 $$('.rpre').forEach((e, i) => { let tm = 0; e.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); tm = setTimeout(() => { S.radio.pre[i] = S.radio.st; save(); toastUI((LANG === 'ar' ? 'اتحفظت في زرار ' : 'Saved to preset ') + (i + 1), 'good'); tm = -1; }, 700); }); e.addEventListener('pointerup', () => { if (tm !== -1){ clearTimeout(tm); S.radio.st = S.radio.pre[i]; save(); G.radioOn = true; S.radio.on = true; RADIO.play(S.radio.st); AU.click(); } }); });
 // A/C: blue/red temp knob halves, fan knob halves, A/C, recirculation, vent mode, demist
 tap('acCool', () => { G.acSet = Math.max(16, G.acSet - 1); }); tap('acWarm', () => { G.acSet = Math.min(30, G.acSet + 1); });
 tap('fanDn', () => { G.fan = Math.max(0, (G.fan || 0) - 1); }); tap('fanUp', () => { G.fan = Math.min(4, (G.fan || 0) + 1); });
 tap('acOn', () => { G.ac = !G.ac; if (G.ac && !G.fan) G.fan = 2; }); tap('acRec', () => { G.recirc = !G.recirc; }); tap('acVent', () => { G.vent = G.vent === 'face' ? 'feet' : 'face'; }); tap('acDef', () => { G.defrost = !G.defrost; if (G.defrost){ G.ac = true; G.fan = Math.max(G.fan || 0, 3); } });
 // cruise: ON/OFF, RES +, SET −, CANCEL
 tap('ccOn', () => { if (G.cruise){ G.lastCruise = G.cruise; G.cruise = 0; toastUI(t('cruiseOff')); } else cruiseSet(); });
 tap('ccRes', () => { if (G.cruise) G.cruise = Math.min(G.car.vmax, G.cruise + 5 / 3.6); else if (G.lastCruise) { G.cruise = G.lastCruise; toastUI(t('cruiseSet') + ' ' + fmt(Math.round(G.cruise * 3.6))); } });
 tap('ccSet', () => { if (G.cruise) G.cruise = Math.max(20 / 3.6, G.cruise - 5 / 3.6); else cruiseSet(); });
 tap('ccCan', () => { if (G.cruise){ G.lastCruise = G.cruise; G.cruise = 0; toastUI(t('cruiseOff')); } });
 const ped = (el, k) => { const on = e => { e.preventDefault(); AU.init(); G[k] = true; el.classList.add('down'); try{ el.setPointerCapture(e.pointerId); }catch(_){} if (k === 'gasT' && !G.engOn) startEngine(); }, off = () => { G[k] = false; el.classList.remove('down'); }; el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('lostpointercapture', off); };
 ped($('#pedG'), 'gasT'); ped($('#pedB'), 'brakeT');
 $('#pauseBtn').onclick = () => pause(true); $('#pResume').onclick = () => pause(false); $('#pRestart').onclick = () => { $('#pauseM').classList.remove('on'); play(G.route, {vid:G.vid, test:G.test, parcels:G.parcels.map(p => Object.assign(p, {on:true, broken:false}))}); };
 $('#pQuit').onclick = () => { $('#pauseM').classList.remove('on'); if (!G.test && G.mode === 'play'){ GV(G.vid).fuel = G.fuel; save(); } toMenu('routes'); };
 $('#pHelp').onclick = () => $('#helpM').classList.add('on'); $('#helpOk').onclick = () => $('#helpM').classList.remove('on');
 $('#rCall').onclick = () => { if (G.rest) G.rest.called = true; }; $('#rLeave').onclick = closeRest;
 $('#langBtn').onclick = () => { LANG = S.lang = LANG === 'ar' ? 'en' : 'ar'; save(); applyLang(); };
 document.addEventListener('pointerdown', e => { if (!e.target.closest('.pan') && !e.target.closest('#ctrls')) $$('.pan').forEach(p => p.classList.remove('on')); });
}
const KEYMAP2 = {KeyH:'horn', KeyQ:'indL', KeyE:'indR', KeyZ:'haz', KeyL:'light', KeyB:'belt', KeyG:'gear'};
Object.keys(KEYMAP).forEach(k => delete KEYMAP[k]); Object.assign(KEYMAP, KEYMAP2);
addEventListener('keydown', e => { if (G.mode !== 'play' || e.repeat) return; if (e.code === 'BracketRight' || e.code === 'KeyN') tune(1); if (e.code === 'BracketLeft') tune(-1); if (e.code === 'KeyF') G.fan = ((G.fan || 0) + 1) % 5; if (e.code === 'Minus') G.acSet = Math.max(16, G.acSet - 1); if (e.code === 'Equal') G.acSet = Math.min(30, G.acSet + 1); });
function updateHUD(dt){
 hudT -= dt; if (hudT > 0) return; hudT = .12; const car = G.car, V = G.V, p = clamp(car.x / W.len * 100, 0, 100);
 $('#trPr').style.width = p + '%'; $('#trMe').style.left = p + '%';
 const st = W.stops[G.nextIdx]; $('#nextName').textContent = st ? (G.nextIdx === W.stops.length - 1 ? t('lastStop') : t('next')) + ': ' + nm(st.name) : '✓'; $('#nextDist').textContent = st ? fmt(Math.max(0, Math.round(st.x - doorX()))) + ' m' : '';
 $('#cMoney').innerHTML = icon('coins') + fmt(Math.round(G.T.fares + G.T.tips + G.T.cargo)); $('#cPax').innerHTML = icon('seat') + fmt(G.onboard.length) + '/' + fmt(seatsOf(V));
 const ck = G.parcels.filter(q => q.on).reduce((a, q) => a + q.kg, 0); $('#cCargo').style.display = G.parcels.length ? '' : 'none'; $('#cCargo').innerHTML = '📦' + fmt(ck);
 const mood = G.onboard.length ? (G.comfort > 75 ? '😊' : G.comfort > 50 ? '🙂' : G.comfort > 30 ? '😐' : '😠') : '·'; $('#cTemp').innerHTML = mood + ' ' + fmt(Math.round(G.cabin)) + '°';
 const hr = {day:10, sunset:17, night:21}[G.tod] + G.time / 120; $('#cClock').innerHTML = fmt(Math.floor(hr % 24)) + ':' + String(Math.floor((hr % 1) * 60)).padStart(2, '0').replace(/\d/g, d => LANG === 'ar' ? AR_DIG[d] : d);
 const lim = curLimit(car.x); $('#limitV').textContent = lim; $('#limitChip').classList.toggle('over', speedOf(car) * 3.6 > lim + 3);
 $('#startBtn').classList.toggle('show', !G.engOn && G.mode === 'play');
 $('#bBelt').classList.toggle('act', G.belt); $('#bLight').classList.toggle('act', !!car.headOn); $('#bHaz').classList.toggle('act', !!car.haz); $('#bGear').classList.toggle('act', !!car.rev); $('#bRadio').classList.toggle('act', G.radioOn); $('#bAC').classList.toggle('act', !!(G.ac || G.fan)); $('#bCC').classList.toggle('act', !!G.cruise);
 $('#bIndL').classList.toggle('act', car.ind === -1); $('#bIndR').classList.toggle('act', car.ind === 1);
 const stn = STATIONS[S.radio.st], stat = {live:'● LIVE', tune:'⋯ ' + (LANG === 'ar' ? 'بيدور' : 'TUNING'), offline:(LANG === 'ar' ? 'بث محلي' : 'OFFLINE MIX'), off:''}[RADIO.status] || '';
 $('#radioLCD').innerHTML = G.radioOn ? `<b>${LANG === 'ar' ? stn.ar : stn.en}</b><span>${stn.fm ? 'FM ' + stn.fm + ' · ' : ''}${stat}</span><span>VOL ${'▮'.repeat(Math.round(S.set.radio * 10))}${'▯'.repeat(10 - Math.round(S.set.radio * 10))}</span>` : '<b>OFF</b>';
 $$('.rpre').forEach((e, i) => e.title = LANG === 'ar' ? STATIONS[S.radio.pre[i]].ar : STATIONS[S.radio.pre[i]].en);
 $('#acLCD').innerHTML = `<b style="font-size:1.05em">${G.ac ? '❄ ' : ''}${G.acSet}°C</b><span>${'▮'.repeat(G.fan || 0)}${'▯'.repeat(4 - (G.fan || 0))} ${G.recirc ? '⟲' : ''} ${G.vent === 'face' ? '↗' : '↘'} ${G.defrost ? 'DEF' : ''} · ${Math.round(G.cabin)}°</span>`;
 $('#acOn').classList.toggle('on', !!G.ac); $('#acRec').classList.toggle('on', !!G.recirc); $('#acVent').classList.toggle('on', G.vent === 'feet'); $('#acDef').classList.toggle('on', !!G.defrost); $('#ccOn').classList.toggle('on', !!G.cruise);
}
function drawWeather(){
 if (G.weather === 'rain'){ ctx.strokeStyle = 'rgba(200,215,240,.4)'; ctx.lineWidth = 1.1; ctx.beginPath(); for (let i = 0; i < (S.set.gfx === 'low' ? 60 : 170); i++){ const x = (hash(i) * VW * 1.2 + G.time * 90 * (1 + hash(i + 3))) % (VW * 1.2) - VW * .1, y = (hash(i + 7) * VH + G.time * 900 * (1 + hash(i + 5) * .4)) % VH; ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); } ctx.stroke();
  const wp = (G.time * .9) % 1; ctx.fillStyle = 'rgba(200,220,255,.16)'; for (const d of DROPS){ if (d.x > wp && d.x < wp + .25) continue; ctx.beginPath(); ctx.arc(d.x * VW, ((d.y * VH + G.time * 10 * d.r) % VH), 2 + d.r * 5, 0, 7); ctx.fill(); } }
 if ((G.fog || 0) > .02){ const g = ctx.createRadialGradient(VW / 2, VH * .45, VH * .1, VW / 2, VH * .45, VW * .7); g.addColorStop(0, `rgba(215,225,235,${G.fog * .35})`); g.addColorStop(1, `rgba(215,225,235,${G.fog * .7})`); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); }
 if (G.weather === 'sand'){ const g = ctx.createLinearGradient(0, 0, VW, 0); g.addColorStop(0, 'rgba(214,160,90,.42)'); g.addColorStop(1, 'rgba(190,130,70,.22)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.fillStyle = 'rgba(230,190,130,.5)'; for (let i = 0; i < 90; i++){ const x = (VW - (hash(i) * VW + G.time * 420 * (1 + hash(i + 2))) % VW), y = hash(i + 4) * VH; ctx.fillRect(x, y, 6 + hash(i) * 10, 1.5); } }
}
