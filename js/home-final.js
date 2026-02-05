(function () {
  const name = (localStorage.getItem("sd_name") || "").trim();
  const hello = document.getElementById("helloChip");
  const logoutBtn = document.getElementById("logoutBtn");
  const kelasGrid = document.getElementById("kelasGrid");

  // pastikan akun aktif sinkron (multi-user)
  if (name) window.SDAPP?.setActiveUserIdFromName?.(name);

  // key grade per-user
  const gradeKey = window.SDAPP?.userKey?.("grade") || "sd_grade";

  // avatar + level per-user
  const av = window.SDAPP?.level?.getAvatar?.() || "😀";
  const lv = window.SDAPP?.level?.getProgress?.().level || 1;

  if (hello) hello.textContent = name ? `${av} Halo ${name}! (Lv ${lv})` : `${av} Halo! (Lv ${lv})`;

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("sd_name");
      // jangan remove sd_user_active
      location.href = "index.html";
    };
  }

  // progress per-user
  const prog = window.SDAPP?.getProgress?.() || {};
  const subjectsByGrade = window.SD_CONTENT?.subjectsByGrade || {};
  let totalItems = 0, doneItems = 0;

  Object.keys(subjectsByGrade).forEach((g) => {
    (subjectsByGrade[g] || []).forEach((s) => {
      totalItems++;
      if (prog[`${g}_${s}`] === true) doneItems++;
    });
  });

  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  const lvInfo = window.SDAPP?.level?.getProgress?.() || { level: 1, pct: 0, inLevelXP: 0, needXP: 0 };
  document.getElementById("lvHome").textContent = `🏆 Lv ${lvInfo.level}`;
  document.getElementById("xpHome").textContent = (lvInfo.level >= 10) ? "MAX" : `${lvInfo.inLevelXP}/${lvInfo.needXP} XP`;

  document.getElementById("statStars").textContent = `⭐ ${doneItems}`;
  document.getElementById("statDone").textContent = `✅ ${doneItems}`;
  document.getElementById("statPct").textContent = `${pct}%`;
  document.getElementById("statBar").style.width = `${pct}%`;

  // simpan grade per-user
  if (kelasGrid) {
    kelasGrid.querySelectorAll("[data-grade]").forEach((card) => {
      card.addEventListener("click", () => {
        const g = card.getAttribute("data-grade");
        localStorage.setItem(gradeKey, g);
        window.SDAPP?.fx?.yay?.();
        setTimeout(() => (location.href = `subject.html?grade=${g}`), 120);
      });
    });
  }

  // refresh tombol profil navbar (cukup salah satu)
  window.SDAPP?.ui?.renderProfileButton?.();
})();
