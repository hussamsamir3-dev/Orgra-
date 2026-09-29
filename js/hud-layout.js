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
