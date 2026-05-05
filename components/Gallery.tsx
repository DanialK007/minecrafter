"use client";

import { useEffect, useState } from "react";
import Model from "@/components/Model";
import RecentUploads from "@/components/RecentUploads";

export type Photo = { url: string; publicId: string };

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingDrop, setIsUploadingDrop] = useState(false);

  useEffect(() => {
    async function fetchPhotos() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/get-photos");
        const data = await res.json();
        if (data.photos) setPhotos(data.photos);
      } catch (err) {
        console.error("Failed to fetch previous photos", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  async function uploadOne(file: File): Promise<Photo | null> {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    const url =
      data?.secure_url ||
      data?.url ||
      (data?.data && (data.data.secure_url || data.data.url));
    const publicId = data?.public_id || (data?.data && data.data.public_id);

    if (!url || !publicId) return null;
    return { url, publicId };
  }

  async function uploadMany(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;

    setIsUploadingDrop(true);
    try {
      const results = await Promise.allSettled(list.map((f) => uploadOne(f)));
      const added = results
        .filter(
          (r): r is PromiseFulfilledResult<Photo | null> => r.status === "fulfilled"
        )
        .map((r) => r.value)
        .filter((p): p is Photo => Boolean(p));

      if (added.length) setPhotos((prev) => [...added, ...prev]);

      const res = await fetch("/api/get-photos");
      const data = await res.json();
      if (data.photos) setPhotos(data.photos);
    } finally {
      setIsUploadingDrop(false);
    }
  }

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      if (!Array.from(e.dataTransfer.types).includes("Files")) return;
      e.preventDefault();
      setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      if (!e.dataTransfer.files?.length) return;
      e.preventDefault();
      setIsDragging(false);
      void uploadMany(e.dataTransfer.files);
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white/70 relative">
      <Model />
      <RecentUploads photos={photos} setPhotos={setPhotos} isLoading={isLoading} />

      <div
        className={`fixed inset-0 z-40 transition duration-300 ${
          isDragging ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-3xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xl p-8 text-center">
            <div className="text-lg font-semibold text-neutral-900">
              Drop photos to upload
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              Capture the moment. Save it to the cloud.
            </div>
            {isUploadingDrop && (
              <div className="mt-4 text-sm text-neutral-700">Uploading…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

