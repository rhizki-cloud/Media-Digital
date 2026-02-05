/* =========================================================
   SD SmartLearn — app.js (FINAL, rapi & stabil)
   - Login / guard halaman
   - Progress helper
   - FX (tap/correct/wrong + confetti + yay sound)
   - Level (Lv 1–10, XP)
   - Bimo mascot (muncul di semua halaman, clickable)
   - Music procedural (1 tombol saja: NAVBAR "Musik")
   ========================================================= */

   (function () {
    "use strict";
  
    // ---------- Keys (KONSISTEN) ----------
    const KEY_USER = "sd_name";
    const KEY_GRADE = "sd_grade";
    const KEY_ACTIVE_USER = "sd_user_active"; // id user aktif (berdasarkan nama)
  
    // ---------- Multi-user (1 device) ----------
    function userIdFromName(name) {
      return (name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") || "guest";
    }
  
    function setActiveUserIdFromName(name) {
      const id = userIdFromName(name);
      localStorage.setItem(KEY_ACTIVE_USER, id);
      return id;
    }
  
    function getActiveUserId() {
      const stored = (localStorage.getItem(KEY_ACTIVE_USER) || "").trim();
      if (stored) return stored;
  
      const name = (localStorage.getItem(KEY_USER) || "").trim();
      const id = userIdFromName(name);
      localStorage.setItem(KEY_ACTIVE_USER, id);
      return id;
    }
  
    function userKey(baseKey) {
      const uid = getActiveUserId();
      return `sd_user_${uid}_${baseKey}`;
    }
  
    // ---------- Helpers ----------
    function safeJSONParse(s, fallback) {
      try { return JSON.parse(s ?? ""); } catch { return fallback; }
    }
  
    function getProgress() {
      return safeJSONParse(localStorage.getItem(userKey("progress")), {}) || {};
    }
    function setProgress(p) {
      localStorage.setItem(userKey("progress"), JSON.stringify(p || {}));
    }
  
    // expose base early
    window.SDAPP = window.SDAPP || {};
    window.SDAPP.KEY_USER = KEY_USER;
    window.SDAPP.KEY_GRADE = KEY_GRADE;
    window.SDAPP.getProgress = getProgress;
    window.SDAPP.setProgress = setProgress;
    window.SDAPP.userKey = userKey;
    window.SDAPP.setActiveUserIdFromName = setActiveUserIdFromName;
    window.SDAPP.getActiveUserId = getActiveUserId;
  
    // ---------- Require login on non-index pages ----------
    function onIndexPage() {
      const p = (location.pathname.split("/").pop() || "").toLowerCase();
      return p === "" || p === "index.html";
    }
  
    function requireLogin() {
      const user = localStorage.getItem(KEY_USER);
      if (!user && !onIndexPage()) location.href = "index.html";
      return user || "";
    }
  
    // ---------- INDEX login ----------
    const form = document.getElementById("name-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("userName");
        const name = (input?.value || "").trim();
  
        if (!name) {
          window.Swal?.fire?.({ icon: "error", title: "Oops", text: "Nama tidak boleh kosong!" });
          return;
        }
  
        // set nama + set akun aktif
        localStorage.setItem(KEY_USER, name);
        setActiveUserIdFromName(name);
  
        // grade boleh global (device) atau per-user (kalau mau, bilang ya)
        if (!localStorage.getItem(KEY_GRADE)) localStorage.setItem(KEY_GRADE, "1");
  
        // init data PER USER (kalau belum ada)
        if (!localStorage.getItem(userKey("progress"))) localStorage.setItem(userKey("progress"), "{}");
        if (!localStorage.getItem(userKey("level"))) localStorage.setItem(userKey("level"), "1");
        if (!localStorage.getItem(userKey("xp"))) localStorage.setItem(userKey("xp"), "0");
        if (!localStorage.getItem(userKey("avatar"))) localStorage.setItem(userKey("avatar"), "😀");
        if (!localStorage.getItem(userKey("unlocked_skins"))) localStorage.setItem(userKey("unlocked_skins"), "[]");
        if (!localStorage.getItem(userKey("skin"))) localStorage.setItem(userKey("skin"), "default");
  
        location.href = "home.html";
      });
  
      // auto redirect if already logged in
      if (localStorage.getItem(KEY_USER)) location.href = "home.html";
      return;
    }

  // ---------- Other pages ----------
  const user = requireLogin();
// pastikan akun aktif sinkron dengan nama (untuk multi-user)
  if (user) window.SDAPP?.setActiveUserIdFromName?.(user);

  // Hello labels (optional)
  const helloUser = document.getElementById("helloUser");
  if (helloUser) helloUser.textContent = user ? `Halo, ${user}` : "Halo!";

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(KEY_USER);
      location.href = "index.html";
    });
  }

  // Grade select (optional)
  const gradeSelect = document.getElementById("gradeSelect");
  if (gradeSelect) {
    gradeSelect.value = localStorage.getItem(KEY_GRADE) || "1";
    gradeSelect.addEventListener("change", () => localStorage.setItem(KEY_GRADE, gradeSelect.value));
  }

  // Open subjects button (optional)
  const openSubjectsBtn = document.getElementById("openSubjectsBtn");
  if (openSubjectsBtn) {
    openSubjectsBtn.addEventListener("click", () => {
      const g = localStorage.getItem(KEY_GRADE) || "1";
      location.href = `subject.html?grade=${encodeURIComponent(g)}`;
    });
  }

  // ---------- Level system ----------
  const levelAPI = {
    xpPerLevel: 20, // lebih realistis (lebih lama naik)
    maxLevel: 10,

    getProgress() {
      const level = Number(localStorage.getItem(userKey("level")) || "1");
      const xp = Number(localStorage.getItem(userKey("xp")) || "0");
      const needXP = (level >= this.maxLevel) ? 0 : this.xpPerLevel;
      const inLevelXP = (level >= this.maxLevel) ? 0 : xp;
      const pct = (level >= this.maxLevel) ? 100 : Math.round((inLevelXP / Math.max(1, needXP)) * 100);
      return { level, xp, inLevelXP, needXP, pct };
    },

    addXP(n = 1, reason = "") {
      n = Number(n) || 0;
      if (n <= 0) return false;

      let level = Number(localStorage.getItem(userKey("level")) || "1");
      let xp = Number(localStorage.getItem(userKey("xp")) || "0");
      let leveled = false;

      while (n > 0 && level < this.maxLevel) {
        const need = this.xpPerLevel;
        const space = need - xp;
        const take = Math.min(space, n);
        xp += take;
        n -= take;

        if (xp >= need) {
          level += 1;
          xp = 0;
          leveled = true;
        }
      }

      localStorage.setItem(userKey("level"), String(level));
      localStorage.setItem(userKey("xp"), String(xp));

      if (leveled) window.SDAPP?.ui?.showLevelUp?.(level);
      return leveled;
    },

    getAvatar() {
      // avatar anak sederhana (emoji), bisa nanti diganti pilihan user
      const a = localStorage.getItem(userKey("avatar")) || "😀";
      return a;
    }
  };
  window.SDAPP.level = levelAPI;

  // ---------- UI helpers (Level Up animation) ----------
  window.SDAPP.ui = window.SDAPP.ui || {};
  window.SDAPP.ui.showLevelUp = function (newLevel) {
    // overlay kecil lucu
    const old = document.getElementById("lvUpOverlay");
    if (old) old.remove();

    const div = document.createElement("div");
    div.id = "lvUpOverlay";
    div.style.position = "fixed";
    div.style.inset = "0";
    div.style.display = "grid";
    div.style.placeItems = "center";
    div.style.background = "rgba(0,0,0,.25)";
    div.style.zIndex = "9999";

    div.innerHTML = `
      <div style="
        background:#fff;
        border-radius:24px;
        padding:18px 18px;
        width:min(360px,92vw);
        box-shadow:0 18px 60px rgba(0,0,0,.25);
        text-align:center;
        border:3px solid rgba(59,130,246,.35);
        font-family: Poppins, system-ui, -apple-system, sans-serif;
      ">
        <div style="font-size:44px; line-height:1">🎉</div>
        <div style="font-weight:900; font-size:22px; margin-top:6px;">Naik Level!</div>
        <div style="margin-top:4px; font-weight:800;">Sekarang Lv ${newLevel} 🏆</div>
        <div style="margin-top:10px; font-size:13px; opacity:.75;">Terus main & belajar ya 😄</div>
        <button id="lvUpOk" style="
          margin-top:12px;
          border:0;
          border-radius:999px;
          padding:10px 16px;
          font-weight:900;
          background: #3b82f6;
          color:#fff;
          cursor:pointer;
          width:100%;
        ">OK ✨</button>
      </div>
    `;
    document.body.appendChild(div);
    window.SDAPP?.fx?.yay?.();
    document.getElementById("lvUpOk")?.addEventListener("click", () => div.remove());
    setTimeout(() => div.remove(), 2600);
  };

  // ---------- Confetti ----------
  window.SDAPP.confetti = function (count = 70) {
    const colors = ["#4dabf7", "#51cf66", "#ffd43b", "#ff6b6b", "#845ef7", "#f783ac"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.position = "fixed";
      c.style.top = "-20px";
      c.style.left = (Math.random() * 100) + "vw";
      c.style.width = (6 + Math.random() * 10) + "px";
      c.style.height = (8 + Math.random() * 14) + "px";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.borderRadius = (2 + Math.random() * 6) + "px";
      c.style.opacity = String(0.75 + Math.random() * 0.25);
      c.style.transform = `translateX(${(-20 + Math.random() * 40).toFixed(0)}px) rotate(${Math.floor(Math.random() * 360)}deg)`;
      c.style.zIndex = "9999";
      c.style.pointerEvents = "none";

      const dur = 1100 + Math.random() * 1100;
      c.animate(
        [
          { transform: `translateY(-20px) translateX(0px) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(${innerHeight + 40}px) translateX(${(-80 + Math.random() * 160).toFixed(0)}px) rotate(${(720 + Math.random() * 720).toFixed(0)}deg)`, opacity: 0.9 }
        ],
        { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)" }
      );

      document.body.appendChild(c);
      setTimeout(() => c.remove(), dur + 100);
    }
  };

  // ---------- WebAudio small "yay" ----------
  function playYay() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = window.__sd_audioctx || (window.__sd_audioctx = new AudioCtx());
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      master.connect(ctx.destination);

      const chirp = (t0, f0, f1, dur) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(f0, t0);
        o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.9, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.02);
      };

      chirp(now + 0.00, 520, 900, 0.18);
      chirp(now + 0.20, 620, 1200, 0.25);
    } catch { /* ignore */ }
  }

  // ---------- SFX ----------
  (function initFX() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master = null, sfxGain = null;

    function ensure() {
      if (!AudioCtx) return false;
      if (!ctx) {
        ctx = window.__sd_audioctx || (window.__sd_audioctx = new AudioCtx());
        master = ctx.createGain();
        sfxGain = ctx.createGain();
        master.gain.value = 0.9;
        sfxGain.gain.value = 0.9;
        sfxGain.connect(master);
        master.connect(ctx.destination);
      }
      return true;
    }

    function beep(freq = 600, dur = 0.08, type = "triangle", gain = 0.12) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(sfxGain);
      o.start(t); o.stop(t + dur + 0.02);
    }

    function noisePop(dur = 0.09, gain = 0.08) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(g); g.connect(sfxGain);
      src.start(t); src.stop(t + dur + 0.01);
    }

    window.SDAPP.fx = window.SDAPP.fx || {};
    window.SDAPP.fx.tap = () => { beep(520, 0.05, "triangle", 0.07); };
    window.SDAPP.fx.correct = () => { beep(660, 0.06, "triangle", 0.10); beep(880, 0.08, "sine", 0.09); };
    window.SDAPP.fx.wrong = () => { beep(220, 0.10, "square", 0.08); noisePop(0.10, 0.06); };

    window.SDAPP.fx.yay = () => {
      playYay();
      window.SDAPP.confetti?.(90);
    };
  })();

  // ---------- Mascot (Bimo) ----------
  function moodEmoji(m) {
    if (m === "proud") return "😎";
    if (m === "thinking") return "🤔";
    if (m === "oops") return "😅";
    if (m === "wow") return "😮";
    return "😄";
  }

  window.SDAPP.mascot = window.SDAPP.mascot || {
    say(msg, mood = "happy") {
      const t = document.getElementById("bimoTxt");
      const moodEl = document.getElementById("bimoMood");
      if (t) t.textContent = String(msg || "");
      if (moodEl) moodEl.textContent = moodEmoji(mood);

      const m = document.getElementById("bimoMascot");
      if (m) {
        m.classList.remove("bounce");
        void m.offsetWidth;
        m.classList.add("bounce");
        setTimeout(() => m.classList.remove("bounce"), 900);
      }
    },
    tip() {
      const tips = [
        "Baca materinya dulu ya 📘",
        "Kalau salah gak apa-apa, ulangi lagi 🔁",
        "Istirahat sebentar kalau capek 😴",
        "Main game juga boleh, tapi tetap belajar ya 🎮✨"
      ];
      this.say(tips[Math.floor(Math.random() * tips.length)], "thinking");
    },
    cheer() {
      this.say("Yeay! Kamu hebat banget! ⭐🎉", "proud");
      window.SDAPP.fx?.yay?.();
    },
    joke() {
      const jokes = [
        "Kenapa pensil senyum? Karena ada penghapusnya 😆✏️",
        "Belajar itu kayak main game—naik level! 🎮✨",
        "Aku robot tapi aku suka baca buku 🤖📖"
      ];
      this.say(jokes[Math.floor(Math.random() * jokes.length)], "happy");
    },
    mission() {
      const g = localStorage.getItem(KEY_GRADE) || "1";
      const prog = getProgress();
      const list = window.SD_CONTENT?.subjectsByGrade?.[g] || [];
      const next = list.find(s => !prog[`${g}_${s}`]) || list[0] || "Mapel";
      this.say(`🎯 Misi hari ini: Selesaikan ${next}!`, "wow");
    }
  };

  function initBimo() {
    if (document.getElementById("bimoWrap")) return;

    const page = ((location.pathname.split("/").pop() || "index.html") + "").toLowerCase();
    const name = localStorage.getItem(KEY_USER) || "";
    const grade = localStorage.getItem(KEY_GRADE) || "1";

    const wrap = document.createElement("div");
    wrap.id = "bimoWrap";
    wrap.style.position = "fixed";
    wrap.style.right = "18px";
    wrap.style.bottom = "16px";
    wrap.style.zIndex = "9998";

    wrap.innerHTML = `
      <div id="bimoBubble" style="
        display:none;
        width:min(320px,86vw);
        background:#fff;
        border-radius:22px;
        padding:14px 14px;
        box-shadow:0 18px 60px rgba(0,0,0,.18);
        border:2px solid rgba(59,130,246,.25);
        margin-bottom:10px;
        font-family:Poppins,system-ui,-apple-system,sans-serif;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="font-weight:900;">Iky 🤖✨ <span id="bimoMood" style="margin-left:6px;">😄</span></div>
          <button id="bimoClose" type="button" style="
            border:0; background:#f1f5f9; border-radius:999px;
            width:36px; height:36px; font-weight:900; cursor:pointer;
          ">×</button>
        </div>
        <div id="bimoTxt" style="margin-top:10px; font-weight:700; line-height:1.35;">
          Halo! Ayo belajar bareng Iky 😄
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">
          <button type="button" id="bimoTip" class="bimoBtn">💡 Tips</button>
          <button type="button" id="bimoCheer" class="bimoBtn">🎉 Semangat</button>
          <button type="button" id="bimoJoke" class="bimoBtn">😆 Lucu</button>
          <button type="button" id="bimoQuest" class="bimoBtn">🎯 Misi</button>
          <button type="button" id="bimoGo" class="bimoBtn">📚 Ke Mapel</button>
        </div>
      </div>

      <button id="bimoMascot" type="button" title="Klik Iky"
        style="
          width:76px; height:76px; border-radius:22px;
          border:0;
          background: linear-gradient(135deg, rgba(59,130,246,.18), rgba(99,102,241,.16));
          box-shadow:0 18px 45px rgba(0,0,0,.18);
          cursor:pointer;
          display:grid; place-items:center;
        ">
        <img src="aset/bimo-happy.svg" alt="Bimo" style="width:60px; height:60px;" onerror="this.style.display='none'; this.parentElement.textContent='🤖'; this.parentElement.style.fontSize='40px'">
      </button>
    `;

    // add minimal styles for bimo buttons + animation
    const styleId = "bimoInlineStyle";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `
        .bimoBtn{
          border:2px solid rgba(59,130,246,.25);
          background:#fff;
          border-radius:999px;
          padding:8px 12px;
          font-weight:900;
          cursor:pointer;
        }
        #bimoMascot.bounce{ animation:bimoBounce .8s ease; }
        @keyframes bimoBounce{ 0%{transform:translateY(0)} 30%{transform:translateY(-10px)} 60%{transform:translateY(0)} 100%{transform:translateY(0)} }
      `;
      document.head.appendChild(st);
    }

    document.body.appendChild(wrap);

    const bubble = document.getElementById("bimoBubble");
    const mascotBtn = document.getElementById("bimoMascot");
    const closeBtn = document.getElementById("bimoClose");

    function openBubble() {
      if (!bubble) return;
      bubble.style.display = "";
      window.SDAPP.fx?.tap?.();
    }
    function closeBubble() {
      if (!bubble) return;
      bubble.style.display = "none";
      window.SDAPP.fx?.tap?.();
    }
    function toggleBubble() {
      if (!bubble) return;
      const show = bubble.style.display === "none" || bubble.style.display === "";
      // if currently none -> open, else close
      if (bubble.style.display === "none" || bubble.style.display === "") {
        // initial state could be "" (unset). We treat "" as open only if visible.
      }
      const isHidden = false;
      // simplest:
      if (bubble.style.display === "none") openBubble();
      else closeBubble();
    }

    // default closed
    if (bubble) bubble.style.display = "none";

    mascotBtn?.addEventListener("click", () => {
      if (!bubble) return;
      bubble.style.display = (bubble.style.display === "none") ? "" : "none";
      window.SDAPP.fx?.tap?.();
    });
    closeBtn?.addEventListener("click", closeBubble);

    // buttons
    document.getElementById("bimoTip")?.addEventListener("click", () => window.SDAPP.mascot.tip());
    document.getElementById("bimoCheer")?.addEventListener("click", () => window.SDAPP.mascot.cheer());
    document.getElementById("bimoJoke")?.addEventListener("click", () => window.SDAPP.mascot.joke());
    document.getElementById("bimoQuest")?.addEventListener("click", () => window.SDAPP.mascot.mission());
    document.getElementById("bimoGo")?.addEventListener("click", () => {
      const g = localStorage.getItem(KEY_GRADE) || "1";
      location.href = `subject.html?grade=${encodeURIComponent(g)}`;
    });

    // initial dialog by page
    if (page.includes("home")) {
      window.SDAPP.mascot.say(name ? `Halo ${name}! Pilih kelas dulu ya 🎒` : "Isi nama dulu ya ✏️", "happy");
    } else if (page.includes("subject")) {
      window.SDAPP.mascot.say(`Kelas ${grade} siap! Pilih mapel favoritmu 📚`, "thinking");
    } else if (page.includes("games")) {
      window.SDAPP.mascot.say("Main games sambil belajar yuk! 🎮✨", "happy");
    } else {
      window.SDAPP.mascot.say("Halo! Aku Iky 😄", "happy");
    }

    // keep content clear from mascot
    document.body.style.paddingBottom = "120px";
  }

  // init bimo on all pages except index (but can also on index if you want; keep off)
  if (!onIndexPage()) initBimo();

  // ---------- Music (procedural) — 1 tombol di NAVBAR ----------
  (function initMusic() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const KEY_ON = "sd_music_on";
    const KEY_VOL = "sd_music_vol";
    const KEY_MODE = "sd_music_mode";

    let on = (localStorage.getItem(KEY_ON) ?? "on") !== "off";
    let vol = Number(localStorage.getItem(KEY_VOL) ?? "0.35");
    let mode = localStorage.getItem(KEY_MODE) || "learn";

    let ctx = null, master = null, musicGain = null;
    let timer = null, step = 0;
    let unlocked = false;

    function ensure() {
      if (!AudioCtx) return false;
      if (!ctx) {
        ctx = window.__sd_audioctx || (window.__sd_audioctx = new AudioCtx());
        master = ctx.createGain();
        musicGain = ctx.createGain();
        master.gain.value = 0.9;
        musicGain.gain.value = on ? vol : 0.0001;
        musicGain.connect(master);
        master.connect(ctx.destination);
      }
      return true;
    }

    function unlock() {
      if (unlocked) return;
      if (!ensure()) return;
      ctx.resume?.();
      unlocked = true;
      if (on) start();
    }

    const scaleLearn = [261.63, 293.66, 329.63, 392.0, 440.0]; // C D E G A
    const scaleGame = [293.66, 329.63, 392.0, 440.0, 523.25]; // D E G A C

    function play(freq, dur = 0.22, type = "sine") {
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.10, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(musicGain);
      o.start(t); o.stop(t + dur + 0.02);
    }

    function tick() {
      if (!ensure()) return;
      if (!on) { stop(); return; }
      const s = (mode === "game") ? scaleGame : scaleLearn;

      const bass = s[(step % 2 === 0) ? 0 : 2] / 2;
      play(bass, 0.18, "triangle");

      if (mode === "game") {
        const mel = s[(step * 2 + (step % 3)) % s.length];
        play(mel, 0.16, "square");
        if (step % 4 === 0) play(s[(step / 4) % s.length | 0] * 2, 0.10, "sine");
      } else {
        const mel = s[(step + 2) % s.length];
        play(mel, 0.20, "sine");
        if (step % 6 === 0) play(s[3] * 2, 0.12, "triangle");
      }
      step++;
    }

    function start() {
      if (!ensure()) return;
      if (timer) return;
      musicGain.gain.value = on ? vol : 0.0001;
      timer = setInterval(tick, mode === "game" ? 260 : 340);
      tick();
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      if (musicGain) musicGain.gain.value = 0.0001;
    }

    function setOn(v) {
      on = !!v;
      localStorage.setItem(KEY_ON, on ? "on" : "off");
      if (!ensure()) return;
      if (on) {
        musicGain.gain.value = vol;
        if (unlocked) start();
      } else {
        stop();
      }
      updateNavbarBtn();
    }

    function toggle() { setOn(!on); }

    function setMode(v) {
      mode = (v === "game") ? "game" : "learn";
      localStorage.setItem(KEY_MODE, mode);
      if (timer) { clearInterval(timer); timer = null; }
      step = 0;
      if (on && unlocked) start();
      updateNavbarBtn();
    }

    function updateNavbarBtn() {
      const nb = document.getElementById("navMusicBtn");
      if (!nb) return;
      const icon = on ? "🔊" : "🔇";
      const label = (mode === "game") ? "Game 🎮" : "Belajar 📘";
      nb.innerHTML = `${icon} Musik`;
      nb.setAttribute("data-mode", label);
    }

    // auto mode by page
    (function autoMode() {
      const p = (location.pathname || "").toLowerCase();
      setMode(p.includes("games") ? "game" : "learn");
    })();

    // inject button in navbar (ONLY ONE)
    function injectNavbarButton() {
      const nav = document.querySelector(".navbar .container, .navbar .container-fluid");
      if (!nav) return;
      if (document.getElementById("navMusicBtn")) { updateNavbarBtn(); return; }

      const nb = document.createElement("button");
      nb.id = "navMusicBtn";
      nb.type = "button";
      nb.className = "btn btn-outline-primary";
      nb.style.borderRadius = "999px";
      nb.style.fontWeight = "900";
      nb.style.display = "inline-flex";
      nb.style.alignItems = "center";
      nb.style.gap = "8px";
      nb.innerHTML = "🎵 Musik";

      nb.addEventListener("click", () => {
        unlock();
        window.SDAPP.fx?.tap?.();
        toggle();
      });

      // place before logout if exists
      const logout = document.getElementById("logoutBtn");
      if (logout && logout.parentElement) logout.parentElement.insertBefore(nb, logout);
      else nav.appendChild(nb);

      // unlock audio on first user gesture anywhere
      window.addEventListener("pointerdown", unlock, { once: true, passive: true });

      updateNavbarBtn();
    }

    // expose api
    window.SDAPP.music = {
      on: () => on,
      toggle,
      setOn,
      setMode,
      unlock,
      start,
      stop
    };

    // init
    injectNavbarButton();
    if (on) start(); // will actually produce sound after unlock, but safe to keep
  })();

})();

window.SDAPP = window.SDAPP || {};
window.SDAPP.ui = window.SDAPP.ui || {};

window.SDAPP.ui.renderProfileButton = function () {
  const key = window.SDAPP.userKey ? window.SDAPP.userKey("avatar") : "sd_avatar";
  const av = (localStorage.getItem(key) || "👧").trim();
  const name = (localStorage.getItem("sd_name") || "").trim();

  document.querySelectorAll("[data-profile-btn]").forEach((el) => {
    el.textContent = name ? `${av} ${name}` : `${av} Profil`;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  window.SDAPP.ui.renderProfileButton();
});



