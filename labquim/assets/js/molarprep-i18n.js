/* MolarPrep · i18n strings */
const I18N = {
  es: {
    subtitle: "Host Cell Lab Suite · Preparación rápida de soluciones.",
    btnDocs: "Repo",
    btnClear: "Limpiar",
    btnInstall: "Instalar",
    btnClose: "Cerrar",
    ios_install_hint: "Para instalar: toca <strong>Compartir</strong> → <strong>Añadir al inicio</strong>",

    tile_sol: "Reactivos sólidos",
    tile_sol_sub: "m = M·V·PM",
    tile_liq: "Reactivos líquidos",
    tile_liq_sub: "ρ + pureza → M1 → V1",

    res_title: "Resultados",
    details: "Detalles y supuestos",

    s_title: "Reactivos sólidos",
    s_hint: "Masa a pesar para una solución molar meta",
    s_unit_hint: "Se normaliza internamente a M.",
    s_vol_hint: "Se normaliza internamente a L.",

    l_title: "Reactivos líquidos",
    l_hint: "Volumen de stock con densidad y pureza",
    l_targets: "Metas",
    l_unit_hint: "V se normaliza internamente a L.",
    l_rho: "ρ (g/mL)",
    l_p: "Pureza (%)",

    lblMW: "Peso molecular <span class=\"unit\">(g/mol)</span>",
    lblMolarity: "Molaridad meta",
    lblVol: "Volumen final",
    lblStock: "Densidad (ρ) y % pureza",
    lblTargetM: "M meta (M)",
    lblTargetV: "V meta (mL)",

    btnCalcMass: "Calcular masa",
    btnCalcStock: "Calcular stock",

    resMass: "Masa requerida",
    resMass_g: "Masa (g)",
    resVol: "Volumen de stock",
    resVol_L: "Volumen (L)",
    resM1: "Molaridad estimada del stock (M1)",

    info_title: "Fundamentos y advertencias",
    info_sol_title: "Reactivos sólidos",
    info_sol_p: "La masa se calcula con molaridad (M), volumen final (L) y peso molecular (g/mol).",
    info_liq_title: "Reactivos líquidos",
    info_liq_p: "Para líquidos concentrados, se estima la molaridad del stock con densidad y pureza, y luego se calcula el volumen requerido.",
    info_units: "La salida se auto-formatea: g → mg → μg, L → mL → μL.",
    info_warn_title: "Advertencias prácticas",
    info_warn_p: "Esta herramienta es un apoyo. Verifica unidades, etiquetas y SOPs antes de preparar soluciones.",

    author: "Autor: Emiliano Balderas Ramírez",
    authorBio: "Ingeniero en Biotecnología | Estudiante de Doctorado en Bioquímica, IBt-UNAM",

    err: "ERR",
    err_inputs: "Revisa los campos: deben ser positivos y válidos.",
    err_purity: "La pureza debe ser >0 y ≤100."
  },

  en: {
    subtitle: "Host Cell Lab Suite · Fast molarity & stock calculations.",
    btnDocs: "Repo",
    btnClear: "Clear",
    btnInstall: "Install",
    btnClose: "Close",
    ios_install_hint: "To install: tap <strong>Share</strong> → <strong>Add to Home Screen</strong>",

    tile_sol: "Solid reagents",
    tile_sol_sub: "m = M·V·MW",
    tile_liq: "Liquid reagents",
    tile_liq_sub: "ρ + purity → M1 → V1",

    res_title: "Results",
    details: "Details & assumptions",

    s_title: "Solid reagents",
    s_hint: "Mass to weigh for a target molar solution",
    s_unit_hint: "Internally normalized to M.",
    s_vol_hint: "Internally normalized to L.",

    l_title: "Liquid reagents",
    l_hint: "Stock volume from density and purity",
    l_targets: "Targets",
    l_unit_hint: "V is normalized to L for the internal calculation.",
    l_rho: "ρ (g/mL)",
    l_p: "Purity (%)",

    lblMW: "Molecular weight <span class=\"unit\">(g/mol)</span>",
    lblMolarity: "Target molarity",
    lblVol: "Final volume",
    lblStock: "Density (ρ) and % purity",
    lblTargetM: "Target M (M)",
    lblTargetV: "Target V (mL)",

    btnCalcMass: "Calculate mass",
    btnCalcStock: "Calculate stock",

    resMass: "Required mass",
    resMass_g: "Mass (g)",
    resVol: "Stock volume",
    resVol_L: "Volume (L)",
    resM1: "Estimated stock molarity (M1)",

    info_title: "Scientific fundamentals & warnings",
    info_sol_title: "Solid reagents",
    info_sol_p: "Mass is computed from target molarity (M), final volume (L), and molecular weight (g/mol).",
    info_liq_title: "Liquid reagents",
    info_liq_p: "For concentrated liquids, stock molarity is estimated using density and purity, then used to compute the required stock volume.",
    info_units: "Outputs are auto-formatted: g → mg → μg, L → mL → μL.",
    info_warn_title: "Practical warnings",
    info_warn_p: "This tool is a calculation aid. Always verify units, labels, and SOP constraints before preparing solutions.",

    author: "Author: Emiliano Balderas Ramírez",
    authorBio: "Biotechnology Engineer | PhD Student in Biochemistry, IBt-UNAM",

    err: "ERR",
    err_inputs: "Check inputs: values must be positive and valid.",
    err_purity: "Purity must be >0 and ≤100."
  }
};
