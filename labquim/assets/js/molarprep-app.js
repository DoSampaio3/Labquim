/* MolarPrep · application logic
 * Depends on I18N being defined (i18n.js loaded first).
 */

const APP = {
  lang: "es",
  activeTab: "sol",
  deferredInstallPrompt: null
};

const DOM = {
  langEs: document.getElementById("lang-es"),
  langEn: document.getElementById("lang-en"),

  btnClearAll: document.getElementById("btn-clear-all"),
  btnInstall: document.getElementById("install-btn"),
  btnInfo: document.getElementById("btn-info"),

  sheetBackdrop: document.getElementById("sheet-backdrop"),
  btnCloseSheet: document.getElementById("btn-close-sheet"),

  tiles: Array.from(document.querySelectorAll("[data-go]")),
  panels: {
    sol: document.getElementById("panel-sol"),
    liq: document.getElementById("panel-liq")
  },

  cards: {
    solids: document.getElementById("card-solids"),
    liquids: document.getElementById("card-liquids")
  },

  // solids
  s_mw: document.getElementById("s_mw"),
  s_m: document.getElementById("s_m"),
  s_m_u: document.getElementById("s_m_u"),
  s_v: document.getElementById("s_v"),
  s_v_u: document.getElementById("s_v_u"),
  btnCalcSolids: document.getElementById("btn-calc-solids"),
  resSolids: document.getElementById("res-solids"),
  outMass: document.getElementById("out_mass"),
  outMassG: document.getElementById("out_mass_g"),
  solidsMeta: document.getElementById("solids-meta"),

  // liquids
  l_rho: document.getElementById("l_rho"),
  l_p: document.getElementById("l_p"),
  l_mw: document.getElementById("l_mw"),
  l_m2: document.getElementById("l_m2"),
  l_v2: document.getElementById("l_v2"),
  btnCalcLiquids: document.getElementById("btn-calc-liquids"),
  resLiquids: document.getElementById("res-liquids"),
  outVol: document.getElementById("out_vol"),
  outVolL: document.getElementById("out_vol_L"),
  outM1: document.getElementById("out_m1"),
  liquidsMeta: document.getElementById("liquids-meta")
};

/* ---------- i18n ---------- */
function t(key) {
  const pack = I18N[APP.lang] || I18N.es;
  return pack[key] ?? key;
}

function applyTranslations(lang) {
  const pack = I18N[lang] || I18N.es;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (pack[key]) node.innerHTML = pack[key];
  });
  DOM.langEs.setAttribute("aria-selected", String(lang === "es"));
  DOM.langEn.setAttribute("aria-selected", String(lang === "en"));
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  APP.lang = lang;
  applyTranslations(lang);
  try { localStorage.setItem("molarprep_lang", lang); } catch (_) {}
}

function loadSavedLanguage() {
  try {
    const saved = localStorage.getItem("molarprep_lang");
    if (saved && I18N[saved]) APP.lang = saved;
  } catch (_) {}
}

/* ---------- Tabs ---------- */
function setActiveTab(key) {
  if (!DOM.panels[key]) return;
  APP.activeTab = key;
  Object.entries(DOM.panels).forEach(([k, el]) => el.classList.toggle("active", k === key));
  DOM.tiles.forEach((tile) => tile.classList.toggle("active", tile.dataset.go === key));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Utilities ---------- */
function parseNum(el) {
  const v = Number.parseFloat(el.value);
  return Number.isFinite(v) ? v : NaN;
}

function isPositiveFinite(v) {
  return Number.isFinite(v) && v > 0;
}

function setCardValidity(cardEl, isValid = true) {
  cardEl.classList.toggle("invalid", !isValid);
}

function showBox(boxEl, mode = "normal") {
  boxEl.classList.add("visible");
  boxEl.classList.remove("error");
  if (mode === "error") boxEl.classList.add("error");
}

function hideBox(boxEl) {
  boxEl.classList.remove("visible", "error");
}

function formatNumber(value, decimals = 6) {
  if (!Number.isFinite(value)) return t("err");
  const abs = Math.abs(value);
  if (abs >= 1000 || (abs > 0 && abs < 0.000001)) return value.toExponential(3);
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

// Auto-format outputs with metric prefixes: g -> mg -> µg, L -> mL -> µL
function formatWithMetricPrefix(value, unit) {
  if (!isPositiveFinite(value)) return t("err");
  if (value >= 1)    return `${value.toFixed(3)} <span class="u">${unit}</span>`;
  if (value >= 1e-3) return `${(value * 1e3).toFixed(2)} <span class="u">m${unit}</span>`;
  return `${(value * 1e6).toFixed(2)} <span class="u">μ${unit}</span>`;
}

/* ---------- Calculations ---------- */
function calculateSolids() {
  const molecularWeight        = parseNum(DOM.s_mw);
  const targetMolarityValue    = parseNum(DOM.s_m);
  const targetMolarityFactor   = Number.parseFloat(DOM.s_m_u.value);
  const finalVolumeValue       = parseNum(DOM.s_v);
  const finalVolumeFactor      = Number.parseFloat(DOM.s_v_u.value);

  const targetMolarity_M = targetMolarityValue * targetMolarityFactor;
  const finalVolume_L    = finalVolumeValue    * finalVolumeFactor;

  const inputsAreValid = [molecularWeight, targetMolarity_M, finalVolume_L].every(isPositiveFinite);

  setCardValidity(DOM.cards.solids, inputsAreValid);

  if (!inputsAreValid) {
    showBox(DOM.resSolids, "error");
    DOM.outMass.textContent  = t("err");
    DOM.outMassG.textContent = t("err");
    DOM.solidsMeta.textContent = t("err_inputs");
    return;
  }

  const requiredMass_g = targetMolarity_M * finalVolume_L * molecularWeight;

  showBox(DOM.resSolids);
  DOM.outMass.innerHTML  = formatWithMetricPrefix(requiredMass_g, "g");
  DOM.outMassG.textContent = formatNumber(requiredMass_g, 6);

  DOM.solidsMeta.innerHTML = `
    <div class="tags">
      <span class="tag">M = ${formatNumber(targetMolarity_M, 6)} <span class="u">M</span></span>
      <span class="tag">V = ${formatNumber(finalVolume_L, 6)} <span class="u">L</span></span>
      <span class="tag">MW = ${formatNumber(molecularWeight, 4)} <span class="u">g/mol</span></span>
      <span class="tag mono">m = M·V·MW</span>
    </div>
  `;
}

function calculateLiquids() {
  const density_g_mL      = parseNum(DOM.l_rho);
  const purity_percent    = parseNum(DOM.l_p);
  const molecularWeight   = parseNum(DOM.l_mw);
  const targetMolarity_M  = parseNum(DOM.l_m2);
  const targetVolume_mL   = parseNum(DOM.l_v2);

  const purityIsValid   = isPositiveFinite(purity_percent) && purity_percent <= 100;
  const purity_fraction = purity_percent / 100;
  const targetVolume_L  = targetVolume_mL / 1000;

  const inputsAreValid =
    [density_g_mL, molecularWeight, targetMolarity_M, targetVolume_L].every(isPositiveFinite) && purityIsValid;

  setCardValidity(DOM.cards.liquids, inputsAreValid);

  if (!inputsAreValid) {
    showBox(DOM.resLiquids, "error");
    DOM.outVol.textContent   = t("err");
    DOM.outVolL.textContent  = t("err");
    DOM.outM1.textContent    = t("err");
    DOM.liquidsMeta.textContent = purityIsValid ? t("err_inputs") : t("err_purity");
    return;
  }

  const stockMolarity_M = (purity_fraction * density_g_mL * 1000) / molecularWeight;

  if (!isPositiveFinite(stockMolarity_M)) {
    showBox(DOM.resLiquids, "error");
    DOM.outVol.textContent      = t("err");
    DOM.outVolL.textContent     = t("err");
    DOM.outM1.textContent       = t("err");
    DOM.liquidsMeta.textContent = t("err_inputs");
    return;
  }

  const requiredStockVolume_L = (targetMolarity_M * targetVolume_L) / stockMolarity_M;

  showBox(DOM.resLiquids);
  DOM.outVol.innerHTML     = formatWithMetricPrefix(requiredStockVolume_L, "L");
  DOM.outVolL.textContent  = formatNumber(requiredStockVolume_L, 8);
  DOM.outM1.textContent    = formatNumber(stockMolarity_M, 4);

  DOM.liquidsMeta.innerHTML = `
    <div class="tags">
      <span class="tag">ρ = ${formatNumber(density_g_mL, 4)} <span class="u">g/mL</span></span>
      <span class="tag">P = ${formatNumber(purity_percent, 2)}<span class="u">%</span></span>
      <span class="tag">MW = ${formatNumber(molecularWeight, 4)} <span class="u">g/mol</span></span>
      <span class="tag mono">M1 = (P·ρ·1000)/MW</span>
      <span class="tag mono">V1 = (M2·V2)/M1</span>
    </div>
  `;
}

/* ---------- Clear all ---------- */
function clearAll() {
  [DOM.s_mw, DOM.s_m, DOM.s_v, DOM.l_rho, DOM.l_p, DOM.l_mw, DOM.l_m2, DOM.l_v2]
    .forEach((el) => { el.value = ""; });

  DOM.s_m_u.value = "1";
  DOM.s_v_u.value = "1";

  hideBox(DOM.resSolids);
  hideBox(DOM.resLiquids);

  setCardValidity(DOM.cards.solids,  true);
  setCardValidity(DOM.cards.liquids, true);

  DOM.outMass.textContent  = "---";
  DOM.outMassG.textContent = "---";
  DOM.solidsMeta.textContent = "";

  DOM.outVol.textContent      = "---";
  DOM.outVolL.textContent     = "---";
  DOM.outM1.textContent       = "---";
  DOM.liquidsMeta.textContent = "";
}

/* ---------- Info sheet ---------- */
function openSheet()  {
  DOM.sheetBackdrop.classList.add("open");
  DOM.sheetBackdrop.setAttribute("aria-hidden", "false");
}
function closeSheet() {
  DOM.sheetBackdrop.classList.remove("open");
  DOM.sheetBackdrop.setAttribute("aria-hidden", "true");
}

/* ---------- PWA install + SW ---------- */
function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    APP.deferredInstallPrompt = event;
    DOM.btnInstall.hidden = false;
  });

  DOM.btnInstall.addEventListener("click", async () => {
    if (!APP.deferredInstallPrompt) return;
    APP.deferredInstallPrompt.prompt();
    APP.deferredInstallPrompt = null;
    DOM.btnInstall.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    DOM.btnInstall.hidden = true;
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("SW registration failed:", error);
    });
  });
}

function setupiOSInstallBanner() {
  const isIOS       = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const dismissed   = (() => { try { return localStorage.getItem("mp_ios_banner"); } catch (_) {} return null; })();
  if (!isIOS || isStandalone || dismissed) return;

  const banner = document.getElementById("ios-install-banner");
  if (banner) banner.classList.add("visible");

  document.getElementById("btn-ios-dismiss")?.addEventListener("click", () => {
    banner?.classList.remove("visible");
    try { localStorage.setItem("mp_ios_banner", "1"); } catch (_) {}
  });
}

/* ---------- Events ---------- */
function bindEvents() {
  // language
  DOM.langEs.addEventListener("click", () => setLanguage("es"));
  DOM.langEn.addEventListener("click", () => setLanguage("en"));

  // tiles
  DOM.tiles.forEach((tile) => tile.addEventListener("click", () => setActiveTab(tile.dataset.go)));

  // calc buttons
  DOM.btnCalcSolids.addEventListener("click",  calculateSolids);
  DOM.btnCalcLiquids.addEventListener("click", calculateLiquids);

  // clear
  DOM.btnClearAll.addEventListener("click", clearAll);

  // info sheet
  DOM.btnInfo.addEventListener("click", openSheet);
  DOM.btnCloseSheet.addEventListener("click", closeSheet);
  DOM.sheetBackdrop.addEventListener("click", (e) => {
    if (e.target === DOM.sheetBackdrop) closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && DOM.sheetBackdrop.classList.contains("open")) closeSheet();
  });

  // Enter key triggers calculation on active panel
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const panel = el.closest(".panel");
      if (!panel) return;
      if (panel.id === "panel-sol") calculateSolids();
      else if (panel.id === "panel-liq") calculateLiquids();
    });

    // soft-reset invalid state while typing
    el.addEventListener("input", () => {
      const card = el.closest(".card");
      if (card) setCardValidity(card, true);
    });
  });

  // auto-refresh results once they are visible (debounced)
  const debounce = (fn, ms = 170) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const autoSol = debounce(() => { if (DOM.resSolids.classList.contains("visible"))  calculateSolids();  }, 180);
  const autoLiq = debounce(() => { if (DOM.resLiquids.classList.contains("visible")) calculateLiquids(); }, 180);

  [DOM.s_mw, DOM.s_m, DOM.s_m_u, DOM.s_v, DOM.s_v_u].forEach((el) => el.addEventListener("input", autoSol));
  [DOM.l_rho, DOM.l_p, DOM.l_mw, DOM.l_m2, DOM.l_v2].forEach((el) => el.addEventListener("input", autoLiq));
}

/* ---------- Init ---------- */
function init() {
  loadSavedLanguage();
  applyTranslations(APP.lang);
  bindEvents();
  setupInstallPrompt();
  setupiOSInstallBanner();
  registerServiceWorker();
  clearAll();
  setActiveTab("sol");   // always open on Module 1
}

init();
