/* ============================================================
   Ogra online layer — Supabase
   ------------------------------------------------------------
   The device holds no authority over money. It reports events;
   the server replies with the true balance and the client adopts
   it. With no server reachable the game runs in practice mode,
   where nothing is banked.
   ============================================================ */
(function () {
  const SUPABASE_URL = 'https://zmbyrpiiqvfrmszvhvvh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_pTIK6OotwX1_23Xyy2sQfw_6GAJIu6K';
  const FN = SUPABASE_URL + '/functions/v1';

  const NET = window.OGRA_NET = {
    sb: null, online: false, practice: true, user: null, lastServer: null,

    /* ---------- boot ---------- */
    async init() {
      if (!window.supabase) return this.offline('supabase library missing');
      this.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      const { data } = await this.sb.auth.getSession();
      if (data && data.session) { this.user = data.session.user; await this.afterAuth(); }
      else this.gate(true);

      this.sb.auth.onAuthStateChange(async (evt, session) => {
        if (session && session.user) { this.user = session.user; await this.afterAuth(); }
        else { this.user = null; this.practice = true; this.online = false; this.gate(true); }
      });
    },

    async token(waitMs) {
      /* Supabase refreshes the session in the background. Asking for the token
         mid-refresh returns null, so give it a moment before giving up. */
      const deadline = Date.now() + (waitMs == null ? 4000 : waitMs);
      for (;;) {
        try {
          const { data } = await this.sb.auth.getSession();
          if (data && data.session && data.session.access_token)
            return data.session.access_token;
        } catch (e) {}
        if (Date.now() > deadline) return null;
        await new Promise(r => setTimeout(r, 250));
      }
    },

    async call(name, body) {
      const t = await this.token();
      if (!t) {
        this.lastError = 'not signed in (no session token)';
        console.error('[ogra]', name, this.lastError);
        return null;
      }
      try {
        const r = await fetch(FN + '/' + name, {
          method: 'POST',                       /* the functions are POST-only */
          headers: {
            'content-type': 'application/json',
            /* the gateway checks apikey; the function checks the user token */
            apikey: SUPABASE_KEY,
            authorization: 'Bearer ' + t
          },
          body: JSON.stringify(body === undefined ? {} : body)
        });
        const j = await r.json().catch(() => null);
        if (r.status === 403 && j && j.error === 'banned') { this.showBan(j); return null; }
        if (!r.ok) {
          this.lastError = 'HTTP ' + r.status + (j && j.error ? ' - ' + j.error : '')
            + (r.status === 404 ? '  (function "' + name + '" is not deployed)' : '');
          console.error('[ogra]', name, this.lastError);
          /* 400-499 means the server answered and said no. Hand that reason
             back so the player sees the real message, not "no response". */
          if (r.status >= 400 && r.status < 500 && j && j.error) return j;
          return null;
        }
        this.lastError = null;
        return j;
      } catch (e) {
        this.lastError = 'network: ' + (e && e.message || e);
        console.error('[ogra]', name, this.lastError);
        return null;
      }
    },

    /* ---------- signed in ---------- */
    async afterAuth() {
      const p = await this.call('sync', { local: {} });
      if (!p) { this.offline(this.lastError || 'could not reach the server'); return; }
      this.online = true; this.practice = false;
      /* the local watchdog is irrelevant now the server is in charge, and a
         ban it recorded earlier should not follow the player around */
      try { if (typeof AC !== 'undefined' && AC.clear) AC.clear(); } catch (e) {}
      this.adopt(p.player);
      this.applyVehicles(p.vehicles, p.local);
      this.gate(false);
      this.startSync();
    },

    /* the server's word replaces whatever the device thinks */
    adopt(sp) {
      if (!sp) return;
      this.lastServer = sp;
      this.adopting = true;            /* the seal lets the server's own figures through */
      try {
        const s = S();
        s.cash = sp.cash; s.xp = sp.xp; s.lvl = sp.level;
        if (sp.licence) s.lic = {
          cls: sp.licence.cls,
          exp: sp.licence.exp ? Math.floor(new Date(sp.licence.exp).getTime() / 86400000) : 0,
          pts: sp.licence.pts || 0, issued: Date.now()
        };
        if (typeof UI !== 'undefined' && UI.refresh) UI.refresh();
      } catch (e) {}
      this.adopting = false;
    },

    applyVehicles(list, local) {
      try {
        const s = S();
        if (Array.isArray(list) && list.length) {
          s.owned = {};
          list.forEach(v => {
            const cos = v.cosmetics || {};
            const row = Object.assign({ id: v.id, fuel: v.fuel, cond: v.cond || {},
              up: v.upgrades || {}, stk: cos.stk || [], parts: {} }, cos);
            /* rims are one object in the game, two fields on the server */
            if (cos.rimT || cos.rimC) row.rim = { t: cos.rimT, c: cos.rimC };
            s.owned[v.id] = row;
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
      const res = await this.call('trip', t);
      if (res && res.player) this.adopt(res.player);
      return res;
    },

    async buy(kind, data) {
      if (this.practice) return { error: 'practice' };
      const res = await this.call('purchase', Object.assign({ kind }, data));
      if (res && res.ok) {
        /* a purchase can change the licence, the vehicle list or its fuel -
           not just the balance - so pull the whole picture back */
        const full = await this.call('sync', { local: {} });
        if (full) { this.adopt(full.player); this.applyVehicles(full.vehicles, full.local); }
        else if (res.cash != null) this.adopt(Object.assign({}, this.lastServer, { cash: res.cash }));
        try { if (typeof UI !== 'undefined' && UI.refresh) UI.refresh(); } catch (e) {}
      }
      return res;
    },

    startSync() {
      clearInterval(this._t);
      this._t = setInterval(async () => {
        if (this.practice) return;
        let local = {};
        try { const s = S(); local = { set: s.set, avatar: s.avatar, name: s.name }; } catch (e) {}
        const res = await this.call('sync', { local });
        if (res && res.player) this.adopt(res.player);
      }, 30000);
    },

    /* ---------- auth actions ---------- */
    async signIn(email, pass, note) {
      const { error } = await this.sb.auth.signInWithPassword({ email, password: pass });
      if (error) note(error.message);
    },
    async signUp(email, pass, note) {
      const ar = (typeof LANG !== 'undefined' && LANG.cur === 'ar');
      const { error } = await this.sb.auth.signUp({ email, password: pass });
      if (error) note(error.message);
      else note(ar ? 'بعتنالك إيميل تأكيد — افتحه وبعدين سجّل دخول.'
                   : 'Check your email to confirm, then sign in.', true);
    },
    signOut() { if (this.sb) this.sb.auth.signOut(); },

    /* ---------- screens ---------- */
    offline(why) {
      this.online = false; this.practice = true;
      console.warn('[ogra] offline:', why);
      this.gate(true, why);
    },

    gate(show, note) {
      let el = document.getElementById('ogGate');
      if (!show) { if (el) el.remove(); return; }
      /* Once dismissed it must never come back mid-session: it covers the
         whole screen and silently swallows every click underneath. */
      try { if (sessionStorage.getItem('ogra_gate_dismissed')) return; } catch (e) {}
      if (el) return;
      const ar = (typeof LANG !== 'undefined' && LANG.cur === 'ar');
      el = document.createElement('div');
      el.id = 'ogGate';
      el.innerHTML = `
        <div class="gateCard">
          <div class="gateLogo">OGRA <span>أجرة</span></div>
          <p class="gateMsg">${ar ? 'سجّل دخولك عشان رصيدك ومستواك يتحفظوا'
                                  : 'Sign in so your balance and progress are saved'}</p>
          <input class="gateIn" id="ogEmail" type="email" autocomplete="email"
                 placeholder="${ar ? 'الإيميل' : 'Email'}">
          <input class="gateIn" id="ogPass" type="password" autocomplete="current-password"
                 placeholder="${ar ? 'كلمة السر' : 'Password'}">
          <button class="gateBtn" data-go="in">${ar ? 'دخول' : 'Sign in'}</button>
          <button class="gateBtn ghost" data-go="up">${ar ? 'حساب جديد' : 'Create account'}</button>
          <button class="gateBtn link" data-go="practice">${ar ? 'العب من غير حساب' : 'Play offline'}</button>
          <div class="gateNote" id="ogNote">${note || ''}</div>
          <div class="gateNote small">${ar
            ? 'في وضع اللعب بدون حساب، الفلوس والمستوى مش هيتحفظوا.'
            : 'Offline play does not bank money or progress.'}</div>
        </div>`;
      document.body.appendChild(el);

      const note2 = (m, ok) => {
        const n = document.getElementById('ogNote');
        if (n) { n.textContent = m; n.className = 'gateNote' + (ok ? ' ok' : ' bad'); }
      };
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-go]'); if (!b) return;
        const email = (document.getElementById('ogEmail') || {}).value || '';
        const pass  = (document.getElementById('ogPass')  || {}).value || '';
        if (b.dataset.go === 'practice') { this.practice = true; el.remove();
          try { sessionStorage.setItem('ogra_gate_dismissed', '1'); } catch (e) {}
          return; }
        if (!email || !pass) return note2(ar ? 'اكتب الإيميل وكلمة السر' : 'Enter email and password');
        if (b.dataset.go === 'in') this.signIn(email, pass, note2);
        else this.signUp(email, pass, note2);
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
    background:rgba(6,9,15,.95);backdrop-filter:blur(8px);
    font-family:Cairo,system-ui,sans-serif;color:#e8eef8;padding:5vw;overflow:auto}
  .gateCard{max-width:min(92vw,400px);width:100%;text-align:center;background:rgba(16,25,42,.92);
    border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:26px 20px}
  .gateLogo{font-weight:900;font-style:italic;font-size:36px;letter-spacing:.02em;
    background:linear-gradient(180deg,#fff,#ffd98a 60%,#ffb627);-webkit-background-clip:text;
    background-clip:text;color:transparent}
  .gateLogo span{font-style:normal;font-size:22px;-webkit-text-fill-color:#ffd98a}
  .gateMsg{color:#cfd8e6;line-height:1.6;margin:12px 0 16px;font-weight:700;font-size:15px}
  .gateIn{display:block;width:100%;margin:8px 0;padding:12px 14px;border-radius:12px;
    border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);
    color:#e8eef8;font:inherit;font-size:15px}
  .gateIn::placeholder{color:#7c8798}
  .gateBtn{display:block;width:100%;margin:8px 0;padding:13px 16px;border:0;border-radius:13px;
    font:inherit;font-weight:900;cursor:pointer;
    background:linear-gradient(180deg,#ffd98a,#ffb627);color:#161208}
  .gateBtn.ghost{background:rgba(255,255,255,.06);color:#e8eef8;border:1px solid rgba(255,255,255,.14)}
  .gateBtn.link{background:none;color:#8e9bb0;font-weight:700;text-decoration:underline}
  .gateNote{margin-top:10px;color:#93a1b6;font-size:13px;line-height:1.55;min-height:1em}
  .gateNote.bad{color:#ff9d9d} .gateNote.ok{color:#8ef0b0}
  .gateNote.small{font-size:12px;opacity:.75}
  </style>`);

  /* online mode only when actually served over http(s) */
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    /* Put the gate up at once so a new player signs in before the menu is
       ever visible, rather than seeing it and being interrupted. */
    document.addEventListener('DOMContentLoaded', () => {
      try { if (!NET.user) NET.gate(true); } catch (e) {}
    });
    window.addEventListener('load', () => NET.init());
  } else {
    console.log('[ogra] file:// — offline practice mode');
    NET.practice = true;
  }
})();
