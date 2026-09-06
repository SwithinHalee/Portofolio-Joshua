"use client";

import { useRef, useState } from "react";
import { Check, Upload } from "@phosphor-icons/react";

const MAX_BYTES = 8 * 1024 * 1024;

interface ImageUploadButtonProps {
  onUploaded: (url: string) => void;
}

/** Uploads an image to /api/upload and returns the public URL. */
export function ImageUploadButton({ onUploaded }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setDone(false);
    if (file.size === 0) {
      setError("File kosong.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Maksimal 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          typeof body === "object" && body !== null && "error" in body && typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : "Upload gagal.";
        setError(msg);
        return;
      }
      const url =
        typeof body === "object" && body !== null && "url" in body
          ? String((body as { url: unknown }).url)
          : "";
      if (!url) {
        setError("Server tidak mengembalikan URL.");
        return;
      }
      onUploaded(url);
      setDone(true);
      setTimeout(() => setDone(false), 2400);
    } catch {
      setError("Jaringan gagal, coba lagi.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-3 py-2 font-mono text-xs text-[#111111] transition-all hover:bg-[#F7F6F3] active:scale-[0.98] disabled:opacity-50"
        >
          {done ? (
            <Check size={13} weight="bold" className="text-[#346538]" />
          ) : (
            <Upload size={13} weight="regular" />
          )}
          <span>{busy ? "Uploading…" : done ? "Uploaded" : "Upload"}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          aria-label="Upload image file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      </span>
      {error && <span className="font-mono text-[11px] text-[#9F2F2D]">{error}</span>}
    </span>
  );
}
