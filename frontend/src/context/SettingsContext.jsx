import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const SettingsContext = createContext(null);

const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
  extraLarge: 22,
};

const STORAGE_KEY = "rosario:settings";

const DEFAULT_SETTINGS = {
  theme: "light", // "light" | "dark"
  fontSize: "medium", // "small" | "medium" | "large" | "extraLarge"
  hapticEnabled: true,
  reminderEnabled: false,
  reminderTime: "19:00", // HH:MM, 24h
};

function ensureDeviceId() {
  let id = localStorage.getItem("rosario:device_id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    localStorage.setItem("rosario:device_id", id);
  }
  return id;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [deviceId] = useState(() => ensureDeviceId());

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } else {
        // detect system preference once
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        setSettings((s) => ({ ...s, theme: prefersDark ? "dark" : "light" }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // apply to DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (settings.theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
    root.style.setProperty("--base-font-size", `${FONT_SIZES[settings.fontSize] || 16}px`);
  }, [settings]);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }));
  }, []);

  const haptic = useCallback(
    (ms = 12) => {
      if (settings.hapticEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(ms);
        } catch {
          /* ignore */
        }
      }
    },
    [settings.hapticEnabled]
  );

  return (
    <SettingsContext.Provider value={{ settings, update, toggleTheme, deviceId, haptic }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

export const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Kecil" },
  { value: "medium", label: "Sedang" },
  { value: "large", label: "Besar" },
  { value: "extraLarge", label: "Sangat Besar" },
];
