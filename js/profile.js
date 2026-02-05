// profile.js (REVISI FULL: multi-user + avatar realtime + progress/grade per user)
(function () {
  "use strict";

  // ===== Helpers =====
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function getName() {
    return (localStorage.getItem("sd_name") || "").trim();
  }

  // Pastikan akun aktif mengikuti nama yang sedang login (penting untuk multi-user)
  function ensureActiveUser() {
    const n = getName();
    if (n) window.SDAPP?.setActiveUserIdFromName?.(n);
  }

  function getAvatarKey() {
    return window.SDAPP?.userKey?.("avatar") || "sd_avatar";
  }

  function getAvatar() {
    return (localStorage.getItem(getAvatarKey()) || "😀").trim();
  }

  function getGradeKey() {
    return window.SDAPP?.userKey?.("grade") || "sd_grade";
  }

  function getSavedGrade() {
    return (localStorage.getItem(getGradeKey()) || "1").trim();
  }

  // Render tombol profil di navbar (data-profile-btn / optional id btnProfile)
  function renderProfileButtons() {
    const name = getName();
    const av = getAvatar();

    const btn = document.getElementById("btnProfile");
    if (btn) btn.textContent = name ? `${av} ${name}` : `${av} Profil`;

    document.querySelectorAll("[data-profile-btn]").forEach((el) => {
      el.textContent = name ? `${av} ${name}` : `${av} Profil`;
    });
  }

  // expose (biar halaman lain bisa panggil kalau perlu)
  window.SDAPP = window.SDAPP || {};
  window.SDAPP.ui = window.SDAPP.ui || {};
  window.SDAPP.ui.renderProfileButtons = renderProfileButtons;

  // ===== INIT: set akun aktif dulu =====
  ensureActiveUser();

  // ===== Data =====
  const subjectsByGrade = window.SD_CONTENT?.subjectsByGrade || {};
  const meta = window.SD_CONTENT?.subjectsMeta || {};

  // ✅ progress PER USER
  const prog = window.SDAPP?.getProgress?.() || {};

  // ===== Header (avatar + nama) =====
  const profileNameChip = document.getElementById("profileName");
  const profileNameTop = document.getElementById("profileNameTop");

  function renderProfileHeader(av) {
    const n = getName();
    if (profileNameChip) profileNameChip.textContent = n ? `${av} ${n}` : `${av} Profil`;
    if (profileNameTop) profileNameTop.textContent = n || "";
  }

  const savedAvatar = getAvatar();
  renderProfileHeader(savedAvatar);
  renderProfileButtons();

  // ===== Avatar Picker =====
  const avatarPick = document.getElementById("avatarPick");
  const avatarTitle = document.getElementById("currentAvatarTitle");

  if (avatarPick) {
    const avatarItems = avatarPick.querySelectorAll(".avatar");

    function applyAvatar(chosen) {
      chosen = (chosen || "😀").trim();
      localStorage.setItem(getAvatarKey(), chosen);

      // set active + aksesibilitas
      avatarItems.forEach((x) => {
        const isActive = x.textContent.trim() === chosen;
        x.classList.toggle("active", isActive);
        x.setAttribute("role", "button");
        x.setAttribute("tabindex", "0");
        x.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (avatarTitle) avatarTitle.textContent = chosen;

      // update header + navbar realtime
      renderProfileHeader(chosen);
      renderProfileButtons();

      window.SDAPP?.fx?.yay?.();
      window.SDAPP?.mascot?.say?.("Avatar kamu diganti! 😄🎨", "happy");

      // kalau ada renderProfileButton versi app.js, panggil juga (biar sinkron)
      window.SDAPP?.ui?.renderProfileButton?.();
    }

    // set awal
    applyAvatar(savedAvatar);

    avatarItems.forEach((item) => {
      item.addEventListener("click", () => applyAvatar(item.textContent));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          applyAvatar(item.textContent);
        }
      });
    });
  }

  // ===== Hitung progress total =====
  let totalItems = 0;
  let doneItems = 0;

  Object.keys(subjectsByGrade).forEach((g) => {
    (subjectsByGrade[g] || []).forEach((s) => {
      totalItems++;
      if (prog[`${g}_${s}`]) doneItems++;
    });
  });

  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
  setText("pStars", `⭐ ${doneItems}`);
  setText("pPct", `${pct}%`);

  const pBar = document.getElementById("pBar");
  if (pBar) pBar.style.width = `${pct}%`;

  // ===== Badges =====
  function countSubjectDone(subjectName) {
    let c = 0;
    Object.keys(subjectsByGrade).forEach((g) => {
      (subjectsByGrade[g] || []).forEach((s) => {
        if (s === subjectName && prog[`${g}_${s}`]) c++;
      });
    });
    return c;
  }

  const badges = [
    { icon: "➗🏆", title: "Jago Matematika", desc: "Selesaikan 5 mapel Matematika", need: 5, val: () => countSubjectDone("Matematika") },
    { icon: "📖👑", title: "Raja Membaca", desc: "Selesaikan 5 mapel Bahasa Indonesia", need: 5, val: () => countSubjectDone("Bahasa Indonesia") },
    { icon: "🇮🇩🤝", title: "Anak Pancasila", desc: "Selesaikan 4 mapel Pancasila", need: 4, val: () => countSubjectDone("Pendidikan Pancasila") },
    { icon: "🏃⭐", title: "Anak Sehat", desc: "Selesaikan 4 mapel PJOK", need: 4, val: () => countSubjectDone("PJOK") },
    { icon: "🎨✨", title: "Seniman Hebat", desc: "Selesaikan 4 mapel Seni", need: 4, val: () => countSubjectDone("Seni dan Budaya") },
    { icon: "🔥🎯", title: "Pejuang Belajar", desc: "Selesaikan 10 mapel apapun", need: 10, val: () => doneItems },
  ];

  const got = badges.filter((b) => b.val() >= b.need).length;
  setText("pBadges", `🏅 ${got}`);

  const badgeGrid = document.getElementById("badgeGrid");
  if (badgeGrid) {
    badgeGrid.innerHTML = "";
    badges.forEach((b) => {
      const val = b.val();
      const ok = val >= b.need;

      const col = document.createElement("div");
      col.className = "col-12 col-md-6";
      col.innerHTML = `
        <div class="badge-card ${ok ? "" : "opacity-75"}">
          <div class="badge-ico">${b.icon}</div>
          <div class="flex-grow-1">
            <div class="t">${b.title} ${ok ? "✅" : "⏳"}</div>
            <div class="d">${b.desc}</div>
            <div class="kid-bar mt-2"><div style="width:${Math.min(100, Math.round((val / b.need) * 100))}%"></div></div>
            <div class="small text-muted mt-1">${val}/${b.need}</div>
          </div>
        </div>
      `;
      badgeGrid.appendChild(col);
    });
  }

  // ===== Progress per Kelas =====
  const gradeSelect = document.getElementById("gradeSelect");
  const progressList = document.getElementById("progressList");

  function renderGrade(g) {
    if (!progressList) return;

    const list = subjectsByGrade[g] || [];
    if (!list.length) {
      progressList.innerHTML = `<div class="text-muted">Belum ada mapel di kelas ${g}.</div>`;
      return;
    }

    progressList.innerHTML = list
      .map((s) => {
        const ok = !!prog[`${g}_${s}`];
        const icon = meta[s]?.icon || "📘";
        return `
          <div class="badge-card mb-2">
            <div class="badge-ico">${icon}</div>
            <div class="flex-grow-1">
              <div class="t">${s} ${ok ? "⭐" : ""}</div>
              <div class="d">${ok ? "Sudah selesai! Hebat 🎉" : "Belum selesai, ayo lanjut 😄"}</div>
            </div>
            <div class="kid-chip">${ok ? "✅" : "⏳"}</div>
          </div>
        `;
      })
      .join("");

    window.SDAPP?.mascot?.say?.(`Ini progress Kelas ${g} ya 📊✨`, "thinking");
  }

  if (gradeSelect) {
    const gradeKey = getGradeKey();
    const savedGrade = getSavedGrade();

    gradeSelect.value = savedGrade;
    renderGrade(savedGrade);

    gradeSelect.addEventListener("change", () => {
      const g = (gradeSelect.value || "1").trim();
      localStorage.setItem(gradeKey, g); // ✅ per-user
      renderGrade(g);
    });
  }
})();
