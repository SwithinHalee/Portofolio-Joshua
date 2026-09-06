"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKey, SignIn } from "@phosphor-icons/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA] px-6 py-12 text-[#111111]">
      <div className="w-full max-w-sm rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] transition-colors hover:bg-[#F7F6F3]"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={15} weight="bold" />
          </Link>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#F7F6F3] text-[#111111]">
            <LockKey size={16} weight="regular" />
          </div>
        </div>

        <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#616161]">
          System Dossier · Admin
        </p>
        <h1
          className="mb-2 font-serif text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          Studio Access
        </h1>
        <p className="mb-6 font-mono text-xs leading-relaxed text-[#616161]">
          Enter the master password to edit portfolio records across all devices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                Master password
              </span>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] px-3 py-2 font-mono text-sm text-[#111111] placeholder:text-[#B5B5B5] outline-none transition-colors focus:border-[#111111]"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-[4px] border border-[#F3C2C4] bg-[#FDEBEC] px-3 py-2 font-mono text-xs text-[#9F2F2D]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 font-mono text-xs text-white transition-all hover:bg-[#2A2A2A] disabled:opacity-50"
          >
            <SignIn size={14} weight="bold" />
            <span>{loading ? "Authenticating..." : "Unlock Studio"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
