import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Music2, Lock } from "lucide-react";
import { listAudio, uploadAudio, deleteAudio, audioStreamUrl, getAdminKey, clearAdminKey } from "../lib/api";
import { MYSTERIES } from "../data/mysteries";

// Prayers that can have an audio associated with them (keys from /data/prayers.js)
const PRAYER_TARGETS = [
  { id: "tanda-salib", label: "Tanda Salib" },
  { id: "aku-percaya", label: "Aku Percaya" },
  { id: "kemuliaan", label: "Kemuliaan" },
  { id: "bapa-kami", label: "Bapa Kami" },
  { id: "salam-putri", label: "Salam, Putri Allah Bapa" },
  { id: "salam-bunda", label: "Salam, Bunda Allah Putra" },
  { id: "salam-mempelai", label: "Salam, Mempelai Allah Roh Kudus" },
  { id: "salam-maria", label: "Salam Maria" },
  { id: "terpujilah", label: "Terpujilah" },
  { id: "doa-fatima", label: "Doa Fatima" },
  { id: "salam-ya-ratu", label: "Salam, Ya Ratu" },
  { id: "doa-penutup", label: "Doa Penutup" },
];

function buildEventTargets() {
  const list = [];
  for (const m of MYSTERIES) {
    for (const ev of m.events) {
      list.push({
        id: `${m.id}:${ev.order}`,
        label: `${m.name} ${ev.order} — ${ev.title}`,
      });
    }
  }
  return list;
}

export default function AdminAudioPage() {
  const navigate = useNavigate();
  const [audios, setAudios] = useState([]);
  const [kind, setKind] = useState("prayer");
  const [refId, setRefId] = useState("bapa-kami");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const eventTargets = useMemo(buildEventTargets, []);
  const targets = kind === "prayer" ? PRAYER_TARGETS : eventTargets;

  const load = async () => {
    try {
      setError(null);
      const data = await listAudio();
      setAudios(data);
    } catch (e) {
      setError("Tidak dapat memuat daftar audio.");
    }
  };

  useEffect(() => {
    if (!getAdminKey()) { navigate("/admin/login"); return; }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-adjust refId when kind changes
  useEffect(() => {
    setRefId(targets[0]?.id || "");
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const byRef = useMemo(() => {
    const map = {};
    for (const a of audios) {
      const key = `${a.kind}:${a.ref_id}`;
      map[key] = a;
    }
    return map;
  }, [audios]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!file) {
      setError("Pilih file audio terlebih dahulu.");
      return;
    }
    if (!refId) {
      setError("Pilih target doa/peristiwa.");
      return;
    }
    setLoading(true);
    try {
      await uploadAudio({ kind, ref_id: refId, title: title || null, file });
      setSuccess("Audio berhasil diunggah.");
      setFile(null);
      setTitle("");
      // reset file input
      const inp = document.getElementById("audio-file-input");
      if (inp) inp.value = "";
      await load();
    } catch (e) {
      if (e?.response?.status === 401) { clearAdminKey(); navigate("/admin/login"); return; }
      setError(e?.response?.data?.detail || "Gagal mengunggah.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Hapus audio ini?")) return;
    try {
      await deleteAudio(id);
      await load();
    } catch (e) {
      if (e?.response?.status === 401) { clearAdminKey(); navigate("/admin/login"); return; }
      setError("Gagal menghapus.");
    }
  };

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-6">
        <Link
          to="/pengaturan"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label="Kembali"
          data-testid="admin-audio-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Admin
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">Audio Narator</h1>
        </div>
      </header>

      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 mb-6 text-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 shrink-0 text-accent" />
          <p className="text-foreground/90">Anda masuk sebagai Admin.</p>
        </div>
        <button
          onClick={() => { clearAdminKey(); navigate("/admin/login"); }}
          className="text-xs text-muted-foreground underline shrink-0"
        >
          Keluar
        </button>
      </div>

      {/* Upload form */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-5 space-y-4"
        data-testid="audio-upload-form"
      >
        <h2 className="font-serif-display text-xl">Unggah Audio</h2>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Kategori
          </label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => setKind("prayer")}
              data-testid="kind-prayer-btn"
              className={`h-11 rounded-xl border transition-all ${
                kind === "prayer"
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border"
              }`}
            >
              Doa
            </button>
            <button
              type="button"
              onClick={() => setKind("event")}
              data-testid="kind-event-btn"
              className={`h-11 rounded-xl border transition-all ${
                kind === "event"
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border"
              }`}
            >
              Peristiwa
            </button>
          </div>
        </div>

        <div>
          <label
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
            htmlFor="audio-ref-select"
          >
            Target
          </label>
          <select
            id="audio-ref-select"
            data-testid="audio-ref-select"
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-3 outline-none focus:border-primary"
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
                {byRef[`${kind}:${t.id}`] ? "  ✓" : ""}
              </option>
            ))}
          </select>
          {byRef[`${kind}:${refId}`] && (
            <p className="text-xs text-muted-foreground mt-2">
              Sudah ada audio. Upload baru akan menggantikan yang lama.
            </p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Judul (opsional)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Direkam 2026-01-05"
            data-testid="audio-title-input"
            className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            File Audio (mp3, ogg, wav, m4a — maks 25MB)
          </label>
          <input
            id="audio-file-input"
            data-testid="audio-file-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full text-sm file:mr-3 file:h-10 file:px-4 file:rounded-xl file:border-0 file:bg-primary file:text-primary-foreground file:font-medium file:cursor-pointer"
          />
          {file && (
            <p className="text-xs text-muted-foreground mt-2">
              {file.name} — {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-accent/40 bg-accent/10 text-accent-foreground p-3 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          data-testid="audio-upload-btn"
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          {loading ? "Mengunggah..." : "Unggah Audio"}
        </button>
      </form>

      {/* List */}
      <section className="mt-8">
        <h2 className="font-serif-display text-xl mb-3">
          Audio Tersimpan ({audios.length})
        </h2>
        <ul className="space-y-2" data-testid="audio-list">
          {audios.length === 0 && (
            <li className="text-center text-muted-foreground py-8 rounded-2xl border border-dashed border-border">
              <Music2 className="h-6 w-6 mx-auto mb-2 opacity-50" />
              Belum ada audio diunggah.
            </li>
          )}
          {audios.map((a) => {
            const target =
              a.kind === "prayer"
                ? PRAYER_TARGETS.find((t) => t.id === a.ref_id)?.label
                : eventTargets.find((t) => t.id === a.ref_id)?.label;
            return (
              <li
                key={a.id}
                data-testid={`audio-item-${a.id}`}
                className="rounded-2xl border border-border bg-card p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {a.kind === "prayer" ? "Doa" : "Peristiwa"}
                    </p>
                    <p className="font-medium mt-0.5 truncate">{target || a.ref_id}</p>
                    {a.title && (
                      <p className="text-xs text-muted-foreground">{a.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {(a.size / 1024).toFixed(1)} KB · {a.content_type}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(a.id)}
                    data-testid={`audio-delete-${a.id}`}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10"
                    aria-label="Hapus audio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <audio
                  controls
                  preload="none"
                  src={audioStreamUrl(a.id)}
                  className="mt-3 w-full h-10"
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
