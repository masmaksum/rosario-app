import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Heart } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import {
  listIntentions,
  createIntention,
  deleteIntention,
} from "../lib/api";

export default function IntentionsPage() {
  const { deviceId } = useSettings();
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setError(null);
      const data = await listIntentions(deviceId);
      setItems(data);
    } catch (e) {
      setError("Tidak dapat memuat intensi. Periksa koneksi.");
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const onAdd = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await createIntention(deviceId, trimmed);
      setText("");
      await refresh();
    } catch (err) {
      setError("Tidak dapat menyimpan intensi.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Hapus intensi ini?")) return;
    try {
      await deleteIntention(id);
      await refresh();
    } catch (err) {
      setError("Tidak dapat menghapus intensi.");
    }
  };

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-8">
        <Link
          to="/"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label="Kembali"
          data-testid="intentions-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Intensi Doa
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">Maksud Pribadi</h1>
        </div>
      </header>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Tuliskan maksud doa pribadi yang ingin engkau bawa dalam Rosario. Intensimu
        bersifat pribadi dan tersimpan untuk perangkat ini.
      </p>

      <form onSubmit={onAdd} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mis. Untuk kesembuhan ayah, untuk panggilan keluarga..."
          rows={3}
          data-testid="intention-input"
          className="w-full rounded-2xl border border-border bg-card p-4 outline-none focus:border-primary transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          data-testid="intention-add-btn"
          className="mt-3 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="h-5 w-5" /> Tambah Intensi
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <ul className="space-y-3" data-testid="intention-list">
        {items.length === 0 && (
          <li className="text-center text-muted-foreground py-12">
            <Heart className="h-8 w-8 mx-auto mb-3 text-accent" />
            Belum ada intensi. Tuliskan yang pertama di atas.
          </li>
        )}
        {items.map((it) => (
          <li
            key={it.id}
            data-testid={`intention-${it.id}`}
            className="rounded-2xl border border-border bg-card p-4 flex items-start justify-between gap-3"
          >
            <p className="leading-relaxed flex-1">{it.text}</p>
            <button
              onClick={() => onDelete(it.id)}
              data-testid={`intention-delete-${it.id}`}
              className="h-10 w-10 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10"
              aria-label="Hapus intensi"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
