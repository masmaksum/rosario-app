import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Moon,
  Sun,
  Type,
  Trash2,
  Bell,
  BellOff,
  Clock,
  Globe,
  AlignJustify,
} from "lucide-react";
import { useSettings, FONT_SIZE_OPTIONS } from "../context/SettingsContext";
import { useProgress } from "../context/ProgressContext";
import { useLanguage } from "../context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "../data/i18n";
import { requestNotificationPermission } from "../utils/reminder";

// Nama bahasa sesuai UI language aktif
const LANG_NAMES = {
  id: { id: "Bahasa Indonesia", jv: "Bahasa Jawa",    en: "English", la: "Lingua Latina" },
  jv: { id: "Basa Indonésia",  jv: "Basa Jawa",       en: "Basa Inggris", la: "Basa Latin" },
  en: { id: "Bahasa Indonesia", jv: "Javanese",        en: "English", la: "Latin" },
  la: { id: "Lingua Indonesiana", jv: "Lingua Iavanica", en: "Lingua Anglica", la: "Lingua Latina" },
};

export default function SettingsPage() {
  const { settings, update, toggleTheme } = useSettings();
  const { clear } = useProgress();
  const { language, setLanguage, pattern, setPattern, ui } = useLanguage();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  const langNames = LANG_NAMES[language] || LANG_NAMES.id;
  const fontSizeLabels = {
    small: ui.fontSmall,
    medium: ui.fontMedium,
    large: ui.fontLarge,
    extraLarge: ui.fontExtraLarge,
  };

  const resetProgress = () => {
    if (window.confirm(ui.clearProgressConfirm)) {
      clear();
    }
  };

  const toggleReminder = async () => {
    const next = !settings.reminderEnabled;
    if (next) {
      const perm = await requestNotificationPermission();
      setNotifStatus(perm);
    }
    update({ reminderEnabled: next });
  };

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-8">
        <Link
          to="/"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label={ui.back}
          data-testid="settings-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {ui.settings}
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">{ui.preferencesTitle}</h1>
        </div>
      </header>

      <section className="space-y-3">
        {/* Language */}
        <div className="rounded-2xl border border-border p-5 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{ui.languageSetting}</p>
              <p className="text-sm text-muted-foreground">{ui.languageSectionSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                data-testid={`lang-${lang.code}-btn`}
                onClick={() => setLanguage(lang.code)}
                className={`h-12 rounded-xl border transition-all text-sm ${
                  language === lang.code
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-foreground"
                }`}
              >
                {langNames[lang.code] || lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern */}
        <div className="rounded-2xl border border-border p-5 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <AlignJustify className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{ui.prayerPattern}</p>
              <p className="text-sm text-muted-foreground">{ui.prayerPatternSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "full",   label: ui.fullPattern },
              { value: "simple", label: ui.simplePattern },
            ].map((opt) => (
              <button
                key={opt.value}
                data-testid={`pattern-${opt.value}-btn`}
                onClick={() => setPattern(opt.value)}
                className={`h-12 rounded-xl border transition-all ${
                  pattern === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-2xl border border-border p-5 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            {settings.theme === "dark" ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
            <div>
              <p className="font-medium">{ui.appearanceSectionTitle}</p>
              <p className="text-sm text-muted-foreground">
                {settings.theme === "dark" ? ui.darkMode : ui.lightMode}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="toggle-theme-btn"
            className="h-12 px-5 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            {ui.change}
          </button>
        </div>

        {/* Font size */}
        <div className="rounded-2xl border border-border p-5 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Type className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{ui.fontSizeSectionTitle}</p>
              <p className="text-sm text-muted-foreground">{ui.fontSizeSectionSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                data-testid={`font-${opt.value}-btn`}
                onClick={() => update({ fontSize: opt.value })}
                className={`h-12 rounded-xl border transition-all ${
                  settings.fontSize === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-foreground"
                }`}
              >
                {fontSizeLabels[opt.value] || opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div className="rounded-2xl border border-border p-5 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.reminderEnabled ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">{ui.dailyReminderTitle}</p>
                <p className="text-sm text-muted-foreground">{ui.dailyReminderSubtitle}</p>
              </div>
            </div>
            <button
              onClick={toggleReminder}
              data-testid="toggle-reminder-btn"
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.reminderEnabled ? "bg-primary" : "bg-border"
              }`}
              aria-pressed={settings.reminderEnabled}
            >
              <span
                className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  settings.reminderEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {settings.reminderEnabled && (
            <>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="reminder-time" className="text-sm flex-1">
                  {ui.reminderTimeLabel}
                </label>
                <input
                  id="reminder-time"
                  data-testid="reminder-time-input"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => update({ reminderTime: e.target.value })}
                  className="h-10 px-3 rounded-lg border border-border bg-background text-base"
                />
              </div>
              {notifStatus === "denied" && (
                <p className="text-xs text-destructive">{ui.notifDenied}</p>
              )}
              {notifStatus === "granted" && (
                <p className="text-xs text-muted-foreground">{ui.notifGranted}</p>
              )}
              {notifStatus === "default" && (
                <p className="text-xs text-muted-foreground">{ui.notifDefault}</p>
              )}
            </>
          )}
        </div>

        {/* Haptic */}
        <div className="rounded-2xl border border-border p-5 flex items-center justify-between bg-card">
          <div>
            <p className="font-medium">{ui.gentleVibrationTitle}</p>
            <p className="text-sm text-muted-foreground">{ui.gentleVibrationSubtitle}</p>
          </div>
          <button
            onClick={() => update({ hapticEnabled: !settings.hapticEnabled })}
            data-testid="toggle-haptic-btn"
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.hapticEnabled ? "bg-primary" : "bg-border"
            }`}
            aria-pressed={settings.hapticEnabled}
          >
            <span
              className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                settings.hapticEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Reset progress */}
        <button
          onClick={resetProgress}
          data-testid="reset-progress-btn"
          className="w-full rounded-2xl border border-destructive/40 text-destructive p-5 flex items-center justify-between hover:bg-destructive/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">{ui.clearProgressTitle}</p>
              <p className="text-sm opacity-80">{ui.clearProgressSubtitle}</p>
            </div>
          </div>
        </button>
      </section>

      <p className="text-center text-xs text-muted-foreground mt-10">
        {ui.appName} · {ui.language}
      </p>
    </div>
  );
}
