import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { getLitaniById } from "../data/litani";
import { useStarredLitani } from "../hooks/useStarredLitani";

function LineBlock({ line }) {
  switch (line.type) {
    case "together":
      return (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-line">
          {line.text}
        </div>
      );

    case "prayer":
      return (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-line italic">
          {line.text}
        </div>
      );

    case "leader":
      return (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-line">
          <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">
            Pemimpin
          </span>
          {line.text}
        </div>
      );

    case "response":
      return (
        <div className="rounded-2xl border border-accent/50 bg-accent/10 p-4 text-sm leading-relaxed whitespace-pre-line">
          <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">
            Umat
          </span>
          {line.text}
        </div>
      );

    case "invocations":
      return (
        <div className="space-y-1">
          {line.items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-sm leading-relaxed">{item}</p>
              <p className="text-sm text-muted-foreground mt-1 italic">{line.response}</p>
            </div>
          ))}
        </div>
      );

    case "invocation":
      return (
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-sm leading-relaxed">{line.text}</p>
          <p className="text-sm text-muted-foreground mt-1 italic">{line.response}</p>
        </div>
      );

    default:
      return null;
  }
}

export default function LitaniDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [starred, toggleStar] = useStarredLitani();
  const litani = getLitaniById(id);
  const isStarred = starred.includes(id);

  if (!litani) {
    return (
      <div className="fade-in px-6 pt-8 pb-24">
        <header className="flex items-center gap-3 mb-6">
          <Link to="/litani" className="h-11 w-11 rounded-full border border-border flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif-display text-3xl">Litani tidak ditemukan</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="fade-in px-6 pt-8 pb-24">
      <header className="flex items-center gap-3 mb-6">
        <Link
          to="/litani"
          className="h-11 w-11 rounded-full border border-border flex items-center justify-center shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Litani
          </p>
          <h1 className="font-serif-display text-2xl mt-0.5 leading-tight">{litani.title}</h1>
        </div>
        <button
          onClick={() => toggleStar(id)}
          aria-label={isStarred ? "Hapus dari favorit" : "Tambah ke favorit"}
          className={`h-11 w-11 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
            isStarred
              ? "border-amber-400 bg-amber-50 text-amber-500"
              : "border-border text-muted-foreground hover:text-amber-500"
          }`}
        >
          <Star className={`h-5 w-5 ${isStarred ? "fill-amber-400 stroke-amber-400" : ""}`} />
        </button>
      </header>

      {litani.description && (
        <p className="text-sm text-muted-foreground mb-4">{litani.description}</p>
      )}

      <div className="space-y-2">
        {litani.lines.map((line, i) => (
          <LineBlock key={i} line={line} />
        ))}
      </div>
    </div>
  );
}
