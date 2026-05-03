import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

/**
 * Compact audio player for prayer steps.
 * Props: src (string URL). If src is falsy, nothing renders.
 */
export default function AudioPlayer({ src, label = "Dengarkan" }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setProgress(0);
    setError(false);
    if (ref.current) {
      try {
        ref.current.pause();
        ref.current.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [src]);

  if (!src) return null;

  const toggle = async () => {
    const el = ref.current;
    if (!el) return;
    try {
      if (el.paused) {
        setLoading(true);
        await el.play();
        setLoading(false);
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div
      className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3"
      data-testid="audio-player"
    >
      <button
        type="button"
        onClick={toggle}
        data-testid="audio-play-btn"
        aria-label={playing ? "Jeda audio" : "Putar audio"}
        className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm active:scale-95 transition-transform"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : playing ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {error ? "Tidak dapat memutar audio" : label}
        </p>
        <div className="mt-1 h-1 rounded-full bg-border/60 overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-200"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration > 0) setProgress(el.currentTime / el.duration);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(1);
        }}
        onError={() => {
          setError(true);
          setPlaying(false);
          setLoading(false);
        }}
      />
    </div>
  );
}
