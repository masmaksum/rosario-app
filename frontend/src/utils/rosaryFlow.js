// Build the full step-by-step Rosary flow given a selected mystery.
// Alur mengikuti tata doa Rosario yang lazim di Gereja Katolik Indonesia:
//
//   Pembukaan:
//     1. Tanda Salib
//     2. Aku Percaya
//     3. Kemuliaan
//     4. Bapa Kami
//     5. Salam Putri Allah Bapa     (+ Salam Maria)
//     6. Salam Bunda Allah Putra    (+ Salam Maria)
//     7. Salam Mempelai Allah Roh Kudus (+ Salam Maria)
//     8. Kemuliaan
//     9. Terpujilah
//
//   Setiap Peristiwa (×5):
//     10. Peristiwa — teks Kitab Suci (P) + doa tanggapan (P + U)
//     11. Bapa Kami
//     12. 10× Salam Maria
//     13. Kemuliaan
//     14. Terpujilah
//     15. Doa Fatima
//
//   Penutup:
//     16. Salam, Ya Ratu
//     17. Doa Penutup (Doakanlah + Marilah Berdoa)
//     18. Tanda Salib
//
//   + 1 halaman Selesai.  Total: 88 langkah.

import { PRAYERS } from "../data/prayers";

export function buildRosarySteps(mystery) {
  const steps = [];
  const none = { decadeIndex: null, hailMaryIndex: null };

  // ====== Pembukaan ======
  steps.push({ type: "prayer", prayerId: "tanda-salib", label: "Pembukaan", ...none });
  steps.push({ type: "prayer", prayerId: "aku-percaya", label: "Pembukaan", ...none });
  steps.push({ type: "prayer", prayerId: "kemuliaan", label: "Pembukaan", ...none });
  steps.push({ type: "prayer", prayerId: "bapa-kami", label: "Pembukaan", ...none });
  steps.push({ type: "prayer", prayerId: "salam-putri", label: "Salam Pembukaan 1 / 3", ...none });
  steps.push({ type: "prayer", prayerId: "salam-bunda", label: "Salam Pembukaan 2 / 3", ...none });
  steps.push({ type: "prayer", prayerId: "salam-mempelai", label: "Salam Pembukaan 3 / 3", ...none });
  steps.push({ type: "prayer", prayerId: "kemuliaan", label: "Pembukaan", ...none });
  steps.push({ type: "prayer", prayerId: "terpujilah", label: "Pembukaan", ...none });

  // ====== 5 Peristiwa ======
  mystery.events.forEach((event, idx) => {
    // Halaman Peristiwa (Pemimpin + Umat)
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
    // Bapa Kami
    steps.push({
      type: "prayer",
      prayerId: "bapa-kami",
      label: `Peristiwa ${event.order} — Bapa Kami`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    // 10× Salam Maria
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
    // Terpujilah
    steps.push({
      type: "prayer",
      prayerId: "terpujilah",
      label: `Peristiwa ${event.order} — Terpujilah`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
    // Doa Fatima (penanda akhir dekade)
    steps.push({
      type: "prayer",
      prayerId: "doa-fatima",
      label: `Peristiwa ${event.order} — Doa Fatima`,
      decadeIndex: idx,
      hailMaryIndex: null,
    });
  });

  // ====== Penutup ======
  steps.push({ type: "prayer", prayerId: "salam-ya-ratu", label: "Penutup", ...none });
  steps.push({ type: "prayer", prayerId: "doa-penutup", label: "Penutup", ...none });
  steps.push({ type: "prayer", prayerId: "tanda-salib", label: "Penutup", ...none });

  // ====== Selesai ======
  steps.push({ type: "complete", label: "Selesai", ...none });

  return steps;
}

export function getPrayerForStep(step) {
  if (!step || step.type !== "prayer") return null;
  return PRAYERS[step.prayerId];
}

// Penanda langkah terakhir suatu dekade (untuk perhitungan completedDecades):
// dekade dianggap selesai ketika "doa-fatima" pada dekade tersebut telah dilewati.
export const DECADE_END_PRAYER_ID = "doa-fatima";
