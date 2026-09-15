/* ============================================================
   Ogra online layer
   ------------------------------------------------------------
   The device holds no authority over money. It reports events;
   the server replies with the true balance and the client adopts
   it. If the server is unreachable the game runs in practice
   mode, where nothing is banked.
   ============================================================ */
(function () {
  const API = '/.netlify/functions';

  const NET = window.OGRA_NET = {
    online: false,
    user: null,
    economy: null,
    lastServer: null,      // last authoritative figures
    practice: true,        // true until a session is confirmed

    /* ---------- identity ---------- */
    async init() {
      if (!window.netlifyIdentity) return this.offline('identity script missing');
      netlifyIdentity.on('init', u => { this.user = u; this.afterAuth(); });
      netlifyIdentity.on('login', u => { this.user = u; netlifyIdentity.close(); this.afterAuth(); });
      netlifyIdentity.on('logout', () => { this.user = null; this.practice = true; this.gate(true); });
      netlifyIdentity.init();
    },

    login()  { if (window.netlifyIdentity) netlifyIdentity.open('login'); },
    signup() { if (window.netlifyIdentity) netlifyIdentity.open('signup'); },
    logout() { if (window.netlifyIdentity) netlifyIdentity.logout(); },

    async token() {
      if (!this.user) return null;
      try { return await this.user.jwt(); } catch (e) { return null; }
    },

    async call(path, body) {
      const t = await this.token();
      if (!t) return null;
      try {
        const r = await fetch(API + path, {
          method: body ? 'POST' : 'GET',
          headers: { 'content-type': 'application/json', authorization: 'Bearer ' + t },
          body: body ? JSON.stringify(body) : undefined
        });
        if (r.status === 403) {
          const j = await r.json().catch(() => ({}));
          if (j.error === 'banned') { this.showBan(j); return null; }
        }
        if (!r.ok) return null;
        return await r.json();
      } catch (e) { return null; }
    },

    /* ---------- once signed in ---------- */
    async afterAuth() {
      if (!this.user) { this.gate(true); return; }
      const p = await this.call('/profile');
      if (!p) { this.offline('could not reach the server'); return; }
      this.online = true; this.practice = false;
      this.economy = p.economy;
      this.adopt(p.player);
      this.applyVehicles(p.vehicles, p.local);
      this.gate(false);
      this.startSync();
    },

    /* the server's word replaces whatever is on the device */
    adopt(sp) {
      if (!sp) return;
      this.lastServer = sp;
      try {
        const s = S();
        s.cash = sp.cash; s.xp = sp.xp; s.lvl = sp.level;
        if (sp.licence) s.lic = { cls: sp.licence.cls, exp: sp.licence.exp
          ? Math.floor(new Date(sp.licence.exp).getTime() / 86400000) : 0,
          pts: sp.licence.pts || 0, issued: Date.now() };
        if (typeof UI !== 'undefined' && UI.refresh) UI.refresh();
      } catch (e) {}
    },

    applyVehicles(list, local) {
      try {
        const s = S();
        if (Array.isArray(list) && list.length) {
          s.owned = {};
          list.forEach(v => {
            s.owned[v.id] = Object.assign({ id: v.id, fuel: v.fuel, cond: v.cond || {},
              up: v.upgrades || {}, stk: [], parts: {} }, v.cosmetics || {});
            if (v.current) s.cur.line = v.id;
          });
        }
        if (local && typeof local === 'object') {
          if (local.set) s.set = Object.assign(s.set, local.set);
          if (local.avatar) s.avatar = local.avatar;
          if (local.name) s.name = local.name;
        }
      } catch (e) {}
    },

    /* ---------- reporting ---------- */
    async reportTrip(t) {
      if (this.practice) return null;
      const res = await this.call('/trip', t);
      if (res && res.player) this.adopt(res.player);
      return res;
    },

    async buy(kind, data) {
      if (this.practice) return { error: 'practice' };
      const res = await this.call('/purchase', Object.assign({ kind }, data));
      if (res && res.cash != null) this.adopt(Object.assign({}, this.lastServer, { cash: res.cash }));
      return res;
    },

    startSync() {
      clearInterval(this._t);
      this._t = setInterval(async () => {
        if (this.practice) return;
        let local = {};
        try { const s = S(); local = { set: s.set, avatar: s.avatar, name: s.name }; } catch (e) {}
        const res = await this.call('/sync', { local });
        if (res && res.player) this.adopt(res.player);
      }, 30000);                      /* 30s keeps well inside the free request budget */
    },

    /* ---------- screens ---------- */
    offline(why) {
      this.online = false; this.practice = true;
      console.warn('[ogra] offline:', why);
      this.gate(true, why);
    },

    gate(show, note) {
      let el = document.getElementById('ogGate');
      if (!show) { if (el) el.remove(); return; }
      if (el) return;
      el = document.createElement('div');
      el.id = 'ogGate';
      el.innerHTML = `
        <div class="gateCard">
          <div class="gateLogo">OGRA <span>أجرة</span></div>
          <p class="gateMsg">سجّل دخولك عشان رصيدك ومستواك يتحفظوا<br>
             <small>Sign in so your balance and progress are saved</small></p>
          <button class="gateBtn" data-go="login">تسجيل الدخول · Sign in</button>
          <button class="gateBtn ghost" data-go="signup">حساب جديد · Create account</button>
          <button class="gateBtn link" data-go="practice">العب من غير حساب · Play offline</button>
          ${note ? `<div class="gateNote">${note}</div>` : ''}
          <div class="gateNote small">في وضع اللعب بدون حساب، الفلوس والمستوى مش هيتحفظوا.<br>
            <small>Offline play does not bank money or progress.</small></div>
        </div>`;
      document.body.appendChild(el);
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-go]'); if (!b) return;
        const go = b.dataset.go;
        if (go === 'login') this.login();
        else if (go === 'signup') this.signup();
        else { this.practice = true; el.remove(); }
      });
    },

    showBan(j) {
      const mins = j.until ? Math.max(0, Math.ceil((new Date(j.until) - Date.now()) / 60000)) : 60;
      let el = document.getElementById('ogBan');
      if (!el) { el = document.createElement('div'); el.id = 'ogBan'; document.body.appendChild(el); }
      el.innerHTML = `<div class="gateCard">
        <div class="gateLogo" style="color:#ff6b6b">⛔ الحساب موقوف</div>
        <p class="gateMsg">${j.reason || 'نشاط غير طبيعي'}<br>
          <small>Account suspended — ${j.reason || 'irregular activity'}</small></p>
        <div class="gateNote">فاضل ${mins} دقيقة · ${mins} minutes remaining</div></div>`;
    }
  };

  document.head.insertAdjacentHTML('beforeend', `<style>
  #ogGate,#ogBan{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;
    background:rgba(6,9,15,.94);backdrop-filter:blur(8px);
    font-family:Cairo,system-ui,sans-serif;color:#e8eef8;padding:6vw}
  .gateCard{max-width:min(92vw,420px);text-align:center;background:rgba(16,25,42,.9);
    border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:28px 22px}
  .gateLogo{font-weight:900;font-style:italic;font-size:38px;letter-spacing:.02em;
    background:linear-gradient(180deg,#fff,#ffd98a 60%,#ffb627);-webkit-background-clip:text;
    background-clip:text;color:transparent}
  .gateLogo span{font-style:normal;font-size:24px;-webkit-text-fill-color:#ffd98a}
  .gateMsg{color:#cfd8e6;line-height:1.7;margin:14px 0 18px;font-weight:700}
  .gateMsg small{color:#8e9bb0;font-weight:600}
  .gateBtn{display:block;width:100%;margin:8px 0;padding:13px 16px;border:0;border-radius:14px;
    font:inherit;font-weight:900;cursor:pointer;
    background:linear-gradient(180deg,#ffd98a,#ffb627);color:#161208}
  .gateBtn.ghost{background:rgba(255,255,255,.06);color:#e8eef8;border:1px solid rgba(255,255,255,.14)}
  .gateBtn.link{background:none;color:#8e9bb0;font-weight:700;text-decoration:underline}
  .gateNote{margin-top:12px;color:#93a1b6;font-size:13px;line-height:1.6}
  .gateNote.small{font-size:12px;opacity:.8}
  </style>`);

  /* only engage online mode when actually served over http(s) */
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    window.addEventListener('load', () => NET.init());
  } else {
    console.log('[ogra] file:// — offline practice mode');
    NET.practice = true;
  }
})();
