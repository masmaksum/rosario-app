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
  Mic,
  ChevronRight,
} from "lucide-react";
import { useSettings, FONT_SIZE_OPTIONS } from "../context/SettingsContext";
import { useProgress } from "../context/ProgressContext";
import { requestNotificationPermission } from "../utils/reminder";

export default function SettingsPage() {
  const { settings, update, toggleTheme } = useSettings();
  const { clear } = useProgress();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  const resetProgress = () => {
    if (window.confirm("Hapus progress doa terakhir?")) {
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
          aria-label="Kembali"
          data-testid="settings-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Pengaturan
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">Preferensi Doa</h1>
        </div>
      </header>

      <section className="space-y-3">
        {/* Theme */}
        <div className="rounded-2xl border border-border p-5 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            {settings.theme === "dark" ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
            <div>
              <p className="font-medium">Mode Tampilan</p>
              <p className="text-sm text-muted-foreground">
                {settings.theme === "dark" ? "Gelap" : "Terang"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="toggle-theme-btn"
            className="h-12 px-5 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Ubah
          </button>
        </div>

        {/* Font size */}
        <div className="rounded-2xl border border-border p-5 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <Type className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Ukuran Teks</p>
              <p className="text-sm text-muted-foreground">Pilih kenyamanan membaca</p>
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
                {opt.label}
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
                <p className="font-medium">Pengingat Doa Harian</p>
                <p className="text-sm text-muted-foreground">
                  Pesan lembut sekali sehari
                </p>
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
                  Waktu pengingat
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
                <p className="text-xs text-destructive">
                  Notifikasi browser tidak diizinkan. Pengingat hanya akan tampil
                  sebagai banner di halaman utama.
                </p>
              )}
              {notifStatus === "granted" && (
                <p className="text-xs text-muted-foreground">
                  Notifikasi browser aktif. Pengingat akan tampil saat aplikasi dibuka.
                </p>
              )}
              {notifStatus === "default" && (
                <p className="text-xs text-muted-foreground">
                  Aktifkan sekali lagi untuk meminta izin notifikasi browser.
                </p>
              )}
            </>
          )}
        </div>

        {/* Haptic */}
        <div className="rounded-2xl border border-border p-5 flex items-center justify-between bg-card">
          <div>
            <p className="font-medium">Getaran Halus</p>
            <p className="text-sm text-muted-foreground">Saat berpindah manik</p>
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
              <p className="font-medium">Hapus Progress Terakhir</p>
              <p className="text-sm opacity-80">Mulai ulang dari awal</p>
            </div>
          </div>
        </button>
      </section>

      <p className="text-center text-xs text-muted-foreground mt-10">
        Aplikasi Rosario · Bahasa Indonesia
      </p>
    </div>
  );
}
