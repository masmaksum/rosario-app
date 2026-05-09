// i18n.js — dispatcher multibahasa.
// Ekspor tiga helper: getPrayers, getMysteries, getUiStrings.
// Bahasa yang didukung: id (default), jv, en, la.

import { PRAYERS_ID } from "./prayers.id";
import { PRAYERS_JV } from "./prayers.jv";
import { PRAYERS_EN } from "./prayers.en";
import { PRAYERS_LA } from "./prayers.la";

import { MYSTERIES_ID } from "./mysteries.id";
import { MYSTERIES_JV } from "./mysteries.jv";
import { MYSTERIES_EN } from "./mysteries.en";
import { MYSTERIES_LA } from "./mysteries.la";

import { UI_STRINGS } from "./uiStrings";

const PRAYERS_MAP  = { id: PRAYERS_ID,   jv: PRAYERS_JV,   en: PRAYERS_EN,   la: PRAYERS_LA  };
const MYSTERIES_MAP = { id: MYSTERIES_ID, jv: MYSTERIES_JV, en: MYSTERIES_EN, la: MYSTERIES_LA };

export function getPrayers(lang = "id") {
  return PRAYERS_MAP[lang] ?? PRAYERS_MAP["id"];
}

export function getMysteries(lang = "id") {
  return MYSTERIES_MAP[lang] ?? MYSTERIES_MAP["id"];
}

const _ID_ALIAS = { gembira: "joyful", sedih: "sorrowful", mulia: "glorious", terang: "luminous" };

export function getMysteryById(id, lang = "id") {
  const resolved = _ID_ALIAS[id] ?? id;
  return getMysteries(lang).find((m) => m.id === resolved) ?? null;
}

export function getUiStrings(lang = "id") {
  return UI_STRINGS[lang] ?? UI_STRINGS["id"];
}

export const SUPPORTED_LANGUAGES = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "jv", label: "Basa Jawa" },
  { code: "en", label: "English" },
  { code: "la", label: "Lingua Latina" },
];

export const DEFAULT_PATTERN = {
  id: "full",
  jv: "full",
  en: "simple",
  la: "simple",
};
