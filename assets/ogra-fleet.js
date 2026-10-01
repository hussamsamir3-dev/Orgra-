/* =====================================================================
   OGRA — new fleet, particle effects and handling tuning
   · 19 vehicles added with measured wheel positions, so the wheels turn
     about their true centres
   · dust, smoke, spray, sparks and debris for punctures and crashes
   · fewer punctures, softer and longer suspension travel, double the fuel
     burn, quieter air conditioning
   ===================================================================== */
(() => {
  'use strict';
  const FLEET_URL = 'assets/fleet/fleet.json';

  /* ---------- 1. the new vehicles ---------- */
  /* category, seats, price and level, keyed to the artwork filenames */
  const SPEC = {
    v_suzuki_van:   {cat:'micro',   cls:'micro',   seats:7,  stand:0, price:95000,   lvl:1,  yr:2019, ac:false, mass:1150, tank:40},
    v_foton_c2:     {cat:'micro',   cls:'micro',   seats:8,  stand:0, price:120000,  lvl:1,  yr:2022, ac:true,  mass:1450, tank:45},
    v_joylong_a4:   {cat:'micro',   cls:'micro',   seats:11, stand:0, price:180000,  lvl:2,  yr:2021, ac:true,  mass:1750, tank:50},
    v_joylong_a5:   {cat:'micro',   cls:'micro',   seats:14, stand:2, price:230000,  lvl:3,  yr:2022, ac:true,  mass:1950, tank:55},
    v_hiace:        {cat:'micro',   cls:'micro',   seats:14, stand:3, price:250000,  lvl:3,  yr:2020, ac:true,  mass:2100, tank:70},
    v_kinglong_wide:{cat:'micro',   cls:'micro',   seats:16, stand:4, price:300000,  lvl:4,  yr:2023, ac:true,  mass:2400, tank:75},
    v_gd_6532:      {cat:'minibus', cls:'minibus', seats:18, stand:5, price:420000,  lvl:5,  yr:2023, ac:true,  mass:3400, tank:90},
    v_coaster:      {cat:'minibus', cls:'minibus', seats:26, stand:6, price:560000,  lvl:7,  yr:2021, ac:true,  mass:4200, tank:95},
    v_foton_view:   {cat:'minibus', cls:'minibus', seats:22, stand:5, price:470000,  lvl:6,  yr:2022, ac:true,  mass:3800, tank:90},
    v_kl_6600:      {cat:'minibus', cls:'minibus', seats:24, stand:6, price:520000,  lvl:7,  yr:2024, ac:true,  mass:4000, tank:95},
    v_joylong_a6:   {cat:'minibus', cls:'minibus', seats:20, stand:4, price:450000,  lvl:6,  yr:2023, ac:true,  mass:3600, tank:90},
    v_isuzu_npr:    {cat:'minibus', cls:'minibus', seats:28, stand:8, price:640000,  lvl:8,  yr:2022, ac:true,  mass:5200, tank:110},
    v_rosa:         {cat:'minibus', cls:'minibus', seats:26, stand:6, price:590000,  lvl:8,  yr:2021, ac:true,  mass:4600, tank:100},
    v_higer_6720:   {cat:'minibus', cls:'minibus', seats:29, stand:8, price:700000,  lvl:9,  yr:2023, ac:true,  mass:5400, tank:120},
    v_yutong_6770:  {cat:'minibus', cls:'minibus', seats:30, stand:8, price:760000,  lvl:10, yr:2023, ac:true,  mass:5600, tank:120},
    v_kl_6127:      {cat:'bus',     cls:'city',    seats:36, stand:24,price:1450000, lvl:13, yr:2022, ac:true,  mass:12500, tank:220},
    v_gd_6125:      {cat:'bus',     cls:'coach',   seats:49, stand:0, price:1750000, lvl:15, yr:2024, ac:true,  mass:13500, tank:280},
    v_yutong_6128:  {cat:'bus',     cls:'coach',   seats:51, stand:0, price:2100000, lvl:17, yr:2024, ac:true,  mass:14000, tank:300},
    v_tourismo:     {cat:'bus',     cls:'coach',   seats:53, stand:0, price:3200000, lvl:20, yr:2025, ac:true,  mass:15200, tank:340}
  };

  async function addFleet(){
    try {
      if (typeof VEH === 'undefined' || typeof ASSETS === 'undefined') return false;
      if (window.__ogFleet) return true;
      const meta = await (await fetch(FLEET_URL)).json();
      let added = 0;
      for (const id in meta) {
        const m = meta[id], sp = SPEC[id];
        if (!sp || VEH.some(v => v.id === id)) continue;
        const w = m.wheels || [];
        const rear = w[0] || {x:.21, y:.82, r:.16}, front = w[1] || {x:.785, y:.82, r:.16};
        const L = m.L;                                   /* real length in metres */
        const pxPerM = m.w / L;
        const H = m.h / pxPerM;                          /* height in metres, from the same scale */
        const wb = Math.abs(front.x - rear.x)*L;         /* wheelbase, measured off the artwork */
        const wr = ((front.r + rear.r)/2)*m.h/pxPerM;    /* wheel radius in metres */

        /* the drawing record: the wheels sit where the photograph puts them */
        ASSETS.veh[id] = {
          key:id, d:m.file, w:m.w, h:m.h, L, H, wb, wr,
          axles:[{x:rear.x, y:rear.y, r:rear.r}, {x:front.x, y:front.y, r:front.r}],
          win:[0.30, 0.16, 0.42, 0.30]
        };
        VEH.push({
          id, cat:sp.cat, cls:sp.cls,
          n:{en:m.label, ar:m.label},
          yr:sp.yr, price:sp.price, lvl:sp.lvl,
          seats:sp.seats, stand:sp.stand, style:sp.cat === 'bus' ? 'coach' : sp.cat,
          L, H, wb, wr, mass:sp.mass, tank:sp.tank,
          paint:'#f4f4f4', fuel:sp.cat === 'micro' ? 'petrol' : 'diesel',
          ac:sp.ac, art:m.file
        });
        added++;
      }
      window.__ogFleet = true;
      if (added && typeof UI !== 'undefined' && UI.refresh) UI.refresh();
      return true;
    } catch(e) { return false; }
  }
  addFleet(); setTimeout(addFleet, 2500); setTimeout(addFleet, 6000);

  /* ---------- 2. particles ---------- */
  const FX = {
    dust:  {n:4, life:1.5, rise:-0.6, grow:2.4, alpha:.85},
    smoke: {n:6, life:2.6, rise:-1.5, grow:3.0, alpha:.8},
    splash:{n:4, life:0.9, rise:-1.2, grow:1.6, alpha:.9},
    spark: {n:6, life:0.7, rise:-0.2, grow:1.2, alpha:1},
    cloud: {n:4, life:3.2, rise:-1.0, grow:3.4, alpha:.6},
    debris:{n:5, life:1.8, rise:0,    grow:1.0, alpha:1}
  };
  const IMG = {};
  function frame(kind, i){
    const k = kind + '_' + i;
    let im = IMG[k];
    if (!im) { im = IMG[k] = new Image(); im.src = 'assets/fx/' + k + '.webp'; }
    return (im.complete && im.naturalWidth) ? im : null;
  }
  const live = [];
  function emit(kind, x, y, opt){
    const f = FX[kind]; if (!f) return;
    const o = opt || {};
    live.push({kind, x, y, t:0, life:(o.life || f.life), size:(o.size || 1.6),
               vx:(o.vx || 0), vy:(o.vy != null ? o.vy : f.rise), rot:(Math.random()-.5)*0.6});
    if (live.length > 90) live.shift();
  }
  window.OG_fx = emit;

  function drawFX(G, dt){
    const c = RD.ctx, P = RD.PPM;
    for (let i = live.length - 1; i >= 0; i--) {
      const p = live[i], f = FX[p.kind];
      p.t += dt;
      if (p.t >= p.life) { live.splice(i, 1); continue; }
      const k = p.t/p.life;
      p.x += p.vx*dt; p.y += p.vy*dt;
      const idx = Math.min(f.n - 1, Math.floor(k*f.n));
      const im = frame(p.kind, idx); if (!im) continue;
      const scale = p.size*(1 + k*(f.grow - 1));
      const w = scale*P, h = w*(im.naturalHeight/im.naturalWidth);
      const sx = RD.sx(p.x), sy = RD.sy(G.world.h(p.x), -0.2) - p.y*P;
      if (sx < -300 || sx > RD.W + 300) continue;
      c.save();
      c.globalAlpha = f.alpha*(1 - k*k);
      c.translate(sx, sy); c.rotate(p.rot*k);
      c.drawImage(im, -w/2, -h, w, h);
      c.restore();
    }
  }

  /* where the effects belong */
  function hooks(G){
    if (!G || G.__fxHooked) return; G.__fxHooked = true;
    const car = () => G.car;

    /* a puncture: rubber smoke and dust at that corner, then debris */
    const oldFlat = G.onFlat;
    G.onFlat = function(which){
      try {
        const c = car(), L = c.spec ? c.spec.L : 5;
        const x = c.x + (which === 'front' ? L*0.35 : -L*0.35);
        OG_fx('smoke', x, 0.25, {size:1.2, life:2.2, vx:-Math.abs(c.vx)*0.15});
        OG_fx('dust',  x, 0.1,  {size:1.6, life:1.4});
        OG_fx('debris',x, 0.2,  {size:0.7, life:1.6, vx:-Math.abs(c.vx)*0.3, vy:1.2});
      } catch(e) {}
      return oldFlat ? oldFlat.apply(this, arguments) : undefined;
    };

    /* a crash: sparks at the point of contact, smoke and a cloud after it */
    const oldCrash = G.onCrash;
    G.onCrash = function(o, E, side, rel){
      try {
        const c = car(), L = c.spec ? c.spec.L : 5;
        const hit = c.x + (side === 'rear' ? -L*0.5 : L*0.5);
        const hard = Math.min(1, (E || 0)/((c.m || 3000)*60));
        OG_fx('spark', hit, 0.8, {size:1.1 + hard, life:.7});
        OG_fx('debris', hit, 0.6, {size:.8, life:1.8, vx:(side === 'rear' ? 1 : -1)*3, vy:2.2});
        if (hard > .35) { OG_fx('smoke', hit, 0.9, {size:1.8 + hard*2, life:2.8}); }
        if (hard > .6)  { OG_fx('cloud', hit, 1.2, {size:2.6, life:3.2}); }
      } catch(e) {}
      return oldCrash ? oldCrash.apply(this, arguments) : undefined;
    };

    /* spray off the tyres in the wet, dust on a dry shoulder */
    let t = 0;
    G.__fxTick = dt => {
      t += dt; if (t < .12) return; t = 0;
      const c = car(); if (!c || Math.abs(c.vx) < 6) return;
      const wet = (G.weather === 'rain') ? 1 : 0;
      const off = Math.abs(c.lane || 0) > 1.0 ? 1 : 0;
      if (wet) OG_fx('splash', c.x - (c.spec ? c.spec.L*0.35 : 2), 0.05,
                     {size:.9, life:.7, vx:-c.vx*0.25, vy:.4});
      else if (off) OG_fx('dust', c.x - (c.spec ? c.spec.L*0.35 : 2), 0.05,
                     {size:1.1, life:1.2, vx:-c.vx*0.1});
    };
  }

  if (typeof RD !== 'undefined' && typeof renderScene === 'function') {
    const _r = renderScene;
    window.renderScene = renderScene = function(G){
      const out = _r.apply(this, arguments);
      try { const g = G || GAME.G; if (g && GAME.state === 'play') drawFX(g, Math.min(0.05, RD.dt || 0.016)); } catch(e) {}
      return out;
    };
  }

  /* ---------- 3. handling and running costs ---------- */
  if (typeof updateGame === 'function') {
    const _ug = updateGame;
    window.updateGame = updateGame = function(G, dt, inp){
      const out = _ug.apply(this, arguments);
      try {
        const d = Math.min(dt, .05);
        hooks(G); if (G.__fxTick) G.__fxTick(d);
        const c = G.car;
        if (c) {
          /* a bus rides softly — applied once per vehicle, never compounded */
          if (!c.__ogRide) {
            c.__ogRide = true;
            if (typeof c.susK === 'number') c.susK *= 0.62;          /* softer springs */
            if (typeof c.susC === 'number') c.susC *= 0.72;          /* less damping, so it floats */
            if (typeof c.susTravel === 'number') c.susTravel *= 1.45;
            if (typeof c.susZmax === 'number') c.susZmax *= 1.35;
            try {
              if (typeof RD !== 'undefined') {
                if (typeof RD.susZ === 'number' && !RD.__ogRide) { RD.susZ *= 1.3; }
                if (typeof RD.susTravel === 'number' && !RD.__ogRide) { RD.susTravel *= 1.4; }
                RD.__ogRide = true;
              }
            } catch(e) {}
          }
          /* twice the fuel burn: whatever was used this frame is charged again */
          if (c.__fuelLast != null && Number.isFinite(c.fuel)) {
            const used = c.__fuelLast - c.fuel;
            if (used > 0 && used < 1) c.fuel = Math.max(0, c.fuel - used);
          }
          c.__fuelLast = c.fuel;
        }
      } catch(e) {}
      return out;
    };
  }

  /* punctures: a quarter as often, and never on decent tyres */
  if (typeof GAME !== 'undefined') {
    setInterval(() => {
      try {
        const G = GAME.G; if (!G) return;
        if (G.flatRate != null) G.flatRate *= 0.25;
        if (typeof FEAT !== 'undefined' && FEAT.flat != null) FEAT.flat = Math.min(FEAT.flat, 0.05);
      } catch(e) {}
    }, 4000);
  }

  /* the air conditioning is half as loud */
  if (typeof AU !== 'undefined') {
    const half = () => {
      try {
        const pools = [AU.ac, AU.buses && AU.buses.ac, AU.fan, AU.buses && AU.buses.fan];
        pools.forEach(node => {
          if (!node || node.__halved) return;
          const g = node.gain && node.gain.gain ? node.gain.gain : (node.gain && typeof node.gain.value === 'number' ? node.gain : null);
          if (g && typeof g.value === 'number') { g.value = g.value*0.5; node.__halved = true; }
        });
        if (typeof AU.acVol === 'number' && !AU.__acHalved) { AU.acVol *= 0.5; AU.__acHalved = true; }
      } catch(e) {}
    };
    setInterval(half, 2000);
  }
})();
