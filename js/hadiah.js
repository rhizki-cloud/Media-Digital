(function () {
  const name = (localStorage.getItem("sd_name") || "").trim();
  if (name) window.SDAPP?.setActiveUserIdFromName?.(name);

  const prog = window.SDAPP?.getProgress?.() || {};
  const subjectsByGrade = window.SD_CONTENT?.subjectsByGrade || {};

  // compute stars: 1 per completed mapel
  let total = 0, done = 0;
  Object.keys(subjectsByGrade).forEach((g) => {
    (subjectsByGrade[g] || []).forEach((s) => {
      total++;
      if (prog[`${g}_${s}`]) done++;
    });
  });
  const stars = done;

  // badges count
  function countSubjectDone(subjectName) {
    let c = 0;
    Object.keys(subjectsByGrade).forEach((g) => {
      (subjectsByGrade[g] || []).forEach((s) => {
        if (s === subjectName && prog[`${g}_${s}`]) c++;
      });
    });
    return c;
  }

  const badgesRules = [
    { need: 5, val: () => countSubjectDone("Matematika") },
    { need: 5, val: () => countSubjectDone("Bahasa Indonesia") },
    { need: 4, val: () => countSubjectDone("Pendidikan Pancasila") },
    { need: 4, val: () => countSubjectDone("PJOK") },
    { need: 4, val: () => countSubjectDone("Seni dan Budaya") },
    { need: 10, val: () => done },
  ];
  const badges = badgesRules.filter((b) => b.val() >= b.need).length;

  document.getElementById("giftName").textContent = name ? `🎁 Hadiah ${name}` : "🎁 Hadiah Kamu";
  document.getElementById("gStars").textContent = `⭐ ${stars}`;
  document.getElementById("gBadges").textContent = `🏅 ${badges}`;

  const skins = [
    { id: "default", title: "Default Biru", icon: "🔵", req: "Gratis", can: () => true },
    { id: "space", title: "Space Ungu", icon: "🪐", req: "Butuh 5 ⭐", can: () => stars >= 5 },
    { id: "jungle", title: "Jungle Hijau", icon: "🌿", req: "Butuh 2 🏅", can: () => badges >= 2 },
    { id: "candy", title: "Candy Pink", icon: "🍭", req: "Butuh 12 ⭐", can: () => stars >= 12 },
  ];

  const unlockedKey = window.SDAPP?.userKey?.("unlocked_skins") || "sd_unlocked_skins";
  const skinKey = window.SDAPP?.userKey?.("skin") || "sd_skin";

  // ✅ init per-user storage kalau belum ada
  if (!localStorage.getItem(unlockedKey)) localStorage.setItem(unlockedKey, "[]");
  if (!localStorage.getItem(skinKey)) localStorage.setItem(skinKey, "default");

  const unlocked = (() => {
    try { return JSON.parse(localStorage.getItem(unlockedKey) || "[]"); }
    catch (e) { return []; }
  })();

  function saveUnlocked(arr) {
    localStorage.setItem(unlockedKey, JSON.stringify(arr));
  }

  // ✅ pastikan default selalu ada + disimpan
  if (!unlocked.includes("default")) {
    unlocked.push("default");
    saveUnlocked(unlocked);
  }

  const selected = localStorage.getItem(skinKey) || "default";
  const isUnlocked = (id) => unlocked.includes(id);

  // header skin progress
  const opened = Array.from(new Set(unlocked)).length;
  document.getElementById("gSkins").textContent = `${opened}/4`;
  const pct = Math.round((opened / 4) * 100);
  document.getElementById("gSkinBar").style.width = pct + "%";

  const grid = document.getElementById("skinGrid");
  grid.innerHTML = "";

  skins.forEach((s) => {
    const ok = isUnlocked(s.id);
    const canUnlock = s.can();

    const col = document.createElement("div");
    col.className = "col-12 col-md-6";
    col.innerHTML = `
      <div class="badge-card">
        <div class="badge-ico">${s.icon}</div>
        <div class="flex-grow-1">
          <div class="t">${s.title} ${ok ? "✅" : "🔒"}</div>
          <div class="d">${s.req}</div>
          <div class="d mt-1">Preview: <img src="aset/bimo-${s.id}-happy.svg" alt="preview" style="height:48px"/></div>
        </div>
        <div class="d-flex flex-column gap-2">
          ${ok
            ? `<button class="btn btn-primary btn-sm" data-act="use" data-id="${s.id}">
                ${selected === s.id ? "Dipakai ✅" : "Pakai 🎨"}
              </button>`
            : `<button class="btn btn-outline-primary btn-sm" data-act="unlock" data-id="${s.id}" ${canUnlock ? "" : "disabled"}>
                Buka 🔓
              </button>`}
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  grid.querySelectorAll("button[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.getAttribute("data-act");
      const id = btn.getAttribute("data-id");

      if (act === "unlock") {
        if (!unlocked.includes(id)) {
          unlocked.push(id);
          saveUnlocked(unlocked);

          window.SDAPP?.fx?.yay?.();
          window.SDAPP?.mascot?.say?.("Yeay! Skin baru kebuka! 🎁✨", "proud");
          setTimeout(() => location.reload(), 250);
        }
      }

      if (act === "use") {
        localStorage.setItem(skinKey, id);
        window.SDAPP?.fx?.yay?.();
        window.SDAPP?.mascot?.say?.("Oke! Sekarang Iky pakai skin baru 😄🎨", "happy");
        setTimeout(() => location.reload(), 250);
      }
    });
  });

  // refresh tombol profil navbar
  window.SDAPP?.ui?.renderProfileButton?.();
  window.SDAPP?.ui?.renderProfileButtons?.();
})();
