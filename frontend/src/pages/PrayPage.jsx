import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { getMysteryById } from "../data/mysteries";
import { buildRosarySteps, getPrayerForStep, DECADE_END_PRAYER_ID } from "../utils/rosaryFlow";
import { useProgress } from "../context/ProgressContext";
import { useSettings } from "../context/SettingsContext";
import RosaryVisualizer from "../components/RosaryVisualizer";
import ProgressBar from "../components/ProgressBar";
import { startSession, completeSession } from "../lib/api";

export default function PrayPage() {
  const { mysteryId } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const fromHome = search.get("from") === "home";
  const mystery = getMysteryById(mysteryId);
  const { progress, start, setStep, clear } = useProgress();
  const { haptic, deviceId } = useSettings();
  const [sessionId, setSessionId] = useState(null);

  const steps = useMemo(() => (mystery ? buildRosarySteps(mystery) : []), [mystery]);

  // Initialize / resume progress
  useEffect(() => {
    if (!mystery) return;
    if (
      !progress ||
      progress.mysteryId !== mystery.id ||
      progress.totalSteps !== steps.length ||
      fromHome
    ) {
      start(mystery.id, steps.length);
    }
    // create remote session (best-effort)
    startSession(deviceId, mystery.id)
      .then((s) => setSessionId(s.id))
      .catch(() => {
        /* offline ok */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mystery?.id]);

  if (!mystery) {
    return (
      <div className="px-6 pt-10">
        <p>Peristiwa tidak ditemukan.</p>
        <button onClick={() => navigate("/")} className="mt-4 underline">
          Kembali ke beranda
        </button>
      </div>
    );
  }

  const idx =
    progress && progress.mysteryId === mystery.id ? progress.stepIndex : 0;
  const step = steps[idx];

  let lastFinished = -1;
  for (let i = 0; i < idx; i++) {
    const s = steps[i];
    if (s && s.prayerId === DECADE_END_PRAYER_ID && s.decadeIndex != null) {
      if (s.decadeIndex > lastFinished) lastFinished = s.decadeIndex;
    }
  }
  const completedDecades = lastFinished + 1;

  const goNext = () => {
    if (idx >= steps.length - 1) return;
    haptic(10);
    const next = idx + 1;
    setStep(next);
    if (steps[next].type === "complete" && sessionId) {
      completeSession(sessionId).catch(() => {});
    }
  };

  const goBack = () => {
    if (idx === 0) return;
    haptic(8);
    setStep(idx - 1);
  };

  const exitWithSave = () => {
    navigate("/");
  };

  const prayer = getPrayerForStep(step);

  return (
    <div className="fade-in min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center"
          aria-label="Kembali"
          data-testid="pray-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {mystery.name}
          </p>
          <p className="text-sm font-medium">{step?.label}</p>
        </div>
        <button
          onClick={exitWithSave}
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center"
          aria-label="Keluar dan simpan"
          data-testid="pray-exit-btn"
        >
          <Pause className="h-5 w-5" />
        </button>
      </header>

      <div className="px-6 mt-4">
        <ProgressBar value={idx + 1} total={steps.length} />
      </div>

      <main
        className="flex-1 px-6 py-8 flex flex-col items-center justify-start"
        data-testid="pray-step-content"
      >
        {step?.type === "prayer" && prayer && (
          <article className="max-w-md w-full text-center fade-in">
            <h2 className="font-serif-display text-3xl text-primary">
              {prayer.title}
            </h2>
            {prayer.intro && (
              <p className="mt-3 italic text-muted-foreground" data-testid="prayer-intro">
                {prayer.intro}
              </p>
            )}
            <p
              className="mt-6 leading-relaxed text-foreground/90 whitespace-pre-line"
              style={{ fontSize: "1.125rem" }}
              data-testid="prayer-text"
            >
              {prayer.text}
            </p>
            {step.hailMaryIndex && (
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-accent">
                Salam Maria {step.hailMaryIndex} / 10
              </p>
            )}
          </article>
        )}

        {step?.type === "reflection" && (
          <article className="max-w-md w-full fade-in" data-testid="reflection-block">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center">
              Peristiwa {step.mysteryEventOrder} dari 5
            </p>
            <h2 className="font-serif-display text-3xl text-primary mt-2 text-center">
              {step.eventTitle}
            </h2>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {step.scripture}
            </p>

            {/* P (Pemimpin) */}
            <div className="mt-6" data-testid="reflection-leader">
              <p className="text-xs font-semibold tracking-wider text-primary/80 mb-1">
                P
              </p>
              <p className="leading-relaxed text-foreground/90">
                {step.leaderText}
              </p>
            </div>

            {/* P + U (Pemimpin + Umat) */}
            <div
              className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4"
              data-testid="reflection-response"
            >
              <p className="text-xs font-semibold tracking-wider text-accent-foreground/80 mb-1">
                P + U
              </p>
              <p className="leading-relaxed">{step.responseText}</p>
            </div>
          </article>
        )}

        {step?.type === "complete" && (
          <article className="max-w-md w-full text-center fade-in" data-testid="complete-block">
            <h2 className="font-serif-display text-4xl text-primary">
              Rosario Selesai
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Terima kasih telah meluangkan waktu bersama Bunda Maria. Semoga damai Tuhan
              menyertaimu sepanjang hari ini.
            </p>
            <div className="mt-8 grid gap-3">
              <button
                onClick={() => {
                  clear();
                  navigate("/");
                }}
                className="h-14 rounded-2xl bg-primary text-primary-foreground font-medium"
                data-testid="complete-home-btn"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={() => {
                  clear();
                  navigate("/pilih-peristiwa");
                }}
                className="h-14 rounded-2xl border-2 border-primary text-primary font-medium"
                data-testid="complete-pick-btn"
              >
                Doakan Peristiwa Lain
              </button>
            </div>
          </article>
        )}
      </main>

      {step?.type !== "complete" && (
        <>
          <div className="px-6 pb-3">
            <RosaryVisualizer
              decadeIndex={step?.decadeIndex ?? null}
              hailMaryIndex={step?.hailMaryIndex ?? null}
              completedDecades={completedDecades}
            />
          </div>
          <nav className="px-6 pb-8 grid grid-cols-2 gap-3">
            <button
              onClick={goBack}
              disabled={idx === 0}
              data-testid="prev-btn"
              className="h-14 rounded-2xl border border-border flex items-center justify-center gap-2 text-foreground disabled:opacity-40 active:scale-[0.98] transition-transform"
            >
              <ChevronLeft className="h-5 w-5" /> Kembali
            </button>
            <button
              onClick={goNext}
              data-testid="next-btn"
              className="h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
            >
              Lanjut <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
