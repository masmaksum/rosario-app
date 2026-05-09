import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { verifyAdminKey, setAdminKey } from "../lib/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyAdminKey(key);
      setAdminKey(key);
      navigate("/admin/audio");
    } catch {
      setError("Kata sandi salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in px-6 pt-16 pb-24 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h1 className="font-serif-display text-3xl text-center">Admin</h1>
      <p className="text-sm text-muted-foreground text-center mt-2 mb-8">
        Masuk untuk mengelola audio narator
      </p>
      <form onSubmit={onSubmit} className="w-full space-y-4">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Kata sandi admin"
          autoFocus
          className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary text-center tracking-widest text-lg"
        />
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !key}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-50"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
