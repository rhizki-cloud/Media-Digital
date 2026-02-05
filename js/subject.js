// js/subject.js (MULTI-USER FIXED — FINAL)
(function () {
  // ====== sync active user dulu (PENTING) ======
  const userName = (localStorage.getItem("sd_name") || "").trim();
  if (userName) window.SDAPP?.setActiveUserIdFromName?.(userName);

  // ====== per-user keys ======
  const gradeKey = window.SDAPP?.userKey?.("grade") || "sd_grade";
  const params = new URLSearchParams(location.search);

  // grade: URL > per-user saved > fallback "1"
  let grade = params.get("grade") || localStorage.getItem(gradeKey) || "1";

  // kalau ada di URL, simpan sebagai grade aktif per-user
  if (params.get("grade")) localStorage.setItem(gradeKey, grade);

  // ====== UI refs ======
  const gradeBadge  = document.getElementById("gradeBadge");
  const subjectList = document.getElementById("subjectList");
  const titleEl     = document.getElementById("subjectTitle");
  const descEl      = document.getElementById("subjectDesc");
  const materialBox = document.getElementById("materialBox");
  const quizBox     = document.getElementById("quizBox");
  const markDoneBtn = document.getElementById("markDoneBtn");

  const content        = window.SD_CONTENT || {};
  const subjectsByGrade= content.subjectsByGrade || {};
  const subjectsMeta   = content.subjectsMeta || {};
  const materi         = content.materi || {};
  const kuis           = content.kuis || {};

  // ====== progress PER USER (ambil FRESH) ======
  function getProgressNow() {
    return window.SDAPP?.getProgress?.() || {};
  }
  function setDone(subjectId) {
    const key = `${grade}_${subjectId}`;
    const p = getProgressNow();
    p[key] = true;
    window.SDAPP?.setProgress?.(p);
  }

  // ====== subjects list by grade ======
  function getSubjectsByGrade(g) {
    return (subjectsByGrade[g] || []).map((id) => ({
      id,
      icon: subjectsMeta[id]?.icon || "📘",
      desc: subjectsMeta[id]?.desc || "",
    }));
  }

  function renderBadge() {
    if (!gradeBadge) return;
    const phase = window.SD_CONTENT?.curriculum?.grades?.[grade]?.phase;
    gradeBadge.textContent = phase ? `Kelas ${grade} • ${phase}` : `Kelas ${grade}`;
  }

  function renderSubjects() {
    if (!subjectList) return;
    subjectList.innerHTML = "";

    const progress = getProgressNow();
    const subjects = getSubjectsByGrade(grade);

    subjects.forEach((s) => {
      const key = `${grade}_${s.id}`;
      const done = !!progress[key];

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
      btn.innerHTML = `
        <span>${s.icon} ${s.id}</span>
        <span class="badge ${done ? "text-bg-success" : "text-bg-light border"}">
          ${done ? "Selesai" : "Belum"}
        </span>
      `;
      btn.onclick = () => openSubject(s);
      subjectList.appendChild(btn);
    });

    if (!subjects.length) {
      subjectList.innerHTML = `<div class="text-muted small">Belum ada mapel untuk kelas ${grade}.</div>`;
    }
  }

  // ===== Materi render =====
  function renderMaterial(data, subjectId) {
    if (!materialBox) return;

    if (!data || !Array.isArray(data) || data.length === 0) {
      materialBox.innerHTML = `<div class="text-muted">
        Materi belum diisi. Tambahkan di <code>window.SD_CONTENT.materi["${grade}"]["${subjectId}"]</code>.
      </div>`;
      return;
    }

    if (typeof data[0] === "string") {
      materialBox.innerHTML = `<ul>${data.map((x) => `<li>${x}</li>`).join("")}</ul>`;
      return;
    }

    const html = data
      .map((bab, idx) => {
        const judul = bab.judul
          ? `<div class="fw-bold mb-1">${bab.judul}</div>`
          : `<div class="fw-bold mb-1">Bab ${idx + 1}</div>`;

        const paragraf = bab.paragraf
          ? `<div class="mb-2">${String(bab.paragraf).replace(/\n/g, "<br>")}</div>`
          : "";

        const contoh =
          Array.isArray(bab.contoh) && bab.contoh.length
            ? `<div class="mb-2">
                <div class="small fw-bold">Contoh:</div>
                <ul class="mb-1">${bab.contoh.map((c) => `<li>${c}</li>`).join("")}</ul>
              </div>`
            : "";

        const ayoIngat = bab.ayoIngat
          ? `<div class="alert alert-warning py-2 px-3 mb-2">
              <b>Ayo ingat:</b> ${bab.ayoIngat}
            </div>`
          : "";

        const latihan =
          Array.isArray(bab.latihanMini) && bab.latihanMini.length
            ? `<div class="mb-2">
                <div class="small fw-bold">Latihan mini:</div>
                <ul class="mb-0">${bab.latihanMini.map((t) => `<li>${t}</li>`).join("")}</ul>
              </div>`
            : "";

        return `
          <div class="p-3 mb-3" style="border:2px solid rgba(0,0,0,.06); border-radius:18px; background:rgba(255,255,255,.75);">
            ${judul}
            ${paragraf}
            ${contoh}
            ${ayoIngat}
            ${latihan}
          </div>
        `;
      })
      .join("");

    materialBox.innerHTML = html;
  }

  // ===== Quiz helpers =====
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function shuffleOptions(question) {
    const pairs = (question.a || []).map((text, idx) => ({ text, idx }));
    const mixed = shuffleArray(pairs);
    const newCorrect = mixed.findIndex((p) => p.idx === question.correct);
    return { ...question, a: mixed.map((p) => p.text), correct: newCorrect };
  }

  function renderQuiz(itemsRaw, subjectId) {
    if (!quizBox) return;

    if (!itemsRaw || !itemsRaw.length) {
      quizBox.innerHTML = `<div class="text-muted">Kuis belum tersedia untuk <b>${subjectId}</b>.</div>`;
      return;
    }

    quizBox.innerHTML = `
      <div class="quiz-controls mb-3">
        <div class="quiz-left">
          <div class="quiz-field">
            <label class="form-label small mb-1">Tingkat</label>
            <select class="form-select form-select-sm" id="levelSelect">
              <option value="semua">Semua</option>
              <option value="mudah">Mudah</option>
              <option value="sedang">Sedang</option>
              <option value="sulit">Sulit</option>
            </select>
          </div>

          <label class="form-check small quiz-check">
            <input class="form-check-input" type="checkbox" id="shuffleCheck" checked>
            <span class="form-check-label">Acak soal</span>
          </label>
        </div>

        <button class="btn btn-outline-primary btn-sm quiz-start" id="startQuizBtn">Mulai</button>
      </div>

      <div id="quizInner"></div>
    `;

    const levelSelect  = quizBox.querySelector("#levelSelect");
    const shuffleCheck = quizBox.querySelector("#shuffleCheck");
    const startQuizBtn = quizBox.querySelector("#startQuizBtn");
    const quizInner    = quizBox.querySelector("#quizInner");

    startQuizBtn.onclick = () => {
      const level = levelSelect.value;

      let items = itemsRaw.slice();
      if (level !== "semua") items = items.filter((x) => (x.level || "mudah") === level);

      if (!items.length) {
        quizInner.innerHTML = `<div class="text-muted">Tidak ada soal untuk level ini.</div>`;
        return;
      }

      if (shuffleCheck.checked) items = shuffleArray(items);
      items = items.map(shuffleOptions);

      let idx = 0;
      let score = 0;
      const total = items.length;

      function draw() {
        const it = items[idx];
        const badge =
          it.level === "mudah" ? "text-bg-success" :
          it.level === "sedang" ? "text-bg-warning" :
          "text-bg-danger";

        quizInner.innerHTML = `
          <div class="d-flex justify-content-between small text-muted mb-2">
            <div>Soal ${idx + 1}/${total}</div>
            <div>Skor: ${score}</div>
          </div>
          <div class="mb-2">
            <span class="badge ${badge}">${it.level || "mudah"}</span>
          </div>
          <div class="fw-semibold mb-2">${it.q}</div>
          <div class="d-grid gap-2">
            ${(it.a || []).map((opt, i) => `
              <button class="btn btn-outline-primary text-start" data-i="${i}">${opt}</button>
            `).join("")}
          </div>
        `;

        quizInner.querySelectorAll("button[data-i]").forEach((btn) => {
          btn.onclick = () => {
            const i = Number(btn.getAttribute("data-i"));
            const isCorrect = i === it.correct;

            if (isCorrect) {
              score++;
              window.SDAPP?.fx?.yay?.();
              window.SDAPP?.fx?.correct?.();
            } else {
              window.SDAPP?.fx?.wrong?.();
              btn.classList.add("shake");
            }

            idx++;
            if (idx >= total) {
              window.SDAPP?.level?.addXP?.(score * 3, "Kuis");
              quizInner.innerHTML = `
                <div class="fw-bold">Kuis selesai 🎉</div>
                <div>Nilai: <span class="fw-bold">${score}</span> / ${total}</div>
                <button class="btn btn-outline-primary mt-2" id="retryQuiz">Ulangi</button>
              `;
              quizInner.querySelector("#retryQuiz").onclick = () => {
                idx = 0;
                score = 0;
                draw();
              };
              return;
            }
            draw();
          };
        });
      }

      draw();
    };
  }

  function openSubject(s) {
    if (titleEl) titleEl.textContent = s.id;
    if (descEl) descEl.textContent = s.desc || "";
    if (markDoneBtn) markDoneBtn.disabled = false;

    window.SDAPP?.fx?.tap?.();

    renderMaterial(materi?.[grade]?.[s.id], s.id);
    renderQuiz(kuis?.[grade]?.[s.id], s.id);

    if (markDoneBtn) {
      markDoneBtn.onclick = () => {
        setDone(s.id);
        renderSubjects();
        markDoneBtn.textContent = "✅ Sudah Selesai";
        setTimeout(() => (markDoneBtn.textContent = "✅ Selesai"), 900);
      };
    }
  }

  // ===== init =====
  renderBadge();
  renderSubjects();

  // refresh tombol profil navbar (cukup salah satu, tapi aman)
  window.SDAPP?.ui?.renderProfileButton?.();
})();
