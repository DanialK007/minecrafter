"use client";
import { useState } from "react";
import { BiEdit, BiUpload } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";

interface UploadImageProps {
  onUpload: (urls: string[]) => void;
}

export default function UploadImage({ onUpload }: UploadImageProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function upload(files: File[]) {
    const list = files.filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;

    setIsUploading(true);

    try {
      const results = await Promise.allSettled(
        list.map(async (file) => {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: form });
          const data = await res.json();
          const fallbackUrl =
            data?.secure_url ||
            data?.url ||
            (data?.data && (data.data.secure_url || data.data.url));
          return fallbackUrl as string | null;
        })
      );

      const newUrls = results
        .filter(
          (r): r is PromiseFulfilledResult<string | null> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value)
        .filter((u): u is string => Boolean(u));

      if (!newUrls.length) return;

      const updatedUrls = [...urls, ...newUrls];
      setUrls(updatedUrls);
      setUploadedUrl(newUrls[newUrls.length - 1]);

      setTimeout(() => {
        onUpload(updatedUrls);
        window.location.reload();
      }, 0);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  }

  function resetCard() {
    setSelectedFiles([]);
    setUploadedUrl(null);
    setIsUploading(false);
  }

  return (
    <div className="w-full mx-auto p-3 rounded-4xl shadow-lg bg-white">
      {!selectedFiles.length && !uploadedUrl && (
        <div className="space-y-3 relative">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!e.dataTransfer.files?.length) return;
              setSelectedFiles(Array.from(e.dataTransfer.files));
            }}
            className="flex flex-col items-center justify-center text-center aspect-video bg-neutral-200 text-neutral-600 font-medium p-4 rounded-3xl border-2 border-dashed border-neutral-400 hover:border-neutral-600 transition cursor-pointer"
          >
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="font-semibold">Drag & Drop image here</span>
              <span className="text-sm opacity-60">or click to browse</span>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  setSelectedFiles(Array.from(e.target.files || []))
                }
              />
            </label>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && !uploadedUrl && (
        <div className="space-y-3">
          <div
            className="relative w-full aspect-video rounded-3xl overflow-hidden group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!e.dataTransfer.files?.length) return;
              setSelectedFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <img
              src={URL.createObjectURL(selectedFiles[0])}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer bg-opacity-50 opacity-0 group-hover:opacity-100 text-white font-semibold transition">
              <BiEdit className="text-xl me-1" /> Change Photo
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  setSelectedFiles(Array.from(e.target.files || []))
                }
              />
            </label>
          </div>
          <button
            className="w-full py-2.5 cursor-pointer bg-neutral-700 text-white rounded-full flex items-center justify-center space-x-2 hover:bg-neutral-800"
            onClick={() => upload(selectedFiles)}
            disabled={isUploading}
          >
            {isUploading ? (
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
            ) : (
              <BiUpload className="text-xl" />
            )}
            <span>
              {isUploading
                ? "Uploading…"
                : `Upload ${selectedFiles.length} Photo${
                    selectedFiles.length === 1 ? "" : "s"
                  }`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
