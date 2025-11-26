"use client";
import { useState } from "react";
import { BiEdit, BiUpload } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";

interface UploadImageProps {
  onUpload: (urls: string[]) => void;
}

export default function UploadImage({ onUpload }: UploadImageProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function upload(file: File) {
    const form = new FormData();
    form.append("file", file);

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      const fallbackUrl =
        data.secure_url ||
        data.url ||
        (data?.data && (data.data.secure_url || data.data.url));

      if (!fallbackUrl) {
        console.error("No URL returned from Cloudinary", data);
        setIsUploading(false);
        return;
      }

      const updatedUrls = [...urls, fallbackUrl];
      setUrls(updatedUrls);
      setUploadedUrl(fallbackUrl);

      // Call parent callback asynchronously and reload page
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
    setSelectedFile(null);
    setUploadedUrl(null);
    setIsUploading(false);
  }

  return (
    <div className="w-full mx-auto p-3 rounded-4xl shadow-lg bg-white">
      {!selectedFile && !uploadedUrl && (
        <div className="space-y-3 relative">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
            className="flex flex-col items-center justify-center text-center aspect-video bg-neutral-200 text-neutral-600 font-medium p-4 rounded-3xl border-2 border-dashed border-neutral-400 hover:border-neutral-600 transition cursor-pointer"
          >
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="font-semibold">Drag & Drop image here</span>
              <span className="text-sm opacity-60">or click to browse</span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files![0])}
              />
            </label>
          </div>
        </div>
      )}

      {selectedFile && !uploadedUrl && (
        <div className="space-y-3">
          <div
            className="relative w-full aspect-video rounded-3xl overflow-hidden group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer bg-opacity-50 opacity-0 group-hover:opacity-100 text-white font-semibold transition">
              <BiEdit className="text-xl me-1" /> Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files![0])}
              />
            </label>
          </div>
          <button
            className="w-full py-2.5 cursor-pointer bg-neutral-700 text-white rounded-full flex items-center justify-center space-x-2 hover:bg-neutral-800"
            onClick={() => upload(selectedFile)}
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
            <span>{isUploading ? "Uploading…" : "Upload Now"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
