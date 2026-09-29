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
 e.wg.gain.setTargetAtTime(G.paused ? 0 : .16 * Math.pow(k, 1.4), t, .35); e.wf.frequency.setTargetAtTime(380 + k * 1500, t, .35); };
