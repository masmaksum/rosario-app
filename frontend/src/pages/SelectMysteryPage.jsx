import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const COLOR_MAP = {
  joyful:    "from-amber-100/70 to-rose-100/40 dark:from-amber-900/20 dark:to-rose-900/10",
  sorrowful: "from-slate-200/70 to-violet-100/30 dark:from-slate-800/40 dark:to-violet-900/20",
  glorious:  "from-sky-100/70 to-amber-100/40 dark:from-sky-900/30 dark:to-amber-900/20",
  luminous:  "from-amber-100/70 to-sky-100/40 dark:from-amber-900/20 dark:to-sky-900/20",
};

// Hari kanonik → indeks 0-6 (0=Minggu)
const DAY_IDX = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

export default function SelectMysteryPage() {
  const navigate = useNavigate();
  const { mysteries, ui } = useLanguage();

  const formatDays = (days) =>
    days.map((d) => ui.dayNames[DAY_IDX[d]] ?? d).join(" • ");

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-8">
        <Link
          to="/"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label={ui.back}
          data-testid="back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {ui.selectMystery}
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">{ui.selectMystery}</h1>
        </div>
      </header>

      <div className="space-y-4">
        {mysteries.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(`/doa/${m.id}`)}
            data-testid={`mystery-${m.id}-card`}
            className={`w-full text-left rounded-3xl p-6 border border-border bg-gradient-to-br ${COLOR_MAP[m.color]} bg-card shadow-sm active:scale-[0.99] transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {formatDays(m.recommendedDays)}
                </p>
                <h2 className="font-serif-display text-2xl mt-1">{m.name}</h2>
                {m.description && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {m.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 mt-1 text-primary shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
