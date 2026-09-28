"use strict";
/* =====================================================================
   OGRAAA v5 — real panoramas, smart street building placement,
   landmark-aware stops, toll gates, pedestrian crossing warnings,
   crash-proof render loop
   ===================================================================== */
/* ---------------- crash-proof main loop (no more blank game screen) ---------------- */
function frame(now){
 requestAnimationFrame(frame); const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
 if (G.mode !== 'play' || !G.car) return;
 if (!VW || !cv.width) resize();
 G._dt = G.paused ? 0 : dt;
 if (!G.paused){ try{ update(dt); }catch(e){ reportErr('update', e); } try{ tickRest(dt); updateHUD(dt); }catch(e){ reportErr('hud', e); } }
 try{ render(); }catch(e){ reportErr('render', e); try{ ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.restore(); }catch(_){} }
 try{ drawCluster(); }catch(e){ reportErr('cluster', e); }
}
const ERRS = {};
function reportErr(where, e){ const k = where + (e && e.message); if (!ERRS[k]){ ERRS[k] = 1; console.error('[Ograaa]', where, e); } }
function render(){
 ctx.setTransform(DPR, 0, 0, DPR, 0, 0); const sh = cam.shake * 6; ctx.save(); if (sh) ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
 const stage = (n, f) => { try{ f(); }catch(e){ reportErr(n, e); } };
 stage('sky', drawSky); stage('layers', drawLayers); stage('world', drawWorld);
 const car = G.car, farA = G.ai.filter(a => a.lift > .4).sort((a, b) => b.lift - a.lift), nearA = G.ai.filter(a => a.lift <= .4);
 stage('far', () => { for (const a of farA) drawVehicle(a, {lift:a.lift, scale:1 - .1 * a.lift / .82, dim:true, shadow:false}); });
 stage('officer', () => { for (const c of W.cps) if (Math.abs(c.x - car.x) < 80) drawOfficer(c); });
 const px = G.pedX, pedY = px ? 1.85 - px.k * 2.3 : 0;
 stage('ped', () => { if (px && pedY > .3) drawPed(px.t, px.x, terrH(px.x) + pedY, px.d, 1, 1, px.h); for (const w of G.walkers) drawPed(w.t, w.x, terrH(w.x) + (w.y || 0), w.d, w.face, w.a ?? 1, w.h); });
 stage('near', () => { for (const a of nearA) drawVehicle(a, {lift:a.lift}); });
 stage('player', () => drawVehicle(car));
 stage('ped2', () => { if (px && pedY <= .3) drawPed(px.t, px.x, terrH(px.x) + pedY, px.d, 1, 1, px.h); drawCrossWarn(); });
 stage('front', drawFront); stage('parts', drawParts); stage('night', drawNight); stage('bub', () => drawBubbles(G._dt || 0)); stage('weather', drawWeather);
 ctx.restore();
}
/* ---------------- real skyline panoramas per region ---------------- */
const PANO = {city:['pCairo','pResid'], mokattam:['pCitadel','pIslamic'], nile:['pCorniche','pNileHigh'], ring:['pBusiness','pNewCairo'], alex:['pCoast','pResid'], desert:['pDesert','pDesertFuel'], redsea:['pDesert','pCoast'], sinai:['pDesert','pDesertFuel'], upper:['pDesert','pFarm']};
const PTINT = {};
function panoTint(k, layer){ const key = k + G.tod + layer + (G.weather === 'sand' ? 's' : ''); if (PTINT[key]) return PTINT[key]; const im = IMG[k]; if (!im || !im.width) return null; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-atop'; const P = skyPal();
 const a = G.tod === 'night' ? (layer ? .55 : .7) : (layer ? .16 : .36) + (G.weather === 'sand' ? .25 : 0); x.fillStyle = G.tod === 'night' ? `rgba(8,14,34,${a})` : rgb(P.haze, a); x.fillRect(0, 0, c.width, c.height);
 if (G.tod === 'sunset'){ x.fillStyle = 'rgba(255,140,70,.14)'; x.fillRect(0, 0, c.width, c.height); }
 if (G.tod === 'night'){ const r = mulberry(k.length * 13 + layer); for (let i = 0; i < c.width * c.height / 700; i++){ const px = r() * c.width, py = r() * c.height * .8; x.fillStyle = `rgba(255,${200 + r() * 40 | 0},130,${.55 + r() * .4})`; x.fillRect(px, py, 1.6, 2); } }
 return PTINT[key] = c; }
function drawLayers(){
 const hz = horizon(), keys = PANO[W.route.biome] || PANO.city, P = skyPal(), night = G.tod === 'night';
 const strip = (k, f, base, h, layer) => { const im = panoTint(k, layer); if (!im) return; const w = im.width / im.height * h; let x0 = -((cam.x * PPM * f) % w); if (x0 > 0) x0 -= w; for (let x = x0; x < VW; x += w - 1) ctx.drawImage(im, x, base - h, w, h); };
 strip(keys[0], .025, hz + VH * .06, VH * .19, 0);
 // soft ground plane between the far skyline and the street
 const g = ctx.createLinearGradient(0, hz + VH * .04, 0, VH); g.addColorStop(0, night ? '#1a2030' : rgb(P.haze, 1)); g.addColorStop(1, night ? '#12151c' : mix(W.biome.ground, '#8a8070', .5)); ctx.fillStyle = g; ctx.fillRect(0, hz + VH * .055, VW, VH);
 if (keys[1]) strip(keys[1], .09, hz + VH * .17, VH * .26, 1);
 const fog = ctx.createLinearGradient(0, hz - VH * .05, 0, hz + VH * .25); fog.addColorStop(0, rgb(P.haze, 0)); fog.addColorStop(1, rgb(P.haze, night ? .06 : G.weather === 'sand' ? .45 : .12)); ctx.fillStyle = fog; ctx.fillRect(0, hz - VH * .05, VW, VH * .3);
}
/* ---------------- smart street placement ---------------- */
Object.assign(PROP_H, {});
const BH5 = {bOld:17, bNew:19, bPharm:15, bKosh:12.5, bMarket:12, bTrans:11, bSchool:9.5, bPolice:8, bHosp:8.5, bStation:7.5, bCafe:8, bWare:8.5,
 sWorkshop:6.5, sTyreShed:5, sWash:5.5, sFuel:5.8, sEV:5, sKiosk:3.8, sBakery:9, sButcher:9, sPharm2:9, sSuper:9.5, sAhwa:10, sResShops:18, sOffice:16, sFish:11, sHotel:14, sFerry:8,
 sFire:11, sPost:8, sBank:9, sCourt:11, sCitizen:8.5, sWorkshop2:8, sTyres:7.5, sFuel2:7.5, sTerminal:8, sRest:9, sFoul:13, sGrill:13, sJuice:12, sSweets:12.5, sRestaurant:15,
 sLibrary:13, sYouth:9, sRegistry:12, sCollege:13, sLabs:13, sMobiles:13, sFurniture:15, sBarber:12, sBooks:12.5, sOffices:15, sTrain:14, sMetro:11, sTram:11, sParking:14, sToll:9,
 sDairy:12, sCarpentry:12, sSmith:10, sAgri:11, sBuildMat:14, sNubian:13, sCrops:12, sOldAlex:14, sSinaiRest:11, sSeaTrips:13};
const PAL = {
 city:{gap:[.15,.7], dens:.97, w:{bOld:3, bNew:2, bPharm:1, bKosh:1, bMarket:1, bTrans:.4, sResShops:3, sFoul:1, sGrill:1, sJuice:1, sSweets:1, sRestaurant:1, sBakery:1, sButcher:.6, sPharm2:.8, sSuper:1, sAhwa:1, sMobiles:1, sFurniture:.6, sBarber:1, sBooks:.6, sOffices:.8, sBank:.5, sPost:.3, sLabs:.5, sRegistry:.3, sLibrary:.3, sParking:.3}},
 mokattam:{gap:[.2,1.2], dens:.95, w:{bOld:3, sResShops:2, sFoul:1.2, sGrill:1, sAhwa:1.2, sBakery:1, sButcher:1, sCarpentry:.8, sSmith:.8, sBuildMat:.6, sSweets:.8, bKosh:1, sBarber:.6, sMobiles:.5}},
 nile:{gap:[.6,2.5], dens:.93, w:{sResShops:2, sOffice:1.5, sHotel:1.5, sFish:1, sAhwa:1, bNew:2, bOld:1, sBank:.8, sRestaurant:1, sOffices:1, sJuice:.6, sCitizen:.3, sCourt:.3, sPharm2:.6}},
 ring:{gap:[3,12], dens:.8, w:{sOffice:2, sOffices:2, bNew:2, sFurniture:1, sMobiles:1, sParking:.8, sCollege:.5, sTyres:.8, sWorkshop2:.6, sSuper:1, sLabs:.6, sBank:.6, sWash:.5, sBuildMat:.5, sEV:.4}},
 alex:{gap:[.3,1.8], dens:.95, w:{sOldAlex:3, sFish:2, sHotel:1.5, sResShops:1.5, sAhwa:1.2, sJuice:1, sSweets:1, bOld:1, sBakery:.8, sPharm2:.8, sSeaTrips:.4, sBooks:.4}},
 desert:{gap:[30,90], dens:.55, w:{sKiosk:2, sTyreShed:1.5, sWorkshop2:1, sBuildMat:1, sDairy:.8, sAgri:.6, bWare:1.5, sWash:.6}},
 redsea:{gap:[35,95], dens:.55, w:{sKiosk:1.5, sSeaTrips:1.5, sHotel:1, sFish:.8, sTyreShed:.8, sWorkshop2:.5}},
 sinai:{gap:[40,110], dens:.5, w:{sKiosk:2, sSinaiRest:.8, sTyreShed:.8, sWorkshop2:.5}},
 upper:{gap:[6,40], dens:.7, w:{sNubian:2, sCrops:2, sAgri:1.5, sDairy:.8, sKiosk:1, bOld:.8, sBakery:.5, sCarpentry:.5}}
};
const LANDMARK = [[/Ramses|Sidi Gaber/i,'sTrain'],[/Tahrir|Giza Square|Dokki/i,'sMetro'],[/Raml Station|Manshia/i,'sTram'],[/University/i,'sCollege'],[/Esaaf/i,'bHosp'],[/Pyramids|Montaza|Zamalek|Garden City/i,'sHotel'],[/Imbaba|Qanater|Maadi Corniche|Old Cairo/i,'sFerry'],[/Hurghada|Sharm|Sokhna/i,'sSeaTrips'],[/Aswan|Luxor/i,'sNubian'],[/Ataba/i,'sPost'],[/Opera/i,'sLibrary'],[/Abbassia/i,'sCourt'],[/Faisal|Talbeya|Masaha/i,'sFoul'],[/Nasr City|District/i,'sOffices'],[/Mokattam|Plateau|Street 9/i,'sAhwa'],[/Port Said|Matrouh|Alexandria/i,'sFish']];
function v5world(){
 const r = mulberry(W.seed + 77), len = W.len, B = W.route.biome, type = W.route.type, pal = PAL[B] || PAL.city, busy = [], deco = [];
 const bw = k => (BH5[k] || 10) * META[k].w / META[k].h;
 const free = (a, b) => !busy.some(q => b > q[0] - .3 && a < q[1] + .3) && !(W.water || []).some(w => b > w[0] - 2 && a < w[1] + 2);
 const add = (k, x, force) => { if (!IMG[k] && !ASSETS[k]) return false; const w = bw(k), a = x - w / 2, b = x + w / 2; if (!force && !free(a, b)) return false; busy.push([a, b]); deco.push({k, x, h:BH5[k] || 10, w}); return true; };
 // anchors: terminals, stations, rest houses, fuel, checkpoints, toll gate, landmarks near named stops
 W.stops.forEach((s, i) => { const term = i === 0 || i === W.stops.length - 1; if (term) add(type === 'micro' ? 'sTerminal' : 'bStation', s.x + (type === 'coach' ? 2 : 4), true);
  else { const en = s.name[1]; const lm = LANDMARK.find(([re]) => re.test(en)); if (lm) add(lm[1], s.x + 14) || add(lm[1], s.x - 16); } });
 W.cps.forEach(c => add('bPolice', c.x + 6, true));
 W.rests.forEach(q => { add(B === 'sinai' ? 'sSinaiRest' : 'sRest', q.x + 2, true); add('sKiosk', q.x + 16); add('sFuel', q.x - 22); });
 W.gas.forEach(g => add(W.biome.urban > .3 ? 'sFuel2' : 'sFuel', g.x, true));
 if (type === 'coach' || B === 'ring' || B === 'desert'){ const tx = Math.round(type === 'coach' ? len * .045 + 60 : len * .12); W.toll = {x:tx, paid:false, fee:({micro:15, bus:30, coach:45})[type]}; add('sToll', tx, true); } else W.toll = null;
 if (W.biome.urban > .3){ const sch = W.ev && W.ev.find(e => e.kind === 'school'); if (sch) add('bSchool', sch.x + sch.w / 2, true); if (r() < .6) add('sFire', len * (.3 + r() * .4)); if (r() < .5) add('sWorkshop', len * (.2 + r() * .6)); if (r() < .5) add('sWash', len * (.2 + r() * .6)); }
 // fill the street with a believable mix (no immediate repeats, region-weighted)
 const keys = Object.keys(pal.w).filter(k => ASSETS[k]), tot = keys.reduce((a, k) => a + pal.w[k], 0); let prev = [], x = -40;
 const pickK = () => { for (let t = 0; t < 8; t++){ let q = r() * tot; for (const k of keys){ q -= pal.w[k]; if (q <= 0){ if (!prev.includes(k)) return k; break; } } } return keys[(r() * keys.length) | 0]; };
 while (x < len + 140){ const k = pickK(), w = bw(k); if (r() < pal.dens && free(x, x + w)){ busy.push([x, x + w]); deco.push({k, x:x + w / 2, h:BH5[k] || 10, w}); prev = [k, prev[0]]; x += w + pal.gap[0] + r() * (pal.gap[1] - pal.gap[0]); } else x += Math.max(2, pal.gap[0]) + (busy.some(q => x >= q[0] - .3 && x <= q[1] + .3) ? 1 : r() * 6); }
 W.deco = deco; W.props = W.props.filter(p => p.k !== 'fuel');
 // keep sidewalk props clear of big anchor buildings' doorways: drop small clutter right in front of terminals/stations
 W.props = W.props.filter(p => !(['bench','bin','hydrant','planter','meter','bollard'].includes(p.k) && deco.some(d => /Terminal|bStation|sFuel|sToll/.test(d.k) && Math.abs(d.x - p.x) < d.w / 2)));
}
const _startRoute5 = startRoute;
startRoute = function(route, opt){ _startRoute5(route, opt); try{ v5world(); }catch(e){ reportErr('v5world', e); } };
/* ---------------- toll gate + pedestrian crossing awareness ---------------- */
const _v2tick5 = v2tick;
v2tick = function(dt, spd, full){ _v2tick5(dt, spd, full); if (!full) return; const car = G.car, front = car.x + car.L / 2;
 if (W.toll && !W.toll.paid){ const d = W.toll.x - front; if (!W.toll.warn && d < 150 && d > 0){ W.toll.warn = 1; toast(L2('بوابة رسوم قدام — ', 'Toll gate ahead — ') + money(W.toll.fee), 'gold'); } if (front > W.toll.x){ W.toll.paid = true; if (!G.test){ G.T.fee += W.toll.fee; } AU.coin(); toast('🛣 ' + L2('اتدفعت رسوم الطريق ', 'Road toll paid ') + money(W.toll.fee), 'gold'); } }
 const p = G.pedX; if (p){
  if (!p.init){ p.init = true; p.wait = 2.8; if (p.x - front < 40) p.x = front + 42 + Math.random() * 10; p.warned = false; }
  if (p.wait > 0){ p.wait -= dt; p.k = 0; }
  const d = p.x - front; if (!p.warned && d < 60){ p.warned = true; AU.tone(880, .12, 'square', .06); AU.tone(880, .12, 'square', .06, .2); toast('🚸 ' + L2('حد هيعدي الشارع قدامك — ', 'Pedestrian crossing ahead — ') + fmt(Math.max(0, Math.round(d))) + ' m', 'bad', null, 3.5); }
 }
};
function drawCrossWarn(){
 const p = G.pedX; if (!p || G.mode !== 'play') return; const t = G.time, pulse = .5 + .5 * Math.sin(t * 8);
 // pulsing amber crossing band across the road + zebra ghost
 roadQuad(p.x - 1.4, p.x + 1.4, 1.42, -.22); ctx.fillStyle = `rgba(255,190,40,${.18 + .22 * pulse})`; ctx.fill();
 ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let i = -1.2; i < 1.2; i += .6) { roadQuad(p.x + i, p.x + i + .3, 1.4, -.2); ctx.fill(); }
 // warning sign above the pedestrian
 const off = sx(p.x) > VW - 50, X = off ? VW - 70 : sx(p.x), Y = off ? VH * .42 : sy(terrH(p.x) + 4.4 + Math.sin(t * 3) * .1), s = clamp(PPM * .9, 30, 48);
 if (off){ ctx.save(); ctx.fillStyle = `rgba(255,190,40,${.6 + .4 * pulse})`; ctx.beginPath(); ctx.moveTo(VW - 12, Y); ctx.lineTo(VW - 34, Y - 16); ctx.lineTo(VW - 34, Y + 16); ctx.fill(); ctx.font = `700 ${s * .38}px "Readex Pro", sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3; const dd = Math.round(p.x - (G.car.x + G.car.L / 2)) + ' m'; ctx.strokeText(dd, X, Y + s * .95); ctx.fillText(dd, X, Y + s * .95); ctx.restore(); }
 ctx.save(); ctx.translate(X, Y); ctx.fillStyle = `rgba(255,${190 + 40 * pulse | 0},0,1)`; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.lineTo(s * .58, s * .42); ctx.lineTo(-s * .58, s * .42); ctx.closePath(); ctx.fill(); ctx.stroke();
 ctx.font = `${s * .52}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚶', 0, s * .08); ctx.restore();
 if (p.wait > 0){ ctx.save(); ctx.font = `700 ${clamp(PPM * .36, 12, 16)}px "Readex Pro", sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd35a'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3; const tx = L2('مستني يعدي…', 'About to cross…'); ctx.strokeText(tx, X, Y + s * .95); ctx.fillText(tx, X, Y + s * .95); ctx.restore(); }
}
/* ---------------- radio: explain why streams are silent inside claude.ai ---------------- */
const EMBED = (() => { try{ return window.top !== window.self || /claude/.test(location.hostname) || /claudeusercontent|claude\.site/.test(location.hostname); }catch(e){ return true; } })();
const _rfb = RADIO.fallback.bind(RADIO);
RADIO.fallback = function(){ _rfb(); if (EMBED && !RADIO._told){ RADIO._told = true; toastUI(L2('الراديو المباشر ممنوع جوه صفحة claude.ai — نزّل ملف اللعبة وافتحه على جهازك عشان تسمع المحطات', 'Live radio is blocked inside the claude.ai page — download the game file and open it on your device to hear the stations'), 'gold', null, 7); } };
const _uh5 = updateHUD;
updateHUD = function(dt){ const due = hudT - dt <= 0; _uh5(dt); if (due && G.radioOn && RADIO.status === 'nosig' && EMBED) $('#radioLCD').innerHTML = `<b>${L2('مفيش إشارة', 'NO SIGNAL')}</b><span>${L2('نزّل الملف للبث المباشر', 'Download file for live radio')}</span>`; };
/* traffic lights & crossings: pedestrians cross more often at zebras, always announced */
const _re5 = randomEvent;
randomEvent = function(){ const car = G.car, z = W.decals.find(d => d.k === 'zebra' && d.x - car.x > 45 && d.x - car.x < 110); if (z && !G.pedX && Math.random() < .5){ G.pedX = {x:z.x, k:0, d:0, t:(Math.random() * META.peds.length) | 0, h:1.65}; return; } _re5(); };
