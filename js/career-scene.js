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
