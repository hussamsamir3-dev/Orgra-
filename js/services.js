"use strict";
/* =====================================================================
   OGRAAA v6 — vehicle storage (trunk), roadside service stops
   (café, fuel station, workshop), parking brake, anti-rollback,
   disciplined AI, richer dialogue, settings from the pause menu
   ===================================================================== */
/* ---------------- AI wheels: rotate only the rim + inner tyre about the refined hub ---------------- */
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr], bike = spr === 'ai5' || spr === 'ai6' || spr === 'ai4';
 return AIWHEELS[spr] = META[spr].wheels.map(([cx, cy, r]) => { const R = r * (bike ? .58 : .88), S = Math.ceil(R) * 2 + 2, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.beginPath(); x.arc(S / 2, S / 2, R, 0, 7); x.clip(); x.drawImage(im, -(cx - S / 2), -(cy - S / 2)); return c; }); }
/* ---------------- storage catalogue ---------------- */
const ITEMS = [
 {id:'jerry', ic:'⛽', kg:18, p:950, n:['جركن سولار ٢٠ لتر','Diesel jerrycan (20 L)'], d:['ينقذك لو البنزين خلص','Saves you when the tank runs dry'], use:'fuel'},
 {id:'water', ic:'💧', kg:6, p:45, n:['كرتونة مياه','Water pack'], d:['وزّعها على الركاب في الحر','Hand out to passengers in the heat'], use:'water'},
 {id:'coffee', ic:'☕', kg:1, p:35, n:['ترمس قهوة','Coffee thermos'], d:['تركيزك يرجع ١٠٠٪','Restores full alertness'], use:'coffee'},
 {id:'tea', ic:'🫖', kg:.8, p:15, n:['شاي كشري','Strong tea'], d:['تركيز +٤٠','Alertness +40'], use:'tea'},
 {id:'food', ic:'🥙', kg:.5, p:25, n:['ساندوتش فول وطعمية','Foul & taameya sandwich'], d:['طاقة وتركيز','Energy & focus'], use:'food'},
 {id:'snacks', ic:'🍬', kg:1, p:40, n:['حلويات للعيال','Sweets for kids'], d:['الركاب مبسوطين +١٠','Passenger mood +10'], use:'snacks'},
 {id:'tissue', ic:'🧻', kg:.5, p:20, n:['علبة مناديل','Tissue box'], d:['راحة الركاب (سلبي)','Passive comfort bonus'], passive:true},
 {id:'fresh', ic:'🌸', kg:.2, p:30, n:['معطر عربية','Air freshener'], d:['راحة الركاب (سلبي)','Passive comfort bonus'], passive:true},
 {id:'aid', ic:'🩹', kg:1, p:150, n:['شنطة إسعافات','First-aid kit'], d:['مطلوبة في الكماين','Required at checkpoints'], passive:true, legal:true},
 {id:'ext', ic:'🧯', kg:3, p:250, n:['طفاية حريق','Fire extinguisher'], d:['مطلوبة في الكماين','Required at checkpoints'], passive:true, legal:true},
 {id:'tri', ic:'⚠️', kg:1.5, p:80, n:['مثلث عاكس','Warning triangle'], d:['مطلوب في الكماين','Required at checkpoints'], passive:true, legal:true},
 {id:'spare', ic:'🛞', kg:18, p:900, n:['كاوتش احتياطي','Spare tyre'], d:['غيّر الكاوتش النايم (مع العدة)','Swap a flat tyre (needs tool kit)'], use:'spare'},
 {id:'tools', ic:'🧰', kg:6, p:350, n:['شنطة عدة','Tool kit'], d:['مطلوبة لتغيير الكاوتش','Needed for tyre changes'], passive:true},
 {id:'oil', ic:'🛢️', kg:1, p:260, n:['جركن زيت ١ لتر','Engine oil (1 L)'], d:['الزيت +٣٥٪','Oil +35%'], use:'oil'},
 {id:'cool', ic:'🧊', kg:1.5, p:120, n:['مياه ردياتير','Coolant'], d:['يبرّد الموتور فوراً','Cools the engine instantly'], use:'cool'}
];
const IBY = id => ITEMS.find(i => i.id === id);
const inv = vid => { const g = GV(vid || G.vid || S.sel); return g.inv || (g.inv = {aid:0, ext:0, tri:0}); };
const invKg = vid => Object.entries(inv(vid)).reduce((a, [k, q]) => a + (IBY(k) ? IBY(k).kg * q : 0), 0);
const storeCap = vid => { const V = VBY(vid), g = GV(vid); return V.store * (1 + .2 * (g.up.store || 0)) + (g.cos.rack && V.rack ? 150 : 0); };
function addItem(vid, id, q){ const I = IBY(id); if (invKg(vid) + I.kg * q > storeCap(vid) + .01){ toastUI(L2('الشنطة مليانة', 'Storage is full') + ` (${fmt(Math.round(storeCap(vid)))} ${t('kg')})`, 'bad'); return false; } inv(vid)[id] = (inv(vid)[id] || 0) + q; save(); return true; }
function useItem(id){ const bag = inv(G.vid), I = IBY(id); if (!bag[id]) return; const car = G.car, pax = G.onboard.length; let ok = true;
 switch (I.use){
  case 'fuel': if (G.fuel > G.fuelMax - 19){ toastUI(L2('التانك تقريباً مليان', 'Tank is nearly full')); ok = false; break; } G.fuel = Math.min(G.fuelMax, G.fuel + 20); G.fuelOutT = 0; toastUI('⛽ +20 L', 'good'); AU.noiseHit(1.2, 700, .12, 0, 'lowpass'); break;
  case 'water': if (pax){ G.comfort = Math.min(100, G.comfort + 15); say(pick(DLG6.water), car.x, car.y + car.yt + .9); S.stats.gifts = (S.stats.gifts || 0) + 1; } else G.alert = Math.min(100, G.alert + 15); break;
  case 'coffee': G.alert = 100; G.focus = 60; toastUI('☕ ' + L2('فوقت!', 'Wide awake!'), 'good'); break;
  case 'tea': G.alert = Math.min(100, G.alert + 40); G.focus = 30; break;
  case 'food': G.alert = Math.min(100, G.alert + 30); G.focus = 40; break;
  case 'snacks': if (!pax){ ok = false; toastUI(L2('مفيش ركاب', 'No passengers aboard')); break; } G.comfort = Math.min(100, G.comfort + 10); say(pick(DLG6.snacks), car.x, car.y + car.yt + .9); break;
  case 'spare': { const w = car.wh.find(q => q.flat); if (!w){ ok = false; toastUI(L2('مفيش كاوتش نايم', 'No flat tyre')); break; } if (!bag.tools){ ok = false; toastUI(L2('محتاج شنطة عدة', 'You need a tool kit'), 'bad'); break; } if (speedOf(car) > .5){ ok = false; toastUI(L2('وقف الأول', 'Stop first'), 'bad'); break; } G.busyT = 6; G.busyMsg = L2('بتغير الكاوتش…', 'Changing the tyre…'); setTimeout(() => { w.flat = false; w.r = w.r0; toastUI('🛞 ' + L2('الكاوتش اتغير', 'Tyre changed'), 'good'); }, 6000); break; }
  case 'oil': if (!G.test) GV(G.vid).cond.oil = Math.min(100, GV(G.vid).cond.oil + 35); toastUI('🛢️ +35%', 'good'); break;
  case 'cool': G.temp = Math.min(G.temp, 78); G.coolT = 90; toastUI('🧊 ' + L2('الموتور برد', 'Engine cooled'), 'good'); break;
 }
 if (ok){ bag[id]--; S.stats.itemsUsed = (S.stats.itemsUsed || 0) + 1; AU.click(); save(); renderTrunk(); }
}
function missingKit(vid){ const b = inv(vid), V = VBY(vid); const need = V.cls === 'micro' ? ['ext', 'tri'] : ['ext', 'tri', 'aid']; return need.filter(k => !b[k]); }
/* ---------------- dialogue: many context-aware lines ---------------- */
const DLG6 = {
 water:[['الله يكرمك يا أسطى','God bless you, driver'],['والله إنت ابن حلال','You\'re a good man'],['مية ساقعة في الحر ده؟ تسلم','Cold water in this heat? Thank you']],
 snacks:[['العيال فرحانين!','The kids are happy!'],['شكراً يا عمو','Thanks, uncle']],
 rain:[['الدنيا بتمطر، براحة يا أسطى','It\'s raining — take it easy'],['الأرض بتزحلق','The road is slippery']],
 night:[['الدنيا ليلت','It got dark'],['شغّل النور يا أسطى','Turn the lights on, driver']],
 cpNerv:[['كمين! معاك الرخص؟','Checkpoint! Got your papers?'],['ربنا يستر','Let\'s hope it\'s quick']],
 cpOk:[['الحمد لله عدينا','Thank God, we\'re through']],
 red:[['الإشارة حمرا يا أسطى!','Red light, driver!'],['استنى الإشارة','Wait for the light']],
 radar:[['في رادار قدام!','Speed camera ahead!'],['هدّي، في رادار','Slow down, there\'s a camera']],
 amb:[['وسع للإسعاف','Make way for the ambulance'],['ربنا يشفيه','May God heal them']],
 ped:[['خد بالك في حد بيعدي!','Watch out, someone\'s crossing!'],['حاسب!','Careful!']],
 fuel:[['البنزين قرب يخلص يا أسطى','Fuel\'s almost out, driver'],['هنقف نفوّل؟','Are we stopping for fuel?']],
 hotEng:[['في ريحة سخونية!','Something smells hot!'],['الموتور بيدخن؟','Is the engine smoking?']],
 flat:[['الكاوتش نام!','We\'ve got a flat!'],['العجلة فرقعت','The tyre just popped']],
 toll:[['الكارتة غليت','Tolls went up again'],['الطريق ده حلو بس غالي','Nice road, but pricey']],
 chat:[['الأسعار بقت نار','Prices are through the roof'],['الأهلي هيكسب النهارده','Al Ahly will win tonight'],['الزمالك راجع بقوة','Zamalek is coming back strong'],['ابني طالع الأول على دفعته','My son topped his class'],['الشغل النهارده كان كتير','Work was hectic today'],['الجو حلو النهارده','Lovely weather today'],['هو إحنا فين دلوقتي؟','Where are we now?'],['الطريق زحمة كده ليه؟','Why is traffic so heavy?'],['اتصل بيا، أنا في الميكروباص','Call me back, I\'m on the microbus'],['المترو كان زحمة موت','The metro was packed'],['أحسن سواق ركبت معاه','Best driver I\'ve ridden with'],['عايز أنزل عند الصيدلية','I need to get off at the pharmacy']],
 cafe:[['أهلاً يا أسطى، شاي ولا قهوة؟','Welcome driver — tea or coffee?'],['نورت القهوة يا باشا','Welcome back, boss']],
 gas:[['أفوّل كام يا باشا؟','How much should I fill, boss?'],['فول ولا بالفلوس؟','Full tank or by amount?']],
 shop:[['العربية مالها يا أسطى؟','What\'s wrong with her, driver?'],['هنظبطهالك في ثانية','We\'ll sort her out in no time']],
 wantTea:[['يا أسطى ما تقف على قهوة','Driver, stop at a café please'],['نفسي في كوباية شاي','I could really use a tea']]
};
function paxSay(k){ const car = G.car; if (!G.onboard.length) return; say(pick(DLG6[k]), car.x + car.L * .05, car.y + car.yt + .9); G.talkT = Math.max(G.talkT || 0, 5); }
/* ---------------- roadside services along each route ---------------- */
const POI_T = {cafe:{ic:'☕', col:'#ffb36b', n:['قهوة','Café']}, fuel:{ic:'⛽', col:'#ff5a5a', n:['بنزينة','Fuel station']}, shop:{ic:'🔧', col:'#6bb6ff', n:['ورشة','Workshop']}};
function v6world(){
 const len = W.len, r = mulberry(W.seed + 991), urban = W.biome.urban > .3, coach = W.route.type === 'coach';
 const clear = x => W.stops.every(s => Math.abs(s.x - x) > 45) && W.cps.every(c => Math.abs(c.x - x) > 45) && W.lights.every(l => Math.abs(l.x - x) > 35) && W.rests.every(q => Math.abs(q.x - x) > 60) && (!W.toll || Math.abs(W.toll.x - x) > 60) && !inWater(x) && (W.ev || []).every(e => x < e.x - 25 || x > e.x + e.w + 25);
 W.poi = W.gas.map(g => ({type:'fuel', x:g.x, k:urban ? 'sFuel2' : 'sFuel'}));
 const place = (type, k, lo, hi) => { for (let t = 0; t < 40; t++){ const x = Math.round(len * (lo + r() * (hi - lo))); if (clear(x) && W.poi.every(p => Math.abs(p.x - x) > 180)){ W.poi.push({type, x, k}); const w = (BH5[k] || 8) * META[k].w / META[k].h; W.deco = W.deco.filter(d => d.x + d.w / 2 < x - w / 2 - .5 || d.x - d.w / 2 > x + w / 2 + .5); W.deco.push({k, x, h:BH5[k] || 8, w}); return; } } };
 place('cafe', urban ? pick(['sAhwa','sKiosk']) : 'sKiosk', .15, .45);
 place('shop', urban ? pick(['sWorkshop','sWorkshop2']) : pick(['sTyreShed','sWorkshop2']), .5, .85);
 if (coach) place('cafe', 'sKiosk', .55, .9);
 W.poi.sort((a, b) => a.x - b.x);
}
const _sr6 = startRoute;
startRoute = function(route, opt){ _sr6(route, opt); try{ v6world(); }catch(e){ reportErr('v6world', e); } G.pbrake = G.mode === 'play'; G.focus = 0; G.coolT = 0; G.svc = null; G.busyT = 0; G.saidKit = false; G.ctx6 = {}; };
/* ---------------- progress bar icons for every location ---------------- */
const _bt6 = buildTrack;
buildTrack = function(){ _bt6(); const tr = $('#track'), pos = x => clamp(x / W.len * 100, 0, 100); let h = '';
 for (const p of W.poi || []) h += `<i class="tic" style="left:${pos(p.x)}%;--c:${POI_T[p.type].col}" title="${nm(POI_T[p.type].n)}">${POI_T[p.type].ic}</i>`;
 if (W.toll) h += `<i class="tic" style="left:${pos(W.toll.x)}%;--c:#9ad">🛣</i>`; for (const c of W.cps) h += `<i class="tic" style="left:${pos(c.x)}%;--c:#3d7bff">👮</i>`; for (const q of W.rests) h += `<i class="tic" style="left:${pos(q.x)}%;--c:#2fd07a">🍽</i>`;
 tr.insertAdjacentHTML('beforeend', h); };
/* ---------------- service modal (café / fuel / workshop) ---------------- */
function svcOptions(type){ const V = G.V, g = GV(G.vid), price = Math.round(DIESEL * (1 + ((W.seed % 7) - 3) / 100) * 100) / 100, need = Math.max(0, G.fuelMax - G.fuel), flats = G.car.wh.filter(w => w.flat).length, pax = G.onboard.length;
 if (type === 'fuel') return [
  {ic:'⛽', n:[`فوّل التانك (${fmt(need, 1)} لتر)`, `Fill up (${fmt(need, 1)} L)`], p:Math.ceil(need * price), t:3, dis:need < 1, fx:() => { G.fuel = G.fuelMax; }},
  {ic:'⛽', n:['١٠ لتر بس', '10 litres only'], p:Math.ceil(10 * price), t:1.5, dis:need < 10, fx:() => { G.fuel = Math.min(G.fuelMax, G.fuel + 10); }},
  {ic:'🛞', n:['قياس هوا الكاوتش (ببلاش)', 'Tyre pressure check (free)'], p:0, t:1.5, dis:!!G.ctx6.tp, fx:() => { G.ctx6.tp = true; G.car.mu *= 1.03; toastUI(L2('الثبات +٣٪', 'Grip +3%'), 'good'); }},
  {ic:'🧽', n:['مسح الزجاج', 'Windscreen clean'], p:10, t:1, fx:() => { G.fog = 0; }},
  {ic:'⛽', n:['جركن سولار مليان', 'Filled jerrycan'], p:IBY('jerry').p, t:1, item:'jerry'}, {ic:'🛢️', n:['زيت موتور', 'Engine oil'], p:IBY('oil').p, t:.5, item:'oil'}, {ic:'🧊', n:['مياه ردياتير', 'Coolant'], p:IBY('cool').p, t:.5, item:'cool'}, {ic:'💧', n:['كرتونة مياه', 'Water pack'], p:IBY('water').p, t:.5, item:'water'},
  {ic:'🪙', n:['بقشيش للعامل', 'Tip the attendant'], p:5, t:.3, fx:() => { say(L2('تسلم يا باشا!', 'Thanks, boss!'), G.car.x + 3, terrH(G.car.x) + 3.4, '#ffd35a'); S.xp += 3; }}];
 if (type === 'cafe') return [
  {ic:'🫖', n:['شاي ليك', 'Tea for you'], p:10, t:1.5, fx:() => { G.alert = Math.min(100, G.alert + 40); G.focus = 30; }},
  {ic:'☕', n:['قهوة تركي', 'Turkish coffee'], p:20, t:2, fx:() => { G.alert = 100; G.focus = 60; }},
  {ic:'🥙', n:['فول وطعمية', 'Foul & taameya'], p:30, t:3, fx:() => { G.alert = Math.min(100, G.alert + 30); }},
  {ic:'🫖', n:[`شاي لكل الركاب (${fmt(pax)})`, `Tea round for passengers (${pax})`], p:pax * 8, t:3, dis:!pax, fx:() => { G.comfort = Math.min(100, G.comfort + 22); S.stats.gifts = (S.stats.gifts || 0) + pax; paxSay('water'); }},
  {ic:'☕', n:['ترمس قهوة للطريق', 'Coffee thermos to go'], p:IBY('coffee').p, t:.5, item:'coffee'}, {ic:'🫖', n:['شاي للطريق', 'Tea to go'], p:IBY('tea').p, t:.5, item:'tea'}, {ic:'🥙', n:['ساندوتشات للطريق', 'Sandwich to go'], p:IBY('food').p, t:.5, item:'food'}, {ic:'💧', n:['كرتونة مياه', 'Water pack'], p:IBY('water').p, t:.5, item:'water'}, {ic:'🍬', n:['حلويات', 'Sweets'], p:IBY('snacks').p, t:.5, item:'snacks'}, {ic:'🧻', n:['مناديل', 'Tissues'], p:IBY('tissue').p, t:.3, item:'tissue'}];
 const fix = (k, m) => Math.round((100 - g.cond[k]) * (8 + V.mass * .004) * m);
 return [
  {ic:'🛞', n:[`تصليح كاوتش نايم (${flats})`, `Fix flat tyres (${flats})`], p:flats * 120, t:4, dis:!flats, fx:() => { G.car.wh.forEach(w => { w.flat = false; w.r = w.r0; }); }},
  {ic:'🔨', n:['سمكرة سريعة (+٢٥٪ صاج)', 'Quick panel fix (+25% body)'], p:Math.round((8 + V.mass * .004) * 25 * .8), t:4, dis:G.test || g.cond.body > 97, fx:() => { g.cond.body = Math.min(100, g.cond.body + 25); }},
  {ic:'🛢️', n:['تغيير زيت', 'Oil change'], p:Math.round(250 + V.mass * .03), t:4, dis:G.test || g.cond.oil > 95, fx:() => { g.cond.oil = 100; }},
  {ic:'🛑', n:['تيل فرامل', 'Brake pads'], p:fix('brakes', .35), t:4, dis:G.test || g.cond.brakes > 95, fx:() => { g.cond.brakes = 100; G.car.brk = G.V.brk * (1 + .1 * upl(G.vid, 'brakes')); }},
  {ic:'🌡', n:['كشف موتور وتبريد', 'Engine & cooling check'], p:Math.max(150, fix('engine', .6)), t:5, dis:G.test, fx:() => { g.cond.engine = Math.min(100, g.cond.engine + 30); G.temp = Math.min(G.temp, 85); }},
  {ic:'🧯', n:['طفاية حريق', 'Fire extinguisher'], p:IBY('ext').p, t:.5, item:'ext'}, {ic:'⚠️', n:['مثلث عاكس', 'Warning triangle'], p:IBY('tri').p, t:.5, item:'tri'}, {ic:'🩹', n:['شنطة إسعافات', 'First-aid kit'], p:IBY('aid').p, t:.5, item:'aid'},
  {ic:'🛞', n:['كاوتش احتياطي', 'Spare tyre'], p:IBY('spare').p, t:.5, item:'spare'}, {ic:'🧰', n:['شنطة عدة', 'Tool kit'], p:IBY('tools').p, t:.5, item:'tools'}]; }
function openSvc(p){ G.svc = p; setDoor(false); const T = POI_T[p.type]; say(pick(DLG6[p.type === 'shop' ? 'shop' : p.type === 'fuel' ? 'gas' : 'cafe']), p.x + 2, terrH(p.x) + 3.6, '#ffd35a'); renderSvc(); $('#svcM').classList.add('on'); }
function renderSvc(){ const p = G.svc; if (!p) return; const T = POI_T[p.type], opts = svcOptions(p.type);
 $('#svcBox').innerHTML = `<div class="svchead" style="--c:${T.col}"><img src="${ASSETS[p.k]}"><div><h2>${T.ic} ${nm(T.n)}</h2><div class="muted">${L2('الفلوس معاك', 'Cash')}: <b class="gold">${money(S.money)}</b> · ${L2('الشنطة', 'Storage')}: <b>${fmt(Math.round(invKg()))}/${fmt(Math.round(storeCap(G.vid)))} ${t('kg')}</b></div></div></div>
 <div class="svcgrid">${opts.map((o, i) => `<button class="svco ${o.dis ? 'dis' : ''}" data-o="${i}" ${o.dis ? 'disabled' : ''}><span class="si">${o.ic}</span><b>${nm(o.n)}</b><span class="sp2">${o.item ? '📦 ' : ''}${o.p ? money(o.p) : L2('ببلاش', 'Free')}</span>${o.item ? `<small>${L2('معاك', 'Have')}: ${fmt(inv()[o.item] || 0)}</small>` : ''}</button>`).join('')}</div>
 <div class="svcbar" id="svcProg"><i></i></div><div class="mbtns"><button class="btn" id="svcLeave">${L2('اتحرك', 'Leave')}</button></div>`;
 $$('#svcBox .svco').forEach(b => b.onclick = () => { if (G.busyT > 0) return; const o = opts[+b.dataset.o]; if (o.dis) return; if (o.item && invKg() + IBY(o.item).kg > storeCap(G.vid)){ toastUI(L2('الشنطة مليانة', 'Storage is full'), 'bad'); return; }
  if (o.p > 0 && !G.test && !spend(o.p, nm(o.n), p.type === 'fuel' ? 'fuel' : p.type === 'shop' ? 'repair' : 'calendar')) return;
  G.busyT = o.t; const bar = $('#svcProg i'); bar.style.transition = 'none'; bar.style.width = '0%'; requestAnimationFrame(() => { bar.style.transition = `width ${o.t}s linear`; bar.style.width = '100%'; });
  setTimeout(() => { if (o.item) addItem(G.vid, o.item, 1); if (o.fx) o.fx(); AU.coin(); save(); renderSvc(); }, o.t * 1000); });
 $('#svcLeave').onclick = closeSvc; }
function closeSvc(){ G.svc = null; $('#svcM').classList.remove('on'); }
/* ---------------- trunk panel (in-game storage) ---------------- */
function renderTrunk(){ const el = $('#trunkP'); if (!el || !G.car) return; const bag = inv(G.vid), have = ITEMS.filter(i => bag[i.id]);
 el.innerHTML = `<div class="trh"><b>🧳 ${L2('شنطة العربية', 'Vehicle storage')}</b><span>${fmt(Math.round(invKg()))}/${fmt(Math.round(storeCap(G.vid)))} ${t('kg')}</span></div>${bar(invKg() / storeCap(G.vid) * 100, 'gold')}
 <div class="trl">${have.length ? have.map(i => `<div class="tri"><span class="si">${i.ic}</span><div><b>${nm(i.n)} ×${fmt(bag[i.id])}</b><small>${nm(i.d)}</small></div>${i.use ? `<button class="btn sm" data-use="${i.id}">${L2('استخدم', 'Use')}</button>` : '<em>✓</em>'}</div>`).join('') : `<div class="muted">${L2('الشنطة فاضية — اشتري من الجراج أو البنزينة أو القهوة', 'Empty — stock up at the garage, fuel stations or cafés')}</div>`}</div>
 ${missingKit(G.vid).length ? `<div class="warnk">⚠ ${L2('ناقص', 'Missing')}: ${missingKit(G.vid).map(k => IBY(k).ic + ' ' + nm(IBY(k).n)).join('، ')}</div>` : ''}`;
 $$('#trunkP [data-use]').forEach(b => b.onpointerdown = e => { e.preventDefault(); e.stopPropagation(); useItem(b.dataset.use); }); }
/* ---------------- controls: parking brake + trunk ---------------- */
const _bc6 = buildControls;
buildControls = function(){ _bc6();
 $('#ctrlsL').insertAdjacentHTML('afterbegin', `<button class="cb pbk" id="bPark" data-act6="park"><span class="pbi">(P)</span><span class="k">K</span><em>${L2('فرامل اليد', 'Park brake')}</em></button>`);
 $('#ctrls').insertAdjacentHTML('beforeend', `<button class="cb" id="bTrunk" data-act6="trunk"><span class="pbi">🧳</span><span class="k">T</span><em>${L2('الشنطة', 'Storage')}</em></button>`);
 $('#hud').insertAdjacentHTML('beforeend', `<div class="pan" id="trunkP"></div><button id="svcBtn"></button><div id="busyBar"><span id="busyTxt"></span><i></i></div>`);
 document.body.insertAdjacentHTML('beforeend', `<div class="modal" id="svcM"><div class="mbox wide" id="svcBox"></div></div><div class="modal" id="setM"><div class="mbox wide" id="setBox"><div class="mbtns" style="justify-content:flex-end;margin:0"><button class="btn sm sec" id="setClose">✕</button></div></div></div>`);
 $$('[data-act6]').forEach(e => e.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); AU.init(); if (G.mode !== 'play') return; if (e.dataset.act6 === 'park') togglePark(); else { $$('.pan').forEach(p => p.id !== 'trunkP' && p.classList.remove('on')); $('#trunkP').classList.toggle('on'); renderTrunk(); } }));
 $('#svcBtn').onpointerdown = e => { e.preventDefault(); if (G.svcNear) openSvc(G.svcNear); };
 // settings from the pause menu
 $('#pauseM .mbtns').insertAdjacentHTML('afterbegin', `<button class="btn sec" id="pSet">⚙ ${t('settings')}</button>`);
 $('#pSet').onclick = () => { renderSettings(); const s = $('#s-settings'); s.classList.add('on'); $('#setBox').appendChild(s); $('#setM').classList.add('on'); };
 $('#setClose').onclick = () => { const s = $('#s-settings'); s.classList.remove('on'); $('#main').appendChild(s); $('#setM').classList.remove('on'); };
};
function togglePark(){ G.pbrake = !G.pbrake; AU.noiseHit(.12, 1800, .18, 0, 'bandpass', 3); AU.tone(G.pbrake ? 220 : 330, .08, 'square', .05); if (G.pbrake && speedOf(G.car) > 3) toastUI(L2('فرامل اليد والعربية ماشية!', 'Parking brake while moving!'), 'bad'); }
addEventListener('keydown', e => { if (G.mode !== 'play' || e.repeat) return; if (e.code === 'KeyK') togglePark(); if (e.code === 'KeyT'){ $('#trunkP').classList.toggle('on'); renderTrunk(); } });
/* ---------------- per-frame: parking brake, anti-rollback, services, dialogue, AI discipline ---------------- */
const _upd6 = update;
update = function(dt){
 const car = G.car, full = G.mode === 'play';
 if (full && G.pbrake && (key.gas || G.gasT) && G.engOn){ G.pbrake = false; AU.noiseHit(.12, 1800, .15, 0, 'bandpass', 3); toastUI(L2('فرامل اليد اتفكت', 'Parking brake released'), 'gold', null, 1.6); }
 const hb = G.hbrake; if (full && (G.pbrake || G.busyT > 0 || G.svc)) G.hbrake = true;
 _upd6(dt); G.hbrake = hb;
 if (!full) return; const bp = $('#bPark'); if (bp) bp.classList.toggle('act', !!G.pbrake);
 // automatic gearbox in D never rolls back (hill-hold); in R never creeps forward
 if (!car.rev && car.vx < 0 && car.grounded){ car.vx *= .2; car.wh.forEach(w => { if (w.vx < 0) w.vx *= .2; if (w.om < 0) w.om = 0; }); }
 if (car.rev && car.vx > .3 && car.grounded && !(key.gas || G.gasT)){ car.vx *= .6; car.wh.forEach(w => { if (w.om > 0) w.om *= .6; }); }
 if (G.busyT > 0){ G.busyT -= dt; $('#busyBar').classList.toggle('on', !!G.busyMsg && G.busyT > 0); if (G.busyMsg){ $('#busyTxt').textContent = G.busyMsg; } if (G.busyT <= 0) G.busyMsg = ''; } else $('#busyBar').classList.remove('on');
 if (G.focus > 0){ G.focus -= dt; G.alert = Math.min(100, G.alert + dt * .6); }
 if (G.coolT > 0){ G.coolT -= dt; G.temp = Math.min(G.temp, 96); }
 // passive storage comfort
 const bag = inv(G.vid); if (G.onboard.length){ if (bag.tissue) G.comfort = Math.min(100, G.comfort + .05 * dt); if (bag.fresh) G.comfort = Math.min(100, G.comfort + .06 * dt); }
 // out of fuel with a jerrycan → offer it instead of ending the trip
 if (G.fuel <= 0 && bag.jerry && !G.jerryAsk){ G.jerryAsk = true; toastUI(L2('البنزين خلص! معاك جركن', 'Out of fuel! You have a jerrycan'), 'bad', [[L2('استخدمه', 'Use it'), () => { useItem('jerry'); G.jerryAsk = false; }]], 8); }
 if (G.fuel > 0) G.jerryAsk = false; if (G.fuel <= 0 && bag.jerry) G.fuelOutT = 0;
 // service stops: proximity button
 let near = null; for (const p of W.poi || []) if (Math.abs(car.x - p.x) < 13 && speedOf(car) < .6 && !G.rest) near = p;
 G.svcNear = near; const sb = $('#svcBtn'); if (near && !G.svc){ sb.style.display = 'flex'; sb.innerHTML = `${POI_T[near.type].ic} ${L2('ادخل', 'Enter')} ${nm(POI_T[near.type].n)}`; } else sb.style.display = 'none';
 for (const p of W.poi || []){ const d = p.x - car.x; if (!p.warn && d < 160 && d > 20){ p.warn = 1; toast(POI_T[p.type].ic + ' ' + nm(POI_T[p.type].n) + L2(' قدامك — ', ' ahead — ') + fmt(Math.round(d)) + ' m', 'gold'); if (p.type === 'cafe' && G.onboard.length && (W.route.type === 'coach' || Math.random() < .4)) setTimeout(() => paxSay('wantTea'), 1500); } }
 // hide the old fuel prompt (services replace it)
 $('#prompt').style.display = 'none';
 // context-aware chatter
 const c6 = G.ctx6, front = car.x + car.L / 2, t6 = G.time;
 const once = (k, cond, fn) => { if (cond && !c6[k]){ c6[k] = 1; fn(); } };
 once('rain', G.weather === 'rain' && t6 > 8, () => paxSay('rain'));
 once('night', G.tod === 'night' && !car.headOn && t6 > 5, () => paxSay('night'));
 for (const c of W.cps){ once('cp' + c.x, c.state === 'signal', () => paxSay('cpNerv')); once('cpo' + c.x, c.state === 'done' && c.x < car.x, () => paxSay('cpOk')); }
 for (const l of W.lights){ const d = l.x - 3.2 - front; once('red' + l.x, d > 5 && d < 30 && lightState(l) === 'r' && speedOf(car) > 8, () => paxSay('red')); }
 for (const r of W.radars){ const d = r.x - car.x; once('rad' + r.x, d > 20 && d < 120 && speedOf(car) * 3.6 > r.limit, () => paxSay('radar')); }
 once('amb' + (G.ambEv ? G.ambEv.t | 0 : ''), G.ambEv && G.ambEv.told, () => paxSay('amb'));
 if (G.pedX) once('ped' + G.pedX.x, G.pedX.x - front < 30, () => paxSay('ped'));
 once('fuel', G.fuel < G.fuelMax * .12, () => paxSay('fuel')); once('hot', G.temp > 110, () => paxSay('hotEng')); once('flat', car.wh.some(w => w.flat), () => paxSay('flat'));
 once('toll', W.toll && W.toll.paid, () => paxSay('toll'));
 if (G.onboard.length && G.comfort > 55 && (G.talkT || 0) <= 0 && Math.random() < dt * .08){ paxSay('chat'); G.talkT = rnd(10, 18); }
 if (Math.floor(t6 * 4) % 4 === 0) renderTrunkLive();
};
function renderTrunkLive(){ if ($('#trunkP') && $('#trunkP').classList.contains('on')) renderTrunk(); }
/* checkpoints also check the legal safety kit */
const _addFine6 = addFine;
FINE.kit = 300; PTS.kit = 0; TX.fKit = ['نقص في أدوات الأمان (طفاية/مثلث/إسعافات)','Missing safety kit (extinguisher/triangle/first aid)'];
addFine = function(k, cam){ if (k === 'kit'){ if (G.test) return; const amt = FINE.kit, label = t('fKit'); G.T.fines += amt; G.T.fineList.push(label); S.stats.fines += amt; save(); toast('🚨 ' + label + ' — ' + money(amt), 'bad'); AU.whistle(); return; } _addFine6(k, cam); };
const _gp6 = gameplay;
gameplay = function(dt, spd){ const before = W.cps.map(c => c.state); _gp6(dt, spd); W.cps.forEach((c, i) => { if (before[i] === 'check' && c.state === 'done' && !G.test && missingKit(G.vid).length) addFine('kit', false); }); };
/* ---------------- garage storage tab: premium inventory manager ---------------- */
const _rg6 = renderGarage;
renderGarage = function(){ _rg6(); if (GT !== 'storage') return; const vid = GV_ID, bag = inv(vid), cap = storeCap(vid), used = invKg(vid), V = VBY(vid);
 const card = $('#s-garage .tabs + .card'); if (!card) return;
 card.innerHTML = `<div class="row"><h3 style="margin:0">🧳 ${L2('شنطة', 'Storage of')} ${nm(V.name)}</h3><span class="sp"></span><b class="gold">${fmt(Math.round(used))} / ${fmt(Math.round(cap))} ${t('kg')}</b></div>${bar(used / cap * 100, used / cap > .9 ? 'bad' : 'gold')}
 ${V.rack ? `<div class="set"><label>${icon('garage')} ${L2('شبكة سقف (+١٥٠ كجم)', 'Roof rack (+150 kg)')}</label><span class="sp"></span>${S.inv[vid + ':rack'] ? `<button class="btn sm ${GV(vid).cos.rack ? '' : 'sec'}" id="rackT">${GV(vid).cos.rack ? t('equipped') : t('equip')}</button>` : `<button class="btn sm" id="rackB">${money(900)}</button>`}</div>` : ''}
 ${missingKit(vid).length ? `<div class="warnk">⚠ ${L2('أدوات أمان ناقصة — الكماين هتغرّمك', 'Safety kit incomplete — checkpoints will fine you')}: ${missingKit(vid).map(k => IBY(k).ic).join(' ')}</div>` : `<div class="good" style="margin:.4rem 0">✓ ${L2('أدوات الأمان كاملة', 'Safety kit complete')}</div>`}
 <div class="items">${ITEMS.map(i => `<div class="item"><span style="font-size:1.9rem">${i.ic}</span><b>${nm(i.n)}</b><span class="muted" style="font-size:.7rem">${nm(i.d)} · ${fmt(i.kg)} ${t('kg')}</span><small>${L2('معاك', 'Have')}: ${fmt(bag[i.id] || 0)}</small><div class="row"><button class="btn sm sec" data-sell="${i.id}" ${bag[i.id] ? '' : 'disabled'}>−</button><button class="btn sm" data-buy="${i.id}">+ ${money(i.p)}</button></div></div>`).join('')}</div>
 <p class="muted">${L2('الحاجات ليها وزن حقيقي وبتأثر على الفيزياء والاستهلاك. الركاب بيحبوا المياه والحلويات، والكماين بتفتش على أدوات الأمان.', 'Items have real weight that affects handling and fuel use. Passengers love water and sweets, and checkpoints inspect your safety kit.')}</p>`;
 $$('[data-buy]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.buy); if (used + I.kg > cap){ toastUI(L2('الشنطة مليانة', 'Storage is full'), 'bad'); return; } if (!spend(I.p, nm(I.n), 'terminal')) return; addItem(vid, I.id, 1); renderGarage(); });
 $$('[data-sell]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.sell); if (!bag[I.id]) return; bag[I.id]--; ledger(Math.round(I.p * .5), L2('بيع ', 'Sold ') + nm(I.n), 'cash'); save(); renderGarage(); });
 const rb = $('#rackB'); if (rb) rb.onclick = () => { if (spend(900, 'Roof rack', 'garage')){ S.inv[vid + ':rack'] = 1; GV(vid).cos.rack = true; save(); renderGarage(); } };
 const rt = $('#rackT'); if (rt) rt.onclick = () => { GV(vid).cos.rack = !GV(vid).cos.rack; save(); renderGarage(); };
};
/* storage weight counts in the parcel planner */
const _rr6 = renderRoutes;
renderRoutes = function(){ _rr6(); };
/* starter kit for everyone (safety kit + water) */
const _el6 = ensureLicences;
ensureLicences = function(){ _el6(); VEHS.forEach(v => { const g = GV(v.id); if (g.owned && !g.inv){ g.inv = {ext:1, tri:1, aid:v.cls === 'micro' ? 0 : 1, water:1}; } }); };
/* cluster: park-brake lamp */
const _dc6 = drawCluster;
drawCluster = function(){ _dc6(); if (!G.pbrake) return; const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight, x = c.getContext('2d'); x.save(); x.fillStyle = '#ff3b3b'; x.shadowColor = '#ff3b3b'; x.shadowBlur = 8; x.font = `800 ${H2 * .09}px "Readex Pro", sans-serif`; x.textAlign = 'center'; x.fillText('(P)', W2 * .47, H2 * .9); x.restore(); };
