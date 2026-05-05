export default function Home() {
  return (
    <div className="min-h-screen bg-[#06070a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_30%_15%,rgba(130,255,190,0.20)_0%,rgba(255,255,255,0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_75%_30%,rgba(130,170,255,0.16)_0%,rgba(255,255,255,0)_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_80%,rgba(255,190,120,0.10)_0%,rgba(255,255,255,0)_60%)]" />
      <img
        src="/noise.png"
        alt=""
        className="opacity-10 fixed inset-0 size-full z-10 pointer-events-none"
      />

      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md grid place-items-center text-white font-semibold">
            M
          </div>
          <div className="text-white/80 text-sm">
            Minecrafter
            <div className="text-white/50 text-xs">Minecraft moments, archived</div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-white font-semibold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              Your world has stories.
              <span className="block text-white/70">Keep the good ones.</span>
            </h1>
            <p className="mt-4 text-white/65 text-base md:text-lg leading-relaxed max-w-xl">
              Drag screenshots in, and they’re stored in the cloud. Browse them
              fast with low-quality previews, then open full-quality when it
              matters.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="/gallery"
                className="h-12 inline-flex items-center justify-center rounded-full bg-white text-neutral-900 px-6 font-semibold shadow-lg shadow-black/30 hover:scale-[1.01] active:scale-[0.99] transition"
              >
                Go to Gallery
              </a>
              <div className="h-12 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 px-6 backdrop-blur-md">
                Drop files anywhere on the gallery page to upload
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
            <div className="text-white font-semibold">How it works</div>
            <div className="mt-3 grid gap-3">
              {[
                { k: "1", t: "Capture", d: "Take screenshots of your best moments." },
                { k: "2", t: "Drop", d: "Drag & drop multiple images to upload." },
                { k: "3", t: "Relive", d: "Tap to view full-quality in fullscreen." },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/85"
                >
                  <div className="text-xs text-white/50">Step {s.k}</div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-white/65 mt-1">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 text-center text-xs text-white/40">
          Powered by Cloudinary uploads • Built for fast browsing
        </div>
      </div>
    </div>
  );
}
