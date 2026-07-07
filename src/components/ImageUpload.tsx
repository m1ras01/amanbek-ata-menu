"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ошибка загрузки");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-primary">Фото блюда</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-primary/20 bg-cream transition-colors hover:border-gold/50 active:scale-[0.99] disabled:opacity-60"
      >
        {value ? (
          <div>
            <div className="relative aspect-video w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Фото блюда"
                className="h-full w-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>
            {!uploading && (
              <p className="py-2 text-center text-sm font-medium text-accent">
                Нажмите, чтобы сменить фото
              </p>
            )}
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 px-4 py-8">
            <span className="text-4xl">📷</span>
            <span className="text-sm font-semibold text-primary">
              {uploading ? "Загрузка..." : "Выбрать из галереи"}
            </span>
            <span className="text-xs text-primary-muted">
              JPG, PNG до 5 МБ
            </span>
          </div>
        )}
      </button>

      {uploading && value && (
        <p className="mt-2 text-center text-sm text-primary-muted">
          Загрузка...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
