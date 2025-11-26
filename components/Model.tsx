"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import UploadImage from "@/components/UploadImage";

function Model() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [model, setModel] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState<boolean>(false);

  return (
    <>
      <div className="fixed z-50 top-3 right-3 md:top-5 md:right-5 bg-white backdrop-blur-lg size-11 rounded-full">
        <button
          className="size-full cursor-pointer rounded-full flex items-center justify-center"
          onClick={() => setModel(!model)}
        >
          <img
            src="icon.png"
            alt=""
            className={`p-1.5 duration-700 ease-out ${
              model && "scale-0 rotate-180"
            }`}
          />
          <div
            className={`text-3xl text-black/70 absolute inset-0 flex items-center justify-center ease-out duration-700 ${
              !model && "scale-0 -rotate-180"
            }`}
          >
            <IoClose />
          </div>
        </button>
      </div>
      <div
        onClick={() => setModel(false)}
        className={`fixed duration-500 inset-0 bg-white/20 z-40 flex items-start justify-end px-5 py-20 backdrop-blur-sm transition-opacity ${
          model ? "" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-end text-black space-y-3"
        >
          <a
            href="#"
            className={`h-11 duration-500 hover:scale-105 flex items-center justify-center rounded-full bg-white ${
              model && !showUpload
                ? "w-32 delay-200"
                : "-translate-y-14 delay-0 blur-lg translate-x-1 w-11 scale-50 text-xs"
            }`}
          >
            Main Page
          </a>
          <a
            href="#"
            className={`h-11 duration-500 delay-100 hover:scale-105 flex items-center justify-center rounded-full bg-white ${
              model && !showUpload
                ? "w-24"
                : "-translate-y-28 blur-lg translate-x-1 w-11 scale-50 text-xs"
            }`}
          >
            Gallery
          </a>
          <button
            onClick={() => setShowUpload(true)}
            className={`h-11 duration-500 hover:scale-105 cursor-pointer flex items-center justify-center rounded-full bg-white ${
              model && !showUpload
                ? "w-36 delay-0"
                : "-translate-y-44 delay-200 blur-lg translate-x-1 w-11 scale-50 text-xs"
            }`}
          >
            Upload Image
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center duration-700 ${
          showUpload ? "" : "pointer-events-none opacity-0 scale-50 ease-out translate-y-full blur-2xl"
        }`}
        onClick={() => setShowUpload(false)}
      >
        <div className="w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
          <UploadImage onUpload={(urls) => setUploadedUrls(urls)} />
        </div>
      </div>
    </>
  );
}

export default Model;
