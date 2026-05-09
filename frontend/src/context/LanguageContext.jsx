import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getPrayers, getMysteries, getMysteryById as i18nGetById, getUiStrings, DEFAULT_PATTERN } from "../data/i18n";

const LanguageContext = createContext(null);

const LANG_KEY    = "rosario:language";
const PATTERN_KEY = "rosario:pattern";

function readLS(key, fallback) {
  try { return localStorage.getItem(key) || fallback; }
  catch { return fallback; }
}

export function LanguageProvider({ children }) {
  const [language, _setLanguage] = useState(() => readLS(LANG_KEY, "id"));
  const [pattern,  _setPattern]  = useState(() => {
    const saved = readLS(PATTERN_KEY, null);
    if (saved) return saved;
    const lang = readLS(LANG_KEY, "id");
    return DEFAULT_PATTERN[lang] || "full";
  });

  const setLanguage = useCallback((code) => {
    _setLanguage(code);
    localStorage.setItem(LANG_KEY, code);
    // reset pattern ke default bahasa baru jika belum di-override user
    const current = readLS(PATTERN_KEY, null);
    if (!current) _setPattern(DEFAULT_PATTERN[code] || "full");
  }, []);

  const setPattern = useCallback((p) => {
    _setPattern(p);
    localStorage.setItem(PATTERN_KEY, p);
  }, []);

  const prayers   = useMemo(() => getPrayers(language),   [language]);
  const mysteries = useMemo(() => getMysteries(language),  [language]);
  const ui        = useMemo(() => getUiStrings(language),  [language]);

  const getMysteryByIdLang = useCallback(
    (id) => i18nGetById(id, language),
    [language]
  );

  const getRecommendedMysteryId = useCallback((date = new Date()) => {
    const DAY_MAP = { 0: "glorious", 1: "joyful", 2: "sorrowful", 3: "glorious", 4: "luminous", 5: "sorrowful", 6: "joyful" };
    return DAY_MAP[date.getDay()];
  }, []);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      pattern,
      setPattern,
      prayers,
      mysteries,
      ui,
      getMysteryById: getMysteryByIdLang,
      getRecommendedMysteryId,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
