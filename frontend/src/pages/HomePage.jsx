import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Settings as SettingsIcon, Heart, BookOpen, Play } from "lucide-react";
import { DAY_NAMES_ID, getMysteryById, getRecommendedMysteryId } from "../data/mysteries";
import { useSettings } from "../context/SettingsContext";
import { useProgress } from "../context/ProgressContext";
import { getStats } from "../lib/api";

function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function HomePage() {
  const navigate = useNavigate();
  const { deviceId } = useSettings();
  const { progress } = useProgress();
  const [stats, setStats] = useState(null);

  const today = useMemo(() => new Date(), []);
  const recommendedId = useMemo(() => getRecommendedMysteryId(today), [today]);
  const recommended = useMemo(() => getMysteryById(recommendedId), [recommendedId]);
  const dayName = DAY_NAMES_ID[today.getDay()];
  const dateStr = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    let mounted = true;
    getStats(deviceId)
      .then((s) => mounted && setStats(s))
      .catch(() => {
        /* offline ok */
      });
    return () => {
      mounted = false;
    };
  }, [deviceId]);

  const startToday = () => {
    navigate(`/doa/${recommended.id}?from=home`);
  };

  return (
    <div className="fade-in px-6 pt-10 pb-28">
      <header className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Rosario</p>
          <h1 className="font-serif-display text-3xl mt-1">{getGreeting()}</h1>
        </div>
        <Link
          to="/pengaturan"
          className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Pengaturan"
          data-testid="home-settings-btn"
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>
      </header>

      <section className="mb-8" data-testid="home-today-card">
        <p className="text-sm text-muted-foreground">
          {dayName}, {dateStr}
        </p>
        <h2 className="font-serif-display text-4xl mt-2 leading-tight">
          Peristiwa hari ini:
          <br />
          <span className="text-primary">{recommended.name}</span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          {recommended.description}
        </p>
      </section>

      <button
        onClick={startToday}
        data-testid="start-rosary-btn"
        className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-lg font-medium shadow-md flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
      >
        <Play className="h-5 w-5" /> Mulai Rosario
      </button>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link
          to="/pilih-peristiwa"
          data-testid="select-mystery-btn"
          className="h-14 rounded-2xl border border-border flex items-center justify-center gap-2 text-primary hover:bg-secondary transition-colors"
        >
          <Sparkles className="h-4 w-4" /> Pilih Peristiwa
        </Link>
        <Link
          to="/intensi"
          data-testid="intentions-btn"
          className="h-14 rounded-2xl border border-border flex items-center justify-center gap-2 text-primary hover:bg-secondary transition-colors"
        >
          <Heart className="h-4 w-4" /> Intensi Doa
        </Link>
      </div>

      {progress && progress.stepIndex > 0 && progress.stepIndex < progress.totalSteps && (
        <div
          className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-5"
          data-testid="resume-card"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/80">
            Lanjutkan Doa
          </p>
          <p className="mt-1 font-serif-display text-xl">
            {getMysteryById(progress.mysteryId)?.name || "Rosario"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Langkah {progress.stepIndex + 1} dari {progress.totalSteps}
          </p>
          <button
            onClick={() => navigate(`/doa/${progress.mysteryId}`)}
            data-testid="resume-btn"
            className="mt-4 w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
          >
            Lanjutkan
          </button>
        </div>
      )}

      {stats && stats.completed > 0 && (
        <p
          className="mt-10 text-center text-sm text-muted-foreground"
          data-testid="home-stats"
        >
          <BookOpen className="inline h-4 w-4 mr-1 -mt-0.5" />
          Anda telah menyelesaikan {stats.completed} Rosario.
        </p>
      )}
    </div>
  );
}
