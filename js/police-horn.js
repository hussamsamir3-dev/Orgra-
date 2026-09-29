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
