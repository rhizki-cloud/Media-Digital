// js/games-plus.js
(function () {
  "use strict";

  // =========================
  // Shared: Panels + Cards
  // =========================
  const cards = document.querySelectorAll(".game-card[data-game]");
  const panels = {
    math: document.getElementById("game-math"),
    scramble: document.getElementById("game-scramble"),
    truefalse: document.getElementById("game-truefalse"),
    memory: document.getElementById("game-memory"),
    pic: document.getElementById("game-pic"),
    puzzle: document.getElementById("game-puzzle"),
  };

  const cardsNamed = {
    math: "Math Quiz",
    scramble: "Acak Kata",
    truefalse: "Benar / Salah",
    memory: "Memory Card",
    pic: "Tebak Gambar",
    puzzle: "Puzzle Angka",
  };

  // =========================
  // Shared: Points / Streak
  // =========================
  let gPoints = Number(localStorage.getItem("sd_game_points") || "0");
  let gStreak = Number(localStorage.getItem("sd_game_streak") || "0");

  // (optional) kalau kamu punya elemen header poin/streak
  const elPts = document.getElementById("gPoints");
  const elStr = document.getElementById("gStreak");

  function syncTop() {
    if (elPts) elPts.textContent = String(gPoints);
    if (elStr) elStr.textContent = String(gStreak);
    localStorage.setItem("sd_game_points", String(gPoints));
    localStorage.setItem("sd_game_streak", String(gStreak));
  }

  function award(points, msg = "Yeay!", mood = "proud") {
    gPoints += points;
    gStreak += 1;
    syncTop();
    window.SDAPP?.fx?.yay?.();
    window.SDAPP?.level?.addXP?.(points * 2, "Games");
    window.SDAPP?.mascot?.say?.(`${msg} +${points}⭐`, mood);
  }

  function miss(msg = "Coba lagi ya 😄", mood = "oops") {
    gStreak = 0;
    syncTop();
    window.SDAPP?.fx?.shake?.();
    window.SDAPP?.mascot?.say?.(msg, mood);
  }

  syncTop();

  // =========================
  // Helpers
  // =========================
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function safeText(s) {
    return String(s ?? "").trim();
  }

  function getGrade() {
    const g = Number(localStorage.getItem("sd_grade") || "1");
    return clamp(g, 1, 6);
  }

  function stopTimer(timerRef) {
    if (timerRef && timerRef.id) {
      clearInterval(timerRef.id);
      timerRef.id = null;
    }
  }

  // =========================
  // Game: Math Quiz (Tantangan)
  // =========================
  function renderMathQuiz(root) {
    const grade = getGrade();

    // State
    let idx = 0;
    let score = 0;
    let total = 12;

    let level = "sedang"; // mudah/sedang/sulit
    let opMode = "campur"; // tambah/kurang/kali/bagi/campur
    let useTimer = true;
    let useStory = true;

    // hint usage affects bonus
    let usedHintThisQ = false;

    // timer state
    const timerRef = { id: null };
    let timeLeft = 50; // default, akan disesuaikan level
    let timerEnabled = true;

    function levelBadge(lv) {
      if (lv === "mudah") return "text-bg-success";
      if (lv === "sedang") return "text-bg-warning";
      return "text-bg-danger";
    }

    function levelSeconds(lv) {
      // lebih tinggi kelas => sedikit lebih cepat (lebih menantang)
      const base =
        lv === "mudah" ? 55 :
        lv === "sedang" ? 50 : 45;
      const adjust = (grade - 1) * 2; // kelas 6 lebih pendek
      return clamp(base - adjust, 30, 70);
    }

    function rangeFor(lv) {
      // range angka berdasarkan level + grade
      if (lv === "mudah") return 10 + (grade - 1) * 5;
      if (lv === "sedang") return 20 + (grade - 1) * 8;
      return 40 + (grade - 1) * 12;
    }

    function pickOp() {
      if (opMode !== "campur") return opMode;
      // campur: makin tinggi kelas makin sering kali/bagi
      const r = Math.random();
      if (grade <= 2) return r < 0.55 ? "tambah" : "kurang";
      if (grade <= 4) {
        if (r < 0.4) return "tambah";
        if (r < 0.8) return "kurang";
        return "kali";
      }
      // kelas 5-6
      if (r < 0.25) return "tambah";
      if (r < 0.55) return "kurang";
      if (r < 0.85) return "kali";
      return "bagi";
    }

    function makeStory(a, b, op) {
      // Story bank sederhana tapi bervariasi
      const stories = {
        tambah: [
          () => `Ada ${a} apel, lalu ditambah ${b} apel lagi. Total apel?`,
          () => `Bimo punya ${a} kelereng, diberi ${b} kelereng. Jadi berapa?`,
          () => `Di kelas ada ${a} murid. Datang lagi ${b} murid. Jadi ada berapa murid?`,
        ],
        kurang: [
          () => `Bimo punya ${a} permen. Dimakan ${b} permen. Sisa berapa?`,
          () => `Ada ${a} buku di rak. Dipinjam ${b} buku. Tinggal berapa?`,
          () => `Ibu membeli ${a} telur. Pecah ${b} telur. Sisa telur?`,
        ],
        kali: [
          () => `Ada ${a} kantong, tiap kantong isi ${b}. Total?`,
          () => `Ada ${a} baris kursi, tiap baris ${b} kursi. Total kursi?`,
          () => `${a} kotak, tiap kotak ${b} pensil. Total pensil?`,
        ],
        bagi: [
          () => `Ada ${a} permen dibagi ke ${b} anak sama banyak. Tiap anak dapat?`,
          () => `${a} kue dibagi ${b} piring sama banyak. Tiap piring dapat?`,
          () => `${a} stiker dibagi ke ${b} teman. Masing-masing dapat?`,
        ],
      };
      const pick = stories[op] || stories.tambah;
      return pick[randInt(0, pick.length - 1)]();
    }

    function makeQuestion() {
      usedHintThisQ = false;

      const op = pickOp();
      const max = rangeFor(level);

      let a = randInt(2, max);
      let b = randInt(2, max);

      // Sesuaikan supaya masuk akal untuk bagi
      if (op === "bagi") {
        // pilih pembagi kecil biar hasil bulat
        b = randInt(2, clamp(grade + 2, 3, 8));
        const k = randInt(2, clamp(grade + 3, 4, 12));
        a = b * k;
      }

      // Untuk kurang, biar tidak negatif
      if (op === "kurang" && b > a) [a, b] = [b, a];

      let answer = 0;
      let prompt = "";
      let hint = "";
      let explain = "";

      if (op === "tambah") {
        answer = a + b;
        prompt = useStory ? makeStory(a, b, "tambah") : `${a} + ${b} = ?`;
        hint = `Jumlahkan: ${a} ditambah ${b}.`;
        explain = `Karena ${a} + ${b} = ${answer}.`;
      } else if (op === "kurang") {
        answer = a - b;
        prompt = useStory ? makeStory(a, b, "kurang") : `${a} - ${b} = ?`;
        hint = `Kurangi: mulai dari ${a}, ambil ${b}.`;
        explain = `Karena ${a} - ${b} = ${answer}.`;
      } else if (op === "kali") {
        answer = a * b;
        prompt = useStory ? makeStory(a, b, "kali") : `${a} × ${b} = ?`;
        hint = `Perkalian itu penjumlahan berulang: ${a} × ${b} = ${a} + ${a} + ... (sebanyak ${b} kali).`;
        explain = `Karena ${a} × ${b} = ${answer}.`;
      } else {
        // bagi
        answer = a / b;
        prompt = useStory ? makeStory(a, b, "bagi") : `${a} ÷ ${b} = ?`;
        hint = `Pembagian kebalikan perkalian: cari x supaya ${b} × x = ${a}.`;
        explain = `Karena ${a} ÷ ${b} = ${answer} (sebab ${b} × ${answer} = ${a}).`;
      }

      // Pastikan prompt tidak kosong (biar “soal ga muncul” tidak kejadian)
      prompt = safeText(prompt) || "(Soal tidak terbaca — coba refresh)";
      hint = safeText(hint) || "Coba pelan-pelan ya 🙂";
      explain = safeText(explain) || "Pembahasan belum tersedia.";

      return { a, b, op, answer, prompt, hint, explain };
    }

    let current = makeQuestion();

    function startCountdown() {
      stopTimer(timerRef);
      if (!timerEnabled) return;

      timeLeft = levelSeconds(level);
      const timeEl = root.querySelector("#mqTime");
      if (timeEl) timeEl.textContent = `${timeLeft}s`;

      timerRef.id = setInterval(() => {
        timeLeft--;
        const el = root.querySelector("#mqTime");
        if (el) el.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
          stopTimer(timerRef);
          miss("Waktu habis ⏰");
          // auto next
          idx++;
          if (idx >= total) return finish();
          current = makeQuestion();
          draw();
        }
      }, 1000);
    }

    function finish() {
      stopTimer(timerRef);
      const bestKey = `sd_math_best_g${grade}`;
      const best = Number(localStorage.getItem(bestKey) || "0");
      const isNewBest = score > best;

      if (isNewBest) localStorage.setItem(bestKey, String(score));

      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">➕ Math Quiz (Tantangan)</h2>
        <div class="game-box">
          <div class="fw-bold">Selesai! 🎉</div>
          <div class="text-muted">Nilai kamu: <b>${score}/${total}</b></div>
          <div class="text-muted">Rekor kelas ${grade}: <b>${isNewBest ? score : best}</b></div>
          <div class="d-flex gap-2 mt-2 flex-wrap">
            <button class="btn btn-primary game-btn" id="mqAgain">🔁 Main Lagi</button>
          </div>
        </div>
      `;

      root.querySelector("#mqAgain").onclick = () => {
        idx = 0;
        score = 0;
        current = makeQuestion();
        draw();
      };
    }

    function drawMessage(html) {
      const msg = root.querySelector("#mqMsg");
      if (msg) msg.innerHTML = html;
    }

    function draw() {
      timerEnabled = !!useTimer;

      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">➕ Math Quiz (Tantangan)</h2>
        <div class="text-muted mb-2">Ada mode operasi, level, timer, soal cerita, hint & pembahasan.</div>

        <div class="game-box">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="text-muted">Kelas ${grade} • Soal <b>${idx + 1}/${total}</b> • Skor: <b>${score}</b></div>
            <div class="text-muted" style="display:flex;align-items:center;gap:8px;">
              <span>⏱️</span> <b id="mqTime">${timerEnabled ? `${timeLeft}s` : "-"}</b>
            </div>
          </div>

          <div class="d-flex gap-2 mt-2 flex-wrap align-items-center">
            <span class="badge ${levelBadge(level)}" id="mqLevelBadge">${level.toUpperCase()}</span>

            <select class="form-select form-select-sm" id="mqLevel" style="max-width:160px;">
              <option value="mudah" ${level === "mudah" ? "selected" : ""}>Mudah</option>
              <option value="sedang" ${level === "sedang" ? "selected" : ""}>Sedang</option>
              <option value="sulit" ${level === "sulit" ? "selected" : ""}>Sulit</option>
            </select>

            <select class="form-select form-select-sm" id="mqOp" style="max-width:170px;">
              <option value="campur" ${opMode === "campur" ? "selected" : ""}>Campur</option>
              <option value="tambah" ${opMode === "tambah" ? "selected" : ""}>Tambah (+)</option>
              <option value="kurang" ${opMode === "kurang" ? "selected" : ""}>Kurang (−)</option>
              <option value="kali" ${opMode === "kali" ? "selected" : ""}>Kali (×)</option>
              <option value="bagi" ${opMode === "bagi" ? "selected" : ""}>Bagi (÷)</option>
            </select>

            <label class="form-check mb-0" style="display:flex;align-items:center;gap:8px;">
              <input class="form-check-input" type="checkbox" id="mqTimer" ${useTimer ? "checked" : ""}>
              <span class="form-check-label">Timer</span>
            </label>

            <label class="form-check mb-0" style="display:flex;align-items:center;gap:8px;">
              <input class="form-check-input" type="checkbox" id="mqStory" ${useStory ? "checked" : ""}>
              <span class="form-check-label">Soal cerita</span>
            </label>
          </div>

          <hr class="my-3" />

          <div class="fw-semibold mb-2" id="mqPrompt">${safeText(current.prompt)}</div>

          <input
            class="form-control"
            id="mqAns"
            placeholder="Jawaban..."
            inputmode="numeric"
            style="pointer-events:auto; position:relative; z-index:2;"
          >

          <div class="d-flex gap-2 mt-2 flex-wrap">
            <button class="btn btn-outline-primary game-btn" id="mqSubmit">Jawab</button>
            <button class="btn btn-outline-primary game-btn" id="mqHint">💡 Hint</button>
            <button class="btn btn-outline-primary game-btn" id="mqSkip">Lewati</button>
            <button class="btn btn-outline-secondary game-btn" id="mqReset">🔁 Ulang dari awal</button>
          </div>

          <div class="small text-muted mt-2">
            Hint mengurangi bonus ⭐ (jawaban benar tetap benar).
          </div>

          <div class="mt-2" id="mqMsg"></div>
        </div>
      `;

      // Controls
      const levelSel = root.querySelector("#mqLevel");
      const opSel = root.querySelector("#mqOp");
      const timerChk = root.querySelector("#mqTimer");
      const storyChk = root.querySelector("#mqStory");

      levelSel.onchange = () => {
        level = levelSel.value;
        current = makeQuestion();
        draw();
      };
      opSel.onchange = () => {
        opMode = opSel.value;
        current = makeQuestion();
        draw();
      };
      timerChk.onchange = () => {
        useTimer = !!timerChk.checked;
        draw();
      };
      storyChk.onchange = () => {
        useStory = !!storyChk.checked;
        current = makeQuestion();
        draw();
      };

      const input = root.querySelector("#mqAns");
      const submitBtn = root.querySelector("#mqSubmit");
      const hintBtn = root.querySelector("#mqHint");
      const skipBtn = root.querySelector("#mqSkip");
      const resetBtn = root.querySelector("#mqReset");

      function submit() {
        const raw = (input.value || "").trim();
        if (!raw) return miss("Isi jawaban dulu ya 😄");

        const val = Number(raw);
        if (!Number.isFinite(val)) return miss("Masukkan angka ya 🙂");

        const ok = val === current.answer;
        stopTimer(timerRef);

        if (ok) {
          score++;

          // bonus: kalau tidak pakai hint, dapat +1 poin tambahan (lebih seru)
          const bonus = usedHintThisQ ? 0 : 1;
          const pts = 1 + bonus;
          award(pts, ok ? (bonus ? "Benar! Bonus ⭐" : "Benar!") : "Benar!");

          drawMessage(`
            <div class="alert alert-success py-2 mb-0">
              <b>Benar ✅</b> ${usedHintThisQ ? "" : "<span class='ms-1'>(+bonus)</span>"}
              <div class="small mt-1">${safeText(current.explain)}</div>
            </div>
          `);
        } else {
          miss(`Belum tepat 😄 Jawaban: ${current.answer}`);
          drawMessage(`
            <div class="alert alert-danger py-2 mb-0">
              <b>Salah ❌</b>
              <div class="small mt-1">${safeText(current.explain)}</div>
            </div>
          `);
        }

        setTimeout(() => {
          idx++;
          if (idx >= total) return finish();
          current = makeQuestion();
          draw();
        }, 700);
      }

      submitBtn.onclick = submit;
      input.addEventListener("keydown", (e) => e.key === "Enter" && submit());

      hintBtn.onclick = () => {
        usedHintThisQ = true;
        window.SDAPP?.fx?.tap?.();
        drawMessage(`
          <div class="alert alert-warning py-2 mb-0">
            <b>Hint 💡</b>
            <div class="small mt-1">${safeText(current.hint)}</div>
          </div>
        `);
        input.focus();
      };

      skipBtn.onclick = () => {
        stopTimer(timerRef);
        miss("Lewat dulu ya 😉");
        idx++;
        if (idx >= total) return finish();
        current = makeQuestion();
        draw();
      };

      resetBtn.onclick = () => {
        stopTimer(timerRef);
        idx = 0;
        score = 0;
        current = makeQuestion();
        draw();
      };

      // start timer
      if (timerEnabled) startCountdown();

      // focus input
      setTimeout(() => input.focus(), 50);
    }

    // start
    current = makeQuestion();
    draw();
  }

  // =========================
  // Game: Word Scramble (Tantangan)
  // =========================
  function renderScramble(root) {
    const grade = getGrade();

    let level = "sedang"; // mudah/sedang/sulit
    let category = "benda"; // benda/kegiatan/tempat/campur
    let useTimer = false;

    let score = 0;
    let streak = 0;

    const timerRef = { id: null };
    let timeLeft = 40;

    const banks = {
      benda: {
        mudah: ["MEJA", "KURSI", "BUKU", "PENSIL", "BOLA", "APEL", "ROTI", "KACA"],
        sedang: ["PENGHAPUS", "PENGGARIS", "SEPATU", "KELERENG", "TAS", "JENDELA", "SEPEDA", "PAYUNG"],
        sulit: ["PERPUSTAKAAN", "SEPEDA MOTOR", "KOMPUTER", "TELEVISI", "PENGUMUMAN", "KETERAMPILAN"].map(s=>s.replace(/\s/g,"")),
      },
      kegiatan: {
        mudah: ["MAKAN", "MINUM", "LARI", "MANDI", "TIDUR", "BACA"],
        sedang: ["BELAJAR", "MENULIS", "MENGGAMBAR", "BERMAIN", "BERNYANYI"],
        sulit: ["BERKELOMPOK", "BERDISKUSI", "MENGAMATI", "MENGINGAT"].map(s=>s.replace(/\s/g,"")),
      },
      tempat: {
        mudah: ["RUMAH", "KELAS", "TAMAN", "PASAR", "TOKO"],
        sedang: ["SEKOLAH", "KANTIN", "LAPANGAN", "MUSEUM"],
        sulit: ["PERPUSTAKAAN", "LABORATORIUM", "PUSKESMAS"].map(s=>s.replace(/\s/g,"")),
      },
    };

    function levelBadge(lv) {
      if (lv === "mudah") return "text-bg-success";
      if (lv === "sedang") return "text-bg-warning";
      return "text-bg-danger";
    }

    function pickWord() {
      const cats = category === "campur" ? ["benda", "kegiatan", "tempat"] : [category];
      const cat = cats[randInt(0, cats.length - 1)];
      const arr = banks[cat]?.[level] || banks.benda.sedang;
      return arr[randInt(0, arr.length - 1)];
    }

    function scrambleWord(w) {
      const chars = w.split("");
      let s = w;
      // pastikan beda dari aslinya
      for (let tries = 0; tries < 10; tries++) {
        s = shuffle(chars).join("");
        if (s !== w) break;
      }
      return s;
    }

    let target = pickWord();
    let scr = scrambleWord(target);

    let hintStep = 0;

    function startCountdown() {
      stopTimer(timerRef);
      if (!useTimer) return;

      timeLeft = clamp(45 - (grade - 1) * 2, 25, 45);
      const t = root.querySelector("#wsTime");
      if (t) t.textContent = `${timeLeft}s`;

      timerRef.id = setInterval(() => {
        timeLeft--;
        const el = root.querySelector("#wsTime");
        if (el) el.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
          stopTimer(timerRef);
          miss(`Waktu habis ⏰ Kata: ${target}`);
          streak = 0;
          next(true);
        }
      }, 1000);
    }

    function next(isFail) {
      hintStep = 0;
      if (isFail) {
        // jangan tambah score
      }
      target = pickWord();
      scr = scrambleWord(target);
      draw();
    }

    function showHint() {
      hintStep++;
      // bertahap:
      // 1) jumlah huruf
      // 2) huruf pertama
      // 3) 2 huruf awal
      // 4) tampilkan vokal yang benar posisinya (kasar)
      let msg = "";
      if (hintStep === 1) msg = `Jumlah huruf: <b>${target.length}</b>`;
      else if (hintStep === 2) msg = `Huruf pertama: <b>${target[0]}</b>`;
      else if (hintStep === 3) msg = `Dua huruf awal: <b>${target.slice(0, 2)}</b>`;
      else msg = `Coba fokus huruf awal: <b>${target.slice(0, 3)}</b> ...`;

      const box = root.querySelector("#wsMsg");
      if (box) {
        box.className = "alert alert-warning py-2 mb-0 mt-2";
        box.innerHTML = `<b>Hint 💡</b> <span class="ms-1">${msg}</span>`;
      }
      window.SDAPP?.fx?.tap?.();
    }

    function draw() {
      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">🔤 Acak Kata (Tantangan)</h2>
        <div class="text-muted mb-2">Susun huruf jadi kata yang benar. Ada kategori, level, hint bertahap, dan timer.</div>

        <div class="game-box">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="text-muted">Kelas ${grade} • Skor: <b>${score}</b> • Streak: <b>${streak}</b></div>
            <div class="text-muted" style="display:flex;align-items:center;gap:8px;">
              <span>⏱️</span> <b id="wsTime">${useTimer ? `${timeLeft}s` : "Timer: off"}</b>
            </div>
          </div>

          <div class="d-flex gap-2 mt-2 flex-wrap align-items-center">
            <span class="badge ${levelBadge(level)}">${level.toUpperCase()}</span>

            <select class="form-select form-select-sm" id="wsLevel" style="max-width:160px;">
              <option value="mudah" ${level === "mudah" ? "selected" : ""}>Mudah</option>
              <option value="sedang" ${level === "sedang" ? "selected" : ""}>Sedang</option>
              <option value="sulit" ${level === "sulit" ? "selected" : ""}>Sulit</option>
            </select>

            <select class="form-select form-select-sm" id="wsCat" style="max-width:170px;">
              <option value="benda" ${category === "benda" ? "selected" : ""}>Benda</option>
              <option value="kegiatan" ${category === "kegiatan" ? "selected" : ""}>Kegiatan</option>
              <option value="tempat" ${category === "tempat" ? "selected" : ""}>Tempat</option>
              <option value="campur" ${category === "campur" ? "selected" : ""}>Campur</option>
            </select>

            <label class="form-check mb-0" style="display:flex;align-items:center;gap:8px;">
              <input class="form-check-input" type="checkbox" id="wsTimer" ${useTimer ? "checked" : ""}>
              <span class="form-check-label">Timer</span>
            </label>
          </div>

          <hr class="my-3" />

          <div class="game-big mt-1" style="letter-spacing:6px;">${scr}</div>

          <input
            class="form-control mt-2"
            id="wsAns"
            placeholder="Ketik jawaban..."
            autocapitalize="characters"
            style="pointer-events:auto; position:relative; z-index:2;"
          >

          <div class="d-flex gap-2 mt-2 flex-wrap">
            <button class="btn btn-outline-primary game-btn" id="wsCheck">Cek</button>
            <button class="btn btn-outline-primary game-btn" id="wsHint">💡 Hint</button>
            <button class="btn btn-outline-primary game-btn" id="wsNext">Ganti kata</button>
            <button class="btn btn-outline-secondary game-btn" id="wsReset">🧹 Reset skor</button>
          </div>

          <div id="wsMsg" class="mt-2"></div>
        </div>
      `;

      const lvlSel = root.querySelector("#wsLevel");
      const catSel = root.querySelector("#wsCat");
      const timerChk = root.querySelector("#wsTimer");

      lvlSel.onchange = () => { level = lvlSel.value; next(true); };
      catSel.onchange = () => { category = catSel.value; next(true); };
      timerChk.onchange = () => { useTimer = !!timerChk.checked; draw(); };

      const input = root.querySelector("#wsAns");
      const msg = root.querySelector("#wsMsg");

      function feedback(ok, text, type) {
        msg.className = `alert alert-${type} py-2 mb-0 mt-2`;
        msg.innerHTML = `<b>${ok ? "Benar ✅" : "Belum ❌"}</b> <span class="ms-1">${text}</span>`;
      }

      function check() {
        const val = safeText(input.value).toUpperCase();
        if (!val) return miss("Ketik dulu ya 😄");

        stopTimer(timerRef);

        if (val === target) {
          score++;
          streak++;
          // bonus: streak >=3 dapat tambahan poin
          const bonus = streak >= 3 ? 1 : 0;
          award(1 + bonus, bonus ? "Mantap! Bonus streak ⭐" : "Mantap!");
          feedback(true, bonus ? "Streak bonus aktif!" : "Lanjut ya!", "success");
          next(false);
        } else {
          streak = 0;
          miss(`Belum pas 😄 (Jawaban: ${target})`);
          feedback(false, "Coba lagi ya 🙂", "danger");
          // tetap lanjut biar menantang (opsional). Kalau mau “tetap di soal yang sama”, comment next(true).
          next(true);
        }
      }

      root.querySelector("#wsCheck").onclick = check;
      root.querySelector("#wsHint").onclick = () => { showHint(); input.focus(); };
      root.querySelector("#wsNext").onclick = () => { miss("Ganti kata!"); next(true); };
      root.querySelector("#wsReset").onclick = () => {
        score = 0; streak = 0;
        localStorage.setItem("sd_game_points", String(gPoints)); // keep global points
        draw();
      };

      input.addEventListener("keydown", (e) => e.key === "Enter" && check());

      setTimeout(() => input.focus(), 60);
      startCountdown();
    }

    draw();
  }

  // =========================
// Game: True / False (Lebih menantang) - REVISI LOGIKA
// =========================
function renderTrueFalse(root) {
  const grade = getGrade();
  let idx = 0;
  let score = 0;
  let total = 12;

  let level = "sedang"; // mudah/sedang/sulit/semua
  let streak = 0;

  // bank campuran
  const bank = [
    { t: "Segitiga punya 3 sisi", a: true, lv: "mudah" },
    { t: "10 - 7 = 5", a: false, lv: "mudah" },
    { t: "2 × 3 = 6", a: true, lv: "mudah" },
    { t: "Matahari terbit dari barat", a: false, lv: "mudah" },

    { t: "1/2 lebih besar daripada 1/3", a: true, lv: "sedang" },
    { t: "Keliling persegi sisi 4 adalah 12", a: false, lv: "sedang" },
    { t: "Kata baku 'aktifitas' adalah 'aktifitas'", a: false, lv: "sedang" },
    { t: "Gotong royong berarti bekerja bersama", a: true, lv: "sedang" },

    { t: "Jika 3/10 = 0,3 maka 3/100 = 0,3", a: false, lv: "sulit" },
    { t: "Median data 3,5,7,9,11 adalah 7", a: true, lv: "sulit" },
    { t: "Globalisasi selalu berdampak positif tanpa sisi negatif", a: false, lv: "sulit" },
    { t: "Volume kubus sisi 4 adalah 16", a: false, lv: "sulit" },
  ];

  function pickQuestions() {
    // FIX: level "semua" harus ambil semua soal
    const filtered =
      level === "semua" ? bank.slice() : bank.filter((x) => x.lv === level);

    // FIX: fallback aman kalau filter kosong (misal bank belum ada untuk level tsb)
    const source = filtered.length ? filtered : bank.slice();

    const picked = shuffle(source);
    total = Math.min(12, picked.length); // total menyesuaikan isi bank
    return picked.slice(0, total);
  }

  let questions = pickQuestions();

  function draw() {
    const it = questions[idx];

    // FIX: kalau somehow kosong, regen dulu biar gak error
    if (!it) {
      idx = 0;
      score = 0;
      streak = 0;
      questions = pickQuestions();
      return draw();
    }

    root.innerHTML = `
      <h2 class="h4 mb-2" style="font-weight:900;">✅❌ Benar / Salah (Tantangan)</h2>
      <div class="text-muted mb-2">Pilih cepat. Ada level dan bonus streak.</div>

      <div class="game-box">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="text-muted">Kelas ${grade} • Soal <b>${idx + 1}/${total}</b> • Skor: <b>${score}</b> • Streak: <b>${streak}</b></div>
          <select class="form-select form-select-sm" id="tfLevel" style="max-width:170px;">
            <option value="mudah" ${level==="mudah"?"selected":""}>Mudah</option>
            <option value="sedang" ${level==="sedang"?"selected":""}>Sedang</option>
            <option value="sulit" ${level==="sulit"?"selected":""}>Sulit</option>
            <option value="semua" ${level==="semua"?"selected":""}>Semua</option>
          </select>
        </div>

        <hr class="my-3"/>

        <div class="game-big mt-1" style="font-size:26px; line-height:1.3;">${it.t}</div>

        <div class="tap-target mt-3 d-flex gap-2 flex-wrap">
          <button class="btn btn-success game-btn" id="tfT">✅ Benar</button>
          <button class="btn btn-danger game-btn" id="tfF">❌ Salah</button>
        </div>

        <div id="tfMsg" class="mt-2"></div>
      </div>
    `;

    const levelSel = root.querySelector("#tfLevel");
    levelSel.onchange = () => {
      level = levelSel.value;
      idx = 0;
      score = 0;
      streak = 0;
      questions = pickQuestions();
      draw();
    };

    const msg = root.querySelector("#tfMsg");

    function feedback(ok, extra = "") {
      msg.className = `alert alert-${ok ? "success" : "danger"} py-2 mb-0`;
      msg.innerHTML = ok
        ? `<b>Benar ✅</b>${extra ? `<div class="small mt-1">${extra}</div>` : ""}`
        : `<b>Salah ❌</b>${extra ? `<div class="small mt-1">${extra}</div>` : ""}`;
    }

    function pick(ans) {
      const ok = ans === it.a;

      if (ok) {
        score++;
        streak++;

        // Bonus: tiap 4 benar total dapat bonus
        if (score % 4 === 0) {
          award(2, "Bonus! 4 benar ⭐");
          feedback(true, "Bonus karena 4 benar!");
        } else {
          award(1, "Benar!");
          // Bonus streak contoh: streak >= 3 kasih pesan (tanpa ubah poin, biar simpel)
          feedback(true, streak >= 3 ? "Streak bagus! 🔥" : "");
        }
      } else {
        streak = 0;
        miss("Salah 😄");
        feedback(false, `Jawaban yang benar: <b>${it.a ? "Benar" : "Salah"}</b>`);
      }

      setTimeout(() => {
        idx++;
        if (idx >= total) return finish();
        draw();
      }, 450);
    }

    root.querySelector("#tfT").onclick = () => pick(true);
    root.querySelector("#tfF").onclick = () => pick(false);
  }

  function finish() {
    root.innerHTML = `
      <h2 class="h4 mb-2" style="font-weight:900;">✅❌ Benar / Salah</h2>
      <div class="game-box">
        <div class="fw-bold">Selesai! 🎉</div>
        <div class="text-muted">Nilai kamu: <b>${score}/${total}</b></div>
        <button class="btn btn-primary game-btn mt-2" id="tfAgain">🔁 Main Lagi</button>
      </div>
    `;
    root.querySelector("#tfAgain").onclick = () => {
      idx = 0;
      score = 0;
      streak = 0;
      questions = pickQuestions();
      draw();
    };
  }

  draw();
}


  // =========================
  // Game: Memory Card (tetap)
  // =========================
  function renderMemory(root) {
    const emojis = ["🍎", "🍌", "🍇", "🍉", "⭐", "🌈", "🚀", "🎲"];
    const deck = shuffle([...emojis, ...emojis]);

    let open = null;
    let done = new Set();
    let moves = 0;

    function draw() {
      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">🧠 Memory Card</h2>
        <div class="text-muted mb-2">Cari pasangan emoji yang sama.</div>
        <div class="game-box">
          <div class="d-flex justify-content-between">
            <div class="text-muted">Cari pasangan</div>
            <div class="fw-bold">Gerakan: ${moves}</div>
          </div>
          <div class="np-grid mt-3" id="mmGrid" style="grid-template-columns:repeat(4,minmax(58px,1fr))">
            ${deck.map((e, i) => {
              const show = done.has(i) || open === i;
              return `<button class="np-tile ${done.has(i) ? "done" : ""} ${open === i ? "open" : ""}" data-i="${i}" aria-label="kartu" style="pointer-events:auto; position:relative; z-index:2;">${show ? e : "❓"}</button>`;
            }).join("")}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-i]").forEach((el) => {
        el.onclick = () => {
          const i = Number(el.getAttribute("data-i"));
          if (done.has(i) || open === i) return;

          if (open === null) {
            open = i;
            draw();
            return;
          }

          moves++;
          const first = open;
          const second = i;
          open = second;
          draw();

          const ok = deck[first] === deck[second];
          setTimeout(() => {
            if (ok) {
              done.add(first);
              done.add(second);
              award(2, "Pas!");
            } else {
              miss("Belum pas 😄");
            }
            open = null;

            if (done.size === deck.length) {
              award(3, "Selesai!");
              root.innerHTML = `
                <h2 class="h4 mb-2" style="font-weight:900;">🧠 Memory Card</h2>
                <div class="game-box">
                  <div class="fw-bold">Selesai! 🏁</div>
                  <div class="text-muted">Gerakan: <b>${moves}</b></div>
                  <button class="btn btn-primary game-btn mt-2" id="mmAgain">🔁 Main Lagi</button>
                </div>`;
              root.querySelector("#mmAgain").onclick = () => location.reload();
              return;
            }

            draw();
          }, 420);
        };
      });
    }

    draw();
  }

  // =========================
  // Game: Tebak Gambar (lebih menantang)
  // =========================
  function renderTebakGambar(root) {
    // ===== Helpers =====
    const grade = Number(localStorage.getItem("sd_grade") || "1");
  
    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  
    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  
    // bikin opsi jawaban: 1 benar + 3 jebakan
    function buildOptions(correct, pool, want = 4) {
      const set = new Set([correct]);
      const tries = 200;
      for (let t = 0; t < tries && set.size < want; t++) {
        const cand = pick(pool);
        if (cand && cand !== correct) set.add(cand);
      }
      return shuffle(Array.from(set)).slice(0, want);
    }
  
    // clue bertahap (kategori -> jumlah kata -> huruf awal -> huruf akhir)
    function makeClues(answer, category) {
      const clean = (answer || "").trim();
      const words = clean.split(/\s+/).filter(Boolean);
      const first = clean[0] || "";
      const last = clean[clean.length - 1] || "";
      const masked = clean
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i === 0 || i === clean.length - 1) return ch;
          return "•";
        })
        .join("");
  
      return [
        `Kategori: ${category}`,
        `Jumlah kata: ${words.length}`,
        `Huruf awal: "${first}"`,
        `Huruf akhir: "${last}"`,
        `Pola: ${masked}`,
      ];
    }
  
    // ===== Bank Soal (Rebus Kata / Gabungan Emoji) =====
    // notes:
    // - "combo" = array emoji
    // - "answer" = kata/frasa yang ingin ditebak
    // - "category" membantu clue
    const bank = [
      // --- Gabungan 2 emoji (frasa sederhana) ---
      { combo: ["🏫", "📚"], answer: "buku sekolah", category: "Benda" },
      { combo: ["🍚", "🍗"], answer: "nasi ayam", category: "Makanan" },
      { combo: ["🍞", "🍫"], answer: "roti cokelat", category: "Makanan" },
      { combo: ["🧃", "🥭"], answer: "jus mangga", category: "Minuman" },
      { combo: ["🍜", "🥚"], answer: "mie telur", category: "Makanan" },
      { combo: ["☀️", "🕶️"], answer: "kacamata hitam", category: "Benda" },
      { combo: ["🌧️", "☂️"], answer: "payung hujan", category: "Benda" },
      { combo: ["🚲", "🧑‍🦱"], answer: "naik sepeda", category: "Kegiatan" },
      { combo: ["🏃‍♂️", "💧"], answer: "lari cepat", category: "Kegiatan" },
      { combo: ["🧼", "🖐️"], answer: "cuci tangan", category: "Kegiatan" },
  
      // --- Gabungan 3 emoji (lebih menantang) ---
      { combo: ["🧑‍🍳", "🍚", "🍳"], answer: "nasi goreng", category: "Makanan" },
      { combo: ["🍌", "🥛", "🧊"], answer: "es susu pisang", category: "Minuman" },
      { combo: ["🐟", "🍚", "🍱"], answer: "bekal ikan", category: "Makanan" },
      { combo: ["🧑‍🏫", "📝", "🏫"], answer: "guru mengajar", category: "Kegiatan" },
      { combo: ["🛏️", "🌙", "😴"], answer: "tidur malam", category: "Kegiatan" },
      { combo: ["📖", "👀", "🧠"], answer: "membaca buku", category: "Kegiatan" },
      { combo: ["⚽", "🥅", "🏃‍♂️"], answer: "main bola", category: "Kegiatan" },
      { combo: ["🎒", "✏️", "📏"], answer: "alat sekolah", category: "Benda" },
  
      // --- Gabungan 4 emoji (level tinggi) ---
      { combo: ["🏠", "🧹", "🧼", "✨"], answer: "bersih-bersih rumah", category: "Kegiatan" },
      { combo: ["🧑‍⚕️", "💊", "🩹", "🏥"], answer: "berobat ke dokter", category: "Kegiatan" },
      { combo: ["🛒", "🥦", "🍅", "🥕"], answer: "belanja sayur", category: "Kegiatan" },
      { combo: ["👧", "🎨", "🖼️", "✨"], answer: "melukis gambar", category: "Kegiatan" },
    ];
  
    // pool jawaban untuk opsi jebakan (ambil semua answer)
    const answerPool = bank.map((x) => x.answer);
  
    // ===== State =====
    let idx = 0;
    let score = 0;
    const total = 12;
  
    // mode & difficulty
    let level = (localStorage.getItem("sd_pic_level") || "sedang"); // mudah/sedang/sulit
    let mode = (localStorage.getItem("sd_pic_mode") || "campur"); // kata/frasa/campur
    let clueStep = 0; // 0..clues.length-1
  
    function levelBadge(lv) {
      if (lv === "mudah") return "text-bg-success";
      if (lv === "sedang") return "text-bg-warning";
      return "text-bg-danger";
    }
  
    function chooseItem() {
      // filter by mode
      const items = bank.filter((it) => {
        const words = it.answer.trim().split(/\s+/).filter(Boolean).length;
        const isPhrase = words >= 2;
  
        if (mode === "kata") return !isPhrase;
        if (mode === "frasa") return isPhrase;
        return true;
      });
  
      // filter by level (pakai panjang combo & panjang jawaban)
      const filtered = items.filter((it) => {
        const words = it.answer.trim().split(/\s+/).filter(Boolean).length;
        const comboLen = it.combo.length;
        if (level === "mudah") return comboLen <= 2 && words <= 2;
        if (level === "sedang") return comboLen <= 3 && words <= 3;
        return true; // sulit: semua
      });
  
      return pick(filtered.length ? filtered : bank);
    }
  
    let current = chooseItem();
  
    function nextQuestion() {
      clueStep = 0;
      current = chooseItem();
      draw();
    }
  
    function award(points, msg = "Benar!") {
      // pakai fungsi award yang sudah ada di file kamu (global di games-plus.js)
      // kalau tidak ada, fallback aman:
      if (typeof window.award === "function") return window.award(points, msg);
      try {
        window.SDAPP?.fx?.yay?.();
        window.SDAPP?.level?.addXP?.(points * 2, "Games");
        window.SDAPP?.mascot?.say?.(`${msg} +${points}⭐`, "proud");
      } catch (e) {}
    }
  
    function miss(msg = "Belum tepat 😄") {
      if (typeof window.miss === "function") return window.miss(msg);
      try {
        window.SDAPP?.fx?.shake?.();
        window.SDAPP?.mascot?.say?.(msg, "oops");
      } catch (e) {}
    }
  
    function draw() {
      const clues = makeClues(current.answer, current.category);
  
      // tentukan opsi (lebih sulit: opsi mirip kategori yang sama)
      let pool = answerPool;
  
      // kalau level sulit, tambahkan opsi yang lebih "mirip" (same category)
      if (level === "sulit") {
        const sameCat = bank.filter((x) => x.category === current.category).map((x) => x.answer);
        if (sameCat.length >= 4) pool = sameCat;
      }
  
      const options = buildOptions(current.answer, pool, 4);
  
      const comboText = current.combo.join(" ");
  
      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">🖼️ Tebak Gambar (Rebus Kata)</h2>
        <div class="text-muted mb-2">
          Gabungkan gambar jadi <b>${mode === "kata" ? "kata" : mode === "frasa" ? "frasa" : "kata / frasa"}</b>.
          Ada clue bertahap biar makin menantang!
        </div>
  
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div class="small text-muted">
            Kelas ${grade} • Soal <b>${idx + 1}/${total}</b> • Skor: <b>${score}</b>
          </div>
  
          <div class="d-flex gap-2 align-items-center flex-wrap">
            <span class="badge ${levelBadge(level)}" style="font-weight:800;">${level.toUpperCase()}</span>
  
            <select class="form-select form-select-sm" id="picLevel" style="width:160px">
              <option value="mudah">Mudah</option>
              <option value="sedang">Sedang</option>
              <option value="sulit">Sulit</option>
            </select>
  
            <select class="form-select form-select-sm" id="picMode" style="width:160px">
              <option value="campur">Campur</option>
              <option value="kata">Kata</option>
              <option value="frasa">Frasa</option>
            </select>
          </div>
        </div>
  
        <div class="game-box">
          <div class="game-big mt-2" style="font-size:64px; letter-spacing:6px;">${comboText}</div>
  
          <div class="tap-target mt-3" id="picOpts">
            ${options.map((o) => `<button class="btn btn-outline-primary game-btn" data-o="${o}">${o}</button>`).join("")}
          </div>
  
          <div class="d-flex gap-2 mt-3 flex-wrap">
            <button class="btn btn-outline-primary game-btn" id="picClue">💡 Clue</button>
            <button class="btn btn-outline-secondary game-btn" id="picSkip">Lewati</button>
            <button class="btn btn-outline-secondary game-btn" id="picReset">🔁 Ulang dari awal</button>
          </div>
  
          <div class="small text-muted mt-2" id="picClueBox">
            ${clueStep > 0 ? `Clue: <b>${clues[clueStep - 1]}</b>` : "Klik <b>Clue</b> kalau kamu butuh petunjuk 😉"}
          </div>
        </div>
      `;
  
      // set select values
      const selLv = root.querySelector("#picLevel");
      const selMd = root.querySelector("#picMode");
      selLv.value = level;
      selMd.value = mode;
  
      selLv.onchange = () => {
        level = selLv.value;
        localStorage.setItem("sd_pic_level", level);
        nextQuestion(); // refresh soal sesuai level
      };
  
      selMd.onchange = () => {
        mode = selMd.value;
        localStorage.setItem("sd_pic_mode", mode);
        nextQuestion(); // refresh soal sesuai mode
      };
  
      // options click
      root.querySelectorAll("[data-o]").forEach((b) => {
        b.onclick = () => {
          const pickAns = b.getAttribute("data-o");
          if (pickAns === current.answer) {
            // poin: level sulit lebih besar, clue mengurangi bonus
            const base = level === "mudah" ? 1 : level === "sedang" ? 2 : 3;
            const penalty = clueStep > 0 ? 1 : 0; // jika pakai clue, bonus berkurang
            const gain = Math.max(1, base - penalty);
  
            score += 1;
            award(gain, "Benar!");
            window.SDAPP?.mascot?.say?.(`Mantap! Jawabannya: "${current.answer}"`, "proud");
  
            idx++;
            if (idx >= total) {
              award(2, "Selesai!");
              root.innerHTML = `
                <h2 class="h4 mb-2" style="font-weight:900;">🖼️ Tebak Gambar (Rebus Kata)</h2>
                <div class="game-box">
                  <div class="fw-bold">Selesai! 🎉</div>
                  <div class="text-muted">Skor benar: <b>${score}/${total}</b></div>
                  <button class="btn btn-primary game-btn mt-2" id="picAgain">🔁 Main Lagi</button>
                </div>
              `;
              root.querySelector("#picAgain").onclick = () => {
                idx = 0;
                score = 0;
                nextQuestion();
              };
              return;
            }
  
            nextQuestion();
          } else {
            miss("Belum tepat 😄 coba lagi!");
            b.classList.add("shake");
            setTimeout(() => b.classList.remove("shake"), 260);
          }
        };
      });
  
      // clue button
      root.querySelector("#picClue").onclick = () => {
        if (clueStep < clues.length) {
          clueStep++;
          const box = root.querySelector("#picClueBox");
          if (box) box.innerHTML = `Clue: <b>${clues[clueStep - 1]}</b>`;
          window.SDAPP?.fx?.tap?.();
          window.SDAPP?.mascot?.say?.("Oke, ini petunjuknya ya 😉", "wow");
        } else {
          window.SDAPP?.mascot?.say?.("Clue sudah maksimal 😄", "happy");
        }
      };
  
      // skip
      root.querySelector("#picSkip").onclick = () => {
        miss(`Lewat ya 😉 Jawabannya: ${current.answer}`);
        idx++;
        if (idx >= total) idx = total;
        if (idx >= total) {
          root.innerHTML = `
            <h2 class="h4 mb-2" style="font-weight:900;">🖼️ Tebak Gambar (Rebus Kata)</h2>
            <div class="game-box">
              <div class="fw-bold">Selesai! 🎉</div>
              <div class="text-muted">Skor benar: <b>${score}/${total}</b></div>
              <button class="btn btn-primary game-btn mt-2" id="picAgain">🔁 Main Lagi</button>
            </div>
          `;
          root.querySelector("#picAgain").onclick = () => {
            idx = 0; score = 0; nextQuestion();
          };
          return;
        }
        nextQuestion();
      };
  
      // reset
      root.querySelector("#picReset").onclick = () => {
        idx = 0;
        score = 0;
        nextQuestion();
      };
    }
  
    // start
    draw();
  }  

  // =========================
  // Game: Puzzle Angka (pakai versi interaktif yang sudah kamu suka)
  // (aku pakai versi yang lebih stabil dari sebelumnya)
  // =========================
  function renderPuzzleAngka(root) {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    function isSolvable(arr) {
      const a = arr.filter((x) => x !== 0);
      let inv = 0;
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) inv++;
      return inv % 2 === 0;
    }

    function shufflePuzzle() {
      let arr;
      do {
        arr = goal.slice().sort(() => Math.random() - 0.5);
      } while (!isSolvable(arr) || arr.join(",") === goal.join(","));
      return arr;
    }

    let board = shufflePuzzle();
    let moves = 0;

    function neighborsOfZero() {
      const zi = board.indexOf(0);
      const r = Math.floor(zi / 3), c = zi % 3;
      const n = [];
      const cand = [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 },
      ];
      cand.forEach(({ r, c }) => {
        if (r >= 0 && r < 3 && c >= 0 && c < 3) n.push(r * 3 + c);
      });
      return n;
    }

    function moveTile(i) {
      const zi = board.indexOf(0);
      const movables = neighborsOfZero();
      if (!movables.includes(i)) {
        miss("Yang bisa digeser cuma yang dekat kotak kosong 😉");
        return;
      }

      board[zi] = board[i];
      board[i] = 0;
      moves++;

      if (board.join(",") === goal.join(",")) {
        award(5, "Puzzle selesai!");
        root.innerHTML = `
          <h2 class="h4 mb-2" style="font-weight:900;">🧩 Puzzle Angka</h2>
          <div class="game-box">
            <div class="fw-bold">Kamu Menang! 🏆</div>
            <div class="text-muted">Langkah: <b>${moves}</b></div>
            <button class="btn btn-primary game-btn mt-2" id="npAgain">🔀 Main Lagi</button>
          </div>
        `;
        root.querySelector("#npAgain").onclick = () => {
          board = shufflePuzzle();
          moves = 0;
          draw();
        };
        return;
      }

      draw();
    }

    function draw() {
      const movables = neighborsOfZero();

      root.innerHTML = `
        <h2 class="h4 mb-2" style="font-weight:900;">🧩 Puzzle Angka</h2>
        <div class="text-muted mb-2">Klik angka yang dekat kotak kosong untuk menggeser.</div>
        <div class="game-box">
          <div class="d-flex justify-content-between">
            <div class="text-muted">Susun 1–8</div>
            <div class="fw-bold">Langkah: ${moves}</div>
          </div>

          <div class="np-grid mt-3" style="grid-template-columns:repeat(3,minmax(60px,1fr))">
            ${board.map((v, i) => {
              if (v === 0) return `<div class="np-tile empty" data-i="${i}" aria-hidden="true"></div>`;
              const mv = movables.includes(i) ? "movable" : "";
              return `<button class="np-tile ${mv}" data-i="${i}" style="pointer-events:auto; position:relative; z-index:2;">${v}</button>`;
            }).join("")}
          </div>

          <div class="d-flex gap-2 mt-3 flex-wrap">
            <button class="btn btn-outline-primary game-btn" id="npReset">🔀 Acak</button>
          </div>
        </div>
      `;

      root.querySelectorAll("[data-i]").forEach((el) => {
        el.onclick = () => {
          const i = Number(el.getAttribute("data-i"));
          if (board[i] === 0) return;
          moveTile(i);
        };
      });

      root.querySelector("#npReset").onclick = () => {
        board = shufflePuzzle();
        moves = 0;
        draw();
      };
    }

    draw();
  }

  // =========================
  // Tab switcher
  // =========================
  const rendered = {
    math: false,
    scramble: false,
    truefalse: false,
    memory: false,
    pic: false,
    puzzle: false,
  };

  function showGame(id) {
    Object.values(panels).forEach((p) => p && (p.style.display = "none"));
    cards.forEach((c) => c.classList.toggle("active", c.dataset.game === id));

    const panel = panels[id];
    if (!panel) return;

    panel.style.display = "";

    if (id === "math" && !rendered.math) { renderMathQuiz(panel); rendered.math = true; }
    if (id === "scramble" && !rendered.scramble) { renderScramble(panel); rendered.scramble = true; }
    if (id === "truefalse" && !rendered.truefalse) { renderTrueFalse(panel); rendered.truefalse = true; }
    if (id === "memory" && !rendered.memory) { renderMemory(panel); rendered.memory = true; }
    if (id === "pic" && !rendered.pic) { renderTebakGambar(panel); rendered.pic = true; }
    if (id === "puzzle" && !rendered.puzzle) { renderPuzzleAngka(panel); rendered.puzzle = true; }

    window.SDAPP?.mascot?.say?.(`Yuk main ${cardsNamed[id]} 😄🎮`, "wow");
  }

  cards.forEach((c) => c.addEventListener("click", () => showGame(c.dataset.game)));

  // default
  showGame("math");
})();
