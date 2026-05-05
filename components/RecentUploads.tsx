"use client";

import { useEffect, useMemo, useState } from "react";
import type { Photo } from "@/components/Gallery";
import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { LuLayoutGrid, LuColumns2, LuColumns3, LuColumns4 } from "react-icons/lu";

export default function RecentUploads({
  photos,
  setPhotos,
  isLoading,
}: {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <GallerySkeleton />;
  }
  if (!photos.length) return null;

  const buildCloudinaryUrl = (url: string, transform: string) => {
    // Cloudinary URLs include `/upload/`; we can insert transforms right after it.
    // If the URL isn't a Cloudinary upload URL, fall back to the original.
    const marker = "/upload/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    return `${url.slice(0, idx + marker.length)}${transform}/${url.slice(
      idx + marker.length
    )}`;
  };

  const toThumbUrl = (url: string) =>
    buildCloudinaryUrl(url, "f_auto,q_auto:low,w_700");

  const toFullUrl = (url: string) => buildCloudinaryUrl(url, "f_auto,q_auto");

  const generateBigIndexes = (count: number) => {
    const big = [0];
    const jumps = [7, 5];
    for (let n = 1; n < count; n++) {
      big.push(big[n - 1] + jumps[(n - 1) % 2]);
    }
    return big;
  };

  const patternBig = generateBigIndexes(photos.length);

  return (
    <Gallery
      photos={photos}
      setPhotos={setPhotos}
      patternBig={patternBig}
      toThumbUrl={toThumbUrl}
      toFullUrl={toFullUrl}
    />
  );
}

function GallerySkeleton() {
  return (
    <div className="p-2">
      <div className="h-14 w-full rounded-3xl bg-white/70 border border-white/40 shadow-sm backdrop-blur-md animate-pulse mb-3" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-3xl bg-white/50 border border-white/30 backdrop-blur-md animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function Gallery({
  photos,
  setPhotos,
  patternBig,
  toThumbUrl,
  toFullUrl,
}: {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  patternBig: number[];
  toThumbUrl: (url: string) => string;
  toFullUrl: (url: string) => string;
}) {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [gap, setGap] = useState<2 | 3 | 4>(2);
  const [mosaic, setMosaic] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);

  useEffect(() => {
    if (!activePhoto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhoto(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activePhoto]);

  const shuffled = useMemo(
    () => [...photos].sort(() => Math.random() - 0.5),
    [photos]
  );

  const gridColsClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  const gapClass = gap === 2 ? "gap-2" : gap === 3 ? "gap-3" : "gap-4";

  return (
    <>
      <div className="fixed left-3 bottom-3 z-40">
        <button
          type="button"
          aria-label="Gallery controls"
          onClick={() => setControlsOpen((v) => !v)}
          className={`h-12 w-12 rounded-full border border-white/40 shadow-lg backdrop-blur-md grid place-items-center transition-all duration-200 ${
            controlsOpen
              ? "bg-neutral-900 text-white scale-105"
              : "bg-white/80 text-neutral-900 hover:bg-white"
          }`}
        >
          <LuLayoutGrid className="text-xl" />
        </button>

        <div
          className={`absolute left-0 bottom-14 origin-bottom-left transition-all duration-200 ${
            controlsOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-2 p-2 rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-xl">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-white/40 shadow-sm px-2 py-1">
              <button
                type="button"
                className={`h-9 w-10 rounded-full grid place-items-center transition active:scale-95 ${
                  columns === 2
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-black/5"
                }`}
                aria-label="2 columns"
                onClick={() => setColumns(2)}
              >
                <LuColumns2 />
              </button>
              <button
                type="button"
                className={`h-9 w-10 rounded-full grid place-items-center transition active:scale-95 ${
                  columns === 3
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-black/5"
                }`}
                aria-label="3 columns"
                onClick={() => setColumns(3)}
              >
                <LuColumns3 />
              </button>
              <button
                type="button"
                className={`h-9 w-10 rounded-full grid place-items-center transition active:scale-95 ${
                  columns === 4
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-black/5"
                }`}
                aria-label="4 columns"
                onClick={() => setColumns(4)}
              >
                <LuColumns4 />
              </button>
            </div>

            <button
              type="button"
              className={`h-11 px-4 rounded-full border border-white/40 shadow-sm transition active:scale-95 ${
                mosaic
                  ? "bg-neutral-900 text-white"
                  : "bg-white/70 text-neutral-800 hover:bg-white/90"
              }`}
              onClick={() => setMosaic((v) => !v)}
            >
              Mosaic
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                className={`h-11 px-4 rounded-full border border-white/40 shadow-sm transition active:scale-95 ${
                  gap === 2
                    ? "bg-neutral-900 text-white"
                    : "bg-white/70 text-neutral-800 hover:bg-white/90"
                }`}
                onClick={() => setGap(2)}
              >
                Tight
              </button>
              <button
                type="button"
                className={`h-11 px-4 rounded-full border border-white/40 shadow-sm transition active:scale-95 ${
                  gap === 3
                    ? "bg-neutral-900 text-white"
                    : "bg-white/70 text-neutral-800 hover:bg-white/90"
                }`}
                onClick={() => setGap(3)}
              >
                Med
              </button>
              <button
                type="button"
                className={`h-11 px-4 rounded-full border border-white/40 shadow-sm transition active:scale-95 ${
                  gap === 4
                    ? "bg-neutral-900 text-white"
                    : "bg-white/70 text-neutral-800 hover:bg-white/90"
                }`}
                onClick={() => setGap(4)}
              >
                Loose
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid ${gridColsClass} ${gapClass} p-2`}>
        {shuffled.map((photo, i) => {
          const isBig = mosaic && patternBig.includes(i);
          if (!photo?.url) return null;

          const fullUrl = toFullUrl(photo.url);
          const thumbUrl = toThumbUrl(photo.url);

          return (
            <button
              key={`${photo.publicId}-${i}`}
              type="button"
              className={
                isBig
                  ? "rounded-3xl overflow-hidden md:col-span-2 md:row-span-2 text-left"
                  : "rounded-3xl overflow-hidden text-left"
              }
              onClick={() => {
                // Start fetching the full-quality image ASAP.
                const img = new Image();
                img.src = fullUrl;
                setFullLoaded(false);
                setActivePhoto(photo);
              }}
            >
              <img
                src={thumbUrl}
                alt={`Uploaded ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-bottom hover:scale-110 duration-700 ease-out"
              />
            </button>
          );
        })}
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo viewer"
          onMouseDown={(e) => {
            // Close on backdrop click, but not when clicking the image/container.
            if (e.target === e.currentTarget) setActivePhoto(null);
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 animate-[fadeIn_200ms_ease-out_forwards]" />

          <div className="absolute inset-0 p-4">
            <div className="w-full h-full rounded-3xl bg-black/30 border border-white/10 shadow-2xl overflow-hidden opacity-0 blur-sm scale-[0.98] animate-[modalIn_220ms_ease-out_forwards]">
              <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
                <button
                  type="button"
                  className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md grid place-items-center transition"
                  onClick={() => setActivePhoto(null)}
                  aria-label="Close"
                >
                  <IoClose className="text-2xl" />
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="h-11 w-11 rounded-full bg-white/10 hover:bg-red-500/25 text-white backdrop-blur-md grid place-items-center transition disabled:opacity-60"
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      await fetch("/api/delete-photo", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ publicId: activePhoto.publicId }),
                      });
                      setPhotos((prev) =>
                        prev.filter((p) => p.publicId !== activePhoto.publicId)
                      );
                      setActivePhoto(null);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  aria-label="Delete"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>

              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative w-full h-full flex items-center justify-center">
                  {!fullLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full rounded-2xl bg-white/5 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      </div>
                    </div>
                  )}
                  <img
                    src={toFullUrl(activePhoto.url)}
                    alt="Full quality"
                    className={`max-h-full max-w-full object-contain transition duration-300 ${
                      fullLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    decoding="async"
                    onLoad={() => setFullLoaded(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

