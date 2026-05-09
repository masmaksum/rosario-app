import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { buildRosarySteps, getPrayerForStep, DECADE_END_PRAYER_ID } from "../utils/rosaryFlow";
import { getLitaniById } from "../data/litani";
import { useProgress } from "../context/ProgressContext";
import { useSettings } from "../context/SettingsContext";
import RosaryVisualizer from "../components/RosaryVisualizer";
import ProgressBar from "../components/ProgressBar";
import AudioPlayer from "../components/AudioPlayer";
import { startSession, completeSession, listAudio, audioStreamUrl, listIntentions } from "../lib/api";
import { markPrayedToday } from "../utils/reminder";

function getStepLabel(step, t) {
  if (!step) return "";
  const key = step.sectionKey;
  if (!key) return step.label || "";
  if (key === "hailMaryOf") return t.hailMaryOf(step.hailMaryIndex, 10);
  if (key === "mysteryOf") return t.mysteryOf(step.mysteryEventOrder, 5);
  return t[key] || step.label || "";
}

export default function PrayPage() {
  const { mysteryId } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const fromHome = search.get("from") === "home";
  const { prayers, ui, pattern, getMysteryById: getLangMystery } = useLanguage();
  const mystery = getLangMystery(mysteryId);
  const { progress, start, setStep, clear } = useProgress();
  const { haptic, deviceId } = useSettings();
  const [sessionId, setSessionId] = useState(null);
  const [audioMap, setAudioMap] = useState({});
  const [intentions, setIntentions] = useState([]);
  const [intentionsLoaded, setIntentionsLoaded] = useState(false);

  const starredLitani = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("rosario:starred_litani") || "[]"); }
    catch { return []; }
  }, []);
  const steps = useMemo(
    () => (mystery ? buildRosarySteps(mystery, starredLitani, pattern) : []),
    [mystery, starredLitani, pattern]
  );

  useEffect(() => {
    let cancelled = false;
    listAudio()
      .then((all) => {
        if (cancelled) return;
        const map = {};
        for (const a of all) map[`${a.kind}:${a.ref_id}`] = a;
        setAudioMap(map);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [mysteryId]);

  useEffect(() => {
    if (!deviceId) return;
    listIntentions(deviceId)
      .then((data) => { setIntentions(data); setIntentionsLoaded(true); })
      .catch(() => { setIntentions([]); setIntentionsLoaded(true); });
  }, [deviceId]);

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
    startSession(deviceId, mystery.id)
      .then((s) => setSessionId(s.id))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mystery?.id]);

  // Semua kalkulasi dan hooks sebelum early return
  const idx = progress && progress.mysteryId === mystery?.id ? progress.stepIndex : 0;
  const step = steps[idx];
  const isIntentionsStep = step?.type === "intentions";
  const shouldSkipIntentions = intentionsLoaded && intentions.length === 0;

  useEffect(() => {
    if (isIntentionsStep && shouldSkipIntentions && idx + 1 < steps.length) {
      setStep(idx + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntentionsStep, shouldSkipIntentions]);

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
    let next = idx + 1;
    if (steps[next]?.type === "intentions" && shouldSkipIntentions) next = idx + 2;
    if (next >= steps.length) return;
    setStep(next);
    if (steps[next].type === "complete") {
      markPrayedToday();
      if (sessionId) completeSession(sessionId).catch(() => {});
    }
  };

  const goBack = () => {
    if (idx === 0) return;
    haptic(8);
    let prev = idx - 1;
    if (steps[prev]?.type === "intentions" && shouldSkipIntentions) prev = idx - 2;
    if (prev < 0) return;
    setStep(prev);
  };

  const exitWithSave = () => { navigate("/"); };

  const prayer = getPrayerForStep(step, prayers);
  const litaniData = step?.type === "litani" ? getLitaniById(step.litaniId) : null;

  const currentAudio = (() => {
    if (!step) return null;
    if (step.type === "prayer") {
      const hit = audioMap[`prayer:${step.prayerId}`];
      return hit ? audioStreamUrl(hit.id) : null;
    }
    if (step.type === "reflection") {
      const hit = audioMap[`event:${mystery.id}:${step.mysteryEventOrder}`];
      return hit ? audioStreamUrl(hit.id) : null;
    }
    return null;
  })();

  const showBeads = step?.type !== "complete";

  return (
    <div className="fade-in h-screen flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-center justify-between px-6 pt-6 pb-2">
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
          <p className="text-sm font-medium">{getStepLabel(step, ui)}</p>
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


      {/* ── Konten doa + tombol navigasi (scrollable) ── */}
      <main
        className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center"
        data-testid="pray-step-content"
      >
        {/* Doa biasa */}
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
            {prayer.leaderText && prayer.responseText ? (
              <div className="mt-6 space-y-4">
                <p
                  className="leading-relaxed text-foreground/90"
                  style={{ fontSize: "1.125rem" }}
                  data-testid="prayer-leader"
                >
                  {prayer.leaderText}
                </p>
                <div
                  className="rounded-2xl border border-accent/40 bg-accent/10 p-4"
                  data-testid="prayer-response"
                >
                  <p className="leading-relaxed" style={{ fontSize: "1.125rem" }}>
                    {prayer.responseText}
                  </p>
                </div>
              </div>
            ) : (
              <p
                className="mt-6 leading-relaxed text-foreground/90 whitespace-pre-line"
                style={{ fontSize: "1.125rem" }}
                data-testid="prayer-text"
              >
                {prayer.text}
              </p>
            )}
            {step.hailMaryIndex && (
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-accent">
                {ui.hailMaryCount(step.hailMaryIndex)}
              </p>
            )}
            <AudioPlayer src={currentAudio} />
          </article>
        )}

        {/* Peristiwa (refleksi) */}
        {step?.type === "reflection" && (
          <article className="max-w-md w-full fade-in" data-testid="reflection-block">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center">
              {ui.decadeLabel(step.mysteryEventOrder)}
            </p>
            <h2 className="font-serif-display text-3xl text-primary mt-2 text-center">
              {step.eventTitle}
            </h2>
            {step.scripture && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {step.scripture}
              </p>
            )}
            {step.leaderText ? (
              <>
                <div className="mt-6" data-testid="reflection-leader">
                  <p className="text-xs font-semibold tracking-wider text-primary/80 mb-1">P</p>
                  <p className="leading-relaxed text-foreground/90">{step.leaderText}</p>
                </div>
                <div
                  className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4"
                  data-testid="reflection-response"
                >
                  <p className="text-xs font-semibold tracking-wider text-accent-foreground/80 mb-1">
                    P + U
                  </p>
                  <p className="leading-relaxed">{step.responseText}</p>
                </div>
              </>
            ) : (
              <p className="mt-8 text-center text-muted-foreground italic leading-relaxed" data-testid="reflection-fulltitle">
                {step.fullTitle || step.eventTitle}
              </p>
            )}
            <AudioPlayer src={currentAudio} />
          </article>
        )}

        {/* Intensi Doa */}
        {step?.type === "intentions" && intentions.length > 0 && (
          <article className="max-w-md w-full fade-in" data-testid="intentions-block">
            <h2 className="font-serif-display text-3xl text-primary text-center mb-6">
              {ui.prayerIntentions}
            </h2>
            <p className="leading-relaxed text-foreground/90" style={{ fontSize: "1.0625rem" }}>
              {ui.intentionOpening}
            </p>
            <ul className="mt-5 space-y-3" data-testid="intentions-in-prayer">
              {intentions.map((it) => (
                <li
                  key={it.id}
                  className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-center"
                >
                  <Heart className="h-4 w-4 mx-auto mb-2 text-accent" />
                  <p className="leading-relaxed">{it.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-foreground/90" style={{ fontSize: "1.0625rem" }}>
              {ui.intentionClosing}
            </p>
          </article>
        )}

        {/* Litani berbintang */}
        {step?.type === "litani" && litaniData && (
          <article className="max-w-md w-full fade-in" data-testid="litani-block">
            <h2 className="font-serif-display text-3xl text-primary text-center mb-6">
              {litaniData.title}
            </h2>
            <div className="space-y-2">
              {litaniData.lines.map((line, i) => {
                if (line.type === "together" || line.type === "prayer") {
                  return (
                    <div key={i} className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-line">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === "leader") {
                  return (
                    <div key={i} className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-line">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Pemimpin</span>
                      {line.text}
                    </div>
                  );
                }
                if (line.type === "response") {
                  return (
                    <div key={i} className="rounded-2xl border border-accent/50 bg-accent/10 p-4 text-sm leading-relaxed whitespace-pre-line">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Umat</span>
                      {line.text}
                    </div>
                  );
                }
                if (line.type === "invocations") {
                  return (
                    <div key={i} className="space-y-1">
                      {line.items.map((item, j) => (
                        <div key={j} className="rounded-2xl border border-border bg-card px-4 py-3">
                          <p className="text-sm leading-relaxed">{item}</p>
                          <p className="text-sm text-muted-foreground mt-1 italic">{line.response}</p>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (line.type === "invocation") {
                  return (
                    <div key={i} className="rounded-2xl border border-border bg-card px-4 py-3">
                      <p className="text-sm leading-relaxed">{line.text}</p>
                      <p className="text-sm text-muted-foreground mt-1 italic">{line.response}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </article>
        )}

        {/* Selesai */}
        {step?.type === "complete" && (
          <article className="max-w-md w-full text-center fade-in" data-testid="complete-block">
            <h2 className="font-serif-display text-4xl text-primary">
              {ui.rosaryFinished}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {ui.finishMessage}
            </p>
            <div className="mt-8 grid gap-3">
              <button
                onClick={() => { clear(); navigate("/"); }}
                className="h-14 rounded-2xl bg-primary text-primary-foreground font-medium"
                data-testid="complete-home-btn"
              >
                {ui.backToHome}
              </button>
              <button
                onClick={() => { clear(); navigate("/pilih-peristiwa"); }}
                className="h-14 rounded-2xl border-2 border-primary text-primary font-medium"
                data-testid="complete-pick-btn"
              >
                {ui.prayAnotherMystery}
              </button>
            </div>
          </article>
        )}

        {/* Tombol navigasi — langsung di bawah konten doa */}
        {step?.type !== "complete" && (
          <nav className="w-full max-w-md grid grid-cols-2 gap-3 mt-8 mb-2">
            <button
              onClick={goBack}
              disabled={idx === 0}
              data-testid="prev-btn"
              className="h-14 rounded-2xl border border-border flex items-center justify-center gap-2 text-foreground disabled:opacity-40 active:scale-[0.98] transition-transform"
            >
              <ChevronLeft className="h-5 w-5" /> {ui.back}
            </button>
            <button
              onClick={goNext}
              data-testid="next-btn"
              className="h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
            >
              {ui.next} <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        )}
      </main>

      {/* ── Manik-manik — selalu terlihat di bagian bawah ── */}
      {showBeads && (
        <div className="shrink-0 px-6 pt-1 pb-4">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
            {ui.stepOf(idx + 1, steps.length)}
          </p>
          <RosaryVisualizer
            decadeIndex={step?.decadeIndex ?? null}
            hailMaryIndex={step?.hailMaryIndex ?? null}
            completedDecades={completedDecades}
            mysteryLabel={step?.decadeIndex != null ? ui.mysteryOf(step.decadeIndex + 1, 5) : undefined}
          />
        </div>
      )}

    </div>
  );
}
