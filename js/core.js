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
