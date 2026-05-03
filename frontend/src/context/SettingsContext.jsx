import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

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
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem("rosario:device_id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    window.localStorage.setItem("rosario:device_id", id);
  }
  return id;
}

// Lazy initializer — reads localStorage SYNCHRONOUSLY on first render.
// Avoids race with persist effect under React.StrictMode (mount→unmount→remount).
function loadInitialSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return { ...DEFAULT_SETTINGS, theme: prefersDark ? "dark" : "light" };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadInitialSettings);
  const [deviceId] = useState(() => ensureDeviceId());
  const hasMounted = useRef(false);

  // Apply theme + font-size to DOM whenever settings change.
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

  // Persist to localStorage — skip first run (state is already from localStorage).
  // This avoids overwriting stored values on mount under StrictMode.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage full / blocked */
    }
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
