// Build the full step-by-step Rosary flow given a selected mystery.
// Each step is an object describing what the user prays at that screen.

import { PRAYERS } from "../data/prayers";

/**
 * Step types:
 *  - "prayer": shows a single prayer (title + text)
 *  - "reflection": shows mystery title + scripture + reflection + intention (for the start of each decade)
 *  - "complete": final completion screen
 *
 * Each step also carries:
 *   - decadeIndex (0-4) when inside a decade, otherwise null
 *   - hailMaryIndex (1-10) when it's a Hail Mary inside a decade, otherwise null
 *   - mysteryEventOrder (1-5) for reflection screens
 *   - label: short label shown to user ("Tanda Salib", "Salam Maria 6 dari 10", etc.)
 */

export function buildRosarySteps(mystery) {
  const steps = [];

  // Opening
  steps.push({
    type: "prayer",
    prayerId: "tanda-salib",
    label: "Pembukaan",
    decadeIndex: null,
    hailMaryIndex: null,
  });
  steps.push({
    type: "prayer",
    prayerId: "aku-percaya",
    label: "Pembukaan",
    decadeIndex: null,
    hailMaryIndex: null,
  });
  steps.push({
    type: "prayer",
    prayerId: "bapa-kami",
    label: "Pembukaan",
    decadeIndex: null,
    hailMaryIndex: null,
  });
  // 3 Hail Marys for faith, hope, charity
  for (let i = 1; i <= 3; i++) {
    steps.push({
      type: "prayer",
      prayerId: "salam-maria",
      label: `Salam Maria Pembukaan (${i}/3)`,
      decadeIndex: null,
      hailMaryIndex: null,
    });
  }
  steps.push({
    type: "prayer",
    prayerId: "kemuliaan",
    label: "Pembukaan",
    decadeIndex: null,
    hailMaryIndex: null,
  });

  // 5 decades
  mystery.events.forEach((event, idx) => {
    // Reflection screen
    steps.push({
      type: "reflection",
      mysteryEventOrder: event.order,
      eventTitle: event.title,
      scripture: event.scripture,
      reflection: event.reflection,
      intention: event.intention,
      label: `Peristiwa ${event.order} dari 5`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    // Bapa Kami
    steps.push({
      type: "prayer",
      prayerId: "bapa-kami",
      label: `Peristiwa ${event.order} — Bapa Kami`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    // 10 Hail Marys
    for (let i = 1; i <= 10; i++) {
      steps.push({
        type: "prayer",
        prayerId: "salam-maria",
        label: `Salam Maria ${i} dari 10`,
        decadeIndex: idx,
        hailMaryIndex: i,
      });
    }
    // Kemuliaan
    steps.push({
      type: "prayer",
      prayerId: "kemuliaan",
      label: `Peristiwa ${event.order} — Kemuliaan`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    // Doa Fatima
    steps.push({
      type: "prayer",
      prayerId: "doa-fatima",
      label: `Peristiwa ${event.order} — Doa Fatima`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
  });

  // Closing
  steps.push({
    type: "prayer",
    prayerId: "salam-ya-ratu",
    label: "Penutup",
    decadeIndex: null,
    hailMaryIndex: null,
  });
  steps.push({
    type: "prayer",
    prayerId: "doa-penutup",
    label: "Penutup",
    decadeIndex: null,
    hailMaryIndex: null,
  });
  steps.push({
    type: "prayer",
    prayerId: "tanda-salib",
    label: "Penutup",
    decadeIndex: null,
    hailMaryIndex: null,
  });

  // Completion
  steps.push({
    type: "complete",
    label: "Selesai",
    decadeIndex: null,
    hailMaryIndex: null,
  });

  return steps;
}

export function getPrayerForStep(step) {
  if (!step || step.type !== "prayer") return null;
  return PRAYERS[step.prayerId];
}
