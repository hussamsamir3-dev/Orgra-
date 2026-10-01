/* Ograaa | أجرة — game bundle. Designed & developed by Hossam Hegazi.
   Modules are concatenated in load order; each section is marked below. */

/* ======================= core.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA | أجرة — Egyptian microbus, bus & coach driving simulator
   Designed & developed by Hossam Hegazi
   ===================================================================== */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, smooth = t => t * t * (3 - 2 * t);
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[(Math.random() * a.length) | 0];
const dayKey = (d = new Date()) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const DAY = 864e5;

/* ---------------- i18n ---------------- */
let LANG = 'ar';
const TX = {
 play:['يلا نسوق','Drive'], home:['الرئيسية','Home'], routes:['المسارات','Routes'], garage:['الجراج','Garage'], showroom:['المعرض','Showroom'], traffic:['المرور','Traffic Dept'],
 profile:['ملف السائق','Driver Profile'], settings:['الإعدادات','Settings'], wallet:['المحفظة','Wallet'], egp:['ج.م','EGP'], km:['كم','km'], kmh:['كم/س','km/h'], lvl:['مستوى','Level'],
 tag:['كل مشوار بيكبّر رصيدك','Every trip grows your balance'], balance:['الرصيد الحالي','Current balance'], tx:['آخر المعاملات','Recent transactions'], week:['حركة الرصيد (آخر ٧ أيام)','Balance movement (last 7 days)'],
 earn:['مكتسبات','Earned'], spend:['مصاريف','Spent'], daily:['مهام النهارده','Today\'s tasks'], streak:['أيام متتالية','day streak'], claim:['استلم','Claim'], claimed:['اتاستلم','Claimed'],
 dailyGift:['هدية يومية','Daily gift'], micro:['ميكروباص','Microbus'], bus:['أتوبيس','City bus'], coach:['سفر','Intercity'], fare:['الأجرة','Fare'], stops:['محطات','stops'], rests:['استراحات','rest stops'],
 est:['تقديري','est.'], locked:['يفتح في مستوى','Unlocks at level'], choose:['اختار المسار','Start route'], vehicle:['المركبة','Vehicle'], noVeh:['محتاج مركبة مناسبة للخط ده — اشتري من المعرض','You need a suitable vehicle for this line — buy one in the Showroom'],
 cargo:['طرود للتوصيل','Parcels to deliver'], cap:['السعة','Capacity'], kg:['كجم','kg'], accept:['خد الطرد','Take'], taken:['معاك','Loaded'], fragile:['قابل للكسر','Fragile'], to:['إلى','to'],
 weather:['الطقس','Weather'], clear:['صحو','Clear'], rain:['مطر','Rain'], sand:['عاصفة ترابية','Sandstorm'], timeOfDay:['الوقت','Time'], day:['نهار','Day'], sunset:['مغرب','Sunset'], night:['ليل','Night'],
 trafficLvl:['الزحمة','Traffic'], low:['خفيفة','Light'], med:['متوسطة','Moderate'], high:['زحمة','Heavy'], estTime:['الوقت المتوقع','Est. time'], min:['د','min'],
 appearance:['المظهر','Appearance'], performance:['الأداء','Performance'], maintenance:['الصيانة','Maintenance'], storage:['التخزين','Storage'],
 paint:['الدهان','Paint'], stripe:['الخطوط','Stripes'], rims:['الجنوط','Rims'], tint:['فاميه','Window tint'], sticker:['استيكر','Sticker'], glow:['نيون أرضي','Underglow'], horn:['الكلاكس','Horn'], lights:['الفوانيس','Headlights'],
 buy:['شراء','Buy'], equip:['استخدم','Equip'], equipped:['مستخدم','Equipped'], owned:['متملك','Owned'], sel:['اختار','Select'], selected:['مختارة','Selected'], test:['تجربة','Test drive'],
 notEnough:['الفلوس مش مكفية','Not enough money'], bought:['مبروك! اتشرت','Purchased!'], repair:['إصلاح','Repair'], done:['تمام','Done'],
 speed:['السرعة','Top speed'], accel:['التسارع','Acceleration'], grip:['الثبات','Grip'], brakesS:['الفرامل','Brakes'], seats:['الكراسي','Seats'], stand:['وقوف','standing'], tank:['التانك','Tank'], cons:['الاستهلاك','Consumption'], L100:['لتر/١٠٠كم','L/100km'],
 up_engine:['الموتور','Engine'], up_gear:['الفتيس','Gearbox'], up_susp:['العفشة','Suspension'], up_tires:['الكاوتش','Tyres'], up_brakes:['الفرامل','Brakes'], up_tank:['تانك البنزين','Fuel tank'], up_armor:['تدعيم الشاسيه','Chassis armour'], up_ac:['التكييف','A/C unit'], up_audio:['الكاسيت','Sound system'], up_store:['الشنطة / الشبكة','Cargo space'],
 c_body:['الصاج','Body'], c_engine:['الموتور','Engine'], c_susp:['العفشة','Suspension'], c_tyres:['الكاوتش','Tyres'], c_brakes:['تيل الفرامل','Brake pads'], c_oil:['الزيت','Oil'], c_clean:['النظافة','Cleanliness'], c_fuel:['البنزين','Fuel'],
 fix_body:['سمكرة ودوكو','Panel beating & paint'], fix_engine:['عمرة موتور','Engine overhaul'], fix_susp:['تغيير عفشة','Suspension service'], fix_tyres:['كاوتش جديد','New tyres'], fix_brakes:['تيل جديد','New brake pads'], fix_oil:['تغيير زيت','Oil change'], fix_clean:['غسيل','Car wash'], fix_fuel:['فوّل التانك','Fill the tank'],
 license:['رخصة القيادة','Driving licence'], vlicense:['رخصة المركبة','Vehicle licence'], fines:['المخالفات','Fines'], inspection:['الفحص الفني','Inspection'], valid:['سارية','Valid'], suspended:['مسحوبة','Suspended'], expired:['منتهية','Expired'],
 points:['نقاط المخالفات','Penalty points'], payAll:['ادفع الكل','Pay all'], noFines:['مفيش مخالفات — عاش يا أسطى','No fines — well done, driver'], renew:['تجديد','Renew'], doInsp:['احجز فحص','Book inspection'], inspOk:['الفحص عدى بنجاح','Passed inspection'], inspFail:['الفحص رفض: صلّح المركبة الأول','Inspection failed: repair the vehicle first'],
 name:['الاسم','Name'], driverTitle:['لقب السائق','Driver title'], stats:['إحصائيات المسيرة','Career stats'], totalKm:['إجمالي المسافة','Total distance'], trips:['الرحلات','Trips'], pax:['الركاب','Passengers'], earned:['إجمالي الدخل','Total earned'], rating:['تقييم الركاب','Passenger rating'], badges:['الشارات','Badges'],
 music:['الموسيقى','Music'], sfx:['المؤثرات','Sound effects'], engVol:['صوت الموتور','Engine volume'], radioVol:['صوت الراديو','Radio volume'], gfx:['جودة الرسومات','Graphics quality'], high:['عالية','High'], lowq:['موفرة','Battery saver'],
 autoDoor:['أبواب أوتوماتيك','Automatic doors'], lang:['اللغة','Language'], reset:['مسح التقدم','Reset progress'], resetQ:['متأكد؟ هتمسح كل حاجة','Sure? This erases everything'], save:['حفظ','Save'], on:['شغال','On'], off:['مقفول','Off'],
 credit:['تصميم وتطوير حسام حجازي','Designed & developed by Hossam Hegazi'], tapStart:['اضغط في أي حتة للبدء','Tap anywhere to start'], loading:['جاري التحميل','Loading'],
 // in-game
 startEng:['دوّر الموتور','Start the engine'], doorOpen:['افتح الباب','Open the door'], doorClose:['اقفل الباب','Close the door'], next:['المحطة الجاية','Next stop'], lastStop:['آخر الخط','Last stop'],
 boarding:['الركاب طالعين','Passengers boarding'], payFare:['الأجرة','Fare'], tips:['بقشيش','Tips'], missed:['عديت المحطة يا أسطى!','You missed the stop, driver!'], backUp:['ارجع ورا شوية للمحطة','Reverse a little to the stop'],
 doorDrive:['الباب مفتوح وإنت ماشي!','Driving with the door open!'], belt:['اربط الحزام','Fasten your seatbelt'], beltOn:['الحزام اتربط','Seatbelt fastened'],
 cpAhead:['كمين قدام — هدّي','Police checkpoint ahead — slow down'], cpStop:['قف عند الظابط','Stop by the officer'], cpOk:['اتفضل يا أسطى — كله تمام','Carry on, driver — all good'], cpRan:['هربت من الكمين!','You ran the checkpoint!'],
 fBelt:['عدم ربط الحزام','No seatbelt'], fLights:['السواقة بالليل من غير نور','Driving at night without lights'], fDoor:['السير والباب مفتوح','Driving with door open'], fOver:['حمولة زيادة','Overloading'], fInsp:['الفحص الفني منتهي','Inspection expired'], fLic:['الرخصة مسحوبة','Licence suspended'], fRed:['كسر إشارة حمرا','Running a red light'], fRadar:['تجاوز السرعة','Speeding'], fRun:['الهروب من الكمين','Evading a checkpoint'], fAmb:['عدم إفساح الطريق للإسعاف','Failing to yield to an ambulance'], fCrash:['حادثة تصادم','Collision'], fPed:['عدم الوقوف للمشاة','Not stopping for pedestrians'],
 redAhead:['إشارة قدامك','Traffic light ahead'], radar:['رادار','Speed camera'], limit:['الحد','Limit'], amb:['إسعاف ورا منك — اركن على جنب وقف!','Ambulance behind you — pull over and stop!'], ambOk:['برافو! فسحت للإسعاف','Well done! You made way for the ambulance'],
 honkMove:['اضرب كلاكس عشان يوسّع','Honk so they move over'], jam:['العربية اللي قدامك واقفة','The car ahead has stopped'], crashAI:['خبطت عربية! إنت أعمى يا أسطى؟','You hit a car! Are you blind, driver?'],
 ped:['في حد بيعدي — قف!','Someone is crossing — stop!'], pedOk:['شكراً يا أسطى','Thanks, driver'], flat:['الكاوتش نام!','Flat tyre!'], overheat:['الموتور سخن! هدّي','Engine overheating! Ease off'],
 fuelLow:['البنزين قرب يخلص','Fuel is low'], refuel:['فوّل من البنزينة','Refuel here'], refueled:['التانك اتملى','Tank filled'], wipers:['شغل المساحات','Turn on the wipers'],
 restAhead:['استراحة قدام','Rest house ahead'], restTitle:['استراحة','Rest house'], rest1:['الركاب نزلوا يستريحوا — دقيقة وراجعين','Passengers are taking a break — back in a minute'], callBack:['نادي على الركاب','Call passengers back'], leave:['اتحرك','Depart'],
 sideStop:['راكب: "على جنب يا أسطى!"','Passenger: "Drop me here, driver!"'], sideOk:['نزل الراكب — شكراً','Passenger dropped — thanks'], change:['راكب معاه ٢٠٠ جنيه ومحتاج باقي','Passenger has a 200-pound note and needs change'], giveChange:['ادّيله الباقي','Give change'], askPax:['اسأل الركاب','Ask other riders'],
 loud:['"وطّي الراديو شوية يا أسطى"','"Turn the radio down a bit, driver"'], hot:['"الجو حر! شغل التكييف"','"It\'s hot! Turn on the A/C"'], likeRadio:['"الله! علّي الأغنية دي"','"Oh, turn this song up!"'],
 parcelOk:['تم تسليم الطرد','Parcel delivered'], parcelBroken:['الطرد اتكسر من المطبات!','A parcel broke over the bumps!'], cruiseSet:['مثبت السرعة','Cruise control'], cruiseOff:['مثبت السرعة اتلغى','Cruise cancelled'],
 pause:['إيقاف مؤقت','Paused'], resume:['كمّل','Resume'], quit:['اخرج للقائمة','Quit to menu'], restart:['ابدأ من جديد','Restart'],
 receipt:['إيصال الرحلة','Trip receipt'], r_fares:['الأجرة','Fares'], r_tips:['البقشيش','Tips'], r_cargo:['الطرود','Parcels'], r_fuel:['السولار','Diesel'], r_fee:['الكارتة','Terminal fee'], r_fines:['المخالفات','Fines'], r_rest:['الاستراحة','Rest house'], net:['صافي الربح','Net profit'],
 again:['تاني','Drive again'], more:['مسارات تانية','More routes'], menu:['القائمة','Menu'], crashEnd:['المركبة اتقلبت!','The vehicle rolled over!'], brokeEnd:['المركبة عطلت','The vehicle broke down'], fuelEnd:['البنزين خلص','Out of fuel'],
 towing:['ونش','Tow truck'], lvUp:['مستوى جديد!','Level up!'], testDrive:['تجربة قيادة — مفيش فلوس ولا تلفيات','Test drive — no earnings, no damage'],
 help:['إزاي تلعب','How to play'], help1:['دوس بنزين وفرامل (أو ← →). وقف عند المحطات وافتح الباب (D) عشان الركاب يطلعوا وينزلوا.','Use gas & brake (or ← →). Stop at stops and open the door (D) so passengers can board and alight.'],
 help2:['خلي بالك: الإشارات، الكماين، الرادار، الإسعاف، المشاة، والمطبات. اربط الحزام (B) وشغل النور بالليل (L).','Watch out for traffic lights, police checkpoints, speed cameras, ambulances, pedestrians and bumps. Fasten your belt (B) and use lights at night (L).'],
 help3:['راديو (R) وتكييف (A) ومثبت سرعة (C) — كلهم بيفرقوا في مزاج الركاب والبقشيش.','Radio (R), A/C (A) and cruise control (C) all affect passenger mood and tips.'],
 gotIt:['فهمت','Got it'], welcome:['أهلاً يا أسطى!','Welcome, driver!'], tut:['خد هدية البداية وابدأ أول مشوار','Grab your starter bonus and start your first trip'],
};
const t = k => (TX[k] ? TX[k][LANG === 'ar' ? 0 : 1] : k);
const nm = p => LANG === 'ar' ? p[0] : p[1];
const AR_DIG = '٠١٢٣٤٥٦٧٨٩';
function fmt(n, dec = 0){ let s = typeof n === 'number' ? n.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec}) : String(n); if (LANG === 'ar') s = s.replace(/\d/g, d => AR_DIG[d]).replace(/,/g, '٬').replace(/\./g, '٫'); return s; }
const money = n => fmt(Math.round(n)) + ' ' + t('egp');

/* ---------------- Vehicles (player) — sprite geometry comes from META ---------------- */
const VEHS = [
 {id:'hiace', spr:'pv0', rim:0, cls:'micro', name:['ميكروباص تويوتا هايس','Toyota HiAce Microbus'], len:5.4, mass:2250, seats:14, stand:0, price:0, lvl:1, acc:3.3, vmax:34, tank:70, lp100:12, store:120, f:1.75, travel:.17, brk:7.5, door:.12, rack:true},
 {id:'coaster', spr:'pv1', rim:2, cls:'micro', name:['ميني باص كوستر','Coaster Minibus'], len:7.0, mass:4300, seats:26, stand:4, price:26000, lvl:3, acc:2.8, vmax:29, tank:95, lp100:17, store:220, f:1.6, travel:.18, brk:7, door:.1, rack:true},
 {id:'redbus', spr:'pv3', rim:6, cls:'bus', name:['أتوبيس المدينة الأحمر','Red City Bus'], len:10.2, mass:9600, seats:30, stand:30, price:48000, lvl:4, acc:2.25, vmax:25, tank:180, lp100:31, store:300, f:1.4, travel:.16, brk:6.5, door:.38},
 {id:'mcv', spr:'pv2', rim:4, cls:'bus', name:['أتوبيس النقل العام الأزرق','Blue Public Transport Bus'], len:10.8, mass:10400, seats:34, stand:36, price:64000, lvl:5, acc:2.2, vmax:25, tank:200, lp100:32, store:350, f:1.4, travel:.16, brk:6.5, door:.3},
 {id:'coachB', spr:'pv4', rim:8, cls:'coach', name:['أتوبيس سفر الموجة الزرقاء','Blue Wave Coach'], len:11.6, mass:13200, seats:45, stand:0, price:135000, lvl:6, acc:2.1, vmax:31, tank:400, lp100:29, store:1800, f:1.3, travel:.17, brk:6.2, door:.34},
 {id:'coachO', spr:'pv5', rim:10, cls:'coach', name:['أتوبيس سفر الغروب','Sunset Luxury Coach'], len:11.8, mass:13800, seats:49, stand:0, price:185000, lvl:8, acc:2.25, vmax:32, tank:450, lp100:28, store:2400, f:1.3, travel:.18, brk:6.4, door:.34}
];
const VBY = id => VEHS.find(v => v.id === id);
/* AI traffic sprites — real lengths in metres */
const AIV = [
 {spr:'ai0', len:4.1, name:'taxi', v:[9,14], mass:1000}, {spr:'ai1', len:4.5, v:[10,16], mass:1250}, {spr:'ai2', len:4.3, v:[9,14], mass:1150}, {spr:'ai3', len:4.6, v:[11,17], mass:1700},
 {spr:'ai4', len:2.65, v:[7,10], mass:380, small:true}, {spr:'ai5', len:2.05, v:[11,16], mass:220, small:true}, {spr:'ai6', len:1.85, v:[9,13], mass:160, small:true},
 {spr:'ai7', len:5.3, v:[9,14], mass:1900}, {spr:'ai8', len:8.0, v:[7,11], mass:9000}, {spr:'ai9', len:8.2, v:[7,11], mass:12000}, {spr:'ai10', len:5.3, v:[15,19], mass:2600, siren:'amb'}, {spr:'ai11', len:4.6, v:[12,17], mass:1400, siren:'pol'}
];

/* ---------------- Upgrades & cosmetics ---------------- */
const UPS = ['engine','gear','susp','tires','brakes','tank','armor','ac','audio','store'];
const UP_ICON = {engine:'engine', gear:'upgrade', susp:'repair', tires:'tyre', brakes:'crash', tank:'fuel', armor:'garage', ac:'weather', audio:'radio', store:'terminal'};
const upCost = (v, k, l) => Math.round((400 + v.mass * .09) * Math.pow(1.7, l) * (k === 'engine' ? 1.3 : k === 'audio' || k === 'ac' ? .7 : 1) / 10) * 10;
const COS = {
 paint:[{id:'stock', c:null, p:0, n:['الأصلي','Factory']}, {id:'white', c:[238,240,242], p:700, n:['أبيض لؤلؤي','Pearl white']}, {id:'cream', c:[230,214,178], p:700, n:['بيج كلاسيك','Classic cream']}, {id:'yellow', c:[246,190,24], p:900, n:['أصفر تاكسي','Taxi yellow']}, {id:'blue', c:[28,86,196], p:900, n:['أزرق قاهري','Cairo blue']}, {id:'teal', c:[18,140,140], p:900, n:['فيروزي نيلي','Nile teal']}, {id:'gold', c:[212,168,70], p:1400, n:['ذهبي صحراوي','Desert gold']}, {id:'wine', c:[124,24,44], p:1100, n:['نبيتي','Burgundy']}, {id:'black', c:[34,36,40], p:1200, n:['أسود ملكي','Royal black']}, {id:'silver', c:[168,174,182], p:1000, n:['فضي','Silver']}, {id:'army', c:[86,98,60], p:1000, n:['زيتي','Olive']}, {id:'orange', c:[236,108,24], p:1000, n:['برتقالي نار','Flame orange']}, {id:'pink', c:[232,120,170], p:1300, n:['بمبي','Candy pink']}],
 stripe:[{id:'none', p:0, n:['من غير','None']}, {id:'micro', p:350, n:['خط الميكروباص الكلاسيك','Classic microbus line'], s:[[.62,.035,'#1c4fa0']]}, {id:'flag', p:600, n:['علم مصر','Egypt flag'], s:[[.56,.03,'#ce1126'],[.59,.03,'#ffffff'],[.62,.03,'#111111']]}, {id:'race', p:650, n:['سباق','Racing'], s:[[.5,.07,'#111111'],[.6,.025,'#f5b21b']]}, {id:'gold', p:800, n:['خط دهبي','Gold line'], s:[[.66,.02,'#f5b21b'],[.7,.01,'#f5b21b']]}, {id:'check', p:700, n:['مربعات تاكسي','Taxi checks'], check:true}],
 rim:Array.from({length:12}, (_, i) => ({id:'w' + i, wh:i, p:[400,400,600,600,800,800,900,900,1100,1100,1400,1600][i], n:[['جنط','Rim'][0] + ' ' + (i + 1), 'Rim ' + (i + 1)]})),
 tint:[{id:'none', p:0, a:0, n:['من غير','None']}, {id:'light', p:250, a:.25, n:['فاتح','Light']}, {id:'dark', p:450, a:.5, n:['غامق','Dark']}, {id:'limo', p:700, a:.72, n:['ليموزين','Limo']}],
 sticker:[{id:'none', p:0, n:['من غير','None'], s:''}, {id:'s1', p:150, s:'الزمن غدار', n:['الزمن غدار','"Time is treacherous"']}, {id:'s2', p:150, s:'ابن الأصول', n:['ابن الأصول','"Man of good roots"']}, {id:'s3', p:150, s:'كله بيعدي', n:['كله بيعدي','"Everything passes"']}, {id:'s4', p:200, s:'ماشي بدعاء أمي', n:['ماشي بدعاء أمي','"Driven by mum\'s prayers"']}, {id:'s5', p:200, s:'عين الحسود فيها عود', n:['عين الحسود فيها عود','"Evil eye, stay away"']}, {id:'s6', p:250, s:'OGRAAA', n:['OGRAAA','OGRAAA']}],
 glow:[{id:'none', p:0, n:['من غير','None']}, {id:'gold', c:'#FFB300', p:1200, n:['دهبي','Gold']}, {id:'blue', c:'#00B4FF', p:1200, n:['أزرق','Blue']}, {id:'red', c:'#FF2A3A', p:1200, n:['أحمر','Red']}, {id:'green', c:'#22E07A', p:1200, n:['أخضر','Green']}, {id:'purple', c:'#B04BFF', p:1400, n:['بنفسجي','Purple']}],
 horn:[{id:'stock', p:0, n:['الأصلي','Stock']}, {id:'melody', p:300, n:['زمارة الميكروباص','Microbus melody']}, {id:'air', p:600, n:['كلاكس تريلا','Air horn']}, {id:'cuca', p:450, n:['لا كوكاراتشا','La Cucaracha']}, {id:'mahr', p:700, n:['مهرجانات','Mahraganat']}],
 lights:[{id:'warm', p:0, c:'255,214,140', n:['أصفر عادي','Warm halogen']}, {id:'led', p:400, c:'235,245,255', n:['ليد أبيض','White LED']}, {id:'xenon', p:700, c:'150,190,255', n:['زينون أزرق','Blue xenon']}]
};
const COS_ICON = {paint:'paint', stripe:'paint', rim:'tyre', tint:'lights', sticker:'ticket', glow:'lights', horn:'horn', lights:'lights'};

/* ---------------- Routes — real Egyptian lines (microbus fares: Cairo tariff, March 2026) ---------------- */
const CLS_OK = {micro:['hiace','coaster'], bus:['coaster','redbus','mcv'], coach:['coachB','coachO']};
const ROUTES = [
 {id:'m1', type:'micro', lvl:1, fare:9.5, km:9, biome:'mokattam', from:['السيدة عائشة','El Sayeda Aisha'], to:['المقطم','Mokattam'],
  stops:[['موقف السيدة عائشة','El Sayeda Aisha terminal'],['القلعة','The Citadel'],['طريق الأوتوستراد','Autostrad Road'],['مدخل المقطم','Mokattam entrance'],['شارع ٩','Street 9'],['الهضبة الوسطى','Middle Plateau']]},
 {id:'m2', type:'micro', lvl:1, fare:8.5, km:7, biome:'nile', from:['العتبة','Ataba'], to:['إمبابة','Imbaba'],
  stops:[['موقف العتبة','Ataba terminal'],['الإسعاف','El Esaaf'],['بولاق أبو العلا','Boulaq Abu El Ela'],['الزمالك','Zamalek'],['الكيت كات','Kit Kat'],['إمبابة','Imbaba']]},
 {id:'m3', type:'micro', lvl:2, fare:11, km:11, biome:'city', from:['عبد المنعم رياض','Abdel Moneim Riad'], to:['جامعة القاهرة','Cairo University'],
  stops:[['موقف عبد المنعم رياض','Abdel Moneim Riad terminal'],['ميدان التحرير','Tahrir Square'],['الأوبرا','Opera'],['الدقي','Dokki'],['ميدان الجيزة','Giza Square'],['جامعة القاهرة','Cairo University']]},
 {id:'m4', type:'micro', lvl:3, fare:11.5, km:18, biome:'ring', from:['السيدة عائشة','El Sayeda Aisha'], to:['القطامية','Kattameya'],
  stops:[['موقف السيدة عائشة','El Sayeda Aisha terminal'],['البساتين','El Basatin'],['دار السلام','Dar El Salam'],['كارفور المعادي','Carrefour Maadi'],['الطريق الدائري','Ring Road'],['القطامية','Kattameya']]},
 {id:'m5', type:'micro', lvl:4, fare:12, km:22, biome:'nile', from:['عبد المنعم رياض','Abdel Moneim Riad'], to:['القناطر الخيرية','El Qanater El Khayreya'],
  stops:[['موقف عبد المنعم رياض','Abdel Moneim Riad terminal'],['رمسيس','Ramses'],['شبرا','Shubra'],['روض الفرج','Rod El Farag'],['شبرا الخيمة','Shubra El Kheima'],['القناطر الخيرية','El Qanater El Khayreya']]},
 {id:'m6', type:'micro', lvl:5, fare:17, km:32, biome:'desert', from:['عبد المنعم رياض','Abdel Moneim Riad'], to:['٦ أكتوبر','6th of October'],
  stops:[['موقف عبد المنعم رياض','Abdel Moneim Riad terminal'],['الدقي','Dokki'],['جامعة الدول','Gameat El Dewal'],['محور ٢٦ يوليو','26th of July Axis'],['الشيخ زايد','Sheikh Zayed'],['ميدان الحصري','El Hosary Square']]},
 {id:'m7', type:'micro', lvl:6, fare:19, km:30, biome:'ring', from:['السيدة عائشة','El Sayeda Aisha'], to:['القاهرة الجديدة','New Cairo'],
  stops:[['موقف السيدة عائشة','El Sayeda Aisha terminal'],['طريق الأوتوستراد','Autostrad Road'],['المعادي','Maadi'],['الطريق الدائري','Ring Road'],['القطامية','Kattameya'],['التجمع الخامس','Fifth Settlement']]},
 {id:'b1', type:'bus', lvl:4, fare:12, est:true, km:14, biome:'nile', from:['رمسيس','Ramses'], to:['كورنيش المعادي','Maadi Corniche'],
  stops:[['موقف رمسيس','Ramses terminal'],['الإسعاف','El Esaaf'],['ميدان التحرير','Tahrir Square'],['جاردن سيتي','Garden City'],['مصر القديمة','Old Cairo'],['الملك الصالح','El Malek El Saleh'],['دار السلام','Dar El Salam'],['كورنيش المعادي','Maadi Corniche']]},
 {id:'b2', type:'bus', lvl:5, fare:12, est:true, km:15, biome:'city', from:['التحرير','Tahrir'], to:['الأهرامات','The Pyramids'],
  stops:[['موقف التحرير','Tahrir terminal'],['الدقي','Dokki'],['ميدان الجيزة','Giza Square'],['الطالبية','El Talbeya'],['المريوطية','El Maryoteya'],['الرماية','El Remaya'],['الأهرامات','The Pyramids']]},
 {id:'b3', type:'bus', lvl:5, fare:10, est:true, km:16, biome:'alex', from:['محطة الرمل','Raml Station'], to:['المنتزه','Montaza'],
  stops:[['محطة الرمل','Raml Station'],['الشاطبي','El Shatby'],['كامب شيزار','Camp Caesar'],['سيدي جابر','Sidi Gaber'],['ستانلي','Stanley'],['سان ستيفانو','San Stefano'],['ميامي','Miami'],['المنتزه','Montaza']]},
 {id:'c1', type:'coach', lvl:6, fare:250, est:true, km:220, biome:'desert', from:['القاهرة','Cairo'], to:['الإسكندرية','Alexandria'],
  stops:[['موقف الترجمان','Turgoman terminal'],['سيدي جابر - الإسكندرية','Sidi Gaber, Alexandria']], rests:[['استراحة وادي النطرون','Wadi El Natrun rest house']]},
 {id:'c2', type:'coach', lvl:7, fare:150, est:true, km:210, biome:'upper', from:['الأقصر','Luxor'], to:['أسوان','Aswan'],
  stops:[['موقف الأقصر','Luxor terminal'],['موقف أسوان','Aswan terminal']], rests:[['استراحة إسنا','Esna rest house'],['استراحة كوم أمبو','Kom Ombo rest house']]},
 {id:'c3', type:'coach', lvl:8, fare:450, est:true, km:460, biome:'redsea', from:['القاهرة','Cairo'], to:['الغردقة','Hurghada'],
  stops:[['موقف الترجمان','Turgoman terminal'],['موقف الغردقة','Hurghada terminal']], rests:[['استراحة الزعفرانة','Zafarana rest house'],['استراحة رأس غارب','Ras Gharib rest house']]},
 {id:'c4', type:'coach', lvl:9, fare:550, est:true, km:500, biome:'sinai', from:['القاهرة','Cairo'], to:['شرم الشيخ','Sharm El Sheikh'],
  stops:[['موقف الترجمان','Turgoman terminal'],['موقف شرم الشيخ','Sharm El Sheikh terminal']], rests:[['استراحة رأس سدر','Ras Sedr rest house'],['استراحة أبو زنيمة','Abu Zenima rest house'],['استراحة الطور','El Tor rest house']]}
];
const BIOME = {
 city:{amp:1.4, big:0, bumps:.9, urban:1, layers:'cairo', ground:'#6d5a45', temp:33},
 mokattam:{amp:2.6, big:10, bumps:.6, urban:.8, layers:'cliff', ground:'#b89a6a', temp:34},
 nile:{amp:1.1, big:2.5, bumps:.8, urban:1, layers:'nile', ground:'#5b4a3a', temp:32},
 ring:{amp:1.8, big:5, bumps:.4, urban:.5, layers:'ring', ground:'#8c7a5c', temp:34},
 desert:{amp:2.6, big:7, bumps:.15, urban:0, layers:'desert', ground:'#d8b877', temp:38},
 alex:{amp:.9, big:2, bumps:.6, urban:1, layers:'alex', ground:'#7c6a55', temp:29},
 redsea:{amp:2.2, big:9, bumps:.1, urban:0, layers:'redsea', ground:'#c79a64', temp:37},
 sinai:{amp:2.6, big:12, bumps:.1, urban:0, layers:'sinai', ground:'#b5764a', temp:36},
 upper:{amp:1.5, big:4, bumps:.3, urban:.2, layers:'upper', ground:'#a88b5a', temp:40}
};
const DIESEL = 20.5;               // EGP per litre (in-game, adjustable)
const TERMINAL_FEE = {micro:15, bus:30, coach:120};
const FINE = {belt:100, lights:300, door:200, over:500, insp:500, lic:1000, red:1000, radar:500, run:2000, amb:1000, crash:400, ped:500};
const PTS = {red:2, radar:1, run:4, amb:2, crash:1, ped:1, lic:0, belt:0, lights:1, door:0, over:1, insp:0};

/* ---------------- Save (machine cache) ---------------- */
const SAVE_KEY = 'ograaa_save_v1';
const vdef = v => ({owned:false, up:{}, cos:{paint:'stock', stripe:'none', rim:'w' + v.rim, tint:'none', sticker:'none', glow:'none', horn:'stock', lights:'warm', rack:false}, cond:{body:100, engine:100, susp:100, tyres:100, brakes:100, oil:100, clean:100}, dents:[], fuel:v.tank * .8, odo:0, inspT:Date.now()});
const DEF = () => { const g = {}; VEHS.forEach(v => g[v.id] = vdef(v)); g.hiace.owned = true;
 return {v:1, lang:'ar', name:'', money:2500, xp:0, sel:'hiace', garage:g, inv:{}, best:{}, daily:null, streak:{n:0, last:null}, stats:{km:0, trips:0, pax:0, earned:0, spent:0, fines:0, rating:4.6, ratingN:5, crashes:0},
  fines:[], lic:{points:0, issued:Date.now(), suspUntil:0}, set:{music:.6, sfx:.9, eng:.8, radio:.6, gfx:'high', autoDoor:false}, radio:{st:0, on:false}, tx:[], days:{}, badges:{}, tut:false, gift:false}; };
let S = DEF();
function load(){ S = DEF();
 try{ const r = localStorage.getItem(SAVE_KEY); if (r){ const o = JSON.parse(r); const d = DEF(); S = Object.assign(d, o); S.set = Object.assign(d.set, o.set || {}); S.stats = Object.assign(d.stats, o.stats || {}); S.lic = Object.assign(d.lic, o.lic || {}); S.streak = Object.assign(d.streak, o.streak || {});
   VEHS.forEach(v => { const b = vdef(v), g = (o.garage || {})[v.id] || {}; S.garage[v.id] = Object.assign(b, g); S.garage[v.id].cos = Object.assign(b.cos, g.cos || {}); S.garage[v.id].cond = Object.assign(b.cond, g.cond || {}); S.garage[v.id].up = g.up || {}; }); if (!S.garage.hiace.owned && !VEHS.some(v => S.garage[v.id].owned)) S.garage.hiace.owned = true; } }catch(e){ S = DEF(); }
 LANG = S.lang;
}
let saveT = 0;
function save(now){ if (!now){ clearTimeout(saveT); saveT = setTimeout(() => save(true), 250); return; } try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
const lvlOf = xp => { let l = 1; while (xp >= need(l)) { xp -= need(l); l++; } return {l, into:xp, need:need(l)}; };
function need(l){ return Math.round(140 * Math.pow(l, 1.45)); }
const GV = id => S.garage[id || S.sel], upl = (id, k) => (GV(id).up[k] || 0);
/* money ledger: every change is logged and saved */
function ledger(amount, label, icon){
 S.money = Math.round((S.money + amount) * 10) / 10; const dk = dayKey(); const d = S.days[dk] || (S.days[dk] = {e:0, s:0});
 if (amount >= 0){ d.e += amount; S.stats.earned += amount; } else { d.s += -amount; S.stats.spent += -amount; }
 S.tx.unshift({a:amount, l:label, i:icon || (amount >= 0 ? 'cash' : 'coins'), t:Date.now()}); S.tx.length = Math.min(S.tx.length, 30);
 const keys = Object.keys(S.days); if (keys.length > 12) keys.slice(0, keys.length - 12).forEach(k => delete S.days[k]);
 save(); if (typeof renderTop === 'function') renderTop();
}
function spend(amount, label, icon){ if (S.money < amount){ toastUI(t('notEnough'), 'bad'); AU.tone(160, .25, 'square', .1); return false; } ledger(-amount, label, icon); AU.cash(); return true; }

/* ---------------- Audio (procedural Web Audio) ---------------- */
const AU = {
 ctx:null, eng:null,
 init(){
  if (this.ctx){ if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return; const c = this.ctx = new C();
  this.master = c.createGain(); this.master.connect(c.destination); const comp = c.createDynamicsCompressor(); comp.connect(this.master);
  this.sfxG = c.createGain(); this.sfxG.connect(comp); this.musG = c.createGain(); this.musG.connect(comp); this.radG = c.createGain(); this.radLP = c.createBiquadFilter(); this.radLP.type = 'bandpass'; this.radLP.frequency.value = 1500; this.radLP.Q.value = .35; this.radG.connect(this.radLP).connect(comp); this.engG = c.createGain(); this.engG.connect(comp);
  const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = nb;
  const e = {}; e.out = c.createGain(); e.out.gain.value = 0; e.lp = c.createBiquadFilter(); e.lp.type = 'lowpass'; e.lp.frequency.value = 600; e.lp.Q.value = 3;
  e.o1 = c.createOscillator(); e.o1.type = 'sawtooth'; e.o2 = c.createOscillator(); e.o2.type = 'square'; e.o3 = c.createOscillator(); e.o3.type = 'sine';
  e.g1 = c.createGain(); e.g1.gain.value = .35; e.g2 = c.createGain(); e.g2.gain.value = .18; e.g3 = c.createGain(); e.g3.gain.value = .6;
  e.o1.connect(e.g1).connect(e.lp); e.o2.connect(e.g2).connect(e.lp); e.o3.connect(e.g3).connect(e.lp);
  e.n = c.createBufferSource(); e.n.buffer = nb; e.n.loop = true; e.nf = c.createBiquadFilter(); e.nf.type = 'bandpass'; e.nf.frequency.value = 1800; e.nf.Q.value = 1.2; e.ng = c.createGain(); e.ng.gain.value = 0;
  e.am = c.createGain(); e.lfo = c.createOscillator(); e.lfo.type = 'square'; e.lfoG = c.createGain(); e.lfoG.gain.value = .5; e.lfo.connect(e.lfoG).connect(e.am.gain); e.am.gain.value = .5;
  e.n.connect(e.nf).connect(e.ng).connect(e.am).connect(e.out); e.lp.connect(e.out); e.out.connect(this.engG);
  e.w = c.createBufferSource(); e.w.buffer = nb; e.w.loop = true; e.wf = c.createBiquadFilter(); e.wf.type = 'lowpass'; e.wf.frequency.value = 500; e.wg = c.createGain(); e.wg.gain.value = 0; e.w.connect(e.wf).connect(e.wg).connect(this.sfxG);
  e.r = c.createBufferSource(); e.r.buffer = nb; e.r.loop = true; e.rf = c.createBiquadFilter(); e.rf.type = 'highpass'; e.rf.frequency.value = 2500; e.rg = c.createGain(); e.rg.gain.value = 0; e.r.connect(e.rf).connect(e.rg).connect(this.sfxG);
  [e.o1,e.o2,e.o3,e.n,e.lfo,e.w,e.r].forEach(o => o.start()); this.eng = e; this.apply();
 },
 apply(){ if (!this.ctx) return; const s = S.set; this.sfxG.gain.value = s.sfx; this.musG.gain.value = s.music * .5; this.engG.gain.value = s.sfx * s.eng; this.radG.gain.value = s.radio * .55; },
 engine(on, rpm, load, speed, big, rain){
  const e = this.eng; if (!e) return; const tt = this.ctx.currentTime + .05; const f = (big ? 24 : 36) + rpm * (big ? 68 : 92);
  e.o1.frequency.setTargetAtTime(f, tt, .05); e.o2.frequency.setTargetAtTime(f * .5, tt, .05); e.o3.frequency.setTargetAtTime(f * .25, tt, .05); e.lfo.frequency.setTargetAtTime(f / 4, tt, .05);
  e.lp.frequency.setTargetAtTime(350 + load * 1400 + rpm * 500, tt, .08); e.out.gain.setTargetAtTime(on ? .15 + load * .2 : 0, tt, .1); e.ng.gain.setTargetAtTime(on ? .07 + load * .12 : 0, tt, .1);
  e.wg.gain.setTargetAtTime(clamp(speed / 30, 0, 1) * .1, tt, .2); e.wf.frequency.setTargetAtTime(300 + speed * 30, tt, .2); e.rg.gain.setTargetAtTime(rain ? .09 : 0, tt, .4);
 },
 tone(f, d, type = 'sine', g = .3, when = 0, slide = 0, dest){ if (!this.ctx) return; const c = this.ctx, t0 = c.currentTime + when; const o = c.createOscillator(), gg = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f + slide), t0 + d); gg.gain.setValueAtTime(.0001, t0); gg.gain.exponentialRampToValueAtTime(g, t0 + .01); gg.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(gg).connect(dest || this.sfxG); o.start(t0); o.stop(t0 + d + .05); },
 noiseHit(d, freq, g = .4, when = 0, type = 'bandpass', q = 1, dest){ if (!this.ctx) return; const c = this.ctx, t0 = c.currentTime + when; const s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const gg = c.createGain(); gg.gain.setValueAtTime(g, t0); gg.gain.exponentialRampToValueAtTime(.0001, t0 + d); s.connect(f).connect(gg).connect(dest || this.sfxG); s.start(t0, Math.random()); s.stop(t0 + d + .05); },
 horn(kind, big){
  const T = (f, d, w, g, o) => this.tone(f, d, 'square', g || .1, w || 0, 0, o);
  if (kind === 'melody') [659,784,988,784,659,988].forEach((f, i) => T(f, .15, i * .13, .1));
  else if (kind === 'air'){ [233,277,349].forEach(f => this.tone(f, .9, 'sawtooth', .12)); }
  else if (kind === 'cuca') [392,392,392,523,659,392,392,392,523,659].forEach((f, i) => T(f, .12, i * .12 + (i > 4 ? .2 : 0), .09));
  else if (kind === 'mahr') [440,440,523,440,587,523,440].forEach((f, i) => T(f, .1, i * .09, .11));
  else if (big){ this.tone(311, .6, 'sawtooth', .15); this.tone(392, .6, 'sawtooth', .12); }
  else { this.tone(415, .35, 'square', .1); this.tone(523, .35, 'square', .08); }
 },
 door(big){ this.noiseHit(.45, big ? 4000 : 2600, .22, 0, 'highpass', .5); this.tone(180, .15, 'triangle', .14, .35, -60); },
 coin(){ this.tone(1318, .08, 'triangle', .16); this.tone(1760, .18, 'triangle', .13, .06); }, cash(){ this.noiseHit(.08, 6000, .12); this.coin(); },
 thud(v){ const g = clamp(v / 12, .1, .9); this.tone(90, .35, 'sine', g, 0, -50); this.noiseHit(.25, 400, g * .8, 0, 'lowpass'); if (v > 7) this.noiseHit(.5, 2500, g * .4, .02, 'bandpass', 2); },
 crash(){ this.thud(14); this.noiseHit(1.2, 1800, .5, .05, 'bandpass', .8); [0,.1,.22].forEach(w => this.noiseHit(.2, 5000, .25, w, 'highpass')); },
 click(){ this.tone(900, .04, 'square', .05); }, tick(){ this.tone(1500, .03, 'square', .05); this.tone(900, .03, 'square', .04, .25); },
 whistle(){ this.tone(2400, .25, 'sine', .15); this.tone(2600, .35, 'sine', .15, .28); }, chime(){ this.tone(880, .25, 'sine', .12); this.tone(880, .25, 'sine', .12, .5); },
 crank(){ for (let i = 0; i < 6; i++) this.noiseHit(.1, 300 + i * 30, .35, i * .11, 'lowpass', 2); this.tone(60, .5, 'sawtooth', .2, .65, 30); },
 levelUp(){ [523,659,784,1046].forEach((f, i) => this.tone(f, .3, 'triangle', .2, i * .1)); },
 siren(kind, t){ if (!this.ctx) return; const f = kind === 'amb' ? (Math.floor(t * 1.5) % 2 ? 960 : 770) : 600 + 350 * Math.abs(Math.sin(t * 2.6)); this.tone(f, .2, 'sawtooth', .05); },
 beep(){ this.tone(1200, .12, 'square', .06); },
 /* ---- music engine used by menu music and the in-cabin radio ---- */
 _seq:null,
 play(style, dest){
  this.stop(); if (!this.ctx) return; const self = this, D = dest === 'radio' ? this.radG : this.musG;
  const scales = {hijaz:[293.66,311.13,369.99,392,440,466.16,523.25,587.33], nahawand:[293.66,329.63,349.23,392,440,466.16,554.37,587.33], rast:[261.63,293.66,329.63,349.23,392,440,466.16,523.25], kurd:[293.66,311.13,349.23,392,440,466.16,523.25,587.33]};
  const S0 = {menu:{sc:'hijaz', bpm:104, gr:'DT.TD.T.', lead:'triangle'}, 0:{sc:'kurd', bpm:128, gr:'D.TDD.T.', lead:'square', synth:true}, 1:{sc:'rast', bpm:78, gr:'D..TD.T.', lead:'triangle'}, 2:{sc:'hijaz', bpm:112, gr:'DT.TD.T.', lead:'sawtooth'}, 3:{sc:'nahawand', bpm:92, gr:'D.T.D.T.', lead:'sine'}}[style];
  const sc = scales[S0.sc]; let step = 0; const spb = 60 / S0.bpm / 2; const rng = mulberry(style === 'menu' ? 7 : 11 + style * 13);
  const mel = Array.from({length:32}, (_, i) => i % 8 === 7 ? -1 : Math.floor(rng() * 6) + (i % 16 > 8 ? 2 : 0));
  this._seq = setInterval(() => { const g = S0.gr[step % 8];
   if (g === 'D') self.tone(S0.synth ? 60 : 110, .28, 'sine', .5, 0, -55, D); if (g === 'T') self.noiseHit(.07, 3200, .28, 0, 'bandpass', 3, D);
   if (S0.synth && step % 2 === 1) self.noiseHit(.05, 8000, .12, 0, 'highpass', 1, D);
   if (step % 2 === 0){ const n = mel[(step / 2) % mel.length]; if (n >= 0){ const f = sc[n]; self.tone(f, S0.synth ? .18 : .45, S0.lead, S0.synth ? .08 : .14, 0, 0, D); self.tone(f * 2, .22, 'sine', .04, 0, 0, D); } }
   if (step % 16 === 0) self.tone(sc[0] / 4, 1.6, 'sine', .2, 0, 0, D); step++; }, spb * 1000);
 },
 stop(){ clearInterval(this._seq); this._seq = null; },
 staticBurst(){ this.noiseHit(.35, 3000, .25, 0, 'bandpass', .4, this.radG); }
};
const STATIONS = [['مهرجانات إف إم ٩٩٫١','Mahraganat FM 99.1'], ['طرب زمان ٨٨٫٧','Tarab Classics 88.7'], ['شعبي ٩٥','Shaabi 95'], ['راديو الطريق ٩٢٫٤','Road Radio 92.4']];

/* ======================= physics.js ======================= */
"use strict";
/* ---------------- Terrain ---------------- */
const DX = .25, OFF = 300;
const W = {H:null, len:0, route:null, biome:null, stops:[], rests:[], cps:[], gas:[], radars:[], bumps:[], holes:[], lights:[], deco:[], props:[], decals:[], seed:1};
function terrH(x){ const f = (x + OFF) / DX; let i = f | 0; const H = W.H; if (i < 0) return H[0]; if (i >= H.length - 1) return H[H.length - 1]; const r = f - i; return H[i] + (H[i + 1] - H[i]) * r; }
function terrS(x){ return (terrH(x + .4) - terrH(x - .4)) / .8; }

function genWorld(route, seed){
 const rnd = mulberry(seed); const B = BIOME[route.biome]; const type = route.type; const urban = B.urban;
 const len = type === 'coach' ? clamp(route.km * 22, 4800, 10000) : clamp(route.km * 185, 1900, 4200);
 W.len = len; W.route = route; W.biome = B; W.seed = seed;
 const N = Math.ceil((len + OFF + 500) / DX); const H = new Float32Array(N);
 const wl = type === 'micro' ? .8 : type === 'bus' ? 1.1 : 1.35, amp = B.amp, big = B.big;
 const p = Array.from({length:8}, () => rnd() * 6.28);
 const base = x => amp * (Math.sin(x / (37 * wl) + p[0]) * .6 + Math.sin(x / (19 * wl) + p[1]) * .28 + Math.sin(x / (9.5 * wl) + p[2]) * .12) + big * (Math.sin(x / (190 * wl) + p[3]) * .65 + Math.sin(x / (96 * wl) + p[4]) * .35) + big * .4 * Math.sin(x / (430 * wl) + p[5]);
 for (let i = 0; i < N; i++){ const x = i * DX - OFF; H[i] = base(Math.max(0, x)); }
 for (const k of ['stops','rests','cps','gas','radars','bumps','holes','lights','deco','props','decals']) W[k] = [];
 const zones = [];
 if (type === 'coach'){
  W.stops.push({x:20, name:route.stops[0], i:0}); W.stops.push({x:len - 45, name:route.stops[1], i:1});
  const nr = route.rests.length; route.rests.forEach((r, k) => W.rests.push({x:Math.round(len * (k + 1) / (nr + 1)), name:r, used:false}));
  W.cps.push({x:Math.round(len * .1 + 150)}); if (nr > 1) W.cps.push({x:Math.round((W.rests[0].x + W.rests[1].x) / 2)});
  W.gas.push({x:Math.round(len * (nr > 1 ? .5 / (nr + 1) + .5 : .7))});
  W.radars.push({x:Math.round(len * .33 + rnd() * len * .08), limit:90}); W.radars.push({x:Math.round(len * .8), limit:100});
 } else {
  const n = route.stops.length;
  for (let i = 0; i < n; i++){ const x = i === 0 ? 20 : i === n - 1 ? len - 45 : Math.round(20 + (len - 65) * i / (n - 1) + (rnd() - .5) * 110); W.stops.push({x, name:route.stops[i], i}); }
  const mid = Math.floor(n / 2); W.gas.push({x:Math.round((W.stops[mid - 1].x + W.stops[mid].x) / 2)});
  const k = 1 + Math.floor(rnd() * (n - 3)); W.cps.push({x:Math.round(W.stops[k].x * .35 + W.stops[k + 1].x * .65)});
  if (urban > .3){ // traffic lights at intersections
   for (let i = 0; i < n - 1; i++){ if (rnd() < .75){ const a = W.stops[i].x, b = W.stops[i + 1].x; const x = Math.round(lerp(a, b, .22 + rnd() * .2)); W.lights.push({x, off:rnd() * 20}); } }
  } else W.radars.push({x:Math.round(len * .55), limit:80});
 }
 W.stops.forEach(s => zones.push({x:s.x, half:type === 'coach' ? 24 : 14}));
 W.rests.forEach(r => zones.push({x:r.x, half:32})); W.cps.forEach(c => zones.push({x:c.x, half:16})); W.gas.forEach(g => zones.push({x:g.x, half:18})); W.lights.forEach(l => zones.push({x:l.x, half:14}));
 zones.unshift({x:-OFF, half:OFF + 45});
 { const ls = W.stops[W.stops.length - 1]; zones.push({x:len + 220, half:280, lvl:H[clamp(Math.round((ls.x + OFF) / DX), 0, N - 1)]}); }
 for (const z of zones){
  const zi = clamp(Math.round((z.x + OFF) / DX), 0, N - 1); const lvl = z.lvl != null ? z.lvl : z.x < 0 ? base(0) : H[zi];
  const hAt = x => H[clamp(Math.round((x + OFF) / DX), 0, N - 1)];
  const dif = Math.max(Math.abs(hAt(z.x - z.half - 60) - lvl), Math.abs(hAt(z.x + z.half + 60) - lvl)); const blend = clamp(dif / .15, 45, 180);
  const i0 = Math.max(0, Math.floor((z.x - z.half - blend + OFF) / DX)), i1 = Math.min(N - 1, Math.ceil((z.x + z.half + blend + OFF) / DX));
  for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; const d = Math.abs(x - z.x) - z.half; const w = d <= 0 ? 1 : 1 - smooth(clamp(d / blend, 0, 1)); H[i] = lerp(H[i], lvl, w); }
 }
 const free = (x, m = 30) => zones.every(z => Math.abs(x - z.x) > z.half + m);
 const nb = Math.round(B.bumps * len / 280);
 for (let k = 0; k < nb * 3 && W.bumps.length < nb; k++){ const x = 60 + rnd() * (len - 120); if (free(x) && W.bumps.every(b => Math.abs(b - x) > 70)) W.bumps.push(x); }
 const nh = Math.round((1.2 - B.bumps * .5) * len / 420);
 for (let k = 0; k < nh * 3 && W.holes.length < nh; k++){ const x = 80 + rnd() * (len - 160); if (free(x) && W.bumps.every(b => Math.abs(b - x) > 30)) W.holes.push(x); }
 for (const b of W.bumps){ const i0 = Math.floor((b - 2.5 + OFF) / DX), i1 = Math.ceil((b + 2.5 + OFF) / DX); for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; H[i] += .13 * Math.exp(-Math.pow((x - b) / .6, 2)); } }
 for (const h of W.holes){ const i0 = Math.floor((h - 2 + OFF) / DX), i1 = Math.ceil((h + 2 + OFF) / DX); for (let i = i0; i <= i1; i++){ const x = i * DX - OFF; H[i] -= .12 * Math.exp(-Math.pow((x - h) / .42, 2)); } }
 W.H = H;
 /* ---- scenery placement (uploaded artwork only) ---- */
 const busy = []; const place = (x, w) => { if (busy.some(b => x + w / 2 > b[0] - 1 && x - w / 2 < b[1] + 1)) return false; busy.push([x - w / 2, x + w / 2]); return true; };
 const B_H = {bOld:17, bNew:19, bPharm:15, bKosh:12.5, bMarket:12, bTrans:11, bSchool:9.5, bPolice:8, bHosp:8.5, bStation:7.5, bWare:8.5};
 const bw = k => B_H[k] * META[k].w / META[k].h;
 const addB = (k, x) => { const w = bw(k); if (place(x, w)){ W.deco.push({k, x, h:B_H[k], w}); return true; } return false; };
 // terminals, stops, checkpoints, rest houses
 W.stops.forEach((s, i) => { if (i === 0 || i === W.stops.length - 1) addB('bStation', s.x + (type === 'coach' ? 2 : 4)); });
 W.cps.forEach(c => addB('bPolice', c.x + 6));
 const pool = urban > .5 ? ['bOld','bNew','bPharm','bKosh','bMarket','bOld','bNew','bTrans','bHosp','bSchool'] : ['bWare','bMarket','bKosh','bOld','bTrans'];
 const density = urban > .5 ? .92 : urban > .15 ? .45 : .09;
 for (let x = -40; x < len + 120;){ const k = pool[(rnd() * pool.length) | 0]; const w = bw(k); if (rnd() < density) addB(k, x + w / 2); x += w + (urban > .5 ? .6 + rnd() * 2.5 : 6 + rnd() * 40); }
 // sidewalk props
 const P = (k, x, extra) => W.props.push(Object.assign({k, x}, extra || {}));
 const lampK = urban > .5 ? (route.biome === 'alex' || route.biome === 'nile' ? 'lamp2' : 'lamp') : 'lamp3';
 for (let x = 8; x < len + 80; x += urban > .5 ? 26 : 45) P(urban > .2 || type !== 'coach' ? lampK : 'pole', x + rnd() * 3);
 if (urban < .5) for (let x = 20; x < len + 80; x += 60) P('pole', x + rnd() * 10);
 W.stops.forEach((s, i) => { const term = i === 0 || i === W.stops.length - 1; if (!term || type !== 'coach'){ P('shelter', s.x - 1.5); P('stopsign', s.x + 3.2); } P('dirsign', s.x - 22); if (urban > .4){ P('bench', s.x - 6); P('bin', s.x + 5); } });
 W.cps.forEach(c => { P('jersey', c.x - 7, {front:1}); P('cone', c.x - 3.4, {front:1}); P('cone2', c.x + 12, {front:1}); P('barrier', c.x + 7); P('fence', c.x - 12); });
 W.lights.forEach(l => { P('tlight', l.x + 1, {tl:l}); P('plight', l.x - 7); W.decals.push({k:'zebra', x:l.x - 4, w:4.2}); });
 W.rests.forEach(r => { P('planter', r.x - 9); P('bench', r.x + 11); P('planter', r.x + 16); P('bin', r.x - 12); });
 W.gas.forEach(g => P('fuel', g.x));
 if (urban > .4) for (let k = 0; k < len / 60; k++){ const x = 30 + rnd() * (len - 60); const kk = ['bin','hydrant','planter','meter','bollard','bench','hydrant','planter'][(rnd() * 8) | 0]; if (W.props.every(q => Math.abs(q.x - x) > 3)) P(kk, x); }
 for (let k = 0; k < len / 90; k++){ const x = 30 + rnd() * (len - 60); W.decals.push({k:rnd() < .5 ? 'manhole' : 'drain', x, w:rnd() < .5 ? 1.1 : 1.6}); }
 if (route.biome === 'mokattam' || route.biome === 'upper') for (let k = 0; k < len / 150; k++) W.decals.push({k:'patch', x:30 + rnd() * (len - 60), w:6 + rnd() * 8});
 W.props.sort((a, b) => a.x - b.x);
}

/* ---------------- Vehicle physics ----------------
   Rigid chassis + sprung wheels built from the sprite's measured wheel
   centres, so every wheel sits exactly in its arch. Impulse tyre model,
   automatic gearbox with torque curve, aero drag, rolling resistance,
   load-dependent mass, brake wear, suspension damage & flat tyres. */
const GEARS = [3.6, 2.15, 1.45, 1.0, .78];
function vehGeom(spr, len, mirror){
 const m = META[spr], s = len / m.w, hw = m.w / 2, hh = m.h / 2;
 const X = px => (px - hw) * s * (mirror ? -1 : 1), Y = py => (hh - py) * s;
 const wheels = m.wheels.map(w => ({x:X(w[0]), y:Y(w[1]), r:w[2] * s, px:w[0], py:w[1], pr:w[2]}));
 const wy = Math.min(...wheels.map(w => w.y));
 return {s, len, h:m.h * s, yb:wy + wheels[0].r * .35, yt:hh * s, wheels, spr, mirror};
}
function makeCar(opt){
 const g = opt.geom, c = {opt, g, spr:g.spr, mirror:g.mirror};
 c.base = opt.mass; c.m = opt.mass; c.L = g.len; c.yt = g.yt; c.yb = g.yb;
 c.acc = opt.acc; c.vmax = opt.vmax; c.mu = opt.mu || 1; c.brk = opt.brk || 7; c.air = opt.air || 1.2; c.armor = opt.armor || 1;
 c.f = opt.f || 1.6; c.travel = opt.travel || .16; c.zeta = opt.zeta || .45; c.rest = .25;
 const n = g.wheels.length, mw = opt.mass * .05 / n * 2;
 c.k = (opt.mass / n) * Math.pow(2 * Math.PI * c.f, 2); c.cd = 2 * c.zeta * Math.sqrt(c.k * opt.mass / n); c.kl = c.k * 30; c.cl = 2 * .8 * Math.sqrt(c.kl * mw); c.kb = c.k * 12;
 const sag = 9.81 / Math.pow(2 * Math.PI * c.f, 2);
 const x = opt.x, gy = terrH(x);
 const low = Math.min(...g.wheels.map(w => w.y - w.r));
 c.x = x; c.y = gy - low + .02; c.a = 0; c.vx = opt.vx || 0; c.vy = 0; c.w = 0;
 c.wh = g.wheels.map(w => ({ax:w.x, ay:w.y + c.rest - sag, x:x + w.x, y:c.y + w.y, vx:c.vx, vy:0, r:w.r, r0:w.r, m:mw, I:.55 * mw * w.r * w.r, om:c.vx / w.r, rot:Math.random() * 6, ground:false, comp:0, flat:false, slip:0}));
 c.hull = [[-g.len / 2, c.yb, 0], [g.len / 2, c.yb, 0], [-g.len / 2, g.yt, 1], [g.len / 2, g.yt, 1], [0, g.yt, 1], [-g.len / 4, g.yt, 1], [g.len / 4, g.yt, 1], [-g.len / 2, (c.yb + g.yt) / 2, 0], [g.len / 2, (c.yb + g.yt) / 2, 0]];
 c.I0 = opt.mass * (g.len * g.len + g.h * g.h) / 12 * .8; c.I = c.I0;
 c.grounded = 0; c.roof = false; c.impacts = []; c.gear = 1; c.rpm = .1; c.shiftT = 0; c.rev = false; c.dmgFx = 0;
 return c;
}
function setLoad(c, kg){ c.m = c.base + kg; c.I = c.I0 * c.m / c.base; }
/* ctl: {gas, brake, hold, power, aiV (signed target speed for AI), grip} */
function physStep(c, h, ctl){
 const g = 9.81, ca = Math.cos(c.a), sa = Math.sin(c.a), dx = sa, dy = -ca, n = c.wh.length;
 const gas = ctl.gas || 0, brake = ctl.brake || 0, power = ctl.power == null ? 1 : ctl.power;
 c.vy -= g * h;
 // gearbox
 const vlin0 = c.wh[0].om * c.wh[0].r, sp = Math.abs(vlin0);
 const gr = GEARS[c.gear - 1], top = c.vmax;
 c.rpm = clamp(sp / top * gr / GEARS[4] * .75 + .12, .12, 1.05);
 if (c.shiftT > 0) c.shiftT -= h;
 else if (ctl.aiV == null){ if (c.rpm > .9 && c.gear < 5 && !c.rev){ c.gear++; c.shiftT = .22; } else if (c.rpm < .42 && c.gear > 1){ c.gear--; c.shiftT = .12; } }
 const torqueCurve = clamp(.72 + .55 * c.rpm - .45 * c.rpm * c.rpm, .35, 1);
 const gearMul = clamp(gr / GEARS[2], .75, 1.6);
 for (const w of c.wh){
  w.vy -= g * h;
  const Ax = c.x + w.ax * ca - w.ay * sa, Ay = c.y + w.ax * sa + w.ay * ca, Px = Ax + dx * c.rest, Py = Ay + dy * c.rest;
  const ex = w.x - Px, ey = w.y - Py, s = ex * dx + ey * dy, lx = ex - dx * s, ly = ey - dy * s;
  const rx = Px - c.x, ry = Py - c.y, vcx = c.vx - c.w * ry, vcy = c.vy + c.w * rx;
  const rvx = w.vx - vcx, rvy = w.vy - vcy, rvd = rvx * dx + rvy * dy, rlx = rvx - dx * rvd, rly = rvy - dy * rvd;
  let fs = -(c.k * (s - (c.pre || 0)) + c.cd * rvd);
  if (s < -c.travel){ fs += c.kb * (-c.travel - s); if (rvd < -3.2) c.impacts.push({kind:'bottom', v:-rvd}); }
  if (s > c.travel * .9) fs -= c.kb * (s - c.travel * .9);
  const fx = dx * fs - c.kl * lx - c.cl * rlx, fy = dy * fs - c.kl * ly - c.cl * rly;
  w.vx += fx / w.m * h; w.vy += fy / w.m * h; c.vx -= fx / c.m * h; c.vy -= fy / c.m * h; c.w -= (rx * fy - ry * fx) / c.I * h; w.comp = s;
  const vlin = w.om * w.r;
  if (ctl.aiV != null){ // AI: wheel speed servo
   const tgt = ctl.aiV / w.r, dmax = c.acc * 2.2 / w.r * h * (Math.abs(tgt) < Math.abs(w.om) ? 2.5 : 1); w.om += clamp(tgt - w.om, -dmax, dmax);
  } else {
   const T = c.m * c.acc * power * w.r / n * gearMul * torqueCurve * (c.shiftT > 0 ? .25 : 1);
   const dir = c.rev ? -1 : 1;
   if (gas > 0){ const lim = c.rev ? clamp(1 - Math.max(0, -vlin) / 5, 0, 1) : clamp(1 - Math.pow(Math.max(0, vlin) / c.vmax, 2.4), 0, 1); w.om += dir * gas * T / w.I * h * lim; }
   if (gas > 0 && w.ground && !c.rev){ const mx = (Math.max(0, w.vtl || 0) + 1.4) * 1.1 / w.r; if (w.om > mx){ w.om = mx; c.tcT = .4; } }
   if (brake > 0){ const bf = brake * (c.brk * c.m / n * w.r) / w.I * h; if (Math.abs(vlin) > .25){ w.om -= Math.sign(w.om) * Math.min(Math.abs(w.om), bf); const vt = w.vtl || 0; if (w.ground && Math.abs(vt) > 1.5){ const mn = vt * .8 / w.r; if ((vt > 0 && w.om < mn) || (vt < 0 && w.om > mn)){ w.om = mn; c.absT = .4; } } } else w.om *= .5; }
   if (!gas && !brake){ const eb = (.3 + .55 * c.rpm) / w.r * h; w.om -= Math.sign(w.om) * Math.min(Math.abs(w.om), eb); }
   if (ctl.hold) w.om = 0;
  }
  w.om *= (1 - .015 * h);
 }
 const air = c.grounded === 0;
 if (ctl.aiV == null){ c.w += (gas - brake) * (c.rev ? -1 : 1) * c.air * h * (air ? 1 : .1); }
 c.w *= (1 - (air ? .15 : .6) * h);
 // aerodynamic drag & rolling resistance
 const v = Math.hypot(c.vx, c.vy), A = c.g.h * 2.3, drag = .5 * 1.2 * .6 * A * v * v / c.m;
 if (v > .01){ c.vx -= c.vx / v * drag * h; c.vy -= c.vy / v * drag * h; }
 c.x += c.vx * h; c.y += c.vy * h; c.a += c.w * h;
 let ground = 0; const grip = ctl.grip || 1;
 for (const w of c.wh){
  w.x += w.vx * h; w.y += w.vy * h; w.rot += w.om * h;
  const gy = terrH(w.x), sl = terrS(w.x), inv = 1 / Math.sqrt(1 + sl * sl), nx = -sl * inv, ny = inv;
  const dist = (w.y - gy) * ny, pen = w.r - dist; w.ground = false;
  if (pen > 0){
   w.x += nx * pen; w.y += ny * pen; ground++; w.ground = true;
   const vn = w.vx * nx + w.vy * ny; let jn = 0;
   if (vn < 0){ jn = -vn * w.m; w.vx -= nx * vn * 1.05; w.vy -= ny * vn * 1.05; if (-vn > 4.5) c.impacts.push({kind:'land', v:-vn}); }
   const tx = ny, ty = -nx, vt = w.vx * tx + w.vy * ty, slip = vt - w.om * w.r; w.vtl = vt;
   let j = -slip / (1 / w.m + w.r * w.r / w.I); const mu = c.mu * grip * (w.flat ? .55 : 1), mj = mu * (jn + w.m * g * h * 2.6); j = clamp(j, -mj, mj);
   w.vx += tx * j / w.m; w.vy += ty * j / w.m; w.om -= j * w.r / w.I; w.slip = Math.abs(slip);
   // rolling resistance
   w.om *= (1 - .012 * h);
  } else w.slip = 0;
 }
 c.grounded = ground;
 c.roof = false; const ca2 = Math.cos(c.a), sa2 = Math.sin(c.a);
 for (const p of c.hull){
  const rx = p[0] * ca2 - p[1] * sa2, ry = p[0] * sa2 + p[1] * ca2, px = c.x + rx, py = c.y + ry;
  const gy = terrH(px), sl = terrS(px), inv = 1 / Math.sqrt(1 + sl * sl), nx = -sl * inv, ny = inv, pen = (gy - py) * ny;
  if (pen > 0){
   c.x += nx * pen * .9; c.y += ny * pen * .9; if (p[2]) c.roof = true;
   const vpx = c.vx - c.w * ry, vpy = c.vy + c.w * rx, vn = vpx * nx + vpy * ny;
   if (vn < 0){
    const rn = rx * ny - ry * nx, j = -1.15 * vn / (1 / c.m + rn * rn / c.I);
    c.vx += nx * j / c.m; c.vy += ny * j / c.m; c.w += rn * j / c.I;
    const tx = ny, ty = -nx, vtt = vpx * tx + vpy * ty, rt = rx * ty - ry * tx; let jt = -vtt / (1 / c.m + rt * rt / c.I); jt = clamp(jt, -.6 * j, .6 * j);
    c.vx += tx * jt / c.m; c.vy += ty * jt / c.m; c.w += rt * jt / c.I;
    if (-vn > 2) c.impacts.push({kind:'body', v:-vn, lx:p[0], ly:p[1], roof:p[2]});
   }
  }
 }
}
const speedOf = c => Math.hypot(c.vx, c.vy);
/* car-to-car collision along the lane (1D impulse with restitution) */
function collide(a, b){
 const ea = [a.x - a.L / 2, a.x + a.L / 2], eb = [b.x - b.L / 2, b.x + b.L / 2];
 if (ea[1] < eb[0] || eb[1] < ea[0]) return 0;
 if (Math.abs(a.y - b.y) > (a.yt - a.yb + b.yt - b.yb) * .6) return 0;
 const front = a.x < b.x; const ov = front ? ea[1] - eb[0] : eb[1] - ea[0]; if (ov <= 0) return 0;
 const rv = front ? a.vx - b.vx : b.vx - a.vx; const tm = a.m + b.m;
 const pa = ov * b.m / tm, pb = ov * a.m / tm; const s = front ? 1 : -1;
 a.x -= s * pa; b.x += s * pb; a.wh.forEach(w => w.x -= s * pa); b.wh.forEach(w => w.x += s * pb);
 if (rv > 0){ const e = .25, J = (1 + e) * rv / (1 / a.m + 1 / b.m); const da = s * J / a.m, db = s * J / b.m;
  a.vx -= da; b.vx += db; a.wh.forEach(w => { w.vx -= da; w.om = w.vx / w.r; }); b.wh.forEach(w => { w.vx += db; w.om = w.vx / w.r; }); a.w += (front ? -1 : 1) * rv * .02; }
 return rv;
}

/* ======================= renderer.js ======================= */
"use strict";
function hash(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
/* ---------------- Images ---------------- */
const IMG = {};
function loadImages(cb){ const keys = Object.keys(ASSETS); let n = 0; keys.forEach(k => { const im = new Image(); im.onload = im.onerror = () => { n++; const b = $('#ldBar'); if (b) b.style.width = (n / keys.length * 100) + '%'; if (n === keys.length) cb(); }; im.src = ASSETS[k]; IMG[k] = im; }); }
const icon = k => `<img class="ic" src="${ASSETS['i_' + k]}" alt="">`;
/* ---------------- Canvas & camera ---------------- */
const cv = $('#game'), ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1, PPM = 40;
const cam = {x:0, y:0, y0:0, shake:0, zoom:1};
function resize(){
 VW = window.innerWidth; VH = window.innerHeight; DPR = Math.min(window.devicePixelRatio || 1, S.set.gfx === 'low' ? 1 : 2);
 cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
 const s = Math.min(VW / 1280, VH / 720); document.documentElement.style.fontSize = (16 * clamp(Math.pow(s, .55), .6, 1.9)) + 'px';
 document.body.classList.toggle('portrait', VH > VW * 1.05); calcPPM();
}
function calcPPM(){ const L = G.car ? G.car.L : 5.4; const vw = L * 1.55 + 19, vh = 12.5 + L * .2; PPM = Math.min(VW / vw, VH / vh) * cam.zoom; if (VH > VW) PPM = VW / (L * 1.9 + 7) * cam.zoom; }
window.addEventListener('resize', resize);
const SX0 = () => VW * (G.mode === 'attract' ? .5 : .33), SY0 = () => VH * (VH > VW ? .56 : VH < 560 ? .55 : .66);
const sx = x => (x - cam.x) * PPM + SX0(), sy = y => SY0() - (y - cam.y) * PPM;
/* ---------------- vehicle canvases: cosmetics + persistent damage ---------------- */
const MASKS = {};
function paintMask(spr){
 if (MASKS[spr]) return MASKS[spr];
 const im = IMG[spr], w = im.width, h = im.height, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
 const d = x.getImageData(0, 0, w, h).data; const hist = {};
 for (let i = 0; i < d.length; i += 16){ if (d[i + 3] < 220) continue; const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11; if (L < 70) continue; const k = (d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5); hist[k] = (hist[k] || 0) + 1; }
 let best = null, bn = 0; for (const k in hist) if (hist[k] > bn){ bn = hist[k]; best = k; }
 const q = best.split(',').map(v => +v * 32 + 16); let sr = 0, sg = 0, sb = 0, sn = 0;
 for (let i = 0; i < d.length; i += 8){ if (d[i + 3] < 220) continue; if (Math.abs(d[i] - q[0]) < 36 && Math.abs(d[i + 1] - q[1]) < 36 && Math.abs(d[i + 2] - q[2]) < 36){ sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; sn++; } }
 const dom = [sr / sn, sg / sn, sb / sn], dL = dom[0] * .3 + dom[1] * .59 + dom[2] * .11, dS = dom[0] + dom[1] + dom[2] + 1;
 const m = new Float32Array(w * h), win = new Uint8Array(w * h);
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ if (d[i + 3] < 30) continue; const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, s = d[i] + d[i + 1] + d[i + 2] + 1;
  const cd = Math.abs(d[i] / s - dom[0] / dS) + Math.abs(d[i + 1] / s - dom[1] / dS) + Math.abs(d[i + 2] / s - dom[2] / dS);
  const lr = L / dL; let wgt = clamp(1 - cd * 9, 0, 1) * clamp((lr - .45) * 3, 0, 1); m[p] = wgt;
  if (L < dL * .42 && (p / w | 0) < h * .62) win[p] = 1; }
 return MASKS[spr] = {w, h, m, win, dom, dL, src:d};
}
function drawDents(x, dents, w, h){
 x.save(); x.globalCompositeOperation = 'source-atop';
 for (const dt of dents){ const [u, v, r, ty] = dt; const R = r * w;
  if (ty === 2){ x.strokeStyle = 'rgba(235,245,255,.85)'; x.lineWidth = Math.max(1, w / 400); const rg = mulberry((u * 999 + v * 77) | 0); for (let k = 0; k < 7; k++){ x.beginPath(); x.moveTo(u * w, v * h); let px = u * w, py = v * h; const a = rg() * 6.28; for (let s = 0; s < 4; s++){ px += Math.cos(a + (rg() - .5)) * R * .35; py += Math.sin(a + (rg() - .5)) * R * .35; x.lineTo(px, py); } x.stroke(); } continue; }
  const g = x.createRadialGradient(u * w + R * .15, v * h + R * .15, R * .1, u * w, v * h, R); g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(.6, 'rgba(0,0,0,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(u * w, v * h, R, R * .75, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = Math.max(1, R * .08); x.beginPath(); x.ellipse(u * w - R * .2, v * h - R * .2, R * .6, R * .45, 0, 3.4, 5.2); x.stroke();
  if (ty === 1){ x.strokeStyle = 'rgba(60,50,45,.6)'; x.lineWidth = Math.max(1, w / 500); for (let k = 0; k < 5; k++){ x.beginPath(); x.moveTo(u * w - R * 1.4, v * h + (k - 2) * R * .15); x.lineTo(u * w + R * 1.4, v * h + (k - 2) * R * .12 + R * .1); x.stroke(); } } }
 x.restore();
}
/* build the player's canvas with paint, stripes, tint, sticker, dirt and dents */
function buildPlayerCanvas(vid, cos, cond, dents){
 const V = VBY(vid), M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
 const id = x.createImageData(w, h), o = id.data, d = M.src; o.set(d);
 const P = COS.paint.find(p => p.id === cos.paint), T = COS.tint.find(p => p.id === cos.tint);
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ const mw = M.m[p];
  if (P && P.c && mw > 0){ const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, f = Math.pow(L / M.dL, 1.05); const pl = (P.c[0] * .3 + P.c[1] * .59 + P.c[2] * .11) / 255; const lift = pl < .3 ? 1.25 : 1;
   for (let k = 0; k < 3; k++) o[i + k] = lerp(d[i + k], clamp(P.c[k] * f * lift + (L > M.dL * 1.02 ? (L - M.dL) * .8 : 0), 0, 255), mw); }
  if (T && T.a && M.win[p]){ for (let k = 0; k < 3; k++) o[i + k] = o[i + k] * (1 - T.a) + 12 * T.a; } }
 x.putImageData(id, 0, 0);
 // mask canvas to clip decorations to the painted body
 const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++){ md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; } mx.putImageData(md, 0, 0);
 const deco = document.createElement('canvas'); deco.width = w; deco.height = h; const dx = deco.getContext('2d');
 const ST = COS.stripe.find(p => p.id === cos.stripe);
 if (ST && ST.s) for (const [yf, hf, col] of ST.s){ dx.fillStyle = col; dx.fillRect(0, yf * h, w, hf * h); }
 if (ST && ST.check){ const sz = h * .045; for (let i = 0; i < w / sz; i++) for (let j = 0; j < 2; j++){ dx.fillStyle = (i + j) % 2 ? '#111' : '#f5c518'; dx.fillRect(i * sz, h * .58 + j * sz, sz, sz); } }
 const SK = COS.sticker.find(p => p.id === cos.sticker);
 if (SK && SK.s){ dx.font = `bold ${h * .075}px Lalezar, "Readex Pro", sans-serif`; dx.textAlign = 'center'; dx.fillStyle = cos.paint === 'black' ? '#f5b21b' : '#1a1a1a'; dx.strokeStyle = 'rgba(255,255,255,.7)'; dx.lineWidth = h * .01; dx.strokeText(SK.s, w * .3, h * .5); dx.fillText(SK.s, w * .3, h * .5); }
 dx.globalCompositeOperation = 'destination-in'; dx.drawImage(mk, 0, 0); x.drawImage(deco, 0, 0);
 // dirt
 const dirt = 1 - (cond.clean ?? 100) / 100; if (dirt > .05){ x.save(); x.globalCompositeOperation = 'source-atop'; const g = x.createLinearGradient(0, h * .35, 0, h); g.addColorStop(0, 'rgba(120,95,60,0)'); g.addColorStop(1, `rgba(110,85,55,${dirt * .75})`); x.fillStyle = g; x.fillRect(0, 0, w, h); const r = mulberry(7); x.fillStyle = `rgba(95,75,50,${dirt * .5})`; for (let k = 0; k < 160 * dirt; k++){ x.beginPath(); x.arc(r() * w, h * (.55 + r() * .45), r() * h * .02 + 1, 0, 7); x.fill(); } x.restore(); }
 drawDents(x, dents || [], w, h);
 return c;
}
function spriteCanvas(spr){ const im = IMG[spr], c = document.createElement('canvas'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0); return c; }
const AIWHEELS = {};
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr]; return AIWHEELS[spr] = META[spr].wheels.map(([cx, cy, r]) => { const R = Math.ceil(r * .97), c = document.createElement('canvas'); c.width = c.height = R * 2; const x = c.getContext('2d'); x.beginPath(); x.arc(R, R, R, 0, 7); x.clip(); x.drawImage(im, -(cx - R), -(cy - R)); return c; }); }
/* add a dent in local metres to a car's damage canvas */
function addDent(car, lx, ly, sev, glass){
 if (!car.cv) return; const g = car.g, w = car.cv.width, h = car.cv.height;
 const u = clamp((car.mirror ? -lx : lx) / g.len + .5, .03, .97), v = clamp(.5 - ly / g.h, .08, .9);
 const dd = [u, v, clamp(.025 + sev * .012, .025, .07), glass ? 2 : Math.random() < .5 ? 1 : 0];
 drawDents(car.cv.getContext('2d'), [dd], w, h); if (car.dents) { car.dents.push(dd); if (car.dents.length > 45) car.dents.shift(); }
}
/* ---------------- draw vehicles ---------------- */
function drawVehicle(car, opt){
 opt = opt || {}; const g = car.g, lift = opt.lift || 0, sc = opt.scale || 1;
 const X = x => sx(x), Y = y => sy(y + lift);
 const k = PPM * g.s * sc;
 if (opt.shadow !== false){ ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(X(car.x), Y(terrH(car.x)) + 2, car.L * .5 * PPM * sc, PPM * .18 * sc, -Math.atan(terrS(car.x)), 0, 7); ctx.fill(); }
 if (car.glow){ const gx = X(car.x), gy = Y(terrH(car.x)); const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, car.L * .55 * PPM); gr.addColorStop(0, car.glow + 'cc'); gr.addColorStop(1, car.glow + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(gx, gy, car.L * .6 * PPM, PPM * .5, 0, 0, 7); ctx.fill(); }
 const drawWheels = () => { const crops = car.player ? null : aiWheelCrops(car.spr);
  car.wh.forEach((w, i) => { const r = w.r * PPM * sc, wx = X(car.x) + (w.x - car.x) * PPM * sc, wy = Y(car.y) - (w.y - car.y) * PPM * sc; ctx.save(); ctx.translate(wx, wy); if (w.flat) ctx.scale(1, .86); ctx.rotate(w.rot);
   if (crops){ const c = crops[i]; if (car.mirror) ctx.scale(-1, 1); ctx.drawImage(c, -r * 1.0, -r * 1.0, r * 2, r * 2); }
   else { const im = IMG['wh' + car.rim]; ctx.drawImage(im, -r * 1.04, -r * 1.04, r * 2.08, r * 2.08); }
   ctx.restore(); }); };
 if (car.player) drawWheels();
 ctx.save(); ctx.translate(X(car.x), Y(car.y)); ctx.rotate(-car.a); ctx.scale(car.mirror ? -k : k, k);
 const src = car.cv || IMG[car.spr]; ctx.drawImage(src, -src.width / 2, -src.height / 2);
 if (opt.dim){ ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = opt.dim; ctx.fillRect(-src.width / 2, -src.height / 2, src.width, src.height); ctx.globalCompositeOperation = 'source-over'; }
 ctx.restore();
 if (!car.player) drawWheels();
 // roof rack & luggage
 if (car.rack){ const ca = Math.cos(car.a), sa = Math.sin(car.a); const L = car.L * .62; ctx.save(); ctx.translate(X(car.x), Y(car.y)); ctx.rotate(-car.a); const top = -g.yt * PPM; ctx.fillStyle = '#2b2b2b'; ctx.fillRect(-L / 2 * PPM, top - PPM * .12, L * PPM, PPM * .06); for (let i = 0; i < 6; i++) ctx.fillRect((-L / 2 + i * L / 5) * PPM - 1, top - PPM * .12, PPM * .04, PPM * .12);
  const n = Math.min(4, Math.ceil((car.cargoKg || 0) / 40)); const cols = ['#8b5a2b','#3f6e8c','#b98d4e','#6b3f2a']; for (let i = 0; i < n; i++){ ctx.fillStyle = cols[i]; ctx.fillRect((-L / 2 + .15 + i * L / 4.3) * PPM, top - PPM * (.12 + .35 + (i % 2) * .08), L / 4.8 * PPM, PPM * (.35 + (i % 2) * .08)); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeRect((-L / 2 + .15 + i * L / 4.3) * PPM, top - PPM * (.12 + .35 + (i % 2) * .08), L / 4.8 * PPM, PPM * (.35 + (i % 2) * .08)); }
  ctx.restore(); }
 // lights: brake/indicators/hazard/beacon
 const ca = Math.cos(car.a), sa = Math.sin(car.a), P2 = (lx, ly) => [X(car.x + lx * ca - ly * sa), Y(car.y + lx * sa + ly * ca)], dir = car.mirror ? -1 : 1;
 const lamp = (lx, ly, col, r) => { const [px, py] = P2(lx * dir, ly); const gr = ctx.createRadialGradient(px, py, 0, px, py, r * PPM); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, r * PPM, 0, 7); ctx.fill(); };
 const ly = (g.yb + g.yt) * .45 - g.h * .12;
 if (car.braking) lamp(-car.L / 2 + .05, ly, 'rgba(255,30,30,.95)', .55);
 const blink = Math.floor(G.time * 2.2) % 2 === 0;
 if (blink && (car.ind === 1 || car.haz)) { lamp(car.L / 2 - .1, ly, 'rgba(255,170,0,.95)', .45); lamp(-car.L / 2 + .1, ly + .15, 'rgba(255,170,0,.95)', .45); }
 if (blink && (car.ind === -1 || car.haz)) { lamp(-car.L / 2 + .12, ly - .1, 'rgba(255,170,0,.9)', .4); }
 if (car.siren){ const on = Math.floor(G.time * 6) % 2; lamp(car.L * .12 * (on ? 1 : -1), g.yt + .05, on ? 'rgba(40,120,255,1)' : 'rgba(255,40,40,1)', .9); }
 if (car.headOn) lamp(car.L / 2 - .05, ly + .1, `rgba(${car.lightCol || '255,230,170'},.95)`, .5);
}
/* ---------------- sky & parallax (procedural background) ---------------- */

/* ======================= world.js ======================= */
"use strict";
/* ---------------- textured bands along the terrain ---------------- */
function band(img, top, bot, tile, x0, x1, alpha){
 if (!img || !img.width) return; const step = tile / 4; let xa = Math.floor(x0 / step) * step;
 ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
 for (; xa < x1; xa += step){ const xb = xa + step, Xa = sx(xa), Xb = sx(xb), Ya = sy(terrH(xa) + top), Yb = sy(terrH(xb) + top), hgt = (top - bot) * PPM;
  const k = (Yb - Ya) / (Xb - Xa || 1); ctx.setTransform(DPR, DPR * k, 0, DPR, 0, DPR * (Ya - k * Xa));
  const u = (((xa % tile) + tile) % tile) / tile * img.width, uw = step / tile * img.width; ctx.drawImage(img, u, 0, Math.min(uw, img.width - u), img.height, Xa, 0, Xb - Xa + .8, hgt); }
 ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
function viewX(){ return [cam.x - SX0() / PPM - 12, cam.x + (VW - SX0()) / PPM + 12]; }
const PROP_H = {tlight:4.4, plight:2.9, lamp:7.5, lamp2:4.6, lamp3:8.2, shelter:2.8, stopsign:2.7, pole:9.5, cone:.72, cone2:.72, barrier:.55, jersey:.85, fence:1.05, dirsign:3.2, meter:1.4, bin:1.05, hydrant:.95, planter:1.7, bench:.95, bollard:1};
const PROP_W = {barrier:2.6, jersey:2, fence:2.4, bench:1.9, shelter:4.2};
function drawSprite(k, x, baseY, hM, opt){ const im = IMG[k]; if (!im) return; const h = hM * PPM, w = PROP_W[k] && !opt?.keepAR ? PROP_W[k] * PPM : im.width / im.height * h; const X = sx(x) - w / 2, Y = sy(baseY) - h; if (X > VW + 50 || X + w < -50) return null; if (opt && opt.flip){ ctx.save(); ctx.translate(X + w / 2, 0); ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, Y, w, h); ctx.restore(); } else ctx.drawImage(im, X, Y, w, h); return {X, Y, w, h}; }
function lightState(l){ const cyc = 19, p = (G.time + l.off) % cyc; return p < 9 ? 'g' : p < 11.5 ? 'y' : 'r'; }
/* ---------------- people (uploaded walk cycles) ---------------- */
function drawPed(type, x, baseY, dist, face, alpha, hM){
 const fr = META.peds[type]; if (!fr) return; const n = fr.length, f = dist == null ? 0 : Math.floor((dist / 1.45) * n) % n; const im = IMG[fr[(f + n) % n]]; if (!im) return;
 const h = (hM || 1.7) * PPM * im.height / 150, w = im.width / im.height * h, X = sx(x), Y = sy(baseY);
 if (X < -60 || X > VW + 60) return; ctx.save(); if (alpha != null) ctx.globalAlpha = clamp(alpha, 0, 1); ctx.translate(X, Y); if (face < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
}
function drawOfficer(c){
 const f = c.oFrame ?? 0; const im = IMG['off' + f]; if (!im) return; const h = 1.8 * PPM, w = im.width / im.height * h; const X = sx(c.ox), Y = sy(terrH(c.ox) + .95);
 ctx.save(); ctx.translate(X, Y); if (c.oFace < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
}
/* ---------------- world ---------------- */
function drawWorld(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3, night = G.tod === 'night', coachy = W.route.type === 'coach' || B.urban < .1;
 // buildings (base on the sidewalk)
 for (const d of W.deco){ if (d.x + d.w / 2 < x0 - 5 || d.x - d.w / 2 > x1 + 5) continue;
  let hi = -1e9, lo = 1e9; for (let s = -d.w / 2; s <= d.w / 2; s += 1){ const h = terrH(d.x + s); hi = Math.max(hi, h); lo = Math.min(lo, h); }
  const base = hi + 2.2, X = sx(d.x - d.w / 2), wpx = d.w * PPM;
  ctx.fillStyle = night ? '#2a2620' : '#8a7a62'; ctx.fillRect(X + wpx * .03, sy(base), wpx * .94, (hi - lo + .3) * PPM);
  const im = IMG[d.k]; const hp = d.h * PPM; ctx.drawImage(im, X, sy(base) - hp, wpx, hp);
  if (night){ ctx.fillStyle = 'rgba(8,14,34,.55)'; ctx.fillRect(X, sy(base) - hp, wpx, hp); d.lit = true; } }
 // far sidewalk / shoulder
 if (urban || !coachy){ band(IMG.walk2, 2.25, 1.55, 9, x0, x1); band(IMG.curbY, 1.62, 1.42, 18, x0, x1); }
 else { band(IMG.dirt, 2.3, 1.5, 12, x0, x1); band(IMG.guard, 2.35, 1.45, 10, x0, x1); }
 // props on the sidewalk
 for (const p of W.props){ if (p.x < x0 - 6 || p.x > x1 + 6) continue; if (p.front) continue;
  const base = terrH(p.x) + (p.k === 'barrier' ? 1.5 : 1.95);
  if (p.k === 'fuel'){ drawFuel(p.x); continue; }
  const r = drawSprite(p.k, p.x, base, PROP_H[p.k] || 2);
  if (p.tl && r){ const st = lightState(p.tl); const lamps = [['r',.098,'#ff2a2a'],['y',.239,'#ffb300'],['g',.376,'#2bff6a']]; for (const [k, fy, col] of lamps){ const cx = r.X + r.w * .5, cy = r.Y + r.h * fy, rr = r.w * .21; ctx.fillStyle = k === st ? col : 'rgba(10,10,10,.78)'; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fill(); if (k === st){ const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 4); g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr * 4, 0, 7); ctx.fill(); } } }
 }
 for (const r of W.radars) drawRadar(r);
 // pedestrians on the sidewalk & passengers waiting
 for (const p of G.amb) drawPed(p.t, p.x, terrH(p.x) + 1.85, p.d, p.face, 1, p.h);
 for (const st of W.stops){ if (st.x < x0 - 10 || st.x > x1 + 10) continue; st.waiting.forEach((p, i) => { if (i > 9) return; const px = st.x - 3 + (i % 5) * .75 + (i > 4 ? .35 : 0); drawPed(p.t, px, terrH(px) + 1.8 + (i > 4 ? .15 : 0), null, i % 3 === 0 ? -1 : 1, 1, p.h); }); }
 // road
 const asp = W.route.biome === 'mokattam' || W.route.biome === 'upper' ? IMG.asphalt2 : IMG.asphalt;
 band(asp, 1.45, -.28, 22, x0, x1);
 if (G.rainT > 0) band(IMG.asphalt, 1.45, -.28, 22, x0, x1, .0);
 // lane divider (painted line)
 ctx.strokeStyle = 'rgba(245,245,240,.8)'; ctx.lineWidth = Math.max(1.5, PPM * .07); ctx.setLineDash([PPM * 3, PPM * 3.5]); ctx.lineDashOffset = -((cam.x * PPM) % (PPM * 6.5)); ctx.beginPath();
 for (let x = x0; x <= x1; x += 1){ const X = sx(x), Y = sy(terrH(x) + .62); x === x0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); } ctx.stroke(); ctx.setLineDash([]);
 // decals
 for (const d of W.decals){ if (d.x < x0 - 10 || d.x > x1 + 10) continue;
  if (d.k === 'zebra') band(IMG.zebra, 1.45, -.2, 4.2, d.x - d.w / 2, d.x + d.w / 2, .95);
  else if (d.k === 'patch') band(IMG.asphaltC, 1.45, -.28, 22, d.x, d.x + d.w, .9);
  else { const im = IMG[d.k]; const w = d.w * PPM, h = w * .35; ctx.globalAlpha = .9; ctx.drawImage(im, sx(d.x) - w / 2, sy(terrH(d.x) + .35) - h / 2, w, h); ctx.globalAlpha = 1; } }
 if (G.rainT > 0) for (let k = 0; k < 6; k++){ const x = Math.floor((x0 + k * 17) / 17) * 17 + hash(Math.floor((x0 + k * 17) / 17)) * 8; const w = 3.5 * PPM; ctx.globalAlpha = .6; ctx.drawImage(IMG.puddle, sx(x) - w / 2, sy(terrH(x) + .5) - w * .06, w, w * .12); ctx.globalAlpha = 1; }
 for (const b of W.bumps){ if (b < x0 || b > x1) continue; const w = 3.2 * PPM, h = .22 * PPM; ctx.drawImage(IMG.bump, sx(b) - w / 2, sy(terrH(b) + .55) - h / 2, w, h * 1.3); }
 for (const hx of W.holes){ if (hx < x0 || hx > x1) continue; const w = 1.1 * PPM; ctx.drawImage(IMG.hole, sx(hx) - w / 2, sy(terrH(hx) + .25) - w * .22, w, w * .45); }
}
function drawFront(){
 const [x0, x1] = viewX(), B = W.biome, urban = B.urban > .3;
 for (const p of W.props){ if (!p.front || p.x < x0 - 6 || p.x > x1 + 6) continue; drawSprite(p.k, p.x, terrH(p.x) + 1.25, PROP_H[p.k] || 1); }
 band(urban ? IMG.curbR : IMG.curbY, -.26, -.55, 18, x0, x1);
 if (urban) band(IMG.walk, -.55, -1.25, 9, x0, x1); else band(IMG.dirt, -.55, -1.2, 12, x0, x1);
 // earth below
 ctx.fillStyle = mix(B.ground, '#1a1410', G.tod === 'night' ? .6 : .25); ctx.beginPath(); ctx.moveTo(sx(x0), VH);
 for (let x = x0; x <= x1; x += 2) ctx.lineTo(sx(x), sy(terrH(x) - 1.22)); ctx.lineTo(sx(x1), VH); ctx.fill();
 if (urban) band(IMG.hedge, -1.05, -1.9, 14, x0, x1);
}
function drawFuel(x){ // fuel station: canopy with the uploaded fuel icon as its sign
 const b = terrH(x) + 1.9, X = sx(x), Y = sy(b), w = 9 * PPM, h = 4.6 * PPM;
 ctx.fillStyle = '#e9e4da'; ctx.fillRect(X - w / 2, Y - h, w, PPM * .6); ctx.fillStyle = '#c8102e'; ctx.fillRect(X - w / 2, Y - h + PPM * .6, w, PPM * .18);
 ctx.fillStyle = '#9aa0a8'; ctx.fillRect(X - w * .35, Y - h + PPM * .6, PPM * .25, h - PPM * .6); ctx.fillRect(X + w * .35 - PPM * .25, Y - h + PPM * .6, PPM * .25, h - PPM * .6);
 const s = 2 * PPM; ctx.fillStyle = '#6b7078'; ctx.fillRect(X + w * .55, Y - PPM * 5.5, PPM * .2, PPM * 5.5); ctx.drawImage(IMG.i_fuel, X + w * .55 - s / 2 + PPM * .1, Y - PPM * 5.5 - s, s, s);
}
function drawRadar(r){ const X = sx(r.x), Y = sy(terrH(r.x) + 1.9); if (X < -80 || X > VW + 80) return; ctx.fillStyle = '#7a828c'; ctx.fillRect(X - PPM * .1, Y - PPM * 4.2, PPM * .2, PPM * 4.2); ctx.fillStyle = '#2a2f36'; ctx.fillRect(X - PPM * .55, Y - PPM * 4.8, PPM * 1.1, PPM * .75); ctx.fillStyle = r.flash > 0 ? '#fff' : '#101418'; ctx.beginPath(); ctx.arc(X - PPM * .2, Y - PPM * 4.42, PPM * .2, 0, 7); ctx.fill(); if (r.flash > 0){ ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(0, 0, VW, VH); } }
/* ---------------- lighting & weather ---------------- */
let LCV = null;
function drawNight(){
 if (G.tod !== 'night' && G.tod !== 'sunset') return; const dark = G.tod === 'night' ? .62 : .22;
 if (!LCV) LCV = document.createElement('canvas'); if (LCV.width !== cv.width || LCV.height !== cv.height){ LCV.width = cv.width; LCV.height = cv.height; }
 const l = LCV.getContext('2d'); l.setTransform(DPR, 0, 0, DPR, 0, 0); l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, VW, VH); l.fillStyle = `rgba(4,8,22,${dark})`; l.fillRect(0, 0, VW, VH); l.globalCompositeOperation = 'destination-out';
 const hole = (x, y, r, a) => { const g = l.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.arc(x, y, r, 0, 7); l.fill(); };
 const [x0, x1] = viewX();
 for (const p of W.props) if ((p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') && p.x > x0 && p.x < x1){ const hgt = PROP_H[p.k]; hole(sx(p.x + (p.k === 'lamp' ? 1 : 0)), sy(terrH(p.x) + 1.95 + hgt * .9), PPM * 6, .85); }
 const cars = [G.car, ...G.ai].filter(Boolean);
 for (const c of cars){ if (!c.headOn && !c.player) c.headOn = true; if (!c.headOn) continue; const dir = c.mirror ? -1 : 1, lift = c.lane ? .8 : 0; const hx = sx(c.x + dir * c.L / 2), hy = sy(c.y + lift + (c.yb + c.yt) * .3);
  l.save(); l.translate(hx, hy); l.rotate(-c.a); const g = l.createLinearGradient(0, 0, dir * PPM * 22, 0); g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.moveTo(0, -PPM * .3); l.lineTo(dir * PPM * 22, -PPM * 3); l.lineTo(dir * PPM * 22, PPM * 3.2); l.lineTo(0, PPM * .4); l.fill(); l.restore(); hole(hx, hy, PPM * 1.2, .9); }
 ctx.drawImage(LCV, 0, 0, VW, VH);
 if (G.car && G.car.headOn){ const c = G.car; const hx = sx(c.x + c.L / 2), hy = sy(c.y + (c.yb + c.yt) * .3); const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, PPM * 10); g.addColorStop(0, `rgba(${c.lightCol},.22)`); g.addColorStop(1, `rgba(${c.lightCol},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, PPM * 10, 0, 7); ctx.fill(); }
}
const DROPS = Array.from({length:70}, (_, i) => ({x:hash(i), y:hash(i + 50), r:hash(i + 99)}));
function drawWeather(dt){
 if (G.weather === 'rain'){ ctx.strokeStyle = 'rgba(200,215,240,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < (S.set.gfx === 'low' ? 60 : 160); i++){ const x = (hash(i) * VW * 1.2 + G.time * 90 * (1 + hash(i + 3))) % (VW * 1.2) - VW * .1, y = (hash(i + 7) * VH + G.time * 900 * (1 + hash(i + 5) * .4)) % VH; ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); } ctx.stroke();
  const wet = G.wiper ? .15 : 1; ctx.fillStyle = `rgba(200,220,255,${.22 * wet})`; for (const d of DROPS){ ctx.beginPath(); ctx.arc(d.x * VW, ((d.y * VH + G.time * 12 * d.r) % VH), 3 + d.r * 7, 0, 7); ctx.fill(); }
  if (!G.wiper){ ctx.fillStyle = 'rgba(180,195,215,.18)'; ctx.fillRect(0, 0, VW, VH); } }
 if (G.weather === 'sand'){ const g = ctx.createLinearGradient(0, 0, VW, 0); g.addColorStop(0, 'rgba(214,160,90,.45)'); g.addColorStop(1, 'rgba(190,130,70,.25)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.fillStyle = 'rgba(230,190,130,.5)'; for (let i = 0; i < 90; i++){ const x = (VW - (hash(i) * VW + G.time * 420 * (1 + hash(i + 2))) % VW), y = hash(i + 4) * VH; ctx.fillRect(x, y, 6 + hash(i) * 10, 1.5); } }
}
/* ---------------- particles & floating text ---------------- */
const PARTS = [], FLOATS = [];
function puff(x, y, vx, vy, life, size, col, kind){ if (PARTS.length > (S.set.gfx === 'low' ? 120 : 420)) return; PARTS.push({x, y, vx, vy, life, max:life, size, col, kind}); }
function floatTxt(x, y, txt, col){ FLOATS.push({x, y, txt, col, life:1.7}); }
function updParts(dt){
 for (let i = PARTS.length - 1; i >= 0; i--){ const p = PARTS[i]; p.life -= dt; if (p.life <= 0){ PARTS.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.kind === 'spark' || p.kind === 'glass'){ p.vy -= 9.8 * dt; } else { p.vx *= (1 - dt); p.vy *= (1 - dt * .5); p.size += dt * .8; } }
 for (let i = FLOATS.length - 1; i >= 0; i--){ const f = FLOATS[i]; f.life -= dt; f.y += dt * 1.2; if (f.life <= 0) FLOATS.splice(i, 1); }
}
function drawParts(){
 for (const p of PARTS){ const a = p.life / p.max; ctx.globalAlpha = p.kind === 'spark' ? a : a * .6; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), Math.max(1, p.size * PPM), 0, 7); ctx.fill(); }
 ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (const f of FLOATS){ ctx.globalAlpha = clamp(f.life, 0, 1); ctx.font = `${Math.max(16, PPM * .55)}px Lalezar, sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(f.txt, sx(f.x), sy(f.y)); ctx.fillStyle = f.col; ctx.fillText(f.txt, sx(f.x), sy(f.y)); }
 ctx.globalAlpha = 1;
}
/* ---------------- dashboard gauges (uploaded cluster with live needles) ---------------- */
function needle(x, cx, cy, len, ang, col, w){ x.save(); x.translate(cx, cy); x.rotate(ang * Math.PI / 180); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.shadowColor = col; x.shadowBlur = w * 2; x.beginPath(); x.moveTo(0, len * .12); x.lineTo(0, -len); x.stroke(); x.restore(); }
function drawCluster(){
 const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight; if (!W2) return; const d = Math.min(2, window.devicePixelRatio || 1); if (c.width !== Math.round(W2 * d)){ c.width = Math.round(W2 * d); c.height = Math.round(H2 * d); }
 const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W2, H2); x.drawImage(IMG.cluster, 0, 0, W2, H2);
 const car = G.car; if (!car) return; const kmh = speedOf(car) * 3.6 * (car.rev ? 1 : 1), rpm = G.engOn ? car.rpm * 6 : 0;
 needle(x, W2 * .234, H2 * .645, W2 * .125, -113 + clamp(kmh / 160, 0, 1) * 228, '#ff5a1f', W2 * .007);
 needle(x, W2 * .782, H2 * .645, W2 * .125, -113 + clamp(rpm / 6, 0, 1) * 230, '#ff5a1f', W2 * .007);
 // centre LCD
 x.fillStyle = '#9fe8ff'; x.textAlign = 'center'; x.font = `600 ${H2 * .09}px "Readex Pro", sans-serif`;
 x.fillText(car.rev ? 'R' : G.engOn ? 'D' + car.gear : 'P', W2 * .48, H2 * .44); x.font = `600 ${H2 * .07}px "Readex Pro", sans-serif`;
 x.fillText(Math.round(kmh) + ' km/h', W2 * .48, H2 * .55); x.fillStyle = G.cruise ? '#7CFC9A' : '#5c7a86'; x.fillText(G.cruise ? 'CC ' + Math.round(G.cruise * 3.6) : 'CC --', W2 * .48, H2 * .65);
 x.fillStyle = '#9fe8ff'; x.fillText((G.odo || 0).toFixed(1) + ' km', W2 * .48, H2 * .75);
 // indicator arrows & warning lamps overlay (dim the unused ones)
 const blink = Math.floor(G.time * 2.2) % 2 === 0; x.fillStyle = 'rgba(8,10,14,.82)';
 if (!(blink && (car.ind === -1 || car.haz))) x.fillRect(W2 * .355, H2 * .07, W2 * .06, H2 * .12);
 if (!(blink && (car.ind === 1 || car.haz))) x.fillRect(W2 * .585, H2 * .07, W2 * .06, H2 * .12);
 if (!G.doorOpen) x.fillRect(W2 * .47, H2 * .06, W2 * .055, H2 * .13);
 if (G.belt) x.fillRect(W2 * .405, H2 * .82, W2 * .04, H2 * .11);
 if (!(G.hbrake || (!G.engOn))) x.fillRect(W2 * .452, H2 * .82, W2 * .045, H2 * .11);
 if (!(G.cond && G.cond.engine < 45) && G.engOn) x.fillRect(W2 * .5, H2 * .82, W2 * .05, H2 * .11);
 if (!car.headOn) x.fillRect(W2 * .555, H2 * .82, W2 * .045, H2 * .11);
 // fuel & temperature
 const f = $('#fuelG'), tg = $('#tempG');
 for (const [el, img, val] of [[f, IMG.fuelG, G.fuel / G.fuelMax], [tg, IMG.tempG, clamp((G.temp - 50) / 70, 0, 1)]]){ const w = el.clientWidth, h = el.clientHeight; if (!w) continue; if (el.width !== Math.round(w * d)){ el.width = Math.round(w * d); el.height = Math.round(h * d); } const y = el.getContext('2d'); y.setTransform(d, 0, 0, d, 0, 0); y.clearRect(0, 0, w, h); y.drawImage(img, 0, 0, w, h); needle(y, w * .505, h * .665, w * .3, -56 + clamp(val, 0, 1) * 112, '#ff5a1f', w * .025); }
}

/* ======================= gameplay.js ======================= */
"use strict";
const G = {mode:'menu', car:null, ai:[], amb:[], walkers:[], onboard:[], time:0, tod:'day', weather:'clear'};
const key = {gas:false, brake:false};
const PAX_KG = 75;
const doorX = () => G.car.x + G.V.door * G.car.L * Math.cos(G.car.a);
const STOP_TOL = () => ({micro:2.8, bus:4, coach:6})[G.V.cls];
const seatsOf = V => V.seats + V.stand;
function kmPerM(){ return W.route.km / W.len; }
/* ---------- build a player car from the saved garage state ---------- */
function playerCar(vid, x, test){
 const V = VBY(vid), gv = GV(vid), u = k => test ? 0 : (gv.up[k] || 0), cond = test ? {body:100, engine:100, susp:100, tyres:100, brakes:100, oil:100, clean:100} : gv.cond;
 const geom = vehGeom(V.spr, V.len);
 const car = makeCar({geom, mass:V.mass, acc:V.acc * (1 + .1 * u('engine') + .04 * u('gear')) * (.55 + .45 * cond.engine / 100), vmax:V.vmax * (1 + .045 * u('gear')), mu:1.05 * (1 + .07 * u('tires')) * (.7 + .3 * cond.tyres / 100),
  brk:V.brk * (1 + .1 * u('brakes')) * (.45 + .55 * cond.brakes / 100), f:V.f, travel:V.travel + .02 * u('susp'), zeta:(.4 + .04 * u('susp')) * (.6 + .4 * cond.susp / 100), armor:1 - .1 * u('armor'), x});
 car.player = true; const cos = gv.cos; car.rim = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh;
 car.cv = buildPlayerCanvas(vid, cos, test ? {clean:100} : cond, test ? [] : gv.dents); car.dents = test ? [] : gv.dents; car.baked = !!V.baked; lightFlags(car);
 const gl = COS.glow.find(g => g.id === cos.glow); car.glow = gl && gl.c; car.rack = !!(cos.rack && V.rack); car.lightCol = COS.lights.find(l => l.id === cos.lights).c; car.horn = cos.horn;
 return car;
}
/* ---------- start a trip ---------- */
function startRoute(route, opt){
 opt = opt || {}; const attract = !!opt.attract, test = !!opt.test;
 const vid = opt.vid || S.sel; const V = VBY(vid); G.V = V; G.vid = vid; G.test = test;
 genWorld(route, (Math.random() * 1e9) | 0);
 G.route = route; G.mode = attract ? 'attract' : 'play'; G.time = 0; G.onboard = []; G.walkers = []; G.ai = []; G.amb = []; G.peds = [];
 const car = playerCar(vid, W.stops[0].x - V.door * V.len, test); G.car = car;
 G.tod = opt.tod || (attract ? 'sunset' : pickTod()); G.weather = opt.weather || (attract ? 'clear' : pickWeather(route));
 G.rainT = G.weather === 'rain' ? 1 : 0; cam.x = car.x + 6; cam.y = car.y; cam.y0 = car.y; cam.zoom = 1; calcPPM();
 G.nextIdx = 0; G.dwell = 0; G.queueT = 0; G.finished = false; G.ended = false; G.paused = false; G.doorOpen = false; G.engOn = attract; G.crank = 0;
 G.belt = attract; G.wiper = false; G.cruise = 0; G.cond = test ? {engine:100} : GV(vid).cond;
 car.headOn = G.tod === 'night' && attract; car.ind = 0; car.haz = false;
 G.T = {fares:0, tips:0, cargo:0, fines:0, fineList:[], rest:0, fuelL:0, delivered:0, missed:0, comfortSum:0, comfortN:0, fee:0, meters:0, hits:0, pro:0};
 G.comfort = 100; G.alert = 100; G.evT = 16 + Math.random() * 10; G.side = null; G.overT = 0; G.upsideT = 0; G.fuelOutT = 0; G.rest = null; G.warned = {}; G.holesHit = new Set(); G.cp = null; G.pedX = null; G.ambEv = null; G.hbrake = false;
 G.cabin = BIOME[route.biome].temp - (G.tod === 'night' ? 7 : 0); G.ac = false; G.acSet = 22; G.temp = attract ? 88 : 62; G.odo = 0; G.lastX = car.x;
 G.fuelMax = V.tank * (1 + .2 * (test ? 0 : upl(vid, 'tank'))); G.fuel = test || attract ? G.fuelMax : Math.min(G.fuelMax, GV(vid).fuel);
 G.parcels = (opt.parcels || []).map(p => Object.assign({}, p)); G.store = V.store * (1 + .2 * (test ? 0 : upl(vid, 'store'))) + (car.rack ? 150 : 0);
 G.radioOn = attract ? false : S.radio.on;
 PARTS.length = 0; FLOATS.length = 0;
 // passengers waiting (uploaded walking characters)
 const n = W.stops.length, cap = seatsOf(V), npeds = META.peds.length;
 W.stops.forEach((st, i) => { st.waiting = []; st.served = false; st.missed = false; if (i === n - 1) return; let cnt;
  if (V.cls === 'coach') cnt = Math.round(V.seats * (.75 + Math.random() * .25)); else if (i === 0) cnt = Math.round(Math.min(cap, V.seats * 1.1) * (.55 + Math.random() * .4)); else cnt = V.cls === 'micro' ? 1 + ((Math.random() * 5) | 0) : 4 + ((Math.random() * 12) | 0);
  for (let k = 0; k < cnt; k++){ const j = route.type === 'coach' ? n - 1 : Math.min(n - 1, i + 1 + Math.floor(Math.pow(Math.random(), 1.4) * (n - 1 - i))); st.waiting.push({t:(Math.random() * npeds) | 0, h:1.62 + Math.random() * .2, dest:j, music:Math.random()}); } });
 // ambient pedestrians on the sidewalk
 if (BIOME[route.biome].urban > .3) for (let k = 0; k < W.len / 28; k++) G.amb.push({t:(Math.random() * npeds) | 0, x:Math.random() * W.len, face:Math.random() < .5 ? 1 : -1, spd:1 + Math.random() * .6, d:Math.random() * 3, h:1.6 + Math.random() * .22});
 W.cps.forEach(c => { c.ox = c.x - 1; c.oFrame = 0; c.oFace = -1; c.state = 'idle'; c.hold = 0; });
 W.lights.forEach(l => { l.ran = false; }); W.radars.forEach(r => { r.done = false; r.flash = 0; });
 if (!attract){ buildTrack(); if (!test){ const fee = TERMINAL_FEE[route.type]; G.T.fee = fee; } }
 setLoad(car, 0); v2world(); G.fan = 0; G.recirc = false; G.vent = 'face'; G.defrost = false; G.fog = 0; G.talkT = 5; BUB.length = 0; if (G.tod === 'night') car.headOn = true;
}
function pickTod(){ const h = new Date().getHours(); const r = Math.random(); if (r < .5) return h >= 19 || h < 5 ? 'night' : h >= 17 ? 'sunset' : 'day'; return r < .72 ? 'day' : r < .86 ? 'sunset' : 'night'; }
function pickWeather(route){ const r = Math.random(), b = route.biome; if (['desert','redsea','sinai','upper'].includes(b)) return r < .18 ? 'sand' : 'clear'; if (['city','nile','alex','mokattam','ring'].includes(b)) return r < (b === 'alex' ? .3 : .15) ? 'rain' : 'clear'; return 'clear'; }
function toast(msg, cls, acts, life){ toastUI(msg, cls, acts, life); }
/* ---------- the frame update ---------- */
function update(dt){
 const car = G.car, full = G.mode === 'play'; G.time += dt;
 let gas = 0, brake = 0;
 if (full){ gas = (key.gas || G.gasT) ? 1 : 0; brake = (key.brake || G.brakeT) ? 1 : 0; if (G.blink > 0){ G.blink -= dt; gas = 0; } }
 else { gas = car.a > .42 ? 0 : 1; if (car.a > .42 && car.grounded === 0) brake = 1; if (car.x > W.len - 90) startRoute(G.route, {attract:true, vid:G.vid}); }
 // cruise control
 if (full && G.cruise){ if (brake){ G.cruise = 0; toast(t('cruiseOff')); } else if (!gas){ const v = car.vx; gas = v < G.cruise - .15 ? clamp((G.cruise - v) * .6, .15, 1) : 0; if (v > G.cruise + 1.2) brake = .3; } }
 if (full && !G.engOn){ gas = 0; }
 let hold = false;
 if (G.rest || G.finished || G.ended || (G.cp && G.cp.state === 'check')) { gas = 0; brake = 0; hold = !G.ended || speedOf(car) < 3; }
 if (full && G.nextIdx === 0 && W.stops[0] && !W.stops[0].served && !G.doorOpen) { /* boarding lock until first stop served */ if (G.T.delivered === 0 && W.stops[0].waiting.length) { gas = 0; hold = true; } }
 if (full && G.doorOpen && speedOf(car) < 1) hold = true;
 if (G.hbrake) hold = true;
 if (G.fuel <= 0) gas = 0;
 G.gas = gas; G.brake = brake; car.braking = brake > 0 || (hold && G.mode === 'play');
 let pm = 1; if (G.temp > 112){ pm *= .6; } if (G.cond.engine < 40) pm *= .8;
 // load (passengers + parcels + luggage)
 const cargoKg = (typeof invKg === 'function' ? invKg(G.vid) : 0) + G.parcels.filter(p => p.on).reduce((a, p) => a + p.kg, 0) + (G.V.cls === 'coach' ? G.onboard.length * 14 : 0); car.cargoKg = cargoKg; setLoad(car, G.onboard.length * PAX_KG + cargoKg);
 const grip = G.weather === 'rain' ? .78 : G.weather === 'sand' ? .88 : 1;
 const n = Math.min(40, Math.ceil(dt * 600)), h = dt / n; const pvx = car.vx, pvy = car.vy;
 for (let i = 0; i < n; i++) physStep(car, h, {gas, brake, power:pm, hold, grip});
 const spd = speedOf(car);
 // AI traffic
 updateAI(dt);
 // impacts → mechanical & visual damage
 let worst = 0; const test = G.test || !full;
 for (const im of car.impacts){
  const tf = ({micro:1, bus:.75, coach:.65})[G.V.cls] * car.armor;
  if (im.kind === 'body'){ const d = (im.v - 2) * 2.6 * tf; worst = Math.max(worst, im.v); if (!test){ G.cond.body = clamp(G.cond.body - d, 0, 100); if (im.roof || im.v > 7) G.cond.engine = clamp(G.cond.engine - d * .25, 0, 100); } addDent(car, im.lx + (Math.random() - .5) * .5, im.ly + (im.ly > 0 ? -.3 : .3), im.v, im.roof && im.v > 5);
   const ca = Math.cos(car.a), sa = Math.sin(car.a), px = car.x + im.lx * ca - im.ly * sa, py = car.y + im.lx * sa + im.ly * ca; for (let k = 0; k < 8; k++) puff(px, py, (Math.random() - .5) * 6, Math.random() * 5, .5, .04, '#FFD24A', 'spark'); if (im.v > 6) for (let k = 0; k < 6; k++) puff(px, py, (Math.random() - .5) * 4, Math.random() * 4, .8, .03, '#cfe6ff', 'glass'); }
  else if (im.kind === 'land'){ worst = Math.max(worst, im.v * .7); if (!test) G.cond.susp = clamp(G.cond.susp - Math.max(0, im.v - 5) * 1.2 * tf, 0, 100); breakParcels(im.v); }
  else { worst = Math.max(worst, im.v * .6); if (!test) G.cond.susp = clamp(G.cond.susp - Math.max(0, im.v - 3.5) * .8 * tf, 0, 100); breakParcels(im.v * .8); }
 }
 car.impacts.length = 0; if (worst > 4 && full && G.onboard.length && Math.random() < .5 && (G.talkT || 0) < 3){ G.talkT = 8; say(pick(DLG.bump), car.x, car.y + car.yt + .9); }
 if (worst > 2.5 && G.time - (G.lastThud || 0) > .15){ AU.thud(worst); G.lastThud = G.time; cam.shake = Math.min(1, worst / 12); if (full && G.onboard.length) G.comfort -= worst * 1.6; }
 if (full){
  const acc = Math.hypot(car.vx - pvx, car.vy - pvy) / dt;
  if (car.grounded === 0) G.comfort -= 6 * dt; if (Math.abs(car.a) > .38) G.comfort -= 5 * dt; if (acc > 10) G.comfort -= (acc - 10) * .06;
  if (car.grounded && acc < 6 && Math.abs(car.a) < .25) G.comfort += 1.2 * dt;
  // cabin climate (A/C)
  acStep(dt);
  
  if (radioAudible() && G.onboard.length){ const vol = S.set.radio; if (vol > .85) G.comfort -= .5 * dt; else G.comfort += (.25 + .08 * upl(G.vid, 'audio')) * dt; }
  if (G.doorOpen && spd > 2){ G.comfort -= 4 * dt; if (!G.warned.door){ G.warned.door = 1; toast(t('doorDrive'), 'bad'); } } else G.warned.door = 0;
  G.comfort = clamp(G.comfort, 0, 100); if (G.onboard.length){ G.T.comfortSum += G.comfort * dt; G.T.comfortN += dt; }
  // engine temperature
  const amb = BIOME[W.route.biome].temp; const heat = 82 + gas * car.rpm * 26 + (100 - G.cond.engine) * .25 + (G.cond.oil < 20 ? 12 : 0) + (amb - 30) * .35 + (G.ac ? 4 : 0) - Math.min(spd, 20) * .35; G.temp += ((G.engOn ? heat : amb) - G.temp) * dt * .06;
  if (G.temp > 112 && !G.warned.hot){ G.warned.hot = 1; toast(t('overheat'), 'bad'); } if (G.temp < 100) G.warned.hot = 0;
  if (G.temp > 112){ if (!G.test) G.cond.engine = clamp(G.cond.engine - dt * .4, 0, 100); if (Math.random() < .5) puff(car.x + car.L * .42, car.y + car.yt * .6, rnd(-.3, .3), 1.2, 1.2, .1, '#e8eef4', 'smoke'); }
  if (car.type === 'coach' || G.V.cls === 'coach'){ if (!G.rest){ G.alert = Math.max(0, G.alert - dt * 100 / 260); if (G.alert < 30 && Math.random() < dt * (30 - G.alert) / 60) G.blink = .45; } }
  $('#fatigue').style.opacity = G.V.cls === 'coach' ? (G.blink > 0 ? .95 : clamp((40 - G.alert) / 50, 0, .7)) : 0;
  // fuel (realistic litres, driven by real kilometres covered)
  const dxm = Math.max(0, car.x - G.lastX); G.lastX = Math.max(G.lastX, car.x); const km = dxm * kmPerM(); G.odo += km; G.T.meters += dxm;
  const load = 1 + (car.m - car.base) / car.base * .35; let burn = G.V.lp100 / 100 * km * (.55 + .8 * gas * car.rpm) * load * acFuel();
  if (G.engOn) burn += .00035 * dt * (G.V.lp100 / 12) * acFuel() * 1.2;
  G.fuel = Math.max(0, G.fuel - burn); G.T.fuelL += burn;
  if (G.fuel < G.fuelMax * .12 && !G.warned.fuel){ G.warned.fuel = 1; toast(t('fuelLow'), 'bad'); }
  if (G.fuel <= 0 && spd < .4 && !G.walkFuel && !G.fuelAsk){ G.fuelOutT += dt; if (G.fuelOutT > 1.2) fuelOutPrompt(); }
  if (car.roof && Math.cos(car.a) < .3) endRun('crash');
  if (Math.cos(car.a) < -.1){ G.upsideT += dt; if (G.upsideT > 1.2) endRun('crash'); } else G.upsideT = 0;
  if (!G.test && G.cond.body <= 0 && G.cond.engine <= 5) endRun('broke');
  gameplay(dt, spd);
  if (G.crank > 0){ G.crank -= dt; if (G.crank <= 0){ G.engOn = true; $('#startBtn').classList.remove('on'); } }
 }
 // exhaust, dust, smoke
 const ca = Math.cos(car.a), sa = Math.sin(car.a), ex = car.x - car.L / 2 * ca - (car.yb + .1) * sa, ey = car.y - car.L / 2 * sa + (car.yb + .1) * ca;
 if (G.engOn && Math.random() < (gas ? .9 : .25)) puff(ex, ey, -1 - Math.random(), .4 + Math.random() * .5, gas ? 1.1 : .7, gas ? .09 : .05, G.V.cls === 'micro' && gas ? '#2a2a2a' : '#8a8f96', 'smoke');
 for (const w of car.wh) if (w.ground && (w.slip > 1.6 || (spd > 6 && BIOME[W.route.biome].urban < .2 && Math.random() < .5))) puff(w.x - w.r * .5, w.y - w.r, -Math.random() * 2, Math.random() * 1.5, .9, .12, W.biome.ground, 'dust');

 if (full && G.cond.engine < 45 && Math.random() < (45 - G.cond.engine) / 60){ puff(car.x + car.L * .38 * ca - (car.yt - .4) * sa, car.y + car.L * .38 * sa + (car.yt - .4) * ca, rnd(-.5, .5), 1 + Math.random(), 1.4, .12, G.cond.engine < 20 ? '#1a1a1a' : '#9aa0a8', 'smoke'); }
 updParts(dt);
 // ambient pedestrians
 for (const p of G.amb){ p.x += p.face * p.spd * dt; p.d += p.spd * dt; if (p.x < car.x - 90) p.x += 180; if (p.x > car.x + 90 && p.face > 0 && Math.random() < .01) p.face = -1; }
 // walkers (boarding / alighting passengers)
 for (let i = G.walkers.length - 1; i >= 0; i--){ const w = G.walkers[i]; const dxw = w.tx - w.x, step = w.spd * dt; w.d += step; w.face = dxw > 0 ? 1 : -1; if (w.ty != null) w.y += (w.ty - w.y) * Math.min(1, dt * 2.5);
  if (Math.abs(dxw) <= step){ w.x = w.tx; if (w.done){ w.done(); w.done = null; } if (w.fade){ w.a = (w.a ?? 1) - dt * 2.5; if (w.a <= 0) G.walkers.splice(i, 1); } else if (!w.stay) G.walkers.splice(i, 1); } else w.x += Math.sign(dxw) * step; }
 // camera
 const look = clamp(car.vx * .5, -6, 14); cam.x += (car.x + look + car.L * .3 - cam.x) * Math.min(1, dt * 2.6); cam.y += (car.y + 1.4 - cam.y) * Math.min(1, dt * 3.2);
 const zt = 1 - clamp(spd / 40, 0, .14); if (Math.abs(zt - cam.zoom) > .002){ cam.zoom += (zt - cam.zoom) * dt; calcPPM(); }
 cam.shake = Math.max(0, cam.shake - dt * 2.5);
 v2tick(dt, spd, full);
 AU.engine(G.engOn && !G.ended && G.fuel > 0 && G.mode !== 'menu', car.rpm, gas, spd, G.V.cls !== 'micro', G.weather === 'rain');
 if (car.rev && G.V.cls !== 'micro' && Math.abs(car.vx) > .2 && Math.floor(G.time * 2) !== G._bp){ G._bp = Math.floor(G.time * 2); if (G._bp % 2) AU.beep(); }
}
function breakParcels(v){ if (v < 6) return; for (const p of G.parcels) if (p.on && p.fragile && !p.broken && Math.random() < (v - 6) * .15){ p.broken = true; toast(t('parcelBroken'), 'bad'); } }
/* ---------- gameplay systems ---------- */
function gameplay(dt, spd){
 const car = G.car, dxp = doorX(), tol = STOP_TOL(), V = G.V, stopped = spd < .7 && car.grounded > 0, front = car.x + car.L / 2;
 // ----- stops -----
 const st = W.stops[G.nextIdx];
 if (st && !G.rest){
  const inZone = Math.abs(dxp - st.x) < tol;
  const lastS = st.i === W.stops.length - 1, alight = G.onboard.some(p => p.dest <= st.i) || lastS;
  if (!G.warned['rq' + st.i] && st.x - dxp < 70 && st.x - dxp > 15 && alight && G.onboard.length){ G.warned['rq' + st.i] = 1; say([['على جنب هنا يا أسطى','Drop me here, driver'],['هنا لو سمحت','Here please']][Math.random() < .5 ? 0 : 1], car.x, car.y + car.yt + .9); }
  if (inZone && stopped){ G.dwell += dt; const need = st.waiting.length || alight || G.parcels.some(p => p.on && p.dest <= st.i); if (G.dwell > .5 && !G.doorOpen && !st.served){ if (need) setDoor(true); else { st.served = true; G.nextIdx++; G.dwell = 0; refreshTrack(); toast(LANG === 'ar' ? 'مفيش حد نازل ولا طالع — كمّل' : 'Nobody getting on or off — carry on', 'gold'); } } }
  else G.dwell = 0;
  if (G.doorOpen && inZone && stopped){ G.queueT -= dt; if (G.queueT <= 0) serveStop(st); }
  if (inZone && stopped && G.dwell > .3 && speedOf(car) < .2 && !G.warned['pro' + st.i] && Math.abs(dxp - st.x) < tol * .5){ G.warned['pro' + st.i] = 1; G.T.pro++; floatTxt(car.x, car.y + 3, '👍', '#7CFC9A'); }
  if (dxp > st.x + tol + 2.5 && !st.served){
   if (st.i === W.stops.length - 1){ if (!G.warned['back' + st.i]){ G.warned['back' + st.i] = 1; toast(t('backUp'), 'bad'); } if (dxp > st.x + 40) finishLine(true); }
   else { const riders = G.onboard.filter(p => p.dest === st.i); if (riders.length || st.waiting.length){ toast(t('missed'), 'bad'); } riders.forEach(p => { p.dest = st.i + 1; p.angry = true; }); G.comfort -= 6 * riders.length; G.T.missed++; st.missed = true; st.served = true; st.waiting = []; G.nextIdx++; refreshTrack(); }
  }
 }
 // ----- rest houses -----
 for (const r of W.rests){ if (r.used) continue;
  if (Math.abs(car.x - r.x) < 14 && stopped && !G.rest) openRest(r);
  if (car.x > r.x + 22){ r.used = true; G.comfort -= 10; refreshTrack(); }
  if (!G.warned['r' + r.x] && r.x - car.x < 260 && r.x > car.x){ G.warned['r' + r.x] = 1; toast(t('restAhead') + ': ' + nm(r.name), 'gold'); } }
 // ----- police checkpoint (كمين) with the animated traffic officer -----
 for (const c of W.cps){
  const d = c.x - front;
  if (c.state === 'idle' && d < 60 && d > 0){ c.state = 'signal'; c.t = 0; toast(t('cpAhead'), 'bad'); AU.whistle(); }
  if (c.state === 'signal'){ c.t += dt; c.oFrame = Math.min(4, 2 + Math.floor(c.t * 3)); c.oFace = -1;
   if (d < 18 && d > 4 && stopped){ c.state = 'check'; c.t = 0; G.cp = c; c.plan = typeof cpPlan === 'function' ? cpPlan(c) : null; say(pick(DLG.officer.slice(0, G.belt ? 1 : 2)), c.ox, terrH(c.ox) + 3.1, '#ffd35a'); }
   else if (d < 3){ c.state = 'done'; addFine('run', true); c.oFrame = 6; } }
  else if (c.state === 'check'){ c.t += dt; c.oFrame = c.t < .5 ? 1 : 7; c.oFace = 1; 
   if (c.t > (c.plan ? c.plan.dur : 1.8)){ c.state = 'done'; c.doneT = 0; G.cp = null; const fs = [];  if (G.tod === 'night' && !car.headOn) fs.push('lights'); if (G.doorOpen) fs.push('door'); if (!G.test && Date.now() - GV(G.vid).inspT > 14 * DAY) fs.push('insp'); if (!G.test && (S.lic.suspUntil > Date.now() || !hasLic(G.V.cls) || licExpired())) fs.push('lic'); if (!G.test && vlicExpired(G.vid)) fs.push('vlic');
    if (fs.length){ fs.forEach(k => addFine(k, false)); AU.whistle(); } else { toast(t('cpOk'), 'good'); G.T.pro++; } c.oFrame = 5; } }
  else if (c.state === 'done'){ if (d < -20) c.oFrame = 0; }
 }
 // ----- traffic lights -----
 for (const l of W.lights){ const line = l.x - 3.2, s = lightState(l);
  if (!l.warned && line - front < 70 && line > front){ l.warned = 1; if (s !== 'g') toast(t('redAhead'), 'gold'); }
  if (!l.ran && front > line && front - car.vx * dt <= line){ if (s === 'r'){ l.ran = true; addFine('red', true); } } }
 // ----- fuel stations -----
 let nearGas = null; for (const g of W.gas) if (Math.abs(car.x - g.x) < 12 && stopped) nearGas = g;
 const pr = $('#prompt'); if (nearGas && !G.rest && !G.test){ const need = Math.max(0, G.fuelMax - G.fuel), cost = Math.ceil(need * DIESEL); pr.style.display = 'flex'; $('#promptTxt').textContent = t('refuel') + ' — ' + fmt(need, 1) + ' L · ' + money(cost); pr.onclick = () => { if (spend(cost, t('fix_fuel'), 'fuel')){ G.fuel = G.fuelMax; toast(t('refueled'), 'good'); pr.style.display = 'none'; } }; } else pr.style.display = 'none';
 // ----- speed cameras -----
 for (const r of W.radars){ r.flash = Math.max(0, (r.flash || 0) - dt);
  if (!r.warn && r.x - car.x < 220 && r.x > car.x){ r.warn = 1; toast(t('radar') + ' — ' + t('limit') + ' ' + fmt(r.limit) + ' ' + t('kmh'), 'gold'); }
  if (!r.done && car.x > r.x){ r.done = true; if (spd * 3.6 > r.limit + 3){ r.flash = .25; addFine('radar', true); AU.noiseHit(.1, 6000, .3); } } }
 // ----- potholes → flat tyres -----
 for (const hx of W.holes){ if (G.holesHit.has(hx)) continue; for (const w of car.wh) if (Math.abs(w.x - hx) < .5 && spd > 8){ G.holesHit.add(hx); const p = (.008 + (100 - (G.test ? 100 : GV(G.vid).cond.tyres)) / 2600) * (1 - .15 * (G.test ? 0 : upl(G.vid, 'tires'))); if (Math.random() < p && !w.flat){ w.flat = true; w.r = w.r0 * .9; toast(t('flat'), 'bad'); AU.noiseHit(.6, 2500, .4, 0, 'highpass'); } } }
 // ----- pedestrian crossing -----
 if (G.pedX){ const p = G.pedX; p.k += dt / 5.5; p.d += dt * 1.2; if (p.k >= 1){ if (!p.bad){ toast(t('pedOk'), 'good'); G.T.pro++; say(pick(DLG.ped), p.x, terrH(p.x) + 2.4); } G.pedX = null; }
  else if (p.k > .25 && p.k < .85 && front > p.x - .6 && car.x - car.L / 2 < p.x && !p.bad){ p.bad = true; addFine('ped', false); G.comfort -= 15; p.k = .9; } }
 // ----- side stop requests -----
 if (G.side){ G.side.t -= dt; if (stopped && G.doorOpen){ const p = G.side.p, idx = G.onboard.indexOf(p); if (idx >= 0){ G.onboard.splice(idx, 1); G.T.delivered++; const tip = Math.round(G.route.fare * .5 + 2); G.T.tips += tip; floatTxt(car.x, car.y + 2, '+' + fmt(tip), '#7CFC9A'); AU.coin(); G.walkers.push({t:p.t, h:p.h, x:doorX(), y:0, ty:1.85, tx:doorX() - 5, spd:1.3, d:0, fade:true}); toast(t('sideOk'), 'good'); } G.side = null; } else if (G.side.t <= 0){ G.comfort -= 8; G.side = null; } }
 // ----- random events -----
 G.evT -= dt; if (G.evT <= 0){ G.evT = 18 + Math.random() * 20; randomEvent(); }
 // ----- ambulance behind -----
 if (G.ambEv){ const a = G.ambEv.car; if (!a || a.gone){ G.ambEv = null; } else { const gap = car.x - car.L / 2 - (a.x + a.L / 2); if (gap < 18 && !G.ambEv.told){ G.ambEv.told = 1; toast(t('amb'), 'bad', null, 6); } if (G.ambEv.told){ G.ambEv.t += dt; if (spd < 1.2 && !G.ambEv.ok){ G.ambEv.ok = true; a.laneTo = 1; a.tgt = 19; toast(t('ambOk'), 'good'); G.T.pro += 2; S.xp += 20; } if (G.ambEv.t > 9 && !G.ambEv.ok && !G.ambEv.fined){ G.ambEv.fined = true; a.laneTo = 1; } } } }
}
function randomEvent(){
 const car = G.car, V = G.V, opts = [], nx = W.stops[G.nextIdx], far = nx && nx.x - car.x > 140;
 if (V.cls !== 'coach' && G.onboard.length > 2 && far) opts.push('side');
 if (V.cls !== 'coach' && G.onboard.length > 0) opts.push('change');
 if (W.biome.urban > .3 && !G.pedX) opts.push('ped', 'ped');
 if (!G.ambEv) opts.push('amb');
 if (G.onboard.length && !G.ac && G.cabin > 30) opts.push('hot');
 if (G.onboard.length && radioAudible()) opts.push(S.set.radio > .85 ? 'loud' : STATIONS[S.radio.st].g === 'calm' ? 'calmR' : 'like');
 if (!opts.length) return; const e = pick(opts);
 if (e === 'side'){ G.side = {p:pick(G.onboard), t:10}; toast(t('sideStop'), 'gold', null, 5); }
 else if (e === 'change') toast(t('change'), '', [[t('giveChange'), () => { G.comfort = Math.min(100, G.comfort + 4); }], [t('askPax'), () => { G.comfort -= 3; }]], 6);
 else if (e === 'ped'){ const x = car.x + car.L / 2 + 28 + Math.random() * 20; if (W.stops.some(s => Math.abs(s.x - x) < 15)) return; G.pedX = {x, k:0, d:0, t:(Math.random() * META.peds.length) | 0, h:1.65}; toast(t('ped'), 'bad'); }
 else if (e === 'amb'){ const spec = pick(AI_EMG); const a = spawnAI(spec, 0, car.x - car.L / 2 - 70, 1, {fast:true}); if (a){ a.siren = AIV[spec].siren; a.amb = true; a.special = 'amb'; G.ambEv = {car:a, t:0}; } }
 else if (e === 'hot') toast(t('hot'), 'gold');
 else if (e === 'loud') toast(t('loud'), 'gold');
 else if (e === 'calmR'){ say(pick(DLG.calm), G.car.x, G.car.y + G.car.yt + .9); G.comfort = Math.min(100, G.comfort + 4); }
 else if (e === 'like'){ toast(t('likeRadio'), 'good'); G.comfort = Math.min(100, G.comfort + 5); }
}
function addFine(k, camera){
 if (G.test) { toast(t('f' + k[0].toUpperCase() + k.slice(1)), 'bad'); return; }
 const amt = FINE[k], label = t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', vlic:'fVlic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed'}[k]);
 if (camera){ S.fines.push({k, amt, t:Date.now(), where:nm(W.route.from) + ' → ' + nm(W.route.to)}); S.lic.points += PTS[k] || 0; if (S.lic.points >= 12 && S.lic.suspUntil < Date.now()){ S.lic.suspUntil = Date.now() + DAY; } }
 else { G.T.fines += amt; G.T.fineList.push(label); S.lic.points += PTS[k] || 0; }
 S.stats.fines += amt; save(); toast('🚨 ' + label + ' — ' + money(amt), 'bad'); AU.whistle();
}
function setDoor(open){ if (G.doorOpen === open) return; G.doorOpen = open; AU.door(G.V.cls !== 'micro'); if (open) G.queueT = .35;  }
function serveStop(st){
 const car = G.car, V = G.V, last = st.i === W.stops.length - 1, fast = V.cls === 'coach' ? .07 : V.cls === 'bus' ? .2 : .32;
 // parcels for this stop
 const pc = G.parcels.find(p => p.on && (p.dest === st.i || (last && p.dest >= st.i))); if (pc){ pc.on = false; const pay = pc.broken ? Math.round(pc.pay * .4) : pc.pay; G.T.cargo += pay; floatTxt(doorX(), car.y + 2.6, '📦 +' + fmt(pay), '#FFD24A'); toast(t('parcelOk'), 'good'); AU.coin(); G.queueT = .5; return; }
 const off = G.onboard.findIndex(p => p.dest <= st.i || last);
 if (off >= 0){ const p = G.onboard.splice(off, 1)[0]; G.T.delivered++; if (Math.random() < .45) say(pick(p.angry || G.comfort < 45 ? DLG.alightBad : DLG.alightGood), doorX(), car.y + car.yt + .6);
  if (!p.angry && G.comfort > 55){ const bodyK = G.test ? 1 : .6 + .4 * GV(G.vid).cond.body / 100; const tip = V.cls === 'coach' ? Math.round((G.comfort - 55) / 45 * 20 * bodyK) : Math.round((G.comfort - 55) / 45 * 3 * 2 * bodyK) / 2; if (tip > 0){ G.T.tips += tip; floatTxt(doorX(), car.y + 2.2, '+' + fmt(tip, tip % 1 ? 1 : 0), '#7CFC9A'); } }
  G.walkers.push({t:p.t, h:p.h, x:doorX(), y:.1, ty:1.85, tx:doorX() + (Math.random() < .5 ? -1 : 1) * (4 + Math.random() * 4), spd:1.2 + Math.random() * .4, d:0, fade:true});
  G.queueT = fast; return; }
 if (!last && st.waiting.length && G.onboard.length < seatsOf(V)){
  const p = st.waiting.shift(); G.onboard.push(p); if (Math.random() < .3) say(pick(DLG.board), doorX(), car.y + car.yt + .6);
  if (V.cls === 'coach'){ G.T.fares += G.route.fare; if (G.onboard.length % 7 === 0){ floatTxt(doorX(), car.y + 2.4, '+' + fmt(G.route.fare * 7), '#FFD24A'); AU.coin(); } }
  else { G.T.fares += G.route.fare; floatTxt(doorX(), car.y + 2.4, '+' + fmt(G.route.fare, G.route.fare % 1 ? 1 : 0), '#FFD24A'); AU.coin(); }
  G.walkers.push({t:p.t, h:p.h, x:st.x - 2, y:1.8, ty:.2, tx:doorX(), spd:2, d:0, fade:true});
  G.queueT = fast; return; }
 st.served = true; setDoor(false); G.nextIdx++; G.dwell = 0; refreshTrack();
 if (last) finishLine(false); else { const nx = W.stops[G.nextIdx]; toast(t('next') + ': ' + nm(nx.name), 'gold'); }
}
/* ---------- AI traffic (uploaded vehicles, full physics) ---------- */
function spawnAI(spec, lane, x, dir){
 const A = AIV[spec]; const geom = vehGeom(A.spr, A.len, dir < 0);
 const c = makeCar({geom, mass:A.mass, acc:3, vmax:25, f:A.small ? 2.2 : 1.7, travel:.14, x, vx:0});
 c.tgt = rnd(A.v[0], A.v[1]) * dir; c.vx = c.tgt * .8; c.wh.forEach(w => { w.vx = c.vx; w.om = c.vx / w.r; });
 c.spec = spec; c.lane = lane; c.lift = lane ? .82 : 0; c.laneTo = lane; c.dir = dir; c.cv = spriteCanvas(A.spr); c.dents = []; c.stopT = 0; c.headOn = G.tod === 'night';
 G.ai.push(c); return c;
}
function updateAI(dt){
 const car = G.car, urban = W.biome.urban, dens = G.mode === 'attract' ? .6 : urban > .5 ? 1 : urban > .1 ? .7 : .45;
 const [x0, x1] = viewX();
 // spawn
 const near = G.ai.filter(a => a.lane === 0 && !a.amb && a.x > car.x), far = G.ai.filter(a => a.lane === 1);
 if (near.length < Math.round(2 * dens) && Math.random() < dt * .5 && G.mode !== 'attract'){ const x = x1 + rnd(10, 60); if (x < W.len - 60 && !W.stops.some(s => Math.abs(s.x - x) < 30)) spawnAI(pick([0,1,2,3,4,7,0,1,2,8,9,5,6]), 0, x, 1); }
 if (far.length < Math.round(4 * dens) && Math.random() < dt * 1.1){ if (Math.random() < .7) spawnAI(pick([0,1,2,3,4,5,6,7,8,9,0,1,2,3]), 1, x1 + rnd(5, 40), -1); else spawnAI(pick([1,3,5,6,7,0]), 1, x0 - rnd(5, 30), 1); }
 const n = Math.min(12, Math.ceil(dt * 240)), h = dt / n;
 for (let i = G.ai.length - 1; i >= 0; i--){ const a = G.ai[i];
  // driver model: target speed, gap keeping, lights, random pull-overs
  let v = a.tgt;
  if (a.lane === 0 && a.dir > 0){
   let lead = null, gap = 1e9; for (const b of [...G.ai, car]) if (b !== a && (b.lane || 0) === 0 && b.x > a.x){ const gg = b.x - b.L / 2 - (a.x + a.L / 2); if (gg < gap){ gap = gg; lead = b; } }
   if (lead){ v = Math.min(v, Math.max(0, (gap - 2.5) * .8 + (lead.vx || 0) * .5)); if (lead === car && gap < 12 && a.amb) v = Math.min(v, car.vx); }
   for (const l of W.lights){ const line = l.x - 3.2, d = line - (a.x + a.L / 2); if (d > -.5 && d < 30 && lightState(l) !== 'g') v = Math.min(v, Math.max(0, d * .5)); }
   if (!a.amb && AIV[a.spec].name === 'taxi' && a.stopT <= 0 && Math.random() < dt * .02 && a.x > car.x + 30) { a.stopT = 5; a.haz = true; }
   if (a.stopT > 0){ a.stopT -= dt; v = 0; if (a.stopT <= 0) a.haz = false; }
   if (G.honked && a.x > car.x && a.x - car.x < 35 && !a.amb){ a.laneTo = 1; a.tgt = Math.max(a.tgt, 15); a.stopT = 0; a.haz = false; }
  }
  if (a.laneTo !== a.lane){ a.lift += (a.laneTo ? 1 : -1) * dt * .7; if (a.lift >= .82){ a.lift = .82; a.lane = 1; } }
  a.braking = Math.abs(v) < Math.abs(a.vx) - .5;
  for (let k = 0; k < n; k++) physStep(a, h, {aiV:v});
  if (a.siren && Math.floor(G.time * 3) !== a._s){ a._s = Math.floor(G.time * 3); if (Math.abs(a.x - car.x) < 80) AU.siren(a.siren, G.time); }
  // collisions with the player (same lane)
  if (a.lane === 0 && a.lift < .3 && G.mode === 'play'){ const rv = collide(car, a); if (rv > 1.5 && G.time - (a.hitT || -9) > .6){ a.hitT = G.time; const front = car.x < a.x; addDent(car, (front ? 1 : -1) * car.L * .46, car.yb + .4, rv * 1.4); addDent(a, (front ? -1 : 1) * a.L * .46, a.yb + .35, rv * 1.4); AU.thud(rv * 2); cam.shake = Math.min(1, rv / 6); G.comfort -= rv * 5;
    if (!G.test) { GV(G.vid).cond.body = clamp(GV(G.vid).cond.body - rv * 2.5 * car.armor, 0, 100); if (front) GV(G.vid).cond.engine = clamp(GV(G.vid).cond.engine - rv * .6, 0, 100); }
    for (let k = 0; k < 10; k++) puff(front ? car.x + car.L / 2 : car.x - car.L / 2, car.y, rnd(-3, 3), rnd(0, 4), .5, .04, '#FFD24A', 'spark'); if (rv > 3 && front && !a.amb){ toast(t('crashAI'), 'bad'); addFine('crash', false); G.T.hits++; S.stats.crashes++; } } }
  if (a.x < car.x - 160 || a.x > car.x + 260 || Math.cos(a.a) < 0){ a.gone = true; G.ai.splice(i, 1); }
 }
 G.honked = false;
}
/* ---------- rest houses (coach) ---------- */
const REST_OPTS = [
 {k:'tea', i:'wash', n:['شاي ليك يا أسطى','Tea for you'], p:10, fx:() => { G.alert = Math.min(100, G.alert + 45); }},
 {k:'meal', i:'cash', n:['وجبة فول وطعمية','Foul & falafel meal'], p:60, fx:() => { G.alert = 100; }},
 {k:'round', i:'seat', n:['شاي للركاب على حسابك','Tea round for passengers'], p:() => G.onboard.length * 8, fx:() => { G.comfort = Math.min(100, G.comfort + 25); }},
 {k:'fix', i:'tyre', n:['تصليح الكاوتش','Fix flat tyres'], p:150, fx:() => { G.car.wh.forEach(w => { w.flat = false; w.r = w.r0; }); }},
 {k:'fuel', i:'fuel', n:['فوّل التانك','Refuel'], p:() => Math.ceil((G.fuelMax - G.fuel) * DIESEL), fx:() => { G.fuel = G.fuelMax; }},
 {k:'wash', i:'wash', n:['غسيل سريع','Quick wash'], p:60, fx:() => { if (!G.test){ GV(G.vid).cond.clean = 100; G.car.cv = buildPlayerCanvas(G.vid, GV(G.vid).cos, GV(G.vid).cond, GV(G.vid).dents); } }}
];
function openRest(r){ r.used = true; setDoor(true); G.rest = {r, t:60, out:[], called:false, bought:{}};
 const n = Math.min(10, G.onboard.length); for (let k = 0; k < n; k++){ const p = G.onboard[k]; const w = {t:p.t, h:p.h, x:doorX(), y:.1, ty:1.85, tx:r.x + 2 + k * .9, spd:1.5, d:0, stay:true}; G.walkers.push(w); G.rest.out.push(w); }
 renderRest(); $('#restM').classList.add('on'); refreshTrack(); }
function renderRest(){ const R = G.rest; if (!R) return; $('#restName').textContent = nm(R.r.name);
 $('#restOpts').innerHTML = REST_OPTS.map(o => { const p = typeof o.p === 'function' ? o.p() : o.p; return `<button class="ropt ${R.bought[o.k] ? 'done' : ''}" data-k="${o.k}">${icon(o.i)}<b>${nm(o.n)}</b><span>${R.bought[o.k] ? '✓' : money(p)}</span></button>`; }).join('');
 $$('#restOpts .ropt').forEach(b => b.onclick = () => { const o = REST_OPTS.find(q => q.k === b.dataset.k); if (R.bought[o.k]) return; const p = typeof o.p === 'function' ? o.p() : o.p; if (p <= 0 || G.test || spend(p, nm(o.n), o.i)){ R.bought[o.k] = 1; G.T.rest += 0; o.fx(); AU.coin(); renderRest(); } }); }
function tickRest(dt){ const R = G.rest; if (!R) return; R.t -= dt; $('#restT').textContent = fmt(Math.max(0, Math.ceil(R.t)));
 if ((R.t < 12 || R.called) && !R.back){ R.back = true; R.out.forEach(w => { w.tx = doorX(); w.ty = .1; w.stay = false; w.fade = true; }); }
 const allBack = R.back && R.out.every(w => !G.walkers.includes(w)); $('#rLeave').disabled = !allBack; if (R.t <= -8 && allBack) closeRest(); }
function closeRest(){ G.rest = null; setDoor(false); $('#restM').classList.remove('on'); G.alert = Math.max(G.alert, 60); }
/* ---------- trip end ---------- */
function finishLine(forced){ if (G.finished) return; G.finished = true; if (forced){ const left = G.onboard.length; if (left){ G.comfort -= 20; } G.onboard = []; } setTimeout(() => endRun('ok'), 900); }
function endRun(reason){
 if (G.ended) return; G.ended = true; AU.engine(false, 0, 0, 0); const T = G.T, V = G.V, route = G.route, test = G.test;
 const comfortAvg = T.comfortN ? T.comfortSum / T.comfortN : G.comfort; const ok = reason === 'ok';
 const stars = !ok ? 0 : 1 + (comfortAvg > 70 ? 1 : 0) + (T.missed === 0 && T.fines === 0 && T.hits === 0 ? 1 : 0);
 const cargo = T.cargo, tow = !ok && reason !== 'fuel' ? 500 : reason === 'fuel' ? 200 : 0;
 const net = T.fares + T.tips + cargo - T.fines - T.fee - tow;
 const xp = Math.round((T.delivered * 3 + T.meters / 40 + stars * 25 + T.pro * 6) * (ok ? 1 : .4));
 const R = {reason, fares:T.fares, tips:T.tips, cargo, fuelL:T.fuelL, fuel:Math.round(T.fuelL * DIESEL), fee:T.fee, fines:T.fines, fineList:T.fineList, tow, net, stars, xp, comfort:Math.round(comfortAvg), delivered:T.delivered, test};
 if (!test){
  const lv0 = lvlOf(S.xp).l; S.xp += xp; R.lvUp = lvlOf(S.xp).l > lv0;
  if (T.fee) ledger(-T.fee, t('r_fee') + ' · ' + nm(route.from), 'terminal');
  if (T.fares + T.tips > 0) ledger(T.fares + T.tips, t('r_fares') + ' · ' + nm(route.from) + ' → ' + nm(route.to), 'ticket');
  if (cargo) ledger(cargo, t('r_cargo'), 'terminal'); if (T.fines) ledger(-T.fines, t('r_fines'), 'police'); if (tow) ledger(-tow, t('towing'), 'crash');
  const gv = GV(G.vid); gv.fuel = G.fuel; gv.odo += G.odo; const km1 = T.meters / 1000;
  gv.cond.oil = clamp(gv.cond.oil - km1 * 1.6, 0, 100); gv.cond.tyres = clamp(gv.cond.tyres - km1 * 1.1, 0, 100); gv.cond.brakes = clamp(gv.cond.brakes - km1 * 1.3, 0, 100); gv.cond.clean = clamp(gv.cond.clean - km1 * (G.weather === 'clear' ? 4 : 9), 0, 100);
  if (G.cond.oil < 15) gv.cond.engine = clamp(gv.cond.engine - 4, 0, 100);
  S.stats.km += G.odo; S.stats.trips += ok ? 1 : 0; S.stats.pax += T.delivered; if (T.comfortN){ const r5 = 1 + comfortAvg / 25; S.stats.rating = (S.stats.rating * S.stats.ratingN + r5) / (S.stats.ratingN + 1); S.stats.ratingN++; }
  if (ok) S.best[route.id] = Math.max(S.best[route.id] || 0, stars);
  missionProgress({pax:T.delivered, trips:ok ? 1 : 0, earn:Math.max(0, net), stars3:stars === 3 ? 1 : 0, clean:ok && T.fines === 0 && T.hits === 0 ? 1 : 0, km:G.odo});
  checkBadges(); save(true);
 }
 setTimeout(() => showReceipt(R), reason === 'ok' ? 200 : 1200);
 if (reason !== 'ok'){ AU.crash(); const m = $('#crashM'); $('#crashT').textContent = t(reason === 'crash' ? 'crashEnd' : reason === 'fuel' ? 'fuelEnd' : 'brokeEnd'); m.classList.add('on'); setTimeout(() => m.classList.remove('on'), 1150); }
}

/* ======================= realism.js ======================= */
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
  set(n.fan, G.fan ? G.fan * .009 : 0, .3); set(n.cabin, G.engOn ? .05 : 0);
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
 const pool = urban > .4 ? ['bOld','bNew','bPharm','bKosh','bMarket','bTrans','bNew','bOld','bHosp','bSchool'] : ['bWare','bKosh','bMarket','bTrans'];
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
 const src = car.cv || IMG[car.spr], sw = src.width, shh = src.height, baked = car.whRim != null ? false : (!car.player || (G.V && car.player && G.V.baked) || car.baked);
 const ca = Math.cos(-car.a), sa = Math.sin(-car.a), mk = car.mirror ? -k : k;
 const P = (px, py) => { const u = (px - sw / 2) * mk, v = (py - shh / 2) * k; return [X + u * ca - v * sa, Y + u * sa + v * ca]; };
 // contact + directional shadow onto the road
 if (opt.shadow !== false && S.set.gfx !== 'low') dirShadow(car, src, X, sy(terrH(car.x) + lift), sw, shh, mk, k); const gy = sy(terrH(car.x) + lift); contactShadow(car, lift, sc);
 
 if (car.glow){ const gr = ctx.createRadialGradient(X, gy, 0, X, gy, car.L * .6 * PPM); gr.addColorStop(0, car.glow + 'cc'); gr.addColorStop(1, car.glow + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(X, gy, car.L * .62 * PPM, PPM * .5, 0, 0, 7); ctx.fill(); }
 // player wheels (separate sprites, visible suspension travel)
 if (!baked && !(META[car.spr] && META[car.spr].wf)) car.wh.forEach(w => { const r = w.r * PPM * sc, wx = X + (w.x - car.x) * PPM * sc, wy = Y - (w.y - car.y) * PPM * sc; ctx.save(); ctx.translate(wx, wy); if (w.flat) ctx.scale(1, .86); ctx.rotate(w.rot); const wr = car.whRim ?? car.rim, im = typeof rimImg === 'function' ? rimImg(wr, car.player ? car.rimc : null) : IMG['wh' + wr], q = WQ(wr); ctx.drawImage(im, -r * q, -r * q, r * 2 * q, r * 2 * q); ctx.restore(); });
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

/* ======================= ui.js ======================= */
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
  const ks = ['body','engine','rad','gbx','susp','tyres','rim','brakes','oil','clean','fuel']; for (const q of ['rad','gbx','rim']) if (g.cond[q] == null) g.cond[q] = 100;
  body = ks.map(k => { const v = k === 'fuel' ? g.fuel / (V.tank * (1 + .2 * (g.up.tank || 0))) * 100 : g.cond[k], c = repairCost(V, k, g); return `<div class="set"><label>${icon({body:'crash', engine:'engine', rad:'engine', gbx:'upgrade', rim:'tyre', susp:'repair', tyres:'tyre', brakes:'crash', oil:'battery', clean:'wash', fuel:'fuel'}[k])}${t('c_' + k)}</label><div class="sp">${bar(v)}</div><span style="width:3rem">${fmt(pct(v))}%</span><button class="btn sm" data-fix="${k}" ${c <= 0 ? 'disabled' : ''}>${t('fix_' + k)} · ${money(c)}</button></div>`; }).join('') + `<div class="mbtns"><button class="btn" id="fixAll">${icon('repair')} ${t('repair')} ✱</button></div>`;
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

/* ======================= cockpit.js ======================= */
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

/* ======================= dmv-profile.js ======================= */
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

/* ======================= streets.js ======================= */
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

/* ======================= services.js ======================= */
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

/* ======================= premium.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v7 — premium pass
   pause-aware audio · realistic horns & sirens · roadside signs ·
   shops & market · passengers in the windows · real window tint ·
   fire / falling parts / smoke types · more cosmetics · fatigue ·
   combos, perfect stops, VIPs, rush hour · dev mode · anti-cheat
   ===================================================================== */
const h32 = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/* ---------------- pause silences everything ---------------- */
function audioPause(p){ try{ if (AU.ctx) p ? AU.ctx.suspend() : AU.ctx.resume(); }catch(e){} try{ if (RADIO.el && RADIO.el.src){ if (p) RADIO.el.pause(); else if (G.radioOn) RADIO.el.play().catch(() => {}); } }catch(e){} }
const _pause7 = pause;
pause = function(on){ _pause7(on); audioPause(!!G.paused); };
const _toMenu7 = toMenu;
toMenu = function(scr){ audioPause(false); _toMenu7(scr); SIREN.kill(); };
/* ---------------- realistic horns ---------------- */
AU.hornVoice = function(freqs, dur, kind){ const c = this.ctx; if (!c) return; const t0 = c.currentTime, air = kind === 'air';
 const out = c.createGain(); out.gain.setValueAtTime(.0001, t0); out.gain.exponentialRampToValueAtTime(air ? .26 : .2, t0 + (air ? .09 : .012)); out.gain.setValueAtTime(air ? .26 : .2, t0 + dur - (air ? .15 : .04)); out.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
 const ws = c.createWaveShaper(), cv2 = new Float32Array(2048); for (let i = 0; i < 2048; i++){ const x = i / 1024 - 1; cv2[i] = Math.tanh(x * (air ? 2.2 : 4.5)); } ws.curve = cv2;
 const f1 = c.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = air ? 780 : 2300; f1.Q.value = 1.4; f1.gain.value = 9;
 const f2 = c.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = air ? 1650 : 3400; f2.Q.value = 2; f2.gain.value = 6;
 const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = air ? 3200 : 6000;
 const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = air ? 90 : 250;
 // diaphragm buzz (car horns rattle at ~110 Hz)
 const am = c.createGain(); am.gain.value = 1; const lfo = c.createOscillator(); lfo.frequency.value = air ? 18 : 112; const lg = c.createGain(); lg.gain.value = air ? .08 : .22; lfo.connect(lg).connect(am.gain);
 ws.connect(am).connect(hp).connect(f1).connect(f2).connect(lp).connect(out).connect(this.sfxG);
 freqs.forEach((f, i) => { const o = c.createOscillator(); o.type = air ? 'sawtooth' : 'square'; o.frequency.setValueAtTime(f * (air ? .93 : 1.02), t0); o.frequency.exponentialRampToValueAtTime(f, t0 + (air ? .18 : .03)); const g = c.createGain(); g.gain.value = .38; o.connect(g).connect(ws); o.start(t0); o.stop(t0 + dur + .05); });
 lfo.start(t0); lfo.stop(t0 + dur + .05); if (air) this.noiseHit(dur * .9, 3200, .05, 0, 'bandpass', .7);
};
AU.horn = function(kind, big){ if (!this.ctx) return;
 const seq = (notes, step, len) => notes.forEach((f, i) => setTimeout(() => this.hornVoice([f, f * 1.21], len, 'car'), i * step));
 if (kind === 'melody') return seq([659,784,988,784,659,988], 135, .13);
 if (kind === 'cuca') return seq([392,392,392,523,659,0,392,392,392,523,659].filter(Boolean), 125, .11);
 if (kind === 'mahr') return seq([440,440,523,440,587,523,440], 100, .09);
 if (kind === 'air' || big) this.hornVoice([185, 233, 277], .85, 'air'); else this.hornVoice([410, 510], .45, 'car');
};
/* continuous, distance- and doppler-aware sirens (replaces beeps) */
const SIREN = { v:new Map(),
 kill(){ this.v.forEach(s => { try{ s.g.gain.setTargetAtTime(0, AU.ctx.currentTime, .05); s.o.stop(AU.ctx.currentTime + .3); }catch(e){} }); this.v.clear(); },
 update(){ const c = AU.ctx; if (!c || G.mode !== 'play' || G.paused){ return; } const car = G.car, live = new Set();
  for (const a of G.ai){ if (!a.siren) continue; const d = Math.abs(a.x - car.x); if (d > 220) continue; live.add(a); let s = this.v.get(a);
   if (!s){ const o = c.createOscillator(); o.type = 'sawtooth'; const ws = c.createWaveShaper(), cv2 = new Float32Array(1024); for (let i = 0; i < 1024; i++) cv2[i] = Math.tanh((i / 512 - 1) * 2.5); ws.curve = cv2; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = .8; const g = c.createGain(); g.gain.value = 0; const pan = c.createStereoPanner ? c.createStereoPanner() : c.createGain(); o.connect(ws).connect(bp).connect(g).connect(pan).connect(AU.sfxG); o.start(); s = {o, g, pan, ph:Math.random() * 6}; this.v.set(a, s); }
   const t = c.currentTime + s.ph; let f; if (a.siren === 'amb') f = (Math.floor(t * 1.3) % 2 ? 960 : 740); else { const w = (t % 4) / 4; f = 650 + 850 * (w < .5 ? w * 2 : 2 - w * 2); if (Math.floor(t / 8) % 2) f = 650 + 850 * Math.abs(Math.sin(t * 9)); }
   const rel = (a.vx - car.vx) * Math.sign(car.x - a.x); f *= 343 / (343 - clamp(rel, -40, 40));
   s.o.frequency.setTargetAtTime(f, c.currentTime, .02); s.g.gain.setTargetAtTime(.09 * Math.pow(clamp(1 - d / 220, 0, 1), 1.6), c.currentTime, .1); if (s.pan.pan) s.pan.pan.setTargetAtTime(clamp((a.x - car.x) / 60, -1, 1), c.currentTime, .1); }
  this.v.forEach((s, a) => { if (!live.has(a)){ s.g.gain.setTargetAtTime(0, c.currentTime, .1); try{ s.o.stop(c.currentTime + .4); }catch(e){} this.v.delete(a); } }); }
};
AU.siren = function(){};
/* ---------------- no more pedestrians crossing the street ---------------- */
randomEvent = function(){ _re5(); G.pedX = null; };
/* ---------------- shops as a service type + street & progress-bar signage ---------------- */
POI_T.store = {ic:'🛒', col:'#46e58f', n:['سوبر ماركت','Shop']};
const _v6w7 = v6world;
v6world = function(){ _v6w7(); const len = W.len, r = mulberry(W.seed + 3131), urban = W.biome.urban > .3;
 const clear = x => W.stops.every(s => Math.abs(s.x - x) > 45) && W.cps.every(c => Math.abs(c.x - x) > 45) && W.lights.every(l => Math.abs(l.x - x) > 35) && W.rests.every(q => Math.abs(q.x - x) > 60) && (!W.toll || Math.abs(W.toll.x - x) > 60) && !inWater(x) && W.poi.every(p => Math.abs(p.x - x) > 150);
 for (let t = 0; t < 40; t++){ const x = Math.round(len * (.25 + r() * .6)); if (clear(x)){ const k = urban ? 'sSuper' : 'sKiosk'; W.poi.push({type:'store', x, k}); const w = (BH5[k] || 8) * META[k].w / META[k].h; W.deco = W.deco.filter(d => d.x + d.w / 2 < x - w / 2 - .5 || d.x - d.w / 2 > x + w / 2 + .5); W.deco.push({k, x, h:BH5[k] || 8, w}); break; } }
 W.poi.sort((a, b) => a.x - b.x); };
const _svcOpt7 = svcOptions;
svcOptions = function(type){ if (type !== 'store') return _svcOpt7(type); return ITEMS.map(i => ({ic:i.ic, n:i.n, p:Math.round(i.p * 1.1), t:.4, item:i.id})); };
const _openSvc7 = openSvc;
openSvc = function(p){ if (p.type === 'store'){ G.svc = p; setDoor(false); say(L2('أهلاً يا أسطى، اتفضل', 'Welcome, driver — have a look'), p.x + 2, terrH(p.x) + 3.6, '#ffd35a'); renderSvc(); $('#svcM').classList.add('on'); return; } _openSvc7(p); };
function drawServiceSigns(){
 if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), car = G.car, t = G.time;
 const items = (W.poi || []).map(p => ({x:p.x, ic:POI_T[p.type].ic, n:nm(POI_T[p.type].n), col:POI_T[p.type].col})).concat(W.rests.filter(q => !q.used).map(q => ({x:q.x, ic:'🍽', n:nm(q.name), col:'#2fd07a'})));
 for (const it of items){
  // advance sign 120 m before
  const sx0 = it.x - 120; if (sx0 > x0 - 5 && sx0 < x1 + 5){ const X = sx(sx0), Y = sy(terrH(sx0) + 1.9), h = PPM * 3.2, bw = clamp(PPM * 1.9, 60, 110), bh = bw * .62;
   ctx.fillStyle = '#6f7882'; ctx.fillRect(X - PPM * .06, Y - h, PPM * .12, h); ctx.fillStyle = '#1554a8'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - bw / 2, Y - h - bh, bw, bh, 5) : ctx.rect(X - bw / 2, Y - h - bh, bw, bh); ctx.fill(); ctx.stroke();
   ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${bh * .42}px sans-serif`; ctx.fillStyle = '#fff'; ctx.fillText(it.ic, X - bw * .22, Y - h - bh * .52); ctx.font = `700 ${bh * .28}px "Readex Pro", sans-serif`; ctx.fillText('120m ↑', X + bw * .17, Y - h - bh * .5); }
  // floating label over the building itself
  if (it.x > x0 - 10 && it.x < x1 + 10){ const d = Math.round(it.x - car.x), X = sx(it.x), Y = sy(terrH(it.x) + 10.5 + Math.sin(t * 1.8 + it.x) * .12); ctx.save(); ctx.font = `700 ${clamp(PPM * .38, 12, 17)}px "Readex Pro", sans-serif`; const lab = `${it.ic} ${it.n}` + (Math.abs(d) > 12 ? `  ·  ${d > 0 ? d + ' m' : ''}` : ''), w = ctx.measureText(lab).width + 26, h = clamp(PPM * .7, 26, 34);
   ctx.fillStyle = 'rgba(10,20,44,.9)'; ctx.strokeStyle = it.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X - w / 2, Y - h, w, h, h / 2) : ctx.rect(X - w / 2, Y - h, w, h); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(X - 7, Y); ctx.lineTo(X, Y + 8); ctx.lineTo(X + 7, Y); ctx.fillStyle = it.col; ctx.fill();
   ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, X, Y - h / 2); ctx.restore(); } }
}
const _dw7 = drawWorld;
drawWorld = function(){ _dw7(); drawServiceSigns(); drawDebris(); };
const _bt7 = buildTrack;
buildTrack = function(){ _bt7(); const tr = $('#track'), pos = x => clamp(x / W.len * 100, 0, 100); tr.querySelectorAll('.tic').forEach(e => e.remove()); let h = '';
 const add = (x, ic, col, n) => { h += `<i class="tic" style="left:${pos(x)}%;--c:${col}" title="${n}">${ic}</i>`; };
 for (const p of W.poi || []) add(p.x, POI_T[p.type].ic, POI_T[p.type].col, nm(POI_T[p.type].n)); for (const q of W.rests) add(q.x, '🍽', '#2fd07a', nm(q.name)); if (W.toll) add(W.toll.x, '🛣', '#9ad', 'Toll'); for (const c of W.cps) add(c.x, '👮', '#3d7bff', 'Police');
 tr.insertAdjacentHTML('beforeend', h); };
/* ---------------- falling parts, fire, smoke types ---------------- */
const DEBRIS = [];
const _ad7 = addDent;
addDent = function(car, lx, ly, sev, glass){ _ad7(car, lx, ly, sev, glass); if (G.mode === 'play' && sev > 7 && car.cv){ spawnDebris(car, lx, ly, sev); if (car === G.car && sev > 12 && Math.random() < .35) igniteFire(); } };
function spawnDebris(car, lx, ly, sev){ if (!car.cv || DEBRIS.length > 40) return; const cvw = car.cv.width, cvh = car.cv.height, u = clamp((car.mirror ? -lx : lx) / car.g.len + .5, .03, .97), v = clamp(.5 - ly / car.g.h, .1, .9);
 const n = sev > 11 ? 3 : sev > 8 ? 2 : 1; for (let i = 0; i < n; i++){ const pw = Math.round(cvw * (.05 + Math.random() * .05)), ph = Math.round(cvh * (.05 + Math.random() * .07)), px = clamp(Math.round(u * cvw + (Math.random() - .5) * cvw * .06 - pw / 2), 0, cvw - pw), py = clamp(Math.round(v * cvh + (Math.random() - .5) * cvh * .1 - ph / 2), 0, cvh - ph);
  const c = document.createElement('canvas'); c.width = pw; c.height = ph; const x = c.getContext('2d'); x.drawImage(car.cv, px, py, pw, ph, 0, 0, pw, ph);
  const cx = car.cv.getContext('2d'); cx.save(); cx.globalCompositeOperation = 'destination-out'; cx.beginPath(); cx.ellipse(px + pw / 2, py + ph / 2, pw * .45, ph * .45, Math.random(), 0, 7); cx.fill(); cx.restore(); SILC.delete(car.cv);
  const ca = Math.cos(car.a), sa = Math.sin(car.a), wx = car.x + lx * ca - ly * sa, wy = car.y + lx * sa + ly * ca;
  DEBRIS.push({c, x:wx, y:wy, vx:car.vx * .6 + (Math.random() - .5) * 4 + (lx > 0 ? 2 : -2), vy:2 + Math.random() * 3, a:0, w:(Math.random() - .5) * 12, s:car.g.s, life:30}); } }
function updDebris(dt){ for (let i = DEBRIS.length - 1; i >= 0; i--){ const d = DEBRIS[i]; d.life -= dt; if (d.life <= 0 || d.x < G.car.x - 200){ DEBRIS.splice(i, 1); continue; } d.vy -= 9.8 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.a += d.w * dt; const gy = terrH(d.x) + .15; if (d.y < gy){ d.y = gy; d.vy = -d.vy * .25; d.vx *= .6; d.w *= .5; if (Math.abs(d.vy) < .5) d.vy = 0; } } }
function drawDebris(){ for (const d of DEBRIS){ const X = sx(d.x), Y = sy(d.y); if (X < -80 || X > VW + 80) continue; const k = PPM * d.s; ctx.save(); ctx.translate(X, Y); ctx.rotate(-d.a); ctx.globalAlpha = clamp(d.life / 3, 0, 1); ctx.drawImage(d.c, -d.c.width * k / 2, -d.c.height * k / 2, d.c.width * k, d.c.height * k); ctx.restore(); } }
TX.fireEnd = ['المركبة ولعت!','The vehicle burned out!'];
function engineBay(){ const car = G.car, rear = G.V.cls !== 'micro'; const lx = (rear ? -1 : 1) * car.L * .4, ly = car.yb + (car.yt - car.yb) * .35, ca = Math.cos(car.a), sa = Math.sin(car.a); return [car.x + lx * ca - ly * sa, car.y + lx * sa + ly * ca]; }
function igniteFire(){ if (G.fire > 0 || G.test || S.devGod) return; G.fire = .3; G.fireT = 0; AU.crash(); toastUI('🔥 ' + L2('حريقة في الموتور! طفّيها بالطفاية', 'Engine fire! Use the extinguisher'), 'bad', inv().ext ? [[L2('🧯 طفّي', '🧯 Extinguish'), extinguish]] : null, 8); if (G.onboard.length) say(L2('حريقة!! افتح الباب!', 'FIRE!! Open the door!'), G.car.x, G.car.y + G.car.yt + 1, '#ff9aa4'); }
function extinguish(){ if (!(G.fire > 0)) return; const b = inv(); if (!b.ext){ toastUI(L2('مفيش طفاية!', 'No extinguisher!'), 'bad'); return; } b.ext--; save(); G.fire = 0; const [ex, ey] = engineBay(); for (let i = 0; i < 60; i++) puff(ex + rnd(-1, 1), ey + rnd(-.3, 1), rnd(-2, 2), rnd(0, 2), 1.6, .25, '#f4f7fb', 'smoke'); AU.noiseHit(1.6, 5000, .25, 0, 'highpass', .4); toastUI('🧯 ' + L2('الحريقة اتطفت', 'Fire is out'), 'good'); S.stats.fires = (S.stats.fires || 0) + 1; }
/* ---------------- window cabin layer: real passengers + real tint + curtains ---------------- */
const DRV = {hiace:.7, coaster:.8, redbus:.86, mcv:.9, coachB:.86, coachO:.87, fiat128:.58, minivan:.6};
const CABM = {};
function cabinMask(V){ if (CABM[V.id]) return CABM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h), drv = (DRV[V.id] || .8) * w; let minX = w, maxX = 0, bot = [];
 for (let p = 0; p < w * h; p++){ const px = p % w, py = p / w | 0; if (M.win[p] && px < drv && px > w * .03){ d.data[p * 4 + 3] = 255; minX = Math.min(minX, px); maxX = Math.max(maxX, px); } }
 x.putImageData(d, 0, 0); for (let px = Math.round(minX); px < maxX; px += 4){ let b = -1; for (let py = Math.round(h * .62); py > 0; py--) if (d.data[(py * w + px) * 4 + 3]){ b = py; break; } if (b > 0) bot.push(b); } bot.sort((a, b) => a - b);
 let top = h; for (let p = 0; p < w * h; p++) if (d.data[p * 4 + 3]){ top = Math.min(top, p / w | 0); }
 return CABM[V.id] = {c, minX, maxX, sill:bot.length ? bot[bot.length >> 1] : h * .5, top, w, h}; }
const CAB = {};
function cabinCanvas(V, cos, pax, forPreview){ const K = cabinMask(V), key = V.id + '|' + cos.tint + '|' + (cos.curtain || 'none') + '|' + pax.map(p => p.t + (p.st ? 's' : '')).join(','); if (CAB[V.id] && CAB[V.id].key === key) return CAB[V.id].c;
 const c = document.createElement('canvas'); c.width = K.w; c.height = K.h; const x = c.getContext('2d'), ppm = K.w / V.len;
 // dark interior hides the painted-in passengers
 const g = x.createLinearGradient(0, K.top, 0, K.sill); g.addColorStop(0, '#2b3138'); g.addColorStop(1, '#161a1f'); x.fillStyle = g; x.fillRect(0, 0, K.w, K.h);
 const zone = K.maxX - K.minX, slotW = .62 * ppm, slots = Math.max(2, Math.floor(zone / slotW)), seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st);
 // seat backs
 x.fillStyle = V.cls === 'coach' ? '#28406e' : '#3b3f46'; for (let i = 0; i < slots; i++){ const sx2 = K.minX + (i + .5) * zone / slots; x.beginPath(); x.roundRect ? x.roundRect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm, 4) : x.rect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm); x.fill(); }
 const drawP = (p, px, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const H = (p.h || 1.7) * ppm * (im.height / 150), W2 = im.width / im.height * H; const headTop = K.sill - (stand ? 1.05 : .55) * ppm; x.drawImage(im, px - W2 / 2, headTop, W2, H); };
 // spread seated passengers evenly (window seats first), standing ones near the doors
 const order = []; for (let i = 0; i < slots; i++) order.push(i); order.sort((a, b) => ((a * 7) % slots) - ((b * 7) % slots));
 seated.slice(0, slots).forEach((p, i) => drawP(p, K.minX + (order[i] + .5) * zone / slots, false));
 standing.slice(0, Math.max(1, slots >> 1)).forEach((p, i) => drawP(p, K.minX + zone * (.3 + .4 * ((i * .37) % 1)), true));
 // curtains
 const CU = {red:['#8e1b2c','#e0b04a'], blue:['#1d3f8a','#d9d9d9'], green:['#1f6b3a','#e0b04a'], gold:['#b8862e','#fff1b8']}[cos.curtain];
 if (CU){ for (let i = 0; i <= slots; i++){ const cx2 = K.minX + i * zone / slots; x.fillStyle = CU[0]; x.beginPath(); x.moveTo(cx2 - slotW * .22, K.top); x.quadraticCurveTo(cx2 - slotW * .05, (K.top + K.sill) / 2, cx2 - slotW * .14, K.sill); x.lineTo(cx2 + slotW * .14, K.sill); x.quadraticCurveTo(cx2 + slotW * .05, (K.top + K.sill) / 2, cx2 + slotW * .22, K.top); x.fill(); x.fillStyle = CU[1]; x.fillRect(cx2 - slotW * .22, K.top, slotW * .44, ppm * .05); }
  x.fillStyle = CU[0]; x.globalAlpha = .9; x.fillRect(K.minX, K.top, zone, ppm * .08); x.globalAlpha = 1; }
 // tint: real smoked glass (darkness + blue-grey cast), plus reflection streaks
 const TA = (COS.tint.find(q => q.id === cos.tint) || {a:0}).a; x.fillStyle = `rgba(14,20,28,${.12 + TA * .85})`; x.fillRect(0, 0, K.w, K.h);
 const rg = x.createLinearGradient(0, K.top, K.w * .25, K.sill); rg.addColorStop(0, 'rgba(255,255,255,.0)'); rg.addColorStop(.45, `rgba(255,255,255,${.16 - TA * .08})`); rg.addColorStop(.55, 'rgba(255,255,255,.02)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, K.w, K.h);
 x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0);
 CAB[V.id] = {key, c}; return c; }
function paxView(){ const V = G.V, cap = V.seats; return G.onboard.map((p, i) => ({t:p.t, h:p.h, st:i >= cap})); }
/* ---------------- accessories drawn in sprite space (roof, mud flaps) ---------------- */
Object.assign(COS, {
 roof:[{id:'none', p:0, n:['من غير','None']}, {id:'taxi', p:600, n:['لافتة أجرة مضيئة','Lit "Ograaa" roof sign']}, {id:'bar', p:900, n:['لمبات ليد','LED light bar']}, {id:'box', p:1100, n:['صندوق سقف','Roof box']}, {id:'ac', p:1500, n:['تكييف سقف','Roof A/C unit']}],
 curtain:[{id:'none', p:0, n:['من غير','None']}, {id:'red', p:400, n:['ستارة نبيتي بدهبي','Burgundy & gold curtains']}, {id:'blue', p:400, n:['ستارة زرقا','Blue curtains']}, {id:'green', p:400, n:['ستارة خضرا','Green curtains']}, {id:'gold', p:650, n:['ستارة دهبي ملكي','Royal gold curtains']}],
 mud:[{id:'none', p:0, n:['من غير','None']}, {id:'red', p:250, n:['رفرف أحمر','Red mud flaps']}, {id:'black', p:250, n:['رفرف أسود','Black mud flaps']}, {id:'chrome', p:500, n:['رفرف كروم','Chrome mud flaps']}],
 decal:[{id:'none', p:0, n:['من غير','None']}, {id:'flames', p:700, n:['لهب','Flames']}, {id:'stars', p:450, n:['نجوم','Stars']}, {id:'eye', p:500, n:['عين حورس','Eye of Horus']}, {id:'flag', p:450, n:['علم مصر جانبي','Egypt flag side decal']}, {id:'logo', p:350, n:['شعار أجرة','Ograaa logo']}],
 chrome:[{id:'none', p:0, n:['من غير','None']}, {id:'strip', p:550, n:['شريط كروم','Chrome side strip']}, {id:'gold', p:800, n:['شريط دهبي','Gold side strip']}]
});
Object.assign(COS_ICON, {roof:'lights', curtain:'seat', mud:'tyre', decal:'paint', chrome:'paint'});
Object.assign(TX, {roof:['السقف','Roof'], curtain:['ستائر','Curtains'], mud:['رفارف','Mud flaps'], decal:['رسومات','Decals'], chrome:['كروم','Chrome'], market:['السوق','Market']});
const _bpc7 = buildPlayerCanvas;
buildPlayerCanvas = function(vid, cos, cond, dents){ const c = _bpc7(vid, cos, cond, dents), V = VBY(vid), M = paintMask(V.spr), w = c.width, h = c.height;
 if ((cos.decal && cos.decal !== 'none') || (cos.chrome && cos.chrome !== 'none')){ const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++) md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; mx.putImageData(md, 0, 0);
  const d = document.createElement('canvas'); d.width = w; d.height = h; const x = d.getContext('2d');
  if (cos.chrome === 'strip' || cos.chrome === 'gold'){ const g = x.createLinearGradient(0, h * .7, 0, h * .73); g.addColorStop(0, cos.chrome === 'gold' ? '#fff0b0' : '#ffffff'); g.addColorStop(.5, cos.chrome === 'gold' ? '#c9962e' : '#8f99a3'); g.addColorStop(1, cos.chrome === 'gold' ? '#7a5a14' : '#e6ebef'); x.fillStyle = g; x.fillRect(0, h * .7, w, h * .03); }
  if (cos.decal === 'flames'){ for (let i = 0; i < 7; i++){ const y = h * (.6 + i * .03); const g = x.createLinearGradient(w, 0, w * .45, 0); g.addColorStop(0, '#ffdd33'); g.addColorStop(.5, '#ff6a00'); g.addColorStop(1, 'rgba(200,20,0,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(w, y - h * .02); for (let q = 0; q <= 8; q++){ const px = w - q * w * .07; x.quadraticCurveTo(px + w * .02, y + (q % 2 ? -1 : 1) * h * .05, px - w * .035, y); } x.lineTo(w, y + h * .02); x.fill(); } }
  if (cos.decal === 'stars'){ x.fillStyle = '#f5c518'; const r = mulberry(5); for (let i = 0; i < 14; i++){ const cx = w * (.1 + r() * .8), cy = h * (.55 + r() * .25), s = h * (.015 + r() * .02); x.beginPath(); for (let k = 0; k < 10; k++){ const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? s * .45 : s; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.fill(); } }
  if (cos.decal === 'eye'){ const cx = w * .42, cy = h * .64, s = h * .09; x.strokeStyle = '#1a3b8f'; x.lineWidth = s * .14; x.beginPath(); x.ellipse(cx, cy, s * 1.6, s * .7, 0, 0, 7); x.stroke(); x.fillStyle = '#1a3b8f'; x.beginPath(); x.arc(cx, cy, s * .45, 0, 7); x.fill(); x.beginPath(); x.moveTo(cx - s * .3, cy + s * .65); x.quadraticCurveTo(cx - s * .1, cy + s * 1.5, cx + s * .4, cy + s * 1.3); x.stroke(); x.beginPath(); x.moveTo(cx - s * 1.6, cy - s * .9); x.lineTo(cx + s * 1.3, cy - s * 1.05); x.stroke(); }
  if (cos.decal === 'flag'){ const y = h * .6; [['#ce1126'],['#ffffff'],['#111111']].forEach(([col], i) => { x.fillStyle = col; x.beginPath(); x.moveTo(w * .15, y + i * h * .04); x.lineTo(w * .75, y + i * h * .04 + h * .02); x.lineTo(w * .75, y + (i + 1) * h * .04 + h * .02); x.lineTo(w * .15, y + (i + 1) * h * .04); x.fill(); }); }
  if (cos.decal === 'logo'){ x.font = `900 ${h * .1}px Lalezar, sans-serif`; x.fillStyle = '#f5b21b'; x.strokeStyle = '#1a1a1a'; x.lineWidth = h * .012; x.textAlign = 'center'; x.strokeText('OGRAAA', w * .45, h * .7); x.fillText('OGRAAA', w * .45, h * .7); }
  x.globalCompositeOperation = 'destination-in'; x.drawImage(mk, 0, 0); c.getContext('2d').drawImage(d, 0, 0); }
 return c; };
function roofLine(V){ const M = paintMask(V.spr); if (M.roof) return M.roof; const w = M.w, h = M.h, d = M.src, r = new Float32Array(w); for (let x = 0; x < w; x++){ r[x] = h; for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 200){ r[x] = y; break; } } return M.roof = r; }
function drawAccessories(x, V, cos, wheelsPx){ const M = paintMask(V.spr), w = M.w, h = M.h, ppm = w / V.len, rl = roofLine(V);
 if (cos.roof && cos.roof !== 'none'){ const cx = w * (V.cls === 'micro' ? .45 : .5), top = Math.min(...[-.1, 0, .1].map(o => rl[Math.round(cx + o * w)])); x.save();
  if (cos.roof === 'taxi'){ const bw = .95 * ppm, bh = .3 * ppm; x.fillStyle = '#222'; x.fillRect(cx - bw * .4, top - bh * .15, bw * .8, bh * .15); const g = x.createLinearGradient(0, top - bh, 0, top); g.addColorStop(0, '#fff4b0'); g.addColorStop(1, '#f5b21b'); x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, top - bh * 1.15, bw, bh, 4) : x.rect(cx - bw / 2, top - bh * 1.15, bw, bh); x.fill(); x.fillStyle = '#1a1a1a'; x.font = `900 ${bh * .62}px Lalezar, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('أجرة', cx, top - bh * .65); }
  if (cos.roof === 'bar'){ const bw = 1.3 * ppm, bh = .13 * ppm; x.fillStyle = '#111'; x.fillRect(cx - bw / 2, top - bh * 1.4, bw, bh); for (let i = 0; i < 10; i++){ x.fillStyle = i % 2 ? '#dff4ff' : '#ffffff'; x.fillRect(cx - bw / 2 + bw * (i + .15) / 10, top - bh * 1.28, bw * .07, bh * .7); } }
  if (cos.roof === 'box'){ const bw = Math.min(2.2, V.len * .4) * ppm, bh = .38 * ppm, g = x.createLinearGradient(0, top - bh, 0, top); g.addColorStop(0, '#5c6570'); g.addColorStop(1, '#2d333a'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - bw / 2, top - bh * .1); x.quadraticCurveTo(cx - bw / 2, top - bh, cx - bw * .3, top - bh); x.lineTo(cx + bw * .38, top - bh); x.quadraticCurveTo(cx + bw / 2, top - bh * .9, cx + bw / 2, top - bh * .1); x.fill(); }
  if (cos.roof === 'ac'){ const bw = 1.6 * ppm, bh = .28 * ppm; x.fillStyle = '#d9dde2'; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, top - bh, bw, bh, bh / 2) : x.rect(cx - bw / 2, top - bh, bw, bh); x.fill(); x.fillStyle = '#9aa3ab'; for (let i = 0; i < 6; i++) x.fillRect(cx - bw * .4 + i * bw * .15, top - bh * .75, bw * .08, bh * .45); }
  x.restore(); }
 if (cos.mud && cos.mud !== 'none'){ const col = {red:'#b3141f', black:'#15171a', chrome:'#c9d1d8'}[cos.mud]; (wheelsPx || M.w && META[V.spr].wheels).forEach(([wx, wy, wr]) => { const mx = wx - wr * 1.12, my = wy - wr * .1, mw = wr * .16, mh = wr * 1.05; x.fillStyle = col; x.fillRect(mx, my, mw, mh); if (cos.mud !== 'chrome'){ x.fillStyle = 'rgba(255,255,255,.7)'; x.font = `700 ${mw * .9}px sans-serif`; x.save(); x.translate(mx + mw * .7, my + mh * .5); x.rotate(-Math.PI / 2); x.textAlign = 'center'; x.fillText('OGRA', 0, 0); x.restore(); } }); }
}
/* draw cabin + accessories on the player vehicle */
const _dv7 = drawVehicle;
drawVehicle = function(car, opt){ _dv7(car, opt); if (!car.player || !G.V) return; const V = G.V, cos = G.test ? vdef(V).cos : GV(G.vid).cos, g = car.g, k = PPM * g.s, X = sx(car.x), Y = sy(car.y);
 const src = car.cv; ctx.save(); ctx.translate(X, Y); ctx.rotate(-car.a); ctx.scale(k, k); ctx.translate(-src.width / 2, -src.height / 2);
 try{ ctx.drawImage(cabinCanvas(V, cos, paxView()), 0, 0); drawAccessories(ctx, V, cos); }catch(e){ reportErr('cabin', e); } ctx.restore();
 if (G.fire > 0){ const [ex, ey] = engineBay(), f = G.fire; for (let i = 0; i < 3; i++) puff(ex + rnd(-.5, .5), ey + rnd(-.2, .4), rnd(-.6, .6), 2 + f * 2, .5, .12 + f * .15, pick(['#ff7b00','#ffb300','#ff3b00']), 'smoke'); if (Math.random() < .8) puff(ex, ey + 1, rnd(-.8, .3), 1.5, 2.5, .25 + f * .3, '#1b1b1b', 'smoke'); const gx = sx(ex), gy = sy(ey), gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, PPM * (1.5 + f * 2)); gr.addColorStop(0, 'rgba(255,140,0,.55)'); gr.addColorStop(1, 'rgba(255,80,0,0)'); ctx.fillStyle = gr; ctx.fillRect(gx - PPM * 4, gy - PPM * 4, PPM * 8, PPM * 8); }
};
/* garage / showroom preview with cabin + accessories */
function drawPreview(canvas, vid, cosOver){
 const c = canvas, w = c.clientWidth, h = c.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); if (c.width !== Math.round(w * d)){ c.width = w * d; c.height = h * d; } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, w, h);
 const V = VBY(vid), gv = GV(vid), cos = cosOver || gv.cos, own = gv.owned; const key = vid + JSON.stringify(cos) + JSON.stringify(own ? gv.cond : 0) + (own ? gv.dents.length : 0);
 if (!PREV[vid] || PREV[vid].key !== key) PREV[vid] = {key, cv:buildPlayerCanvas(vid, cos, own ? gv.cond : {clean:100}, own ? gv.dents : [])};
 const b = PREV[vid].cv, M = META[V.spr], k = Math.min(w * .82 / b.width, h * .62 / b.height) * clamp(.62 + V.len / 30, .75, 1), bw = b.width * k, bh = b.height * k, ox = (w - bw) / 2, oy = h * .88 - bh;
 const gl = COS.glow.find(g => g.id === cos.glow); if (gl && gl.c){ const g = x.createRadialGradient(w / 2, h * .88, 0, w / 2, h * .88, bw * .6); g.addColorStop(0, gl.c + 'dd'); g.addColorStop(1, gl.c + '00'); x.fillStyle = g; x.fillRect(0, h * .6, w, h * .4); }
 x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.ellipse(w / 2, h * .88 + 2, bw * .48, bh * .06, 0, 0, 7); x.fill();
 const rim = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh, t0 = performance.now() / 1000;
 if (!V.baked) for (const [cx, cy, r] of M.wheels){ x.save(); x.translate(ox + cx * k, oy + cy * k); x.rotate(t0 * 1.5); const R = r * k * WQ(rim); x.drawImage(typeof rimImg === 'function' ? rimImg(rim, cos.rimc) : IMG['wh' + rim], -R, -R, R * 2, R * 2); x.restore(); }
 x.drawImage(b, ox, oy, bw, bh);
 const demo = Array.from({length:Math.ceil(V.seats * .55)}, (_, i) => ({t:(i * 5 + 3) % META.peds.length, h:1.62 + (i % 3) * .07}));
 x.save(); x.translate(ox, oy); x.scale(k, k); try{ x.drawImage(cabinCanvas(V, cos, demo, true), 0, 0); drawAccessories(x, V, cos); }catch(e){} x.restore();
 if (cos.rack && V.rack){ x.fillStyle = '#2b2b2b'; x.fillRect(ox + bw * .2, oy - bh * .04, bw * .6, bh * .025); }
}
/* ---------------- fatigue (persistent, all routes) ---------------- */
function fatigueNow(){ if (S.fatigue == null) S.fatigue = 0; if (S.fatT){ const hrs = (Date.now() - S.fatT) / 3.6e6; if (hrs > .02) S.fatigue = Math.max(0, S.fatigue - hrs * 30); } S.fatT = Date.now(); return S.fatigue; }
/* ---------------- main v7 tick (wraps update) ---------------- */
const _upd7 = update;
update = function(dt){ const car = G.car, full = G.mode === 'play', prevAlert = G.alert;
 if (full && S.devFuel) G.fuel = G.fuelMax;
 const body0 = full && !G.test ? GV(G.vid).cond.body : 0, eng0 = full && !G.test ? GV(G.vid).cond.engine : 0; G.pedX = null;
 const bump = full && G._la != null ? G.alert - G._la : 0;
 // fatigue: sluggish throttle when exhausted
 if (full && S.fatigue > 78 && Math.random() < dt * .6){ G.blink = .35; }
 _upd7(dt);
 if (!full) return;
 if (S.devGod && !G.test){ const g = GV(G.vid); g.cond.body = Math.max(g.cond.body, body0); g.cond.engine = Math.max(g.cond.engine, eng0); }
 updDebris(dt); SIREN.update();
 // fatigue model
 fatigueNow(); const rate = .045 * (G.tod === 'night' ? 1.5 : 1) * (G.cabin > 29 ? 1.25 : 1) * (G.radioOn ? .9 : 1) * (speedOf(car) > .5 ? 1 : .35);
 if (bump > .5) S.fatigue = Math.max(0, S.fatigue - bump * .9); else if (!S.devNoFat) S.fatigue = Math.min(100, S.fatigue + rate * dt); if (S.devNoFat) S.fatigue = 0;
 G.alert = 100 - S.fatigue; G._la = G.alert; const fo = $('#fatigue'); fo.style.opacity = G.blink > 0 ? .9 : clamp((S.fatigue - 55) / 60, 0, .55);
 if (S.fatigue > 70 && !G.fw){ G.fw = true; toastUI('😴 ' + L2('إنت تعبان — اشرب قهوة أو كُل حاجة', 'You\'re exhausted — drink a coffee or eat a snack'), 'bad', inv().coffee ? [[L2('☕ قهوة', '☕ Coffee'), () => useItem('coffee')]] : null, 6); AU.tone(180, .6, 'sine', .08, 0, -60); }
 if (S.fatigue < 50) G.fw = false;
 // fire progression
 if (!(G.fire > 0) && GV(G.vid).cond.engine < 8 && G.temp > 115 && Math.random() < dt * .1) igniteFire();
 if (G.fire > 0){ G.fire = Math.min(1, G.fire + dt * .02); G.fireT += dt; if (!G.test) GV(G.vid).cond.engine = Math.max(0, GV(G.vid).cond.engine - dt * 1.2); G.comfort -= dt * 6; if (G.onboard.length && !G.doorOpen && speedOf(car) < .5) setDoor(true); if (G.fireT > 28){ if (!G.test){ GV(G.vid).cond.engine = 0; GV(G.vid).cond.body = Math.max(0, GV(G.vid).cond.body - 40); } G.fire = 0; endRun('broke'); toastUI('🔥 ' + t('fireEnd'), 'bad', null, 5); } }
 // smoke types: steam when overheating, blue oil smoke when oil is low
 const ca = Math.cos(car.a), sa = Math.sin(car.a);
 if (G.temp > 106 && Math.random() < .5){ const [ex, ey] = engineBay(); puff(ex, ey + .6, rnd(-.4, .4), 1.6, 1.4, .14, '#f1f4f8', 'smoke'); }
 if (!G.test && GV(G.vid).cond.oil < 12 && G.engOn && Math.random() < .5) puff(car.x - car.L / 2 * ca, car.y - car.L / 2 * sa + car.yb, -1, .5, 1.6, .1, '#7c8aa6', 'smoke');
 if (!G.test && GV(G.vid).cond.engine < 25 && Math.random() < .08) puff(car.x + rnd(-car.L * .3, car.L * .3), terrH(car.x) + .1, 0, 0, 6, .06, '#2a2a2a', 'dust');
 v7fun(dt);
 const tc = $('#cFat'); if (tc) tc.innerHTML = `😴 ${fmt(Math.round(S.fatigue))}%`, tc.style.color = S.fatigue > 70 ? '#ff6b78' : S.fatigue > 45 ? '#ffd35a' : '';
};
/* ---------------- fun layer: smooth combo, perfect stops, VIPs, rush hour ---------------- */
function v7fun(dt){ const car = G.car, F = G.fun || (G.fun = {combo:1, calm:0, seen:new Set(), vip:new Set()});
 const acc = Math.abs(car.vx - (F.pv || 0)) / Math.max(dt, .001); F.pv = car.vx; const harsh = acc > 4.5 || speedOf(car) * 3.6 > curLimit(car.x) + 8 || car.grounded === 0;
 if (G.onboard.length && !harsh){ F.calm += dt; F.combo = Math.min(2, 1 + Math.floor(F.calm / 15) * .1); } else if (harsh){ if (F.combo > 1.15) toastUI(L2('ضاع الكومبو!', 'Combo lost!'), 'bad', null, 1.5); F.calm = 0; F.combo = 1; }
 const cc = $('#cCombo'); if (cc){ cc.style.display = F.combo > 1 ? '' : 'none'; cc.textContent = '🔥 ×' + F.combo.toFixed(1); }
 // VIPs board sometimes, pay triple if the ride is comfortable
 for (const p of G.onboard){ if (!F.seen.has(p)){ F.seen.add(p); if (Math.random() < .08){ p.vip = true; F.vip.add(p); toastUI('⭐ ' + L2('راكب VIP ركب — خليه مبسوط!', 'A VIP boarded — keep them comfortable!'), 'gold', null, 3); } } }
 for (const p of [...F.vip]){ if (!G.onboard.includes(p)){ F.vip.delete(p); if (G.comfort > 70){ const b = Math.round(G.route.fare * 2 * F.combo); G.T.tips += b; floatTxt(car.x, car.y + 3, '⭐ +' + fmt(b), '#FFD24A'); AU.levelUp(); } else toastUI(L2('الـVIP مكانش مبسوط', 'The VIP wasn\'t happy'), 'bad'); } }
}
const _serve7 = serveStop;
serveStop = function(st){ const tips0 = G.T.tips; _serve7(st); const F = G.fun; if (F && F.combo > 1 && G.T.tips > tips0){ const extra = Math.round((G.T.tips - tips0) * (F.combo - 1) * 10) / 10; G.T.tips += extra; } };
const _setDoor7 = setDoor;
setDoor = function(open){ if (open && G.mode === 'play' && !G.doorOpen){ const st = W.stops[G.nextIdx]; if (st && !st.served && !st.perfect){ const gap = Math.abs(doorX() - st.x); if (gap < .45){ st.perfect = true; const b = G.V.cls === 'coach' ? 40 : 8; G.T.tips += b; S.xp += 5; floatTxt(doorX(), G.car.y + 3.4, L2('وقفة مظبوطة! +', 'Perfect stop! +') + fmt(b), '#7CFC9A'); S.stats.perfect = (S.stats.perfect || 0) + 1; } } } _setDoor7(open); };
const _endRun7 = endRun;
endRun = function(reason){ if (G.ended) return; const h = new Date().getHours(); if ((h >= 7 && h <= 10) || (h >= 16 && h <= 19)){ const b = Math.round(G.T.fares * .2); if (b > 0){ G.T.tips += b; toastUI('🕗 ' + L2('بونص ساعة الذروة +', 'Rush-hour bonus +') + money(b), 'gold'); } } _endRun7(reason); };
/* ---------------- trunk icon (premium SVG) + HUD chips ---------------- */
const TRUNK_SVG = `<svg viewBox="0 0 64 64" class="trsvg"><defs><linearGradient id="tg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset="1" stop-color="#c98a12"/></linearGradient></defs><path d="M8 40 L14 26 Q16 22 21 22 L43 22 Q48 22 50 26 L56 40 Z" fill="#1b2433" stroke="url(#tg)" stroke-width="3" stroke-linejoin="round"/><path d="M12 14 L52 14 L56 24 L8 24 Z" fill="url(#tg)" opacity=".95" transform="rotate(-14 32 24)"/><rect x="6" y="40" width="52" height="12" rx="4" fill="url(#tg)"/><rect x="26" y="44" width="12" height="4" rx="1.5" fill="#1b2433"/><circle cx="14" cy="46" r="2.4" fill="#ff5a4a"/><circle cx="50" cy="46" r="2.4" fill="#ff5a4a"/><rect x="18" y="30" width="10" height="9" rx="1.5" fill="#6bb6ff"/><rect x="30" y="28" width="14" height="11" rx="1.5" fill="#ffb36b"/></svg>`;
const _bc7 = buildControls;
buildControls = function(){ _bc7(); const b = $('#bTrunk'); if (b){ b.querySelector('.pbi').outerHTML = TRUNK_SVG; b.querySelector('em').textContent = L2('الشنطة', 'Trunk'); }
 $('.chips').insertAdjacentHTML('afterbegin', '<div class="chip" id="cCombo" style="display:none"></div><div class="chip" id="cFat"></div>'); };
const _rt7 = renderTrunk;
renderTrunk = function(){ _rt7(); const h = $('#trunkP .trh b'); if (h) h.innerHTML = TRUNK_SVG + ' ' + L2('شنطة العربية', 'Vehicle trunk'); const bag = inv(G.vid); if (G.fire > 0 && bag.ext && !$('#trunkP .fireb')) $('#trunkP').insertAdjacentHTML('afterbegin', `<button class="btn red fireb" style="width:100%;margin-bottom:.5rem">🧯 ${L2('طفّي الحريقة', 'Put out the fire')}</button>`); const fb = $('#trunkP .fireb'); if (fb) fb.onpointerdown = e => { e.preventDefault(); extinguish(); renderTrunk(); }; };
const _useItem7 = useItem;
useItem = function(id){ if (id === 'snacks' || id === 'food') S.fatigue = Math.max(0, (S.fatigue || 0) - (id === 'food' ? 25 : 15)); _useItem7(id); };
/* ---------------- main-menu market: stock the trunk of any owned vehicle ---------------- */
NAV.splice(4, 0, ['market', 'i_coins']);
const main7 = document.getElementById('main'); if (main7 && !document.getElementById('s-market')) main7.insertAdjacentHTML('beforeend', '<section class="screen" id="s-market"></section>');
let MKT_V = null, MKT_C = 'all';
const MKT_CATS = [['all', ['الكل','All']], ['food', ['أكل ومشروبات','Food & drinks'], ['water','coffee','tea','food','snacks']], ['safety', ['أمان','Safety'], ['aid','ext','tri']], ['tools', ['عدة وقطع غيار','Tools & spares'], ['jerry','spare','tools','oil','cool']], ['comfort', ['راحة الركاب','Comfort'], ['tissue','fresh']]];
function renderMarket(){ const owned = VEHS.filter(v => GV(v.id).owned); if (!MKT_V || !GV(MKT_V).owned) MKT_V = owned[0].id; const vid = MKT_V, cap = storeCap(vid), used = invKg(vid), bag = inv(vid), cat = MKT_CATS.find(c => c[0] === MKT_C), list = ITEMS.filter(i => MKT_C === 'all' || cat[2].includes(i.id));
 $('#s-market').innerHTML = `<div class="head"><h1>${L2('السوق', 'Market')}</h1><p>${L2('جهّز شنطة عربيتك قبل المشوار', 'Stock your vehicle\'s trunk before the trip')}</p></div>
 <div class="vpick" style="margin-bottom:.7rem">${owned.map(v => `<button class="vchip ${v.id === vid ? 'on' : ''}" data-mv="${v.id}"><img src="${ASSETS[v.spr]}">${nm(v.name)} <span class="muted">${fmt(Math.round(invKg(v.id)))}/${fmt(Math.round(storeCap(v.id)))}</span></button>`).join('')}</div>
 <div class="card"><div class="row">${TRUNK_SVG}<b>${L2('شنطة', 'Trunk of')} ${nm(VBY(vid).name)}</b><span class="sp"></span><b class="gold">${fmt(Math.round(used))} / ${fmt(Math.round(cap))} ${t('kg')}</b></div>${bar(used / cap * 100, used / cap > .9 ? 'bad' : 'gold')}${missingKit(vid).length ? `<div class="warnk">⚠ ${L2('أدوات أمان ناقصة', 'Safety kit incomplete')}: ${missingKit(vid).map(k => IBY(k).ic).join(' ')}</div>` : ''}</div>
 <div class="tabs" style="margin-top:.8rem">${MKT_CATS.map(c => `<button class="tab ${MKT_C === c[0] ? 'on' : ''}" data-mc="${c[0]}">${nm(c[1])}</button>`).join('')}</div>
 <div class="items">${list.map(i => `<div class="item"><span style="font-size:2rem">${i.ic}</span><b>${nm(i.n)}</b><span class="muted" style="font-size:.7rem">${nm(i.d)} · ${fmt(i.kg)} ${t('kg')}</span><small>${L2('في الشنطة', 'In trunk')}: ${fmt(bag[i.id] || 0)}</small><div class="row"><button class="btn sm sec" data-ms="${i.id}" ${bag[i.id] ? '' : 'disabled'}>−</button><button class="btn sm" data-mb="${i.id}">+ ${money(i.p)}</button></div></div>`).join('')}</div>`;
 $$('[data-mv]').forEach(b => b.onclick = () => { MKT_V = b.dataset.mv; renderMarket(); }); $$('[data-mc]').forEach(b => b.onclick = () => { MKT_C = b.dataset.mc; renderMarket(); });
 $$('[data-mb]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.mb); if (invKg(vid) + I.kg > cap){ toastUI(L2('الشنطة مليانة', 'Trunk is full'), 'bad'); return; } if (!spend(I.p, nm(I.n), 'terminal')) return; addItem(vid, I.id, 1); renderMarket(); });
 $$('[data-ms]').forEach(b => b.onclick = () => { const I = IBY(b.dataset.ms); if (!bag[I.id]) return; bag[I.id]--; ledger(Math.round(I.p * .5), L2('بيع ', 'Sold ') + nm(I.n), 'cash'); save(); renderMarket(); }); }
const _show7 = show;
show = function(id){ if (id === 'market'){ SCR = id; $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-market')); $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.go === id)); renderMarket(); $('#main').scrollTop = 0; return; } _show7(id); };
/* ---------------- encrypted, signed saves + anti-cheat ---------------- */
const SEC7 = 'Ograaa\u00b7EGYSeal\u00b7HossamHegazi\u00b7v7', KEY7 = 'ograaa_sv2', BAK7 = 'ograaa_bk2', BAN7 = 'ograaa_bn';
function xorc(str, decode){ const r = mulberry(h32(SEC7)); if (decode){ const bin = atob(str); let o = ''; for (let i = 0; i < bin.length; i++) o += String.fromCharCode(bin.charCodeAt(i) ^ (r() * 256 | 0)); return decodeURIComponent(escape(o)); } const u = unescape(encodeURIComponent(str)); let o = ''; for (let i = 0; i < u.length; i++) o += String.fromCharCode(u.charCodeAt(i) ^ (r() * 256 | 0)); return btoa(o); }
function pack(obj){ const j = JSON.stringify(obj); return xorc(j) + '.' + h32(j + SEC7).toString(36); }
function unpack(raw){ if (!raw) return null; const i = raw.lastIndexOf('.'); if (i < 0) return {bad:true}; try{ const j = xorc(raw.slice(0, i), true); if (h32(j + SEC7).toString(36) !== raw.slice(i + 1)) return {bad:true}; return {json:j}; }catch(e){ return {bad:true}; } }
const GUARD = {m:0, xp:0, owned:0, ref:null, snap:null, spendT:0, ok:true};
const isDev = () => !!(S.dev && S.devSig === h32(SEC7 + 'dev' + S.devT));
function guardRebase(){ GUARD.m = S.money; GUARD.xp = S.xp; GUARD.owned = VEHS.filter(v => GV(v.id).owned).length; GUARD.ref = S; GUARD.snap = JSON.stringify(S); }
function save(now){ if (!now){ clearTimeout(saveT); saveT = setTimeout(() => save(true), 250); return; } try{ if (!guardCheck()) return; const p = pack(S); localStorage.setItem(KEY7, p); localStorage.setItem(BAK7, p); localStorage.removeItem(SAVE_KEY); }catch(e){} }
const _load7 = load;
load = function(){ const raw = localStorage.getItem(KEY7); let tampered = false;
 if (raw){ const u = unpack(raw); if (u && !u.bad){ localStorage.setItem(SAVE_KEY, u.json); } else { tampered = true; const b = unpack(localStorage.getItem(BAK7)); if (b && !b.bad) localStorage.setItem(SAVE_KEY, b.json); } }
 _load7(); localStorage.removeItem(SAVE_KEY); if (tampered && !isDev()) banPlayer(L2('ملف الحفظ اتعدل', 'The save file was modified')); guardRebase(); };
function banPlayer(why){ const until = Date.now() + 3.6e6; S.banUntil = until; localStorage.setItem(BAN7, pack({until, why})); showBan(); }
function banLeft(){ const b = unpack(localStorage.getItem(BAN7)); const u = Math.max(S.banUntil || 0, b && !b.bad ? JSON.parse(b.json).until : 0); return u - Date.now(); }
function showBan(){ let el = $('#banM'); if (!el){ document.body.insertAdjacentHTML('beforeend', `<div class="modal on" id="banM" style="z-index:90"><div class="mbox" style="border-color:var(--bad)"><h2 style="color:var(--bad)">⛔ ${L2('تم إيقافك مؤقتاً', 'Temporarily banned')}</h2><p>${L2('اكتشفنا محاولة غش. رجعنا بياناتك لآخر نسخة سليمة.', 'A cheating attempt was detected. Your progress was restored to the last clean state.')}</p><div class="disp gold" style="font-size:2.4rem" id="banT"></div></div></div>`); el = $('#banM'); }
 el.classList.add('on'); const tick = () => { const l = banLeft(); if (l <= 0 || isDev()){ el.classList.remove('on'); return; } $('#banT').textContent = new Date(l).toISOString().slice(14, 19); setTimeout(tick, 500); }; tick(); if (G.mode === 'play') toMenu('home'); }
function cheatDetected(what){ if (isDev()) { guardRebase(); return; } console.warn('[Ograaa] integrity', what); try{ const snap = JSON.parse(GUARD.snap); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, snap); }catch(e){} GUARD.m = S.money; GUARD.xp = S.xp; banPlayer(what); const p = pack(S); localStorage.setItem(KEY7, p); localStorage.setItem(BAK7, p); renderTop(); }
function guardCheck(){ if (GUARD.ref !== S){ guardRebase(); return true; } if (isDev()){ guardRebase(); return true; }
 const own = VEHS.filter(v => GV(v.id).owned).length;
 if (S.money !== GUARD.m){ cheatDetected('money'); return false; }
 if (S.xp < GUARD.xp - 1 || S.xp - GUARD.xp > 4000){ cheatDetected('xp'); return false; }
 if (own > GUARD.owned && Date.now() - GUARD.spendT > 4000){ cheatDetected('vehicles'); return false; }
 GUARD.xp = S.xp; GUARD.owned = own; GUARD.snap = JSON.stringify(S); return true; }
const _ledger7 = ledger;
ledger = function(amount, label, icon){ if (GUARD.ref === S && S.money !== GUARD.m && !isDev()){ cheatDetected('money'); return; } _ledger7(amount, label, icon); GUARD.m = S.money; GUARD.spendT = Date.now(); };
setInterval(() => { try{ if (S && GUARD.ref) guardCheck(); }catch(e){} }, 2000);
const _play7 = play;
play = function(route, opt){ if (banLeft() > 0 && !isDev()){ showBan(); return; } _play7(route, opt); fatigueNow(); if (S.fatigue > 60) toastUI('😴 ' + L2('إنت تعبان من الأول — خد بالك', 'You start this trip tired — careful'), 'bad', null, 4); if (S.devTod || S.devWx){ G.tod = S.devTod || G.tod; G.weather = S.devWx || G.weather; G.rainT = G.weather === 'rain' ? 1 : 0; } };
/* ---------------- settings: dev section (password protected) ---------------- */
const DEVH = h32('Monalisa');
const _rs7 = renderSettings;
renderSettings = function(){ _rs7(); const grid = $('#s-settings .grid'); if (!grid) return; const dev = isDev();
 const tog = (k, n) => `<div class="set"><label>${n}</label><span class="sp"></span><button class="tog ${S[k] ? 'on' : ''}" data-dt7="${k}"></button></div>`;
 grid.insertAdjacentHTML('beforeend', `<div class="card devc"><h3>🛠 ${L2('وضع المطور', 'Developer')}</h3>${!dev ? `<div class="row"><input type="password" id="devPw" placeholder="${L2('كلمة السر', 'Password')}"><button class="btn sm" id="devGo">${L2('فتح', 'Unlock')}</button></div>` : `
 <div class="row" style="flex-wrap:wrap;gap:.4rem"><button class="btn sm" data-dv="m1">+10,000</button><button class="btn sm" data-dv="m2">+100,000</button><button class="btn sm" data-dv="lvl">${L2('أقصى مستوى', 'Max level')}</button><button class="btn sm" data-dv="veh">${L2('كل المركبات', 'All vehicles')}</button><button class="btn sm" data-dv="lic">${L2('كل الرخص', 'All licences')}</button><button class="btn sm" data-dv="cos">${L2('كل الإكسسوارات', 'All cosmetics')}</button><button class="btn sm" data-dv="fix">${L2('صلّح الكل', 'Repair all')}</button><button class="btn sm" data-dv="fuel">${L2('فوّل الكل', 'Refuel all')}</button><button class="btn sm" data-dv="kit">${L2('شنطة كاملة', 'Full trunk kit')}</button><button class="btn sm" data-dv="fines">${L2('امسح المخالفات', 'Clear fines')}</button><button class="btn sm" data-dv="fat">${L2('صفّر التعب', 'Reset fatigue')}</button><button class="btn sm" data-dv="ban">${L2('فك الحظر', 'Lift ban')}</button></div>
 ${tog('devGod', L2('بدون تلفيات', 'No damage (god mode)'))}${tog('devFuel', L2('بنزين لا نهائي', 'Infinite fuel'))}${tog('devNoFat', L2('بدون تعب', 'No fatigue'))}${tog('devFree', L2('شراء ببلاش', 'Free shopping'))}${tog('devFps', L2('عداد FPS', 'Show FPS'))}
 <div class="set"><label>${L2('وقت الرحلة', 'Trip time')}</label><span class="sp"></span>${['', 'day', 'sunset', 'night'].map(v => `<button class="btn sm ${(S.devTod || '') === v ? '' : 'sec'}" data-dtod="${v}">${v || 'auto'}</button>`).join('')}</div>
 <div class="set"><label>${L2('الطقس', 'Weather')}</label><span class="sp"></span>${['', 'clear', 'rain', 'sand'].map(v => `<button class="btn sm ${(S.devWx || '') === v ? '' : 'sec'}" data-dwx="${v}">${v || 'auto'}</button>`).join('')}</div>
 <div class="mbtns"><button class="btn sm red" id="devLock">${L2('اقفل وضع المطور', 'Lock developer mode')}</button></div>`}</div>`);
 const go = $('#devGo'); if (go) go.onclick = () => { if (h32($('#devPw').value) === DEVH){ S.dev = true; S.devT = Date.now(); S.devSig = h32(SEC7 + 'dev' + S.devT); guardRebase(); save(true); toastUI('🛠 ' + L2('وضع المطور اشتغل', 'Developer mode on'), 'good'); renderSettings(); } else { toastUI(L2('كلمة السر غلط', 'Wrong password'), 'bad'); AU.tone(160, .25, 'square', .1); } };
 $$('[data-dt7]').forEach(b => b.onclick = () => { S[b.dataset.dt7] = !S[b.dataset.dt7]; save(); renderSettings(); });
 $$('[data-dtod]').forEach(b => b.onclick = () => { S.devTod = b.dataset.dtod; save(); renderSettings(); }); $$('[data-dwx]').forEach(b => b.onclick = () => { S.devWx = b.dataset.dwx; save(); renderSettings(); });
 $$('[data-dv]').forEach(b => b.onclick = () => { const a = b.dataset.dv;
  if (a === 'm1') ledger(10000, 'DEV', 'coins'); if (a === 'm2') ledger(100000, 'DEV', 'coins'); if (a === 'lvl') S.xp = Math.max(S.xp, 400000);
  if (a === 'veh') VEHS.forEach(v => { GV(v.id).owned = true; }); if (a === 'lic'){ S.lic.have = {micro:true, bus:true, coach:true}; S.lic.exp = Date.now() + LIC_DAYS * DAY; S.lic.no = S.lic.no || 'EG-DR-000001'; }
  if (a === 'cos') VEHS.forEach(v => Object.keys(COS).forEach(c => COS[c].forEach(it => { S.inv[v.id + ':' + c + ':' + it.id] = 1; })));
  if (a === 'fix') VEHS.forEach(v => { const g = GV(v.id); Object.keys(g.cond).forEach(k => g.cond[k] = 100); g.dents = []; }); if (a === 'fuel') VEHS.forEach(v => { GV(v.id).fuel = v.tank * (1 + .2 * (GV(v.id).up.tank || 0)); });
  if (a === 'kit') VEHS.forEach(v => { if (GV(v.id).owned) Object.assign(inv(v.id), {ext:1, tri:1, aid:1, water:2, coffee:2, spare:1, tools:1, jerry:1}); }); if (a === 'fines'){ S.fines = []; S.lic.points = 0; S.lic.suspUntil = 0; } if (a === 'fat') S.fatigue = 0; if (a === 'ban'){ S.banUntil = 0; localStorage.removeItem(BAN7); }
  ensureLicences(); guardRebase(); save(true); renderTop(); toastUI('🛠 OK', 'good'); renderSettings(); });
 const lk = $('#devLock'); if (lk) lk.onclick = () => { S.dev = false; S.devSig = 0; ['devGod','devFuel','devNoFat','devFree','devFps'].forEach(k => S[k] = false); S.devTod = S.devWx = ''; guardRebase(); save(true); renderSettings(); };
};
const _spend7 = spend;
spend = function(amount, label, icon){ if (isDev() && S.devFree){ AU.cash(); return true; } return _spend7(amount, label, icon); };
/* FPS meter for devs */
let fpsN = 0, fpsT = 0; (function fpsLoop(t){ fpsN++; if (t - fpsT > 1000){ const el = document.getElementById('fps7'); if (isDev() && S.devFps){ if (!el) document.body.insertAdjacentHTML('beforeend', '<div id="fps7"></div>'); document.getElementById('fps7').textContent = fpsN + ' FPS'; } else if (el) el.remove(); fpsN = 0; fpsT = t; } requestAnimationFrame(fpsLoop); })(0);
/* boot: show an active ban */
setTimeout(() => { try{ if (banLeft() > 0 && !isDev()) showBan(); }catch(e){} }, 1500);

/* ======================= polish.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v8 — dynamic cabin, coloured service bays, calm soundscape,
   LCD alignment
   ===================================================================== */
/* ---------------- cabin mask covers the whole window (hides painted-in passengers) ---------------- */
function cabinMask(V){ if (CABM[V.id]) return CABM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h), drv = (DRV[V.id] || .8) * w, lim = Math.round(h * .64);
 let minX = w, maxX = 0, top = h; const bots = [];
 const Y0 = new Int16Array(w).fill(-1), Y1 = new Int16Array(w).fill(-1); for (let px = Math.ceil(w * .03); px < drv; px++) for (let py = 0; py < lim; py++) if (M.win[py * w + px]){ if (Y0[px] < 0) Y0[px] = py; Y1[px] = py; }
 const ys = Array.from(Y1).filter(v => v > 0).sort((a, b) => a - b), base = ys.length ? ys[ys.length >> 1] : lim;
 for (let px = Math.ceil(w * .03); px < drv; px++){ let y0 = Y0[px], y1 = Math.min(Y1[px], base + Math.round(h * .02));
  let dk = 0; if (y0 >= 0) for (let py = y0; py <= y1; py++){ const q = (py * w + px) * 4, Lq = M.src[q] * .3 + M.src[q + 1] * .59 + M.src[q + 2] * .11; if (Lq < 34) dk++; }
  const pillar = y0 >= 0 && dk / (y1 - y0 + 1) > .8; if (!pillar && y0 >= 0 && y1 - y0 > h * .06){ const e = Math.max(1, Math.round(h * .008)); y0 += e; y1 -= e; for (let py = y0; py <= y1; py++){ const p = (py * w + px) * 4; d.data[p + 3] = M.src[p + 3] > 150 ? 255 : 0; } minX = Math.min(minX, px); maxX = Math.max(maxX, px); top = Math.min(top, y0); bots.push(y1); } }
 x.putImageData(d, 0, 0); x.filter = 'blur(0.6px)'; x.drawImage(c, 0, 0); x.filter = 'none'; bots.sort((a, b) => a - b);
 return CABM[V.id] = {c, minX, maxX, sill:bots.length ? bots[bots.length >> 1] : h * .5, top, w, h}; }
for (const k in CABM) delete CABM[k]; for (const k in CAB) delete CAB[k];
/* passengers shown = passengers on board, in their own clothes, seated first then standing */
function paxView(){ const V = G.V, cap = V.seats; return G.onboard.map((p, i) => ({t:p.t, h:p.h, st:i >= cap})); }
/* ---------------- no crossing pedestrians anywhere (no messages either) ---------------- */
randomEvent = function(){ G.pedX = {x:-1e9, k:1}; _re5(); G.pedX = null; };
/* ---------------- calm, pleasant soundscape ---------------- */
AU.horn = function(kind, big, vol){ if (!this.ctx) return; const v = vol == null ? 1 : vol, H = (f, d, k) => this.hornVoice(f, d, k, v);
 const seq = (notes, step, len) => notes.forEach((f, i) => setTimeout(() => H([f, f * 1.21], len, 'car'), i * step));
 if (kind === 'melody') return seq([659,784,988,784,659,988], 135, .13); if (kind === 'cuca') return seq([392,392,392,523,659,392,392,392,523,659], 125, .11); if (kind === 'mahr') return seq([440,440,523,440,587,523,440], 100, .09);
 if (kind === 'air' || big) H([185, 233, 277], .8, 'air'); else H([410, 510], .42, 'car'); };
const _hv8 = AU.hornVoice.bind(AU);
AU.hornVoice = function(freqs, dur, kind, vol){ const g = this.sfxG.gain.value; if (vol != null && vol < 1){ const c = this.ctx, tmp = c.createGain(); tmp.gain.value = vol * .7; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ _hv8(freqs, dur, kind); } finally { this.sfxG = real; } return; } const c = this.ctx, tmp = c.createGain(); tmp.gain.value = .72; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ _hv8(freqs, dur, kind); } finally { this.sfxG = real; } };
SIREN.update = (function(orig){ return function(){ orig.call(this); this.v.forEach(s => { try{ s.g.gain.value = Math.min(s.g.gain.value, .045); }catch(e){} }); }; })(SIREN.update);
{ const soft = (fn, k) => { const o = AU[fn].bind(AU); AU[fn] = function(...a){ const c = this.ctx; if (!c) return; const tmp = c.createGain(); tmp.gain.value = k; const real = this.sfxG; this.sfxG = tmp; tmp.connect(real); try{ o(...a); } finally { this.sfxG = real; } }; };
  soft('thud', .55); soft('crash', .5); soft('whistle', .45); soft('beep', .5); soft('chime', .6); soft('door', .7); soft('crank', .7); soft('tick', .6); soft('staticBurst', .5); }
/* ---------------- coloured service bays on the road, like stop markers ---------------- */
function drawServiceBays(){ if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), car = G.car, t = G.time, pulse = .5 + .5 * Math.sin(t * 3.5);
 for (const p of W.poi || []){ if (p.x < x0 - 25 || p.x > x1 + 25) continue; const T = POI_T[p.type], col = T.col, rgbc = [1, 3, 5].map(i => parseInt(col.slice(i, i + 2), 16)).join(','), near = Math.abs(car.x - p.x) < 13;
  roadQuad(p.x - 11, p.x + 11, .5, -.16); ctx.fillStyle = `rgba(${rgbc},${near ? .32 : .14 + .08 * pulse})`; ctx.fill(); ctx.setLineDash([PPM * .45, PPM * .3]); ctx.lineWidth = Math.max(2, PPM * .07); ctx.strokeStyle = `rgba(${rgbc},.95)`; ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.font = `800 ${Math.max(12, PPM * .42)}px Lalezar, "Readex Pro", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = `rgba(${rgbc},.95)`; ctx.fillText(T.ic + '  ' + nm(T.n).toUpperCase(), sx(p.x), sy(terrH(p.x) + .17)); ctx.restore();
  // glowing post in the service colour
  const X = sx(p.x - 8), Y = sy(terrH(p.x - 8) + 1.9); const g = ctx.createLinearGradient(0, Y - PPM * 2.6, 0, Y); g.addColorStop(0, `rgba(${rgbc},0)`); g.addColorStop(1, `rgba(${rgbc},${.5 + .3 * pulse})`); ctx.fillStyle = g; ctx.fillRect(X - PPM * .1, Y - PPM * 2.6, PPM * .2, PPM * 2.6);
  if (!near && p.x > car.x) for (let k = 0; k < 4; k++){ const xk = p.x - 13 - ((t * 3.5 + k * 2.6) % 10.4); if (xk < x0) continue; const Xk = sx(xk), Yk = sy(terrH(xk) + .17), s = PPM * .28, al = clamp(1 - (p.x - 13 - xk) / 11, 0, 1); ctx.strokeStyle = `rgba(${rgbc},${al})`; ctx.lineWidth = Math.max(2, PPM * .08); ctx.beginPath(); ctx.moveTo(Xk - s, Yk - s); ctx.lineTo(Xk, Yk); ctx.lineTo(Xk - s, Yk + s); ctx.stroke(); } }
 for (const q of W.rests){ if (q.used || q.x < x0 - 25 || q.x > x1 + 25) continue; ctx.save(); ctx.font = `800 ${Math.max(12, PPM * .42)}px Lalezar, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(80,200,140,.95)'; ctx.fillText('🍽  ' + L2('استراحة', 'REST HOUSE'), sx(q.x), sy(terrH(q.x) + .17)); ctx.restore(); }
}
const _dw8 = drawWorld;
drawWorld = function(){ _dw8(); drawServiceBays(); };
/* make sure every service really has its building right at its bay */
const _v6w8 = v6world;
v6world = function(){ _v6w8(); for (const p of W.poi || []){ const w = (BH5[p.k] || 8) * META[p.k].w / META[p.k].h; W.deco = W.deco.filter(d => d === p.deco || d.x + d.w / 2 < p.x - w / 2 - .4 || d.x - d.w / 2 > p.x + w / 2 + .4); if (!W.deco.some(d => d.k === p.k && Math.abs(d.x - p.x) < 1)){ const d = {k:p.k, x:p.x, h:BH5[p.k] || 8, w}; W.deco.push(d); p.deco = d; } } if (G.mode === 'play') try{ buildTrack(); }catch(e){} };
/* progress-bar pins: services coloured like their bays */
POI_T.cafe.col = '#ffa53b'; POI_T.fuel.col = '#ff4d5e'; POI_T.shop.col = '#4aa8ff'; POI_T.store.col = '#3ddc84';
/* ---------------- LCDs: exact screen placement + auto-scaled text ---------------- */
(function fixLCD(){ const r = document.getElementById('radioLCD'); if (r) r.style.cssText = 'left:22.8%;right:30.4%;top:25.5%;bottom:39.5%'; })();
const _uh8 = updateHUD;
updateHUD = function(dt){ _uh8(dt); const rp = $('#radioP'), rl = $('#radioLCD'); if (rp && rl && rp.clientWidth){ rl.style.fontSize = Math.round(rp.clientWidth * .038) + 'px'; } const ap = $('#acP'), al = $('#acLCD'); if (ap && al && ap.clientWidth) al.style.fontSize = Math.round(ap.clientWidth * .036) + 'px'; };

/* ======================= career-fx.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v9 — Career mode · recorded ambience/horns/sirens ·
   calm notification sounds · directional lighting & light rays ·
   air particles · soft smoke · motion blur · g-force passengers ·
   dashboard speed-limit pin & integrated tell-tales
   ===================================================================== */
/* ---------------- recorded audio samples ---------------- */
const SND = {buf:{}, loading:false,
 load(){ if (this.loading || !AU.ctx) return; this.loading = true; ['snd_street','snd_rain','snd_h1','snd_h2','snd_h3','snd_h4','snd_h5','snd_pol','snd_amb'].forEach(k => { if (!ASSETS[k]) return; fetch(ASSETS[k]).then(r => r.arrayBuffer()).then(b => AU.ctx.decodeAudioData(b)).then(d => { this.buf[k] = d; }).catch(e => console.warn('snd', k, e)); }); },
 play(k, vol, rate, loop){ const c = AU.ctx, b = this.buf[k]; if (!c || !b) return null; const s = c.createBufferSource(); s.buffer = b; s.loop = !!loop; s.playbackRate.value = rate || 1; const g = c.createGain(); g.gain.value = vol; s.connect(g).connect(AU.sfxG); s.start(); return {s, g}; }
};
const _auInit9 = AU.init.bind(AU);
AU.init = function(){ _auInit9(); SND.load(); };
/* horns: the recorded set, calm levels; class-appropriate stock horn */
COS.horn = [{id:'stock', p:0, n:['الأصلي (حسب العربية)','Stock (matches vehicle)']}, {id:'gentle', p:250, n:['كلاكس هادي','Gentle sedan honk']}, {id:'double', p:300, n:['بيب بيب','Compact double beep']}, {id:'taxi', p:300, n:['كلاكس تاكسي قصير','Short taxi honk']}, {id:'low', p:450, n:['كلاكس عميق مهذب','Low polite honk']}, {id:'taps', p:350, n:['نقرتين خفاف','Two light taps']}];
const HORNK = {gentle:'snd_h1', double:'snd_h2', taxi:'snd_h3', low:'snd_h4', taps:'snd_h5'};
const _hornOld9 = AU.horn.bind(AU);
AU.horn = function(kind, big, vol){ let k = HORNK[kind], rate = 1; const v = vol == null ? 1 : vol;
 if (!k){ if (vol != null && vol < 1){ k = ['snd_h1','snd_h2','snd_h4','snd_h5'][(Math.random() * 4) | 0]; rate = .92 + Math.random() * .16; } else { const V = G.V || VEHS[0]; k = V.cls === 'micro' ? (V.id === 'coaster' ? 'snd_h1' : 'snd_h3') : 'snd_h4'; rate = V.cls === 'coach' ? .8 : V.cls === 'bus' ? .86 : 1; } }
 if (!SND.play(k, .5 * v, rate)) _hornOld9(kind, big, v * .6); };
/* sirens: looping recordings with distance, stereo and doppler */
SIREN.update = function(){ const c = AU.ctx; if (!c || G.mode !== 'play' || G.paused) return; const car = G.car, live = new Set();
 for (const a of G.ai){ if (!a.siren) continue; const d = Math.abs(a.x - car.x); if (d > 240) continue; const k = a.siren === 'amb' ? 'snd_amb' : 'snd_pol'; if (!SND.buf[k]) continue; live.add(a); let s = this.v.get(a);
  if (!s){ const p = SND.play(k, 0, 1, true); if (!p) continue; const pan = c.createStereoPanner ? c.createStereoPanner() : null; if (pan){ p.g.disconnect(); p.g.connect(pan).connect(AU.sfxG); } s = {o:p.s, g:p.g, pan}; this.v.set(a, s); }
  const rel = (a.vx - car.vx) * Math.sign(car.x - a.x); s.o.playbackRate.setTargetAtTime(clamp(343 / (343 - clamp(rel, -30, 30)), .9, 1.1), c.currentTime, .1);
  s.g.gain.setTargetAtTime(.16 * Math.pow(clamp(1 - d / 240, 0, 1), 1.5), c.currentTime, .15); if (s.pan) s.pan.pan.setTargetAtTime(clamp((a.x - car.x) / 70, -1, 1), c.currentTime, .1); }
 this.v.forEach((s, a) => { if (!live.has(a)){ s.g.gain.setTargetAtTime(0, c.currentTime, .15); try{ s.o.stop(c.currentTime + .6); }catch(e){} this.v.delete(a); } }); };
/* ambience: recorded calm Egyptian street + rain on the roof; procedural beds reduced to wind/sea only */
const AMB9 = {street:null, rain:null};
const _ambU9 = AMBI.update.bind(AMBI);
AMBI.update = function(dt){ _ambU9(dt); const c = AU.ctx; if (!c) return; const n = this.n; if (n){ n.city.g.gain.value = 0; n.crowd.g.gain.value = 0; } this.bird = this.horn = 1e9;
 const on = G.mode === 'play' && !G.paused, urban = on ? W.biome.urban : 0, amb = setv('amb');
 if (SND.buf.snd_street && !AMB9.street) AMB9.street = SND.play('snd_street', 0, 1, true);
 if (SND.buf.snd_rain && !AMB9.rain) AMB9.rain = SND.play('snd_rain', 0, 1, true);
 if (AMB9.street) AMB9.street.g.gain.setTargetAtTime(on ? amb * (.12 + urban * .3) * (G.tod === 'night' ? .7 : 1) : 0, c.currentTime, .8);
 if (AMB9.rain) AMB9.rain.g.gain.setTargetAtTime(on && G.weather === 'rain' ? .42 * Math.max(.4, S.set.sfx) : 0, c.currentTime, .8); };
const _eng9 = AU.engine.bind(AU);
AU.engine = function(on, rpm, load, speed, big){ _eng9(on, rpm, load, speed, big, false); };
{ const _aiu = AISND.update.bind(AISND); AISND.update = function(){ _aiu(); if (this.v) this.v.forEach(v => { v.g.gain.value *= .6; v.g2.gain.value *= .6; }); }; }
/* ---------------- calm, topic-aware notification sounds ---------------- */
AU.mallet = function(f, t0, g, dur){ const c = this.ctx; if (!c) return; const t = c.currentTime + (t0 || 0); [1, 2.01, 3.98].forEach((m, i) => { const o = c.createOscillator(), gg = c.createGain(); o.type = 'sine'; o.frequency.value = f * m; gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime((g || .05) / (1 + i * 2.5), t + .008); gg.gain.exponentialRampToValueAtTime(.0001, t + (dur || .9) / (1 + i)); o.connect(gg).connect(this.sfxG); o.start(t); o.stop(t + (dur || .9) + .05); }); };
let lastNote9 = 0;
function notifySound(msg, cls){ if (!AU.ctx) return; const now = performance.now(); if (now - lastNote9 < 280) return; lastNote9 = now; const m = String(msg);
 if (/🚨|👮|🛑/.test(m)) { AU.mallet(523, 0, .04); AU.mallet(392, .16, .04); return; }
 if (/⛽|🛢/.test(m)) { AU.tone(420, .18, 'sine', .03, 0, 380); AU.tone(560, .14, 'sine', .02, .12, 300); return; }
 if (/☕|🫖|🥙/.test(m)) { AU.mallet(1568, 0, .025, .35); AU.mallet(2093, .09, .02, .3); return; }
 if (/🔥|😴/.test(m)) { AU.mallet(220, 0, .05, 1.2); AU.mallet(233, .02, .03, 1.2); return; }
 if (/⭐|🏅|🎉|🪪|🎖/.test(m)) { [784, 988, 1175, 1568].forEach((f, i) => AU.mallet(f, i * .07, .03, .6)); return; }
 if (/🛣|💰|\+/.test(m) && cls !== 'bad') { AU.mallet(1319, 0, .03, .4); AU.mallet(1760, .07, .025, .45); return; }
 if (cls === 'good') { AU.mallet(659, 0, .035); AU.mallet(784, .09, .035); AU.mallet(988, .18, .03); }
 else if (cls === 'bad') { AU.mallet(330, 0, .04, 1); AU.mallet(262, .14, .035, 1.1); }
 else { AU.mallet(880, 0, .03, .7); AU.mallet(1320, .05, .015, .6); } }
const _toast9 = toastUI;
toastUI = function(msg, cls, acts, life){ if (G.career && msg === t('testDrive')) return; _toast9(msg, cls, acts, life); try{ notifySound(msg, cls); }catch(e){} };
/* ---------------- pedestrians: clean walk cycles only (no split/partial frames) ---------------- */
(function cleanPeds(){ META.peds = META.peds.map(fr => { const ws = fr.map(f => META[f].w).sort((a, b) => a - b), mw = ws[ws.length >> 1]; const ok = fr.filter(f => META[f].h > 150 * .86 && META[f].w > mw * .55 && META[f].w < mw * 1.8); return ok.length >= 4 ? ok : fr; }); })();
/* ---------------- police checkpoint stop mark ---------------- */
function drawCheckpointMarks(){ if (G.mode !== 'play' || !G.car) return; const [x0, x1] = viewX(), t = G.time, pulse = .5 + .5 * Math.sin(t * 5);
 for (const c of W.cps){ if (c.x < x0 - 30 || c.x > x1 + 30) continue; const a = c.x - 18, b = c.x - 4, act = c.state === 'signal' || c.state === 'check';
  roadQuad(a, b + .4, .5, -.16); ctx.fillStyle = `rgba(230,40,50,${act ? .22 + .15 * pulse : .14})`; ctx.fill(); ctx.setLineDash([PPM * .45, PPM * .3]); ctx.lineWidth = Math.max(2, PPM * .07); ctx.strokeStyle = 'rgba(255,70,80,.95)'; ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.font = `900 ${Math.max(13, PPM * .5)}px Lalezar, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fillText('قف  STOP', sx((a + b) / 2), sy(terrH((a + b) / 2) + .17)); ctx.restore();
  // octagon stop sign on the kerb
  const X = sx(c.x - 17), Y = sy(terrH(c.x - 17) + 1.95), pole = PPM * 2.3, r = clamp(PPM * .42, 12, 24); ctx.fillStyle = '#7a828c'; ctx.fillRect(X - PPM * .05, Y - pole, PPM * .1, pole);
  ctx.save(); ctx.translate(X, Y - pole - r * .6); ctx.beginPath(); for (let i = 0; i < 8; i++){ const an = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fillStyle = '#c8102e'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = `900 ${r * .62}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('قف', 0, 1); ctx.restore(); } }
/* ---------------- realistic under-glow: cast on the ground ---------------- */
function drawUnderglow(){ const car = G.car; if (!car || !car.glowCol) return; const w = car.wh, x0 = Math.min(...w.map(q => q.x)) - .4, x1 = Math.max(...w.map(q => q.x)) + .4, cx = (x0 + x1) / 2, X = sx(cx), Y = sy(terrH(cx)) + 1, rw = (x1 - x0) / 2 * PPM;
 ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(X, Y); ctx.scale(1, .1); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rw); g.addColorStop(0, car.glowCol + '88'); g.addColorStop(.6, car.glowCol + '33'); g.addColorStop(1, car.glowCol + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rw, 0, 7); ctx.fill(); ctx.restore(); }
/* ---------------- passengers react to g-forces ---------------- */
function paxView(){ const cap = G.V.seats; G.onboard.forEach((p, i) => { p.st = i >= cap; }); return G.onboard; }
function gforceStep(dt){ const car = G.car; if (!car || dt <= 0) return; const ax = (car.vx - (G._gvx || 0)) / dt, ay = (car.vy - (G._gvy || 0)) / dt; G._gvx = car.vx; G._gvy = car.vy;
 const axs = clamp(ax, -12, 12), ays = clamp(ay, -20, 20);
 G.onboard.forEach((p, i) => { const k = p.st ? 18 : 30, c = p.st ? 3.2 : 5.5, m = .8 + ((p.t * 37 + i) % 10) / 25; p._sx = p._sx || 0; p._vx = p._vx || 0; p._sy = p._sy || 0; p._vy = p._vy || 0;
  const tx = -axs * (p.st ? .022 : .012) * m, ty = -ays * .004; p._vx += (k * (tx - p._sx) - c * p._vx) * dt; p._sx = clamp(p._sx + p._vx * dt, -.25, .25); p._vy += (40 * (ty - p._sy) - 7 * p._vy) * dt; p._sy = clamp(p._sy + p._vy * dt, -.08, .08); }); }
const CABB = {};
function cabinCanvas(V, cos, pax, forPreview){ const K = cabinMask(V), bkey = V.id + '|' + cos.tint + '|' + (cos.curtain || 'none');
 let B = CABB[V.id]; if (!B || B.key !== bkey){ const base = document.createElement('canvas'); base.width = K.w; base.height = K.h; const x = base.getContext('2d'), ppm = K.w / V.len;
  const g = x.createLinearGradient(0, K.top, 0, K.sill); g.addColorStop(0, '#2b3138'); g.addColorStop(1, '#161a1f'); x.fillStyle = g; x.fillRect(0, 0, K.w, K.h);
  const zone = K.maxX - K.minX, slotW = .62 * ppm, slots = Math.max(2, Math.floor(zone / slotW)); x.fillStyle = V.cls === 'coach' ? '#28406e' : '#3b3f46'; for (let i = 0; i < slots; i++){ const sx2 = K.minX + (i + .5) * zone / slots; x.beginPath(); x.roundRect ? x.roundRect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm, 4) : x.rect(sx2 - slotW * .28, K.sill - .45 * ppm, slotW * .5, .5 * ppm); x.fill(); }
  const over = document.createElement('canvas'); over.width = K.w; over.height = K.h; const o = over.getContext('2d');
  const CU = {red:['#8e1b2c','#e0b04a'], blue:['#1d3f8a','#d9d9d9'], green:['#1f6b3a','#e0b04a'], gold:['#b8862e','#fff1b8']}[cos.curtain];
  if (CU){ for (let i = 0; i <= slots; i++){ const cx2 = K.minX + i * zone / slots; o.fillStyle = CU[0]; o.beginPath(); o.moveTo(cx2 - slotW * .22, K.top); o.quadraticCurveTo(cx2 - slotW * .05, (K.top + K.sill) / 2, cx2 - slotW * .14, K.sill); o.lineTo(cx2 + slotW * .14, K.sill); o.quadraticCurveTo(cx2 + slotW * .05, (K.top + K.sill) / 2, cx2 + slotW * .22, K.top); o.fill(); o.fillStyle = CU[1]; o.fillRect(cx2 - slotW * .22, K.top, slotW * .44, ppm * .05); } o.fillStyle = CU[0]; o.fillRect(K.minX, K.top, zone, ppm * .08); }
  const TA = (COS.tint.find(q => q.id === cos.tint) || {a:0}).a; o.fillStyle = `rgba(14,20,28,${.12 + TA * .85})`; o.fillRect(0, 0, K.w, K.h);
  const rg = o.createLinearGradient(0, K.top, K.w * .25, K.sill); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(.45, `rgba(255,255,255,${.16 - TA * .08})`); rg.addColorStop(.55, 'rgba(255,255,255,.02)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); o.fillStyle = rg; o.fillRect(0, 0, K.w, K.h);
  const dyn = document.createElement('canvas'); dyn.width = K.w; dyn.height = K.h; B = CABB[V.id] = {key:bkey, base, over, dyn, slots, zone, ppm}; }
 const x = B.dyn.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, K.w, K.h); x.drawImage(B.base, 0, 0);
 const seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st), order = []; for (let i = 0; i < B.slots; i++) order.push(i); order.sort((a, b) => ((a * 7) % B.slots) - ((b * 7) % B.slots));
 const drawP = (p, px, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const H = (p.h || 1.7) * B.ppm * pedRel(p.t, im), W2 = im.width / im.height * H, headTop = K.sill - (stand ? 1.05 : .55) * B.ppm; const ox = (p._sx || 0) * B.ppm, oy = (p._sy || 0) * B.ppm;
  x.save(); x.translate(px + ox, headTop + oy + H); x.rotate(clamp((p._sx || 0) * .9, -.2, .2)); const fl = !forPreview && wantsOff(p) && Math.floor(G.time * 4) % 2 === 0; if (fl) x.filter = 'brightness(1.6) sepia(.9) saturate(3.5) hue-rotate(-8deg) drop-shadow(0 0 3px #ffd35a)'; x.drawImage(im, -W2 / 2, -H, W2, H); x.filter = 'none'; x.restore(); };
 seated.slice(0, B.slots).forEach((p, i) => drawP(p, K.minX + (order[i] + .5) * B.zone / B.slots, false));
 standing.slice(0, Math.max(1, B.slots >> 1)).forEach((p, i) => drawP(p, K.minX + B.zone * (.3 + .4 * ((i * .37) % 1)), true));
 x.drawImage(B.over, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0); x.globalCompositeOperation = 'source-over';
 return B.dyn; }
for (const k in CAB) delete CAB[k];
/* ---------------- directional lighting, light rays, bloom ---------------- */
let LCV9 = null;
function drawNight(){
 const tod = G.tod, dark = tod === 'night' ? .6 : tod === 'sunset' ? .16 : 0, [x0, x1] = viewX(), car = G.car;
 if (dark > 0){ if (!LCV9) LCV9 = document.createElement('canvas'); if (LCV9.width !== cv.width || LCV9.height !== cv.height){ LCV9.width = cv.width; LCV9.height = cv.height; }
  const l = LCV9.getContext('2d'); l.setTransform(DPR, 0, 0, DPR, 0, 0); l.globalCompositeOperation = 'source-over'; l.clearRect(0, 0, VW, VH); l.fillStyle = `rgba(4,8,22,${dark})`; l.fillRect(0, 0, VW, VH); l.globalCompositeOperation = 'destination-out';
  const hole = (x, y, r, a) => { const g = l.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.arc(x, y, r, 0, 7); l.fill(); };
  const cone = (x, y, dx, len, w0, w1, a) => { const g = l.createLinearGradient(x, y, x + dx * len, y); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = g; l.beginPath(); l.moveTo(x, y - w0); l.lineTo(x + dx * len, y - w1 * .35); l.lineTo(x + dx * len, y + w1); l.lineTo(x, y + w0); l.fill(); };
  for (const p of W.props) if ((p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') && p.x > x0 && p.x < x1){ const hx = sx(p.x + (p.k === 'lamp' ? .9 : 0)), hy = sy(terrH(p.x) + 1.95 + PROP_H[p.k] * .95), gy = sy(terrH(p.x) + .3); l.fillStyle = 'rgba(0,0,0,.55)'; l.beginPath(); l.moveTo(hx - PPM * .3, hy); l.lineTo(hx - PPM * 3, gy); l.lineTo(hx + PPM * 3, gy); l.lineTo(hx + PPM * .3, hy); l.fill(); hole(hx, gy, PPM * 3.5, .7); hole(hx, hy, PPM * 1.2, .9); }
  for (const d of W.deco) if (d.x > x0 - 10 && d.x < x1 + 10) hole(sx(d.x), sy(terrH(d.x) + 2.6), d.w * PPM * .5, .35);
  for (const c of [car, ...G.ai]){ if (!c) continue; const M = META[c.spr], dir = c.mirror ? -1 : 1, lift = c.lift || 0; const k = PPM * c.g.s, hlx = (M.hl[0] - M.w / 2) * k * dir, hly = (M.hl[1] - M.h / 2) * k, ca = Math.cos(-c.a), sa = Math.sin(-c.a); const X = sx(c.x) + hlx * ca - hly * sa, Y = sy(c.y + lift) + hlx * sa + hly * ca;
   if (c.headOn !== false && !c.brokenHL){ cone(X, Y, dir, PPM * (c.player ? 24 : 16), PPM * .25, PPM * 3.2, .95); hole(X, Y, PPM * 1.1, .9); } }
  ctx.drawImage(LCV9, 0, 0, VW, VH);
 }
 // additive colour light: headlight rays & bloom, lamp spots, shop glows, brake reflections
 ctx.save(); ctx.globalCompositeOperation = 'lighter'; const nightK = tod === 'night' ? 1 : tod === 'sunset' ? .45 : .12;
 for (const c of [car, ...G.ai]){ if (!c || c.brokenHL) continue; if (!(c.headOn || tod !== 'day')) continue; const M = META[c.spr], dir = c.mirror ? -1 : 1, lift = c.lift || 0, k = PPM * c.g.s * (c.lift ? .92 : 1), hlx = (M.hl[0] - M.w / 2) * k * dir, hly = (M.hl[1] - M.h / 2) * k, ca = Math.cos(-c.a), sa = Math.sin(-c.a), X = sx(c.x) + hlx * ca - hly * sa, Y = sy(c.y + lift) + hlx * sa + hly * ca, col = c.lightCol || '255,236,190';
  if (nightK < .3) continue; const b = ctx.createRadialGradient(X, Y, 0, X, Y, PPM * .9); b.addColorStop(0, `rgba(${col},${.55 * nightK})`); b.addColorStop(.25, `rgba(${col},${.18 * nightK})`); b.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = b; ctx.beginPath(); ctx.arc(X, Y, PPM * .9, 0, 7); ctx.fill();
  if (nightK > .3){ ctx.save(); ctx.translate(X, Y); ctx.rotate(-c.a); for (let r = 0; r < 4; r++){ const ang = (r - 1.5) * .045, len = PPM * (c.player ? 20 : 13); const g = ctx.createLinearGradient(0, 0, dir * len, 0); g.addColorStop(0, `rgba(${col},${.07 * nightK})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -1.5); ctx.lineTo(dir * len * Math.cos(ang), len * Math.sin(ang) - PPM * .5); ctx.lineTo(dir * len * Math.cos(ang), len * Math.sin(ang) + PPM * .9); ctx.lineTo(0, 1.5); ctx.fill(); } ctx.restore(); }
  if (c.braking && nightK > .3){ const tl = M.tl, tx2 = (tl[0] - M.w / 2) * k * dir, ty2 = (tl[1] - M.h / 2) * k, TX = sx(c.x) + tx2 * ca - ty2 * sa, TY = sy(c.y + lift) + tx2 * sa + ty2 * ca, gy = sy(terrH(c.x - dir * c.L / 2) + lift); const g = ctx.createRadialGradient(TX, gy, 0, TX, gy, PPM * 2.2); g.addColorStop(0, `rgba(255,30,30,${.28 * nightK})`); g.addColorStop(1, 'rgba(255,30,30,0)'); ctx.fillStyle = g; ctx.fillRect(TX - PPM * 2.2, gy - PPM * .5, PPM * 4.4, PPM * 1); } }
 if (nightK > .3){ for (const p of W.props){ if (!(p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') || p.x < x0 || p.x > x1) continue; const hx = sx(p.x + (p.k === 'lamp' ? .9 : 0)), hy = sy(terrH(p.x) + 1.95 + PROP_H[p.k] * .95), gy = sy(terrH(p.x) + .3); const g = ctx.createLinearGradient(0, hy, 0, gy); g.addColorStop(0, `rgba(255,205,140,${.2 * nightK})`); g.addColorStop(1, `rgba(255,205,140,${.04 * nightK})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx - PPM * .25, hy); ctx.lineTo(hx - PPM * 2.8, gy); ctx.lineTo(hx + PPM * 2.8, gy); ctx.lineTo(hx + PPM * .25, hy); ctx.fill(); const pool = ctx.createRadialGradient(hx, gy, 0, hx, gy, PPM * 3.2); pool.addColorStop(0, `rgba(255,190,120,${.16 * nightK})`); pool.addColorStop(1, 'rgba(255,190,120,0)'); ctx.save(); ctx.translate(hx, gy); ctx.scale(1, .25); ctx.translate(-hx, -gy); ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(hx, gy, PPM * 3.2, 0, 7); ctx.fill(); ctx.restore(); }
  for (const d of W.deco){ if (d.x < x0 - 10 || d.x > x1 + 10) continue; const tint = /Pharm|Labs|Hosp|Metro/.test(d.k) ? '90,220,200' : /Kosh|Foul|Grill|Ahwa|Cafe|Rest|Sweets/.test(d.k) ? '255,170,90' : /Bank|Office|Mobiles/.test(d.k) ? '150,190,255' : '255,210,150'; const gx = sx(d.x), gy = sy(terrH(d.x) + 2.4), r = d.w * PPM * .55; const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); g.addColorStop(0, `rgba(${tint},${.16 * nightK})`); g.addColorStop(1, `rgba(${tint},0)`); ctx.fillStyle = g; ctx.fillRect(gx - r, gy - r, r * 2, r * 1.3); }
  for (const l of W.lights){ if (l.x < x0 || l.x > x1) continue; const st = lightState(l), col = st === 'g' ? '40,255,120' : st === 'y' ? '255,190,40' : '255,50,50', gx = sx(l.x + 1), gy = sy(terrH(l.x) + .4), g = ctx.createRadialGradient(gx, gy, 0, gx, gy, PPM * 2.6); g.addColorStop(0, `rgba(${col},${.18 * nightK})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(gx - PPM * 2.6, gy - PPM * .8, PPM * 5.2, PPM * 1.6); } }
 ctx.restore();
 // daytime / sunset god rays from the sun
 if (tod !== 'night' && S.set.gfx !== 'low' && typeof drawSunRays === 'function') drawSunRays();
}
/* ---------------- lightweight air particles ---------------- */
const MOTES = Array.from({length:70}, (_, i) => ({x:hash(i * 3), y:hash(i * 7 + 1), z:.3 + hash(i * 11) * .9, s:.6 + hash(i * 13) * 1.6, ph:hash(i * 17) * 6.28}));
function drawMotes(){ if (S.set.gfx === 'low') return; const night = G.tod === 'night', t = G.time, col = night ? '190,210,255' : G.weather === 'sand' ? '230,190,130' : '255,245,220';
 ctx.save(); for (const m of MOTES){ let x = (m.x * VW * 1.3 - cam.x * PPM * .05 * m.z + t * 8 * m.z) % (VW * 1.3); if (x < 0) x += VW * 1.3; x -= VW * .15; const y = (m.y * VH + Math.sin(t * .4 + m.ph) * 14 * m.z) % VH; const a = (.08 + .14 * m.z) * (.6 + .4 * Math.sin(t * .9 + m.ph)); ctx.fillStyle = `rgba(${col},${a})`; ctx.beginPath(); ctx.arc(x, y, m.s * m.z, 0, 7); ctx.fill(); } ctx.restore(); }
/* ---------------- soft, realistic smoke & particles ---------------- */
const SOFT = new Map();
function softTex(col){ let c = SOFT.get(col); if (c) return c; c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, col); g.addColorStop(.45, col.replace(/rgb\(([^)]+)\)/, 'rgba($1,.55)')); g.addColorStop(1, col.replace(/rgb\(([^)]+)\)/, 'rgba($1,0)')); x.fillStyle = g; x.fillRect(0, 0, 64, 64); if (SOFT.size > 60) SOFT.clear(); SOFT.set(col, c); return c; }
const hex2rgb = h => h[0] === '#' ? `rgb(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)})` : h;
const FIRECOL = /#ff7b00|#ffb300|#ff3b00|#FFD24A/i;
function puff(x, y, vx, vy, life, size, col, kind){ if (PARTS.length > (S.set.gfx === 'low' ? 140 : 480)) return; PARTS.push({x, y, vx, vy, life, max:life, size, s0:size, col, kind, rot:Math.random() * 6.28, spin:(Math.random() - .5) * 1.5, seed:Math.random() * 100, fire:FIRECOL.test(col)}); }
function updParts(dt){
 for (let i = PARTS.length - 1; i >= 0; i--){ const p = PARTS[i]; p.life -= dt; if (p.life <= 0){ PARTS.splice(i, 1); continue; } const age = 1 - p.life / p.max;
  if (p.kind === 'spark' || p.kind === 'glass' || p.kind === 'drop'){ p.vy -= 9.8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; const gy = terrH(p.x); if (p.y < gy){ p.y = gy; p.vy *= -.35; p.vx *= .6; } }
  else { const turb = Math.sin(G.time * 2.3 + p.seed) * .6 + Math.sin(G.time * 5.1 + p.seed * 2) * .25; p.vx = p.vx * (1 - dt * .9) + turb * dt; p.vy = p.vy * (1 - dt * .4) + (p.kind === 'smoke' ? (p.fire ? 1.6 : .45) : .05) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.size = p.s0 * (1 + age * (p.kind === 'dust' ? 3.2 : p.fire ? 1.2 : 4)); p.rot += p.spin * dt; } }
 for (let i = FLOATS.length - 1; i >= 0; i--){ const f = FLOATS[i]; f.life -= dt; f.y += dt * 1.2; if (f.life <= 0) FLOATS.splice(i, 1); }
}
function drawParts(){
 for (const p of PARTS){ const X = sx(p.x), Y = sy(p.y); if (X < -100 || X > VW + 100) continue; const age = 1 - p.life / p.max;
  if (p.kind === 'spark'){ ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,${180 - age * 120 | 0},60,${1 - age})`; ctx.lineWidth = Math.max(1, PPM * .035); ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - p.vx * PPM * .035, Y + p.vy * PPM * .035); ctx.stroke(); ctx.restore(); continue; }
  if (p.kind === 'drop'){ ctx.strokeStyle = `rgba(215,232,250,${(1 - age) * .75})`; ctx.lineWidth = Math.max(1.5, PPM * .04); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - p.vx * PPM * .035, Y + p.vy * PPM * .035); ctx.stroke(); continue; }
  if (p.kind === 'glass'){ ctx.fillStyle = `rgba(220,240,255,${1 - age})`; ctx.fillRect(X, Y, 2, 2); continue; }
  const a = p.fire ? (1 - age) * .9 : (age < .12 ? age / .12 : 1 - (age - .12) / .88) * (p.kind === 'dust' ? .35 : .55), r = Math.max(2, p.size * PPM * 1.3);
  ctx.save(); if (p.fire) ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(X, Y); ctx.rotate(p.rot); ctx.drawImage(softTex(hex2rgb(p.col)), -r, -r, r * 2, r * 2); ctx.restore(); }
 ctx.globalAlpha = 1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 for (const f of FLOATS){ ctx.globalAlpha = clamp(f.life, 0, 1); ctx.font = `${Math.max(16, PPM * .55)}px Lalezar, sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(f.txt, sx(f.x), sy(f.y)); ctx.fillStyle = f.col; ctx.fillText(f.txt, sx(f.x), sy(f.y)); }
 ctx.globalAlpha = 1;
}
/* ---------------- subtle motion blur (background streak at speed) ---------------- */
let MB9 = null, MBX = 0;
function motionBlur(){ if (S.set.gfx === 'low' || !G.car) return; const sp = speedOf(G.car); if (!MB9){ MB9 = document.createElement('canvas'); } const w = Math.round(cv.width / 2), h = Math.round(cv.height / 2); if (MB9.width !== w){ MB9.width = w; MB9.height = h; }
 const dx = (cam.x - MBX) * PPM; MBX = cam.x; if (sp > 7 && Math.abs(dx) < 60){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp((sp - 7) / 60, 0, .22); ctx.drawImage(MB9, dx * DPR * .6, 0, cv.width, cv.height); ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
 MB9.getContext('2d').drawImage(cv, 0, 0, w, h); }
/* ---------------- render pipeline additions ---------------- */
const _dw9 = drawWorld;
drawWorld = function(){ _dw9(); drawCheckpointMarks(); drawUnderglow(); };
const _render9 = render;
render = function(){ _render9(); try{ ctx.setTransform(DPR, 0, 0, DPR, 0, 0); drawMotes(); motionBlur(); }catch(e){ reportErr('fx9', e); } };
/* ---------------- per-frame (g-force, underglow colour) ---------------- */
const _upd9 = update;
update = function(dt){ _upd9(dt); if (G.mode !== 'play') return; gforceStep(dt); const car = G.car; if (car.glow){ car.glowCol = car.glow; car.glow = null; } };
/* ---------------- AI obeys every traffic light, in every lane ---------------- */
/* (patched in realism.js: the light check now applies to all AI regardless of lane) */
/* ---------------- dashboard: speed-limit pin + integrated tell-tales ---------------- */
const _dc9 = drawCluster;
drawCluster = function(){ _dc9(); const c = $('#cluster'), W2 = c.clientWidth, H2 = c.clientHeight, car = G.car; if (!W2 || !car) return; const x = c.getContext('2d');
 const lim = curLimit(car.x), ang = (-113 + clamp(lim / 160, 0, 1) * 228) * Math.PI / 180, cx = W2 * .234, cy = H2 * .635, R = W2 * .145;
 x.save(); x.translate(cx, cy); x.rotate(ang); x.fillStyle = '#ff3b3b'; x.shadowColor = '#ff3b3b'; x.shadowBlur = 6; x.beginPath(); x.moveTo(0, -R - W2 * .004); x.lineTo(-W2 * .009, -R - W2 * .022); x.lineTo(W2 * .009, -R - W2 * .022); x.closePath(); x.fill(); x.restore();
 const sxl = W2 * .305, syl = H2 * .87, rr = H2 * .075; x.save(); x.fillStyle = '#fff'; x.strokeStyle = '#d91c2c'; x.lineWidth = rr * .28; x.beginPath(); x.arc(sxl, syl, rr, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#111'; x.font = `800 ${rr * .95}px "Readex Pro", sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lim, sxl, syl + 1); if (speedOf(car) * 3.6 > lim + 3){ x.strokeStyle = 'rgba(255,40,40,' + (.5 + .5 * Math.sin(G.time * 8)) + ')'; x.lineWidth = 2; x.beginPath(); x.arc(sxl, syl, rr * 1.35, 0, 7); x.stroke(); } x.restore();
 const blink = Math.floor(G.time * 2.2) % 2 === 0, TT = [['💡', !!car.headOn, '#3d8bff'], ['CC', !!G.cruise, '#3dff8a'], ['❄', !!G.ac, '#46c8ff'], ['ABS', car.absT > 0, '#ffb300'], ['TC', car.tcT > 0, '#ffb300'], ['⚠', car.haz && blink, '#ffb300'], ['⛽', G.fuel < G.fuelMax * .12, '#ffb300'], ['🌡', G.temp > 108, '#ff3b3b'], ['🛢', G.cond && G.cond.oil < 15, '#ff3b3b'], ['🛞', car.wh.some(w => w.flat), '#ffb300'], ['😴', (S.fatigue || 0) > 65, '#ff9a3b']];
 x.save(); x.textAlign = 'center'; x.textBaseline = 'middle'; const fs = H2 * .06; TT.forEach(([s, on, col], i) => { const left = i < 5, j = left ? i : i - 5, n = left ? 5 : 6, gx = left ? W2 * (.13 + j * .036) : W2 * (.69 + j * .03), gy = H2 * .955; x.globalAlpha = on ? 1 : .16; x.font = `800 ${fs * (s.length > 1 && !/\p{Emoji}/u.test(s) ? .75 : 1)}px "Readex Pro", sans-serif`; x.fillStyle = on ? col : '#9aa'; if (on){ x.shadowColor = col; x.shadowBlur = 6; } x.fillText(s, gx, gy); x.shadowBlur = 0; }); x.restore(); };
{ const tt = document.getElementById('tt'); if (tt) tt.style.display = 'none'; const st = document.createElement('style'); st.textContent = '#tt{display:none!important}'; document.head.appendChild(st); }
/* ===================================================================
   CAREER MODE — Ograaa Transport Co.
   =================================================================== */
const CAREER_N = [
 {id:'c0', x:800, y:500, big:true, v:'hiace', t:['سواق تحت التدريب','Trainee Driver'], d:['أول يوم في شركة أجرة للنقل. ميكروباص الشركة وتحت عين المشرف.','Day one at Ograaa Transport Co. — company microbus, supervisor watching.'], req:[['lic','micro']], pre:[], rw:{sal:180, com:.08, veh:['hiace']}},
 {id:'n1', x:1020, y:500, v:'hiace', t:['سواق خط ميكروباص','Microbus Line Driver'], d:['خطك الثابت ورقمك في الموقف.','Your own line and a number at the terminal.'], req:[['shifts',3],['stars2',2]], pre:['c0'], rw:{sal:260, com:.12}},
 {id:'n2', x:600, y:380, v:'fiat128', t:['رخصة تاكسي سرفيس','Service Taxi Endorsement'], d:['الفيات ١٢٨ بتاعت الشركة للمشاوير القصيرة.','The company Fiat 128 for short service runs.'], req:[['clean',2]], pre:['c0'], rw:{sal:200, com:.1, veh:['fiat128']}},
 {id:'n13', x:420, y:260, v:'minivan', t:['سرفيس الميني فان','Minivan Express'], d:['٧ ركاب وسرعة وتوفير.','Seven seats, speed and economy.'], req:[['perfect',10]], pre:['n2'], rw:{sal:240, com:.12, veh:['minivan']}},
 {id:'n3', x:960, y:320, v:'hiace', night:true, t:['شهادة الوردية الليلي','Night Shift Endorsement'], d:['ورديات بالليل بحافز ٢٥٪.','Night shifts with a 25% allowance.'], req:[['night',2]], pre:['n1'], rw:{perk:'night'}},
 {id:'n4', x:960, y:690, v:'hiace', t:['نجمة الأمان','Safety Star'], d:['٥ ورديات من غير ولا مخالفة.','Five shifts without a single fine.'], req:[['clean',5]], pre:['n1'], rw:{bonus:40}},
 {id:'n5', x:1240, y:410, v:'coaster', t:['كابتن ميني باص','Minibus Captain'], d:['الكوستر وخطوط أطول.','The Coaster and longer lines.'], req:[['level',3],['exam','m4']], pre:['n1'], rw:{sal:380, com:.12, veh:['coaster']}},
 {id:'n6', x:1430, y:560, v:'redbus', t:['سواق أتوبيس المدينة','City Bus Driver'], d:['درجة تانية وأول أتوبيس.','Grade 2 and your first bus.'], req:[['lic','bus'],['exam','b1']], pre:['n5'], rw:{sal:600, com:.1, veh:['redbus']}},
 {id:'n7', x:1380, y:790, v:'mcv', t:['سواق نقل عام أول','Senior Public Transport'], d:['الأتوبيس الأزرق وخطوط التحرير.','The blue bus and the Tahrir lines.'], req:[['bus',8]], pre:['n6'], rw:{sal:780, com:.1, veh:['mcv']}},
 {id:'n10', x:1120, y:880, v:'mcv', t:['مشرف خط','Line Supervisor'], d:['بتشرف على ٦ سواقين — مكافأة يومية.','You supervise six drivers — daily bonus.'], req:[['shifts',30]], pre:['n7'], rw:{bonus:300, perk:'daily'}},
 {id:'n8', x:1560, y:300, v:'coachB', t:['كابتن أتوبيس سفر','Intercity Coach Captain'], d:['درجة أولى وطرق السفر.','Grade 1 and the highways.'], req:[['lic','coach'],['exam','c1']], pre:['n7'], rw:{sal:1150, com:.08, veh:['coachB']}},
 {id:'n9', x:1480, y:110, v:'coachO', t:['كابتن السفر الفاخر','Luxury Coach Captain'], d:['رحلات الغردقة وشرم.','Hurghada and Sharm runs.'], req:[['rating',4.6],['exam','c3']], pre:['n8'], rw:{sal:1600, com:.08, veh:['coachO']}},
 {id:'n11', x:1180, y:170, v:'coachO', t:['مدير الأسطول','Fleet Manager'], d:['بتدير أسطول الشركة كله.','You run the whole company fleet.'], req:[['earned',150000]], pre:['n9','n10'], rw:{sal:2600, perk:'daily'}},
 {id:'n12', x:820, y:120, v:'coachB', t:['شريك في الشركة','Company Partner'], d:['نسبة ١٥٪ من كل مكسب بتعمله.','15% share on everything you earn.'], req:[['perfect',100]], pre:['n11'], rw:{perk:'partner'}}
];
const CN = id => CAREER_N.find(n => n.id === id);
const CR = () => S.career || (S.career = {joined:false, done:{}, exams:{}, shifts:0, stars2:0, clean:0, night:0, bus:0, coach:0, earned:0, perf:[], day:''});
function careerVal(k){ const c = CR(); return k === 'perfect' ? (S.stats.perfect || 0) : k === 'level' ? lvlOf(S.xp).l : k === 'rating' ? S.stats.rating : k === 'earned' ? c.earned : c[k] || 0; }
function reqMet(r){ const [k, v] = r; if (k === 'lic') return hasLic(v); if (k === 'exam') return !!CR().exams[v]; return careerVal(k) >= v; }
function reqText(r){ const [k, v] = r, L = {shifts:['ورديات','shifts'], stars2:['ورديات ٢★+','2★+ shifts'], clean:['ورديات نضيفة','clean shifts'], night:['ورديات ليلي','night shifts'], bus:['ورديات أتوبيس','bus shifts'], perfect:['وقفات مظبوطة','perfect stops'], level:['مستوى','level'], rating:['تقييم','rating'], earned:['دخل من الشركة','career earnings']};
 if (k === 'lic') return L2('رخصة ', 'Licence: ') + nm(LIC_GRADES.find(g => g.k === v).n); if (k === 'exam'){ const r2 = ROUTES.find(q => q.id === v); return L2('امتحان: ', 'Exam: ') + nm(r2.from) + ' → ' + nm(r2.to); }
 const cur = careerVal(k); return `${nm(L[k])}: ${k === 'rating' ? fmt(cur, 1) : fmt(Math.floor(cur))} / ${k === 'earned' ? money(v) : fmt(v, k === 'rating' ? 1 : 0)}`; }
const nodeState = n => CR().done[n.id] ? 'done' : n.pre.every(p => CR().done[p]) ? (n.req.every(reqMet) ? 'ready' : 'open') : 'locked';
function careerPay(){ let sal = 0, com = 0, bonus = 0; for (const n of CAREER_N) if (CR().done[n.id]){ sal = Math.max(sal, n.rw.sal || 0); com = Math.max(com, n.rw.com || 0); bonus += n.rw.bonus || 0; } return {sal:sal + bonus, com}; }
const hasPerk = p => CAREER_N.some(n => CR().done[n.id] && n.rw.perk === p);
function careerRank(){ let best = null; for (const n of CAREER_N) if (CR().done[n.id] && (n.rw.sal || 0) >= ((best && best.rw.sal) || 0)) best = n; return best; }
function fleet(){ const s = new Set(); for (const n of CAREER_N) if (CR().done[n.id] && n.rw.veh) n.rw.veh.forEach(v => s.add(v)); return [...s]; }
function perfScore(){ const p = CR().perf; if (!p.length) return 70; return Math.round(p.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, p.length)); }
/* ---------- career screen ---------- */
let CSEL = 'c0', CZOOM = .72, CPAN = null, CVEH = null;
function renderCareer(){
 const el = $('#s-career'), c = CR(), pay = careerPay(), rank = careerRank(), fl = fleet(), sel = CN(CSEL) || CAREER_N[0], st = nodeState(sel), perf = perfScore();
 if (!CPAN) CPAN = {x:0, y:0};
 const nodeHTML = n => { const s = nodeState(n), V = VBY(n.v); return `<button class="cn ${s} ${n.big ? 'big' : ''} ${n.id === CSEL ? 'sel' : ''}" data-cn="${n.id}" style="left:${n.x}px;top:${n.y}px"><span class="cimg ${n.night ? 'night' : ''}"><img src="${ASSETS[V.spr]}"></span>${s === 'done' ? '<i class="cck">✓</i>' : s === 'locked' ? '<i class="clk">🔒</i>' : s === 'ready' ? '<i class="crd">★</i>' : ''}<b>${nm(n.t)}</b></button>`; };
 const links = CAREER_N.flatMap(n => n.pre.map(p => { const a = CN(p), s = CR().done[n.id] ? 'done' : CR().done[p] ? 'open' : 'locked'; return `<line class="cl ${s}" x1="${a.x}" y1="${a.y}" x2="${n.x}" y2="${n.y}"/>`; })).join('');
 el.innerHTML = `<div class="career">
  <div class="chead"><div class="ccard"><img src="${ASSETS.logo}" class="clogo"><div><small>${L2('شركة أجرة للنقل', 'Ograaa Transport Co.')}</small><b>${rank ? nm(rank.t) : L2('لسه ما اتعينتش', 'Not hired yet')}</b><span>${L2('المرتب للوردية', 'Pay per shift')}: <em class="gold">${money(pay.sal)}</em> · ${L2('عمولة', 'Commission')}: <em class="gold">${Math.round(pay.com * 100)}%</em></span></div></div>
   <div class="cstats"><div><b>${fmt(c.shifts)}</b><small>${L2('ورديات', 'Shifts')}</small></div><div><b>${money(c.earned)}</b><small>${L2('دخل الشركة', 'Earned')}</small></div><div class="perf" style="--p:${perf}"><b>${fmt(perf)}</b><small>${L2('الأداء', 'Performance')}</small></div></div></div>
  <div class="cstage" id="cStage"><div class="crings"><i></i><i></i><i></i><i></i></div><div class="cworld" id="cWorld" style="transform:translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})"><svg class="clinks" width="1800" height="1000">${links}</svg>${CAREER_N.map(nodeHTML).join('')}</div></div>
  <div class="cpanel"><div class="cpimg ${sel.night ? 'night' : ''}"><img src="${ASSETS[VBY(sel.v).spr]}"></div><h3>${nm(sel.t)}</h3><p class="muted">${nm(sel.d)}</p>
   <div class="creq">${sel.req.map(r => `<div class="${reqMet(r) ? 'ok' : ''}">${reqMet(r) ? '✅' : '⬜'} ${reqText(r)}</div>`).join('')}${sel.pre.length ? `<div class="${sel.pre.every(p => c.done[p]) ? 'ok' : ''}">${sel.pre.every(p => c.done[p]) ? '✅' : '⬜'} ${L2('بعد', 'After')}: ${sel.pre.map(p => nm(CN(p).t)).join(' + ')}</div>` : ''}</div>
   <div class="crw">${sel.rw.sal ? `<span>💰 ${money(sel.rw.sal)} / ${L2('وردية', 'shift')}</span>` : ''}${sel.rw.com ? `<span>📈 ${Math.round(sel.rw.com * 100)}% ${L2('عمولة', 'commission')}</span>` : ''}${sel.rw.bonus ? `<span>➕ ${money(sel.rw.bonus)}</span>` : ''}${sel.rw.veh ? `<span>🚐 ${sel.rw.veh.map(v => nm(VBY(v).name)).join('، ')}</span>` : ''}${sel.rw.perk === 'night' ? `<span>🌙 +25% ${L2('ليلي', 'nights')}</span>` : ''}${sel.rw.perk === 'daily' ? `<span>📅 ${L2('مكافأة يومية', 'Daily bonus')}</span>` : ''}${sel.rw.perk === 'partner' ? `<span>🤝 15% ${L2('من كل مكسب', 'of all earnings')}</span>` : ''}</div>
   <div class="mbtns" style="flex-direction:column">${!c.joined ? `<button class="btn big" id="cJoin">✍ ${L2('امضي العقد', 'Sign the contract')}</button>` : st === 'ready' ? `<button class="btn big" id="cPromo">🎖 ${L2('استلم الترقية', 'Accept promotion')}</button>` : ''}
   ${c.joined && st !== 'done' && st !== 'locked' ? sel.req.filter(r => r[0] === 'exam' && !reqMet(r)).map(r => `<button class="btn sec" data-exam="${r[1]}">📝 ${L2('ادخل الامتحان', 'Take the exam')}</button>`).join('') : ''}</div></div>
  <div class="cbar">${c.joined ? `<div class="vpick">${fl.map(v => `<button class="vchip ${v === (CVEH || fl[fl.length - 1]) ? 'on' : ''}" data-cv="${v}"><img src="${ASSETS[VBY(v).spr]}">${nm(VBY(v).name)}</button>`).join('')}</div><span class="sp"></span>${hasPerk('daily') ? `<button class="btn sec" id="cDaily" ${c.day === dayKey() ? 'disabled' : ''}>📅 ${L2('المكافأة اليومية', 'Daily bonus')}</button>` : ''}<button class="btn big" id="cShift">▶ ${L2('ابدأ الوردية', 'Start shift')}</button>` : `<span class="muted">${L2('امضي العقد عشان تبدأ مسيرتك', 'Sign the contract to begin your career')}</span>`}<button class="btn sm sec" id="cZo">−</button><button class="btn sm sec" id="cZi">+</button></div></div>`;
 $$('[data-cn]').forEach(b => b.onclick = e => { e.stopPropagation(); CSEL = b.dataset.cn; { const nn = CN(CSEL); if (nn && fleet().includes(nn.v)) CVEH = nn.v; } AU.init(); AU.mallet(988, 0, .025, .35); renderCareer(); });
 $$('[data-cv]').forEach(b => b.onclick = () => { CVEH = b.dataset.cv; renderCareer(); });
 const j = $('#cJoin'); if (j) j.onclick = () => { if (!hasLic('micro')){ toastUI('🪪 ' + L2('محتاج رخصة درجة تالتة الأول', 'You need a Grade 3 licence first'), 'bad'); DMVTAB = 'lic'; show('traffic'); return; } c.joined = true; c.done.c0 = true; AU.levelUp(); toastUI('🎖 ' + L2('اتعينت في شركة أجرة للنقل!', 'Hired by Ograaa Transport Co.!'), 'good'); save(); renderCareer(); };
 const p = $('#cPromo'); if (p) p.onclick = () => { c.done[sel.id] = true; AU.levelUp(); toastUI('🎖 ' + L2('ترقية! ', 'Promoted! ') + nm(sel.t), 'good', null, 4); S.xp += 60; save(); renderCareer(); };
 $$('[data-exam]').forEach(b => b.onclick = () => startShift(b.dataset.exam));
 const sh = $('#cShift'); if (sh) sh.onclick = () => startShift(null);
 const dl = $('#cDaily'); if (dl) dl.onclick = () => { c.day = dayKey(); ledger(hasPerk('partner') ? 1500 : 500, L2('مكافأة الشركة اليومية', 'Company daily bonus'), 'calendar'); save(); renderCareer(); };
 $('#cZo').onclick = () => { CZOOM = Math.max(.35, CZOOM - .12); renderCareer(); }; $('#cZi').onclick = () => { CZOOM = Math.min(1.3, CZOOM + .12); renderCareer(); };
 const stg = $('#cStage'); let drag = null; stg.onpointerdown = e => { if (e.target.closest('.cn')) return; drag = {x:e.clientX - CPAN.x, y:e.clientY - CPAN.y}; stg.setPointerCapture(e.pointerId); };
 stg.onpointermove = e => { if (!drag) return; CPAN.x = e.clientX - drag.x; CPAN.y = e.clientY - drag.y; $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; }; stg.onpointerup = () => { drag = null; };
 stg.onwheel = e => { e.preventDefault(); CZOOM = clamp(CZOOM - Math.sign(e.deltaY) * .06, .35, 1.3); $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; };
 if (!renderCareer._centered){ renderCareer._centered = true; requestAnimationFrame(() => { const r = stg.getBoundingClientRect(); CPAN.x = r.width / 2 - 800 * CZOOM; CPAN.y = r.height / 2 - 500 * CZOOM; $('#cWorld').style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; }); }
}
function startShift(exam){ const c = CR(), fl = fleet(); let vid = CVEH && fl.includes(CVEH) ? CVEH : fl[fl.length - 1]; let route;
 if (exam){ route = ROUTES.find(r => r.id === exam); const need = CLS_OK[route.type]; if (!need.includes(vid)) vid = fl.filter(v => need.includes(v)).pop() || need[0]; }
 else { const V = VBY(vid); const list = ROUTES.filter(r => CLS_OK[r.type].includes(vid)); route = pick(list.filter(r => r.lvl <= lvlOf(S.xp).l + 1).length ? list.filter(r => r.lvl <= lvlOf(S.xp).l + 1) : list); }
 if (!route){ toastUI(L2('مفيش خط متاح للمركبة دي', 'No line available for this vehicle'), 'bad'); return; }
 const V = VBY(vid); if (!hasLic(V.cls)){ toastUI('🪪 ' + L2('محتاج رخصة ', 'You need a licence for ') + nm(V.name), 'bad'); DMVTAB = 'lic'; show('traffic'); return; }
 const night = hasPerk('night') && Math.random() < .5;
 play(route, {vid, test:true, career:{exam, night}, tod:night ? 'night' : undefined}); }
const _sr9 = startRoute;
startRoute = function(route, opt){ _sr9(route, opt); G.career = opt && opt.career ? Object.assign({cf:0}, opt.career) : null; if (G.career && G.mode === 'play') setTimeout(() => toastUI((G.career.exam ? '📝 ' + L2('امتحان ترقية — من غير مخالفات و ٢ نجوم على الأقل', 'Promotion exam — no fines and at least 2 stars') : '🏢 ' + L2('وردية لشركة أجرة للنقل', 'Ograaa Transport Co. shift')), 'gold', null, 4), 600); };
const _af9 = addFine;
addFine = function(k, cam){ if (G.career){ const amt = FINE[k] || 300, lbl = t({belt:'fBelt', lights:'fLights', door:'fDoor', over:'fOver', insp:'fInsp', lic:'fLic', vlic:'fVlic', red:'fRed', radar:'fRadar', run:'fRun', amb:'fAmb', crash:'fCrash', ped:'fPed', kit:'fKit'}[k] || 'fCrash'); G.career.cf += amt; S.lic.points += PTS[k] || 0; toastUI('🚨 ' + lbl + ' — ' + money(amt), 'bad'); AU.whistle(); return; } _af9(k, cam); };
const _showRec9 = showReceipt;
showReceipt = function(R){ if (!G.career){ if (hasPerk('partner') && !R.test && R.net > 0){ const s = Math.round(R.net * .15); ledger(s, L2('نصيب الشريك', 'Partner share'), 'coins'); R.partner = s; } return _showRec9(R); }
 const c = CR(), pay = careerPay(), K = G.career, ok = R.reason === 'ok', nightB = K.night && hasPerk('night') ? .25 : 0, perfB = perfScore() >= 85 ? .1 : 0;
 const sal = ok ? Math.round(pay.sal * (1 + nightB + perfB)) : Math.round(pay.sal * .3), com = Math.round(R.fares * pay.com), dmg = G.T.hits * 150 + (R.reason === 'crash' ? 800 : 0), total = sal + com + Math.round(R.tips) - K.cf - dmg;
 if (total !== 0) ledger(total, L2('مرتب وردية — شركة أجرة', 'Shift pay — Ograaa Transport'), 'cash');
 c.shifts += ok ? 1 : 0; if (R.stars >= 2) c.stars2++; if (ok && K.cf === 0 && !G.T.hits) c.clean++; if (K.night) c.night++; if (G.V.cls === 'bus' && ok) c.bus++; if (G.V.cls === 'coach' && ok) c.coach++; c.earned += Math.max(0, total);
 const score = clamp(Math.round((ok ? 40 : 0) + R.stars * 15 + (K.cf ? 0 : 10) + R.comfort * .05), 0, 100); c.perf.push(score); if (c.perf.length > 30) c.perf.shift();
 let exam = ''; if (K.exam){ const pass = ok && R.stars >= 2 && K.cf === 0 && R.comfort >= 55; if (pass){ c.exams[K.exam] = true; exam = `<div class="rec tot"><span>📝 ${L2('الامتحان', 'Exam')}</span><b class="good">${L2('ناجح ✓', 'PASSED ✓')}</b></div>`; } else exam = `<div class="rec tot"><span>📝 ${L2('الامتحان', 'Exam')}</span><b class="badc">${L2('راسب — حاول تاني', 'Failed — try again')}</b></div>`; }
 const S2 = S.xp; S.xp += R.xp; save(true);
 const row = (l, v, cl) => `<div class="rec"><span>${l}</span><b class="${cl || ''}">${v}</b></div>`;
 $('#recBox').innerHTML = `<h2>🏢 ${L2('كشف الوردية', 'Shift pay slip')}</h2><div class="bigstars">${[0,1,2].map(i => i < R.stars ? '<i>★</i>' : '☆').join('')}</div>
  ${row(L2('المرتب', 'Base pay'), '+' + money(sal), 'good')}${nightB ? row('🌙 ' + L2('حافز ليلي', 'Night allowance'), '+25%', 'good') : ''}${perfB ? row('📈 ' + L2('حافز أداء', 'Performance bonus'), '+10%', 'good') : ''}${row(L2('عمولة الأجرة', 'Fare commission') + ` (${Math.round(pay.com * 100)}%)`, '+' + money(com), 'good')}${row(L2('البقشيش', 'Tips'), '+' + money(R.tips), 'good')}
  ${K.cf ? row(L2('مخالفات', 'Fines'), '−' + money(K.cf), 'badc') : ''}${dmg ? row(L2('خصم تلفيات', 'Damage deduction'), '−' + money(dmg), 'badc') : ''}${row(L2('راحة الركاب', 'Passenger comfort'), fmt(R.comfort) + '%')}${row(L2('تقييم الأداء', 'Performance score'), fmt(score) + '/100')}
  <div class="rec tot"><span>${L2('صافي', 'Net pay')}</span><b class="${total >= 0 ? 'gold' : 'badc'}">${money(total)}</b></div>${exam}<div class="gold">+${fmt(R.xp)} XP</div>
  <div class="mbtns"><button class="btn" id="recCar">🏢 ${L2('المسيرة المهنية', 'Career')}</button><button class="btn sec" id="recMenu2">${t('menu')}</button></div>`;
 $('#recM').classList.add('on'); $('#recCar').onclick = () => { $('#recM').classList.remove('on'); toMenu('career'); }; $('#recMenu2').onclick = () => { $('#recM').classList.remove('on'); toMenu('career'); };
 if (CAREER_N.some(n => nodeState(n) === 'ready')) setTimeout(() => toastUI('🎖 ' + L2('ترقية متاحة في المسيرة المهنية!', 'A promotion is available in Career!'), 'good', null, 4), 900);
};
/* ---------- main menu: Rides · Career · Profile · Settings ---------- */
TX.rides = ['المشاوير','Rides']; TX.career = ['المسيرة المهنية','Career']; TX.profileHub = ['ملفي','Profile'];
const HUB9 = {rides:['routes','garage','showroom','market','traffic'], career:['career'], me:['profile','home'], settings:['settings']}, LAST9 = {};
NAV.length = 0; NAV.push(['rides','i_map'], ['career','i_trophy'], ['me','i_stats'], ['settings','i_settings']); TX.me = ['ملفي','Profile'];
{ const m = document.getElementById('main'); if (m && !document.getElementById('s-career')) m.insertAdjacentHTML('beforeend', '<section class="screen" id="s-career"></section>'); if (m && !document.getElementById('subnav')) m.insertAdjacentHTML('afterbegin', '<div id="subnav"></div>'); }
const _show9 = show;
show = function(id){ if (id === 'home' && !LAST9._boot){ LAST9._boot = 1; id = 'career'; } if (HUB9[id]) id = LAST9[id] || HUB9[id][0]; const hub = Object.keys(HUB9).find(h => HUB9[h].includes(id)) || 'rides'; LAST9[hub] = id;
 if (id === 'career'){ SCR = id; $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-career')); renderCareer(); $('#main').scrollTop = 0; } else _show9(id);
 $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.go === hub));
 const sn = $('#subnav'); const pages = HUB9[hub]; sn.style.display = pages.length > 1 ? 'flex' : 'none'; sn.innerHTML = pages.map(p => `<button class="${p === id ? 'on' : ''}" data-sub="${p}">${t(p === 'home' ? 'wallet' : p === 'profile' ? 'profile' : p)}</button>`).join('');
 $$('[data-sub]').forEach(b => b.onclick = () => { AU.click(); show(b.dataset.sub); }); };
const _toMenu9 = toMenu;
toMenu = function(scr){ _toMenu9(scr === 'home' ? 'career' : scr); };

/* ======================= career-scene.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v10 — living career screen: vehicles with spinning wheels,
   animated Cairo backdrop, auto-zoom to your current position
   ===================================================================== */
function drawVehThumb(x, V, w, h, t, night, moving){
 const g = x.createLinearGradient(0, 0, 0, h); if (night){ g.addColorStop(0, '#0b1633'); g.addColorStop(.7, '#22335e'); g.addColorStop(1, '#1a1f29'); } else { g.addColorStop(0, '#7fb6e6'); g.addColorStop(.62, '#e8dcc2'); g.addColorStop(1, '#b49a6c'); }
 x.fillStyle = g; x.fillRect(0, 0, w, h);
 const pano = IMG.pCairo; if (pano && pano.width){ const ph = h * .32, pw = pano.width / pano.height * ph, off = -((t * 12) % pw); x.globalAlpha = night ? .35 : .45; for (let px = off; px < w; px += pw) x.drawImage(pano, px, h * .6 - ph, pw, ph); x.globalAlpha = 1; }
 x.fillStyle = night ? '#1b1f27' : '#4a4d52'; x.fillRect(0, h * .74, w, h * .26); x.fillStyle = 'rgba(255,255,255,.75)'; const dash = w * .12, ofs = moving ? (t * w * .35) % (dash * 2) : 0; for (let lx = -ofs; lx < w; lx += dash * 2) x.fillRect(lx, h * .86, dash, h * .018);
 const im = IMG[V.spr], M = META[V.spr]; if (!im || !im.width) return; const k = Math.min(w * .84 / M.w, h * .5 / M.h), bw = M.w * k, bh = M.h * k, ox = (w - bw) / 2, bob = moving ? Math.sin(t * 9) * h * .006 : 0, oy = h * .8 - bh;
 x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(w / 2, h * .8, bw * .46, bh * .05, 0, 0, 7); x.fill();
 const rot = moving ? t * 7 : 0;
 if (!V.baked) for (const [cx, cy, r] of M.wheels){ const wi = IMG['wh' + V.rim]; x.save(); x.translate(ox + cx * k, oy + cy * k); x.rotate(rot); const R = r * k * WQ(V.rim); x.drawImage(wi, -R, -R, R * 2, R * 2); x.restore(); }
 x.drawImage(im, ox, oy + bob, bw, bh);
 if (V.baked){ const crops = aiWheelCrops(V.spr); M.wheels.forEach(([cx, cy], i) => { const c = crops[i]; if (!c) return; x.save(); x.translate(ox + cx * k, oy + cy * k + bob); x.rotate(rot); x.drawImage(c, -c.width * k / 2, -c.height * k / 2, c.width * k, c.height * k); x.restore(); }); }
 if (night){ const hl = M.hl; if (hl){ const gx = ox + hl[0] * k, gy = oy + hl[1] * k + bob, gg = x.createRadialGradient(gx, gy, 0, gx, gy, bw * .25); gg.addColorStop(0, 'rgba(255,236,190,.8)'); gg.addColorStop(1, 'rgba(255,236,190,0)'); x.fillStyle = gg; x.fillRect(gx - bw * .25, gy - bw * .25, bw * .5, bw * .5); } }
}
/* animated backdrop: Cairo skyline parallax, drifting bokeh, light sweep */
const CB = {bok:Array.from({length:38}, (_, i) => ({x:hash(i * 5), y:hash(i * 9 + 2), r:4 + hash(i * 3) * 18, s:.2 + hash(i * 7) * .8, c:i % 3}))};
function drawCareerBG(cv2, t){ const w = cv2.clientWidth, h = cv2.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); if (cv2.width !== Math.round(w * d)){ cv2.width = Math.round(w * d); cv2.height = Math.round(h * d); } const x = cv2.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
 const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a1430'); g.addColorStop(.55, '#1c2a4a'); g.addColorStop(.8, '#3a2f3a'); g.addColorStop(1, '#171a22'); x.fillStyle = g; x.fillRect(0, 0, w, h);
 const sun = x.createRadialGradient(w * .5, h * .78, 0, w * .5, h * .78, h * .8); sun.addColorStop(0, 'rgba(255,170,90,.35)'); sun.addColorStop(1, 'rgba(255,170,90,0)'); x.fillStyle = sun; x.fillRect(0, 0, w, h);
 [['pCitadel', .015, .8, .34, .55], ['pCairo', .03, .86, .3, .7], ['pResid', .06, .97, .26, .85]].forEach(([k, sp, base, hh, a]) => { const im = IMG[k]; if (!im || !im.width) return; const ph = h * hh, pw = im.width / im.height * ph, off = -((t * sp * 900) % pw); x.globalAlpha = a; x.filter = 'brightness(.42) saturate(.7)'; for (let px = off; px < w; px += pw - 1) x.drawImage(im, px, h * base - ph, pw, ph); x.filter = 'none'; x.globalAlpha = 1; });
 x.fillStyle = 'rgba(8,12,24,.45)'; x.fillRect(0, 0, w, h);
 // animated road with flowing lane dashes and passing headlights
 x.fillStyle = 'rgba(20,22,28,.9)'; x.fillRect(0, h * .93, w, h * .07); x.fillStyle = 'rgba(245,178,27,.7)'; for (let lx = -((t * 160) % 90); lx < w; lx += 90) x.fillRect(lx, h * .962, 44, 3);
 for (let i = 0; i < 3; i++){ const px = ((t * (70 + i * 30) + i * 400) % (w + 300)) - 150, py = h * .95; const gg = x.createRadialGradient(px, py, 0, px, py, 60); gg.addColorStop(0, 'rgba(255,230,170,.5)'); gg.addColorStop(1, 'rgba(255,230,170,0)'); x.fillStyle = gg; x.fillRect(px - 60, py - 30, 120, 60); }
 x.globalCompositeOperation = 'lighter'; for (const b of CB.bok){ const bx = (b.x * w + t * 10 * b.s) % w, by = (b.y * h * .85 + Math.sin(t * .6 + b.x * 9) * 12), a = .05 + .06 * Math.sin(t * 1.3 + b.y * 7); const col = ['255,190,90', '120,180,255', '255,120,90'][b.c]; const gg = x.createRadialGradient(bx, by, 0, bx, by, b.r); gg.addColorStop(0, `rgba(${col},${a})`); gg.addColorStop(1, `rgba(${col},0)`); x.fillStyle = gg; x.beginPath(); x.arc(bx, by, b.r, 0, 7); x.fill(); } x.globalCompositeOperation = 'source-over';
 const sw = ((t * .12) % 1.6 - .3) * w, sg = x.createLinearGradient(sw - 120, 0, sw + 120, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.035)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = sg; x.fillRect(0, 0, w, h);
}
let CLOOP = 0;
function careerLoop(){ cancelAnimationFrame(CLOOP); const step = () => { const sc = $('#s-career'); if (!sc || !sc.classList.contains('on') || $('#menu').classList.contains('off')) return; const t = performance.now() / 1000;
  const bg = $('#cBG'); if (bg) drawCareerBG(bg, t);
  $$('#s-career canvas[data-tv]').forEach(c => { const w = c.clientWidth, h = c.clientHeight; if (!w) return; const d = Math.min(2, devicePixelRatio || 1); if (c.width !== Math.round(w * d)){ c.width = Math.round(w * d); c.height = Math.round(h * d); } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); const st = c.dataset.st; if (st === 'locked' && c._done) return; drawVehThumb(x, VBY(c.dataset.tv), w, h, t + (+c.dataset.ph || 0), c.dataset.n === '1', st !== 'locked'); c._done = true; });
  CLOOP = requestAnimationFrame(step); }; step(); }
function currentNode(){ const ready = CAREER_N.filter(n => nodeState(n) === 'ready'); if (ready.length) return ready[0]; return careerRank() || CAREER_N[0]; }
const _rc10 = renderCareer;
renderCareer = function(){ const first = !renderCareer._z10; if (first){ renderCareer._z10 = true; renderCareer._centered = true; const cur = currentNode(); CSEL = cur.id; CZOOM = 1.05; }
 _rc10();
 const stg = $('#cStage'); if (!stg) return; stg.insertAdjacentHTML('afterbegin', '<canvas id="cBG" class="cbg"></canvas>');
 $$('#s-career .cn').forEach((b, i) => { const n = CN(b.dataset.cn), s = nodeState(n), holder = b.querySelector('.cimg'), img = holder.querySelector('img'); const c = document.createElement('canvas'); c.dataset.tv = n.v; c.dataset.st = s; c.dataset.n = n.night ? '1' : ''; c.dataset.ph = (i * .37).toFixed(2); img.replaceWith(c); });
 const pi = $('#s-career .cpimg'); if (pi){ const n = CN(CSEL), c = document.createElement('canvas'); c.dataset.tv = n.v; c.dataset.st = 'x'; c.dataset.n = n.night ? '1' : ''; pi.querySelector('img').replaceWith(c); }
 if (first){ requestAnimationFrame(() => { const cur = CN(CSEL), r = stg.getBoundingClientRect(), wr = $('#cWorld'); const panelW = window.innerWidth > 900 ? Math.min(352, r.width * .4) : 0; const cx = (r.width - panelW) / 2 + (document.documentElement.dir === 'rtl' ? panelW : 0);
  CPAN.x = r.width / 2 - 800 * .6; CPAN.y = r.height / 2 - 500 * .6; wr.style.transition = 'none'; wr.style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(.6)`;
  requestAnimationFrame(() => { CPAN.x = cx - cur.x * CZOOM; CPAN.y = r.height / 2 - cur.y * CZOOM; wr.style.transition = 'transform 1.4s cubic-bezier(.2,.8,.2,1)'; wr.style.transform = `translate(${CPAN.x}px,${CPAN.y}px) scale(${CZOOM})`; setTimeout(() => { wr.style.transition = ''; }, 1500); }); }); }
 careerLoop(); };
const _show10 = show;
show = function(id){ _show10(id); if (SCR === 'career') careerLoop(); };
const _toMenu10 = toMenu;
toMenu = function(scr){ renderCareer._z10 = false; _toMenu10(scr); };

/* ======================= hud-layout.js ======================= */
"use strict";
/* passengers only react to the radio when it is actually playing; Quran FM gets respectful reactions, never song talk */
function radioAudible(){ return !!(G.radioOn && typeof RADIO !== "undefined" && (RADIO.status === "live" || RADIO.status === "offline")); }
DLG.calmLoud = [["ممكن توطي شوية يا أسطى","Could you lower it a little, driver?"],["وطي الصوت شوية لو سمحت","A bit quieter, please"]];
/* =====================================================================
   OGRAAA v11 — HUD auto-layout (no overlaps, any screen) +
   pedestrian scale normalisation
   ===================================================================== */
/* ---------------- pedestrians: normalise each walk cycle to its own median height ---------------- */
META.pedMed = META.peds.map(fr => { const hs = fr.map(f => META[f].h).sort((a, b) => a - b); return hs[hs.length >> 1]; });
META.peds = META.peds.map((fr, i) => { const m = META.pedMed[i], ok = fr.filter(f => Math.abs(META[f].h - m) / m < .22); return ok.length >= 4 ? ok : fr; });
function pedRel(t, im){ return im.height / (META.pedMed[t] || 150); }
function drawPed(type, x, baseY, dist, face, alpha, hM){
 const fr = META.peds[type]; if (!fr) return; const n = fr.length, f = dist == null ? 0 : Math.floor((dist / 1.45) * n) % n; const im = IMG[fr[(f + n) % n]]; if (!im) return;
 const h = (hM || 1.7) * PPM * pedRel(type, im), w = im.width / im.height * h, X = sx(x), Y = sy(baseY);
 if (X < -60 || X > VW + 60) return; ctx.save(); if (alpha != null) ctx.globalAlpha = clamp(alpha, 0, 1); ctx.translate(X, Y); if (face < 0) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore(); }
/* ---------------- bottom HUD: measured layout, groups wrap instead of overlapping ---------------- */
function layoutHUD(){
 const hud = $('#hud'); if (!hud || !hud.classList.contains('on')) return; const dash = $('#dash'), L = $('#ctrlsL'), R = $('#ctrls'), pb = $('#pedB'), pg = $('#pedG'); if (!dash || !L || !R) return;
 const hz = $('#bHaz'); if (hz) hz.style.display = 'none';
 // trunk button lives on its own, middle-right of the screen above the gas pedal
 const tr = $('#bTrunk'); if (tr && tr.parentNode !== hud){ hud.appendChild(tr); tr.classList.add('trunkFloat'); }
 const vw = window.innerWidth, gap = Math.max(8, vw * .008), portrait = document.body.classList.contains('portrait');
 const swap = document.body.classList.contains('swap'), leftPed = swap ? pg : pb, rightPed = swap ? pb : pg;
 if (tr){ const rp = rightPed.getBoundingClientRect(); tr.style.left = 'auto'; tr.style.right = (vw - rp.right + (rp.width - tr.offsetWidth) / 2) + 'px'; tr.style.bottom = (window.innerHeight - rp.top + 28) + 'px'; }
 if (portrait) return;
 const dr = dash.getBoundingClientRect(), lp = leftPed.getBoundingClientRect(), rp = rightPed.getBoundingClientRect();
 const leftZone = dr.left - lp.right - gap * 2, rightZone = rp.left - dr.right - gap * 2;
 L.style.left = (lp.right + gap) + 'px'; L.style.right = 'auto'; L.style.maxWidth = 'none'; L.style.justifyContent = 'flex-end';
 R.style.right = (vw - rp.left + gap) + 'px'; R.style.left = 'auto'; R.style.maxWidth = 'none'; R.style.justifyContent = 'flex-start';
 // one single row per side: scale the buttons so each group fits its zone
 const root = document.documentElement, cur = parseFloat(getComputedStyle(root).getPropertyValue('--hs')) || 1, user = {s:.85, m:1, l:1.18, xl:1.35}[setv('hud')] || 1;
 const need = Math.max(L.scrollWidth / Math.max(60, leftZone), R.scrollWidth / Math.max(60, rightZone));
 let hs = cur; if (need > 1.001) hs = Math.max(.55, cur / need * .98); else if (need < .9 && cur < user) hs = Math.min(user, cur / need * .98);
 if (Math.abs(hs - cur) > .01) root.style.setProperty('--hs', hs.toFixed(3));
 const rr = R.getBoundingClientRect(); ['radioP','acP','cruiseP','trunkP'].forEach(id => { const p = $('#' + id); if (!p) return; if (id === 'trunkP' && tr){ const tb = tr.getBoundingClientRect(); p.style.right = (vw - tb.left + 10) + 'px'; p.style.bottom = Math.max(10, window.innerHeight - tb.bottom) + 'px'; return; } p.style.right = (vw - rr.right) + 'px'; p.style.bottom = (window.innerHeight - rr.top + 10) + 'px'; });
}
addEventListener('resize', () => { applySettings(); setTimeout(layoutHUD, 60); });
setInterval(layoutHUD, 700);
const _play11 = play;
play = function(route, opt){ _play11(route, opt); applySettings(); requestAnimationFrame(() => { layoutHUD(); requestAnimationFrame(layoutHUD); }); };

/* ======================= audio-fix.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v12 — reliable sample loading (no fetch on data URIs, works under
   strict page policies) + speed wind above 60 km/h
   ===================================================================== */
SND.load = function(){ if (this.loading || !AU.ctx) return; this.loading = true;
 ['snd_street','snd_rain','snd_h1','snd_h2','snd_h3','snd_h4','snd_h5','snd_pol','snd_amb'].forEach(k => { const src = ASSETS[k]; if (!src) return;
  const decode = ab => AU.ctx.decodeAudioData(ab).then(d => { this.buf[k] = d; }).catch(e => console.warn('snd decode', k, e));
  if (src.startsWith('data:')){ try{ const b64 = src.slice(src.indexOf(',') + 1), bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); decode(u.buffer); }catch(e){ console.warn('snd', k, e); } }
  else { const x = new XMLHttpRequest(); x.open('GET', src); x.responseType = 'arraybuffer'; x.onload = () => { if (x.status === 200 || x.status === 0) decode(x.response); }; x.onerror = () => console.warn('snd load', k); x.send(); } }); };
/* retry if an earlier attempt failed before this fix */
setTimeout(function retry(){ if (AU.ctx && !Object.keys(SND.buf).length){ SND.loading = false; SND.load(); } else if (!AU.ctx) setTimeout(retry, 1500); }, 1500);
/* speed wind: silent below 60 km/h, rising smoothly with speed above it */
const _eng12 = AU.engine.bind(AU);
AU.engine = function(on, rpm, load, speed, big){ _eng12(on, rpm, load, speed, big); const e = this.eng; if (!e) return; const t = this.ctx.currentTime + .05, kmh = (speed || 0) * 3.6, k = clamp((kmh - 60) / 60, 0, 1.4);
 e.wg.gain.setTargetAtTime(G.paused ? 0 : .096 * Math.pow(k, 1.4), t, .35); e.wf.frequency.setTargetAtTime(380 + k * 1500, t, .35); };

/* ======================= wheels-windows.js ======================= */
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
 const Y0 = new Int16Array(w).fill(-1), Y1 = new Int16Array(w).fill(-1); const isWin = p => { if (M.win[p]) return true; const q = p * 4, r = M.src[q], g = M.src[q + 1], b = M.src[q + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); return !/^nw/.test(V.spr) && M.src[q + 3] > 200 && L[p] < M.dL * .56 && (mx - mn) / (mx + 1) < .22; };
 for (let px = Math.ceil(w * .03); px < w * .97; px++) for (let py = 0; py < lim; py++) if (isWin(py * w + px)){ if (Y0[px] < 0) Y0[px] = py; Y1[px] = py; }
 if (/^nw/.test(V.spr)){ for (let px = Math.ceil(w * .03); px < w * .97; px++){ let best = null, rs = -1, re = -1, gap = 0; for (let py = 0; py <= lim; py++){ const on = py < lim && isWin(py * w + px); if (on){ if (rs < 0) rs = py; re = py; gap = 0; } else if (rs >= 0){ if (++gap > 4 || py === lim){ if (!best || re - rs > best[1] - best[0]) best = [rs, re]; rs = -1; gap = 0; } } } if (best && best[1] - best[0] > h * .08){ Y0[px] = best[0]; Y1[px] = best[1]; } else { Y0[px] = -1; Y1[px] = -1; } } }
 const ys = Array.from(Y1).filter(v => v > 0).sort((a, b) => a - b), base = ys.length ? ys[ys.length >> 1] : lim;
 const ok = new Uint8Array(w), top1 = new Int16Array(w), bot1 = new Int16Array(w);
 for (let px = Math.ceil(w * .03); px < w * .97; px++){ const y0 = Y0[px]; if (y0 < 0) continue; const y1 = Math.min(Y1[px], base + Math.round(h * .02)); if (y1 - y0 < h * .06) continue; let dk = 0; for (let py = y0; py <= y1; py++) if (L[py * w + px] < 34) dk++; ok[px] = dk / (y1 - y0 + 1) > .8 ? 2 : 1; top1[px] = y0; bot1[px] = y1; }
 // dark columns are pillars only when they form a narrow strip; wide dark runs are tinted glass
 for (let px = 0; px < w; px++){ if (ok[px] !== 2) continue; const r0 = px; while (px < w && ok[px] === 2) px++; const narrow = px - r0 < w * .03; for (let q = r0; q < px; q++) ok[q] = narrow ? 0 : 1; }
 // group columns into window cells; keep only whole cells behind the driver (never cut through the driver's window)
 const cells = []; for (let px = 0; px < w; px++){ if (ok[px]){ const c0 = px; while (px < w && ok[px]) px++; if (px - c0 > w * .025) cells.push([c0, px - 1]); } }
 for (let [c0, c1] of cells){ if (c1 > drv && drv - c0 > w * .3) c1 = Math.floor(drv - w * .01); if (c1 > drv || c1 < w * .09) continue; const ppmS = w / V.len; for (let px = c0; px <= c1; px++) for (let py = Math.max(top1[px], bot1[px] - Math.round(1.05 * ppmS)); py <= bot1[px]; py++) if (M.src[(py * w + px) * 4 + 3] > 150) R[py * w + px] = 1; }
 // erode: keep a frame band (rubber seal + black surround) from the artwork around every window cell
 const e = Math.max(2, Math.round(h * .03)); let A = R, B = new Uint8Array(w * h);
 for (let it = 0; it < e; it++){ B.fill(0); for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const p = y * w + x; if (A[p] && A[p - 1] && A[p + 1] && A[p - w] && A[p + w]) B[p] = 1; } const T = A; A = B; B = T; }
 const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h); let minX = w, maxX = 0, top = h; const bots = [];
 for (let px = 0; px < w; px++){ let lastY = -1; for (let py = 0; py < h; py++) if (A[py * w + px]){ d.data[(py * w + px) * 4 + 3] = 255; minX = Math.min(minX, px); maxX = Math.max(maxX, px); top = Math.min(top, py); lastY = py; } if (lastY > 0) bots.push(lastY); }
 x.putImageData(d, 0, 0); bots.sort((a, b) => a - b);
 return CABM[V.id] = {c, minX, maxX, sill:bots.length ? bots[bots.length >> 1] + e : h * .5, top:top - e, w, h}; }
for (const k in CABM) delete CABM[k]; for (const k in CABB) delete CABB[k];

/* ======================= fuel-lights.js ======================= */
"use strict";
/* the service taxi & minivan run microbus lines (Rides and Career) */
["fiat128","minivan"].forEach(v => { if (!CLS_OK.micro.includes(v)) CLS_OK.micro.push(v); });
/* =====================================================================
   OGRAAA v14 — meaningful fuel use, walk-to-the-station rescue,
   drop-off requests that really stop, flashing requesters,
   traffic-light countdowns
   ===================================================================== */
/* ---------------- fuel: a full tank lasts roughly six trips ---------------- */
function fuelFactor(){ const V = G.V, r = G.route; if (!V || !r) return 1; const perTrip = V.lp100 / 100 * r.km; return clamp((V.tank / 2.5) / Math.max(.1, perTrip), 1, 32); }
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

/* ======================= cabin-rain-sky.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v15 — logical cabin seating, premium rain spray,
   single continuous skyline panorama
   ===================================================================== */
/* ---------------- cabin: passengers only sit inside real window cells, scaled to the window ---------------- */
const _cm15 = cabinMask;
cabinMask = function(V){ if (CABM[V.id] && CABM[V.id].cells) return CABM[V.id]; const K = _cm15(V); const w = K.w, h = K.h, d = K.c.getContext('2d').getImageData(0, 0, w, h).data, cells = [];
 let run = null; for (let x = 0; x < w; x++){ let top = -1, bot = -1; for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 100){ if (top < 0) top = y; bot = y; }
  if (top >= 0){ if (!run) run = {x0:x, x1:x, top, bot}; else { run.x1 = x; run.top = Math.min(run.top, top); run.bot = Math.max(run.bot, bot); } } else if (run){ cells.push(run); run = null; } }
 if (run) cells.push(run); K.cells = cells.filter(c => c.x1 - c.x0 > w * .04 && c.bot - c.top > h * .08); if (V.baked && K.cells.length > 1){ K.cells.sort((p, q) => q.x1 - p.x1); K.cells = [K.cells[0]]; }
 if (V.baked){ const c = K.cells[0], m = K.c.getContext('2d'); if (c){ m.save(); m.globalCompositeOperation = 'destination-in'; m.fillStyle = '#000'; m.fillRect(c.x0, 0, c.x1 - c.x0 + 1, h); m.restore(); } else m.clearRect(0, 0, w, h); } return K; };
for (const k in CABM) delete CABM[k]; for (const k in CABB) delete CABB[k];
const _cc15 = cabinCanvas;
const EMPTYCAB = document.createElement('canvas'); EMPTYCAB.width = EMPTYCAB.height = 1;
cabinCanvas = function(V, cos, pax, forPreview){ if (V.baked) return EMPTYCAB; const K = cabinMask(V); if (!K.cells || !K.cells.length) return _cc15(V, cos, pax, forPreview);
 const ppm = K.w / V.len, slotW = .6 * ppm, slots = []; for (const c of K.cells){ const cw = c.x1 - c.x0, n = Math.max(cw > slotW * .7 ? 1 : 0, Math.floor(cw / slotW)); for (let i = 0; i < n; i++) slots.push({x:c.x0 + (i + .5) * cw / n, c}); }
 // reuse the base/over layers from the original builder, then place people only in valid slots
 const base = _cc15(V, cos, [], forPreview), B = CABB[V.id]; const x = B.dyn.getContext('2d'); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, K.w, K.h); x.drawImage(B.base, 0, 0);
 const order = slots.map((s, i) => i).sort((a, b) => ((a * 5) % slots.length) - ((b * 5) % slots.length)), seated = pax.filter(p => !p.st), standing = pax.filter(p => p.st);
 const drawP = (p, s, stand) => { const fr = META.peds[p.t]; if (!fr) return; const im = IMG[fr[0]]; if (!im) return; const winH = s.c.bot - s.c.top, H = (p.h || 1.7) * ppm * pedRel(p.t, im), W2 = im.width / im.height * H;
  const show = stand ? Math.min(1.05 * ppm, winH * .95) : Math.min(.55 * ppm, winH * .82), headTop = s.c.bot - show, ox = (p._sx || 0) * ppm, oy = (p._sy || 0) * ppm;
  x.save(); x.translate(s.x + ox, headTop + oy + H); x.rotate(clamp((p._sx || 0) * .9, -.2, .2)); const fl = !forPreview && typeof wantsOff === 'function' && wantsOff(p) && Math.floor(G.time * 4) % 2 === 0; if (fl) goldOutline(x, im, -W2 / 2, -H, W2, H); x.drawImage(im, -W2 / 2, -H, W2, H); x.restore(); };
 seated.slice(0, slots.length).forEach((p, i) => drawP(p, slots[order[i]], false));
 if (V.cls !== 'micro') standing.slice(0, Math.max(1, slots.length >> 1)).forEach((p, i) => drawP(p, slots[(i * 3 + 1) % slots.length], true));
 x.drawImage(B.over, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(K.c, 0, 0); x.globalCompositeOperation = 'source-over'; return B.dyn; };
/* ---------------- premium wet-road spray behind every rolling wheel ---------------- */
function rainSpray(c, k){ const sp = Math.abs(c.vx); if (sp < 2.5) return; const dir = Math.sign(c.vx) || 1, lift = c.lift || 0;
 for (const w of c.wh){ if (!w.ground) continue; const n = sp > 15 ? 4 : sp > 7 ? 3 : 2; for (let i = 0; i < n; i++){ if (Math.random() > .7 * k) continue; const bx = w.x - dir * w.r * .9, by = terrH(w.x) + lift + .05;
   puff(bx, by, -dir * (sp * (.3 + Math.random() * .4)), 1.5 + Math.random() * 2.6 + sp * .06, .5 + Math.random() * .35, .03, '#e6f1ff', 'drop'); }
  if (Math.random() < .55 * k * clamp(sp / 10, .4, 1.5)) puff(w.x - dir * w.r * 1.3, terrH(w.x) + lift + .3, -dir * sp * .22, .5, 1.3 + Math.random() * .7, .18 + sp * .01, '#f2f6fb', 'dust'); } }
const _upd15 = update;
update = function(dt){ _upd15(dt); if (G.mode !== 'play' || G.weather !== 'rain' || G.paused) return; rainSpray(G.car, 1); for (const a of G.ai) if (Math.abs(a.x - G.car.x) < 60) rainSpray(a, .45); };
/* ---------------- one continuous skyline: alternating compatible panoramas, never stacked ---------------- */
const SKY15 = {city:['pCairo','pResid'], mokattam:['pCitadel','pIslamic'], nile:['pCorniche','pNileHigh'], ring:['pBusiness','pNewCairo'], alex:['pCoast','pResid'], desert:['pDesert','pDesertFuel'], redsea:['pCoast','pDesert'], sinai:['pDesert','pDesertFuel'], upper:['pFarm','pDesert']};
function drawLayers(){
 const hz = horizon(), P = skyPal(), night = G.tod === 'night', keys = SKY15[W.route.biome] || SKY15.city, H = VH * .23, base = hz + VH * .12, f = .02;
 const ims = keys.map((k, i) => panoTint(k, 0)).filter(Boolean); if (!ims.length) return; const widths = ims.map(im => im.width / im.height * H), total = widths.reduce((a, b) => a + b, 0);
 let x0 = -((cam.x * PPM * f) % total); if (x0 > 0) x0 -= total; let x = x0, i = 0;
 while (x < VW){ const im = ims[i % ims.length], w = widths[i % ims.length]; ctx.drawImage(im, x, base - H, w + 1, H); x += w; i++; }
 // atmospheric depth: haze at the skyline base fading into the street
 const g = ctx.createLinearGradient(0, base - H * .35, 0, base + VH * .08); g.addColorStop(0, rgb(P.haze, 0)); g.addColorStop(.55, rgb(P.haze, night ? .18 : .38)); g.addColorStop(1, night ? '#12151c' : mix(W.biome.ground, '#8a8070', .55)); ctx.fillStyle = g; ctx.fillRect(0, base - H * .35, VW, VH);
 const sky = ctx.createLinearGradient(0, hz - VH * .05, 0, base); sky.addColorStop(0, rgb(P.haze, 0)); sky.addColorStop(1, rgb(P.haze, night ? .04 : .1)); ctx.fillStyle = sky; ctx.fillRect(0, hz - VH * .05, VW, base - hz + VH * .05);
}

/* ======================= career-2.js ======================= */
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

/* ======================= police-horn.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v17 — police cruise quietly unless on an emergency ·
   instant horn (sample leading silence skipped)
   ===================================================================== */
/* emergencies that ask you to yield: mostly ambulances & fire; police only sometimes */
AI_EMG.length = 0; AI_EMG.push(10, 26, 27, 28, 10, 26, 27, 11, 22);
/* regular patrol cars appear in everyday traffic now and then — lights and siren off */
AI_CIV.push(22, 23);
{ const _rev17 = randomEvent; randomEvent = function(){ _rev17(); const a = G.ambEv && G.ambEv.car; if (a && [11,22,23,24,25].includes(a.spec) && Math.random() < .5){ a.siren = null; a.special = null; a.amb = false; G.ambEv = null; } }; }
/* horn: start each recording at its first audible sample */
SND.lead = {};
function leadIn(buf){ const d = buf.getChannelData(0), th = .02; for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > th) return Math.max(0, i / buf.sampleRate - .005); return 0; }
SND.play = function(k, vol, rate, loop){ const c = AU.ctx, b = this.buf[k]; if (!c || !b) return null; if (!(k in this.lead)) this.lead[k] = /snd_h/.test(k) ? leadIn(b) : 0;
 if (c.state === 'suspended') c.resume(); const s = c.createBufferSource(); s.buffer = b; s.loop = !!loop; s.playbackRate.value = rate || 1; const g = c.createGain(); g.gain.value = vol; s.connect(g).connect(AU.sfxG); s.start(0, loop ? 0 : this.lead[k]); return {s, g}; };

/* ======================= doors-bubbles.js ======================= */
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

/* ======================= shadows.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v19 — directional vehicle shadows (sun by day, street lamps
   and headlights by night) + tight contact shadows under the tyres
   ===================================================================== */
/* soft, projected silhouette: direction dx (−1…1 shear), length ly, opacity a */
function projShadow(src, X, baseY, sw, shh, mk, k, dx, ly, a, blur){ if (a <= .01) return; const w = sw * mk, h = shh * k; ctx.save(); ctx.globalAlpha = a; 
 ctx.setTransform(DPR * w / src.width, 0, -DPR * dx * h / src.height, DPR * ly * h / src.height, DPR * (X - w / 2 + dx * h), DPR * (baseY - ly * h)); ctx.drawImage(sil(src), 0, 0); ctx.restore(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
function dirShadow(car, src, X, gy, sw, shh, mk, k){ const lift = car.lift || 0, night = G.tod === 'night';
 if (!night){ const s = SUN(), sunset = G.tod === 'sunset'; projShadow(src, X, gy + 1, sw, shh, mk, k * .95, -s.x * (sunset ? 1.5 : .8), sunset ? .5 : .42, (sunset ? .5 : .55) * (G.weather === 'rain' ? .45 : 1), 1.2); return; }
 // night: every nearby street lamp throws its own shadow away from the lamp; strength falls with distance
 const [x0, x1] = viewX(); let n = 0;
 for (const p of W.props){ if (n > 2) break; if (!(p.k === 'lamp' || p.k === 'lamp2' || p.k === 'lamp3') || p.x < x0 - 10 || p.x > x1 + 10) continue; const lx = p.x + (p.k === 'lamp' ? .9 : 0), d = car.x - lx, ad = Math.abs(d); if (ad > 14) continue; n++;
  const dir = clamp(d / 5, -1.8, 1.8), a = .55 * (1 - ad / 14); projShadow(src, X, gy + 1, sw, shh, mk, k * .95, dir, .4 + ad * .02, a, 1.5); }
 // headlights of the vehicle behind cast a long forward shadow
 for (const o of G.ai.concat(G.car ? [G.car] : [])){ if (o === car || !o.headOn || (o.lift || 0) !== lift) continue; const d = car.x - o.x, dirO = o.mirror ? -1 : 1; if (d * dirO <= 0 || Math.abs(d) > 22) continue; projShadow(src, X, gy + 1, sw, shh, mk, k * .95, Math.sign(d) * 1.6, .35, .25 * (1 - Math.abs(d) / 22), 2.5); break; }
}
/* contact shadows: dark, tight patches where each tyre meets the road + a soft band under the body */
function contactShadow(car, lift, sc){ const ws = car.wh; if (!ws || !ws.length) return; const xs = ws.map(w => w.x), x0 = Math.min(...xs), x1 = Math.max(...xs), r = ws[0].r;
 ctx.save(); const y0 = sy(terrH((x0 + x1) / 2) + lift) + 1; const band = ctx.createLinearGradient(0, y0 - PPM * .06, 0, y0 + PPM * .1); band.addColorStop(0, 'rgba(0,0,0,0)'); band.addColorStop(.5, `rgba(0,0,0,${G.tod === 'night' ? .22 : .28})`); band.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = band; ctx.fillRect(sx(x0 - r * .6), y0 - PPM * .06, (x1 - x0 + r * 1.2) * PPM * sc, PPM * .16);
 for (const w of ws){ const X = sx(w.x), Y = sy(terrH(w.x) + lift) + 1, R = w.r * PPM * sc; const g = ctx.createRadialGradient(X, Y, 0, X, Y, R * 1.1); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.45, 'rgba(0,0,0,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.save(); ctx.translate(X, Y); ctx.scale(1, .16); ctx.beginPath(); ctx.arc(0, 0, R * 1.1, 0, 7); ctx.fill(); ctx.restore(); }
 ctx.restore(); }

/* ======================= traffic-variety.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v20 — minivan window fit · varied AI colours & mods ·
   Alexandria corniche skyline
   ===================================================================== */
/* measured rear-window openings (sprite fractions) — passengers sit above the sill bar */
BAKEDWIN.minivan = [[.296, .095, .455, .3], [.112, .13, .268, .305]];
BAKEDWIN.fiat128 = [[.305, .135, .46, .325]];
for (const k in BCAB) delete BCAB[k];
/* AI traffic: realistic paint variety, tinted windows, sport stripes */
const AIPAINTABLE = new Set(['ai1','ai2','ai3','ai7','ai12','ai13','ai14','ai15','ai16','ai17','ai18']);
const AICOLS = [[238,240,242],[176,182,190],[34,36,40],[118,24,40],[26,48,98],[214,200,170],[168,28,30],[96,102,110],[22,92,86],[120,96,70],[40,80,140]];
const AIVAR = new Map();
function aiVariant(spr, ci, tint, stripe){ const key = spr + '|' + ci + '|' + tint + '|' + stripe; let c = AIVAR.get(key); if (c) return c; const M = paintMask(spr), w = M.w, h = M.h; c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), id = x.createImageData(w, h), o = id.data, d = M.src; o.set(d); const P = AICOLS[ci];
 for (let p = 0, i = 0; p < w * h; p++, i += 4){ const mw = M.m[p]; if (mw > 0){ const L = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, f = Math.pow(L / M.dL, 1.05), lift = (P[0] * .3 + P[1] * .59 + P[2] * .11) < 80 ? 1.25 : 1; for (let k = 0; k < 3; k++) o[i + k] = lerp(d[i + k], clamp(P[k] * f * lift + (L > M.dL * 1.02 ? (L - M.dL) * .8 : 0), 0, 255), mw); }
  if (tint && M.win[p]) for (let k = 0; k < 3; k++) o[i + k] = o[i + k] * .45 + 6; }
 x.putImageData(id, 0, 0);
 if (stripe){ const mk = document.createElement('canvas'); mk.width = w; mk.height = h; const mx = mk.getContext('2d'), md = mx.createImageData(w, h); for (let p = 0; p < w * h; p++) md.data[p * 4 + 3] = M.m[p] > .35 ? 255 : 0; mx.putImageData(md, 0, 0); const s = document.createElement('canvas'); s.width = w; s.height = h; const sx2 = s.getContext('2d'); sx2.fillStyle = ci === 0 || ci === 5 ? '#1a1a1a' : '#f2f2f2'; sx2.fillRect(0, h * .62, w, h * .035); sx2.fillRect(0, h * .675, w, h * .015); sx2.globalCompositeOperation = 'destination-in'; sx2.drawImage(mk, 0, 0); x.drawImage(s, 0, 0); }
 if (AIVAR.size > 80) AIVAR.clear(); AIVAR.set(key, c); return c; }
const _spawn20 = spawnAI;
spawnAI = function(spec, lane, x, dir, opt){ const c = _spawn20(spec, lane, x, dir, opt); if (!c) return c; const spr = AIV[spec].spr;
 if (AIPAINTABLE.has(spr) && !c.siren && Math.random() < .65){ const ci = (Math.random() * AICOLS.length) | 0, tint = Math.random() < .35, stripe = Math.random() < .12; try{ c.cv = aiVariant(spr, ci, tint, stripe); const cv2 = document.createElement('canvas'); cv2.width = c.cv.width; cv2.height = c.cv.height; cv2.getContext('2d').drawImage(c.cv, 0, 0); c.cv = cv2; }catch(e){} }
 if (Math.random() < .15 && !c.siren) c.glow = null; return c; };
/* Alexandria roads: the corniche panorama (Qaitbay citadel, Stanley bridge, library, mosques) */
SKY15.alex = ['pAlex1', 'pAlex2', 'pAlex3', 'pAlex4'];


"use strict";
/* AI wheels: rotate only the rim (the tyre is uniform rubber and fenders often overlap it), so every
   wheel spins as a perfect circle about its measured hub */
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr], bike = spr === 'ai5' || spr === 'ai6' || spr === 'ai4', heavy = ['ai8','ai9','ai19','ai20','ai21','ai28','ai29','ai30','ai10','ai26','ai27'].includes(spr);
 return AIWHEELS[spr] = META[spr].wheels.map(([cx, cy, r]) => { const R = r * (bike ? .56 : heavy ? .56 : .64), S = Math.ceil(R) * 2 + 2, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.beginPath(); x.arc(S / 2, S / 2, R, 0, 7); x.clip(); x.drawImage(im, -(cx - S / 2), -(cy - S / 2)); return c; }); }
for (const k in AIWHEELS) delete AIWHEELS[k];

/* ======================= officer.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v21 — traffic officer with a full motion set (stop, slow down,
   direct, walk, request papers, inspect, flashlight, crouch, search,
   radio, citation, wave through, salute) · boarding matches free seats
   ===================================================================== */
const OFA = n => { const a = []; for (let i = 0; i < 8; i++) a.push('of_' + n + i); return a; };
const OFH = META.of_idle0 ? META.of_idle0.h : 150;
/* plan the inspection the moment the vehicle stops in the bay */
function cpPlan(c){ const car = G.car, fs = []; if (G.tod === 'night' && !car.headOn) fs.push('lights'); if (!G.test && Date.now() - GV(G.vid).inspT > 14 * DAY) fs.push('insp'); if (!G.test && (S.lic.suspUntil > Date.now() || !hasLic(G.V.cls) || licExpired())) fs.push('lic'); if (!G.test && vlicExpired(G.vid)) fs.push('vlic');
 const big = G.V.cls !== 'micro', steps = [['walk', 1.1], ['request', 1.3], [G.tod === 'night' ? 'flash' : 'inspect', 1.7]];
 if (big && Math.random() < .35) steps.splice(1, 0, ['direct', 1.1]);
 const r = Math.random(); if (r < .18) steps.push(['crouch', 1.6]); else if (r < .33) steps.push(['reach', 1.4]);
 if (fs.length) steps.push(['radio', 1.3], ['cite', 1.9]); else steps.push(['pass', 1.3]);
 let t = 0; const seq = steps.map(([a, d]) => { const o = {a, t0:t, d}; t += d; return o; }); return {seq, dur:t, fines:fs.length > 0}; }
/* officer brain: picks the right animation for what is happening */
function officerAnim(c){ const car = G.car, front = car.x + car.L / 2, d = c.x - front, sp = speedOf(car), t = G.time;
 if (c.state === 'signal'){ const a = sp > 8.5 ? 'slow' : 'stop'; const k = c.t * 5; return {a, f:k < 5 ? Math.floor(k) : 3 + Math.floor(Math.abs(Math.sin(t * 2.2)) * 2.99), face:-1}; }
 if (c.state === 'check' && c.plan){ const s = c.plan.seq.find(q => c.t >= q.t0 && c.t < q.t0 + q.d) || c.plan.seq[c.plan.seq.length - 1], p = clamp((c.t - s.t0) / s.d, 0, .999);
  if (s.a === 'walk'){ const tx = clamp(front - .9, c.x - 16, c.x - 1); c.ox = lerp(c.ox0 ?? (c.ox0 = c.ox), tx, p); return {a:'walk', f:Math.floor(t * 9) % 8, face:c.ox0 > tx ? -1 : 1}; }
  return {a:s.a, f:Math.floor(p * 8), face:-1}; }
 if (c.state === 'done'){ c.doneT = (c.doneT || 0) + (G._dt || 0); if (c.ran && c.doneT < 3) return {a:'radio', f:Math.min(7, Math.floor(c.doneT * 3)) , face:-1};
  if (!c.plan || c.plan.fines) return {a:'idleHands', f:Math.floor(t * 3) % 8, face:-1};
  if (c.doneT < 1.4) return {a:'salute', f:Math.floor(c.doneT / 1.4 * 8), face:-1}; }
 // idle: breathing, sometimes hands on belt
 const cyc = (t + c.x * .13) % 12; return cyc < 8.5 ? {a:'idle', f:Math.floor(t * 2.2) % 8, face:-1} : {a:'idleHands', f:Math.floor((cyc - 8.5) / 3.5 * 8), face:-1}; }
function drawOfficer(c){ if (!META.of_idle0){ return; } if (c.ox == null) c.ox = c.x - 1; const A = officerAnim(c), key = 'of_' + A.a + clamp(A.f, 0, 7), im = IMG[key], m = META[key]; if (!im) return;
 const s = 1.8 * PPM / OFH, h = m.h * s, w = m.w * s, X = sx(c.ox), Y = sy(terrH(c.ox) + 1.2);
 if (X < -80 || X > VW + 80) return; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(X, Y, PPM * .35, PPM * .07, 0, 0, 7); ctx.fill(); ctx.translate(X, Y); if (A.face < 0) ctx.scale(-1, 1); ctx.drawImage(im, -m.ax * s, -h, w, h); ctx.restore(); }
/* remember when a driver runs the checkpoint (the officer radios it in) */
const _af21 = addFine;
addFine = function(k, cam){ if (k === 'run'){ const c = W.cps.find(q => q.state === 'done' && Math.abs(q.x - G.car.x) < 40); if (c){ c.ran = true; c.doneT = 0; } } _af21(k, cam); };
/* ---------------- boarding: only as many people step up as there are free places ---------------- */
const _upd21 = update;
update = function(dt){ _upd21(dt); if (G.mode !== 'play') return; const car = G.car, st = W.stops[G.nextIdx]; if (!st || st.trimmed || !st.waiting || st.x - car.x > 70 || st.i === W.stops.length - 1) return; st.trimmed = true;
 const room = Math.max(0, seatsOf(G.V) - G.onboard.length + G.onboard.filter(p => p.dest <= st.i).length);
 if (st.waiting.length > room){ const extra = st.waiting.splice(room); extra.forEach((p, i) => G.walkers.push({t:p.t, h:p.h, x:st.x - 3 + (i % 5) * .75, y:1.8, ty:1.8, tx:st.x - 3 + (i % 5) * .75 + (Math.random() < .5 ? -1 : 1) * (10 + Math.random() * 8), spd:1 + Math.random() * .4, d:0, fade:true}));
  if (!room) toast('🚐 ' + L2('العربية مليانة — الناس هتستنى اللي بعدك', 'Vehicle full — people will wait for the next one'), 'gold'); } };


"use strict";
/* AI wheels: each rim was measured individually (hub centre + rim radius); only that exact disc rotates */
function aiWheelCrops(spr){ if (AIWHEELS[spr]) return AIWHEELS[spr]; const im = IMG[spr], M = META[spr], bike = spr === 'ai5' || spr === 'ai6' || spr === 'ai4';
 return AIWHEELS[spr] = M.wheels.map(([cx, cy, r], i) => { const R = !bike && M.rim && M.rim[i] ? M.rim[i] : r * .56, S = Math.ceil(R) * 2 + 4, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.beginPath(); x.arc(S / 2, S / 2, R, 0, 7); x.clip(); x.drawImage(im, -(cx - S / 2), -(cy - S / 2)); return c; }); }
for (const k in AIWHEELS) delete AIWHEELS[k];

/* ======================= damage.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v22 — physical damage model: sheet metal really deforms
   (crushed edges, folded creases, pushed-in panels), scraped paint
   down to primer and bare metal, spider-web glass, smashed lamps,
   sagging bumpers — all persistent and replayed from the saved dents
   ===================================================================== */
function dRand(u, v, k){ const s = Math.sin(u * 127.1 + v * 311.7 + k * 74.7) * 43758.5453; return s - Math.floor(s); }
function drawDents(x, dents, w, h){
 for (const dt of dents){ const [u, v, r, ty] = dt, cx = u * w, cy = v * h, sev = clamp((r - .025) / .045, 0, 1);
  if (ty === 2){ glassCrack(x, cx, cy, r * w * 1.4, u, v); continue; }
  if (ty === 4){ smashLamp(x, cx, cy, r * w, u, v); continue; }
  const R = r * w * (1.5 + sev * .8), edge = u > .8 || u < .2, dirX = u > .5 ? 1 : -1, depth = R * (.28 + sev * .3);
  const x0 = Math.max(0, Math.floor(cx - R - depth)), y0 = Math.max(0, Math.floor(cy - R - depth)), x1 = Math.min(w, Math.ceil(cx + R + depth)), y1 = Math.min(h, Math.ceil(cy + R + depth)), bw = x1 - x0, bh = y1 - y0; if (bw < 2 || bh < 2) continue;
  const src = x.getImageData(x0, y0, bw, bh), dst = x.createImageData(bw, bh), s = src.data, o = dst.data; o.set(s);
  const ph = dRand(u, v, 1) * 6.28, folds = 3 + Math.floor(dRand(u, v, 2) * 3);
  for (let py = 0; py < bh; py++) for (let px = 0; px < bw; px++){ const X = x0 + px, Y = y0 + py, dx = X - cx, dy = Y - cy, dist = Math.hypot(dx, dy); if (dist >= R) continue;
   const fall = Math.pow(1 - dist / R, 1.6), an = Math.atan2(dy, dx), crease = .75 + .25 * Math.sin(an * folds + ph) + .12 * Math.sin(dist * .6 + ph);
   // sample outward → surface is pushed in (edge impacts crush the outline inward)
   let sx2, sy2; if (edge){ sx2 = px + dirX * depth * fall * crease; sy2 = py + Math.sin(dist * .35 + ph) * depth * .12 * fall; } else { sx2 = px + dx / (dist + 1) * depth * .45 * fall * crease; sy2 = py + dy / (dist + 1) * depth * .45 * fall * crease; }
   const ix = Math.round(sx2), iy = Math.round(sy2), q = (py * bw + px) * 4; if (ix < 0 || iy < 0 || ix >= bw || iy >= bh){ o[q + 3] = edge ? 0 : o[q + 3]; continue; } const p2 = (iy * bw + ix) * 4;
   // folded metal shading: dark valleys, bright ridges along the crease pattern
   // lighting from the dent's surface normal (light from upper-left) + crumple wrinkles on crushed edges
   const gx = -dx / (dist + .001) * 1.6 * Math.pow(1 - dist / R, .6) / R, gy = -dy / (dist + .001) * 1.6 * Math.pow(1 - dist / R, .6) / R; let lit = (gx * -.6 + gy * -.8) * R * .9 * (.6 + sev);
   if (edge){ const wr = Math.sin(dx * (.55 - sev * .15) + Math.sin(dy * .13 + ph) * 3.2 + Math.sin(dy * .41 + ph * 2) * .9 + ph); lit += wr * fall * fall * (.35 + sev * .3); }
   const shade = clamp(1 - Math.max(0, lit) * .45 - fall * .06, .35, 1.2), hi = Math.max(0, -lit) * .18 * fall;
   o[q] = clamp(s[p2] * shade + 255 * hi, 0, 255); o[q + 1] = clamp(s[p2 + 1] * shade + 255 * hi, 0, 255); o[q + 2] = clamp(s[p2 + 2] * shade + 255 * hi, 0, 255); o[q + 3] = s[p2 + 3]; }
  x.putImageData(dst, x0, y0);
  x.save(); x.globalCompositeOperation = 'source-atop';
  // scraped paint: primer grey and bare metal streaks with dark gouges
  // fine scuffs: many short, broken hairline scratches following the impact direction, some down to primer
  const nS = ty === 1 ? 26 : 8 + Math.floor(sev * 14); x.lineCap = 'round';
  for (let i = 0; i < nS; i++){ const r1 = dRand(u, v, 10 + i), r2 = dRand(u, v, 30 + i), r3 = dRand(u, v, 50 + i), sy3 = cy + (r1 - .5) * R * 1.2, sx3 = cx + (r2 - .5) * R * 1.3, len = R * (.12 + r3 * .45), deep = r3 > .78;
   x.strokeStyle = deep ? 'rgba(120,124,128,.55)' : `rgba(235,238,240,${.22 + r1 * .25})`; x.lineWidth = deep ? Math.max(.8, R * .03) : .7; x.beginPath(); x.moveTo(sx3, sy3); x.lineTo(sx3 - dirX * len * .5, sy3 + (r2 - .5) * 1.5); x.moveTo(sx3 - dirX * len * .6, sy3 + (r2 - .5) * 2); x.lineTo(sx3 - dirX * len, sy3 + (r1 - .5) * 3); x.stroke();
   if (deep){ x.strokeStyle = 'rgba(40,36,32,.3)'; x.lineWidth = .6; x.stroke(); } }
  // grime & soot pooled in the dent
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(25,20,15,${.18 + sev * .15})`); g.addColorStop(1, 'rgba(25,20,15,0)'); x.fillStyle = g; x.fillRect(cx - R, cy - R, R * 2, R * 2);
  x.restore();
  // sagging bumper on hard front/rear corner hits
  if (edge && sev > .45 && v > .55){ const bwid = w * .14, bh2 = h * .2, bx = dirX > 0 ? w - bwid : 0, by = Math.min(h - bh2, cy - bh2 * .3); const chunk = document.createElement('canvas'); chunk.width = Math.ceil(bwid); chunk.height = Math.ceil(bh2); chunk.getContext('2d').drawImage(x.canvas, bx, by, bwid, bh2, 0, 0, bwid, bh2);
   x.save(); x.globalCompositeOperation = 'destination-out'; x.fillRect(bx, by, bwid, bh2); x.restore(); x.save(); const pivX = dirX > 0 ? bx : bx + bwid; x.translate(pivX, by); x.rotate(dirX * (.06 + sev * .08)); x.drawImage(chunk, dirX > 0 ? 0 : -bwid, h * .01); x.restore(); }
 } }
function glassCrack(x, cx, cy, R, u, v){ x.save(); x.globalCompositeOperation = 'source-atop'; x.lineCap = 'round';
 const n = 9 + Math.floor(dRand(u, v, 3) * 5); for (let i = 0; i < n; i++){ const a = i / n * 6.28 + dRand(u, v, i) * .5; let px = cx, py = cy; x.strokeStyle = 'rgba(235,245,255,.75)'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); const L = R * (.5 + dRand(u, v, i + 9) * .8); for (let k = 1; k <= 4; k++){ px = cx + Math.cos(a + (dRand(u, v, i * 7 + k) - .5) * .3) * L * k / 4; py = cy + Math.sin(a + (dRand(u, v, i * 5 + k) - .5) * .3) * L * k / 4; x.lineTo(px, py); } x.stroke(); }
 for (let ring = 1; ring <= 3; ring++){ const rr = R * ring * .22; x.strokeStyle = `rgba(235,245,255,${.55 - ring * .12})`; x.beginPath(); for (let i = 0; i <= n; i++){ const a = i / n * 6.28; const jr = rr * (.85 + dRand(u, v, ring * 20 + i) * .3); i ? x.lineTo(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr) : x.moveTo(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr); } x.stroke(); }
 const g = x.createRadialGradient(cx, cy, 0, cx, cy, R * .25); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - R, cy - R, R * 2, R * 2); x.restore(); }
function smashLamp(x, cx, cy, R, u, v){ x.save(); x.globalCompositeOperation = 'source-atop'; const g = x.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(12,12,14,.95)'); g.addColorStop(.7, 'rgba(30,30,34,.8)'); g.addColorStop(1, 'rgba(30,30,34,0)'); x.fillStyle = g; x.beginPath(); for (let i = 0; i < 10; i++){ const a = i / 10 * 6.28, rr = R * (.55 + dRand(u, v, i) * .45); i ? x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill();
 x.fillStyle = 'rgba(230,240,255,.8)'; for (let i = 0; i < 6; i++){ const a = dRand(u, v, 40 + i) * 6.28, rr = R * (.5 + dRand(u, v, 50 + i) * .4); x.beginPath(); x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); x.lineTo(cx + Math.cos(a + .25) * rr * 1.1, cy + Math.sin(a + .25) * rr * 1.1); x.lineTo(cx + Math.cos(a + .1) * rr * .6, cy + Math.sin(a + .1) * rr * .6); x.fill(); } x.restore(); }
/* dent records: heavier hits → heavy type; front/rear lamps smash when hit near them */
addDent = function(car, lx, ly, sev, glass){ if (!car.cv) return; const g = car.g, w = car.cv.width, h = car.cv.height, u = clamp((car.mirror ? -lx : lx) / g.len + .5, .03, .97), v = clamp(.5 - ly / g.h, .08, .9);
 const ty = glass ? 2 : sev > 11 ? 3 : Math.random() < .35 ? 1 : 0, dd = [u, v, clamp(.025 + sev * .004, .025, .07), ty]; const list = [dd];
 const M = META[car.spr]; if (!glass && sev > 6 && M){ const near = (p, n) => p && Math.abs(p[0] / M.w - u) < .12 && Math.abs(p[1] / M.h - v) < .25; if (near(M.hl) && !car.brokenHL){ list.push([M.hl[0] / M.w, M.hl[1] / M.h, .03, 4]); car.brokenHL = true; } if (near(M.tl) && !car.brokenTL){ list.push([M.tl[0] / M.w, M.tl[1] / M.h, .025, 4]); car.brokenTL = true; } }
 drawDents(car.cv.getContext('2d'), list, w, h); if (car.dents){ car.dents.push(...list); if (car.dents.length > 45) car.dents.splice(0, car.dents.length - 45); } SILC.delete(car.cv); };

/* ======================= fleet-fx.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v23 — new fleet (6 premium player vehicles with real wheels,
   19 real-model vans/minibuses/coaches as AI traffic and showroom cars),
   soft long-travel bus suspension, heavier fuel use, quieter A/C,
   fewer punctures, and hand-painted particle effects for punctures
   and crashes (sparks, dust, smoke, steam, water, flying parts)
   ===================================================================== */
/* ---------------- vehicle catalogue ---------------- */
const VT = id => VEHS.find(v => v.id === id);
function addVeh(tpl, o){ if (VT(o.id)) return; const v = Object.assign({}, VT(tpl), o); VEHS.push(v); }
// premium player vehicles (separate wheels, full cosmetics)
addVeh('hiace', {id:'hiace2', spr:'pn0', rim:12, name:['تويوتا هايس الجيل الجديد','Toyota HiAce (New Gen)'], len:5.4, mass:2300, seats:14, price:34000, lvl:3, acc:3.5, vmax:36, lp100:11, store:130});
addVeh('hiace', {id:'hiaceB', spr:'pn1', rim:13, name:['هايس كلاسيك الخط الأزرق','HiAce Classic Blue Line'], len:5.3, mass:2200, seats:14, price:15000, lvl:1, acc:3.1, vmax:32, lp100:12.5, store:110});
addVeh('coaster', {id:'kinglong', spr:'pn2', rim:14, name:['كينج لونج ميني باص فضي','King Long Silver Minibus'], len:6.1, mass:3100, seats:18, stand:2, price:39000, lvl:3, acc:3.0, vmax:32, tank:80, lp100:14, store:160});
addVeh('coaster', {id:'rosa', spr:'pn3', rim:15, name:['ميتسوبيشي روزا','Mitsubishi Rosa'], len:7.0, mass:4500, seats:26, stand:4, price:46000, lvl:4, acc:2.8, vmax:30, tank:100, lp100:17, store:240});
addVeh('redbus', {id:'redbus2', spr:'pn4', rim:16, name:['أتوبيس المدينة الجديد','New City Bus'], len:10.8, mass:10200, seats:32, stand:34, price:72000, lvl:5, acc:2.35, vmax:26, tank:200, lp100:30, store:320});
addVeh(VEHS.find(v => v.cls === 'coach').id, {id:'coachN', spr:'pn5', rim:17, name:['أتوبيس سفر أزرق فاخر','Navy Executive Coach'], len:12, mass:13500, seats:49, stand:0, price:210000, lvl:7, acc:2.1, vmax:33, tank:420, lp100:29, store:900});
// real-model fleet from the reference sheet (baked wheels, paintable white bodies)
const NV = [
 // id, template, class, name, real length (m), kerb+gross-ish mass (kg), seats, price, level, tank (L), L/100km
 ['suzuki','minivan','micro',['سوزوكي إيفري فان','Suzuki Every Van'],3.4,1050,7,9000,1,40,8],
 ['fotonC2','minivan','micro',['فوتون C2','Foton C2'],4.2,1500,9,13000,1,50,9],
 ['joyA4','minivan','micro',['جوي لونج A4','Joylong A4'],4.9,1850,11,16000,1,60,10],
 ['joyA5','hiace','micro',['جوي لونج A5','Joylong A5'],5.3,2150,14,20000,2,70,11],
 ['hiaceW','hiace','micro',['تويوتا هايس أبيض','Toyota HiAce (White)'],5.38,2250,14,24000,2,70,11.5],
 ['kingWB','hiace','micro',['كينج لونج فان عريض','King Long Wide Body Van'],5.99,2650,16,30000,3,80,12.5],
 ['gdx6532','coaster','micro',['جولدن دراجون XML6532','Golden Dragon XML6532'],5.99,3200,19,36000,3,85,14],
 ['coasterW','coaster','micro',['تويوتا كوستر أبيض','Toyota Coaster (White)'],6.99,4300,26,44000,4,95,17],
 ['joyA6','coaster','micro',['جوي لونج A6','Joylong A6'],5.99,3300,19,40000,4,85,14.5],
 ['xmq6600','coaster','micro',['كينج لونج XMQ6600','King Long XMQ6600'],6.0,3500,19,38000,3,90,15],
 ['higer6720','redbus','bus',['هايجر KLQ6720','Higer KLQ6720'],7.2,5800,29,55000,4,120,19],
 ['zk6770','redbus','bus',['يوتونج ZK6770','Yutong ZK6770'],7.7,6200,31,60000,5,130,20],
 ['xmq6127','coach','coach',['كينج لونج XMQ6127','King Long XMQ6127'],12,13000,53,190000,6,400,28],
 ['gdx6125','coach','coach',['جولدن دراجون XML6125','Golden Dragon XML6125'],12,13200,51,195000,6,400,28],
 ['zk6128','coach','coach',['يوتونج ZK6128','Yutong ZK6128'],12.2,13400,53,205000,7,420,28.5],
 ['tourismo','coach','coach',['مرسيدس توريزمو','Mercedes-Benz Tourismo'],12.14,13800,49,260000,7,440,27]];
NV.forEach(([id, tpl, cls, name, len, mass, seats, price, lvl, tank, lp], i) => { const T = tpl === 'coach' ? VEHS.find(v => v.cls === 'coach').id : tpl;
 addVeh(T, {id, spr:'nw' + i, baked:false, rim:18 + i, cls, name, len, mass, seats, stand:cls === 'bus' ? Math.round(seats * .8) : cls === 'micro' && len > 6.5 ? 4 : 0, price, lvl, tank, lp100:lp, store:Math.round(len * len * 3), rack:cls === 'micro', door:cls === 'bus' ? .35 : .12, acc:cls === 'coach' ? 2.1 : cls === 'bus' ? 2.4 : len < 5 ? 3.6 : len < 6.2 ? 3.2 : 2.8, vmax:cls === 'coach' ? 33 : cls === 'bus' ? 27 : len < 5 ? 31 : 33}); });
// which lines each vehicle may run (minibuses serve both microbus and bus lines)
for (const v of VEHS){ const mini = v.len >= 5.9 && v.len <= 7.8 && v.cls !== 'coach'; if (v.cls === 'micro' && !CLS_OK.micro.includes(v.id)) CLS_OK.micro.push(v.id); if ((v.cls === 'bus' || mini) && !CLS_OK.bus.includes(v.id)) CLS_OK.bus.push(v.id); if (v.cls === 'coach' && !CLS_OK.coach.includes(v.id)) CLS_OK.coach.push(v.id); if (v.cls === 'bus' && v.len < 8 && !CLS_OK.micro.includes(v.id)) CLS_OK.micro.push(v.id); }
// their own wheels join the rim catalogue
[['جنط هايس جديد','HiAce alloy'],['جنط كلاسيك','Classic steel'],['جنط كينج لونج','King Long steel'],['جنط روزا','Rosa hub-cap'],['جنط أتوبيس','City-bus steel'],['جنط مرسيدس','Coach alloy']].forEach((n, i) => { if (!COS.rim.find(r => r.wh === 12 + i)) COS.rim.push({id:'w' + (12 + i), wh:12 + i, p:500 + i * 120, n}); });
// cabins, engines
Object.assign(DRV, {hiace2:.7, hiaceB:.7, kinglong:.78, rosa:.8, redbus2:.87, coachN:.86});
Object.assign(ENGP, {hiace2:ENGP.hiace, hiaceB:ENGP.hiace, kinglong:ENGP.coaster, rosa:ENGP.coaster, redbus2:ENGP.redbus, coachN:ENGP.coachB});
NV.forEach(([id, tpl]) => { ENGP[id] = ENGP[tpl === 'coach' ? 'coachB' : tpl] || ENGP.hiace; });
// AI traffic: the same real models drive around, in many colours
NV.forEach(([id, tpl, cls, name, len, mass], i) => { const spec = AIV.length; AIV.push({spr:'nw' + i, len, v:cls === 'coach' ? [70, 95] : cls === 'bus' ? [45, 65] : [45, 80], mass, whRim:18 + i}); AI_CIV.push(spec); if (typeof AIPAINTABLE !== 'undefined') AIPAINTABLE.add('nw' + i); });
/* ---------------- buses: soft, slow, long-travel suspension ---------------- */
function softSusp(c, len){ if (!c || len < 6.5) return; const n = c.wh.length, m = c.base; c.f = len > 9 ? .92 : 1.12; c.zeta = Math.min(c.zeta, .3); c.travel = Math.max(c.travel, len > 9 ? .24 : .21);
 c.k = (m / n) * Math.pow(2 * Math.PI * c.f, 2); c.cd = 2 * c.zeta * Math.sqrt(c.k * m / n); c.kb = c.k * 12; }
const _sr23 = startRoute;
startRoute = function(route, opt){ _sr23(route, opt); if (G.car && G.V) softSusp(G.car, G.V.len); };
const _sp23 = spawnAI;
spawnAI = function(spec, lane, x, dir, opt){ const c = _sp23(spec, lane, x, dir, opt); if (c && AIV[spec]) softSusp(c, AIV[spec].len); return c; };
/* ---------------- fuel: twice the previous consumption ---------------- */
function fuelFactor(){ const V = G.V, r = G.route; if (!V || !r) return 1; const perTrip = V.lp100 / 100 * r.km; return clamp((V.tank / 1.25) / Math.max(.1, perTrip), 1, 64); }
/* ---------------- painted particle effects ---------------- */
const FX = [], SCORCH = [];
function spawnFX(kind, x, y, size, o){ o = o || {}; if (FX.length > 40) FX.shift(); FX.push({kind, x, y, size, t:0, dur:o.dur || .9, vx:o.vx || 0, vy:o.vy || 0, flip:Math.random() < .5, alpha:o.alpha ?? 1, ground:!!o.ground, add:kind === 'spark'}); }
function updFX(dt){ for (let i = FX.length - 1; i >= 0; i--){ const f = FX[i]; f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; if (f.t >= f.dur) FX.splice(i, 1); } }
function drawFX(){ for (const f of FX){ const k = Math.min(5, Math.floor(f.t / f.dur * 6)), im = IMG['fx_' + f.kind + k]; if (!im || !im.width) continue; const w = f.size * PPM, h = w * im.height / im.width, X = sx(f.x), Y = sy(f.y);
  if (X < -w || X > VW + w) continue; const fade = f.t / f.dur > .75 ? 1 - (f.t / f.dur - .75) / .25 : 1; ctx.save(); ctx.globalAlpha = f.alpha * fade; if (f.add) ctx.globalCompositeOperation = 'lighter'; ctx.translate(X, Y); if (f.flip) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, f.ground ? -h : -h / 2, w, h); ctx.restore(); } }
function drawScorch(){ const [x0, x1] = viewX(), im = IMG.deb_scorch; if (!im) return; for (const s of SCORCH){ if (s.x < x0 - 5 || s.x > x1 + 5) continue; const w = s.w * PPM, h = w * im.height / im.width * .35; ctx.save(); ctx.globalAlpha = .55; ctx.translate(sx(s.x), sy(terrH(s.x) + s.y)); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); } }
function throwPart(key, x, y, vx, vy, sizeM){ const im = IMG[key]; if (!im || !im.width || DEBRIS.length > 40) return; DEBRIS.push({c:im, x, y, vx, vy, a:0, w:(Math.random() - .5) * 10, s:sizeM / im.width, life:28}); }
/* crashes: sparks at the contact point, dust where it touches the road, flying parts that match what was hit */
const _ad23 = addDent;
addDent = function(car, lx, ly, sev, glass){ _ad23(car, lx, ly, sev, glass); if (G.mode !== 'play' || !car || sev < 5) return;
 const ca = Math.cos(car.a), sa = Math.sin(car.a), wx = car.x + lx * ca - ly * sa, wy = car.y + lx * sa + ly * ca, front = lx > car.L * .35, rear = lx < -car.L * .35, dir = Math.sign(lx) || 1, s = clamp(sev / 12, .4, 1.6);
 spawnFX('spark', wx, wy, 1.1 * s, {dur:.55});
 if (wy - terrH(wx) < 1.2) spawnFX('dust', wx, terrH(wx) + .05, 1.6 * s, {ground:true, dur:1.1, alpha:.8});
 if (glass) throwPart('deb_glass', wx, wy, car.vx * .5 + dir * 1.5, 2.5, .45);
 else if ((front || rear) && sev > 10){ throwPart(Math.random() < .55 ? 'deb_bumper' : 'deb_plate', wx, wy - .2, car.vx * .5 + dir * 2.5, 3, Math.random() < .55 ? 1.3 : .5); if (Math.random() < .5) SCORCH.push({x:wx, y:-.1 + Math.random() * .6, w:2.6}); }
 else if (sev > 9) throwPart(ly > (car.yt - car.yb) * .2 ? 'deb_mirror' : 'deb_panel', wx, wy, car.vx * .5 + dir * 2, 3.2, ly > 0 ? .4 : .7);
 if (sev > 11 && car === G.car) spawnFX('smoke', wx - dir * .3, wy + .4, 2.2 * s, {dur:1.6, vy:.4, alpha:.85}); };
/* punctures: far rarer, and when it happens — a burst of dust and rubber smoke at the tyre */
function onPuncture(w){ spawnFX('dust', w.x, terrH(w.x) + .02, 1.4, {ground:true, dur:1, alpha:.9}); spawnFX('smoke', w.x - .2, terrH(w.x) + w.r, 1.1, {dur:1.3, vy:.5, alpha:.55}); throwPart('deb_scorch', w.x, terrH(w.x) + .1, -1.5, 1.2, .4); }
/* engine distress & puddles */
let fxT = 0; const splashed = new Set();
const _upd23 = update;
update = function(dt){ const flats0 = G.car ? G.car.wh.map(w => !!w.flat) : []; _upd23(dt); if (G.mode !== 'play') return; const car = G.car; updFX(dt);
 car.wh.forEach((w, i) => { if (w.flat && !flats0[i]) onPuncture(w); });
 fxT -= dt; if (fxT <= 0){ fxT = .45; const [ex, ey] = engineBay(); if (G.fire > 0) spawnFX('smoke', ex, ey + 1, 2.4, {dur:1.8, vy:.8, alpha:.9}); else if (!G.test && GV(G.vid).cond.engine < 22) spawnFX('smoke', ex, ey + .6, 1.4, {dur:1.6, vy:.5, alpha:.5}); else if (G.temp > 106) spawnFX('steam', ex, ey + .7, 1.6, {dur:1.5, vy:.5, alpha:.7}); }
 if (G.weather === 'rain' && speedOf(car) > 3) for (const w of car.wh){ const cell = Math.floor(w.x / 17), px = cell * 17 + hash(cell) * 8, key = cell + ':' + Math.round(w.x0 || 0); if (Math.abs(w.x - px) < 1.4 && !splashed.has(cell + '|' + car.wh.indexOf(w))){ splashed.add(cell + '|' + car.wh.indexOf(w)); spawnFX('splash', w.x, terrH(w.x) + .02, 1.2 + speedOf(car) * .05, {ground:true, dur:.8, alpha:.85}); } }
 if (splashed.size > 400) splashed.clear(); };
const _dp23 = drawParts;
drawParts = function(){ _dp23(); try{ drawFX(); }catch(e){ reportErr('fx23', e); } };
const _dw23 = drawWorld;
drawWorld = function(){ _dw23(); drawScorch(); };
const _sr23b = startRoute;
startRoute = function(r, o){ _sr23b(r, o); FX.length = 0; SCORCH.length = 0; splashed.clear(); };

/* ======================= fleet-ui.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v24 — every vehicle easy to find: showroom grid per category
   (with NEW badges), purchasable vehicles shown in the route picker,
   correct fuel % with upgraded tanks
   ===================================================================== */
const NEWV = new Set(['hiace2','hiaceB','kinglong','rosa','redbus2','coachN', ...NV.map(n => n[0])]);
const tankOf = id => VBY(id).tank * (1 + .2 * ((GV(id).up || {}).tank || 0));
const _rr24 = renderRoutes;
renderRoutes = function(){ _rr24(); const vp = $('#s-routes .vpick'), r = ROUTES.find(q => q.id === RSEL); if (!r) return;
 $$('#s-routes [data-v]').forEach(b => { const id = b.dataset.v, s = b.querySelector('.muted'); if (s) s.textContent = '⛽' + Math.min(100, Math.round(GV(id).fuel / tankOf(id) * 100)) + '%'; });
 const L = lvlOf(S.xp).l, buy = VEHS.filter(v => CLS_OK[r.type].includes(v.id) && !GV(v.id).owned);
 if (!buy.length) return; const html = `<div class="buyrow"><div class="muted" style="margin:.5rem 0 .3rem">🛒 ${L2('مركبات تقدر تشتريها للخط ده', 'Vehicles you can buy for this line')} (${fmt(buy.length)})</div><div class="vpick">${buy.map(v => `<button class="vchip buyv" data-buyv="${v.id}"><img src="${ASSETS[v.spr]}">${nm(v.name)}${NEWV.has(v.id) ? ' <em class="newb">NEW</em>' : ''} <span class="${L < v.lvl ? 'muted' : 'gold'}">${L < v.lvl ? '🔒 ' + t('lvl') + ' ' + fmt(v.lvl) : money(v.price)}</span></button>`).join('')}</div></div>`;
 const card = $('#s-routes .facts') && $('#s-routes .facts').closest('.card'), mb = card && card.querySelector('.mbtns'); if (mb) mb.insertAdjacentHTML('beforebegin', html); else if (card) card.insertAdjacentHTML('beforeend', html); else if (vp) vp.insertAdjacentHTML('afterend', html);
 $$('[data-buyv]').forEach(b => b.onclick = () => { SR = VEHS.findIndex(v => v.id === b.dataset.buyv); show('showroom'); }); };
const _rs24 = renderShowroom;
renderShowroom = function(){ _rs24(); const V = VEHS[SR], list = VEHS.map((v, i) => [v, i]).filter(([v]) => v.cls === V.cls), L = lvlOf(S.xp).l;
 const html = `<div class="srgrid">${list.map(([v, i]) => { const g = GV(v.id); return `<button class="srcard ${i === SR ? 'on' : ''}" data-sr="${i}">${NEWV.has(v.id) ? '<em class="newb">NEW</em>' : ''}<img src="${ASSETS[v.spr]}"><b>${nm(v.name)}</b><span>${g.owned ? '✓ ' + t('owned') : L < v.lvl ? '🔒 ' + t('lvl') + ' ' + fmt(v.lvl) : money(v.price)}</span><small>${fmt(v.seats + (v.stand || 0))} ${L2('راكب', 'pax')} · ${fmt(v.len, 1)} m</small></button>`; }).join('')}</div>`;
 const tabs = $('#s-showroom .tabs'); if (tabs) tabs.insertAdjacentHTML('afterend', html);
 $$('[data-sr]').forEach(b => b.onclick = () => { SR = +b.dataset.sr; AU.click(); renderShowroom(); }); };
{ const st = document.createElement('style'); st.textContent = `
.srgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5rem,1fr));gap:.5rem;margin:.6rem 0 .9rem;max-height:17rem;overflow:auto;padding:.2rem}
.srcard{position:relative;display:flex;flex-direction:column;align-items:center;gap:.2rem;padding:.55rem .4rem;border-radius:.8rem;background:rgba(6,14,32,.65);border:1px solid var(--line);font-size:.78rem;text-align:center}
.srcard img{height:2.6rem;max-width:95%;object-fit:contain}.srcard b{font-size:.8rem}.srcard span{color:var(--gold2);font-weight:700}.srcard small{color:var(--mut)}
.srcard.on{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset,0 .4rem 1rem rgba(0,0,0,.4);background:rgba(245,178,27,.12)}.srcard:hover{border-color:var(--gold)}
.newb{position:absolute;top:.3rem;inset-inline-start:.3rem;font-style:normal;font-size:.62rem;font-weight:800;padding:.05rem .35rem;border-radius:.4rem;background:#ff4d5e;color:#fff}
.vchip .newb{position:static;margin-inline-start:.3rem}.vchip.buyv{opacity:.92;border-style:dashed}`; document.head.appendChild(st); }

/* ======================= fleet-physics-career.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v25 — real-model fleet with true separate wheels, realistic
   long-travel bus suspension that responds to upgrades & wear, fewer
   tyre events, wheel shadows, reorganised career ladder
   ===================================================================== */
/* AI copies of the fleet also roll on separate wheels */
const _sp25 = spawnAI;
spawnAI = function(spec, lane, x, dir, opt){ const c = _sp25(spec, lane, x, dir, opt); if (c && AIV[spec] && AIV[spec].whRim != null) c.whRim = AIV[spec].whRim; return c; };
/* driver zones for passenger windows */
Object.assign(DRV, {suzuki:.56, fotonC2:.6, joyA4:.66, joyA5:.68, hiaceW:.7, kingWB:.7, gdx6532:.78, coasterW:.79, joyA6:.8, xmq6600:.82, higer6720:.82, zk6770:.82, xmq6127:.88, gdx6125:.88, zk6128:.88, tourismo:.88});
/* ---------------- suspension: buses float and pitch slowly, vans stay firm ----------------
   real buses: ~0.8–1.0 Hz body frequency, light damping (ζ≈0.18–0.25), 25+ cm travel (air bags);
   suspension upgrades add damping/stiffness, a worn suspension gets floatier */
function softSusp(c, len){ if (!c || len < 5.8) return; const isP = c === G.car, up = isP && !G.test ? upl(G.vid, 'susp') : 0, wear = isP && !G.test ? GV(G.vid).cond.susp / 100 : 1, n = c.wh.length, m = c.base;
 const f0 = len > 11 ? .82 : len > 9 ? .9 : len > 6.5 ? 1.0 : 1.15, z0 = len > 9 ? .18 : len > 6.5 ? .21 : .25;
 c.f = f0 * (1 + .035 * up); c.zeta = (z0 + .035 * up) * (.7 + .3 * wear); c.travel = (len > 9 ? .27 : .23) + .012 * up;
 c.k = (m / n) * Math.pow(2 * Math.PI * c.f, 2); c.cd = 2 * c.zeta * Math.sqrt(c.k * m / n); c.kb = c.k * 10; }
/* upgrades with real consequences on heavy vehicles: armour adds mass, engine tuning drinks a little more */
const _sr25 = startRoute;
startRoute = function(route, opt){ _sr25(route, opt);
 if (W.holes && W.holes.length > 2) W.holes = W.holes.filter((_, i) => i % 2 === 0);   // smoother roads: half the potholes
 const car = G.car; if (!car || G.test || !G.V) return; const a = upl(G.vid, 'armor'), e = upl(G.vid, 'engine'); car.base *= 1 + .015 * a; car.m = car.base; G.engThirst = 1 + .03 * e; };
const _ff25 = fuelFactor;
fuelFactor = function(){ return _ff25() * (G.engThirst || 1); };
/* ---------------- wheels cast the same directional shadows as the body ---------------- */
const _ds25 = dirShadow;
dirShadow = function(car, src, X, gy, sw, shh, mk, k){ const calls = [], orig = projShadow; projShadow = function(s, x, b, w, h, m, kk, dx, ly, al, blur){ calls.push([dx, ly, al, blur]); return orig.apply(this, arguments); };
 try{ _ds25(car, src, X, gy, sw, shh, mk, k); } finally { projShadow = orig; }
 const wr = car.whRim != null ? car.whRim : (car.player && G.V && !G.V.baked ? car.rim : null); if (wr == null) return; const im = IMG['wh' + wr]; if (!im || !im.width) return; const q = WQ(wr), lift = car.lift || 0;
 for (const [dx, ly, al, blur] of calls) for (const w of car.wh){ const d = w.r * 2 * q * PPM, s = d / im.width, Xw = sx(w.x), Gy = sy(terrH(w.x) + lift) + 1; orig(im, Xw, Gy, im.width, im.height * .52, s, s, dx, ly, al * .9, blur); } };
/* ---------------- saves that pointed at retired models ---------------- */
const _el25 = ensureLicences;
ensureLicences = function(){ _el25(); if (!VEHS.find(v => v.id === S.sel)) S.sel = 'hiace'; const c = S.career; if (c && c.done) for (const id in c.done) if (!CAREER_N.find(n => n.id === id)) delete c.done[id]; };
/* ---------------- career ladder rebuilt around the whole fleet ---------------- */
CAREER_N.length = 0; CAREER_N.push(
 {id:'c0', x:800, y:500, big:true, v:'hiaceB', t:['سواق تحت التدريب','Trainee Driver'], d:['أول يوم في شركة أجرة للنقل — هايس كلاسيك تحت عين المشرف.','Day one at Ograaa Transport — a classic HiAce under a supervisor\'s eye.'], req:[['lic','micro']], pre:[], rw:{sal:180, com:.08, veh:['hiaceB','suzuki']}},
 {id:'n1', x:1020, y:500, v:'hiace', t:['سواق خط ميكروباص','Microbus Line Driver'], d:['خطك الثابت ورقمك في الموقف.','Your own line and a number at the terminal.'], req:[['shifts',3],['stars2',2]], pre:['c0'], rw:{sal:260, com:.12, veh:['hiace','fotonC2','joyA4']}},
 {id:'n2', x:600, y:380, v:'fiat128', t:['رخصة تاكسي سرفيس','Service Taxi Endorsement'], d:['الفيات ١٢٨ للمشاوير القصيرة.','The Fiat 128 for short service runs.'], req:[['clean',2]], pre:['c0'], rw:{sal:200, com:.1, veh:['fiat128']}},
 {id:'n13', x:420, y:260, v:'minivan', t:['سرفيس الميني فان','Minivan Express'], d:['٧ ركاب وسرعة وتوفير.','Seven seats, speed and economy.'], req:[['perfect',10]], pre:['n2'], rw:{sal:240, com:.12, veh:['minivan']}},
 {id:'n3', x:960, y:320, v:'hiace', night:true, t:['شهادة الوردية الليلي','Night Shift Endorsement'], d:['ورديات بالليل بحافز ٢٥٪.','Night shifts with a 25% allowance.'], req:[['night',2]], pre:['n1'], rw:{perk:'night'}},
 {id:'n4', x:960, y:690, v:'hiaceW', t:['نجمة الأمان','Safety Star'], d:['٥ ورديات من غير ولا مخالفة.','Five shifts without a single fine.'], req:[['clean',5]], pre:['n1'], rw:{bonus:40}},
 {id:'v1', x:1200, y:640, v:'hiace2', t:['كابتن فانات أول','Senior Van Captain'], d:['الهايس الجديد والفانات العريضة.','The new-gen HiAce and the wide-body vans.'], req:[['shifts',8],['level',3]], pre:['n1'], rw:{sal:320, com:.12, veh:['hiace2','joyA5','hiaceW','kingWB']}},
 {id:'n5', x:1240, y:400, v:'coaster', t:['كابتن ميني باص','Minibus Captain'], d:['الكوستر والميني باصات.','The Coaster and the minibus fleet.'], req:[['level',3],['exam','m4']], pre:['n1'], rw:{sal:380, com:.12, veh:['coaster','kinglong','gdx6532','coasterW','joyA6']}},
 {id:'v2', x:1430, y:250, v:'rosa', t:['كابتن ميني باص أول','Senior Minibus Captain'], d:['روزا وكينج لونج وهايجر ويوتونج.','Rosa, King Long, Higer and Yutong minibuses.'], req:[['shifts',15],['rating',4.3]], pre:['n5'], rw:{sal:470, com:.12, veh:['rosa','xmq6600','higer6720','zk6770']}},
 {id:'n6', x:1440, y:540, v:'redbus', t:['سواق أتوبيس المدينة','City Bus Driver'], d:['درجة تانية وأول أتوبيس.','Grade 2 and your first bus.'], req:[['lic','bus'],['exam','b1']], pre:['n5'], rw:{sal:600, com:.1, veh:['redbus']}},
 {id:'n7', x:1400, y:780, v:'mcv', t:['سواق نقل عام أول','Senior Public Transport'], d:['الأتوبيس الأزرق والأتوبيس الجديد.','The blue bus and the new city bus.'], req:[['bus',8]], pre:['n6'], rw:{sal:780, com:.1, veh:['mcv','redbus2']}},
 {id:'n10', x:1120, y:880, v:'redbus2', t:['مشرف خط','Line Supervisor'], d:['بتشرف على ٦ سواقين — مكافأة يومية.','You supervise six drivers — daily bonus.'], req:[['shifts',30]], pre:['n7'], rw:{bonus:300, perk:'daily'}},
 {id:'n8', x:1620, y:560, v:'coachB', t:['كابتن أتوبيس سفر','Intercity Coach Captain'], d:['درجة أولى وطرق السفر.','Grade 1 and the highways.'], req:[['lic','coach'],['exam','c1']], pre:['n7'], rw:{sal:1150, com:.08, veh:['coachB','xmq6127','gdx6125']}},
 {id:'n9', x:1660, y:330, v:'coachO', t:['كابتن السفر الفاخر','Luxury Coach Captain'], d:['رحلات الغردقة وشرم.','Hurghada and Sharm runs.'], req:[['rating',4.6],['exam','c3']], pre:['n8'], rw:{sal:1600, com:.08, veh:['coachO','zk6128','coachN']}},
 {id:'v3', x:1600, y:110, v:'tourismo', t:['كابتن مرسيدس التنفيذي','Executive Tourismo Captain'], d:['أفخم أتوبيس في الأسطول.','The flagship of the fleet.'], req:[['rating',4.7],['perfect',60]], pre:['n9'], rw:{sal:2000, com:.08, veh:['tourismo']}},
 {id:'n11', x:1180, y:150, v:'coachN', t:['مدير الأسطول','Fleet Manager'], d:['بتدير أسطول الشركة كله.','You run the whole company fleet.'], req:[['earned',150000]], pre:['n9','n10'], rw:{sal:2600, perk:'daily'}},
 {id:'n12', x:820, y:120, v:'tourismo', t:['شريك في الشركة','Company Partner'], d:['نسبة ١٥٪ من كل مكسب بتعمله.','15% share on everything you earn.'], req:[['perfect',100]], pre:['n11'], rw:{perk:'partner'}});

/* ======================= customise-ride.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v26 — premium customisation & ride
   true-size wheels in dark wheel wells · smooth long-travel suspension ·
   physical mud flaps · premium roof gear & lit LED bar · logical decals ·
   text stickers · rim colours · paint finishes & two-tone · real
   underglow light · new intercity routes & skylines · softer sirens
   ===================================================================== */
/* ---------------- rim colours ---------------- */
COS.rimc = [{id:'chrome', p:0, n:['كروم أصلي','Factory chrome'], c:null}, {id:'black', p:350, n:['أسود مطفي','Matte black'], c:[28,28,30]}, {id:'gun', p:350, n:['رمادي جن ميتال','Gunmetal'], c:[78,82,88]}, {id:'gold', p:600, n:['دهبي','Gold'], c:[208,166,72]}, {id:'bronze', p:500, n:['برونز','Bronze'], c:[150,104,62]}, {id:'red', p:450, n:['أحمر','Red'], c:[176,28,34]}, {id:'white', p:400, n:['أبيض','White'], c:[236,238,240]}, {id:'blue', p:450, n:['أزرق','Blue'], c:[34,86,170]}];
const RIMC = new Map();
function rimImg(wr, rc){ const im = IMG['wh' + wr]; const col = (COS.rimc.find(q => q.id === rc) || {}).c; if (!col || !im || !im.width) return im; const key = wr + '|' + rc; let c = RIMC.get(key); if (c) return c;
 c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height), p = d.data, cx = c.width / 2, cy = c.height / 2, R = (META['wh' + wr] && META['wh' + wr].tyre) || c.width / 2;
 for (let i = 0; i < p.length; i += 4){ const k = i / 4, px = k % c.width, py = k / c.width | 0; if (Math.hypot(px - cx, py - cy) > R * .74) continue; const L = p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11; if (L < 55) continue; const f = Math.min(1.25, L / 165); for (let j = 0; j < 3; j++) p[i + j] = clamp(col[j] * f + (L > 215 ? (L - 215) * 1.2 : 0), 0, 255); }
 x.putImageData(d, 0, 0); RIMC.set(key, c); return c; }
/* ---------------- paint finishes & two-tone roof ---------------- */
COS.finish = [{id:'gloss', p:0, n:['لامع','Gloss']}, {id:'metal', p:900, n:['ميتاليك','Metallic flake']}, {id:'pearl', p:1300, n:['لؤلؤي','Pearl']}, {id:'matte', p:1100, n:['مطفي','Matte']}, {id:'satin', p:800, n:['ساتان','Satin']}];
COS.roofc = [{id:'none', p:0, n:['لون واحد','Single tone'], c:null}, {id:'white', p:500, n:['سقف أبيض','White roof'], c:[240,242,244]}, {id:'black', p:600, n:['سقف أسود','Black roof'], c:[24,25,28]}, {id:'silver', p:550, n:['سقف فضي','Silver roof'], c:[176,182,190]}, {id:'gold', p:800, n:['سقف دهبي','Gold roof'], c:[206,164,70]}, {id:'navy', p:600, n:['سقف كحلي','Navy roof'], c:[24,40,86]}, {id:'red', p:600, n:['سقف أحمر','Red roof'], c:[160,26,34]}];
/* ---------------- more decals + text stickers ---------------- */
COS.decal.push({id:'stripes', p:600, n:['خطين سباق','Twin racing stripes']}, {id:'pharaoh', p:900, n:['حزام فرعوني','Pharaonic band']}, {id:'palms', p:650, n:['نخيل','Palm silhouettes']}, {id:'waves', p:600, n:['موج البحر','Sea waves']}, {id:'checker', p:550, n:['شطرنج','Checkered band']}, {id:'misr', p:700, n:['مصر — خط عربي','"Misr" calligraphy']});
COS.tsticker = [{id:'none', p:0, n:['من غير','None']}, {id:'t1', p:150, n:['عين الحسود فيها عود','Envy\'s eye gets a stick']}, {id:'t2', p:150, n:['الصبر جميل','Patience is beautiful']}, {id:'t3', p:150, n:['متشلش هم','Don\'t worry']}, {id:'t4', p:150, n:['بحبك يا مصر','I love you Egypt']}, {id:'t5', p:150, n:['السواق الحريف','The ace driver']}, {id:'t6', p:150, n:['ارجع ورا يا عسل','Back off, honey']}, {id:'t7', p:150, n:['OGRAAA ★','OGRAAA ★']}, {id:'custom', p:300, n:['✍ نص من عندك','✍ Your own text']}];
COS.tcol = [{id:'white', p:0, n:['أبيض','White'], c:'#ffffff'}, {id:'gold', p:120, n:['دهبي','Gold'], c:'#f5c542'}, {id:'red', p:120, n:['أحمر','Red'], c:'#e3262e'}, {id:'black', p:120, n:['أسود','Black'], c:'#141414'}, {id:'neon', p:200, n:['نيون أخضر','Neon green'], c:'#39ff7a'}, {id:'pink', p:150, n:['بمبي','Pink'], c:'#ff5fa8'}, {id:'cyan', p:150, n:['سماوي','Cyan'], c:'#38d9ff'}, {id:'rainbow', p:350, n:['قوس قزح','Rainbow'], c:'rainbow'}];
COS.tfont = [{id:'bold', p:0, n:['عريض','Bold'], f:'900 {s}px Lalezar, "Readex Pro", sans-serif'}, {id:'clean', p:100, n:['حديث','Modern'], f:'700 {s}px "Readex Pro", sans-serif'}, {id:'serif', p:150, n:['كلاسيك','Classic'], f:'700 {s}px Georgia, "Times New Roman", serif'}, {id:'italic', p:150, n:['مايل','Italic'], f:'italic 800 {s}px "Readex Pro", sans-serif'}];
Object.assign(COS_ICON, {rimc:'tyre', finish:'paint', roofc:'paint', tsticker:'paint', tcol:'paint', tfont:'paint'});
Object.assign(TX, {rimc:['لون الجنط','Rim colour'], finish:['نوع الدهان','Paint finish'], roofc:['سقف بلونين','Two-tone roof'], tsticker:['ستيكر كلام','Text sticker'], tcol:['لون الستيكر','Sticker colour'], tfont:['خط الستيكر','Sticker font']});
/* body geometry from the artwork: sill line, roof line, wheel arches → logical placement */
const GEO = {};
function bodyGeo(V){ if (GEO[V.id]) return GEO[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, tops = [], bots = [];
 // glass band = the longest run of window pixels in each column (ignores thin dark outlines on the roof)
 for (let x = Math.round(w * .1); x < w * .8; x += 3){ let best = null, rs = -1, re = -1, gap = 0; for (let y = 0; y <= h * .64; y++){ const on = y < h * .64 && M.win[y * w + x]; if (on){ if (rs < 0) rs = y; re = y; gap = 0; } else if (rs >= 0 && ++gap > 3){ if (!best || re - rs > best[1] - best[0]) best = [rs, re]; rs = -1; gap = 0; } } if (rs >= 0 && (!best || re - rs > best[1] - best[0])) best = [rs, re]; if (best && best[1] - best[0] > h * .06){ tops.push(best[0]); bots.push(best[1]); } }
 tops.sort((a, b) => a - b); bots.sort((a, b) => a - b); const winTop = tops.length ? tops[tops.length >> 1] : h * .15, winBot = bots.length ? bots[bots.length >> 1] : h * .45;
 const wh = (META[V.spr].wheels || []).map(([cx, cy, r]) => [cx, cy, r]), archTop = wh.length ? Math.min(...wh.map(q => q[1] - q[2] * 1.15)) : h * .7;
 return GEO[V.id] = {w, h, winTop, winBot, archTop: Math.max(winBot + h * .12, archTop), wheels:wh, ppm:w / V.len}; }
function bodyMaskCanvas(V){ const M = paintMask(V.spr); if (M.mk) return M.mk; const c = document.createElement('canvas'); c.width = M.w; c.height = M.h; const x = c.getContext('2d'), d = x.createImageData(M.w, M.h); for (let p = 0; p < M.w * M.h; p++) d.data[p * 4 + 3] = M.m[p] > .35 && !M.win[p] ? 255 : 0; x.putImageData(d, 0, 0); return M.mk = c; }
const _bpc26 = buildPlayerCanvas;
buildPlayerCanvas = function(vid, cos, cond, dents){ const V = VBY(vid), legacy = ['flames','stars','eye','flag','logo'], cos2 = Object.assign({}, cos, {decal:'none'}); const c = _bpc26(vid, cos2, cond, dents); try{ decorate(c, V, cos); }catch(e){ reportErr('decor', e); } return c; };
function decorate(c, V, cos){ const G2 = bodyGeo(V), M = paintMask(V.spr), w = c.width, h = c.height, x = c.getContext('2d'), mask = bodyMaskCanvas(V);
 const band0 = G2.winBot + h * .03, band1 = G2.archTop - h * .02, bandH = Math.max(h * .06, band1 - band0), front = w * .97, rear = w * .03;
 const layer = document.createElement('canvas'); layer.width = w; layer.height = h; const L = layer.getContext('2d');
 // finish
 if (cos.finish && cos.finish !== 'gloss'){ const f = cos.finish; if (f === 'matte' || f === 'satin'){ L.fillStyle = f === 'matte' ? 'rgba(90,90,90,.22)' : 'rgba(120,120,120,.12)'; L.globalCompositeOperation = 'source-over'; L.fillRect(0, 0, w, h); }
  if (f === 'metal'){ const r = mulberry(7); for (let i = 0; i < w * h / 26; i++){ L.fillStyle = `rgba(255,255,255,${.08 + r() * .22})`; L.fillRect(r() * w, r() * h, 1, 1); } const g = L.createLinearGradient(0, 0, 0, h); g.addColorStop(.15, 'rgba(255,255,255,.18)'); g.addColorStop(.35, 'rgba(255,255,255,0)'); g.addColorStop(.75, 'rgba(0,0,0,.08)'); L.fillStyle = g; L.fillRect(0, 0, w, h); }
  if (f === 'pearl'){ const g = L.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,190,240,.16)'); g.addColorStop(.5, 'rgba(190,240,255,.14)'); g.addColorStop(1, 'rgba(255,245,200,.14)'); L.fillStyle = g; L.fillRect(0, 0, w, h); const g2 = L.createLinearGradient(0, 0, 0, h); g2.addColorStop(.12, 'rgba(255,255,255,.22)'); g2.addColorStop(.32, 'rgba(255,255,255,0)'); L.fillStyle = g2; L.fillRect(0, 0, w, h); } }
 // two-tone roof (everything of the body above the window line)
 const rc = (COS.roofc.find(q => q.id === cos.roofc) || {}).c; if (rc){ L.save(); L.fillStyle = `rgb(${rc})`; L.fillRect(0, 0, w, Math.max(2, G2.winTop - h * .01)); L.restore(); L.save(); L.globalCompositeOperation = 'source-atop'; const g = L.createLinearGradient(0, 0, 0, G2.winTop); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(0,0,0,.15)'); L.fillStyle = g; L.fillRect(0, 0, w, G2.winTop); L.restore(); }
 // decals — all inside the panel band between the window sill and the wheel arches
 const d = cos.decal; L.save(); const BY = band0, BH = bandH;
 if (d === 'stripes'){ for (const [o, t, col] of [[.3, .12, '#c8102e'], [.5, .06, '#111'], [.62, .12, '#c8102e']]){ L.fillStyle = col; L.beginPath(); L.moveTo(rear, BY + BH * o); L.lineTo(front - w * .05, BY + BH * o - BH * .25); L.lineTo(front, BY + BH * o - BH * .25); L.lineTo(front, BY + BH * (o + t) - BH * .25); L.lineTo(rear, BY + BH * (o + t)); L.fill(); } }
 if (d === 'pharaoh'){ const y = BY + BH * .35, hh = BH * .3; L.fillStyle = '#1c3f94'; L.fillRect(rear, y, front - rear, hh); L.fillStyle = '#d6a740'; L.fillRect(rear, y, front - rear, hh * .12); L.fillRect(rear, y + hh * .88, front - rear, hh * .12); for (let px = rear + hh * .3; px < front; px += hh * 1.1){ L.beginPath(); L.moveTo(px, y + hh * .8); L.lineTo(px + hh * .4, y + hh * .2); L.lineTo(px + hh * .8, y + hh * .8); L.fill(); L.beginPath(); L.arc(px + hh * .4, y + hh * .62, hh * .1, 0, 7); L.fillStyle = '#1c3f94'; L.fill(); L.fillStyle = '#d6a740'; } }
 if (d === 'palms'){ L.fillStyle = 'rgba(20,90,60,.85)'; for (let i = 0; i < 3; i++){ const px = rear + w * (.06 + i * .07), base = BY + BH * .95, ht = BH * (.8 - i * .12); L.fillRect(px - 1.5, base - ht, 3, ht); for (let k = 0; k < 6; k++){ const a = -Math.PI / 2 + (k - 2.5) * .45; L.beginPath(); L.ellipse(px + Math.cos(a) * ht * .25, base - ht + Math.sin(a) * ht * .12, ht * .28, ht * .06, a, 0, 7); L.fill(); } } }
 if (d === 'waves'){ for (const [o, col] of [[.45, '#1e88e5'], [.6, '#4fc3f7'], [.75, '#e1f5fe']]){ L.strokeStyle = col; L.lineWidth = BH * .09; L.beginPath(); for (let px = rear; px <= front; px += 4){ const y = BY + BH * o + Math.sin(px / (BH * .5)) * BH * .07; px === rear ? L.moveTo(px, y) : L.lineTo(px, y); } L.stroke(); } }
 if (d === 'checker'){ const s = BH * .12, y = BY + BH * .5; for (let px = rear, i = 0; px < front; px += s, i++) for (let r = 0; r < 2; r++){ L.fillStyle = (i + r) % 2 ? '#111' : '#f4f4f4'; L.fillRect(px, y + r * s, s, s); } }
 if (d === 'misr'){ L.font = `900 ${BH * .8}px Lalezar, serif`; L.textAlign = 'center'; L.textBaseline = 'middle'; L.fillStyle = 'rgba(200,16,46,.85)'; L.strokeStyle = 'rgba(0,0,0,.35)'; L.lineWidth = 2; L.strokeText('مِصْر', w * .42, BY + BH * .55); L.fillText('مِصْر', w * .42, BY + BH * .55); }
 if (d === 'flames'){ for (let i = 0; i < 6; i++){ const y = BY + BH * (.3 + i * .1), g = L.createLinearGradient(front, 0, w * .45, 0); g.addColorStop(0, '#ffdd33'); g.addColorStop(.5, '#ff6a00'); g.addColorStop(1, 'rgba(200,20,0,0)'); L.fillStyle = g; L.beginPath(); L.moveTo(front, y - BH * .04); for (let q = 0; q <= 8; q++){ const px = front - q * w * .065; L.quadraticCurveTo(px + w * .02, y + (q % 2 ? -1 : 1) * BH * .12, px - w * .03, y); } L.lineTo(front, y + BH * .04); L.fill(); } }
 if (d === 'stars'){ L.fillStyle = '#f5c518'; const r = mulberry(5); for (let i = 0; i < 12; i++){ const cx = rear + (front - rear) * (.05 + r() * .9), cy = BY + BH * (.15 + r() * .7), s = BH * (.06 + r() * .06); L.beginPath(); for (let k = 0; k < 10; k++){ const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? s * .45 : s; L.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } L.fill(); } }
 if (d === 'eye'){ const cx = w * .42, cy = BY + BH * .5, s = BH * .28; L.strokeStyle = '#1a3b8f'; L.lineWidth = s * .16; L.beginPath(); L.ellipse(cx, cy, s * 1.6, s * .7, 0, 0, 7); L.stroke(); L.fillStyle = '#1a3b8f'; L.beginPath(); L.arc(cx, cy, s * .45, 0, 7); L.fill(); L.beginPath(); L.moveTo(cx - s * .3, cy + s * .65); L.quadraticCurveTo(cx - s * .1, cy + s * 1.4, cx + s * .4, cy + s * 1.2); L.stroke(); }
 if (d === 'flag'){ [['#ce1126'], ['#ffffff'], ['#111111']].forEach(([col], i) => { L.fillStyle = col; L.beginPath(); L.moveTo(rear + w * .05, BY + BH * (.25 + i * .17)); L.lineTo(front - w * .1, BY + BH * (.18 + i * .17)); L.lineTo(front - w * .1, BY + BH * (.35 + i * .17)); L.lineTo(rear + w * .05, BY + BH * (.42 + i * .17)); L.fill(); }); }
 if (d === 'logo'){ L.font = `900 ${BH * .42}px Lalezar, sans-serif`; L.fillStyle = '#f5b21b'; L.strokeStyle = '#1a1a1a'; L.lineWidth = BH * .04; L.textAlign = 'center'; L.textBaseline = 'middle'; L.strokeText('OGRAAA', w * .45, BY + BH * .5); L.fillText('OGRAAA', w * .45, BY + BH * .5); }
 L.restore();
 // text sticker on the rear quarter, sized to the panel
 const ts = cos.tsticker; if (ts && ts !== 'none'){ const txt = ts === 'custom' ? (cos.stxt || 'OGRAAA') : nm((COS.tsticker.find(q => q.id === ts) || {n:['','']}).n), col = (COS.tcol.find(q => q.id === cos.tcol) || COS.tcol[0]).c, ff = (COS.tfont.find(q => q.id === cos.tfont) || COS.tfont[0]).f;
  const zx0 = rear + w * .02, zx1 = (G2.wheels[1] ? G2.wheels[1][0] - G2.wheels[1][2] * 1.2 : w * .6), zw = Math.max(w * .2, Math.min(zx1 - zx0, w * .45)); let s = BH * .34; L.save(); L.textAlign = 'center'; L.textBaseline = 'middle'; L.font = ff.replace('{s}', s); while (L.measureText(txt).width > zw && s > 6){ s -= 1; L.font = ff.replace('{s}', s); } const tx = zx0 + zw / 2, ty = BY + BH * .78;
  L.lineWidth = Math.max(1.5, s * .14); L.strokeStyle = col === '#141414' ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.65)'; L.strokeText(txt, tx, ty);
  if (col === 'rainbow'){ const g = L.createLinearGradient(tx - zw / 2, 0, tx + zw / 2, 0); ['#ff3b3b','#ffb300','#ffe600','#39ff7a','#38d9ff','#7a5cff','#ff5fa8'].forEach((cc, i, a) => g.addColorStop(i / (a.length - 1), cc)); L.fillStyle = g; } else L.fillStyle = col; L.fillText(txt, tx, ty); L.restore(); }
 // clip everything to painted body panels (not glass, lights or wheels)
 L.globalCompositeOperation = 'destination-in'; L.drawImage(mask, 0, 0); x.drawImage(layer, 0, 0); }
/* ---------------- premium roof gear & physical mud flaps ---------------- */
const MF = {a:0, v:0};
function drawAccessories(x, V, cos, wheelsPx){ const M = paintMask(V.spr), w = M.w, h = M.h, ppm = w / V.len, rl = roofLine(V), lit = !!(G.car && G.car.headOn && G.mode === 'play'), t = performance.now() / 1000;
 if (cos.roof && cos.roof !== 'none'){ const cx = w * (V.cls === 'micro' ? .45 : .5), top = Math.min(...[-.12, -.06, 0, .06, .12].map(o => rl[clamp(Math.round(cx + o * w), 0, w - 1)])) + 1; x.save();
  const foot = (fx, fw) => { const g = x.createLinearGradient(0, top - ppm * .08, 0, top); g.addColorStop(0, '#9aa3ad'); g.addColorStop(1, '#3a3f45'); x.fillStyle = g; x.fillRect(fx - fw / 2, top - ppm * .08, fw, ppm * .08); };
  if (cos.roof === 'taxi'){ const bw = .95 * ppm, bh = .3 * ppm, y0 = top - bh - ppm * .06; foot(cx - bw * .3, ppm * .08); foot(cx + bw * .3, ppm * .08);
   x.fillStyle = '#1a1a1a'; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2 - 1, y0 - 1, bw + 2, bh + 2, bh * .3) : x.rect(cx - bw / 2, y0, bw, bh); x.fill();
   const g = x.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, lit ? '#fff8c8' : '#fff1a8'); g.addColorStop(.5, lit ? '#ffd23a' : '#f5b21b'); g.addColorStop(1, '#c98a12'); x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, y0, bw, bh, bh * .28) : x.rect(cx - bw / 2, y0, bw, bh); x.fill();
   x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(cx - bw * .44, y0 + bh * .1, bw * .88, bh * .12);
   if (lit){ x.shadowColor = '#ffd23a'; x.shadowBlur = 14; } x.fillStyle = '#141414'; x.font = `900 ${bh * .58}px Lalezar, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('أجرة · TAXI', cx, y0 + bh * .58); x.shadowBlur = 0; }
  if (cos.roof === 'bar'){ const bw = 1.4 * ppm, bh = .14 * ppm, y0 = top - bh - ppm * .07; foot(cx - bw * .35, ppm * .07); foot(cx + bw * .35, ppm * .07);
   const g = x.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, '#4a5058'); g.addColorStop(.5, '#16181b'); g.addColorStop(1, '#2b2f34'); x.fillStyle = g; x.beginPath(); x.roundRect ? x.roundRect(cx - bw / 2, y0, bw, bh, bh * .4) : x.rect(cx - bw / 2, y0, bw, bh); x.fill();
   const n = 12; for (let i = 0; i < n; i++){ const sx2 = cx - bw / 2 + bw * (i + .12) / n, sw2 = bw * .76 / n; const pulse = lit ? .7 + .3 * Math.sin(t * 3 - i * .5) : 0; x.fillStyle = lit ? `rgba(${235 + 20 * pulse | 0},${245},${255},1)` : 'rgba(150,160,170,.55)'; if (lit){ x.shadowColor = 'rgba(210,235,255,.95)'; x.shadowBlur = 10 + 8 * pulse; } x.fillRect(sx2, y0 + bh * .22, sw2, bh * .56); x.shadowBlur = 0; }
   x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(cx - bw * .48, y0 + bh * .1, bw * .96, bh * .1); }
  if (cos.roof === 'box'){ const bw = Math.min(2.3, V.len * .42) * ppm, bh = .4 * ppm, y0 = top - bh - ppm * .1; const rails = x.createLinearGradient(0, top - ppm * .1, 0, top); rails.addColorStop(0, '#c9ced4'); rails.addColorStop(1, '#5b6168'); x.fillStyle = rails; x.fillRect(cx - bw * .56, top - ppm * .1, bw * 1.12, ppm * .05); foot(cx - bw * .45, ppm * .06); foot(cx + bw * .45, ppm * .06);
   const g = x.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, '#5e6670'); g.addColorStop(.3, '#2a2f36'); g.addColorStop(1, '#14171b'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - bw / 2, y0 + bh); x.quadraticCurveTo(cx - bw / 2, y0 + bh * .1, cx - bw * .32, y0); x.lineTo(cx + bw * .36, y0); x.quadraticCurveTo(cx + bw / 2 + bw * .04, y0 + bh * .15, cx + bw / 2, y0 + bh); x.closePath(); x.fill();
   x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx - bw * .3, y0 + bh * .18); x.lineTo(cx + bw * .34, y0 + bh * .18); x.stroke(); x.fillStyle = 'rgba(245,178,27,.85)'; x.font = `800 ${bh * .32}px "Readex Pro", sans-serif`; x.textAlign = 'center'; x.fillText('OGRAAA', cx, y0 + bh * .66); }
  if (cos.roof === 'ac'){ const bw = 1.8 * ppm, bh = .3 * ppm, y0 = top - bh; const g = x.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#d9dde2'); g.addColorStop(1, '#a9b0b8'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - bw / 2, y0 + bh); x.quadraticCurveTo(cx - bw / 2, y0, cx - bw * .3, y0); x.lineTo(cx + bw * .3, y0); x.quadraticCurveTo(cx + bw / 2, y0, cx + bw / 2, y0 + bh); x.fill();
   for (let i = 0; i < 9; i++){ const gx = cx - bw * .36 + i * bw * .09; x.fillStyle = '#6f7882'; x.fillRect(gx, y0 + bh * .3, bw * .05, bh * .45); x.fillStyle = 'rgba(255,255,255,.6)'; x.fillRect(gx, y0 + bh * .3, bw * .05, bh * .06); } }
  x.restore(); }
 if (cos.mud && cos.mud !== 'none'){ const col = {red:['#8e0f18','#c81e28'], black:['#0e0f11','#2b2e33'], chrome:['#8f99a3','#f2f5f8']}[cos.mud]; const ang = clamp(MF.a, -.6, .45);
  (wheelsPx || META[V.spr].wheels).forEach(([wx, wy, wr]) => { const mx = wx - wr * 1.08, top = wy - wr * .1, mh = wr * 1.0, mw = wr * .2; x.save(); x.translate(mx, top); x.rotate(ang);
   x.fillStyle = '#6b737c'; x.fillRect(-mw * .2, -wr * .06, mw * 1.4, wr * .06);
   const g = x.createLinearGradient(-mw / 2, 0, mw / 2, 0); g.addColorStop(0, col[0]); g.addColorStop(.55, col[1]); g.addColorStop(1, col[0]); x.fillStyle = g; x.beginPath(); x.moveTo(-mw / 2, 0); x.lineTo(mw / 2, 0); x.lineTo(mw / 2, mh * .92); x.quadraticCurveTo(0, mh * 1.04, -mw / 2, mh * .92); x.closePath(); x.fill();
   x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(-mw * .35, mh * .05, mw * .12, mh * .8);
   if (cos.mud !== 'chrome'){ x.fillStyle = 'rgba(255,255,255,.75)'; x.font = `800 ${mw * .55}px "Readex Pro", sans-serif`; x.textAlign = 'center'; x.save(); x.translate(0, mh * .5); x.rotate(-Math.PI / 2); x.fillText('OGRAAA', 0, mw * .18); x.restore(); }
   x.restore(); }); }
}
/* ---------------- wheels in front of the dark wheel wells (new fleet) + rim colours ---------------- */
const _dv26 = drawVehicle;
drawVehicle = function(car, opt){ _dv26(car, opt); const M = META[car.spr]; if (!M || !M.wf) return; opt = opt || {}; const lift = opt.lift || 0, sc = opt.scale || 1, X = sx(car.x), Y = sy(car.y + lift), wr = car.whRim ?? car.rim, im = rimImg(wr, car.player ? car.rimc : null), q = WQ(wr);
 for (const w of car.wh){ const r = w.r * PPM * sc, wx = X + (w.x - car.x) * PPM * sc, wy = Y - (w.y - car.y) * PPM * sc; ctx.save(); if (opt.dim && S.set.gfx !== 'low') ctx.filter = 'brightness(.86) saturate(.85)'; ctx.translate(wx, wy); if (w.flat) ctx.scale(1, .86); ctx.rotate(w.rot); ctx.drawImage(im, -r * q, -r * q, r * 2 * q, r * 2 * q); ctx.restore(); } };
/* ---------------- suspension: buses smooth & long travel, everything else tuned ---------------- */
function softSusp(c, len){ if (!c) return; const isP = c === G.car, up = isP && !G.test ? upl(G.vid, 'susp') : 0, wear = isP && !G.test ? GV(G.vid).cond.susp / 100 : 1, n = c.wh.length, m = c.base;
 let f0, z0, tr; if (len > 11){ f0 = .74; z0 = .22; tr = .34; } else if (len > 9){ f0 = .8; z0 = .23; tr = .32; } else if (len > 6.5){ f0 = .92; z0 = .25; tr = .28; } else if (len > 5.8){ f0 = 1.08; z0 = .27; tr = .25; } else if (len > 4.6){ f0 = 1.3; z0 = .3; tr = .21; } else { f0 = 1.42; z0 = .32; tr = .19; }
 c.f = f0 * (1 + .035 * up); c.zeta = (z0 + .03 * up) * (.72 + .28 * wear); c.travel = tr + .012 * up;
 c.k = (m / n) * Math.pow(2 * Math.PI * c.f, 2); c.cd = 2 * c.zeta * Math.sqrt(c.k * m / n); c.kb = c.k * 9; }
const _sr26 = startRoute;
startRoute = function(route, opt){ _sr26(route, opt); if (G.car && G.V) softSusp(G.car, G.V.len); if (G.car && G.V && !G.test) G.car.rimc = GV(G.vid).cos.rimc; };
const _sp26 = spawnAI;
spawnAI = function(spec, lane, x, dir, opt){ const c = _sp26(spec, lane, x, dir, opt); if (c && AIV[spec]) softSusp(c, AIV[spec].len); return c; };
/* mud-flap physics: trails back with speed and air, swings with braking/acceleration and bumps */
const _upd26 = update;
update = function(dt){ _upd26(dt); if (G.mode !== 'play' || !G.car || dt <= 0) return; const car = G.car, sp = car.vx, ax = (sp - (MF.pv || 0)) / dt, ay = (car.vy - (MF.pvy || 0)) / dt; MF.pv = sp; MF.pvy = car.vy;
 const target = -clamp(sp * .011, -.35, .35) + clamp(ax * .03, -.3, .3), kk = 38, cc = 4.2; MF.v += (kk * (target - MF.a) - cc * MF.v + clamp(-ay * .04, -2, 2)) * dt; MF.a += MF.v * dt; };
/* ---------------- underglow: real light on the road and on the lower body ---------------- */
function drawUnderglow(){ const car = G.car; if (!car || !car.glowCol) return; const w = car.wh, x0 = Math.min(...w.map(q => q.x)) - .8, x1 = Math.max(...w.map(q => q.x)) + .8, cx = (x0 + x1) / 2, X = sx(cx), Y = sy(terrH(cx)) + 1, rw = (x1 - x0) / 2 * PPM, col = car.glowCol;
 ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(X, Y); ctx.scale(1, .16); let g = ctx.createRadialGradient(0, 0, 0, 0, 0, rw * 1.25); g.addColorStop(0, col + '66'); g.addColorStop(.45, col + '33'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rw * 1.25, 0, 7); ctx.fill(); ctx.restore();
 ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, Y - PPM * .25, 0, Y + PPM * .05); lg.addColorStop(0, col + '00'); lg.addColorStop(.7, col + '55'); lg.addColorStop(1, col + '00'); ctx.fillStyle = lg; ctx.fillRect(sx(x0 + .3), Y - PPM * .25, (x1 - x0 - .6) * PPM, PPM * .3); ctx.restore(); }
/* preview: glow pool under the vehicle (garage & showroom) */
const _dp26 = drawPreview;
drawPreview = function(canvas, vid, cosOver){ const gv = GV(vid), cos = cosOver || gv.cos, gl = COS.glow.find(g => g.id === cos.glow); const cos2 = Object.assign({}, cos, {glow:'none'}); _dp26(canvas, vid, cos2);
 const c = canvas, w = c.clientWidth, h = c.clientHeight; if (!w) return; const x = c.getContext('2d'), V = VBY(vid), b = PREV[vid] && PREV[vid].cv; if (!b) return; const k = Math.min(w * .82 / b.width, h * .62 / b.height) * clamp(.62 + V.len / 30, .75, 1), bw = b.width * k, ox = (w - bw) / 2, gy = h * .88;
 if (gl && gl.c){ x.save(); x.globalCompositeOperation = 'lighter'; x.translate(w / 2, gy + 2); x.scale(1, .14); const g = x.createRadialGradient(0, 0, 0, 0, 0, bw * .62); g.addColorStop(0, gl.c + '88'); g.addColorStop(.5, gl.c + '33'); g.addColorStop(1, gl.c + '00'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, bw * .62, 0, 7); x.fill(); x.restore(); }
 // wheel-well vehicles: draw wheels over the wells in the preview too
 const M = META[V.spr]; if (M && M.wf){ const wr = (COS.rim.find(r => r.id === cos.rim) || {wh:V.rim}).wh, im = rimImg(wr, cos.rimc), q = WQ(wr), t0 = performance.now() / 1000, oy = gy - b.height * k; for (const [cx, cy, r] of M.wheels){ x.save(); x.translate(ox + cx * k, oy + cy * k); x.rotate(t0 * 1.5); const R = r * k * q; x.drawImage(im, -R, -R, R * 2, R * 2); x.restore(); } }
 };
/* ---------------- text-sticker editor in the garage ---------------- */
const _rg26 = renderGarage;
renderGarage = function(){ _rg26(); if (GCAT !== 'tsticker') return; const g = GV(GV_ID); const card = $('#s-garage .tabs + .card'); if (!card) return;
 card.insertAdjacentHTML('afterbegin', `<div class="row" style="gap:.5rem;margin-bottom:.6rem"><label style="min-width:7rem">✍ ${L2('نص الستيكر', 'Sticker text')}</label><input id="stxt" maxlength="26" value="${(g.cos.stxt || '').replace(/"/g, '&quot;')}" placeholder="${L2('اكتب كلامك هنا', 'Type your text')}" style="flex:1"><button class="btn sm" id="stSave">${L2('تطبيق', 'Apply')}</button></div>`);
 $('#stSave').onclick = () => { g.cos.stxt = $('#stxt').value.trim().slice(0, 26); if (g.cos.tsticker !== 'custom' && (S.inv[GV_ID + ':tsticker:custom'] || 0)) g.cos.tsticker = 'custom'; save(); renderGarage(); toastUI('✍ ' + L2('اتحفظ', 'Saved'), 'good'); }; };
/* ---------------- new intercity routes & skylines ---------------- */
const addRoute = r => { if (!ROUTES.find(q => q.id === r.id)) ROUTES.push(r); };
addRoute({id:'c8', type:'coach', lvl:8, fare:480, est:true, km:470, biome:'redsea', sky:['pGouna','pHurghada'], from:['القاهرة','Cairo'], to:['الجونة','El Gouna'], stops:[['موقف الترجمان','Turgoman terminal'],['موقف الجونة','El Gouna terminal']], rests:[['استراحة الزعفرانة','Zafarana rest house'],['استراحة رأس غارب','Ras Gharib rest house']]});
addRoute({id:'c9', type:'coach', lvl:7, fare:300, est:true, km:260, biome:'desert', sky:['pAlexRoad','pDesertFuel'], from:['القاهرة','Cairo'], to:['العلمين الجديدة','New Alamein'], stops:[['موقف الترجمان','Turgoman terminal'],['موقف العلمين','Alamein terminal']], rests:[['استراحة وادي النطرون','Wadi El Natrun rest house']]});
addRoute({id:'c10', type:'coach', lvl:9, fare:520, est:true, km:520, biome:'desert', sky:['pAlexRoad','pCoast'], from:['القاهرة','Cairo'], to:['مرسى مطروح','Marsa Matrouh'], stops:[['موقف الترجمان','Turgoman terminal'],['موقف مطروح','Matrouh terminal']], rests:[['استراحة وادي النطرون','Wadi El Natrun rest house'],['استراحة العلمين','El Alamein rest house']]});
addRoute({id:'c11', type:'coach', lvl:8, fare:460, est:true, km:500, biome:'redsea', sky:['pHurghada','pGouna'], from:['القاهرة','Cairo'], to:['سفاجا','Safaga'], stops:[['موقف الترجمان','Turgoman terminal'],['موقف سفاجا','Safaga terminal']], rests:[['استراحة الزعفرانة','Zafarana rest house'],['استراحة الغردقة','Hurghada rest house']]});
SKY15.city = ['pCairo2', 'pCairo', 'pResid']; SKY15.redsea = ['pHurghada', 'pGouna', 'pCoast'];
{ const c1 = ROUTES.find(r => r.id === 'c1'); if (c1) c1.sky = ['pAlexRoad', 'pDesert']; const c3 = ROUTES.find(r => r.id === 'c3'); if (c3) c3.sky = ['pHurghada', 'pGouna']; }
const _dl26 = drawLayers;
drawLayers = function(){ const r = W.route; if (r && r.sky){ const saved = SKY15[r.biome]; SKY15[r.biome] = r.sky; try{ _dl26(); } finally { SKY15[r.biome] = saved; } } else _dl26(); };

/* ======================= polish-2.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v27 — polish pass on customisation & wheels
   wheels locked to their arches · real mud flaps · sleek LED bar ·
   metre-scaled decals · clean paint finishes
   ===================================================================== */
/* ---------------- wheels for wheel-well vehicles: anchored in the body's own space ---------------- */
drawVehicle = (function(prev){ return function(car, opt){ const M = META[car.spr]; if (!M || !M.wf) return prev(car, opt); _dv26(car, opt);
 opt = opt || {}; const lift = opt.lift || 0, sc = opt.scale || 1, src = car.cv || IMG[car.spr], k = PPM * car.g.s * sc, mk = car.mirror ? -k : k, wr = car.whRim ?? car.rim, im = rimImg(wr, car.player ? car.rimc : null), q = WQ(wr);
 ctx.save(); ctx.translate(sx(car.x), sy(car.y + lift)); ctx.rotate(-car.a); ctx.scale(mk, k); ctx.translate(-src.width / 2, -src.height / 2); if (opt.dim && S.set.gfx !== 'low') ctx.filter = 'brightness(.86) saturate(.85)';
 M.wheels.forEach(([cx, cy, r], i) => { const w = car.wh[i]; if (!w) return; const R = r * q; ctx.save(); ctx.translate(cx, cy); if (w.flat) ctx.scale(1, .86); ctx.rotate(car.mirror ? -w.rot : w.rot); ctx.drawImage(im, -R, -R, R * 2, R * 2); ctx.restore(); });
 ctx.restore(); }; })(drawVehicle);
/* ---------------- accessories: realistic mud flaps, flush LED bar ---------------- */
const _acc27 = drawAccessories;
drawAccessories = function(x, V, cos, wheelsPx){ const c2 = Object.assign({}, cos); const bar = c2.roof === 'bar', mud = c2.mud; if (bar) c2.roof = 'none'; c2.mud = 'none'; _acc27(x, V, c2, wheelsPx);
 const M = paintMask(V.spr), w = M.w, h = M.h, ppm = w / V.len, rl = roofLine(V), lit = !!(G.car && G.car.headOn && G.mode === 'play'), t = performance.now() / 1000;
 if (bar){ // low-profile bar that follows the roof, aluminium housing, clear lenses, glow only when lit
  const cx = w * (V.cls === 'micro' ? .47 : .52), half = Math.min(1.1, V.len * .11) * ppm, n = 18, hh = .075 * ppm; x.save();
  const pts = []; for (let i = 0; i <= n; i++){ const px = cx - half + i * (half * 2 / n); pts.push([px, rl[clamp(Math.round(px), 0, w - 1)] - ppm * .02]); }
  x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py - hh) : x.moveTo(px, py - hh)); for (let i = n; i >= 0; i--) x.lineTo(pts[i][0], pts[i][1]); x.closePath();
  const g = x.createLinearGradient(0, pts[0][1] - hh, 0, pts[0][1]); g.addColorStop(0, '#c4cad1'); g.addColorStop(.35, '#5d646c'); g.addColorStop(1, '#202328'); x.fillStyle = g; x.fill();
  for (let i = 0; i < n; i++){ const [px, py] = pts[i], [qx, qy] = pts[i + 1], mx = (px + qx) / 2, my = (py + qy) / 2 - hh * .5, lw = (qx - px) * .72, lh = hh * .5; const on = lit ? .75 + .25 * Math.sin(t * 2.4 - i * .35) : 0;
   if (lit){ x.shadowColor = 'rgba(205,232,255,.9)'; x.shadowBlur = 6 + 6 * on; x.fillStyle = `rgba(${230 + 25 * on | 0},245,255,1)`; } else { x.shadowBlur = 0; const lg = x.createLinearGradient(0, my - lh / 2, 0, my + lh / 2); lg.addColorStop(0, 'rgba(235,240,245,.85)'); lg.addColorStop(1, 'rgba(120,130,140,.85)'); x.fillStyle = lg; }
   x.fillRect(mx - lw / 2, my - lh / 2, lw, lh); }
  x.shadowBlur = 0; x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py - hh + 1) : x.moveTo(px, py - hh + 1)); x.stroke(); x.restore(); }
 if (mud && mud !== 'none'){ // rubber flap hanging from the body just behind each wheel arch; swings with the physics angle
  const col = {red:['#5e0a10','#9a1620'], black:['#0b0c0e','#24272b'], chrome:['#7d8791','#e6eaee']}[mud], ang = clamp(MF.a, -.5, .4), bodyBottom = x => { for (let y = h - 1; y > h * .5; y--) if (M.src[(y * w + Math.round(x)) * 4 + 3] > 150) return y; return h * .9; };
  (wheelsPx || META[V.spr].wheels).forEach(([wx, wy, wr]) => { const fw = (V.len > 9 ? .13 : .1) * ppm, fx = wx - wr - fw * .45, top = wy - wr * .2, fh = (wy + wr - ppm * .12) - top;
   x.save(); x.translate(fx, top); x.rotate(ang);
   const g = x.createLinearGradient(-fw / 2, 0, fw / 2, 0); g.addColorStop(0, '#08090a'); g.addColorStop(.55, '#1d1f22'); g.addColorStop(1, '#0c0d0f'); x.fillStyle = g; x.beginPath(); x.moveTo(-fw / 2, 0); x.lineTo(fw / 2, 0); x.lineTo(fw / 2, fh * .97); x.quadraticCurveTo(0, fh * 1.03, -fw / 2, fh * .95); x.closePath(); x.fill();
   x.fillStyle = col[1]; x.fillRect(fw * .12, fh * .06, fw * .3, fh * .88); x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(fw * .14, fh * .06, fw * .06, fh * .88);
   x.fillStyle = '#aeb5bd'; x.fillRect(-fw / 2 - 1, 0, fw + 2, Math.max(1.5, fh * .05)); x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(-fw / 2, fh * .05, fw, Math.max(1, fh * .02));
   x.restore(); }); }
};
/* ---------------- decals sized in metres (real proportions), cleaner finishes ---------------- */
const _dec27 = decorate;
decorate = function(c, V, cos){ const legacyNew = ['pharaoh','palms','checker','waves','stripes','misr'], d = cos.decal; const cos2 = Object.assign({}, cos, {decal:legacyNew.includes(d) ? 'none' : d, finish:cos.finish === 'metal' ? 'gloss' : cos.finish}); _dec27(c, V, cos2);
 const G2 = bodyGeo(V), w = c.width, h = c.height, ppm = G2.ppm, x = c.getContext('2d'), mask = bodyMaskCanvas(V), layer = document.createElement('canvas'); layer.width = w; layer.height = h; const L = layer.getContext('2d');
 const BY = G2.winBot + ppm * .12, BH = Math.max(ppm * .3, G2.archTop - BY - ppm * .05), rear = w * .04, front = w * .95;
 if (cos.finish === 'metal'){ const r = mulberry(11); for (let i = 0; i < w * h / 60; i++){ L.fillStyle = `rgba(255,255,255,${.05 + r() * .1})`; L.fillRect(r() * w, r() * h, 1, 1); } const g = L.createLinearGradient(0, 0, 0, h); g.addColorStop(.1, 'rgba(255,255,255,.2)'); g.addColorStop(.3, 'rgba(255,255,255,0)'); g.addColorStop(.85, 'rgba(0,0,0,.07)'); L.fillStyle = g; L.fillRect(0, 0, w, h); }
 if (d === 'pharaoh'){ const bh = .24 * ppm, y = BY + BH * .25, s = .2 * ppm; L.fillStyle = '#14316f'; L.fillRect(rear, y, front - rear, bh); L.fillStyle = '#d9ab45'; L.fillRect(rear, y, front - rear, bh * .14); L.fillRect(rear, y + bh * .86, front - rear, bh * .14); for (let px = rear + s; px < front - s; px += s * 1.4){ L.beginPath(); L.moveTo(px - s * .45, y + bh * .78); L.lineTo(px, y + bh * .24); L.lineTo(px + s * .45, y + bh * .78); L.closePath(); L.fill(); } }
 if (d === 'palms'){ const r = mulberry(3); for (let i = 0; i < 3; i++){ const px = rear + ppm * (.45 + i * .5), base = BY + BH * .98, ht = Math.min(ppm * (1.1 - i * .15), BH * (.9 - i * .1)); L.strokeStyle = 'rgba(28,70,46,.9)'; L.lineWidth = ppm * .05; L.beginPath(); L.moveTo(px, base); L.quadraticCurveTo(px + ppm * .08, base - ht * .5, px + ppm * .03, base - ht); L.stroke(); L.fillStyle = 'rgba(30,96,58,.9)'; for (let k = 0; k < 7; k++){ const a = -Math.PI / 2 + (k - 3) * .5; L.save(); L.translate(px + ppm * .03, base - ht); L.rotate(a + Math.PI / 2); L.beginPath(); L.ellipse(0, -ht * .2, ht * .05, ht * .22, 0, 0, 7); L.fill(); L.restore(); } } }
 if (d === 'checker'){ const s = .1 * ppm, y = BY + BH * .4; for (let px = rear, i = 0; px < front; px += s, i++) for (let rr = 0; rr < 2; rr++){ L.fillStyle = (i + rr) % 2 ? '#141414' : '#f4f4f4'; L.fillRect(px, y + rr * s, s, s); } }
 if (d === 'waves'){ [[.35, '#1565c0', .08], [.55, '#42a5f5', .06], [.72, '#b3e5fc', .045]].forEach(([o, col, t]) => { L.strokeStyle = col; L.lineWidth = t * ppm; L.lineCap = 'round'; L.beginPath(); for (let px = rear; px <= front; px += 3){ const y = BY + BH * o + Math.sin(px / (ppm * .9)) * ppm * .07; px === rear ? L.moveTo(px, y) : L.lineTo(px, y); } L.stroke(); }); }
 if (d === 'stripes'){ [[.3, .11, '#c8102e'], [.47, .04, '#111'], [.56, .11, '#c8102e']].forEach(([o, tt, col]) => { L.fillStyle = col; L.fillRect(rear, BY + BH * o, front - rear, tt * ppm * 1.6); }); }
 if (d === 'misr'){ L.font = `900 ${Math.min(BH * .85, ppm * .7)}px Lalezar, serif`; L.textAlign = 'center'; L.textBaseline = 'middle'; L.fillStyle = 'rgba(200,16,46,.9)'; L.fillText('مِصْر', w * .4, BY + BH * .55); }
 L.globalCompositeOperation = 'destination-in'; L.drawImage(mask, 0, 0); x.drawImage(layer, 0, 0); };
for (const k in PREV) delete PREV[k];

/* ======================= ride-fuel.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v28 — buses ride higher on supple long-travel springs
   (spring preload so soft springs don't sit on the bump stops),
   fuel use +50%
   ===================================================================== */
const _ss28 = softSusp;
softSusp = function(c, len){ if (!c) return; if (c.f0 == null) c.f0 = c.f; const f0 = c.f0; _ss28(c, len); if (len <= 5.8) return;
 // softer, more supple and more travel than before
 c.zeta *= .9; c.travel = (len > 11 ? .38 : len > 9 ? .36 : len > 6.5 ? .32 : .28) + (c === G.car && !G.test ? .012 * upl(G.vid, 'susp') : 0);
 const n = c.wh.length; c.cd = 2 * c.zeta * Math.sqrt(c.k * c.base / n);
 // preload: static sag of the soft spring is carried by the air bags, so the bus sits at its design height (+4 cm)
 const sagNew = 9.8 / Math.pow(2 * Math.PI * c.f, 2), sagDef = 9.8 / Math.pow(2 * Math.PI * (f0 || 1.6), 2); c.pre = sagNew - .105; };
/* fuel: another +50% */
const _ff28 = fuelFactor;
fuelFactor = function(){ return _ff28() * 1.5; };

/* ======================= lamps.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v29 — every head- and tail-lamp placed by hand on its artwork
   (fractions of sprite width/height: [head x, head y], [tail x, tail y])
   ===================================================================== */
const LAMPS = {
 pv0:[[.97,.58],[.015,.57]], pv1:[[.975,.7],[.012,.66]], pv2:[[.975,.825],[.02,.67]], pv3:[[.975,.815],[.012,.75]], pv4:[[.965,.86],[.02,.62]], pv5:[[.97,.86],[.012,.68]],
 pn0:[[.965,.62],[.02,.56]], pn1:[[.97,.64],[.015,.58]], pn2:[[.97,.73],[.012,.59]], pn3:[[.975,.75],[.02,.57]], pn4:[[.97,.775],[.012,.78]], pn5:[[.965,.79],[.012,.66]],
 nw0:[[.965,.535],[.02,.53]], nw1:[[.955,.56],[.02,.53]], nw2:[[.955,.54],[.02,.53]], nw3:[[.955,.56],[.02,.57]], nw4:[[.955,.56],[.02,.55]], nw5:[[.95,.56],[.02,.58]],
 nw6:[[.955,.68],[.02,.61]], nw7:[[.955,.7],[.02,.61]], nw8:[[.955,.68],[.02,.61]], nw9:[[.955,.685],[.02,.61]], nw10:[[.96,.7],[.02,.62]], nw11:[[.955,.7],[.02,.62]],
 nw12:[[.965,.745],[.02,.635]], nw13:[[.965,.73],[.02,.63]], nw14:[[.965,.745],[.02,.63]], nw15:[[.965,.735],[.02,.63]],
 ai0:[[.975,.5],[.015,.52]], ai1:[[.955,.49],[.035,.36]], ai2:[[.96,.49],[.025,.43]], ai3:[[.96,.45],[.04,.36]], ai7:[[.96,.45],[.03,.47]], ai8:[[.97,.73],[.02,.62]], ai9:[[.97,.735],[.035,.6]],
 ai10:[[.96,.575],[.025,.59]], ai11:[[.95,.49],[.035,.42]], ai12:[[.975,.55],[.02,.5]], ai13:[[.975,.51],[.03,.47]], ai14:[[.96,.48],[.03,.39]], ai15:[[.95,.52],[.03,.36]], ai16:[[.945,.53],[.03,.4]],
 ai17:[[.945,.54],[.035,.4]], ai18:[[.94,.49],[.04,.36]], ai19:[[.97,.6],[.04,.68]], ai20:[[.97,.63],[.035,.67]], ai21:[[.97,.7],[.03,.66]], ai22:[[.95,.49],[.035,.4]], ai23:[[.95,.47],[.035,.36]],
 ai24:[[.95,.44],[.02,.49]], ai25:[[.945,.57],[.02,.55]], ai26:[[.96,.585],[.02,.5]], ai27:[[.945,.55],[.02,.53]], ai28:[[.975,.69],[.035,.68]], ai29:[[.975,.69],[.03,.68]], ai30:[[.97,.69],[.03,.68]]};
for (const k in LAMPS){ const m = META[k]; if (!m) continue; const [[hx, hy], [tx, ty]] = LAMPS[k]; m.hl = [hx * m.w, hy * m.h]; m.tl = [tx * m.w, ty * m.h]; }

/* ======================= ride-fx-light.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v30 — anti-dive pitch control · smoke & sparks that stay on
   the broken spot · windscreen glass & tint · LED bar lights the road ·
   volumetric sun rays
   ===================================================================== */
/* ---------------- anti-dive / anti-squat: soft ride without nose-diving ---------------- */
const _upd30 = update;
update = function(dt){ _upd30(dt); if (G.mode !== 'play' || !G.car || dt <= 0) return; const all = [G.car, ...G.ai.filter(a => Math.abs(a.x - G.car.x) < 80)];
 for (const c of all){ if (!c.wh || c.wh.length < 2) continue; const xs = c.wh.map(w => w.x), x0 = Math.min(...xs), x1 = Math.max(...xs); if (x1 - x0 < .5) continue;
  const slope = Math.atan2(terrH(x1) - terrH(x0), x1 - x0), diff = c.a - slope, big = c.L > 5.8, lim = big ? .028 : .045;
  // progressive pitch stiffness beyond a small free range (air-suspension levelling / anti-dive geometry), plus pitch damping
  if (Math.abs(diff) > lim) c.w -= (diff - Math.sign(diff) * lim) * (big ? 70 : 45) * dt;
  c.w *= 1 - Math.min(.5, dt * (big ? 5 : 3)); }
 tickDamageFX(dt); };
/* ---------------- heavy-crash damage keeps smoking / sparking from the broken spot ---------------- */
const _ad30 = addDent;
addDent = function(car, lx, ly, sev, glass){ _ad30(car, lx, ly, sev, glass); if (car === G.car && G.mode === 'play' && sev > 10 && !glass){ G.dmgEm = G.dmgEm || []; if (G.dmgEm.length < 6) G.dmgEm.push({lx, ly, sev, t:0, low:ly < (car.yb + (car.yt - car.yb) * .35)}); } };
function tickDamageFX(dt){ const car = G.car, E = G.dmgEm; if (!E || !E.length) return; const ca = Math.cos(car.a), sa = Math.sin(car.a), sp = speedOf(car);
 for (const e of E){ e.t += dt; const wx = car.x + e.lx * ca - e.ly * sa, wy = car.y + e.lx * sa + e.ly * ca, k = clamp(e.sev / 14, .5, 1.5);
  // smoke: thick at first, thinning over ~40 s, drifting back with speed
  const dens = Math.max(.15, 1 - e.t / 40) * k; if (Math.random() < dt * 14 * dens) puff(wx + rnd(-.1, .1), wy + rnd(-.05, .15), -car.vx * .35 + rnd(-.3, .3), .5 + rnd(0, .5), 1.6 + rnd(0, .8), .16 + .08 * k, e.t < 6 ? '#2b2b2b' : '#5a5a5a', 'smoke');
  if (Math.random() < dt * 1.2 * dens) spawnFX('smoke', wx - car.vx * .05, wy + .3, 1.1 * k, {dur:1.4, vy:.5, alpha:.55});
  // sparks: torn metal scraping or shorting while moving
  if (sp > 1.5 && Math.random() < dt * (e.low ? 22 : 7) * k) for (let i = 0; i < 3; i++) puff(wx, wy, -car.vx * .4 + rnd(-2, 2), rnd(.5, 3), .35 + rnd(0, .3), .03, '#FFD24A', 'spark');
  if (Math.random() < dt * .35 * k) spawnFX('spark', wx, wy, .6 * k, {dur:.4}); } }
const _sr30 = startRoute;
startRoute = function(r, o){ _sr30(r, o); G.dmgEm = []; };
/* ---------------- windscreen & driver glass: real glass, tint applied (lighter, legal on the front) ---------------- */
const FWM = {};
function frontGlassMask(V){ if (FWM[V.id]) return FWM[V.id]; const M = paintMask(V.spr), w = M.w, h = M.h, x0 = (DRV[V.id] || .8) * w * .97, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h);
 for (let p = 0; p < w * h; p++){ const px = p % w, py = p / w | 0; if (px >= x0 && py < h * .7 && M.win[p]) d.data[p * 4 + 3] = 255; } x.putImageData(d, 0, 0); return FWM[V.id] = c; }
const _bpc30 = buildPlayerCanvas;
buildPlayerCanvas = function(vid, cos, cond, dents){ const c = _bpc30(vid, cos, cond, dents); try{ const V = VBY(vid), m = frontGlassMask(V), w = c.width, h = c.height, L = document.createElement('canvas'); L.width = w; L.height = h; const x = L.getContext('2d'), TA = (COS.tint.find(q => q.id === cos.tint) || {a:0}).a;
 x.fillStyle = `rgba(14,22,30,${.06 + TA * .45})`; x.fillRect(0, 0, w, h);
 const g = x.createLinearGradient(w * .78, 0, w, h * .7); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.38, 'rgba(255,255,255,.22)'); g.addColorStop(.46, 'rgba(255,255,255,.05)'); g.addColorStop(.62, 'rgba(255,255,255,.14)'); g.addColorStop(.7, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
 x.globalCompositeOperation = 'destination-in'; x.drawImage(m, 0, 0); c.getContext('2d').drawImage(L, 0, 0); }catch(e){ reportErr('glass', e); } return c; };
for (const k in PREV) delete PREV[k];
/* ---------------- LED light bar: glows and floods the road ahead ---------------- */
const _dn30 = drawNight;
drawNight = function(){ _dn30(); const car = G.car; if (!car || !G.V) return; const cos = GV(G.vid).cos || {}; if (cos.roof !== 'bar' || !car.headOn) return;
 const nightK = G.tod === 'night' ? 1 : G.tod === 'sunset' ? .55 : .15, ca = Math.cos(car.a), sa = Math.sin(car.a), lx = car.L * (G.V.cls === 'micro' ? -.03 : .02), ly = car.yt + .05, bx = car.x + lx * ca - ly * sa, by = car.y + lx * sa + ly * ca, X = sx(bx), Y = sy(by), t = performance.now() / 1000;
 ctx.save(); ctx.globalCompositeOperation = 'lighter';
 const bl = ctx.createRadialGradient(X, Y, 0, X, Y, PPM * 1.8); bl.addColorStop(0, `rgba(215,236,255,${.5 * nightK})`); bl.addColorStop(.3, `rgba(215,236,255,${.16 * nightK})`); bl.addColorStop(1, 'rgba(215,236,255,0)'); ctx.fillStyle = bl; ctx.fillRect(X - PPM * 1.8, Y - PPM * 1.8, PPM * 3.6, PPM * 3.6);
 const gx0 = sx(car.x + car.L * .5 + 3), gx1 = sx(car.x + car.L * .5 + 34), gy = sy(terrH(car.x + 12) + .2);
 const beam = ctx.createLinearGradient(X, 0, gx1, 0); beam.addColorStop(0, `rgba(220,238,255,${.16 * nightK})`); beam.addColorStop(1, 'rgba(220,238,255,0)'); ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(X, Y - PPM * .1); ctx.lineTo(gx1, gy - PPM * 2.4); ctx.lineTo(gx1, gy + PPM * .3); ctx.lineTo(gx0, gy + PPM * .4); ctx.lineTo(X, Y + PPM * .1); ctx.closePath(); ctx.fill();
 const pcx = sx(car.x + car.L * .5 + 16), pool = ctx.createRadialGradient(pcx, gy, 0, pcx, gy, PPM * 14); pool.addColorStop(0, `rgba(225,240,255,${(.2 + .03 * Math.sin(t * 2)) * nightK})`); pool.addColorStop(1, 'rgba(225,240,255,0)'); ctx.save(); ctx.translate(pcx, gy); ctx.scale(1, .12); ctx.translate(-pcx, -gy); ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(pcx, gy, PPM * 14, 0, 7); ctx.fill(); ctx.restore();
 ctx.restore(); };
/* ---------------- volumetric sun rays (soft shafts, haze, fall-off) ---------------- */
let RAYC = null;
function buildRays(sxp, syp, sunset){ const c = document.createElement('canvas'); c.width = Math.max(1, VW >> 1); c.height = Math.max(1, VH >> 1); const x = c.getContext('2d'), S2 = .5, ox = sxp * S2, oy = syp * S2, R = Math.hypot(c.width, c.height), r = mulberry(sunset ? 77 : 33);
 const tmp = document.createElement('canvas'); tmp.width = c.width; tmp.height = c.height; const t = tmp.getContext('2d');
 for (let i = 0; i < 70; i++){ const a = r() * Math.PI * 2, wdt = .006 + r() * .03, al = .05 + r() * .12, len = R * (.5 + r() * .7), g = t.createLinearGradient(ox, oy, ox + Math.cos(a) * len, oy + Math.sin(a) * len); const col = sunset ? '255,190,120' : '255,248,225'; g.addColorStop(0, `rgba(${col},${al})`); g.addColorStop(.35, `rgba(${col},${al * .6})`); g.addColorStop(1, `rgba(${col},0)`); t.fillStyle = g; t.beginPath(); t.moveTo(ox, oy); t.lineTo(ox + Math.cos(a - wdt) * len, oy + Math.sin(a - wdt) * len); t.lineTo(ox + Math.cos(a + wdt) * len, oy + Math.sin(a + wdt) * len); t.closePath(); t.fill(); }
 x.filter = 'blur(10px)'; x.drawImage(tmp, 0, 0); x.filter = 'none';
 const glare = x.createRadialGradient(ox, oy, 0, ox, oy, R * .55); glare.addColorStop(0, sunset ? 'rgba(255,170,90,.35)' : 'rgba(255,250,230,.28)'); glare.addColorStop(.25, sunset ? 'rgba(255,150,80,.12)' : 'rgba(255,250,230,.08)'); glare.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = glare; x.fillRect(0, 0, c.width, c.height);
 return c; }
function drawSunRays(){ const sunset = G.tod === 'sunset', hz = horizon(), sxp = VW * (sunset ? .8 : .74), syp = sunset ? hz - VH * .06 : VH * .14, key = VW + 'x' + VH + G.tod;
 if (!RAYC || RAYC.key !== key){ RAYC = {key, c:buildRays(sxp, syp, sunset)}; }
 const t = performance.now() / 1000, a = (sunset ? .75 : .5) * (G.weather === 'rain' ? .25 : G.weather === 'sand' ? .55 : 1) * (.92 + .08 * Math.sin(t * .3));
 ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a; ctx.translate(sxp, syp); ctx.rotate(Math.sin(t * .05) * .02); ctx.translate(-sxp, -syp); ctx.drawImage(RAYC.c, 0, 0, VW, VH); ctx.restore(); }
addEventListener('resize', () => { RAYC = null; });

/* ======================= damage-systems.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v31 — component damage model (engine, radiator, gearbox, rims,
   tyres, suspension) driven by where/how hard you hit · field repairs
   with the tool kit · speed-based camera zoom · tyre screech · sparks
   anchored on real bodywork · fuel +50% · quieter wind
   ===================================================================== */
const PART = ['rad','gbx','rim'];
function condOf(){ const c = GV(G.vid).cond; for (const k of PART) if (c[k] == null) c[k] = 100; return c; }
/* ---------------- where the hit lands decides what breaks ---------------- */
const _ad31 = addDent;
addDent = function(car, lx, ly, sev, glass){ _ad31(car, lx, ly, sev, glass);
 if (car !== G.car || G.mode !== 'play') return;
 // keep the persistent smoke/spark emitter on real bodywork (never in empty space past a crushed edge)
 const E = G.dmgEm; if (E && E.length){ const e = E[E.length - 1]; if (e.lx === lx && e.ly === ly){ const p = onBody(car, lx, ly); e.lx = p[0]; e.ly = p[1]; } }
 if (G.test || glass || S.devGod) return; const c = condOf(), V = G.V, u = lx / car.L + .5, h = (ly - car.yb) / (car.yt - car.yb), s = Math.max(0, sev - 4);
 const engFront = V.cls === 'micro' || V.baked, nearEngine = engFront ? u > .72 : u < .26;
 if (nearEngine){ c.engine = Math.max(0, c.engine - s * 2.4); c.rad = Math.max(0, c.rad - s * 3.2); if (s > 6) toastUI('🌡 ' + L2('الضربة جت في الموتور والردياتير', 'The hit damaged the engine and radiator'), 'bad'); }
 // wheels near the impact: bent rims, punctures, suspension
 car.wh.forEach((w, i) => { const wl = (w.x - car.x) * Math.cos(car.a) + (w.y - car.y) * Math.sin(car.a); if (Math.abs(wl - lx) < w.r * 1.8 && h < .55){ c.rim = Math.max(0, c.rim - s * 4.5); c.susp = Math.max(0, c.susp - s * 2.5); G.rimBent = G.rimBent || []; G.rimBent[i] = clamp((G.rimBent[i] || 0) + s * .07, 0, 1); if (sev > 10 && Math.random() < .45){ w.flat = true; } } });
 // drivetrain: low, central or very violent hits reach the gearbox
 if ((u > .3 && u < .7 && h < .35) || sev > 14) c.gbx = Math.max(0, c.gbx - s * 2.2);
 save(); };
function onBody(car, lx, ly){ const cv = car.cv; if (!cv) return [lx, ly]; let d = car._alpha; if (!d || car._alphaV !== cv){ try{ d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; car._alpha = d; car._alphaV = cv; }catch(e){ return [lx, ly]; } }
 const w = cv.width, h = cv.height, g = car.g, toPx = (X, Y) => [((car.mirror ? -X : X) / g.len + .5) * w, (.5 - Y / g.h) * h], toL = (px, py) => [((px / w - .5) * g.len) * (car.mirror ? -1 : 1), (.5 - py / h) * g.h];
 let [px, py] = toPx(lx, ly); const cx = w / 2, cy = h * .6; for (let i = 0; i < 40; i++){ const ix = Math.round(px), iy = Math.round(py); if (ix >= 0 && iy >= 0 && ix < w && iy < h && d[(iy * w + ix) * 4 + 3] > 200) break; px += (cx - px) * .06; py += (cy - py) * .06; }
 // a little inside the broken edge
 px += (cx - px) * .03; return toL(px, py); }
/* ---------------- consequences every frame ---------------- */
let screech = null;
const _upd31 = update;
update = function(dt){ const car = G.car, full = G.mode === 'play'; if (full && car && car.acc0 == null){ car.acc0 = car.acc; car.vmax0 = car.vmax; }
 _upd31(dt); if (!full || !car || dt <= 0) return; const c = G.test ? {engine:100, rad:100, gbx:100, rim:100} : condOf(), fix = G.fieldFix, sp = speedOf(car);
 // engine power & top speed
 let pf = .35 + .65 * c.engine / 100; if (c.gbx < 20) pf *= .7; if (fix) pf = Math.max(pf, .68); car.acc = car.acc0 * pf; car.vmax = car.vmax0 * (.62 + .38 * Math.max(fix ? 60 : 0, c.engine) / 100);
 // radiator leak: the engine runs hot, steams, and overheats if pushed
 if (c.rad < 75 && G.engOn){ const leak = (75 - c.rad) / 75 * (fix ? .35 : 1); G.temp += dt * leak * (1.2 + sp * .12); if (Math.random() < dt * leak * 8){ const [ex, ey] = engineBay(); puff(ex, ey + .5, -car.vx * .3, 1.2, 1.4, .14, '#eef3f8', 'smoke'); } if (Math.random() < dt * leak * 3){ const [ex] = engineBay(); puff(ex, terrH(ex) + .2, 0, -.3, 3, .04, '#3d8b5a', 'dust'); } }
 // gearbox: lost gears, slipping, grinding
 const maxG = c.gbx > 60 || fix ? 5 : c.gbx > 35 ? 4 : c.gbx > 15 ? 3 : 2; if (car.gear > maxG) car.gear = maxG;
 if (c.gbx < 50 && !fix && sp > 2 && Math.random() < dt * (50 - c.gbx) / 90){ car.shiftT = .45; AU.noiseHit(.25, 900, .05, 0, 'bandpass', 4); }
 // bent rims: drag, vibration, scraping sparks when the tyre is flat on a bent rim
 const rb = G.rimBent || []; let wob = 0; car.wh.forEach((w, i) => { const b = (rb[i] || 0) * (fix ? .5 : 1); if (!b) return; wob += b; if (w.flat && sp > 2 && Math.random() < dt * 25 * b) puff(w.x - Math.sign(car.vx) * w.r * .6, terrH(w.x) + .03, -car.vx * .5 + rnd(-1.5, 1.5), rnd(.5, 2.5), .3, .03, '#FFD24A', 'spark'); });
 if (wob){ car.vx *= 1 - dt * .02 * wob; car.wh.forEach(w => { w.vx *= 1 - dt * .02 * wob; }); if (S.set.shake !== false) cam.shake = Math.max(cam.shake || 0, Math.min(.12, wob * Math.min(1, sp / 14) * .08)); }
 // tyre screech under hard braking
 brakeScreech(dt);
 // speed-based camera zoom (closer when slow, wider when fast)
 const target = 1.06 - clamp(sp / 26, 0, 1) * .24; cam.zs = cam.zs == null ? target : cam.zs + (target - cam.zs) * Math.min(1, dt * .9); if (Math.abs((cam.zoom || 1) - cam.zs) > .002){ cam.zoom = cam.zs; calcPPM(); } };
function brakeScreech(dt){ const c = AU.ctx, car = G.car; if (!c) return; if (!screech){ const len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; s.loop = true; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 2.5; const bp2 = c.createBiquadFilter(); bp2.type = 'peaking'; bp2.frequency.value = 2600; bp2.gain.value = 8; const g = c.createGain(); g.gain.value = 0; s.connect(bp).connect(bp2).connect(g).connect(AU.sfxG); s.start(); screech = {s, bp, g, pv:car.vx}; }
 const decel = (screech.pv - car.vx) / Math.max(dt, .001) * Math.sign(car.vx || 1); screech.pv = car.vx; const sp = speedOf(car), braking = key.brake || G.brkT, onGround = car.wh.some(w => w.ground);
 let k = braking && onGround ? clamp((decel - 4) / 5, 0, 1) * clamp((sp - 3) / 12, 0, 1) : 0; if (car.absT > 0 && sp > 4) k = Math.max(k, .45); if (G.paused) k = 0;
 const t = c.currentTime; screech.g.gain.setTargetAtTime(k * .22, t, .06); screech.bp.frequency.setTargetAtTime(1300 + sp * 28 + Math.sin(t * 13) * 80, t, .05); }
/* engine sound: misfires and knocking on a damaged engine */
const _eng31 = AU.engine.bind(AU);
AU.engine = function(on, rpm, load, speed, big){ _eng31(on, rpm, load, speed, big); const e = this.eng; if (!e || !on || G.test || !G.vid || G.mode !== 'play') return; const c = condOf(); if (c.engine < 50){ const bad = (50 - c.engine) / 50, t = this.ctx.currentTime + .03; if (Math.random() < .12 * bad) e.out.gain.setTargetAtTime(e.out.gain.value * .25, t, .01); e.ng.gain.setTargetAtTime(e.ng.gain.value + .06 * bad, t, .05); } };
/* ---------------- tool kit: field repair (once per trip) ---------------- */
{ const T = IBY('tools'); if (T){ T.use = 'field'; T.passive = false; T.d = ['تصليح مؤقت: يرجّع العربية تمشي لحد الورشة', 'Field repair: keeps you running to a workshop']; } }
const _ui31 = useItem;
useItem = function(id){ if (id !== 'tools') return _ui31(id); if (G.mode !== 'play') return; if (G.fieldFix){ toastUI(L2('عملت تصليح مؤقت خلاص', 'Field repair already done this trip'), 'gold'); return; } if (speedOf(G.car) > .5){ toastUI(L2('وقف الأول', 'Stop first'), 'bad'); return; }
 G.busyT = 10; G.busyMsg = L2('🧰 بتصلّح تصليح مؤقت…', '🧰 Field repair in progress…'); AU.noiseHit(.6, 1200, .08, 0, 'bandpass', 3);
 setTimeout(() => { G.fieldFix = true; if (!G.test){ const c = condOf(); c.engine = Math.max(c.engine, 45); c.rad = Math.max(c.rad, 50); c.gbx = Math.max(c.gbx, 40); } G.rimBent = (G.rimBent || []).map(b => b * .5); G.temp = Math.min(G.temp, 95); toastUI('🧰 ' + L2('اتصلحت مؤقتاً — روح أقرب ورشة', 'Patched up — head to the nearest workshop'), 'good', null, 4); save(); if (typeof renderTrunk === 'function') renderTrunk(); }, 10000); };
const _sr31 = startRoute;
startRoute = function(r, o){ _sr31(r, o); G.fieldFix = false; G.rimBent = []; if (G.car){ G.car.acc0 = G.car.acc; G.car.vmax0 = G.car.vmax; } cam.zs = null; };
/* workshop repairs the new components too */
const _svc31 = svcOptions;
svcOptions = function(type){ const o = _svc31(type); if (type !== 'shop' || G.test) return o; const c = condOf(), V = G.V, base = 8 + V.mass * .004;
 o.splice(2, 0, {ic:'🌡', n:['ردياتير جديد','Radiator repair'], p:Math.round((100 - c.rad) * base * .45) + 150, t:4, dis:c.rad > 95, fx:() => { c.rad = 100; G.temp = Math.min(G.temp, 85); }},
  {ic:'⚙️', n:['تصليح الفتيس','Gearbox repair'], p:Math.round((100 - c.gbx) * base * .7) + 300, t:5, dis:c.gbx > 95, fx:() => { c.gbx = 100; }},
  {ic:'🛞', n:['عدل الجنوط','Straighten rims'], p:Math.round((100 - c.rim) * base * .3) + 120, t:3, dis:c.rim > 95 && !(G.rimBent || []).some(b => b > 0), fx:() => { c.rim = 100; G.rimBent = []; }}); return o; };
Object.assign(TX, {c_rad:['الردياتير','Radiator'], c_gbx:['الفتيس','Gearbox'], c_rim:['الجنوط','Rims']});
{ const _rc31 = repairCost; repairCost = function(V, k, g){ if (PART.includes(k)) return Math.round((100 - (g.cond[k] ?? 100)) * (8 + V.mass * .004) * {rad:.45, gbx:.7, rim:.3}[k]); return _rc31(V, k, g); }; }
/* ---------------- fuel +50% again ---------------- */
const _ff31 = fuelFactor;
fuelFactor = function(){ return _ff31() * 1.5; };

/* ======================= squeal-dirt.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v32 — real tyre squeal (tonal stick-slip, not hiss) after
   1.5 s of hard braking · vehicles get dirty with distance, weather &
   roads; wash at garages, fuel stations and workshops
   ===================================================================== */
/* ---------------- tyre squeal ---------------- */
const SQ = {n:null, held:0, pv:0};
function squealInit(){ const c = AU.ctx; if (!c || SQ.n) return; const out = c.createGain(); out.gain.value = 0;
 // two slightly detuned tonal partials + a harmonic: the classic rubber "eeeee"
 const mk = (type, f) => { const o = c.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; };
 const o1 = mk('triangle', 920), o2 = mk('triangle', 934), o3 = mk('sine', 1840);
 const g3 = c.createGain(); g3.gain.value = .35; o3.connect(g3);
 // stick-slip chatter: fast amplitude flutter + slow pitch wander
 const am = c.createGain(); am.gain.value = .7; const fl = mk('sine', 38), flg = c.createGain(); flg.gain.value = .3; fl.connect(flg).connect(am.gain);
 const wob = mk('sine', 2.3), wobg = c.createGain(); wobg.gain.value = 18; wob.connect(wobg); wobg.connect(o1.frequency); wobg.connect(o2.frequency);
 const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 1.2; const hs = c.createBiquadFilter(); hs.type = 'highshelf'; hs.frequency.value = 2500; hs.gain.value = -6;
 o1.connect(am); o2.connect(am); g3.connect(am); am.connect(bp).connect(hs).connect(out).connect(AU.sfxG);
 // a little road roar under it
 const len = c.sampleRate, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; const ns = c.createBufferSource(); ns.buffer = b; ns.loop = true; const nlp = c.createBiquadFilter(); nlp.type = 'lowpass'; nlp.frequency.value = 500; const ng = c.createGain(); ng.gain.value = 0; ns.connect(nlp).connect(ng).connect(AU.sfxG); ns.start();
 SQ.n = {out, o1, o2, o3, fl, ng}; }
function brakeScreech(dt){ const c = AU.ctx, car = G.car; if (!c || !car) return; squealInit(); if (!SQ.n) return; const sp = speedOf(car), braking = !!(key.brake || G.brkT) && !G.paused && G.mode === 'play';
 SQ.held = braking && sp > 3 ? SQ.held + dt : 0; const decel = (SQ.pv - car.vx) / Math.max(dt, .001) * Math.sign(car.vx || 1); SQ.pv = car.vx;
 let k = 0; if (SQ.held > 1.5 && car.wh.some(w => w.ground)) k = clamp((decel - 2.5) / 5, .25, 1) * clamp((sp - 3) / 10, 0, 1) * Math.min(1, (SQ.held - 1.5) / .25);
 const t = c.currentTime, n = SQ.n, base = 760 + sp * 14 + (G.V && G.V.cls !== 'micro' ? -140 : 0);
 n.o1.frequency.setTargetAtTime(base, t, .08); n.o2.frequency.setTargetAtTime(base * 1.016, t, .08); n.o3.frequency.setTargetAtTime(base * 2.01, t, .08); n.fl.frequency.setTargetAtTime(30 + sp * .9, t, .1);
 n.out.gain.setTargetAtTime(k * .085, t, k > n.out.gain.value ? .05 : .12); n.ng.gain.setTargetAtTime(k * .05, t, .1); }
/* ---------------- dirt: accumulates with distance, worse on dusty roads and in rain ---------------- */
const DIRT = {};
function dirtTex(spr){ if (DIRT[spr]) return DIRT[spr]; const im = IMG[spr], M = META[spr]; if (!im || !im.width) return null; const w = im.width, h = im.height, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), r = mulberry(spr.length * 97 + w);
 // light dust film over everything
 x.fillStyle = 'rgba(150,128,96,.16)'; x.fillRect(0, 0, w, h);
 // heavier grime toward the bottom
 const g = x.createLinearGradient(0, h * .45, 0, h); g.addColorStop(0, 'rgba(118,96,66,0)'); g.addColorStop(.6, 'rgba(110,88,60,.35)'); g.addColorStop(1, 'rgba(84,66,44,.6)'); x.fillStyle = g; x.fillRect(0, h * .45, w, h * .55);
 // mud spray fanning back from each wheel
 for (const [cx, cy, wr] of (M.wheels || [])){ for (let i = 0; i < 160; i++){ const a = Math.PI * (.55 + r() * .75), d = wr * (1.05 + r() * 1.9), px = cx + Math.cos(a) * d * 1.25 - wr * .2, py = cy + Math.sin(a) * d * .55 - wr * .1; x.fillStyle = `rgba(${90 + r() * 30 | 0},${70 + r() * 20 | 0},${46 + r() * 14 | 0},${.12 + r() * .3})`; x.beginPath(); x.ellipse(px, py, 1 + r() * wr * .1, .8 + r() * wr * .06, r() * 3, 0, 7); x.fill(); } }
 // rain streaks running down from the window line
 for (let i = 0; i < w / 6; i++){ const px = r() * w, y0 = h * (.32 + r() * .2), len = h * (.08 + r() * .25); const sg = x.createLinearGradient(0, y0, 0, y0 + len); sg.addColorStop(0, 'rgba(100,82,58,.25)'); sg.addColorStop(1, 'rgba(100,82,58,0)'); x.fillStyle = sg; x.fillRect(px, y0, 1 + r() * 1.5, len); }
 // speckle
 for (let i = 0; i < w * h / 90; i++){ x.fillStyle = `rgba(80,62,42,${r() * .25})`; x.fillRect(r() * w, h * (.3 + r() * .7), 1, 1); }
 x.globalCompositeOperation = 'destination-in'; x.drawImage(im, 0, 0); return DIRT[spr] = c; }
const dirtOf = vid => 1 - ((GV(vid).cond.clean ?? 100) / 100);
/* the old flat tint is replaced by the textured layer */
const _bpc32 = buildPlayerCanvas;
buildPlayerCanvas = function(vid, cos, cond, dents){ const c = _bpc32(vid, cos, Object.assign({}, cond, {clean:100}), dents); const dt = dirtTex(VBY(vid).spr), d = 1 - ((cond && cond.clean != null ? cond.clean : 100) / 100); if (dt && d > .03){ const x = c.getContext('2d'); x.save(); x.globalAlpha = Math.min(1, d * 1.15); x.drawImage(dt, 0, 0); x.restore(); } return c; };
for (const k in PREV) delete PREV[k];
/* in game the layer is drawn live so the vehicle visibly gets dirtier during the trip */
const _dv32 = drawVehicle;
drawVehicle = function(car, opt){ _dv32(car, opt); if (!car.player || !G.V || G.test) return; const d = dirtOf(G.vid) - (G.dirt0 ?? dirtOf(G.vid)); if (d <= .01) return; const tex = dirtTex(car.spr); if (!tex) return; const src = car.cv || IMG[car.spr], k = PPM * car.g.s;
 ctx.save(); ctx.translate(sx(car.x), sy(car.y)); ctx.rotate(-car.a); ctx.scale(car.mirror ? -k : k, k); ctx.translate(-src.width / 2, -src.height / 2); ctx.globalAlpha = Math.min(1, d * 1.15); ctx.drawImage(tex, 0, 0); ctx.restore(); };
const _sr32 = startRoute;
startRoute = function(r, o){ _sr32(r, o); G.dirt0 = G.test ? 0 : dirtOf(G.vid); G._dx = G.car ? G.car.x : 0; SQ.held = 0; };
const _upd32 = update;
update = function(dt){ _upd32(dt); if (G.mode !== 'play' || G.test || !G.car) return; const dx = Math.abs(G.car.x - (G._dx ?? G.car.x)); G._dx = G.car.x; if (dx <= 0 || dx > 50) return; const b = W.route.biome, dusty = ['desert','sinai','redsea','upper'].includes(b) ? 2 : 1, wet = G.weather === 'rain' ? 2.5 : G.weather === 'sand' ? 3 : 1, c = GV(G.vid).cond;
 c.clean = Math.max(0, (c.clean ?? 100) - dx * .002 * dusty * wet);
 // passengers don't love a filthy bus
 if (c.clean < 35 && G.onboard.length) G.comfort = Math.max(0, G.comfort - dt * .03); };
/* ---------------- washing ---------------- */
const _svc32 = svcOptions;
svcOptions = function(type){ const o = _svc32(type); if (G.test || (type !== 'fuel' && type !== 'shop')) return o; const c = GV(G.vid).cond, V = G.V, price = Math.round(25 + V.len * 9);
 const wash = {ic:'🧽', n:['غسيل العربية','Car wash'], p:price, t:5, dis:(c.clean ?? 100) > 96, fx:() => { c.clean = 100; G.dirt0 = 0; for (const k in PREV) delete PREV[k]; const car = G.car; try{ car.cv = buildPlayerCanvas(G.vid, GV(G.vid).cos, GV(G.vid).cond, GV(G.vid).dents); SILC.delete(car.cv); }catch(e){} toastUI('🧽 ' + L2('العربية بقت تلمع', 'Squeaky clean!'), 'good'); }};
 o.splice(type === 'fuel' ? 3 : 0, 0, wash); return o; };

/* ======================= brake-lock.js ======================= */
"use strict";
/* =====================================================================
   OGRAAA v33 — hard braking past 1.5 s: wheels lock (no ABS) or pulse
   (ABS), tyre smoke, dust and skid marks on the road
   ===================================================================== */
const OLD_NO_ABS = new Set(['fiat128','hiaceB','hiace','coaster','minivan','suzuki','fotonC2']);
function hasABS(){ if (!G.V) return false; return !OLD_NO_ABS.has(G.V.id) || (!G.test && upl(G.vid, 'brakes') >= 1); }
let LOCK = {on:false, t:0, abs:false};
const _ps33 = physStep;
physStep = function(c, h, ctl){ _ps33(c, h, ctl); if (c !== G.car || !LOCK.on) return;
 // without ABS the wheels stay locked; with ABS they are released ~14×/s so they keep turning in short bursts
 const locked = !LOCK.abs || (LOCK.t % .07) < .042; if (locked) for (const w of c.wh) if (w.ground) w.om = 0; };
const SKID = [];
const _upd33 = update;
update = function(dt){ _upd33(dt); const car = G.car; if (G.mode !== 'play' || !car || dt <= 0) return; const sp = speedOf(car);
 LOCK.held = (key.brake || G.brkT) && sp > 2.5 && !G.paused ? (LOCK.held || 0) + dt : 0; LOCK.abs = hasABS(); LOCK.on = LOCK.held > 1.5; if (LOCK.on){ LOCK.t += dt; if (LOCK.abs) car.absT = .2; } else LOCK.t = 0;
 if (!LOCK.on) return; const k = clamp(sp / 18, .25, 1), dir = Math.sign(car.vx) || 1, smokeK = LOCK.abs ? .45 : 1;
 for (const w of car.wh){ if (!w.ground) continue; const gx = w.x, gy = terrH(gx);
  if (Math.random() < dt * 30 * k * smokeK) puff(gx - dir * w.r * .4, gy + .08, -car.vx * .25 + rnd(-.4, .4), .3 + rnd(0, .5), 1.2 + rnd(0, .8), .1 + .07 * k, Math.random() < .5 ? '#d9dcdf' : '#c6c9cc', 'smoke');
  if (Math.random() < dt * 4 * k * smokeK) spawnFX('dust', gx - dir * w.r * .8, gy + .02, .9 + k * .9, {ground:true, dur:.9, alpha:.7, vx:-car.vx * .15});
  // skid marks (broken into dashes with ABS)
  const last = SKID[SKID.length - 1]; if (!LOCK.abs || (LOCK.t % .07) < .042){ if (last && last.w === w && Math.abs(last.x1 - gx) < 1.5) last.x1 = gx; else SKID.push({w, x0:gx, x1:gx, y:gy, a:.5 * k}); } }
 if (SKID.length > 120) SKID.splice(0, SKID.length - 120); };
const _dw33 = drawWorld;
drawWorld = function(){ _dw33(); const [x0, x1] = viewX(); ctx.save(); ctx.lineCap = 'round'; for (const s of SKID){ if (s.x1 < x0 - 2 || s.x0 > x1 + 2) continue; ctx.strokeStyle = `rgba(18,18,20,${s.a})`; ctx.lineWidth = Math.max(2, PPM * .1); ctx.beginPath(); ctx.moveTo(sx(Math.min(s.x0, s.x1)), sy(terrH(s.x0)) + 1); ctx.lineTo(sx(Math.max(s.x0, s.x1)), sy(terrH(s.x1)) + 1); ctx.stroke(); } ctx.restore(); };
const _sr33 = startRoute;
startRoute = function(r, o){ _sr33(r, o); SKID.length = 0; LOCK = {on:false, t:0, abs:false}; };
/* squeal: harsher when locked, pulsing with ABS */
const _bs33 = brakeScreech;
brakeScreech = function(dt){ _bs33(dt); if (!SQ.n || !AU.ctx || !LOCK.on) return; const t = AU.ctx.currentTime, g = SQ.n.out.gain; if (LOCK.abs){ g.setTargetAtTime((LOCK.t % .07) < .042 ? .07 : .015, t, .008); } else g.setTargetAtTime(.1, t, .04); };

/* ======================= atlas-loader.js ======================= */
/* =====================================================================
   Ograaa — atlas loader: loads a handful of texture atlases and one audio
   sprite, then slices them into the same named images/sounds the game uses
   ===================================================================== */
"use strict";
(function(){
 const urls = {};
 for (const k in MANIFEST.files){ MANIFEST.files[k] = new URL(MANIFEST.files[k], document.baseURI).href; ASSETS[k] = MANIFEST.files[k]; }
 for (const a of MANIFEST.atlas) for (const k in a.f) Object.defineProperty(ASSETS, k, {enumerable:true, configurable:true, get(){ if (urls[k]) return urls[k]; const c = IMG[k]; if (!c || !c.width) return ''; try{ return urls[k] = c.toDataURL('image/webp', .92); }catch(e){ return ''; } }});
 loadImages = function(cb){ const files = Object.keys(MANIFEST.files).filter(k => k !== 'music'), total = MANIFEST.atlas.length + files.length; let n = 0; const tick = () => { n++; const b = $('#ldBar'); if (b) b.style.width = (n / total * 100) + '%'; if (n === total) cb(); };
  files.forEach(k => { const im = new Image(); im.onload = im.onerror = tick; im.src = MANIFEST.files[k]; IMG[k] = im; });
  MANIFEST.atlas.forEach(a => { const im = new Image(); im.onload = () => { for (const k in a.f){ const [x, y, w, h] = a.f[k], c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, x, y, w, h, 0, 0, w, h); IMG[k] = c; } tick(); }; im.onerror = tick; im.src = a.src; }); };
 SND.load = function(){ if (this.loading || !AU.ctx) return; this.loading = true; const x = new XMLHttpRequest(); x.open('GET', MANIFEST.sfx.src); x.responseType = 'arraybuffer';
  x.onload = () => AU.ctx.decodeAudioData(x.response).then(buf => { const sr = buf.sampleRate; for (const k in MANIFEST.sfx.f){ const [t0, d] = MANIFEST.sfx.f[k], s0 = Math.floor(t0 * sr), len = Math.floor(d * sr), b = AU.ctx.createBuffer(1, len, sr); b.copyToChannel(buf.getChannelData(0).subarray(s0, s0 + len), 0); this.buf[k] = b; } }).catch(e => console.warn('sfx', e)); x.send(); };
})();
