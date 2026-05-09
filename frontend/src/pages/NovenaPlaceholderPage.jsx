import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

export default function NovenaPlaceholderPage() {
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
          <h1 className="font-serif-display text-3xl mt-0.5">Novena</h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Clock className="h-12 w-12 text-muted-foreground opacity-40" />
        <p className="font-serif-display text-2xl text-muted-foreground">Segera Hadir</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Koleksi doa novena sedang disiapkan dan akan tersedia dalam waktu dekat.
        </p>
      </div>
    </div>
  );
}
