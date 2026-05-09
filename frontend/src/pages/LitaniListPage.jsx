import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, ScrollText } from "lucide-react";
import LITANI from "../data/litani";
import { useStarredLitani } from "../hooks/useStarredLitani";

export default function LitaniListPage() {
  const [starred, toggleStar] = useStarredLitani();

  const sorted = [...LITANI].sort((a, b) => {
    const as = starred.includes(a.id) ? 0 : 1;
    const bs = starred.includes(b.id) ? 0 : 1;
    return as - bs;
  });

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-6">
        <Link
          to="/"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Doa
          </p>
          <h1 className="font-serif-display text-3xl mt-0.5">Litani</h1>
        </div>
      </header>

      {starred.length > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          Litani berbintang ditampilkan di atas.
        </p>
      )}

      <ul className="space-y-2">
        {sorted.map((litani) => {
          const isStarred = starred.includes(litani.id);
          return (
            <li key={litani.id} className="flex items-center gap-2">
              <Link
                to={`/litani/${litani.id}`}
                className="flex-1 h-16 rounded-2xl border border-border bg-card px-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors overflow-hidden"
              >
                <ScrollText className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{litani.title}</p>
                  {litani.description && (
                    <p className="text-xs text-muted-foreground truncate">{litani.description}</p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => toggleStar(litani.id)}
                aria-label={isStarred ? "Hapus dari favorit" : "Tambah ke favorit"}
                className={`h-11 w-11 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isStarred
                    ? "border-amber-400 bg-amber-50 text-amber-500"
                    : "border-border text-muted-foreground hover:text-amber-500"
                }`}
              >
                <Star className={`h-5 w-5 ${isStarred ? "fill-amber-400 stroke-amber-400" : ""}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
