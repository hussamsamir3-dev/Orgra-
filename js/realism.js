"use strict";
/* =====================================================================
   OGRAAA v2 — realism pass: data, sky & panoramas, directional shadows,
   streets, lights, damage, smart AI traffic, radio, ambience, dialogues
   ===================================================================== */
/* ---------------- more AI vehicles (civilian, police, emergency) ---------------- */
AIV.push(
 {spr:'ai12', len:3.9, v:[9,13], mass:900}, {spr:'ai13', len:4.2, v:[9,14], mass:1000}, {spr:'ai14', len:4.3, v:[10,16], mass:1150}, {spr:'ai15', len:4.4, v:[10,16], mass:1200},
 {spr:'ai16', len:3.6, v:[10,15], mass:950}, {spr:'ai17', len:4.6, v:[10,15], mass:1600}, {spr:'ai18', len:4.95, v:[11,17], mass:2500}, {spr:'ai19', len:6.0, v:[8,12], mass:5000},
 {spr:'ai20', len:6.5, v:[8,12], mass:6000}, {spr:'ai21', len:9.8, v:[7,11], mass:15000}, {spr:'ai22', len:4.5, v:[11,16], mass:1300, siren:'pol'}, {spr:'ai23', len:4.6, v:[11,16], mass:1700, siren:'pol'},
 {spr:'ai24', len:5.4, v:[10,15], mass:2300, siren:'pol'}, {spr:'ai25', len:5.3, v:[10,15], mass:2000, siren:'pol'}, {spr:'ai26', len:6.6, v:[14,18], mass:4200, siren:'amb'}, {spr:'ai27', len:5.9, v:[14,18], mass:3200, siren:'amb'},
 {spr:'ai28', len:8.2, v:[12,16], mass:14000, siren:'amb'}, {spr:'ai29', len:8.0, v:[6,9], mass:13000}, {spr:'ai30', len:8.4, v:[7,10], mass:14000});
const AI_CIV = [0,1,2,3,4,5,6,7,8,9,12,13,14,15,16,17,18,19,20,21,0,1,2,14,15,16,12,13];
const AI_EMG = [10,26,27,28,11,22,23];
/* ---------------- more player vehicles (baked-wheel sprites) ---------------- */
VEHS.splice(1, 0,
 {id:'fiat128', spr:'ai12', baked:true, rim:0, cls:'micro', name:['فيات ١٢٨ سرفيس','Fiat 128 Service Taxi'], len:3.9, mass:1050, seats:4, stand:0, price:6500, lvl:1, acc:3.1, vmax:36, tank:38, lp100:8, store:60, f:1.9, travel:.14, brk:7.5, door:.02},
 {id:'minivan', spr:'ai17', baked:true, rim:0, cls:'micro', name:['ميني فان سرفيس ٧ راكب','7-Seat Service Minivan'], len:4.6, mass:1650, seats:7, stand:0, price:14500, lvl:2, acc:3.3, vmax:40, tank:55, lp100:9, store:90, f:1.8, travel:.15, brk:8, door:.02});
/* ---------------- more real routes ---------------- */
ROUTES.push(
 {id:'m8', type:'micro', lvl:2, fare:11, km:16, biome:'city', from:['رمسيس','Ramses'], to:['مدينة نصر','Nasr City'], stops:[['موقف رمسيس','Ramses terminal'],['العباسية','Abbassia'],['صلاح سالم','Salah Salem'],['عباس العقاد','Abbas El Akkad'],['مكرم عبيد','Makram Ebeid'],['الحي العاشر','10th District']]},
 {id:'m9', type:'micro', lvl:1, fare:8, est:true, km:8, biome:'city', from:['ميدان الجيزة','Giza Square'], to:['فيصل','Faisal'], stops:[['موقف الجيزة','Giza terminal'],['المساحة','El Masaha'],['الطالبية','El Talbeya'],['العريش','El Arish St.'],['المطبعة','El Matbaa'],['التعاون','El Taawon']]},
 {id:'m10', type:'micro', lvl:3, fare:10, est:true, km:24, biome:'alex', from:['المنشية','El Manshia'], to:['أبو قير','Abu Qir'], stops:[['موقف المنشية','El Manshia terminal'],['محطة الرمل','Raml Station'],['سبورتنج','Sporting'],['سيدي بشر','Sidi Bishr'],['المندرة','El Mandara'],['أبو قير','Abu Qir']]},
 {id:'b4', type:'bus', lvl:4, fare:15, est:true, km:28, biome:'nile', from:['حلوان','Helwan'], to:['التحرير','Tahrir'], stops:[['موقف حلوان','Helwan terminal'],['المعصرة','El Maasara'],['طرة','Tora'],['المعادي','Maadi'],['مصر القديمة','Old Cairo'],['جاردن سيتي','Garden City'],['التحرير','Tahrir']]},
 {id:'b5', type:'bus', lvl:6, fare:12, est:true, km:13, biome:'city', from:['مدينة نصر','Nasr City'], to:['التحرير','Tahrir'], stops:[['موقف الحي السابع','7th District terminal'],['عباس العقاد','Abbas El Akkad'],['العباسية','Abbassia'],['غمرة','Ghamra'],['رمسيس','Ramses'],['الإسعاف','El Esaaf'],['التحرير','Tahrir']]},
 {id:'c5', type:'coach', lvl:7, fare:180, est:true, km:210, biome:'desert', from:['القاهرة','Cairo'], to:['بورسعيد','Port Said'], stops:[['موقف الترجمان','Turgoman terminal'],['موقف بورسعيد','Port Said terminal']], rests:[['استراحة الإسماعيلية','Ismailia rest house']]},
 {id:'c6', type:'coach', lvl:6, fare:150, est:true, km:130, biome:'redsea', from:['القاهرة','Cairo'], to:['العين السخنة','Ain Sokhna'], stops:[['موقف الترجمان','Turgoman terminal'],['العين السخنة','Ain Sokhna']], rests:[['استراحة طريق السويس','Suez Road rest house']]},
 {id:'c7', type:'coach', lvl:9, fare:320, est:true, km:290, biome:'desert', from:['الإسكندرية','Alexandria'], to:['مرسى مطروح','Marsa Matrouh'], stops:[['موقف سيدي جابر','Sidi Gaber terminal'],['موقف مطروح','Matrouh terminal']], rests:[['استراحة العلمين','El Alamein rest house'],['استراحة الضبعة','El Dabaa rest house']]});
const LIMITS = {city:60, mokattam:60, nile:60, alex:60, ring:80, desert:100, redsea:100, sinai:90, upper:90};
/* ---------------- radio stations (live streams + offline fallback) ---------------- */
STATIONS.length = 0;
[['Quran FM','إذاعة القرآن الكريم','98.2','GQxvGBNK','calm'],['Nagham FM','نغم إف إم','105.3','sIA24Ez6','pop'],['Mega FM','ميجا إف إم','92.7','yIpuP5tD','pop'],['9090 FM','الراديو ٩٠٩٠','90.9','k-_Hmk3Z','pop'],['ON Sport FM','أون سبورت إف إم','93.7','dRtUupbz','sport'],['Sha3by FM','شعبي إف إم','95.0','FnwXclfQ','shaabi'],['Radio Hits','راديو هيتس','88.2','C7lrGjzR','pop'],['NRJ Egypt','إن آر جيه مصر','92.1','AGWkF30m','pop'],['90s FM','تسعينات إف إم','','CGj0W1yp','oldies'],['Arab Mix FM','عرب ميكس','','gtSSIih0','pop'],['Mahatet Masr','محطة مصر','','07gqi-cz','shaabi']]
 .forEach(([en, ar, fm, id, g]) => STATIONS.push({en, ar, fm, g, url:'https://radio.garden/api/ara/content/listen/' + id + '/channel.mp3', 0:ar, 1:en}));
const RADIO = {
 el:null, status:'off', idx:0,
 play(i){ this.idx = i; this.stop(true); const st = STATIONS[i]; this.status = 'tune'; AU.staticBurst();
  try{ if (!this.el){ this.el = new Audio(); this.el.preload = 'none'; this.el.onplaying = () => { this.status = 'live'; AU.stop(); }; this.el.onerror = () => this.fallback(); this.el.onwaiting = () => { if (this.status === 'live') this.status = 'tune'; }; }
   this.el.src = st.url; this.el.volume = clamp(S.set.radio, 0, 1); const p = this.el.play(); if (p) p.catch(() => this.fallback()); clearTimeout(this.to); this.to = setTimeout(() => { if (this.status !== 'live') this.fallback(); }, 7000); }catch(e){ this.fallback(); } },
 fallback(){ if (this.status === 'off') return; this.status = 'offline'; try{ this.el && this.el.pause(); }catch(e){} const map = {calm:3, pop:0, sport:2, shaabi:2, oldies:1}; AU.play(map[STATIONS[this.idx].g] ?? 0, 'radio'); },
 stop(keep){ clearTimeout(this.to); if (!keep) this.status = 'off'; try{ if (this.el){ this.el.pause(); this.el.removeAttribute('src'); this.el.load(); } }catch(e){} AU.stop(); },
 vol(){ if (this.el) this.el.volume = clamp(S.set.radio, 0, 1); AU.apply(); }
};
/* ---------------- menu music (uploaded track) ---------------- */
const MUSIC = { el:null, play(){ try{ if (!this.el){ this.el = new Audio(ASSETS.music); this.el.loop = true; } this.el.volume = clamp(S.set.music * .8, 0, 1); if (this.el.paused) this.el.play().catch(() => {}); }catch(e){} }, stop(){ try{ this.el && this.el.pause(); }catch(e){} }, vol(){ if (this.el) this.el.volume = clamp(S.set.music * .8, 0, 1); } };
/* ---------------- ambience (procedural premium beds) ---------------- */
const AMBI = {
 n:null,
 init(){ const c = AU.ctx; if (!c || this.n) return; const n = this.n = {}; n.bus = c.createGain(); n.bus.gain.value = (S.set.amb ?? .7); n.bus.connect(AU.sfxG); const bed = (type, f, q) => { const s = c.createBufferSource(); s.buffer = AU.noise; s.loop = true; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q || .7; const g = c.createGain(); g.gain.value = 0; s.connect(fl).connect(g).connect(n.bus); s.start(0, Math.random()); return {g, fl}; };
  n.city = bed('lowpass', 220, .5); n.crowd = bed('bandpass', 750, .8); n.wind = bed('lowpass', 420, .6); n.sea = bed('lowpass', 520, .4); n.fan = bed('bandpass', 1300, .6); n.cabin = bed('lowpass', 120, .7); },
 t:0, bird:3, horn:6,
 update(dt){ if (!AU.ctx) return; this.init(); const n = this.n, c = AU.ctx, tt = c.currentTime + .05, on = G.mode === 'play' && !G.paused;
  const urban = on ? W.biome.urban : 0, night = G.tod === 'night', car = G.car, spd = car ? speedOf(car) : 0;
  const nearStop = on && W.stops.some(s => Math.abs(s.x - car.x) < 25 && s.waiting && s.waiting.length);
  const water = on && ['nile','alex'].includes(W.route.biome) && W.water && W.water.some(w => car.x > w[0] - 30 && car.x < w[1] + 30);
  const set = (b, v, tc) => b.g.gain.setTargetAtTime(on ? v : 0, tt, tc || .6);
  set(n.city, .05 + urban * .12); set(n.crowd, nearStop ? .07 : urban * .02); set(n.wind, W.biome && W.biome.urban < .2 ? .05 + clamp(spd / 30, 0, 1) * .06 : .015); set(n.sea, water ? .09 : 0);
  n.sea.g.gain.setTargetAtTime(on && water ? .06 + .05 * Math.sin(c.currentTime * .4) : 0, tt, .3);
  set(n.fan, G.fan ? G.fan * .018 : 0, .3); set(n.cabin, G.engOn ? .05 : 0);
  if (!on) return; this.bird -= dt; this.horn -= dt;
  if (this.bird < 0){ this.bird = rnd(2, 7); if (!night && urban < .95 && G.weather !== 'rain'){ const f = rnd(2600, 4200); for (let k = 0; k < 3; k++) AU.tone(f + k * 180, .07, 'sine', .018, k * .09, rnd(-500, 400)); } else if (night) { for (let k = 0; k < 6; k++) AU.tone(4400, .03, 'sine', .012, k * .06); } }
  if (this.horn < 0){ this.horn = rnd(10, 25) / Math.max(.3, urban); if (urban > .3 && Math.random() < .5){ const f = rnd(330, 480); AU.tone(f, .2, 'sine', .005); AU.tone(f * 1.26, .2, 'sine', .004); } }
 }
};
const TINT = {};
function tintImg(k, col){ const key = k + col; if (TINT[key]) return TINT[key]; const im = IMG[k], c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); return TINT[key] = c; }
/* ---------------- clean faint background haze in sprite edges ---------------- */
function cleanImages(){
 const keys = Object.keys(IMG).filter(k => /^b[A-Z]/.test(k) || ['tlight','plight','lamp','lamp2','lamp3','shelter','stopsign','pole','cone','cone2','barrier','jersey','fence','dirsign','meter','bin','hydrant','planter','bench','bollard'].includes(k));
 for (const k of keys){ const im = IMG[k]; if (!im.width) continue; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), a = d.data; for (let i = 3; i < a.length; i += 4) if (a[i] < 60) a[i] = 0; x.putImageData(d, 0, 0);
  if (k === 'pole') x.clearRect(0, 0, c.width * .08, c.height); IMG[k] = c; }
}
/* ---------------- speech bubbles & dialogue ---------------- */
const BUB = [];
function say(pair, x, y, col, life){ const txt = Array.isArray(pair) ? nm(pair) : pair; if (BUB.length > 3) BUB.shift(); BUB.push({txt, x, y, col:col || '#fff', life:life || 3.2, max:life || 3.2}); }
const DLG = {
 board:[['السلام عليكم يا أسطى','Evening, driver'],['الأجرة كام يا أسطى؟','How much is the fare?'],['على الموقف اللي جاي لو سمحت','Next stop please'],['خد يا أسطى، اتنين هنا','Two fares here, driver'],['في مكان ورا؟','Any seat in the back?'],['الحمد لله لحقتك','Phew, made it!']],
 alightGood:[['تسلم إيدك يا أسطى','Bless your hands, driver'],['سواقة حلوة، شكراً','Great driving, thanks'],['ربنا يوسع رزقك','May God widen your fortune']],
 alightBad:[['إيه السواقة دي؟!','What kind of driving is that?!'],['دماغي لفت يا عم','My head is spinning, man'],['مش راكب معاك تاني','Never riding with you again']],
 hot:[['الجو نار يا أسطى، شغل التكييف','It\'s boiling, turn on the A/C'],['إحنا بنستوي هنا','We\'re cooking in here'],['افتح الشباك أو شغل التكييف!','Open a window or turn on the A/C!']],
 cold:[['ساقعة أوي يا أسطى، وطي التكييف','Too cold, driver, turn it down'],['هنبرد كده','We\'ll all catch a cold']],
 niceAir:[['الله على التكييف','Ahh, lovely A/C'],['جو حلو والله','Nice and cool']],
 fast:[['براحة يا أسطى، إحنا مش مستعجلين','Easy, driver, no rush'],['هدّي شوية يا عم','Slow down a bit'],['إنت فاكر نفسك في سباق؟','Think you\'re in a race?']],
 brake:[['يا ساتر! بالراحة','Whoa! Gently!'],['إيه يا عم الفرملة دي','What a brake!']],
 bump:[['المطب يا أسطى!','The bump, driver!'],['آه يا ضهري','Ouch, my back']],
 wait:[['يلا يا أسطى اتأخرنا','Come on, driver, we\'re late'],['هنفضل واقفين كتير؟','Are we staying here long?']],
 calm:[['الله، القرآن يريح القلب','Beautiful, very calming'],['صوت جميل ما شاء الله','Lovely recitation']],
 pop:[['علّي الأغنية دي!','Turn this song up!'],['دي أغنيتي المفضلة','That\'s my favourite song']],
 shaabi:[['أيوه بقى! شعبي','Yes! Shaabi music!'],['دي أغنية أفراح','Wedding song vibes']],
 sport:[['الماتش بكام؟','What\'s the score?'],['جوووون!','Gooooal!']],
 oldies:[['أيام زمان حلوة','The good old days'],['فكرتني بالتسعينات','Takes me back to the 90s']],
 loud:[['وطّي الصوت شوية','Turn it down a bit'],['الصوت عالي أوي','Way too loud']],
 honkBack:[['حاضر يا باشا','Alright, boss'],['طيب طيب، عدّي','Okay okay, go ahead'],['ما تستعجلش كده!','Don\'t be so pushy!']],
 honkAt:[['ما تتحرك يا أسطى!','Move it, driver!'],['يلا يا عم!','Come on, man!']],
 crash:[['إنت أعمى يا أسطى؟!','Are you blind, driver?!'],['العربية! هتدفع التصليح','My car! You\'re paying for this']],
 officer:[['رخصك يا أسطى','Licences, driver'],['الحزام فين يا أسطى؟','Where\'s your seatbelt?'],['اتفضل، كله تمام','Carry on, all good']],
 wedding:[['مبروك يا عريس!','Congrats to the groom!'],['ألف مبروك!','A thousand congratulations!']],
 ped:[['شكراً يا أسطى','Thanks, driver'],['ربنا يخليك','God bless you']],
 fog:[['القزاز مغبش، مش شايف حاجة','Windshield is foggy, can\'t see a thing']]
};
function drawBubbles(dt){
 ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (let i = BUB.length - 1; i >= 0; i--){ const b = BUB[i]; b.life -= dt; if (b.life <= 0){ BUB.splice(i, 1); continue; } b.y += dt * .15;
  const X = sx(b.x), Y = sy(b.y); const fs = clamp(PPM * .38, 12, 19); ctx.font = `600 ${fs}px "Readex Pro", sans-serif`; const w = ctx.measureText(b.txt).width + fs * 1.2, h = fs * 1.9;
  const a = Math.min(1, b.life / .4, (b.max - b.life) / .2 + .2); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(12,22,44,.9)'; ctx.strokeStyle = 'rgba(245,178,27,.7)'; ctx.lineWidth = 1.5;
  const x0 = clamp(X - w / 2, 6, VW - w - 6), y0 = Y - h - 10; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y0, w, h, h / 2) : ctx.rect(x0, y0, w, h); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X - 6, y0 + h - 1); ctx.lineTo(X, Y - 2); ctx.lineTo(X + 6, y0 + h - 1); ctx.fill(); ctx.fillStyle = b.col; ctx.fillText(b.txt, x0 + w / 2, y0 + h / 2 + 1); }
 ctx.globalAlpha = 1;
}
/* ---------------- sun, sky & realistic panoramas ---------------- */
const SKYP = {day:{t:[64,124,196], m:[150,190,226], b:[222,226,222], haze:[205,212,215], sun:[255,248,225], dark:0},
 sunset:{t:[38,58,110], m:[196,120,110], b:[246,188,130], haze:[226,170,130], sun:[255,210,150], dark:.18},
 night:{t:[5,10,26], m:[14,26,56], b:[36,50,84], haze:[40,52,82], sun:[230,236,248], dark:.7}};
const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a == null ? 1 : a})`;
function mix(a, b, t){ const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = ((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t, g = ((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t, bl = (pa & 255) * (1 - t) + (pb & 255) * t; return '#' + ((1 << 24) | ((r | 0) << 16) | ((g | 0) << 8) | (bl | 0)).toString(16).slice(1); }
const skyPal = () => SKYP[G.tod] || SKYP.day;
function horizon(){ return VH * .5 + clamp((cam.y0 - cam.y) * PPM * .12, -VH * .12, VH * .12); }
const SUN = () => ({day:{x:.35, a:.3, l:.42}, sunset:{x:1.25, a:.34, l:.75}, night:{x:0, a:.14, l:.2}})[G.tod] || {x:.35, a:.3, l:.42};
let CLOUDS = null;
function mkClouds(){ CLOUDS = []; for (let i = 0; i < 6; i++){ const w = 520, h = 170, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); const r = mulberry(i * 97 + 5);
  for (let k = 0; k < 26; k++){ const rr = h * (.12 + r() * .2), cx = rr + r() * (w - 2 * rr), cy = h * .55 + (r() - .5) * h * .2; const g = x.createRadialGradient(cx, cy - rr * .25, 0, cx, cy, rr); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.6, 'rgba(250,250,252,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.fill(); }
  CLOUDS.push(c); } }
function drawSky(){
 const P = skyPal(), hz = horizon(); const g = ctx.createLinearGradient(0, 0, 0, hz + VH * .1); g.addColorStop(0, rgb(P.t)); g.addColorStop(.62, rgb(P.m)); g.addColorStop(1, rgb(P.b)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
 if (G.tod === 'night'){ for (let i = 0; i < 140; i++){ const x = (hash(i) * VW * 1.2 - cam.x * PPM * .004) % VW; ctx.fillStyle = `rgba(255,255,255,${.25 + hash(i + 9) * .6 * (.6 + .4 * Math.sin(G.time * 2 + i))})`; ctx.fillRect((x + VW) % VW, hash(i + 3) * hz * .8, 1.3, 1.3); } }
 const sxp = VW * (G.tod === 'sunset' ? .8 : .74), syp = G.tod === 'sunset' ? hz - VH * .06 : VH * .14, r = VH * (G.tod === 'night' ? .035 : .045);
 const sg = ctx.createRadialGradient(sxp, syp, 0, sxp, syp, r * 9); sg.addColorStop(0, rgb(P.sun, .9)); sg.addColorStop(.12, rgb(P.sun, .35)); sg.addColorStop(1, rgb(P.sun, 0)); ctx.fillStyle = sg; ctx.fillRect(sxp - r * 9, syp - r * 9, r * 18, r * 18);
 ctx.fillStyle = rgb(P.sun); ctx.beginPath(); ctx.arc(sxp, syp, r, 0, 7); ctx.fill(); if (G.tod === 'night'){ ctx.fillStyle = rgb(P.t, .9); ctx.beginPath(); ctx.arc(sxp + r * .45, syp - r * .2, r * .9, 0, 7); ctx.fill(); }
 if (!CLOUDS) mkClouds(); ctx.globalAlpha = G.tod === 'night' ? .12 : G.weather === 'rain' ? .9 : .7;
 if (G.weather === 'rain'){ ctx.fillStyle = 'rgba(90,100,115,.45)'; ctx.fillRect(0, 0, VW, hz); }
 for (let i = 0; i < 7; i++){ const c = CLOUDS[i % 6], w = VW * (.35 + hash(i) * .3), h = w * .33; let x = (hash(i + 20) * VW * 2 - cam.x * PPM * .01 - G.time * 5 * (1 + hash(i))) % (VW * 1.6); if (x < -w) x += VW * 1.6; ctx.drawImage(c, x - w * .2, VH * (.02 + hash(i + 40) * .2), w, h); }
 ctx.globalAlpha = 1; if (G.tod === 'sunset'){ ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,140,60,.35)'; ctx.fillRect(0, 0, VW, VH); ctx.globalCompositeOperation = 'source-over'; }
}
/* hazed skyline strips built from the uploaded building artwork */
const STRIP = {};
function skylineStrip(layer){
 const key = W.route.biome + G.tod + layer + (VH | 0); if (STRIP[key]) return STRIP[key]; const P = skyPal(), urban = W.biome.urban;
 const H = Math.round(VH * (layer ? .42 : .3)), Wd = Math.round(H * 7), c = document.createElement('canvas'); c.width = Wd; c.height = H; const x = c.getContext('2d'); const r = mulberry(layer * 31 + 7);
 const pool = urban > .4 ? ['bOld','bNew','bPharm','bKosh','bMarket','bTrans','bNew','bOld','bHosp','bSchool'] : ['bWare','bCafe','bMarket','bTrans'];
 let px = -20; while (px < Wd){ const k = pool[(r() * pool.length) | 0], im = IMG[k]; const hh = H * (layer ? .45 + r() * .5 : .35 + r() * .55) * (urban > .4 ? 1 : .45); const ww = im.width / im.height * hh; x.drawImage(im, px, H - hh, ww, hh); px += ww * (urban > .4 ? .82 + r() * .1 : 1.8 + r() * 3); }
 x.globalCompositeOperation = 'source-atop'; const hz = layer ? .5 : .72; const gg = x.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, rgb(P.haze, hz)); gg.addColorStop(1, rgb(P.haze, hz * .75)); x.fillStyle = gg; x.fillRect(0, 0, Wd, H);
 if (G.tod === 'night'){ x.fillStyle = 'rgba(6,10,24,.55)'; x.fillRect(0, 0, Wd, H); x.globalCompositeOperation = 'source-atop'; for (let k = 0; k < Wd * H / 900; k++){ if (r() < .45){ x.fillStyle = `rgba(255,${190 + r() * 50 | 0},120,${.5 + r() * .5})`; x.fillRect(r() * Wd, r() * H, 2, 2.5); } } }
 x.globalCompositeOperation = 'source-over'; return STRIP[key] = c;
}
function drawFar(img, f, y, h){ const w = img.width / img.height * h; let x0 = -((cam.x * PPM * f) % w); if (x0 > 0) x0 -= w; for (let x = x0; x < VW; x += w) ctx.drawImage(img, x, y - h, w + 1, h); }
function drawRidge(f, base, amp, col, seed, rough){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, VH); const sh = cam.x * PPM * f; for (let X = 0; X <= VW + 8; X += 8){ const u = (X + sh) / 170; const y = base - amp * (.55 + .3 * Math.sin(u * .9 + seed) + .15 * Math.sin(u * 2.3 + seed * 2) + (rough ? .06 * Math.sin(u * 9 + seed) : 0)); ctx.lineTo(X, y); } ctx.lineTo(VW, VH); ctx.fill(); }
function drawLayers(){
 const hz = horizon(), B = W.route.biome, P = skyPal(), urban = W.biome.urban, night = G.tod === 'night';
 const hazeC = (c, k) => { const m = [c[0] + (P.haze[0] - c[0]) * k, c[1] + (P.haze[1] - c[1]) * k, c[2] + (P.haze[2] - c[2]) * k]; return rgb(night ? m.map(v => v * .35) : m); };
 if (['desert','redsea','sinai','upper','mokattam','ring'].includes(B)){
  const rock = B === 'sinai' ? [150,92,62] : B === 'redsea' ? [168,120,84] : B === 'mokattam' ? [196,172,128] : [214,184,130];
  drawRidge(.02, hz + VH * .02, VH * (B === 'sinai' || B === 'redsea' ? .2 : .08), hazeC(rock, .72), 1, true);
  drawRidge(.05, hz + VH * .06, VH * (B === 'mokattam' ? .16 : .09), hazeC(rock, .5), 3, B !== 'desert');
  if (B === 'upper' || B === 'ring'){ drawRidge(.1, hz + VH * .1, VH * .03, hazeC([70,96,58], .45), 5, true); }
  if (B === 'redsea'){ const sea = ctx.createLinearGradient(0, hz + VH * .03, 0, hz + VH * .12); sea.addColorStop(0, night ? '#0b1a33' : '#3a8fb8'); sea.addColorStop(1, night ? '#081226' : '#1f6d96'); ctx.fillStyle = sea; ctx.fillRect(0, hz + VH * .06, VW, VH * .08); }
  if (urban > .1) drawFar(skylineStrip(0), .08, hz + VH * .12, VH * .16);
 } else {
  if (night && IMG.sky_night.width){ ctx.globalAlpha = .9; drawFar(IMG.sky_night, .03, hz + VH * .1, VH * .34); ctx.globalAlpha = 1; }
  else drawFar(skylineStrip(0), .06, hz + VH * .1, VH * .26);
  if (B === 'nile' || B === 'alex'){ const wt = ctx.createLinearGradient(0, hz + VH * .06, 0, VH); wt.addColorStop(0, night ? '#0e1c3a' : B === 'alex' ? '#4a93b8' : '#5b8ea0'); wt.addColorStop(1, night ? '#050b18' : '#24536a'); ctx.fillStyle = wt; ctx.fillRect(0, hz + VH * .1, VW, VH); }
  drawFar(skylineStrip(1), .16, hz + VH * .2, VH * .36);
 }
 const fog = ctx.createLinearGradient(0, hz - VH * .1, 0, hz + VH * .3); fog.addColorStop(0, rgb(P.haze, 0)); fog.addColorStop(1, rgb(P.haze, night ? .08 : G.weather === 'sand' ? .45 : .22)); ctx.fillStyle = fog; ctx.fillRect(0, hz - VH * .1, VW, VH * .4);
}
/* ---------------- directional shadows (silhouettes) ---------------- */
const SILC = new Map();
function sil(src){ let c = SILC.get(src); if (c) return c; c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d'); x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); if (SILC.size > 120) SILC.clear(); SILC.set(src, c); return c; }
function castShadow(src, X, baseY, w, h, k){ if (S.set.gfx === 'low') return; const s = SUN(); const kx = s.x * (k || 1), ky = s.l * .5 * (k || 1); ctx.save(); ctx.globalAlpha = s.a; ctx.setTransform(DPR * w / src.width, 0, -DPR * kx * w / src.width * 0 - DPR * kx * h / src.height, -DPR * ky * h / src.height, DPR * (X + kx * h), DPR * (baseY + ky * h)); ctx.drawImage(sil(src), 0, 0); ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
/* ---------------- streets ---------------- */
function curLimit(x){ let L = LIMITS[W.route.biome] || 60; if (G.V && G.V.cls !== 'micro' && L > 90) L = 90; for (const e of W.ev || []) if (e.lim && x > e.x - 20 && x < e.x + e.w + 10) L = Math.min(L, e.lim); return L; }
function v2world(){
 W.ev = []; W.water = []; const r = mulberry(W.seed + 5), len = W.len, B = W.route.biome;
 const clear = x => W.stops.every(s => Math.abs(s.x - x) > 60) && W.cps.every(c => Math.abs(c.x - x) > 60) && W.lights.every(l => Math.abs(l.x - x) > 50) && (W.rests || []).every(q => Math.abs(q.x - x) > 60);
 const tryAdd = (kind, w, extra) => { for (let k = 0; k < 20; k++){ const x = 150 + r() * (len - 300); if (clear(x) && clear(x + w) && W.ev.every(e => Math.abs(e.x - x) > 150)){ const e = Object.assign({kind, x, w}, extra || {}); W.ev.push(e); return e; } } };
 const rw = tryAdd('works', 34, {lim:40}); if (rw){ for (let d = 0; d <= 34; d += 5) W.props.push({k:d % 10 ? 'cone' : 'cone2', x:rw.x + d, front:1, lane:1}); W.props.push({k:'barrier', x:rw.x - 3, front:1, lane:1}); W.props.push({k:'jersey', x:rw.x + 17, front:1, lane:1}); W.decals.push({k:'patch', x:rw.x, w:34}); }
 if (W.biome.urban > .3){ const sc = W.deco.find(d => d.k === 'bSchool' && clear(d.x)); if (sc) W.ev.push({kind:'school', x:sc.x - sc.w / 2 - 10, w:sc.w + 20, lim:40}); tryAdd('breakdown', 8); }
 if (r() < .6) tryAdd('wedding', 5); tryAdd('patrol', 5);
 if (B === 'nile' || B === 'alex'){ const st = W.deco.slice().sort((a, b) => a.x - b.x); for (let i = 0; i < 3; i++){ const x = 200 + r() * (len - 400); if (!clear(x)) continue; const a = x, b = x + 90 + r() * 80; W.deco = W.deco.filter(d => d.x + d.w / 2 < a || d.x - d.w / 2 > b); W.water.push([a, b]); for (let q = a + 6; q < b; q += 30) W.props.push({k:'lamp2', x:q}); } }
 W.props.sort((a, b) => a.x - b.x);
}
function inWater(x){ return W.water && W.water.some(w => x > w[0] && x < w[1]); }
function drawWorld(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3, night = G.tod === 'night', coachy = W.route.type === 'coach' || B.urban < .1, s = SUN();
 // corniche water (Nile / Mediterranean) seen past the railing
 for (const [a, b] of W.water || []){ if (b < x0 || a > x1) continue; const X0 = sx(Math.max(a, x0)), X1 = sx(Math.min(b, x1)); const top = horizon() + VH * .1, bot = sy(terrH((a + b) / 2) + 2.25); const g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, night ? '#0b1834' : W.route.biome === 'alex' ? '#5aa6c8' : '#6a9aa6'); g.addColorStop(1, night ? '#050c1c' : W.route.biome === 'alex' ? '#1f5f86' : '#2c5a66'); ctx.fillStyle = g; ctx.fillRect(X0, top, X1 - X0, bot - top + 2);
  ctx.strokeStyle = night ? 'rgba(255,200,120,.35)' : 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; for (let i = 0; i < 26; i++){ const y = top + (bot - top) * hash(i + 3), xx = X0 + ((hash(i) * (X1 - X0) + G.time * 12 * (hash(i + 1) - .5)) % Math.max(1, X1 - X0)); ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx + 10 + hash(i + 5) * 40, y); ctx.stroke(); } }
 // buildings with plinths, shop glow at night and directional shadows onto the pavement
 for (const d of W.deco){ if (d.x + d.w / 2 < x0 - 8 || d.x - d.w / 2 > x1 + 8) continue;
  let hi = -1e9, lo = 1e9; for (let q = -d.w / 2; q <= d.w / 2; q += 1){ const h = terrH(d.x + q); hi = Math.max(hi, h); lo = Math.min(lo, h); }
  const base = hi + 2.2, X = sx(d.x - d.w / 2), wpx = d.w * PPM, hp = d.h * PPM, im = IMG[d.k];
  ctx.fillStyle = night ? '#23201b' : '#7d705c'; ctx.fillRect(X + wpx * .02, sy(base), wpx * .96, (hi - lo + .4) * PPM);
  ctx.drawImage(night ? tintImg(d.k, 'rgba(6,12,30,.55)') : G.tod === 'sunset' ? tintImg(d.k, 'rgba(120,60,30,.18)') : im, X, sy(base) - hp, wpx, hp);
  if (night){ if (['bKosh','bMarket','bPharm','bCafe','bNew','bStation','bTrans','bHosp'].includes(d.k)){ const gx = X + wpx / 2, gy = sy(base) - hp * .1; const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, wpx * .7); g.addColorStop(0, 'rgba(255,200,120,.35)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(gx - wpx, gy - wpx * .7, wpx * 2, wpx * 1.2); } }
 }
 // far pavement, curb, corniche railing
 if (urban || !coachy){ band(IMG.walk2, 2.25, 1.55, 9, x0, x1); band(IMG.curbY, 1.62, 1.42, 18, x0, x1); } else { band(IMG.dirt, 2.3, 1.5, 12, x0, x1); band(IMG.guard, 2.35, 1.45, 10, x0, x1); }
 for (const [a, b] of W.water || []){ if (b < x0 || a > x1) continue; band(IMG.guard, 2.95, 2.1, 10, Math.max(a, x0), Math.min(b, x1)); }
 // building shadows cast onto the pavement
 if (!night) for (const d of W.deco){ if (d.x + d.w / 2 < x0 - 30 || d.x - d.w / 2 > x1 + 8) continue; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VW, sy(terrH(d.x) + 1.45)); ctx.clip(); castShadow(IMG[d.k], sx(d.x - d.w / 2), sy(terrH(d.x) + 2.2), d.w * PPM, Math.min(d.h, 5) * PPM, .55); ctx.restore(); }
 // props on the pavement (with shadows) and traffic lights
 for (const p of W.props){ if (p.x < x0 - 8 || p.x > x1 + 8 || p.front) continue; const base = terrH(p.x) + (p.k === 'barrier' ? 1.5 : 1.95);
  if (p.k === 'fuel'){ drawFuel(p.x); continue; }
  const im = IMG[p.k], hM = PROP_H[p.k] || 2, h = hM * PPM, w = PROP_W[p.k] ? PROP_W[p.k] * PPM : im.width / im.height * h; if (!night) castShadow(im, sx(p.x) - w / 2, sy(base), w, h, .35);
  const r = drawSprite(p.k, p.x, base, hM);
  if (p.tl && r){ const st = lightState(p.tl); for (const [k, fy, col] of [['r',.098,'#ff2a2a'],['y',.239,'#ffb300'],['g',.376,'#2bff6a']]){ const cx = r.X + r.w * .5, cy = r.Y + r.h * fy, rr = r.w * .21; ctx.fillStyle = k === st ? col : 'rgba(10,10,10,.8)'; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fill(); if (k === st){ const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 5); g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr * 5, 0, 7); ctx.fill(); } } }
  if (night && r && (p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3')){ const hx = p.k === 'lamp' ? r.X + r.w * .88 : p.k === 'lamp3' ? r.X + r.w * .5 : r.X + r.w * .5, hy = r.Y + r.h * (p.k === 'lamp2' ? .1 : .04); const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, PPM * 1.6); g.addColorStop(0, 'rgba(255,225,160,.95)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, PPM * 1.6, 0, 7); ctx.fill(); }
 }
 for (const r of W.radars) drawRadar(r);
 // broken-down car on the shoulder (road event)
 for (const e of W.ev || []) if (e.kind === 'breakdown' && e.x > x0 - 10 && e.x < x1 + 10){ const im = IMG.ai14, h = 1.6 * PPM, w = im.width / im.height * h; const X = sx(e.x), Y = sy(terrH(e.x) + 1.8); ctx.drawImage(im, X - w / 2, Y - h, w, h); if (Math.floor(G.time * 2) % 2){ ctx.fillStyle = 'rgba(255,170,0,.9)'; for (const q of [-.47, .47]){ ctx.beginPath(); ctx.arc(X + w * q, Y - h * .45, PPM * .18, 0, 7); ctx.fill(); } } drawSprite('cone', e.x - 4, terrH(e.x) + 1.75, .7); }
 // pedestrians & waiting passengers
 for (const p of G.amb) drawPed(p.t, p.x, terrH(p.x) + 1.85, p.d, p.face, 1, p.h);
 for (const st of W.stops){ if (st.x < x0 - 10 || st.x > x1 + 10 || !st.waiting) continue; st.waiting.forEach((p, i) => { if (i > 9) return; const px = st.x - 3 + (i % 5) * .75 + (i > 4 ? .35 : 0); drawPed(p.t, px, terrH(px) + 1.8 + (i > 4 ? .15 : 0), null, i % 3 === 0 ? -1 : 1, 1, p.h); }); }
 // road surface
 const asp = W.route.biome === 'mokattam' || W.route.biome === 'upper' ? IMG.asphalt2 : IMG.asphalt; band(asp, 1.45, -.28, 22, x0, x1);
 const strip = (y0, y1, col) => { ctx.fillStyle = col; ctx.beginPath(); for (let x = x0; x <= x1; x += 2) ctx.lineTo(sx(x), sy(terrH(x) + y0)); for (let x = x1; x >= x0; x -= 2) ctx.lineTo(sx(x), sy(terrH(x) + y1)); ctx.fill(); };
 strip(.22, .05, 'rgba(0,0,0,.10)'); strip(.98, .82, 'rgba(0,0,0,.08)'); strip(1.4, 1.34, 'rgba(240,240,235,.75)'); strip(-.14, -.2, 'rgba(240,240,235,.7)');
 if (G.weather === 'rain'){ strip(1.4, -.25, 'rgba(120,140,170,.18)'); }
 // painted lane divider — fixed to the street (world-anchored dashes)
 ctx.fillStyle = 'rgba(245,245,240,.85)'; const D = 9, L = 3.2; for (let x = Math.floor(x0 / D) * D; x < x1; x += D){ let ok = true; for (const e of W.decals) if (e.k === 'zebra' && Math.abs(e.x - x) < 5) ok = false; if (!ok) continue; ctx.beginPath(); ctx.moveTo(sx(x), sy(terrH(x) + .66)); ctx.lineTo(sx(x + L), sy(terrH(x + L) + .66)); ctx.lineTo(sx(x + L), sy(terrH(x + L) + .58)); ctx.lineTo(sx(x), sy(terrH(x) + .58)); ctx.fill(); }
 for (const d of W.decals){ if (d.x < x0 - 36 || d.x > x1 + 10) continue;
  if (d.k === 'zebra') band(IMG.zebra, 1.45, -.2, 4.2, d.x - d.w / 2, d.x + d.w / 2, .95); else if (d.k === 'patch') band(IMG.asphaltC, 1.45, -.28, 22, d.x, d.x + d.w, .9);
  else { const im = IMG[d.k]; const w = d.w * PPM, h = w * .35; ctx.globalAlpha = .85; ctx.drawImage(im, sx(d.x) - w / 2, sy(terrH(d.x) + .35) - h / 2, w, h); ctx.globalAlpha = 1; } }
 if (G.weather === 'rain') for (let k = 0; k < 6; k++){ const cell = Math.floor((x0 + k * 17) / 17); const x = cell * 17 + hash(cell) * 8, w = 3.5 * PPM; ctx.globalAlpha = .55; ctx.drawImage(IMG.puddle, sx(x) - w / 2, sy(terrH(x) + .5) - w * .06, w, w * .12); ctx.globalAlpha = 1; }
 // speed humps: painted hump across the full road width (perspective strip) + real profile bulge
 for (const b of W.bumps){ if (b < x0 - 3 || b > x1 + 3) continue; const im = IMG.bumpV; const w = .9 * PPM; const top = sy(terrH(b) + 1.45), bot = sy(terrH(b) - .25); const X = sx(b);
  ctx.save(); ctx.beginPath(); ctx.moveTo(X - w * .55, top); ctx.lineTo(X + w * .55, top); ctx.lineTo(X + w * .5, bot); ctx.lineTo(X - w * .5, bot); ctx.clip(); ctx.drawImage(im, X - w * .55, top, w * 1.1, bot - top); const sh = ctx.createLinearGradient(X - w * .5, 0, X + w * .5, 0); sh.addColorStop(0, 'rgba(255,255,255,.25)'); sh.addColorStop(.5, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = sh; ctx.fillRect(X - w, top, w * 2, bot - top); ctx.restore(); }
 for (const hx of W.holes){ if (hx < x0 || hx > x1) continue; const w = 1.1 * PPM; ctx.drawImage(IMG.hole, sx(hx) - w / 2, sy(terrH(hx) + .25) - w * .22, w, w * .45); }
}
function drawFront(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3;
 for (const p of W.props){ if (!p.front || p.x < x0 - 6 || p.x > x1 + 6) continue; drawSprite(p.k, p.x, terrH(p.x) + (p.lane ? 1.0 : 1.25), (PROP_H[p.k] || 1) * (p.lane ? .92 : 1)); }
 band(urban ? IMG.curbR : IMG.curbY, -.26, -.55, 18, x0, x1);
 if (urban) band(IMG.walk, -.55, -1.25, 9, x0, x1); else band(IMG.dirt, -.55, -1.2, 12, x0, x1);
 ctx.fillStyle = mix(B.ground, '#1a1410', G.tod === 'night' ? .6 : .25); ctx.beginPath(); ctx.moveTo(sx(x0), VH); for (let x = x0; x <= x1; x += 2) ctx.lineTo(sx(x), sy(terrH(x) - 1.22)); ctx.lineTo(sx(x1), VH); ctx.fill();
 if (urban) band(IMG.hedge, -1.05, -1.9, 14, x0, x1);
}
/* ---------------- vehicles: aligned wheels, shadows, real light positions ---------------- */
function drawVehicle(car, opt){
 opt = opt || {}; const g = car.g, lift = opt.lift || 0, sc = opt.scale || 1, k = PPM * g.s * sc, X = sx(car.x), Y = sy(car.y + lift);
 const src = car.cv || IMG[car.spr], sw = src.width, shh = src.height, baked = !car.player || (G.V && car.player && G.V.baked) || car.baked;
 const ca = Math.cos(-car.a), sa = Math.sin(-car.a), mk = car.mirror ? -k : k;
 const P = (px, py) => { const u = (px - sw / 2) * mk, v = (py - shh / 2) * k; return [X + u * ca - v * sa, Y + u * sa + v * ca]; };
 // contact + directional shadow onto the road
 if (opt.shadow !== false && S.set.gfx !== 'low') dirShadow(car, src, X, sy(terrH(car.x) + lift), sw, shh, mk, k); const gy = sy(terrH(car.x) + lift); contactShadow(car, lift, sc);
 
 if (car.glow){ const gr = ctx.createRadialGradient(X, gy, 0, X, gy, car.L * .6 * PPM); gr.addColorStop(0, car.glow + 'cc'); gr.addColorStop(1, car.glow + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(X, gy, car.L * .62 * PPM, PPM * .5, 0, 0, 7); ctx.fill(); }
 // player wheels (separate sprites, visible suspension travel)
 if (!baked) car.wh.forEach(w => { const r = w.r * PPM * sc, wx = X + (w.x - car.x) * PPM * sc, wy = Y - (w.y - car.y) * PPM * sc; ctx.save(); ctx.translate(wx, wy); if (w.flat) ctx.scale(1, .86); ctx.rotate(w.rot); const im = IMG['wh' + car.rim], q = WQ(car.rim); ctx.drawImage(im, -r * q, -r * q, r * 2 * q, r * 2 * q); ctx.restore(); });
 ctx.save(); ctx.translate(X, Y); ctx.rotate(-car.a); ctx.scale(mk, k); if (opt.dim && S.set.gfx !== 'low') ctx.filter = 'brightness(.86) saturate(.85)';
 ctx.drawImage(src, -sw / 2, -shh / 2); ctx.filter = 'none';
 // baked-wheel sprites: rotate the wheel's own pixels exactly in place → perfect alignment
 if (baked){ const crops = aiWheelCrops(car.spr), m = META[car.spr].wheels; m.forEach(([cx, cy], i) => { const w = car.wh[i], c = crops[i]; if (!w || !c) return; ctx.save(); ctx.translate(cx - sw / 2, cy - shh / 2); ctx.rotate(car.mirror ? -w.rot : w.rot); ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore(); }); }
 ctx.restore();
 if (car.rack){ ctx.save(); ctx.translate(X, Y); ctx.rotate(-car.a); const L = car.L * .62, top = -g.yt * PPM; ctx.fillStyle = '#2b2b2b'; ctx.fillRect(-L / 2 * PPM, top - PPM * .12, L * PPM, PPM * .06); for (let i = 0; i < 6; i++) ctx.fillRect((-L / 2 + i * L / 5) * PPM - 1, top - PPM * .12, PPM * .04, PPM * .12); const n = Math.min(4, Math.ceil((car.cargoKg || 0) / 40)); const cols = ['#8b5a2b','#3f6e8c','#b98d4e','#6b3f2a']; for (let i = 0; i < n; i++){ ctx.fillStyle = cols[i]; ctx.fillRect((-L / 2 + .15 + i * L / 4.3) * PPM, top - PPM * (.47 + (i % 2) * .08), L / 4.8 * PPM, PPM * (.35 + (i % 2) * .08)); } ctx.restore(); }
 // lights at their real positions on the artwork
 const M = META[car.spr], hl = M.hl, tl = M.tl; const lamp = (p, col, r) => { const [px, py] = P(p[0], p[1]), R = r * PPM * sc; const gr = ctx.createRadialGradient(px, py, 0, px, py, R); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, R, 0, 7); ctx.fill(); };
 const night = G.tod !== 'day', blink = Math.floor(G.time * 2.2) % 2 === 0;
 const dk = G.tod === 'night' ? 1 : G.tod === 'sunset' ? .6 : .3;
 if (!car.brokenTL){ if (night) lamp(tl, 'rgba(255,30,30,.75)', .16 + .1 * dk); if (car.braking) lamp(tl, 'rgba(255,40,30,1)', .14 + .2 * dk); if (car.rev) lamp([tl[0] + (car.mirror ? -1 : 1) * 2, tl[1] - 8], 'rgba(255,255,255,.95)', .35); }
 if (!car.brokenHL){ if (car.headOn || night) lamp(hl, `rgba(${car.lightCol || '255,236,190'},1)`, (car.headOn ? .13 : .1) + .22 * dk); else lamp(hl, 'rgba(255,255,255,.55)', .09); }
 if (blink && (car.ind === 1 || car.haz)){ lamp([hl[0] - 6, hl[1] + 10], 'rgba(255,165,0,1)', .45); lamp([tl[0] + 4, tl[1] + 10], 'rgba(255,165,0,1)', .42); }
 if (blink && (car.ind === -1 || car.haz)) lamp([tl[0] + 4, tl[1] - 8], 'rgba(255,165,0,.95)', .4);
 if (car.siren){ const on = Math.floor(G.time * 7) % 2; lamp([sw * (on ? .56 : .44), 6], on ? 'rgba(40,120,255,1)' : 'rgba(255,40,40,1)', 1.1); }
 if (G.weather === 'rain' && night && (car.headOn || car.braking)){ const [px, py] = P(car.braking ? tl[0] : hl[0], shh); const gr = ctx.createLinearGradient(0, py, 0, py + PPM * 1.4); gr.addColorStop(0, car.braking ? 'rgba(255,40,40,.35)' : 'rgba(255,230,170,.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(px - PPM * .2, py, PPM * .4, PPM * 1.4); }
}
/* ---------------- realistic damage: dents, creases, scraped paint, crumple, glass, smashed lamps ---------------- */
function drawDents(x, dents, w, h){
 for (const dt of dents){ const [u, v, r, ty] = dt, R = r * w, cx = u * w, cy = v * h, rg = mulberry((u * 9973 + v * 7919) | 0);
  x.save();
  if (ty === 3){ x.globalCompositeOperation = 'destination-out'; x.beginPath(); for (let a = 0; a < 6.3; a += .5){ const rr = R * (.55 + rg() * .35); x.lineTo(cx + Math.cos(a) * rr * (u < .5 ? 1.2 : 1.2), cy + Math.sin(a) * rr * .8); } x.fill(); x.globalCompositeOperation = 'source-atop'; }
  else x.globalCompositeOperation = 'source-atop';
  if (ty === 2){ x.strokeStyle = 'rgba(240,248,255,.9)'; x.lineWidth = Math.max(1, w / 420); for (let k = 0; k < 10; k++){ const a = k / 10 * 6.28 + rg() * .4; x.beginPath(); x.moveTo(cx, cy); let px = cx, py = cy; for (let s = 0; s < 5; s++){ px += Math.cos(a + (rg() - .5) * .5) * R * .28; py += Math.sin(a + (rg() - .5) * .5) * R * .28; x.lineTo(px, py); } x.stroke(); }
   for (const f of [.35, .7]){ x.beginPath(); for (let a = 0; a < 6.4; a += .6) x.lineTo(cx + Math.cos(a) * R * f * (.85 + rg() * .3), cy + Math.sin(a) * R * f * (.85 + rg() * .3)); x.closePath(); x.stroke(); }
   x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.arc(cx, cy, R * .9, 0, 7); x.fill(); x.restore(); continue; }
  if (ty === 4){ const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(20,20,20,.95)'); g.addColorStop(1, 'rgba(20,20,20,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill(); x.strokeStyle = 'rgba(230,230,230,.7)'; x.lineWidth = 1; for (let k = 0; k < 6; k++){ x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + (rg() - .5) * R * 1.6, cy + (rg() - .5) * R * 1.4); x.stroke(); } x.restore(); continue; }
  if (ty === 1){ for (let k = 0; k < 9; k++){ const yy = cy + (k - 4) * R * .09, len = R * (1.6 + rg() * 1.4), off = (rg() - .5) * R * .6; x.strokeStyle = k % 3 === 0 ? 'rgba(210,212,216,.75)' : 'rgba(40,36,34,.45)'; x.lineWidth = Math.max(1, R * (k % 3 === 0 ? .05 : .03)); x.beginPath(); x.moveTo(cx - len / 2 + off, yy); x.lineTo(cx + len / 2 + off, yy + (rg() - .5) * R * .12); x.stroke(); } x.restore(); continue; }
  // dent / crumple shading with creases and chipped paint revealing metal
  const g = x.createRadialGradient(cx + R * .2, cy + R * .2, R * .05, cx, cy, R * 1.1); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.55, 'rgba(0,0,0,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, R * 1.1, R * .8, rg() * .6 - .3, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = Math.max(1, R * .06); x.beginPath(); x.ellipse(cx - R * .15, cy - R * .15, R * .7, R * .5, 0, 3.3, 5.3); x.stroke();
  x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = Math.max(1, R * .035); for (let k = 0; k < (ty === 3 ? 7 : 4); k++){ const a = rg() * 6.28; x.beginPath(); x.moveTo(cx + Math.cos(a) * R * .15, cy + Math.sin(a) * R * .15); x.quadraticCurveTo(cx + Math.cos(a + .4) * R * .6, cy + Math.sin(a + .4) * R * .6, cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * .85); x.stroke(); }
  for (let k = 0; k < (ty === 3 ? 14 : 5); k++){ x.fillStyle = rg() < .7 ? 'rgba(198,200,205,.85)' : 'rgba(128,70,40,.7)'; const px = cx + (rg() - .5) * R * 1.6, py = cy + (rg() - .5) * R * 1.2; x.beginPath(); x.ellipse(px, py, R * (.03 + rg() * .07), R * (.02 + rg() * .04), rg() * 3, 0, 7); x.fill(); }
  x.restore(); }
}
function addDent(car, lx, ly, sev, glass){
 if (!car.cv) return; const g = car.g, w = car.cv.width, h = car.cv.height, M = META[car.spr];
 let u = clamp((car.mirror ? -lx : lx) / g.len + .5, .02, .98), v = clamp(.5 - ly / g.h, .08, .9);
 const near = p => p && Math.hypot(p[0] / w - u, p[1] / h - v) < .09;
 let ty = glass ? 2 : sev > 9 ? 3 : Math.random() < .4 ? 1 : 0; if (ty === 3) u = u < .5 ? .02 : .98;
 const r = clamp(.022 + sev * .01, .022, ty === 3 ? .09 : .065); const list = [[u, v, r, ty]];
 if (sev > 4 && near(M.hl)){ list.push([M.hl[0] / w, M.hl[1] / h, .03, 4]); car.brokenHL = true; }
 if (sev > 4 && near(M.tl)){ list.push([M.tl[0] / w, M.tl[1] / h, .03, 4]); car.brokenTL = true; }
 if (sev > 6 && !glass && Math.random() < .5) list.push([clamp(u + (u < .5 ? .08 : -.08), .05, .95), clamp(v - .22, .1, .5), .05, 2]);
 drawDents(car.cv.getContext('2d'), list, w, h); SILC.delete(car.cv); if (car.dents){ car.dents.push(...list); while (car.dents.length > 50) car.dents.shift(); }
}
function lightFlags(car){ const M = META[car.spr], w = car.cv.width, h = car.cv.height; for (const d of car.dents || []) if (d[3] === 4){ if (Math.hypot(d[0] - M.hl[0] / w, d[1] - M.hl[1] / h) < .05) car.brokenHL = true; if (Math.hypot(d[0] - M.tl[0] / w, d[1] - M.tl[1] / h) < .05) car.brokenTL = true; } }
/* ---------------- dashboard: live needles + full indicator system ---------------- */
function needle(x, cx, cy, len, ang, col, w){ x.save(); x.translate(cx, cy); x.rotate(ang * Math.PI / 180); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.shadowColor = col; x.shadowBlur = w * 2.5; x.beginPath(); x.moveTo(0, len * .14); x.lineTo(0, -len); x.stroke(); x.restore(); x.fillStyle = '#111'; x.beginPath(); x.arc(cx, cy, w * 2.4, 0, 7); x.fill(); }
function drawCluster(){
 const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight; if (!W2) return; const d = Math.min(2, window.devicePixelRatio || 1); if (c.width !== Math.round(W2 * d)){ c.width = Math.round(W2 * d); c.height = Math.round(H2 * d); }
 const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W2, H2); x.drawImage(IMG.cluster, 0, 0, W2, H2);
 const car = G.car; if (!car) return; const kmh = Math.abs(car.vx) * 3.6, rpm = G.engOn ? car.rpm * 6 : 0; G.nd = G.nd || {s:0, r:0}; G.nd.s += (kmh - G.nd.s) * .25; G.nd.r += (rpm - G.nd.r) * .2;
 needle(x, W2 * .234, H2 * .645, W2 * .128, -113 + clamp(G.nd.s / 160, 0, 1) * 228, '#ff5a1f', W2 * .007);
 needle(x, W2 * .782, H2 * .645, W2 * .128, -113 + clamp(G.nd.r / 6, 0, 1) * 230, '#ff5a1f', W2 * .007);
 const blink = Math.floor(G.time * 2.2) % 2 === 0, dim = 'rgba(8,10,14,.85)';
 x.fillStyle = dim; if (!(blink && (car.ind === -1 || car.haz))) x.fillRect(W2 * .355, H2 * .07, W2 * .06, H2 * .12); if (!(blink && (car.ind === 1 || car.haz))) x.fillRect(W2 * .585, H2 * .07, W2 * .06, H2 * .12); if (!G.doorOpen) x.fillRect(W2 * .47, H2 * .06, W2 * .055, H2 * .13);
 if (G.belt) x.fillRect(W2 * .405, H2 * .82, W2 * .04, H2 * .11); if (!(G.hbrake || !G.engOn || car.rev === 'P')) x.fillRect(W2 * .452, H2 * .82, W2 * .045, H2 * .11);
 if (!(G.cond && G.cond.engine < 45) && G.engOn) x.fillRect(W2 * .5, H2 * .82, W2 * .05, H2 * .11); if (!car.headOn) x.fillRect(W2 * .555, H2 * .82, W2 * .045, H2 * .11);
 // LCD
 const lx = W2 * .48, fs = H2 * .075; x.textAlign = 'center'; x.fillStyle = '#9fe8ff'; x.font = `700 ${H2 * .1}px "Readex Pro", sans-serif`; x.fillText(car.rev ? 'R' : G.engOn ? 'D' + car.gear : 'P', lx, H2 * .43);
 x.font = `600 ${fs}px "Readex Pro", sans-serif`; x.fillText(Math.round(kmh) + ' km/h', lx, H2 * .52); x.fillStyle = '#6fb8c8'; x.font = `500 ${fs * .85}px "Readex Pro", sans-serif`; x.fillText((G.odo || 0).toFixed(1) + ' km · ' + Math.round(G.cabin || 0) + '°C', lx, H2 * .6);
 // indicator lamp grid (lit = coloured, unlit = dark)
 const L = [['CC', !!G.cruise, '#3dff8a'], ['A/C', !!G.ac, '#46c8ff'], ['ABS', (car.absT || 0) > 0, '#ffb300'], ['TC', (car.tcT || 0) > 0, '#ffb300'],
  ['OIL', G.cond && G.cond.oil < 15, '#ff3b3b'], ['TPMS', car.wh.some(w => w.flat), '#ffb300'], ['FUEL', G.fuel < G.fuelMax * .12, '#ffb300'], ['TEMP', G.temp > 108, '#ff3b3b'],
  ['DOOR', G.doorOpen, '#ff3b3b'], ['HI', !!car.headOn, '#3d8bff'], ['WIPE', !!G.wiper, '#3dff8a'], ['FAN', (G.fan || 0) > 0, '#46c8ff']];
 const gx0 = W2 * .405, gw = W2 * .15, cw = gw / 4, ch = H2 * .052; x.font = `700 ${ch * .72}px "Readex Pro", sans-serif`;
 L.forEach(([t2, on, col], i) => { const cx = gx0 + (i % 4) * cw + cw / 2, cy = H2 * .655 + Math.floor(i / 4) * ch * 1.05; x.fillStyle = on ? col : 'rgba(120,140,150,.18)'; if (on){ x.shadowColor = col; x.shadowBlur = 6; } x.fillText(t2, cx, cy); x.shadowBlur = 0; });
 if (G.cruise){ x.fillStyle = '#3dff8a'; x.font = `700 ${fs * .8}px "Readex Pro", sans-serif`; x.fillText('SET ' + Math.round(G.cruise * 3.6), W2 * .234, H2 * .86); }
 if (car.absT > 0) car.absT -= .016; if (car.tcT > 0) car.tcT -= .016;
 const f = $('#fuelG'), tg = $('#tempG');
 for (const [el, img, val] of [[f, IMG.fuelG, G.fuel / G.fuelMax], [tg, IMG.tempG, clamp((G.temp - 50) / 70, 0, 1)]]){ const w = el.clientWidth, h = el.clientHeight; if (!w) continue; if (el.width !== Math.round(w * d)){ el.width = Math.round(w * d); el.height = Math.round(h * d); } const y = el.getContext('2d'); y.setTransform(d, 0, 0, d, 0, 0); y.clearRect(0, 0, w, h); y.drawImage(img, 0, 0, w, h); needle(y, w * .505, h * .665, w * .3, -56 + clamp(val, 0, 1) * 112, '#ff5a1f', w * .025); }
}
/* ---------------- smart, learning AI traffic ---------------- */
function aiMem(){ return S.aiMem || (S.aiMem = {honks:0, hits:0, tail:0, trips:0}); }
function spawnAI(spec, lane, x, dir, opt){
 dir = 1; const A = AIV[spec]; const geom = vehGeom(A.spr, A.len, false); opt = opt || {};
 const c = makeCar({geom, mass:A.mass, acc:A.mass > 6000 ? 1.6 : A.len < 3 ? 3.4 : 2.6, vmax:30, f:A.len < 3 ? 2.3 : A.mass > 6000 ? 1.4 : 1.75, travel:.14, zeta:.5, x, vx:0});
 const lim = curLimit(x) / 3.6; c.pers = {calm:Math.random(), speedK:opt.fast ? 1 : rnd(.94, 1.0)};
 c.tgt = lim * c.pers.speedK;
 c.vx = c.tgt * .9; c.wh.forEach(w => { w.vx = c.vx; w.om = c.vx / w.r; }); c.spec = spec; c.lane = lane; c.lift = lane ? .82 : 0; c.laneTo = lane; c.dir = dir; c.cv = spriteCanvas(A.spr); c.dents = []; c.stopT = 0; c.headOn = G.tod === 'night'; c.baked = true;
 if (opt.siren) c.siren = A.siren; G.ai.push(c); return c;
}
function updateAI(dt){
 const car = G.car, urban = W.biome.urban, hr = new Date().getHours(), rush = (hr >= 7 && hr <= 10) || (hr >= 15 && hr <= 19) ? 1.25 : hr < 5 ? .5 : 1;
 const dens = (G.mode === 'attract' ? .6 : urban > .5 ? 1 : urban > .1 ? .7 : .45) * rush * TRAFFIC_K(), mem = aiMem(), [x0, x1] = viewX();
 const near = G.ai.filter(a => a.laneTo === 0 && a.dir > 0 && a.x > car.x && !a.special), far = G.ai.filter(a => a.laneTo === 1);
 if (near.length < Math.round(2 * dens) && Math.random() < dt * .5){ const x = x1 + rnd(10, 60); if (x < W.len - 60 && !W.stops.some(s => Math.abs(s.x - x) < 30)) spawnAI(pick(AI_CIV), 0, x, 1); }
 if (G.mode === 'play' && Math.random() < dt * .03 * dens && !G.ai.some(a => a.fromBehind)){ const a = spawnAI(pick(AI_CIV), 0, x0 - 20, 1, {fast:true}); if (a) a.fromBehind = true; }
 if (far.length < Math.round(4 * dens) && Math.random() < dt * 1.1){ if (Math.random() < .5 || speedOf(car) > curLimit(car.x) / 3.6 * .85) spawnAI(pick(AI_CIV), 1, x1 + rnd(5, 40), 1); else spawnAI(pick(AI_CIV), 1, x0 - rnd(5, 30), 1, {fast:true}); }
 const n = Math.min(12, Math.ceil(dt * 240)), h = dt / n, gapK = 1 + Math.min(1, mem.hits * .12), yieldD = 30 + Math.min(25, mem.honks * .4);
 for (let i = G.ai.length - 1; i >= 0; i--){ const a = G.ai[i]; const lim = curLimit(a.x) / 3.6; let v = a.special === 'amb' ? Math.max(lim + 3, 18) : lim * (a.pers ? a.pers.speedK : 1);
  if (a.laneTo === 0 && a.dir > 0 && a.lift < .5){
   let lead = null, gap = 1e9; for (const b of G.ai.concat([car])) if (b !== a && (b === car || (b.lift < .5 && b.dir > 0)) && b.x > a.x){ const gg = b.x - b.L / 2 - (a.x + a.L / 2); if (gg < gap){ gap = gg; lead = b; } }
   if (lead){ const lv = lead.vx || 0, safe = (3 + Math.abs(a.vx) * .9) * (lead === car ? gapK : 1); v = Math.min(v, Math.max(0, lv + (gap - safe) * .6));
    // overtake anything slow or stopped instead of queueing (no jams)
    const slow = lv < Math.abs(a.tgt) * .6; if (slow && gap < 22){ a.blockT = (a.blockT || 0) + dt; if (a.blockT > (lead === car ? 1.2 : .6)){ if (lead === car && !a.honkedAt && a.fromBehind){ a.honkedAt = true; AU.horn('stock', false, .35); say(pick(DLG.honkAt), a.x, a.y + a.yt + .8, '#ffd35a'); } a.laneTo = 1; a.passing = lead; a.blockT = 0; v = Math.max(v, Math.abs(a.tgt)); } } else a.blockT = 0; }
   for (const l of W.lights){ const line = l.x - 3.2, d = line - (a.x + a.L / 2); if (d > -.5 && d < 35 && lightState(l) !== 'g' && !(lightState(l) === 'y' && d < 6)) v = Math.min(v, Math.max(0, d * .45)); }
   if (!a.special && a.spec === 0 && a.stopT <= 0 && !a.didStop && Math.random() < dt * .02 && a.x > car.x + 80){ a.stopT = 3.5; a.haz = true; a.didStop = true; }
   if (a.stopT > 0){ a.stopT -= dt; v = 0; if (a.stopT <= 0 || a.x - car.x < 35){ a.stopT = 0; a.haz = false; } }
   if (G.honked && a.x > car.x && a.x - car.x < yieldD && !a.special){ a.laneTo = 1; a.passing = car; a.tgt = Math.max(a.tgt, lim); a.stopT = 0; a.haz = false; if (!a.saidHonk){ a.saidHonk = 1; say(pick(DLG.honkBack), a.x, a.y + a.yt + .8, '#fff'); } }
  }
  { for (const l of W.lights){ const line = l.x - 3.2, d = line - (a.x + a.L / 2); if (d > -.5 && d < 35 && lightState(l) !== 'g' && !(lightState(l) === 'y' && d < 6)) v = Math.min(v, Math.max(0, d * .45)); }
   let fl = null, fg = 1e9; for (const b of G.ai) if (b !== a && b.lift >= .5 && b.x > a.x){ const gg = b.x - b.L / 2 - (a.x + a.L / 2); if (gg < fg){ fg = gg; fl = b; } } if (fl) v = Math.min(v, Math.max(0, fl.vx + (fg - (3 + Math.abs(a.vx) * .9)) * .6)); }
  // merge back after passing
  if (a.laneTo === 1 && a.passing && a.dir > 0){ const p = a.passing; if (a.x - a.L / 2 > p.x + p.L / 2 + 8 && !G.ai.some(b => b !== a && b.lift < .5 && Math.abs(b.x - a.x) < a.L + 6)){ a.laneTo = 0; a.passing = null; } if (p.gone) a.passing = null; }
  const tgtLift = a.laneTo ? .82 : 0; if (a.lift !== tgtLift){ a.lift += Math.sign(tgtLift - a.lift) * dt * .75; if (Math.abs(a.lift - tgtLift) < .02){ a.lift = tgtLift; a.lane = a.laneTo; } }
  a.braking = Math.abs(v) < Math.abs(a.vx) - .4 || (a.stopT > 0);
  v = Math.max(0, v); for (let k = 0; k < n; k++) physStep(a, h, {aiV:v});
  if (a.vx > v + 1){ const k3 = Math.min(a.vx - v, 4 * dt); a.vx -= k3; a.wh.forEach(w => { w.vx -= k3; w.om = w.vx / w.r; }); }
  { const sp = a.vx, dv = v - sp; if (dv > .3 && a.grounded){ const k2 = Math.min(dv, 2.8 * dt); a.vx += k2; a.wh.forEach(w => { w.vx += k2; }); } }
  if (a.vx < 0){ a.vx = Math.max(a.vx, 0); a.wh.forEach(w => { if (w.vx < 0) w.vx = 0; if (w.om < 0) w.om = 0; }); }
  if (a.siren && Math.floor(G.time * 3) !== a._s){ a._s = Math.floor(G.time * 3); if (Math.abs(a.x - car.x) < 90) AU.siren(a.siren, G.time); }
  if (a.wedding && a === G.ai.find(q => q.wedding) && Math.floor(G.time * .22) !== a._w){ a._w = Math.floor(G.time * .22); if (Math.abs(a.x - car.x) < 60){ AU.horn('melody', false, .3 * clamp(1 - Math.abs(a.x - car.x) / 70, .15, 1)); if (Math.random() < .5) say(pick(DLG.wedding), a.x, a.y + a.yt + 1.2, '#ffd35a'); } }
  if (a.lift < .3 && a.laneTo === 0 && G.mode === 'play'){ const rv = collide(car, a); if (rv > 1.5 && G.time - (a.hitT || -9) > .6){ a.hitT = G.time; const front = car.x < a.x; addDent(car, (front ? 1 : -1) * car.L * .47, car.yb + .45, rv * 1.6); addDent(a, (front ? -1 : 1) * a.L * .47, a.yb + .4, rv * 1.6); AU.thud(rv * 2); cam.shake = Math.min(1, rv / 6); G.comfort -= rv * 5; mem.hits++;
    if (!G.test){ GV(G.vid).cond.body = clamp(GV(G.vid).cond.body - rv * 2.5 * car.armor, 0, 100); if (front) GV(G.vid).cond.engine = clamp(GV(G.vid).cond.engine - rv * .6, 0, 100); }
    for (let q = 0; q < 12; q++) puff(front ? car.x + car.L / 2 : car.x - car.L / 2, car.y, rnd(-3, 3), rnd(0, 4), .5, .04, '#FFD24A', 'spark'); if (rv > 3 && front && !a.special){ say(pick(DLG.crash), a.x, a.y + a.yt + .8, '#ff9aa4'); toast(t('crashAI'), 'bad'); addFine('crash', false); G.T.hits++; S.stats.crashes++; } } }
  if (a.x < car.x - 170 || a.x > car.x + 280 || Math.cos(a.a) < 0){ a.gone = true; G.ai.splice(i, 1); }
 }
 G.honked = false;
}
/* road events (non-blocking): roadworks, school zone, breakdown on the shoulder, wedding convoy, police patrol */
function eventsTick(dt){
 const car = G.car;
 for (const e of W.ev || []){ const d = e.x - car.x;
  if (!e.warn && d < 120 && d > 0){ e.warn = 1; if (e.kind === 'works') toast((LANG === 'ar' ? 'أعمال طرق قدام — الحد ٤٠' : 'Roadworks ahead — limit 40'), 'gold'); if (e.kind === 'school') toast(LANG === 'ar' ? 'منطقة مدارس — هدّي ٤٠' : 'School zone — slow to 40', 'gold'); if (e.kind === 'breakdown') toast(LANG === 'ar' ? 'عربية عطلانة على جنب' : 'Broken-down car on the shoulder', 'gold'); }
  if (e.kind === 'wedding' && !e.done && d < 40 && d > -10){ e.done = 1; for (let k = 0; k < 3; k++){ const a = spawnAI(pick([1,2,14,18]), 1, car.x - 70 - k * 9, 1, {fast:true}); if (a){ a.wedding = true; a.haz = true; a.special = 'wed'; } } toast(LANG === 'ar' ? 'زفة فرح جاية! 🎉' : 'A wedding convoy is coming! 🎉', 'gold'); }
  if (e.kind === 'patrol' && !e.done && d < 40 && d > -10){ e.done = 1; const emerg = Math.random() < .25; const a = spawnAI(pick([22,23,24,25]), 1, car.x - 80, 1, {siren:emerg, fast:emerg}); if (a){ a.special = emerg ? 'pol' : null; if (emerg) a.pers.speedK = 1.1; } }
  if (false){ e.kids = 1; G.pedX = {x:car.x + car.L / 2 + 22, k:0, d:0, t:pick([13,14,19,20]), h:1.3}; toast(t('ped'), 'bad'); }
 }
}
/* ---------------- A/C model: compressor, fan, recirculation, vent mode, demist ---------------- */
function acStep(dt){
 const out = BIOME[W.route.biome].temp - (G.tod === 'night' ? 7 : 0) + G.onboard.length * .09 + (G.weather === 'rain' ? -5 : 0), fan = G.fan || 0, fl = fan / 4;
 const tgt = G.ac && fan ? Math.max(G.acSet, 14) : fan ? out - 1.5 : out; const rate = .012 + .07 * fl * (G.recirc ? 1.35 : 1) * (G.ac ? 1 : .45) * (1 + .15 * upl(G.vid, 'ac'));
 G.cabin += (tgt - G.cabin) * dt * rate; G.cabin += (G.doorOpen ? (out - G.cabin) * .05 : 0) * dt;
 if (G.onboard.length){ if (G.cabin > 28) G.comfort -= (G.cabin - 28) * .08 * dt; else if (G.cabin < 19 && fan >= 3) G.comfort -= (19 - G.cabin) * .06 * dt; else if (G.cabin >= 21 && G.cabin <= 25) G.comfort += (.35 + (G.vent === 'face' ? .15 : 0)) * dt; }
 G.fog = G.weather === 'rain' ? clamp((G.fog || 0) + dt * (G.ac && G.defrost ? -.25 : G.ac ? -.05 : .012), 0, .75) : Math.max(0, (G.fog || 0) - dt * .2);
}
function acFuel(){ return 1 + (G.ac && G.fan ? .05 + .025 * G.fan - .01 * upl(G.vid, 'ac') : G.fan ? .01 : 0); }
/* ---------------- per-frame v2 tick: dialogues, ambience, events ---------------- */
function v2tick(dt, spd, full){
 AMBI.update(dt); if (!full) return; eventsTick(dt); const car = G.car, pax = G.onboard.length; G.talkT = (G.talkT || 6) - dt;
 if (G.weather === 'rain') G.wiper = true;
 // turn signal relay tick
 if ((car.ind || car.haz) && Math.floor(G.time * 2.2) !== G._tk){ G._tk = Math.floor(G.time * 2.2); AU.tone(G._tk % 2 ? 1400 : 900, .025, 'square', .035); }
 const acc = (car.vx - (G._pv || 0)) / dt; G._pv = car.vx; const kmh = spd * 3.6, lim = curLimit(car.x);
 const bubble = key2 => { if (!pax || G.talkT > 0) return; G.talkT = rnd(6, 11); say(pick(DLG[key2]), car.x + car.L * .1, car.y + car.yt + .9); };
 if (acc < -6.5 && spd > 4) bubble('brake'); else if (kmh > lim + 12) bubble('fast'); else if (G.cabin > 29.5) bubble('hot'); else if (G.cabin < 18.5 && (G.fan || 0) >= 3) bubble('cold'); else if (G.fog > .6) bubble('fog');
 else if (radioAudible() && S.set.radio > .88) bubble(STATIONS[S.radio.st].g === 'calm' ? 'calmLoud' : 'loud'); else if (G.talkT <= 0 && pax){ const r = Math.random(); if (radioAudible() && r < .45){ const gnr = STATIONS[S.radio.st].g; bubble(gnr); G.comfort = Math.min(100, G.comfort + (gnr === 'calm' ? 3 : 2)); } else if (G.ac && G.cabin < 25 && r < .7) bubble('niceAir'); else G.talkT = 4; }
 if (G.doorOpen && spd < .3){ G.idleStop = (G.idleStop || 0) + dt; if (G.idleStop > 14 && pax){ G.idleStop = 0; bubble('wait'); } } else G.idleStop = 0;
 // radio genre preference drives mood gently
 if (radioAudible() && pax){ const gnr = STATIONS[S.radio.st].g; G.comfort = Math.min(100, G.comfort + (gnr === 'calm' ? .12 : .06) * dt); }
 // AI learns: tailgating the car ahead
 for (const a of G.ai) if (a.lift < .3 && a.x > car.x){ const gap = a.x - a.L / 2 - (car.x + car.L / 2); if (gap < 3 && spd > 6){ aiMem().tail += dt; } }
 if (G.fog > 0){ const el = $('#fatigue'); }
}
