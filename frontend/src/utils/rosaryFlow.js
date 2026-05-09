// Build step-by-step Rosary flow.
//
// pattern = "full"   — pola lengkap (default Indonesia/Jawa)
// pattern = "simple" — pola ringkas (default Latin/Inggris)
//
// sectionKey diterjemahkan di PrayPage via ui[sectionKey]:
//   "opening"          — Pembukaan / Opening / Initium / Pambuka
//   "prayerIntentions" — Intensi Doa / Prayer Intentions / Intentiones
//   "mysteryOf"        — Peristiwa N dari 5 (dinamis, pakai mysteryEventOrder)
//   "hailMaryOf"       — Salam Maria N dari 10 (dinamis, pakai hailMaryIndex)
//   "closing"          — Penutupan / Closing / Conclusio / Panutup
//   "litany"           — Litani / Litany / Litaniae
//   "finished"         — Selesai / Finished / Perfectum / Rampung

import { PRAYERS } from "../data/prayers";

function makeStep(base) {
  return { decadeIndex: null, hailMaryIndex: null, ...base };
}

export function buildRosarySteps(mystery, starredLitaniIds = [], pattern = "full") {
  const steps = [];
  const isFull = pattern !== "simple";

  // ====== Opening ======
  steps.push(makeStep({ type: "prayer", prayerId: "tanda-salib", sectionKey: "opening" }));
  steps.push(makeStep({ type: "intentions",                       sectionKey: "prayerIntentions" }));
  steps.push(makeStep({ type: "prayer", prayerId: "aku-percaya", sectionKey: "opening" }));

  if (isFull) {
    steps.push(makeStep({ type: "prayer", prayerId: "kemuliaan",  sectionKey: "opening" }));
    steps.push(makeStep({ type: "prayer", prayerId: "terpujilah", sectionKey: "opening" }));
  }

  steps.push(makeStep({ type: "prayer", prayerId: "bapa-kami", sectionKey: "opening" }));

  if (isFull) {
    steps.push(makeStep({ type: "prayer", prayerId: "salam-putri",    sectionKey: "opening" }));
    steps.push(makeStep({ type: "prayer", prayerId: "salam-bunda",    sectionKey: "opening" }));
    steps.push(makeStep({ type: "prayer", prayerId: "salam-mempelai", sectionKey: "opening" }));
    steps.push(makeStep({ type: "prayer", prayerId: "kemuliaan",      sectionKey: "opening" }));
    steps.push(makeStep({ type: "prayer", prayerId: "terpujilah",     sectionKey: "opening" }));
  } else {
    for (let k = 0; k < 3; k++) {
      steps.push(makeStep({ type: "prayer", prayerId: "salam-maria", sectionKey: "opening" }));
    }
    steps.push(makeStep({ type: "prayer", prayerId: "kemuliaan", sectionKey: "opening" }));
  }

  // ====== 5 Mysteries ======
  mystery.events.forEach((event, idx) => {
    steps.push({
      type: "reflection",
      mysteryEventOrder: event.order,
      eventTitle: event.title,
      fullTitle: event.fullTitle || "",
      scripture: event.scripture || "",
      leaderText: event.leaderText || "",
      responseText: event.responseText || "",
      sectionKey: "mysteryOf",
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    steps.push({
      type: "prayer", prayerId: "bapa-kami",
      sectionKey: "mysteryOf", mysteryEventOrder: event.order,
      decadeIndex: idx, hailMaryIndex: null,
    });
    for (let i = 1; i <= 10; i++) {
      steps.push({
        type: "prayer", prayerId: "salam-maria",
        sectionKey: "hailMaryOf",
        decadeIndex: idx, hailMaryIndex: i,
      });
    }
    steps.push({
      type: "prayer", prayerId: "kemuliaan",
      sectionKey: "mysteryOf", mysteryEventOrder: event.order,
      decadeIndex: idx, hailMaryIndex: null,
    });
    if (isFull) {
      steps.push({
        type: "prayer", prayerId: "terpujilah",
        sectionKey: "mysteryOf", mysteryEventOrder: event.order,
        decadeIndex: idx, hailMaryIndex: null,
      });
    }
    steps.push({
      type: "prayer", prayerId: "doa-fatima",
      sectionKey: "mysteryOf", mysteryEventOrder: event.order,
      decadeIndex: idx, hailMaryIndex: null,
    });
  });

  // ====== Closing ======
  steps.push(makeStep({ type: "prayer", prayerId: "salam-ya-ratu",  sectionKey: "closing" }));
  steps.push(makeStep({ type: "prayer", prayerId: "marilah-berdoa", sectionKey: "closing" }));
  for (const litaniId of starredLitaniIds) {
    steps.push(makeStep({ type: "litani", litaniId, sectionKey: "litany" }));
  }
  steps.push(makeStep({ type: "prayer", prayerId: "tanda-salib", sectionKey: "closing" }));

  // ====== Complete ======
  steps.push(makeStep({ type: "complete", sectionKey: "finished" }));

  return steps;
}

// prayers opsional — fallback ke PRAYERS (bahasa Indonesia)
export function getPrayerForStep(step, prayers = null) {
  if (!step || step.type !== "prayer") return null;
  const source = prayers || PRAYERS;
  return source[step.prayerId] ?? null;
}

export const DECADE_END_PRAYER_ID = "doa-fatima";
