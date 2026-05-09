// Build the full step-by-step Rosary flow given a selected mystery.
// Alur mengikuti tata doa Rosario yang lazim di Gereja Katolik Indonesia:
//
//   Pembukaan:
//     1. Tanda Salib
//     2. Intensi Doa  (hanya muncul jika ada intensi, di-skip otomatis jika kosong)
//     3. Aku Percaya
//     4. Kemuliaan
//     5. Terpujilah
//     6. Bapa Kami
//     7. Salam Putri Allah Bapa
//     8. Salam Bunda Allah Putra
//     9. Salam Mempelai Allah Roh Kudus
//    10. Kemuliaan
//    11. Terpujilah
//
//   Setiap Peristiwa (×5):
//    12. Peristiwa — teks Kitab Suci (P) + doa tanggapan (P + U)
//    13. Bapa Kami
//    14. 10× Salam Maria
//    15. Kemuliaan
//    16. Terpujilah
//    17. Doa Fatima
//
//   Penutup:
//    18. Salam, Ya Ratu
//    19. Doa Penutup
//    20. Tanda Salib
//
//   + 1 halaman Selesai.

import { PRAYERS } from "../data/prayers";

export function buildRosarySteps(mystery, starredLitaniIds = []) {
  const steps = [];
  const none = { decadeIndex: null, hailMaryIndex: null };

  // ====== Pembukaan ======
  steps.push({ type: "prayer",     prayerId: "tanda-salib",    label: "Pembukaan", ...none });
  // Intensi Doa — langkah ini di-skip otomatis di PrayPage jika tidak ada intensi
  steps.push({ type: "intentions",                              label: "Intensi Doa", ...none });
  steps.push({ type: "prayer",     prayerId: "aku-percaya",    label: "Pembukaan", ...none });
  steps.push({ type: "prayer",     prayerId: "kemuliaan",      label: "Pembukaan", ...none });
  steps.push({ type: "prayer",     prayerId: "terpujilah",     label: "Pembukaan", ...none });
  steps.push({ type: "prayer",     prayerId: "bapa-kami",      label: "Pembukaan", ...none });
  steps.push({ type: "prayer",     prayerId: "salam-putri",    label: "Salam Pembukaan 1 / 3", ...none });
  steps.push({ type: "prayer",     prayerId: "salam-bunda",    label: "Salam Pembukaan 2 / 3", ...none });
  steps.push({ type: "prayer",     prayerId: "salam-mempelai", label: "Salam Pembukaan 3 / 3", ...none });
  steps.push({ type: "prayer",     prayerId: "kemuliaan",      label: "Pembukaan", ...none });
  steps.push({ type: "prayer",     prayerId: "terpujilah",     label: "Pembukaan", ...none });

  // ====== 5 Peristiwa ======
  mystery.events.forEach((event, idx) => {
    steps.push({
      type: "reflection",
      mysteryEventOrder: event.order,
      eventTitle: event.title,
      scripture: event.scripture,
      leaderText: event.leaderText,
      responseText: event.responseText,
      label: `Peristiwa ${event.order} dari 5`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    steps.push({
      type: "prayer",
      prayerId: "bapa-kami",
      label: `Peristiwa ${event.order} — Bapa Kami`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    for (let i = 1; i <= 10; i++) {
      steps.push({
        type: "prayer",
        prayerId: "salam-maria",
        label: `Salam Maria ${i} dari 10`,
        decadeIndex: idx,
        hailMaryIndex: i,
      });
    }
    steps.push({
      type: "prayer",
      prayerId: "kemuliaan",
      label: `Peristiwa ${event.order} — Kemuliaan`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    steps.push({
      type: "prayer",
      prayerId: "terpujilah",
      label: `Peristiwa ${event.order} — Terpujilah`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    steps.push({
      type: "prayer",
      prayerId: "doa-fatima",
      label: `Peristiwa ${event.order} — Doa Fatima`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
  });

  // ====== Penutup ======
  steps.push({ type: "prayer", prayerId: "salam-ya-ratu",  label: "Penutup", ...none });
  steps.push({ type: "prayer", prayerId: "marilah-berdoa", label: "Penutup", ...none });
  for (const litaniId of starredLitaniIds) {
    steps.push({ type: "litani", litaniId, label: "Litani", ...none });
  }
  steps.push({ type: "prayer", prayerId: "tanda-salib",    label: "Penutup", ...none });

  // ====== Selesai ======
  steps.push({ type: "complete", label: "Selesai", ...none });

  return steps;
}

export function getPrayerForStep(step) {
  if (!step || step.type !== "prayer") return null;
  return PRAYERS[step.prayerId];
}

export const DECADE_END_PRAYER_ID = "doa-fatima";
