import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ProgressContext = createContext(null);

const STORAGE_KEY = "rosario:progress";

/**
 * Progress state:
 * {
 *   mysteryId: "terang",
 *   stepIndex: 12,
 *   totalSteps: 73,
 *   startedAt: ISO,
 *   updatedAt: ISO,
 * }
 * null when no active session.
 */

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (progress) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [progress]);

  const start = useCallback((mysteryId, totalSteps) => {
    const now = new Date().toISOString();
    setProgress({
      mysteryId,
      stepIndex: 0,
      totalSteps,
      startedAt: now,
      updatedAt: now,
    });
  }, []);

  const setStep = useCallback((stepIndex) => {
    setProgress((p) =>
      p ? { ...p, stepIndex, updatedAt: new Date().toISOString() } : p
    );
  }, []);

  const clear = useCallback(() => setProgress(null), []);

  return (
    <ProgressContext.Provider value={{ progress, start, setStep, clear }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
