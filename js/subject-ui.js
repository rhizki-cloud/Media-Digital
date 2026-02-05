// subject-ui.js (MODE SWITCH + ACTIONS) — Revised
(function () {
  const qs  = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => Array.from(p.querySelectorAll(s));

  // mode buttons
  const modeButtons = qsa(".mode-btn");
  if (!modeButtons.length) return;

  // panels
  const panels = {
    materi: qs("#panelMateri"),
    kuis:   qs("#panelKuis"),
    mini:   qs("#panelMini"),
  };

  // actions
  const actions = {
    openGames: qs("#actionOpenGames"),
    confetti:  qs("#actionConfetti"),
    tip:       qs("#actionTip"),
  };

  // optional: elements that depend on selected subject
  const subjectTitle = qs("#subjectTitle");
  const markDoneBtn  = qs("#markDoneBtn"); // kalau kamu mau disable/enable sesuai kondisi

  let currentMode = "materi";

  function safeSay(text, mood="happy") {
    try { window.SDAPP?.mascot?.say?.(text, mood); } catch (e) {}
  }

  function hideAllActions() {
    Object.values(actions).forEach((el) => el?.classList?.add("d-none"));
  }

  function showActions(mode) {
    hideAllActions();
    if (mode === "kuis") {
      actions.startQuiz?.classList.remove("d-none");
    } else if (mode === "mini") {
      actions.openGames?.classList.remove("d-none");
      actions.confetti?.classList.remove("d-none");
      actions.tip?.classList.remove("d-none");
    }
  }

  function showPanels(mode) {
    Object.keys(panels).forEach((k) => {
      if (!panels[k]) return;
      panels[k].style.display = (k === mode) ? "" : "none";
    });
  }

  function setActiveButton(mode) {
    modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
      btn.setAttribute("aria-pressed", btn.dataset.mode === mode ? "true" : "false");
    });
  }

  function setMode(mode, opts={}) {
    if (!panels[mode]) mode = "materi";
    currentMode = mode;

    showPanels(mode);
    setActiveButton(mode);
    showActions(mode);

    // mascot
    if (!opts.silent) {
      safeSay(
        mode === "materi"
          ? "Baca materinya dulu ya 📘🙂"
          : mode === "kuis"
          ? "Siap kuis! 🎯 Jawab pelan-pelan ya 😄"
          : "Mini latihan dulu yuk 🎮✨",
        mode === "kuis" ? "wow" : "happy"
      );
    }
  }

  // click mode buttons
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  // mini actions
  actions.confetti?.addEventListener("click", () => {
    window.SDAPP?.fx?.yay?.();
  });

  actions.tip?.addEventListener("click", () => {
    const bubble = qs("#bimoBubble");
    if (bubble) bubble.style.display = "";
    window.SDAPP?.fx?.tap?.();
    window.SDAPP?.mascot?.tip?.();
  });

  // expose minimal API supaya bisa dipanggil dari file lain
  window.SD_SUBJECT_UI = window.SD_SUBJECT_UI || {};
  window.SD_SUBJECT_UI.setMode = setMode;
  window.SD_SUBJECT_UI.getMode = () => currentMode;

  // default mode
  setMode("materi", { silent: true });
})();
