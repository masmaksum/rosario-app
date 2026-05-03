import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { listSessions, deleteSession, getStats } from "../lib/api";
import { getMysteryById } from "../data/mysteries";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RiwayatPage() {
  const { deviceId } = useSettings();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [filter, setFilter] = useState("all"); // all | gembira | sedih | mulia | terang
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [list, st] = await Promise.all([
        listSessions(deviceId, 200),
        getStats(deviceId),
      ]);
      setSessions(list);
      setStats(st);
    } catch (e) {
      setError("Tidak dapat memuat riwayat. Periksa koneksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const onDelete = async (id) => {
    if (!window.confirm("Hapus riwayat ini?")) return;
    try {
      await deleteSession(id);
      await load();
    } catch {
      setError("Tidak dapat menghapus.");
    }
  };

  const shown = filter === "all" ? sessions : sessions.filter((s) => s.mystery_id === filter);

  const filters = [
    { id: "all", label: "Semua" },
    { id: "gembira", label: "Gembira" },
    { id: "sedih", label: "Sedih" },
    { id: "mulia", label: "Mulia" },
    { id: "terang", label: "Terang" },
  ];

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-6">
        <Link
          to="/"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label="Kembali"
          data-testid="riwayat-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Riwayat</p>
          <h1 className="font-serif-display text-3xl mt-0.5">Catatan Doa</h1>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 mb-6" data-testid="riwayat-stats">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
          <p className="font-serif-display text-4xl text-primary mt-1">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1">kali dimulai</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selesai</p>
          <p className="font-serif-display text-4xl text-accent mt-1">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-1">Rosario utuh</p>
        </div>
      </section>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" data-testid="riwayat-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            data-testid={`filter-${f.id}-btn`}
            className={`shrink-0 h-10 px-4 rounded-full border text-sm transition-all ${
              filter === f.id
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm mb-3">
          {error}
        </div>
      )}

      {/* List */}
      <ul className="space-y-2.5" data-testid="riwayat-list">
        {loading && (
          <li className="text-center text-muted-foreground py-10">Memuat...</li>
        )}
        {!loading && shown.length === 0 && (
          <li className="text-center text-muted-foreground py-12">
            Belum ada catatan doa{filter !== "all" ? " untuk filter ini" : ""}.
          </li>
        )}
        {shown.map((s) => {
          const m = getMysteryById(s.mystery_id);
          return (
            <li
              key={s.id}
              data-testid={`riwayat-${s.id}`}
              className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3"
            >
              <div className="mt-0.5">
                {s.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{m?.name || s.mystery_id}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(s.completed ? s.completed_at : s.started_at)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.completed ? "Selesai" : "Dimulai"}
                </p>
              </div>
              <button
                onClick={() => onDelete(s.id)}
                data-testid={`riwayat-delete-${s.id}`}
                className="h-9 w-9 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10"
                aria-label="Hapus riwayat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
