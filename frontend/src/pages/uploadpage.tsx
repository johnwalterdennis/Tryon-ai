"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFiles = (files?: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleConfirm = async () => {
    if (!file || loading) return;
    setLoading(true);

    try {
      const controller = new AbortController();
      const form = new FormData();
      form.append("file", file, file.name); // key must be "file" to match FastAPI param

      const res = await fetch(
        `http://localhost:8000/upload-selfie/`,
        {
          method: "POST",
          body: form,
          signal: controller.signal,
          // DO NOT set Content-Type; the browser will set the multipart boundary
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }
      
      const data: { filename: string; url: string } = await res.json();
      console.log(res)
      
      const res2 = await fetch(
        `http://localhost:8000/generate-all-premade-outfits`,
        {
          method: "PUT"
        }
      )

      // Hand off to /tryon. You can pass the filename via query or sessionStorage.
      sessionStorage.setItem("tryon:selfieFilename", data.filename);
      sessionStorage.setItem("tryon:selfiePath", data.url); // if you serve it statically
      setOpen(false);

      router.push(`/tryon`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className="sm:max-w-lg bg-white" lock>
          <DialogHeader>
            <DialogTitle>Upload a photo</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Choose a clear, front-facing photo. Good lighting works best.
          </p>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => inputRef.current?.click()}
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center"
            style={loading ? { pointerEvents: "none", opacity: 0.7 } : {}}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-72 w-full rounded-lg object-contain"
              />
            ) : (
              <>
                <div className="mb-2 text-4xl">📷</div>
                <p className="text-sm">
                  Drag and drop an image here, or{" "}
                  <span className="underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, or HEIC up to 10 MB
                </p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
            disabled={loading}
          />

          <div className="mt-4 flex justify-end gap-2" id="Continue button">
            <button
              onClick={handleConfirm}
              disabled={!file || loading}
              className={`rounded-xl px-6 py-3 text-sm text-white transition-all hover:scale-[1.02] hover:cursor-pointer ${
                file && !loading
                  ? "bg-darkpink hover:opacity-90"
                  : "bg-darkpink opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
